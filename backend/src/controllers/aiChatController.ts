import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Place from "../models/Place";

const getGenAI = () => {
    const API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY;
    return API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
};

// Helper function for exponential backoff
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const callGeminiWithRetry = async (model: any, prompt: string, retries = 3, delay = 1000): Promise<string> => {
    try {
        const result = await model.sendMessage(prompt);
        return result.response.text();
    } catch (error: any) {
        if (retries > 0) {
            // Check for quota/rate limit errors
            const isQuotaError = error.message?.includes("429") ||
                error.message?.includes("RESOURCE_EXHAUSTED") ||
                error.status === 429;

            if (isQuotaError) {
                console.warn(`⚠️ Quota exceeded. Retrying in ${delay}ms... (${retries} retries left)`);
                await wait(delay);
                return callGeminiWithRetry(model, prompt, retries - 1, delay * 2);
            }

            // For other transient errors (503), also retry
            if (error.message?.includes("503") || error.status === 503) {
                console.warn(`⚠️ Service unavailable. Retrying in ${delay}ms... (${retries} retries left)`);
                await wait(delay);
                return callGeminiWithRetry(model, prompt, retries - 1, delay * 2);
            }
        }
        throw error;
    }
};

export const chatWithAI = async (req: Request, res: Response) => {
    try {
        const genAI = getGenAI();
        if (!genAI) {
            console.error("AI Configuration Error: genAI is null");
            return res.status(500).json({ message: "AI is not configured" });
        }

        const { message, history, context } = req.body;
        const { weather, time, location } = context || {};

        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        // Fetch some context about Kerala destinations
        const hotPlaces = await Place.find({ ratingAvg: { $gte: 4.5 } }).limit(5).select("name description district");
        const keralContext = hotPlaces.map(p => `${p.name} in ${p.district}: ${p.description}`).join('\n');

        const modelName = "gemini-2.0-flash";
        // console.log(`🤖 Initializing Chat with Model: ${modelName}`); // Debug log
        const model = genAI.getGenerativeModel({ model: modelName });

        const chat = model.startChat({
            history: history || [],
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        const systemPrompt = `You are "HeyKerala Assistant", a helpful and friendly travel guide for Kerala, India. 
    Current Context:
    - Weather: ${weather || "Pleasant"}
    - Time: ${time || "Daytime"}
    - User Location: ${location || "Kerala"}

    You should use this context to give better advice. For example, if it's raining, suggest indoor activities.
    
    You have knowledge about Kerala's destinations, culture, food, and history.
    Keep your answers concise and engaging. 
    If a user asks about destinations, you can mention these top spots if relevant:
    ${keralContext}
    
    Always promote Kerala tourism in a positive way. Your tone should be welcoming, like a local friend.`;

        const finalPrompt = `Context: ${systemPrompt}\n\nUser Message: ${message}`;

        try {
            // Use retry wrapper
            const responseText = await callGeminiWithRetry(chat, finalPrompt);
            res.status(200).json({ reply: responseText });
        } catch (error: any) {
            console.error("Final Gemini Error after retries:", error.message);

            // Fallback for exhausted quota
            if (error.message?.includes("429") || error.message?.includes("RESOURCE_EXHAUSTED")) {
                return res.json({
                    reply: "I'm currently receiving too many messages and my energy is low. Please give me a minute to recharge! 🌴"
                });
            }

            throw error; // Let outer catch handle other errors
        }

    } catch (error: any) {
        console.error("Chat Controller Error:", error);
        res.status(500).json({ message: "AI error", error: error.message });
    }
};
