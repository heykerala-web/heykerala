
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, ".env") });

const API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("❌ API_KEY or GEMINI_API_KEY not found in environment variables.");
    process.exit(1);
}

// const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
    try {
        console.log("Fetching models...");
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

        // Use dynamic import for node-fetch as it is ESM only in newer versions, 
        // or just use global fetch if node version is >= 18.
        // Let's assume node-fetch or global fetch. 
        // If node version is old, we might need axios or https.
        // "node-fetch": "^3.3.2" is in package.json, which is ESM only.
        // But we are in a commonjs file here. 
        // We can try using the native fetch if Node 18+, else dynamic import.

        let fetchFn = global.fetch;
        if (!fetchFn) {
            const fetchModule = await import("node-fetch");
            fetchFn = fetchModule.default;
        }

        const response = await fetchFn(url);
        const data = await response.json();

        if (data.models) {
            console.log("✅ Available Models:");
            data.models.forEach((m) => {
                console.log(`- ${m.name} (${m.displayName})`);
                console.log(`  Methods: ${m.supportedGenerationMethods}`);
            });
        } else {
            console.error("❌ Failed to list models. Response:", JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error("❌ Error listing models:", error);
    }
}

listModels();
