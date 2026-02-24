import { Request, Response } from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { KERALA_PLACES } from '../seed/places';
import Place from '../models/Place';
import { createManualItinerary } from './itineraryManualController';

const getGenAI = () => {
    const API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY;
    return API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
};

// Helper to generate hotels (same as manual)
function generateHotels(centerLat: number, centerLng: number, budget: string) {
    const hotelNames = [
        "Green View Resort",
        "Kerala Heritage Hotel",
        "Backwater Paradise",
        "Hill Station Retreat",
        "Coastal Breeze Hotel",
        "Nature's Nest",
        "Royal Kerala Inn",
        "Serenity Stay"
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

export const generateAIPlan = async (req: Request, res: Response) => {
    try {
        const { duration, budget, interests, travelers } = req.body;

        if (!duration || !budget || !interests || !travelers) {
            return res.status(400).json({ message: "Missing required fields: duration, budget, interests, travelers." });
        }

        const genAI = getGenAI();
        // If AI not configured, fall back immediately
        if (!genAI) {
            console.warn("AI not configured, falling back to manual plan.");
            const manualPlan = createManualItinerary(req.body);
            return res.status(200).json(manualPlan);
        }

        // Parse duration
        let daysCount = 3;
        if (typeof duration === 'string') {
            const match = duration.match(/(\d+)/);
            if (match) {
                daysCount = parseInt(match[1]);
            }
        } else {
            daysCount = parseInt(duration) || 3;
        }

        try {
            // Get relevant places for context
            const interestMap: { [key: string]: string[] } = {
                "Backwaters": ["backwaters", "houseboat"],
                "Beaches": ["beaches"],
                "Hill Stations": ["hill-station", "tea"],
                "Culture & Heritage": ["culture", "history"],
                "Wildlife": ["wildlife"],
                "Adventure Sports": ["adventure"]
            };

            const searchTags: string[] = [];
            interests.forEach((interest: string) => {
                if (interestMap[interest]) {
                    searchTags.push(...interestMap[interest]);
                } else {
                    searchTags.push(interest.toLowerCase());
                }
            });

            // Try to fetch from database first
            let relevantPlaces: any[] = [];
            try {
                relevantPlaces = await Place.find({
                    $or: [
                        { category: { $in: interests } },
                        { tags: { $in: searchTags } }
                    ],
                    status: 'approved'
                }).limit(15);
            } catch (dbError) {
                console.error("Database fetch failed for AI context, falling back to static data:", dbError);
            }

            // Map database fields to the structure AI expects
            let contextPlaces = relevantPlaces.map(p => ({
                name: p.name,
                lat: p.latitude || p.lat,
                lng: p.longitude || p.lng,
                description: p.description,
                tags: p.tags
            }));

            // If no places found in DB or DB failed, use static KERALA_PLACES
            if (contextPlaces.length === 0) {
                // console.log("No approved places found in DB, using static data for AI context.");
                contextPlaces = KERALA_PLACES.filter((place) =>
                    place.tags.some((tag) => searchTags.some(st => tag.toLowerCase().includes(st.toLowerCase())))
                ).slice(0, 10);
            }

            const placesContext = contextPlaces.map(p =>
                `${p.name} (${p.lat}, ${p.lng}): ${p.description}`
            ).join('\n');

            const prompt = `You are a travel expert creating a personalized Kerala itinerary. Return ONLY valid JSON, no markdown, no code blocks.

Trip Details:
- Duration: ${daysCount} days
- Budget: ${budget}
- Travelers: ${travelers}
- Interests: ${interests.join(', ')}

Available Places (use these coordinates if possible, otherwise use known coordinates in Kerala):
${placesContext}

Return this EXACT JSON structure:
{
  "title": "string (e.g., '3-Day Kerala Adventure')",
  "aiReason": "string (explain why this itinerary fits their preferences)",
  "days": [
    {
      "day": 1,
      "activities": [
        {
          "time": "08:00",
          "name": "Place name",
          "desc": "Brief description",
          "lat": number,
          "lng": number,
          "image": "/places/munnar-teagardens.jpg",
          "duration": "2h",
          "cost": 100
        }
      ]
    }
  ]
}

Requirements:
- Create ${daysCount} days
- 3-4 activities per day with times (08:00, 11:00, 14:00, 17:00)
- Include mapPolyline array in each day: [[lat1, lng1], [lat2, lng2], ...]
- Make it geographically logical
- aiReason should be 2-3 sentences explaining the itinerary choice`;

            // Changed model to 1.5-flash for better quota handling and performance
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const response = await model.generateContent({
                contents: [{
                    role: "user",
                    parts: [{ text: prompt }],
                }],
                generationConfig: {
                    responseMimeType: "application/json",
                    temperature: 0.7,
                },
            });

            const jsonText = response.response.text().trim();
            // Remove markdown code blocks if present
            const cleanJson = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
            const aiData = JSON.parse(cleanJson);

            // Process AI response to match exact schema
            const processedDays = aiData.days.map((day: any) => {
                // Ensure mapPolyline exists
                if (!day.mapPolyline && day.activities) {
                    day.mapPolyline = day.activities.map((act: any) => [act.lat, act.lng]);
                }
                return day;
            });

            // Calculate center for hotels
            const firstActivity = processedDays[0]?.activities[0];
            const centerLat = firstActivity?.lat || 10.5276;
            const centerLng = firstActivity?.lng || 76.2144;

            // Generate hotels
            const hotels = generateHotels(centerLat, centerLng, budget);

            // Calculate budget breakdown
            const budgetMap: { [key: string]: { perDay: number } } = {
                "Budget": { perDay: 2000 },
                "Mid-range": { perDay: 4000 },
                "Luxury": { perDay: 8000 }
            };

            const baseBudget = budgetMap[budget] || budgetMap["Mid-range"];
            const stayPerDay = hotels[0]?.price || 1500;
            const totalStay = stayPerDay * daysCount;
            const totalFood = baseBudget.perDay * daysCount * 0.3;
            const totalTravel = baseBudget.perDay * daysCount * 0.2;
            const totalTickets = baseBudget.perDay * daysCount * 0.1;
            const totalExtras = baseBudget.perDay * daysCount * 0.1;

            const budgetBreakdown = {
                stay: Math.round(totalStay),
                food: Math.round(totalFood),
                travel: Math.round(totalTravel),
                tickets: Math.round(totalTickets),
                extras: Math.round(totalExtras)
            };

            const totalBudget = Object.values(budgetBreakdown).reduce((a, b) => a + b, 0);
            const budgetEstimate = {
                min: Math.round(totalBudget * 0.9),
                max: Math.round(totalBudget * 1.1)
            };

            // Generate itinerary ID
            const id = `itn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // Get hero image
            const heroImage = processedDays[0]?.activities[0]?.image || "/places/munnar-teagardens.jpg";

            const itinerary = {
                id: id,
                title: aiData.title || `${daysCount}-Day Kerala Adventure`,
                duration: daysCount,
                travelers: travelers,
                budgetEstimate: budgetEstimate,
                heroImage: heroImage,
                aiReason: aiData.aiReason || "This itinerary is carefully crafted based on your preferences and interests.",
                days: processedDays,
                hotels: hotels,
                budgetBreakdown: budgetBreakdown
            };

            res.status(200).json(itinerary);

        } catch (aiError: any) {
            console.error("AI Generation Error (Quota/Model/Parsing):", aiError.message);
            console.warn("Falling back to manual itinerary generation...");

            // Fallback to manual generation
            const manualPlan = createManualItinerary(req.body);
            // Optionally add a flag or modify reason to indicate fallback
            manualPlan.aiReason = "AI services are currently busy. This itinerary was automatically curated based on your interests.";

            res.status(200).json(manualPlan);
        }

    } catch (error: any) {
        console.error("Critical Error in AI Planner:", error);
        res.status(500).json({ message: "Failed to generate itinerary.", error: error.message });
    }
};