import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../config/db";
import Place from "../models/Place";
import Stay from "../models/Stay";
import Event from "../models/Event";

const samplePlaces = [
    {
        name: "Munnar Tea Gardens",
        slug: "munnar-tea-gardens",
        district: "Idukki",
        location: "Munnar, Idukki",
        category: "Hill Station",
        description: "Explore the vast, rolling green hills of Munnar, carpeted with lush tea plantations. A haven for nature lovers and photographers.",
        image: "https://images.unsplash.com/photo-1590510328503-903069695d38?auto=format&fit=crop&w=1200&q=80",
        images: ["https://images.unsplash.com/photo-1590510328503-903069695d38?auto=format&fit=crop&w=1200&q=80"],
        latitude: 10.0889,
        longitude: 77.0595,
        ratingAvg: 4.9,
        totalReviews: 120,
        status: "approved",
        tags: ["nature", "tea", "hills"]
    },
    {
        name: "Alleppey Backwaters",
        slug: "alleppey-backwaters",
        district: "Alappuzha",
        location: "Alappuzha",
        category: "Backwaters",
        description: "Experience the ultimate Kerala experience in a traditional houseboat cruising through the scenic canals and lagoons of Alleppey.",
        image: "https://images.unsplash.com/photo-1602216056096-3c40cc0c9855?auto=format&fit=crop&w=1200&q=80",
        images: ["https://images.unsplash.com/photo-1602216056096-3c40cc0c9855?auto=format&fit=crop&w=1200&q=80"],
        latitude: 9.4981,
        longitude: 76.3388,
        ratingAvg: 4.8,
        totalReviews: 250,
        status: "approved",
        tags: ["backwaters", "houseboat", "serene"]
    },
    {
        name: "Varkala Cliff",
        slug: "varkala-cliff",
        district: "Thiruvananthapuram",
        location: "Varkala",
        category: "Beach",
        description: "Varkala's dramatic red cliffs overlooking the Arabian Sea offer breathtaking views and a unique beach experience.",
        image: "https://images.unsplash.com/photo-1590050811270-e322662c919d?auto=format&fit=crop&w=1200&q=80",
        images: ["https://images.unsplash.com/photo-1590050811270-e322662c919d?auto=format&fit=crop&w=1200&q=80"],
        latitude: 8.7379,
        longitude: 76.7163,
        ratingAvg: 4.7,
        totalReviews: 85,
        status: "approved",
        tags: ["beach", "cliff", "sunset"]
    },
    {
        name: "Athirappilly Waterfalls",
        slug: "athirappilly-waterfalls",
        district: "Thrissur",
        location: "Athirappilly",
        category: "Waterfalls",
        description: "Often called the Niagra of India, Athirappilly is the largest waterfall in Kerala, surrounded by dense tropical forests.",
        image: "https://images.unsplash.com/photo-1597735881932-d9664c9bbcea?auto=format&fit=crop&w=1200&q=80",
        images: ["https://images.unsplash.com/photo-1597735881932-d9664c9bbcea?auto=format&fit=crop&w=1200&q=80"],
        latitude: 10.2851,
        longitude: 76.5698,
        ratingAvg: 4.9,
        totalReviews: 180,
        status: "approved",
        tags: ["waterfall", "nature", "forest"]
    },
    {
        name: "Wayanad Edakkal Caves",
        slug: "wayanad-edakkal-caves",
        district: "Wayanad",
        location: "Ambalavayal",
        category: "History",
        description: "Prehistoric caves featuring ancient rock carvings dating back to the Neolithic era. A trek to the top offers panoramic views.",
        image: "https://images.unsplash.com/photo-1589982840479-df88650dfd67?auto=format&fit=crop&w=1200&q=80",
        images: ["https://images.unsplash.com/photo-1589982840479-df88650dfd67?auto=format&fit=crop&w=1200&q=80"],
        latitude: 11.6322,
        longitude: 76.2366,
        ratingAvg: 4.6,
        totalReviews: 65,
        status: "approved",
        tags: ["history", "caves", "trekking"]
    },
    {
        name: "Fort Kochi Mattancherry",
        slug: "fort-kochi-mattancherry",
        district: "Ernakulam",
        location: "Kochi",
        category: "Heritage Site",
        description: "A blend of Dutch, Portuguese, and British colonial history. Explore art galleries, cafes, and the famous Chinese fishing nets.",
        image: "https://images.unsplash.com/photo-1589921200632-132d75f2ee3f?auto=format&fit=crop&w=1200&q=80",
        images: ["https://images.unsplash.com/photo-1589921200632-132d75f2ee3f?auto=format&fit=crop&w=1200&q=80"],
        latitude: 9.9656,
        longitude: 76.2421,
        ratingAvg: 4.7,
        totalReviews: 140,
        status: "approved",
        tags: ["heritage", "city", "history"]
    },
    {
        name: "Thekkady Periyar Wildlife",
        slug: "thekkady-periyar-wildlife",
        district: "Idukki",
        location: "Thekkady",
        category: "Wildlife",
        description: "One of the finest wildlife reserves in India. Spot elephants, bison, and exotic birds in their natural habitat during a boat safari.",
        image: "https://images.unsplash.com/photo-1581023779269-80517c80536c?auto=format&fit=crop&w=1200&q=80",
        images: ["https://images.unsplash.com/photo-1581023779269-80517c80536c?auto=format&fit=crop&w=1200&q=80"],
        latitude: 9.6031,
        longitude: 77.1615,
        ratingAvg: 4.8,
        totalReviews: 190,
        status: "approved",
        tags: ["wildlife", "safari", "forest"]
    },
    {
        name: "Kovalam Lighthouse Beach",
        slug: "kovalam-lighthouse-beach",
        district: "Thiruvananthapuram",
        location: "Kovalam",
        category: "Beach",
        description: "Kerala's most famous beach destination with its iconic red-and-white lighthouse and crescent-shaped coastline.",
        image: "https://images.unsplash.com/photo-1626297394991-38914c8106d4?auto=format&fit=crop&w=1200&q=80",
        images: ["https://images.unsplash.com/photo-1626297394991-38914c8106d4?auto=format&fit=crop&w=1200&q=80"],
        latitude: 8.4004,
        longitude: 76.9787,
        ratingAvg: 4.5,
        totalReviews: 310,
        status: "approved",
        tags: ["beach", "lighthouse", "tourist"]
    },
    {
        name: "Jatayu Earth's Center",
        slug: "jatayu-earths-center",
        district: "Kollam",
        location: "Chadayamangalam",
        category: "Heritage Site",
        description: "The world's largest bird sculpture, Jatayu is a rock-themed park promoting mythology, adventure, and eco-tourism.",
        image: "https://images.unsplash.com/photo-1610427920789-514ca68c67c7?auto=format&fit=crop&w=1200&q=80",
        images: ["https://images.unsplash.com/photo-1610427920789-514ca68c67c7?auto=format&fit=crop&w=1200&q=80"],
        latitude: 8.8684,
        longitude: 76.8684,
        ratingAvg: 4.9,
        totalReviews: 220,
        status: "approved",
        tags: ["statue", "heritage", "view"]
    },
    {
        name: "Wagamon Hills",
        slug: "wagamon-hills",
        district: "Idukki",
        location: "Wagamon",
        category: "Hill Station",
        description: "A sleepy town with rolling meadows, pine forests, and mystical fogs. Perfect for paragliding and quiet retreats.",
        image: "https://images.unsplash.com/photo-1596522354195-e84ae3c98731?auto=format&fit=crop&w=1200&q=80",
        images: ["https://images.unsplash.com/photo-1596522354195-e84ae3c98731?auto=format&fit=crop&w=1200&q=80"],
        latitude: 9.6917,
        longitude: 76.9067,
        ratingAvg: 4.7,
        totalReviews: 110,
        status: "approved",
        tags: ["hills", "pineforest", "meadows"]
    }
];

