import { Request, Response } from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { KERALA_PLACES } from '../seed/places';

const API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key is not configured. AI itinerary generation will fail.");
}

const ai = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

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
      image: `https://images.unsplash.com/photo-${1500000000000 + i}?w=800&h=600&fit=crop`
    };
  });
}

export const generateAIPlan = async (req: Request, res: Response) => {
    try {
        if (!API_KEY || !ai) {
            return res.status(500).json({ message: "AI planner is not configured on the server." });
        }

        const { duration, budget, interests, travelers } = req.body;

        if (!duration || !budget || !interests || !travelers) {
            return res.status(400).json({ message: "Missing required fields: duration, budget, interests, travelers." });
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

        const relevantPlaces = KERALA_PLACES.filter((place) => 
            place.tags.some((tag) => searchTags.some(st => tag.toLowerCase().includes(st.toLowerCase())))
        ).slice(0, 8); // Limit to 8 places for AI

        const placesContext = relevantPlaces.map(p => 
            `${p.name} (${p.lat}, ${p.lng}): ${p.description}`
        ).join('\n');

        const prompt = `You are a travel expert creating a personalized Kerala itinerary. Return ONLY valid JSON, no markdown, no code blocks.

Trip Details:
- Duration: ${daysCount} days
- Budget: ${budget}
- Travelers: ${travelers}
- Interests: ${interests.join(', ')}

Available Places (use these coordinates):
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
          "name": "Place name from available places",
          "desc": "Brief description",
          "lat": number (use exact lat from available places),
          "lng": number (use exact lng from available places),
          "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
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
- Use exact coordinates from available places
- Include mapPolyline array in each day: [[lat1, lng1], [lat2, lng2], ...]
- Make it geographically logical
- aiReason should be 2-3 sentences explaining the itinerary choice`;

        const model = ai.getGenerativeModel({ model: "gemini-1.5-pro" });
        
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
        const heroImage = processedDays[0]?.activities[0]?.image || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop";

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

    } catch (error: any) {
        console.error("Error calling Gemini API:", error);
        res.status(500).json({ message: "Failed to generate AI itinerary.", error: error.message });
    }
};