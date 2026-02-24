import { Request, Response } from 'express';
import { KERALA_PLACES } from '../seed/places';

// Helper to calculate distance between two coordinates
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Generate random hotel data
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
        const offsetLat = (Math.random() - 0.5) * 0.1;
        const offsetLng = (Math.random() - 0.5) * 0.1;
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

export const createManualItinerary = (data: any) => {
    const { duration, interests, budget, travelers } = data;

    // Parse duration (handle "3-4 days", "5-7 days", etc.)
    let daysCount = 3;
    if (typeof duration === 'string') {
        const match = duration.match(/(\d+)/);
        if (match) {
            daysCount = parseInt(match[1]);
        }
    } else {
        daysCount = parseInt(duration) || 3;
    }

    // Map interest tags
    const interestMap: { [key: string]: string[] } = {
        "Backwaters": ["backwaters", "houseboat", "relaxation"],
        "Beaches": ["beaches", "coastal"],
        "Hill Stations": ["hill-station", "tea", "nature"],
        "Culture & Heritage": ["culture", "history", "architecture", "festival"],
        "Wildlife": ["wildlife", "trekking", "adventure"],
        "Adventure Sports": ["adventure", "trekking"]
    };

    const searchTags: string[] = [];
    interests.forEach((interest: string) => {
        if (interestMap[interest]) {
            searchTags.push(...interestMap[interest]);
        } else {
            searchTags.push(interest.toLowerCase());
        }
    });

    // Filter places by interests
    const relevantPlaces = KERALA_PLACES.filter((place) =>
        place.tags.some((tag) => searchTags.some(st => tag.toLowerCase().includes(st.toLowerCase())))
    ).sort((a, b) => Math.random() - 0.5); // Shuffle for variety

    if (relevantPlaces.length === 0) {
        throw new Error("No places found matching your interests.");
    }

    // Split into days (3-4 activities per day)
    const activitiesPerDay = 3;
    const days = [];
    let placeIndex = 0;

    for (let day = 1; day <= daysCount; day++) {
        const dayActivities = [];
        const times = ["08:00", "11:00", "14:00", "17:00"];

        for (let i = 0; i < activitiesPerDay && placeIndex < relevantPlaces.length; i++) {
            const place = relevantPlaces[placeIndex % relevantPlaces.length];
            const time = times[i] || "09:00";
            const duration = ["2h", "3h", "2h", "1h"][i] || "2h";
            const cost = Math.floor(Math.random() * 200 + 50);

            dayActivities.push({
                time: time,
                name: place.name,
                desc: place.description,
                lat: place.lat,
                lng: place.lng,
                image: "/places/munnar-teagardens.jpg",
                duration: duration,
                cost: cost
            });
            placeIndex++;
        }

        // Build map polyline from activities
        const mapPolyline = dayActivities.map(act => [act.lat, act.lng]);

        days.push({
            day: day,
            activities: dayActivities,
            mapPolyline: mapPolyline
        });
    }

    // Calculate center point for hotels
    const centerLat = days[0]?.activities[0]?.lat || 10.5276;
    const centerLng = days[0]?.activities[0]?.lng || 76.2144;

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

    // Generate itinerary ID
    const id = `itn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Get hero image
    const heroImage = days[0]?.activities[0]?.image || "/places/munnar-teagardens.jpg";

    // Calculate budget estimate
    const totalBudget = Object.values(budgetBreakdown).reduce((a, b) => a + b, 0);
    const budgetEstimate = {
        min: Math.round(totalBudget * 0.9),
        max: Math.round(totalBudget * 1.1)
    };

    return {
        id: id,
        title: `${daysCount}-Day Kerala Adventure`,
        duration: daysCount,
        travelers: travelers,
        budgetEstimate: budgetEstimate,
        heroImage: heroImage,
        aiReason: null as string | null,
        days: days,
        hotels: hotels,
        budgetBreakdown: budgetBreakdown
    };
};

export const generateManualPlan = async (req: Request, res: Response) => {
    try {
        const { duration, interests, budget, travelers } = req.body;

        if (!duration || !interests || !budget || !travelers) {
            return res.status(400).json({ message: "Missing required fields: duration, interests, budget, travelers." });
        }

        const itinerary = createManualItinerary({ duration, interests, budget, travelers });
        res.status(200).json(itinerary);
    } catch (error: any) {
        console.error("Error generating manual plan:", error);
        res.status(500).json({ message: "Failed to generate itinerary", error: error.message });
    }
};