const sampleStays = [
    {
        name: "Elixir Hills Resort",
        type: "resort",
        description: "A luxury resort tucked away in the rainforests of Munnar, offering unparalleled peace and world-class amenities.",
        district: "Idukki",
        latitude: 10.0889,
        longitude: 77.0595,
        images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"],
        price: 8500,
        amenities: ["Pool", "Spa", "Gym", "Restaurant", "WiFi"],
        ratingAvg: 4.8,
        status: "approved"
    },
    {
        name: "Spice Coast Houseboats",
        type: "homestay",
        description: "Authentic Kettuvallam houseboats that offer a cozy, traditional stay right on the waters of Vembanad Lake.",
        district: "Alappuzha",
        latitude: 9.4981,
        longitude: 76.3388,
        images: ["https://images.unsplash.com/photo-1593181629936-11c609b8db9b?auto=format&fit=crop&w=1200&q=80"],
        price: 12000,
        amenities: ["Traditional Meals", "Private Deck", "A/C", "Guide"],
        ratingAvg: 4.9,
        status: "approved"
    },
    {
        name: "Zostel Kochi",
        type: "hotel",
        description: "A vibrant, budget-friendly stay in Fort Kochi, popular among backpackers and artsy travelers.",
        district: "Ernakulam",
        latitude: 9.9656,
        longitude: 76.2421,
        images: ["https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80"],
        price: 1200,
        amenities: ["Cafe", "Common Area", "Laundry", "WiFi"],
        ratingAvg: 4.5,
        status: "approved"
    },
    {
        name: "Grand Hyatt Kochi Bolgatty",
        type: "hotel",
        description: "Ultra-luxury hotel overlooking the serene backwaters of Lake Vembanad. The pinnacle of urban luxury.",
        district: "Ernakulam",
        latitude: 9.9894,
        longitude: 76.2673,
        images: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"],
        price: 15000,
        amenities: ["Helipad", "Spa", "Infinity Pool", "Fine Dining"],
        ratingAvg: 4.9,
        status: "approved"
    },
    {
        name: "Green Gates Hotel",
        type: "hotel",
        description: "A boutique hotel in Kalpetta, offering easy access to the wonders of Wayanad hills.",
        district: "Wayanad",
        latitude: 11.6050,
        longitude: 76.0830,
        images: ["https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80"],
        price: 3500,
        amenities: ["Restaurant", "Travel Desk", "WiFi", "Park"],
        ratingAvg: 4.2,
        status: "approved"
    },
    {
        name: "The Terrace Cafe",
        type: "cafe",
        description: "Cozy cafe with a view of the lighthouse in Kovalam. Famous for specialty coffee and seafood snacks.",
        district: "Thiruvananthapuram",
        latitude: 8.4004,
        longitude: 76.9787,
        images: ["https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80"],
        price: 800,
        amenities: ["Outdoor Seating", "Live Music", "Free WiFi"],
        ratingAvg: 4.6,
        status: "approved"
    },
    {
        name: "Paragon Restaurant",
        type: "restaurant",
        description: "Calicut's legendary restaurant, world-famous for its aromatic Biryani and seafood delicacies.",
        district: "Kozhikode",
        latitude: 11.2588,
        longitude: 75.7804,
        images: ["https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80"],
        price: 1500,
        amenities: ["Family Dining", "A/C", "Parking"],
        ratingAvg: 4.8,
        status: "approved"
    },
    {
        name: "Coconut Lagoon",
        type: "resort",
        description: "Accessible only by boat, this heritage resort celebrates the architectural traditions of old Kerala.",
        district: "Kottayam",
        latitude: 9.6176,
        longitude: 76.4301,
        images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80"],
        price: 18000,
        amenities: ["Ayurveda", "Boat Rides", "Heritage Rooms"],
        ratingAvg: 4.9,
        status: "approved"
    },
    {
        name: "Beach Safari Homestay",
        type: "homestay",
        description: "A friendly, family-run home right on Marari beach. Experience local life and home-cooked Kerala food.",
        district: "Alappuzha",
        latitude: 9.6000,
        longitude: 76.3000,
        images: ["https://images.unsplash.com/photo-1499793983690-31649f80164e?auto=format&fit=crop&w=1200&q=80"],
        price: 2500,
        amenities: ["Beach Access", "Home Food", "Cycles"],
        ratingAvg: 4.7,
        status: "approved"
    },
    {
        name: "The Rice Boat",
        type: "restaurant",
        description: "Fine dining restaurant modeled after a traditional rice boat, serving the freshest seafood in Kochi.",
        district: "Ernakulam",
        latitude: 9.9656,
        longitude: 76.2421,
        images: ["https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80"],
        price: 3500,
        amenities: ["Fine Dining", "Waterfront View", "Wine Menu"],
        ratingAvg: 4.7,
        status: "approved"
    }
];

