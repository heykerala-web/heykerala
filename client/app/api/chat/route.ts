import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const result = await streamText({
      model: openai("gpt-4o-mini"),
      system: `You are a helpful Kerala travel assistant for "Hey Kerala" website. You help users plan trips, recommend places, hotels, and events in Kerala, India. 

Key information about Kerala:
- Known as "God's Own Country"
- Famous for backwaters (Alleppey, Kumarakom), hill stations (Munnar, Wayanad), beaches (Kovalam, Varkala)
- Rich culture with festivals like Onam, art forms like Kathakali and Theyyam
- Cuisine includes seafood, coconut-based dishes, and spices
- Best time to visit: October to March

Be friendly, informative, and focus on Kerala-specific recommendations. Keep responses concise but helpful.`,
      messages,
      maxTokens: 500,
    })

    return result.toAIStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Sorry, I encountered an error. Please try again.", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    })
  }
}
