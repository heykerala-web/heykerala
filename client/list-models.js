const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Manually load .env.local
try {
    const envPath = path.join(__dirname, '.env.local');
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        const lines = content.split('\n');
        for (const line of lines) {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const value = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, ''); // Remove quotes if any
                if (key === 'GEMINI_API_KEY') {
                    process.env.GEMINI_API_KEY = value;
                    break;
                }
            }
        }
    }
} catch (e) {
    console.error("Error loading env:", e);
}

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API KEY found in .env.local");
        return;
    }
    console.log("API Key found, length:", apiKey.length);

    try {
        const genAI = new GoogleGenerativeAI(apiKey);

        // Test gemini-1.5-flash
        console.log("Testing gemini-1.5-flash...");
        const modelFlash = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        try {
            const result = await modelFlash.generateContent("Hello");
            console.log("gemini-1.5-flash Success:", result.response.text());
        } catch (e) {
            console.error("gemini-1.5-flash Error:", e.message);
            if (e.response) {
                console.error("gemini-1.5-flash status:", e.response.status);
                console.error("gemini-1.5-flash statusText:", e.response.statusText);
            }
        }

        // Test gemini-pro
        console.log("Testing gemini-pro...");
        const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
        try {
            const result = await modelPro.generateContent("Hello");
            console.log("gemini-pro Success:", result.response.text());
        } catch (e) {
            console.error("gemini-pro Error:", e.message);
            if (e.response) {
                console.error("gemini-pro status:", e.response.status);
                console.error("gemini-pro statusText:", e.response.statusText);
            }
        }

    } catch (error) {
        console.error("Fatal Error:", error);
    }
}

listModels();
