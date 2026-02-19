import { Request, Response } from "express";
import User from "../models/User";
import Place from "../models/Place";
import Stay from "../models/Stay";
import Event from "../models/Event";
import { GoogleGenerativeAI } from "@google/generative-ai";

const getGenAI = () => {
    const API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY;
    return API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
};

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

        const genAI = getGenAI();
        if (!genAI) {
            return res.status(500).json({ message: "AI is not configured" });
        }

        // 1. Gather behavioral data
        // We look at what they've saved to understand their interests
        const savedData = [
            ...(user.savedPlaces as any[]).map(p => `Place: ${p.name} (${p.category})`),
            ...(user.savedStays as any[]).map(s => `Stay: ${s.name} (${s.category || s.type})`),
            ...(user.savedEvents as any[]).map(e => `Event: ${e.title} (${e.category})`)
        ];

        if (savedData.length === 0) {
            return res.status(200).json({
                persona: "Curious Explorer",
                interests: ["General Interest"],
                message: "Not enough data to specialize persona yet."
            });
        }

        // 2. Request persona from Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
            Based on the following items saved by a user in the HeyKerala tourism app, 
            determine their "Traveler Persona" and a list of specific "Travel Interests".
            
            Saved Items:
            ${savedData.join('\n')}
            
            Persona should be a short, catch title like "The Luxury Backpacker" or "Nature Enthusiast".
            Interests should be 3-5 keywords.
            
            Return ONLY valid JSON:
            {
                "persona": "...",
                "interests": ["...", "..."]
            }
        `.trim();

        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();
        const cleanJson = responseText.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
        const analysis = JSON.parse(cleanJson);

        // 3. Update User
        user.persona = analysis.persona;
        user.travelInterests = analysis.interests;
        await user.save();

        res.status(200).json({
            success: true,
            persona: user.persona,
            interests: user.travelInterests
        });

    } catch (error: any) {
        console.error("Persona Generation Error:", error);
        res.status(500).json({ message: "Failed to generate persona", error: error.message });
    }
};
