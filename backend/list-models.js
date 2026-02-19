const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

async function listModels() {
    const API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!API_KEY) {
        console.error("❌ API_KEY or GEMINI_API_KEY not found in .env");
        process.exit(1);
    }

    /* 
       Note: The official SDK currently doesn't expose a direct `listModels` method 
       on the `GoogleGenerativeAI` instance in all versions clearly. 
       However, we can try to infer availability by trying a few known models.
       
       Alternatively, we can use the `getGenerativeModel` and handle errors.
       But let's correct course: The error message said "Call ListModels to see the list".
       That implies an HTTP endpoint.
       
       Let's try a direct fetch to the API endpoint for listing models, 
       just to be 100% sure what the key sees.
    */

    console.log(`Checking API Key: ${API_KEY.substring(0, 5)}...`);
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            const fs = require('fs');
            const output = data.models
                .filter(m => m.supportedGenerationMethods.includes("generateContent"))
                .map(m => `- ${m.name.replace("models/", "")} (${m.displayName})`)
                .join('\n');

            console.log(output);
            fs.writeFileSync('models_list.txt', output);
            console.log("✅ Saved to models_list.txt");
        } else {
            console.log("⚠️ Unexpected response:", data);
        }
    } catch (error) {
        console.error("❌ Network Error:", error.message);
    }
}

listModels();
