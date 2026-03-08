import { Request, Response } from 'express';
import https from 'https';
import Place from '../models/Place';
import { createManualItinerary } from './itineraryManualController';

// Helper to generate hotels (same as manual)
function generateHotels(centerLat: number, centerLng: number, budget: string) {
    const hotelNames = [
        "Green View Resort", "Kerala Heritage Hotel", "Backwater Paradise",
        "Hill Station Retreat", "Coastal Breeze Hotel", "Nature's Nest",
        "Royal Kerala Inn", "Serenity Stay"
    ];

    const priceMap: { [key: string]: { min: number; max: number } } = {
        "Budget": { min: 800, max: 1500 },
        "Mid-range": { min: 1500, max: 3000 },
        "Luxury": { min: 3000, max: 8000 }
    };

    const prices = priceMap[budget] || priceMap["Mid-range"];

    return Array.from({ length: 3 }, (_, i) => {
        const price = Math.floor(Math.random() * (prices.max - prices.min) + prices.min);
        const rating = 3.5 + Math.random() * 1.5;
        const distance = Math.random() * 5 + 0.5;

        return {
            id: `h${i + 1}`,
            name: hotelNames[Math.floor(Math.random() * hotelNames.length)],
            price: price,
            rating: parseFloat(rating.toFixed(1)),
            distanceKm: parseFloat(distance.toFixed(1)),
            image: "/stay/green-gates-hotel.jpg"
        };
    });
}

const callOpenRouter = (prompt: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) return reject(new Error("OPENROUTER_API_KEY not configured"));

        const requestBody = JSON.stringify({
            model: "openai/gpt-4o-mini", // Upgraded for better instruction following
            messages: [
                { role: "system", content: "You are an expert Kerala travel planner. You strictly follow district boundaries." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.1 // Lowered for better compliance
        });

        const options = {
            hostname: "openrouter.ai",
            path: "/api/v1/chat/completions",
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(requestBody)
            }
        };

        const req = https.request(options, (res) => {
            let data = "";
            res.on("data", (chunk) => data += chunk);
            res.on("end", () => {
                try {
                    const json = JSON.parse(data);
                    if (res.statusCode && res.statusCode >= 400) {
                        reject(new Error(json.error?.message || "OpenRouter error"));
                    } else {
                        resolve(json);
                    }
                } catch (e) {
                    reject(new Error("Failed to parse OpenRouter response"));
                }
            });
        });

        req.on("error", (e) => reject(e));
        req.setTimeout(45000, () => {
            req.abort();
            reject(new Error("OpenRouter timeout"));
        });
        req.write(requestBody);
        req.end();
    });
};