const sampleEvents = [
    {
        title: "Thrissur Pooram",
        description: "Known as the 'Festival of Festivals', it features grand elephant processions and mesmerizing fireworks in a massive spiritual gathering.",
        category: "Festival",
        district: "Thrissur",
        venue: "Vadakkunnathan Temple Ground",
        startDate: new Date("2026-04-26"),
        endDate: new Date("2026-04-27"),
        time: "Whole Day",
        images: ["https://images.unsplash.com/photo-1582234032338-34824874d6c7?auto=format&fit=crop&w=1200&q=80"],
        status: "approved"
    },
    {
        title: "Nehru Trophy Boat Race",
        description: "The famous snake boat race held on Punnamada Lake, where massive boats compete to the rhythm of high-energy vanchipattu.",
        category: "Cultural",
        district: "Alappuzha",
        venue: "Punnamada Lake",
        startDate: new Date("2026-08-08"),
        endDate: new Date("2026-08-08"),
        time: "2:00 PM - 5:00 PM",
        images: ["https://images.unsplash.com/photo-1626297394991-38914c8106d4?auto=format&fit=crop&w=1200&q=80"],
        status: "approved"
    },
    {
        title: "Kochi-Muziris Biennale",
        description: "India's largest contemporary art exhibition, showcasing international and local artists across multiple historical venues in Kochi.",
        category: "Festival",
        district: "Ernakulam",
        venue: "Fort Kochi & Mattancherry",
        startDate: new Date("2026-12-12"),
        endDate: new Date("2027-04-10"),
        time: "10:00 AM - 6:00 PM",
        images: ["https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80"],
        status: "approved"
    },
    {
        title: "Onam Festival Week",
        description: "The harvest festival of Kerala celebrated with flower carpets (Pookalam), grand feasts (Sadya), and traditional dance forms like Pulikali.",
        category: "Festival",
        district: "Statewide",
        venue: "All major cities",
        startDate: new Date("2026-08-25"),
        endDate: new Date("2026-09-02"),
        time: "Various Times",
        images: ["https://images.unsplash.com/photo-1582234032338-34824874d6c7?auto=format&fit=crop&w=1200&q=80"],
        status: "approved"
    },
    {
        title: "Kalaripayattu Night",
        description: "A showcase of Kerala's ancient martial arts, featuring gravity-defying moves and weapon demonstrations by experts.",
        category: "Cultural",
        district: "Wayanad",
        venue: "Kalari Center",
        startDate: new Date("2026-02-15"),
        endDate: new Date("2026-02-15"),
        time: "6:00 PM - 7:30 PM",
        images: ["https://images.unsplash.com/photo-1582234032338-34824874d6c7?auto=format&fit=crop&w=1200&q=80"],
        status: "approved"
    },
    {
        title: "Kerala Food Festival",
        description: "Savor the spices! A massive food festival bringing together flavors from Malabar, Central Travancore, and the coast.",
        category: "Food",
        district: "Thiruvananthapuram",
        venue: "Kanakakunnu Palace Grounds",
        startDate: new Date("2026-03-10"),
        endDate: new Date("2026-03-15"),
        time: "4:00 PM - 10:00 PM",
        images: ["https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=1200&q=80"],
        status: "approved"
    },
    {
        title: "Music On The Beach",
        category: "Music",
        description: "A sunset music concert featuring local indie bands and folk fusion artists right on the Kochi coastline.",
        district: "Ernakulam",
        venue: "Cherai Beach",
        startDate: new Date("2026-01-30"),
        endDate: new Date("2026-01-30"),
        time: "5:00 PM - 10:00 PM",
        images: ["https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80"],
        status: "approved"
    },
    {
        title: "Spice Plantation Tour",
        category: "Workshops",
        description: "A hands-on workshop learning about spice cultivation, processing, and the medicinal uses of Kerala's famous black gold.",
        district: "Idukki",
        venue: "Munnar Spice Gardens",
        startDate: new Date("2026-02-10"),
        endDate: new Date("2026-02-10"),
        time: "9:00 AM - 1:00 PM",
        images: ["https://images.unsplash.com/photo-1590510328503-903069695d38?auto=format&fit=crop&w=1200&q=80"],
        status: "approved"
    },
    {
        title: "Sufi Music Night",
        category: "Music",
        description: "An evening of spiritual Sufi music in the heart of Malabar, celebrating the cultural harmony of the region.",
        district: "Kozhikode",
        venue: "Town Hall",
        startDate: new Date("2026-03-20"),
        endDate: new Date("2026-03-20"),
        time: "7:00 PM - 11:00 PM",
        images: ["https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80"],
        status: "approved"
    },
    {
        title: "Ayurveda Expo",
        category: "Cultural",
        description: "A grand exhibition of Kerala's healing science, featuring free consultations, organic bazaar, and wellness workshops.",
        district: "Kottayam",
        venue: "Residency Grounds",
        startDate: new Date("2026-02-05"),
        endDate: new Date("2026-02-08"),
        time: "10:00 AM - 8:00 PM",
        images: ["https://images.unsplash.com/photo-1540555700478-4be289aefcf1?auto=format&fit=crop&w=1200&q=80"],
        status: "approved"
    }
];

async function seed() {
    try {
        await connectDB();
        console.log("Connected to MongoDB for universal seeding...");

        // Clear existing data
        await Place.deleteMany({});
        console.log("Cleared Places");
        await Stay.deleteMany({});
        console.log("Cleared Stays");
        await Event.deleteMany({});
        console.log("Cleared Events");

        // Seed
        const seededPlaces = await Place.insertMany(samplePlaces);
        console.log(`✅ Seeded ${seededPlaces.length} Places`);

        const seededStays = await Stay.insertMany(sampleStays);
        console.log(`✅ Seeded ${seededStays.length} Stays`);

        const seededEvents = await Event.insertMany(sampleEvents);
        console.log(`✅ Seeded ${seededEvents.length} Events`);

        console.log("\n🚀 UNIVERSAL SEEDING COMPLETED SUCCESSFULLY!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
}

seed();
