
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

export const maxDuration = 60; // Allow longer generation times

// Clean schema
const itinerarySchema = z.object({
    id: z.string(),
    title: z.string(),
    duration: z.string(),
    travelers: z.string(),
    budgetEstimate: z.object({
        min: z.number(),
        max: z.number(),
    }),
    heroImage: z.string(),
    aiReason: z.string(),
    budgetBreakdown: z.object({
        stay: z.number(),
        food: z.number(),
        travel: z.number(),
        tickets: z.number(),
        extras: z.number(),
    }),
    days: z.array(
        z.object({
            day: z.number(),
            theme: z.string(),
            activities: z.array(
                z.object({
                    time: z.string(),
                    name: z.string(),
                    desc: z.string(),
                    image: z.string(),
                    duration: z.string(),
                    cost: z.number(),
                    lat: z.number(),
                    lng: z.number(),
                })
            ),
            mapPolyline: z.array(z.array(z.number())), // [[lat, lng], [lat, lng]]
        })
    ),
    hotels: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            price: z.number(),
            rating: z.number(),
            distanceKm: z.number(),
            image: z.string(),
        })
    ),
});

export async function POST(req: Request) {
    try {
        const { duration, budget, interests, travelers } = await req.json();

        const result = await generateObject({
            model: openai("gpt-4o-mini"),
            schema: itinerarySchema,
            prompt: `Generate a detailed day-by-day travel itinerary for Kerala, India.
      
      User Preferences:
      - Duration: ${duration}
      - Budget Level: ${budget}
      - Group Type: ${travelers}
      - Interests: ${interests.join(", ")}

      Requirements:
      1. Create a title based on the interests.
      2. Provide a realistic budget estimate in INR.
      3. For "mapPolyline", provide strictly [lat, lng] arrays for the route of that day.
      4. Suggest 3 hotels that match the budget.
      5. Include "aiReason" explaining why this plan fits their specific interests.
      6. Use real place names and realistic coordinates for Kerala.
      7. images should be relevant Unsplash URLs (source.unsplash.com/...)
      `,
        });

        return Response.json(result.object);
    } catch (error) {
        console.error("AI Itinerary Error:", error);
        return new Response(JSON.stringify({ error: "Failed to generate plan" }), {
            status: 500,
        });
    }
}
