import { Request, Response } from "express";
import https from "https";
import User from "../models/User";
import Place from "../models/Place";
import Stay from "../models/Stay";
import Event from "../models/Event";
import fs from "fs";

export const generateUserPersona = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id || req.params.userId;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findById(userId)
            .populate('savedPlaces')
            .populate('savedStays')
            .populate('savedEvents');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            console.error("AI Configuration Error: OPENROUTER_API_KEY is missing");
            return res.status(500).json({ message: "OpenRouter API key not configured" });
        }

        // 1. Gather behavioral data
        // We look at what they've saved to understand their interests
        const savedData = [
            ...(user.savedPlaces as any[]).map(p => `Place: ${p.name} (${p.category})`),
            ...(user.savedStays as any[]).map(s => `Stay: ${s.name} (${s.category || s.type})`),
            ...(user.savedEvents as any[]).map(e => `Event: ${e.title} (${e.category})`)
        ];

        // 2. Default Fallback Persona
        // If they have no data or the API times out, they get this default persona
        const fallbackPersona = {
            persona: "The Explorer",
            interests: ["Adventure", "Culture", "Relaxation"]
        };

        if (savedData.length === 0) {
            // Update user with fallback since they have no data
            user.persona = fallbackPersona.persona;
            user.travelInterests = fallbackPersona.interests;
            await user.save();
            return res.status(200).json({
                success: true,
                persona: user.persona,
                interests: user.travelInterests,
                message: "Not enough data to specialize persona yet. Assigned default."
            });
        }

        // 3. Request persona from OpenRouter (Using free Gemini 2.0 Flash)
        const prompt = `
            Based on the following items saved by a user in the HeyKerala tourism app, 
            determine their "Traveler Persona" and a list of specific "Travel Interests".
            
            Saved Items:
            ${savedData.join('\n')}
            
            Persona should be a short, catching title like "The Luxury Backpacker" or "Nature Enthusiast".
            Interests should be 3-5 keywords.
            
            Return ONLY valid JSON:
            {
                "persona": "...",
                "interests": ["...", "..."]
            }
        `.trim();

        const requestBody = JSON.stringify({
            // Using OpenRouter's Gemini 2.0 Flash model (consistent with recommendations)
            model: "google/gemini-2.0-flash-001",
            messages: [
                { role: "system", content: "You are a user profiling system that strictly outputs JSON." },
                { role: "user", content: prompt }
            ],
            max_tokens: 300,
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        const options = {
            hostname: "openrouter.ai",
            path: "/api/v1/chat/completions",
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(requestBody)
            }
        };

        const makeRequest = () => new Promise((resolve, reject) => {
            const apiReq = https.request(options, (apiRes) => {
                let data = "";
                apiRes.on("data", (chunk) => { data += chunk; });
                apiRes.on("end", () => {
                    try {
                        const jsonResponse = JSON.parse(data);
                        resolve({ statusCode: apiRes.statusCode, data: jsonResponse });
                    } catch (e) {
                        reject(new Error("Failed to parse OpenRouter response"));
                    }
                });
            });

            apiReq.on("error", (e) => reject(e));

            // College Project Safety: Set a 10s timeout
            apiReq.setTimeout(10000, () => {
                apiReq.abort();
                reject(new Error("OpenRouter timeout"));
            });

            apiReq.write(requestBody);
            apiReq.end();
        });

        const apiResponse: any = await makeRequest();
        const { statusCode, data } = apiResponse;

        if (statusCode && statusCode >= 400) {
            throw new Error(data.error?.message || data.message || "OpenRouter error");
        }

        const rawContent = data.choices?.[0]?.message?.content;
        if (!rawContent) {
            throw new Error("Invalid response format from OpenRouter");
        }

        // Clean and Parse JSON
        const cleanJson = rawContent.replace(/```json\n?/, '').replace(/\n?```$/, '').trim();
        const analysis = JSON.parse(cleanJson);

        // 4. Update User with AI Persona
        user.persona = analysis.persona;
        user.travelInterests = analysis.interests;
        await user.save();

        res.status(200).json({
            success: true,
            persona: user.persona,
            interests: user.travelInterests
        });

    } catch (error: any) {
        console.error("Persona Generation Error (Using Fallback):", error.message);
        try {
            fs.appendFileSync("error.log", `[${new Date().toISOString()}] AI PERSONA ERROR: ${error.stack || error.message}\n`);
        } catch (e) { }

        // 5. THE MAGIC FALLBACK (College Project Safety Net!)
        // If the API fails or times out, we assign them the fallback persona so the app never crashes!
        try {
            const userId = (req as any).user?.id || req.params.userId;
            const user = await User.findById(userId);
            if (user) {
                user.persona = "The Explorer";
                user.travelInterests = ["Adventure", "Culture", "Relaxation"];
                await user.save();

                return res.status(200).json({
                    success: true,
                    persona: user.persona,
                    interests: user.travelInterests,
                    isFallback: true // Flag so you know it used the safety net
                });
            }
        } catch (fallbackErr) {
            console.error("Even fallback failed:", fallbackErr);
        }

        res.status(500).json({ message: "Failed to generate persona", error: error.message });
    }
};
