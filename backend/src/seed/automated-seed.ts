import dotenv from "dotenv";
import mongoose from "mongoose";
import fetch from "node-fetch";
import connectDB from "../config/db";
import Place from "../models/Place";
import Stay from "../models/Stay";

dotenv.config();

// --- Configuration ---
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || ""; // Add to .env if available
const TARGET_LOCATIONS = [
    { name: "Munnar", district: "Idukki", lat: 10.0889, lon: 77.0595 },
    { name: "Alappuzha", district: "Alappuzha", lat: 9.4981, lon: 76.3388 },
    { name: "Kochi", district: "Ernakulam", lat: 9.9312, lon: 76.2673 },
    { name: "Wayanad", district: "Wayanad", lat: 11.6854, lon: 76.1320 },
    { name: "Varkala", district: "Thiruvananthapuram", lat: 8.7379, lon: 76.7163 },
    { name: "Thekkady", district: "Idukki", lat: 9.6031, lon: 77.1615 },
    { name: "Kovalam", district: "Thiruvananthapuram", lat: 8.4004, lon: 76.9787 },
    { name: "Kumarakom", district: "Kottayam", lat: 9.6176, lon: 76.4301 }
];

const FALLBACK_IMAGES = [
    "/places/munnar-teagardens.jpg",
    "/places/alappuzhabackwaters.webp",
    "/places/varkala-clif.jpg",
    "/places/athirappillywaterfalls.jpg",
    "/places/edakkal-caves.webp"
];

// --- Helper Functions ---

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function getRandomRating() {
    return (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1);
}

function getRandomImages(count: number = 3) {
    const shuffled = FALLBACK_IMAGES.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// 1. Fetch from OpenStreetMap (Overpass API)
async function fetchOverpassData(lat: number, lon: number, radius: number = 5000, attempt: number = 1) {
    const query = `
    [out:json];
    (
      node["tourism"~"attraction|viewpoint|museum"](around:${radius},${lat},${lon});
      node["tourism"="hotel"](around:${radius},${lat},${lon});
      node["amenity"="restaurant"](around:${radius},${lat},${lon});
    );
    out body;
  `;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);
        if (response.status === 429) {
            if (attempt > 3) throw new Error("Too Many Requests (Max Retries)");
            const delay = 5000 * Math.pow(2, attempt); // 10s, 20s, 40s
            console.log(`⏳ Overpass Rate Limit. Waiting ${delay / 1000}s...`);
            await sleep(delay);
            return fetchOverpassData(lat, lon, radius, attempt + 1);
        }
        if (!response.ok) throw new Error(`Overpass API Error: ${response.statusText}`);
        const data: any = await response.json();
        return data.elements || [];
    } catch (error) {
        if (attempt <= 3) {
            console.warn(`⚠️ Overpass Fetch Error (Attempt ${attempt}):`, error);
            await sleep(3000);
            return fetchOverpassData(lat, lon, radius, attempt + 1);
        }
        console.error("❌ Failed to fetch Overpass data after retries:", error);
        return [];
    }
}

