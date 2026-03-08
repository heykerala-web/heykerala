const { createManualItinerary } = require('./backend/src/controllers/itineraryManualController');
const { KERALA_PLACES } = require('./backend/src/seed/places');

// Mock data
const mockDataWithDistricts = {
    duration: "2 days",
    interests: ["Backwaters"],
    budget: "Mid-range",
    travelers: "Couple",
    districts: ["Alappuzha"]
};

const mockDataWithoutDistricts = {
    duration: "2 days",
    interests: ["Hill Stations"],
    budget: "Mid-range",
    travelers: "Solo",
    districts: []
};

function test() {
    console.log("--- Testing with Alappuzha district ---");
    const itinerary1 = createManualItinerary(mockDataWithDistricts);
    console.log("Itinerary 1 title:", itinerary1.title);
    const day1Places = itinerary1.days[0].activities.map(a => a.name);
    console.log("Day 1 places:", day1Places);

    const allPlacesInAlappuzha = day1Places.every(name => {
        const place = KERALA_PLACES.find(p => p.name === name);
        return place && place.district === "Alappuzha";
    });
    console.log("All places in Alappuzha?", allPlacesInAlappuzha);

    console.log("\n--- Testing without districts (fallback) ---");
    const itinerary2 = createManualItinerary(mockDataWithoutDistricts);
    console.log("Itinerary 2 title:", itinerary2.title);
    const day1Places2 = itinerary2.days[0].activities.map(a => a.name);
    console.log("Day 1 places (Munnar should be there):", day1Places2);
}

// Since we are in a TypeScript project and this is a JS script to run via Node, 
// we might have issues with imports. I'll just copy the logic for a quick check or 
// use ts-node if available.
// Actually, I'll just run a curl command against the running backend instead.
test();
