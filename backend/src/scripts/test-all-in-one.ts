import dotenv from "dotenv";
import mongoose from "mongoose";
import OpenAI from "openai";

dotenv.config();

// --- DB Config ---
const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI not found");
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
};

// --- Model ---
const placeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String },
    images: [{ type: String }],
    status: { type: String }
}, { timestamps: true });
const Place = mongoose.models.Place || mongoose.model("Place", placeSchema);

// --- Utility ---
async function generateImage(placeName: string) {
    const envOpenAIKey = process.env.OPENAI_API_KEY;
    const envORKey = process.env.OPENROUTER_API_KEY;
    const apiKey = envOpenAIKey === "your_openai_api_key" ? undefined : envOpenAIKey;
    const key = apiKey || envORKey;

    if (!key) {
        console.error("❌ No API key found");
        return null;
    }

    const client = new OpenAI({
        apiKey: key,
        baseURL: (envORKey && !apiKey) ? "https://openrouter.ai/api/v1" : undefined,
    });

    try {
        console.log(`🎨 Generating image for: ${placeName}...`);
        const response = await client.images.generate({
            model: "dall-e-3",
            prompt: `Cinematic tourism photo of ${placeName} in Kerala`,
            n: 1,
            size: "1024x1024"
        });
        return response.data[0]?.url || null;
    } catch (err: any) {
        console.error(`❌ Gen Error: ${err.message}`);
        return null;
    }
}

// --- Main ---
async function main() {
    try {
        await connectDB();
        const place = await Place.findOne({
            $or: [
                { image: { $exists: false } },
                { image: "" },
                { image: null },
                { images: { $size: 0 } }
            ]
        });

        if (!place) {
            console.log("No place found missing image.");
            process.exit(0);
        }

        console.log(`🔹 Testing with: ${place.name}`);
        const url = await generateImage(place.name);

        if (url) {
            console.log(`✅ Success: ${url.substring(0, 50)}...`);
            place.image = url;
            if (!place.images) place.images = [];
            place.images.push(url);
            await place.save();
            console.log("💾 Saved.");
        }

        process.exit(0);
    } catch (err: any) {
        console.error("❌ Error:", err.message);
        process.exit(1);
    }
}

main();
