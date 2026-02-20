import dotenv from "dotenv";

dotenv.config();

/**
 * Generates a tourism-style AI image for a given place name using direct fetch to OpenAI API.
 * This bypasses the OpenAI SDK to avoid low-level crashes on some environments.
 */
export async function generateTourismImage(placeName: string): Promise<string | null> {
    const prompt = `Cinematic tourism photo of ${placeName} in Kerala`;

    try {
        const envOpenAIKey = process.env.OPENAI_API_KEY;
        const envORKey = process.env.OPENROUTER_API_KEY;

        const apiKey = envOpenAIKey === "your_openai_api_key" ? undefined : envOpenAIKey;
        const orKey = envORKey;

        const key = apiKey || orKey;

        if (!key) {
            console.error("❌ No API key found. Set OPENAI_API_KEY or OPENROUTER_API_KEY in .env");
            return null;
        }

        const isOpenRouter = !!(orKey && !apiKey);
        const url = isOpenRouter ? "https://openrouter.ai/api/v1/images/generations" : "https://api.openai.com/v1/images/generations";
        const model = isOpenRouter ? "openai/dall-e-3" : "dall-e-3";

        console.log(`🎨 Generating image for: ${placeName} using ${isOpenRouter ? "OpenRouter" : "OpenAI"}...`);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${key}`
            },
            body: JSON.stringify({
                model: model,
                prompt: prompt,
                n: 1,
                size: "1024x1024",
                quality: "hd"
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(`❌ API Error (${response.status}):`, errorData);
            return null;
        }

        const data: any = await response.json();
        const imageUrl = data.data?.[0]?.url;

        return imageUrl || null;
    } catch (error: any) {
        console.error(`❌ Image Generation Error for ${placeName}:`, error.message);
        return null;
    }
}
