import { GoogleGenerativeAI } from "@google/generative-ai";

const getGenAI = () => {
    const API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY;
    return API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
};

/**
 * Generates an embedding for a given text using Gemini.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    const genAI = getGenAI();
    if (!genAI) {
        throw new Error("AI is not configured for embeddings. Check your .env file for GEMINI_API_KEY.");
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
        const result = await model.embedContent(text);
        return result.embedding.values;
    } catch (error: any) {
        console.error("Embedding Generation Error:", error);
        return [];
    }
}

/**
 * Formats a Place object into a descriptive string for embedding.
 */
export function formatPlaceForEmbedding(place: any): string {
    return `
    Place: ${place.name}
    Category: ${place.category}
    District: ${place.district}
    Description: ${place.description}
    Highlights: ${place.highlights?.join(", ")}
    Tags: ${place.tags?.join(", ")}
  `.trim();
}
