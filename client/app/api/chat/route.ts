import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  try {
    const { history, message, context } = await req.json()

    // Convert Google-style history to Vercel AI SDK CoreMessage format
    const coreMessages = history.map((msg: any) => ({
      role: msg.role === "model" ? "assistant" : "user",
      content: msg.parts[0].text
    }));

    // Add current context to system prompt
    const systemPrompt = `You are a helpful Kerala travel assistant for "Hey Kerala" website. You help users plan trips, recommend places, hotels, and events in Kerala, India. 

Key information about Kerala:
- Known as "God's Own Country"
- Famous for backwaters (Alleppey, Kumarakom), hill stations (Munnar, Wayanad), beaches (Kovalam, Varkala)
- Rich culture with festivals like Onam, art forms like Kathakali and Theyyam
- Cuisine includes seafood, coconut-based dishes, and spices
- Best time to visit: October to March

Current Context:
Time: ${context?.time || "Unknown"}
Location: ${context?.location || "Kerala"}
Weather: ${context?.weather || "Unknown"}

Be friendly, informative, and focus on Kerala-specific recommendations. Keep responses concise but helpful.`;

    const result = await generateText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      messages: coreMessages,
    })

    return Response.json({ reply: result.text })
  } catch (error: any) {
    console.error("Chat API error:", error)

    // Check for API key issues
    const errorMessage = error.message || "Unknown error";
    const isApiKeyError = errorMessage.includes("API key");

    return new Response(
      JSON.stringify({
        error: "Server Error",
        details: isApiKeyError ? "Missing or invalid API Key" : errorMessage,
        reply: null // Ensure client handles this gracefully
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}
