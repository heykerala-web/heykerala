import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

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

async function main() {
    const url = await generateImage("Munnar Tea Gardens");
    console.log("Result:", url);
    process.exit(0);
}

main();
