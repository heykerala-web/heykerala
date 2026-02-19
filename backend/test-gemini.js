
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
    const API_KEY = process.env.GEMINI_API_KEY;
    console.log("Checking available models...");

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log("Valid Models:");
            data.models.forEach(m => console.log(m.name.replace('models/', '')));
        } else {
            console.log("Error:", data);
        }
    } catch (e) {
        console.error("Fetch error:", e.message);
    }
}

testGemini();
