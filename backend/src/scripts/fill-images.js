const mongoose = require("mongoose");
require("dotenv").config();

async function generateImage(placeName) {
    const key = process.env.OPENAI_API_KEY === "your_openai_api_key" ? process.env.OPENROUTER_API_KEY : process.env.OPENAI_API_KEY;
    if (!key || key.includes("your_")) {
        console.error("❌ No valid API key found. Please update OPENAI_API_KEY or OPENROUTER_API_KEY in .env");
        return null;
    }

    const isOpenRouter = process.env.OPENROUTER_API_KEY === key;
    const url = isOpenRouter ? "https://openrouter.ai/api/v1/images/generations" : "https://api.openai.com/v1/images/generations";
    const model = isOpenRouter ? "openai/dall-e-3" : "dall-e-3";

    console.log(`🎨 Requesting image for: ${placeName} via ${isOpenRouter ? "OpenRouter" : "OpenAI"}...`);
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${key}`
            },
            body: JSON.stringify({
                model: model,
                prompt: `Cinematic tourism photo of ${placeName} in Kerala`,
                n: 1,
                size: "1024x1024"
            })
        });

        const data = await response.json();
        if (!response.ok) {
            console.error(`❌ API Error (${response.status}):`, JSON.stringify(data, null, 2));
            return null;
        }

        return data.data?.[0]?.url || null;
    } catch (e) {
        console.error("❌ Network Error:", e.message);
        return null;
    }
}

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB.");

        const Place = mongoose.models.Place || mongoose.model("Place", new mongoose.Schema({
            name: String, image: String, images: [String]
        }));

        const place = await Place.findOne({ $or: [{ image: null }, { image: "" }] });
        if (!place) {
            console.log("No place missing images found.");
            await mongoose.disconnect();
            process.exit(0);
        }

        const url = await generateImage(place.name);
        if (url) {
            console.log("✅ Success! Image URL: " + url.substring(0, 50) + "...");
            place.image = url;
            place.images = place.images || [];
            place.images.push(url);
            await place.save();
            console.log("💾 Database updated.");
        }

        await mongoose.disconnect();
        console.log("Done.");
        process.exit(0);
    } catch (e) {
        console.error("❌ Execution Error:", e);
        process.exit(1);
    }
}

main();
