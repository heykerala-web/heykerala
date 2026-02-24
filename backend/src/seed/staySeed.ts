import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import Stay from "../models/Stay";

// Try loading env from root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const staysData = [
    {
        name: "Grand Hyatt Kochi",
        type: "hotel",
        description: "Luxury hotel overlooking the backwaters of Kochi. Features multiple dining options, a large pool, and event spaces.",
        district: "Kochi",
        price: 12000,
        images: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"],
        amenities: ["Wifi", "Pool", "Parking", "AC", "Restaurant"],
        ratingAvg: 5.0,
        rooms: [
            { roomType: "King Room", price: 12000, maxGuests: 2, availableCount: 5 },
            { roomType: "Suite", price: 25000, maxGuests: 4, availableCount: 2 }
        ]
    },
    {
        name: "Vythiri Resort Wayanad",
        type: "resort",
        description: "A jungle getaway in the heart of Wayanad rainforests. Treehouses and cottages available.",
        district: "Wayanad",
        price: 15000,
        images: ["/stay/vythiri-mist-resort.jpg"],
        amenities: ["Wifi", "Pool", "Spa", "Trekking"],
        ratingAvg: 5.0,
        rooms: [
            { roomType: "Cottage", price: 15000, maxGuests: 2, availableCount: 3 },
            { roomType: "Treehouse", price: 22000, maxGuests: 2, availableCount: 1 }
        ]
    },
    {
        name: "Paragon Restaurant",
        type: "restaurant",
        description: "The most famous biryani spot in Kozhikode. Authentic Malabar flavors.",
        district: "Kozhikode",
        price: 500,
        images: ["/stay/paragonrestaurant.jpg"],
        amenities: ["AC", "Parking"],
        ratingAvg: 5.0,
        rooms: []
    },
    {
        name: "Munnar Tea Hills Resort",
        type: "resort",
        description: "Surrounded by tea gardens, offering a misty and cool vacation experience.",
        district: "Munnar",
        price: 8000,
        images: ["/stay/munnar-teahills.jpg"],
        amenities: ["Wifi", "Breakfast", "View"],
        ratingAvg: 5.0,
        rooms: [
            { roomType: "Standard Room", price: 8000, maxGuests: 2, availableCount: 10 }
        ]
    },
    {
        name: "Fort Kochi Homestay",
        type: "homestay",
        description: "Experience local life in this charming heritage home in Fort Kochi.",
        district: "Kochi",
        price: 2500,
        images: ["/stay/fort-kochihomestay.jpg"],
        amenities: ["Wifi", "Kitchen", "Breakfast"],
        ratingAvg: 5.0,
        rooms: [
            { roomType: "Standard Room", price: 2500, maxGuests: 2, availableCount: 2 }
        ]
    },
    {
        name: "Kashi Art Cafe",
        type: "cafe",
        description: "Arts, coffee, and delicious continental food in a relaxed gallery setting.",
        district: "Kochi",
        price: 600,
        images: ["/stay/kashi-art-cafe..jpg"],
        amenities: ["Wifi", "Art Gallery"],
        ratingAvg: 5.0
    },
    {
        name: "The Raviz Ashtamudi",
        type: "resort",
        description: "Traditional architecture meets modern luxury on the banks of Ashtamudi Lake.",
        district: "Kollam",
        price: 11000,
        images: ["/stay/the-ravizashtamudi.jpg"],
        amenities: ["Pool", "Boating", "Spa", "Wifi"],
        ratingAvg: 5.0,
        rooms: [
            { roomType: "Lake View Room", price: 11000, maxGuests: 2, availableCount: 5 }
        ]
    },
    {
        name: "Dhe Puttu",
        type: "restaurant",
        description: "Specializing in various types of Puttu, a Kerala breakfast staple.",
        district: "Kochi",
        price: 400,
        images: ["/stay/dhe-puttu.jpg"],
        amenities: ["AC", "Family Friendly"],
        ratingAvg: 5.0
    },
    {
        name: "Varkala Cliff Resort",
        type: "resort",
        description: "Stunning views of the Arabian Sea from the famous Varkala Cliff.",
        district: "Varkala",
        price: 5000,
        images: ["/stay/varkala-cliffresort.webp"],
        amenities: ["Beach Access", "Wifi", "Restaurant"],
        ratingAvg: 5.0,
        rooms: [
            { roomType: "Cliff View Room", price: 5000, maxGuests: 2, availableCount: 4 }
        ]
    },
    {
        name: "Thakkaram Restaurant",
        type: "restaurant",
        description: "A themed restaurant offering wide varieties of Malabar cuisine.",
        district: "Kannur",
        price: 550,
        images: ["/stay/thakkaramrestaurant.jpg"],
        amenities: ["Themed Decor", "AC"],
        ratingAvg: 5.0
    }
];

const seedStays = async () => {
    let connection;
    try {
        const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/heykerala_dev"; // Use env if available
        console.log("Connecting to:", mongoUri);

        connection = await mongoose.connect(mongoUri);
        console.log("Connected to DB");

        const count = await Stay.countDocuments();
        if (count > 0) {
            console.log(`DB already has ${count} stays. Skipping seed.`);
        } else {
            console.log("Seeding stays...");
            await Stay.insertMany(staysData);
            console.log("Seeded " + staysData.length + " stays.");
        }
    } catch (error) {
        console.error("Error seeding stays:", error);
    } finally {
        if (connection) await mongoose.disconnect();
        process.exit();
    }
};

seedStays();
