import { Request, Response } from "express";
import Review from "../models/Review";
import { GoogleGenerativeAI } from "@google/generative-ai";

const getGenAI = () => {
    const API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY;
    return API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
};

export const summarizeReviews = async (req: Request, res: Response) => {
    try {
        const { targetId } = req.params;

        const genAI = getGenAI();
        if (!genAI) {
            return res.status(500).json({ message: "AI is not configured" });
        }

        // 1. Fetch recent reviews for the target
        const reviews = await Review.find({ targetId }).sort({ createdAt: -1 }).limit(20);

        if (reviews.length === 0) {
            return res.status(200).json({ summary: "No reviews yet to analyze." });
        }

        const reviewsText = reviews.map(r => `- ${r.comment}`).join('\n');

        // 2. Request summary from Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
      Analyze these user reviews for a destination in Kerala and provide a structured JSON summary.
      
      Reviews:
      ${reviewsText}
      
      Return ONLY valid JSON with this structure:
      {
        "sentimentScore": number (0-100),
        "pros": ["bullet 1", "bullet 2", "bullet 3"],
        "cons": ["bullet 1", "bullet 2", "bullet 3"],
        "overallVibe": "1 sentence description"
      }
    `.trim();

        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();

        // Clean JSON from potential markdown blocks
        const cleanJson = responseText.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
        const summary = JSON.parse(cleanJson);

        res.status(200).json(summary);
    } catch (error: any) {
        console.error("Review Summary AI Error:", error);
        res.status(500).json({ message: "Failed to summarize reviews", error: error.message });
    }
};
