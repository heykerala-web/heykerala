
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { duration, budget, interests, travelers } = await req.json();

        // Mock Data Generator
        const generateMockItinerary = () => {
            const daysCount = parseInt(duration) || 5; // Fallback parsing

            return {
                id: "manual-" + Date.now(),
                title: `Kerala ${interests[0] || "Experience"} Tour`,
                duration: duration,
                travelers: travelers,
                budgetEstimate: { min: 45000, max: 60000 },
                heroImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944",
                aiReason: "A handcrafted plan focusing on your interests.",
                budgetBreakdown: {
                    stay: 25000,
                    food: 10000,
                    travel: 8000,
                    tickets: 2000,
                    extras: 5000,
                },
                days: Array.from({ length: Math.min(daysCount, 7) }).map((_, i) => ({
                    day: i + 1,
                    theme: i === 0 ? "Arrival & Relax" : "Exploring " + (interests[i % interests.length] || "Nature"),
                    activities: [
                        {
                            time: "09:00 AM",
                            name: "Local Breakfast",
                            desc: "Traditional Kerala breakfast with Appam and Stew.",
                            image: "https://images.unsplash.com/photo-1616070776569-4560731518j9",
                            duration: "1 hr",
                            cost: 500,
                            lat: 9.9312,
                            lng: 76.2673,
                        },
                        {
                            time: "11:00 AM",
                            name: "Sightseeing",
                            desc: "Visit the famous local landmarks.",
                            image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2",
                            duration: "3 hrs",
                            cost: 1000,
                            lat: 9.9658,
                            lng: 76.2421,
                        }
                    ],
                    mapPolyline: [[9.9312, 76.2673], [9.9658, 76.2421]]
                })),
                hotels: [
                    {
                        id: "h1",
                        name: "Grand Hyatt Kochi",
                        price: 12000,
                        rating: 4.8,
                        distanceKm: 5,
                        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945"
                    },
                    {
                        id: "h2",
                        name: "Taj Malabar Resort",
                        price: 15000,
                        rating: 4.9,
                        distanceKm: 2,
                        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd"
                    }
                ]
            };
        };


        const data = generateMockItinerary();

        // Simulate delay for realism
        await new Promise((resolve) => setTimeout(resolve, 1500));

        return NextResponse.json(data);
    } catch (error) {
        console.error("Manual Itinerary Error:", error);
        return new NextResponse(JSON.stringify({ error: "Failed to generate plan" }), {
            status: 500,
        });
    }
}