// 2. Fetch Description from Wikipedia
async function fetchWikipediaDescription(query: string) {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query.replace(/ /g, "_"))}`;
    try {
        const response = await fetch(url);
        if (!response.ok) return null;
        const data: any = await response.json();
        return data.extract || null;
    } catch (error) {
        return null;
    }
}

// 3. Fetch Images from Unsplash
async function fetchUnsplashImages(query: string, count: number = 3) {
    if (!UNSPLASH_ACCESS_KEY) return getRandomImages(count);

    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&client_id=${UNSPLASH_ACCESS_KEY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            // console.warn(`Unsplash Error: ${response.statusText}`); 
            return getRandomImages(count); // Fallback on error/rate limit
        }
        const data: any = await response.json();
        if (data.results && data.results.length > 0) {
            return data.results.map((img: any) => img.urls.regular);
        }
    } catch (error) {
        // console.warn("Failed to fetch Unsplash images");
    }
    return getRandomImages(count);
}

// --- Main Seeding Logic ---

async function seedAutomated() {
    try {
        await connectDB();
        console.log("🚀 Connected to MongoDB. Starting automated seed...");

        // Optional: Clear existing data? 
        // Uncomment if you want to wipe before seed
        // await Place.deleteMany({});
        // await Stay.deleteMany({});
        // console.log("🗑️ Cleared existing Places and Stays.");

        let placeCount = 0;
        let stayCount = 0;

        for (const location of TARGET_LOCATIONS) {
            // Add initial delay between locations to be nice to API
            if (placeCount > 0 || stayCount > 0) await sleep(2000);

            console.log(`\n📍 Processing location: ${location.name}...`);

            const nodes = await fetchOverpassData(location.lat, location.lon);
            console.log(`   Found ${nodes.length} raw nodes.`);

            // Limit nodes to avoid hitting limits or over-seeding
            const limitedNodes = nodes.slice(0, 15);

            for (const node of limitedNodes) {
                if (!node.tags || !node.tags.name) continue;

                const name = node.tags.name;
                // Skip check if already exists to allow update or just simple skip?
                // Let's simple check by name
                const existingPlace = await Place.findOne({ name: new RegExp(`^${name}$`, 'i') });
                const existingStay = await Stay.findOne({ name: new RegExp(`^${name}$`, 'i') });
                if (existingPlace || existingStay) {
                    process.stdout.write(".");
                    continue;
                }

                // Fetch details
                const description = await fetchWikipediaDescription(name) || `A beautiful destination in ${location.name}, Kerala.`;
                const images = await fetchUnsplashImages(`${name} Kerala`, 3);

                // Determine Category & Model
                let type = "Place";
                let category = "Tourist Attraction";
                let stayType = "hotel"; // default for stays

                if (node.tags.tourism === "hotel") {
                    type = "Stay";
                    stayType = "hotel";
                } else if (node.tags.amenity === "restaurant") {
                    type = "Stay"; // Storing restaurants in Stay per user req
                    stayType = "restaurant";
                } else if (node.tags.tourism === "viewpoint") {
                    type = "Place";
                    category = "Viewpoint";
                } else if (node.tags.tourism === "museum") {
                    type = "Place";
                    category = "Museum";
                }

                if (type === "Place") {
                    await Place.create({
                        name: name,
                        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
                        district: location.district,
                        location: location.name,
                        category: category,
                        description: description,
                        image: images[0],
                        images: images,
                        latitude: node.lat,
                        longitude: node.lon,
                        ratingAvg: parseFloat(getRandomRating()),
                        totalReviews: Math.floor(Math.random() * 200) + 10,
                        status: "approved",
                        tags: [category.toLowerCase(), location.name.toLowerCase(), "kerala"]
                    });
                    placeCount++;
                } else {
                    // Stay
                    await Stay.create({
                        name: name,
                        type: stayType,
                        description: description,
                        district: location.district,
                        latitude: node.lat,
                        longitude: node.lon,
                        images: images,
                        price: Math.floor(Math.random() * 10000) + 1500, // Random price
                        amenities: ["WiFi", "Parking", "Family Friendly"], // Default amenities
                        ratingAvg: parseFloat(getRandomRating()),
                        ratingCount: Math.floor(Math.random() * 200) + 10,
                        status: "approved"
                    });
                    stayCount++;
                }
                process.stdout.write("+");
                await sleep(500); // Polite definition
            }
        }

        console.log(`\n\n✅ Automation Complete!`);
        console.log(`   Added ${placeCount} Places`);
        console.log(`   Added ${stayCount} Stays`);
        process.exit(0);

    } catch (error) {
        console.error("\n❌ Seeding failed:", error);
        process.exit(1);
    }
}

seedAutomated();
