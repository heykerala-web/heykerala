// @ts-nocheck
import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import AIRecommendCache from "../models/AIRecommendCache";
import https from "https";
import fs from "fs";

export const getRecommendations = async (req: AuthRequest, res: Response) => {
    try {
        const { weather } = req.query; // e.g. "Rainy", "Sunny", "Hot"
        const category = (req.query.category as string) || "General";
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            console.error("AI Configuration Error: OPENROUTER_API_KEY is missing");
            return res.status(500).json({ message: "OpenRouter API key not configured" });
        }

        // 1. Check Cache
        const cacheKey = `${category}-${weather || "General"}`;
        const cached = await AIRecommendCache.findOne({ category: cacheKey });

        if (cached) {
            return res.status(200).json(cached.result);
        }

        // 2. Call OpenRouter
        // Updated prompt to ask for an object (better for JSON mode)
        const prompt = `
        Recommend 5 unique travel destinations in Kerala, India for this context:
        Category: ${category}
        Weather: ${weather || "Any"}

        Respond strictly with a JSON object in this format:
        {
          "recommendations": [
            {
                "_id": "placeholder_id", 
                "name": "Place Name",
                "category": "Category",
                "district": "District",
                "image": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1000&auto=format&fit=crop",
                "ratingAvg": 4.8
            }
          ]
        }
        Do not include any other text or explanation.
        `;

        const requestBody = JSON.stringify({
            model: "google/gemini-2.0-flash-001",
            messages: [
                { role: "system", content: "You are a Kerala tourism expert. You strictly output JSON objects containing travel recommendations." },
                { role: "user", content: prompt }
            ],
            max_tokens: 1000, // Increased to avoid truncation
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
                        reject(new Error("Failed to parse OpenRouter response: " + data.substring(0, 100)));
                    }
                });
            });

            apiReq.on("error", (e) => { reject(e); });
            apiReq.write(requestBody);
            apiReq.end();
        });

        const apiResponse: any = await makeRequest();
        const { statusCode, data } = apiResponse;

        if (statusCode && statusCode >= 400) {
            console.error("OpenRouter Recommendation API Error:", JSON.stringify(data, null, 2));
            return res.status(statusCode).json({
                message: "AI recommendation error",
                realError: data.error?.message || data.message || "Unknown OpenRouter error"
            });
        }

        const rawContent = data.choices?.[0]?.message?.content;
        if (!rawContent) {
            throw new Error("Invalid response format from OpenRouter (no content)");
        }

        let recommendations = [];
        try {
            // Clean up markdown if present (though json_object should prevent it)
            const jsonStr = rawContent.replace(/```json|```/g, "").trim();
            const parsed = JSON.parse(jsonStr);

            // Extract array from object
            if (Array.isArray(parsed)) {
                recommendations = parsed;
            } else if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
                recommendations = parsed.recommendations;
            } else if (parsed.destinations && Array.isArray(parsed.destinations)) {
                recommendations = parsed.destinations;
            } else {
                // Fallback: search for any array value
                const firstArray = Object.values(parsed).find(v => Array.isArray(v));
                if (firstArray) {
                    recommendations = firstArray as any[];
                } else {
                    throw new Error("Could not find recommendations array in response");
                }
            }

            // Ensure items have IDs
            recommendations = recommendations.map((item, idx) => ({
                ...item,
                _id: item._id || `ai_${Date.now()}_${idx}`
            }));

        } catch (e) {
            console.error("Failed to parse recommendations JSON:", rawContent);
            return res.status(500).json({
                message: "AI generation failed to produce valid JSON",
                detail: rawContent,
                error: (e as Error).message
            });
        }

        // 3. Save to Cache
        await AIRecommendCache.findOneAndUpdate(
            { category: cacheKey },
            { result: recommendations },
            { upsert: true, new: true }
        );

        res.status(200).json(recommendations);

    } catch (error: any) {
        console.error("AI Recommendation Error:", error);
        try {
            fs.appendFileSync("error.log", `[${new Date().toISOString()}] REC-ERROR: ${error.stack || error.message}\n`);
        } catch (e) { }

        res.status(500).json({ message: "Failed to fetch recommendations", error: error.message });
    }
};
