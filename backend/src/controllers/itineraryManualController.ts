import { Request, Response } from 'express';
import Place from '../models/Place';
import { KERALA_PLACES } from '../seed/places';

// Helper to calculate distance between two coordinates (can be used for proximity sorting later)
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

export const createManualItinerary = async (data: any) => {
    const { duration, interests, budget, travelers, districts } = data;

    console.log("Generating manual itinerary with:", { duration, interests, budget, travelers, districts });

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

    // Map interest options to DB categories
    const interestToCategory: { [key: string]: string[] } = {
        "Backwaters": ["Backwaters"],
        "Beaches": ["Beach"],
        "Hill Stations": ["Hill Station"],
        "Culture & Heritage": ["Culture", "History"],
        "Wildlife": ["Wildlife"],
        "Adventure Sports": ["Adventure"],
        "Nature": ["Nature"]
    };

    const selectedCategories: string[] = [];
    const searchTags: string[] = [];

    interests.forEach((interest: string) => {
        if (interestToCategory[interest]) {
            selectedCategories.push(...interestToCategory[interest]);
        } else {
            // If it's a custom interest or doesn't match, add to tags search
            searchTags.push(interest.toLowerCase());
        }
    });

    // Build MongoDB query
    const query: any = {
        status: 'approved'
    };

    if (districts && districts.length > 0) {
        const districtRegexes = districts.map((d: string) => new RegExp(`^${d}$`, 'i'));
        query.district = { $in: districtRegexes };
    }

    if (selectedCategories.length > 0 || searchTags.length > 0) {
        query.$or = [];
        if (selectedCategories.length > 0) {
            const categoryRegexes = selectedCategories.map((c: string) => new RegExp(`^${c}$`, 'i'));
            query.$or.push({ category: { $in: categoryRegexes } });
        }
        if (searchTags.length > 0) {
            query.$or.push({ tags: { $in: searchTags.map(t => new RegExp(t, 'i')) } });
        }
    }

    // Fetch places from DB prioritized by rating and popularity
    let relevantPlaces = await Place.find(query)
        .sort({ ratingAvg: -1, totalReviews: -1, views: -1 })
        .limit(daysCount * 5); // Fetch enough for variety

    // Fallback 1: If no places found with filters, try without category/tags but keep districts
    if (relevantPlaces.length < daysCount && districts && districts.length > 0) {
        console.warn("Not enough places found with filters in DB, expanding search within districts...");
        const districtRegexes = districts.map((d: string) => new RegExp(`^${d}$`, 'i'));
        const fallbackQuery: any = { status: 'approved', district: { $in: districtRegexes } };
        const fallbackPlaces = await Place.find(fallbackQuery)
            .sort({ ratingAvg: -1, totalReviews: -1 })
            .limit(daysCount * 5);

        // Combine and de-duplicate
        const placeIds = new Set(relevantPlaces.map(p => p._id?.toString()));
        for (const p of fallbackPlaces) {
            if (!placeIds.has(p._id?.toString())) {
                relevantPlaces.push(p);
            }
        }
    }

    // Fallback 2: If still not enough, use static data for selected districts
    if (relevantPlaces.length < daysCount) {
        console.warn("Still not enough places in DB, adding static places for selected districts...");
        const staticFiltered = (districts && districts.length > 0)
            ? KERALA_PLACES.filter(p => districts.some((d: string) => Math.abs(d.localeCompare(p.district, undefined, { sensitivity: 'base' })) === 0))
            : KERALA_PLACES;

        // Map static places to match relevantPlaces structure (as much as possible)
        const staticMapped = staticFiltered.map(p => ({
            name: p.name,
            district: p.district,
            description: p.description,
            latitude: p.lat,
            longitude: p.lng,
            tags: p.tags,
            priceLevel: p.priceLevel || 'Moderate',
            image: "/places/munnar-teagardens.jpg" // Default image for static
        }));

        relevantPlaces = [...relevantPlaces, ...staticMapped];
    }

    if (relevantPlaces.length === 0) {
        throw new Error("No places found matching your selections. Try selecting more districts or different interests.");
    }

    // Shuffle slightly for variety
    relevantPlaces = relevantPlaces.sort(() => Math.random() - 0.5);

    // Split into days (ensure we format properly based on available places)
    const totalActivities = relevantPlaces.length;
    let activitiesPerDay = Math.min(4, Math.ceil(totalActivities / daysCount));
    if (activitiesPerDay < 1) activitiesPerDay = 1;

    const days = [];
    let placeIndex = 0;

    for (let day = 1; day <= daysCount; day++) {
        const dayActivities = [];
        const times = ["08:00", "11:00", "14:00", "17:00"];

        // Determine how many places to put on this day (distribute leftovers)
        const placesForThisDay = Math.min(activitiesPerDay, relevantPlaces.length - placeIndex);

        for (let i = 0; i < placesForThisDay; i++) {
            const place = relevantPlaces[placeIndex];
            const time = times[i] || "09:00";
            const actDuration = ["2h", "3h", "2h", "1h"][i] || "2h";
            const cost = place.priceLevel === 'Free' ? 0 :
                place.priceLevel === 'Cheap' ? 100 :
                    place.priceLevel === 'Expensive' ? 500 : 250;

            dayActivities.push({
                time: time,
                name: place.name,
                desc: place.description.substring(0, 150) + "...",
                lat: place.latitude,
                lng: place.longitude,
                image: place.image || place.images?.[0] || "/places/munnar-teagardens.jpg",
                duration: actDuration,
                cost: cost
            });
            placeIndex++;
        }

        if (dayActivities.length > 0) {
            const mapPolyline = dayActivities.map(act => [act.lat, act.lng]);
            days.push({
                day: day,
                activities: dayActivities,
                mapPolyline: mapPolyline
            });
        }
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
        "Premium": { perDay: 6000 },
        "Luxury": { perDay: 12000 }
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

    // Calculate budget estimate
    const totalBudget = Object.values(budgetBreakdown).reduce((a, b) => a + b, 0);
    const budgetEstimate = {
        min: Math.round(totalBudget * 0.9),
        max: Math.round(totalBudget * 1.1)
    };

    // Generate itinerary ID
    const id = `itn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
        id: id,
        title: `${daysCount}-Day Kerala Adventure`,
        duration: daysCount,
        travelers: travelers,
        budgetEstimate: budgetEstimate,
        heroImage: days[0]?.activities[0]?.image || "/places/munnar-teagardens.jpg",
        aiReason: null as string | null,
        days: days,
        hotels: hotels,
        budgetBreakdown: budgetBreakdown
    };
};

export const generateManualPlan = async (req: Request, res: Response) => {
    try {
        const { duration, interests, budget, travelers, districts } = req.body;

        if (!duration || !interests || !budget || !travelers) {
            return res.status(400).json({ message: "Missing required fields: duration, interests, budget, travelers." });
        }

        const itinerary = await createManualItinerary({ duration, interests, budget, travelers, districts });
        res.status(200).json(itinerary);
    } catch (error: any) {
        console.error("Error generating manual plan:", error);
        res.status(500).json({ message: "Failed to generate itinerary", error: error.message });
    }
};