export const generateAIPlan = async (req: Request, res: Response) => {
    try {
        const { duration, budget, interests, travelers, districts, customPreference } = req.body;

        if (!duration || !budget || !interests || !travelers) {
            return res.status(400).json({ message: "Missing required fields: duration, budget, interests, travelers." });
        }

        console.log(`[AI Planner] Processing request: Districts=${districts?.join(', ')}, Interests=${interests?.join(', ')}`);

        // Category mapping to match DB
        const interestMap: { [key: string]: string[] } = {
            "Beach": ["Beach"],
            "Hill Station": ["Hill Station"],
            "Waterfall": ["Nature"], // Waterfalls are categorized as Nature in current DB
            "Nature": ["Nature"],
            "Heritage": ["Heritage", "Culture", "History"],
            "Wildlife": ["Wildlife"]
        };

        const dbCategories: string[] = [];
        interests.forEach((i: string) => {
            if (interestMap[i]) dbCategories.push(...interestMap[i]);
            else dbCategories.push(i);
        });

        // 1. Fetch relevant places from MongoDB
        const query: any = { status: 'approved' };
        if (districts && districts.length > 0) {
            const districtRegexes = districts.map((d: string) => new RegExp(`^${d}$`, 'i'));
            query.district = { $in: districtRegexes };
        }
        if (dbCategories.length > 0) {
            const categoryRegexes = dbCategories.map((c: string) => new RegExp(`^${c}$`, 'i'));
            query.category = { $in: categoryRegexes };
        }

        let relevantPlaces = await Place.find(query)
            .select('name district category ratingAvg description latitude longitude')
            .sort({ ratingAvg: -1 })
            .limit(100);

        // Fallback: If no places found with specific categories, pull by district only
        if (relevantPlaces.length < 10 && districts && districts.length > 0) {
            console.log(`[AI Planner] Loosening category constraints for ${districts.join(', ')}`);
            const districtRegexes = districts.map((d: string) => new RegExp(`^${d}$`, 'i'));
            relevantPlaces = await Place.find({ status: 'approved', district: { $in: districtRegexes } })
                .select('name district category ratingAvg description latitude longitude')
                .sort({ ratingAvg: -1 })
                .limit(100);
        }

        // If we still didn't find *any* places for the selected districts, we MUST not proceed 
        // to hallucinate. Pass the raw body directly to the manual controller which handles static fallbacks strictly.
        if (relevantPlaces.length === 0) {
            console.log("[AI Planner] No places found in DB, falling back to manual...");
            const manualPlan = await createManualItinerary(req.body);
            return res.status(200).json(manualPlan);
        }

        const placesContext = relevantPlaces.map(p =>
            `- ${p.name} (District: ${p.district}, Category: ${p.category}, Rating: ${p.ratingAvg}, Lat: ${p.latitude}, Lng: ${p.longitude}): ${p.description.substring(0, 100)}...`
        ).join('\n');

        // Parse duration
        let daysCount = 3;
        if (typeof duration === 'string') {
            const match = duration.match(/(\d+)/);
            if (match) daysCount = parseInt(match[1]);
        } else {
            daysCount = parseInt(duration) || 3;
        }

        const prompt = `Generate a structured ${daysCount}-day travel itinerary for Kerala.
User Inputs:
- Selected Districts (STRICT): ${districts?.join(', ') || 'Any in Kerala'} 
- Traveler Type: ${travelers}
- Budget: ${budget}
- Interests: ${interests.join(', ')}
- Custom Preference: ${customPreference || 'None'}

Available Places Context (ONLY use places from this list):
${placesContext}

STRICT INSTRUCTIONS:
1. ONLY use the provided places. DO NOT hallucinate places from other districts or use places not explicitly listed in the Available Places Context.
2. If "Selected Districts" is ${districts?.join(', ')}, then DO NOT include places from Kochi, Trivandrum, or Munnar UNLESS they are in that list or present in the Available Places Context. Make absolutely sure the name of the place directly matches the context.
3. Distribute the provided places logically across the ${daysCount} days (e.g., 2-4 activities per day). Do not leave days empty. Focus strongly on geographic proximity for each day's plan.
4. Return ONLY valid JSON:
{
  "title": "Title",
  "aiReason": "Explain how this fits the selected districts, interests, and preferences.",
  "days": [
    {
      "day": 1,
      "activities": [
        { "time": "09:00", "name": "Exact Name from List", "desc": "description", "lat": 10.0, "lng": 76.0, "duration": "2h", "cost": 0, "image": "/places/default.jpg" }
      ]
    }
  ],
  "budgetEstimates": { "min": 0, "max": 0 }
}`;

        try {
            const aiResponse = await callOpenRouter(prompt);
            const aiData = JSON.parse(aiResponse.choices[0].message.content);

            // POST-FILTERing: Ensure no hallucinations made it through
            if (districts && districts.length > 0) {
                aiData.days.forEach((day: any) => {
                    day.activities = day.activities.filter((act: any) => {
                        return relevantPlaces.some(p =>
                            p.name.toLowerCase().includes(act.name.toLowerCase()) ||
                            act.name.toLowerCase().includes(p.name.toLowerCase())
                        );
                    });
                });
            }

            // Process days and add polyline
            const processedDays = aiData.days.map((day: any) => ({
                ...day,
                mapPolyline: day.activities.map((a: any) => [a.lat, a.lng])
            }));

            const firstAct = processedDays[0]?.activities[0];
            const hotels = generateHotels(firstAct?.lat || 10.8505, firstAct?.lng || 76.2711, budget);

            const budgetRanks: any = { "Budget": 1, "Mid-range": 2, "Luxury": 3 };
            const rank = budgetRanks[budget] || 2;
            const dailyAllowance = rank * 2000;
            const budgetBreakdown = {
                stay: hotels[0].price * daysCount,
                food: dailyAllowance * daysCount * 0.4,
                travel: dailyAllowance * daysCount * 0.3,
                tickets: dailyAllowance * daysCount * 0.2,
                extras: dailyAllowance * daysCount * 0.1
            };
            const total = Object.values(budgetBreakdown).reduce((a, b) => a + (b as number), 0);

            const itinerary = {
                id: `itn_${Date.now()}`,
                title: aiData.title,
                duration: daysCount,
                travelers: travelers,
                budgetEstimate: { min: Math.round(total * 0.9), max: Math.round(total * 1.1) },
                heroImage: relevantPlaces[0]?.image || "/places/munnar-teagardens.jpg",
                aiReason: aiData.aiReason,
                days: processedDays,
                hotels: hotels,
                budgetBreakdown: budgetBreakdown
            };

            return res.status(200).json(itinerary);

        } catch (aiErr: any) {
            console.error("AI Error:", aiErr.message);
            const manualPlan = await createManualItinerary(req.body);
            manualPlan.aiReason = "AI generation failed, providing a curated manual plan instead.";
            return res.status(200).json(manualPlan);
        }

    } catch (error: any) {
        console.error("Controller Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};