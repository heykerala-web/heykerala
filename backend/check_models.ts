
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, ".env") });

const API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("❌ API_KEY or GEMINI_API_KEY not found in environment variables.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
    try {
        // For listing models, we can't directly use the client in the same way as the python SDK sometimes.
        // But verify if the SDK supports listModels. 
        // Actually, check documentation or just try a simple verify with a known model like gemini-pro.
        // The node SDK usually doesn't have a direct 'listModels' method exposed on the main class in older versions, 
        // but let's check if we can just try to instantiate a few common ones and see if they start a chat without error (or just use the error message from the user which suggested calling ListModels).

        // As of recent versions, there might not fit a clean listModels helper in the node SDK top level export 
        // that matches the REST API 'identifiers'.
        // However, we can try to inspect the response of a simple model request or use the REST API manually if SDK fails.

        // Let's try the REST API directly to be sure, as it is the most reliable source of truth for "ListModels".

        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log("✅ Available Models:");
            data.models.forEach((m: any) => {
                console.log(`- ${m.name} (${m.displayName}) - Supported generation methods: ${m.supportedGenerationMethods}`);
            });
        } else {
            console.error("❌ Failed to list models:", data);
        }

    } catch (error) {
        console.error("❌ Error listing models:", error);
    }
}

listModels();
