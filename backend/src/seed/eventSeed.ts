import dotenv from "dotenv";
dotenv.config();

import Event from "../models/Event";
import connectDB from "../config/db";

const sampleEvents = [
    {
        title: "Onam Festival Celebration",
        description: "Traditional dance, music, pookalam and sumptuous feast celebrating Kerala's grand festival. Experience the vibrant culture and traditions of Kerala during this harvest festival.",
        category: "Festival",
        district: "Thiruvananthapuram",
        venue: "Kanakakunnu Palace",
        startDate: new Date("2025-08-29"),
        endDate: new Date("2025-08-29"),
        time: "10:00 AM",
        images: ["https://images.unsplash.com/photo-1582234032338-34824874d6c7?auto=format&fit=crop&w=1200&q=80"],
        latitude: 8.5115,
        longitude: 76.9538,
        status: 'approved'
    },
    {
        title: "Theyyam Performance",
        description: "Witness the breathtaking ritual art form of North Kerala in its full grandeur. A divine dance performance where performers impersonate deities.",
        category: "Cultural",
        district: "Kannur",
        venue: "Parassinikadavu Muthappan Temple",
        startDate: new Date("2025-09-15"),
        endDate: new Date("2025-09-15"),
        time: "7:00 PM",
        images: ["https://images.unsplash.com/photo-1579227114347-15d08fc37cae?auto=format&fit=crop&w=1200&q=80"],
        latitude: 11.9890,
        longitude: 75.4057,
        status: 'approved'
    },
    {
        title: "Boat Race Championship",
        description: "Thrilling snake boat races and crowds cheering along the serene backwaters. Watch the majestic snake boats compete in the Punnamada Lake.",
        category: "Sports",
        district: "Alappuzha",
        venue: "Punnamada Lake",
        startDate: new Date("2025-10-12"),
        endDate: new Date("2025-10-12"),
        time: "2:00 PM",
        images: ["https://images.unsplash.com/photo-1626297394991-38914c8106d4?auto=format&fit=crop&w=1200&q=80"],
        latitude: 9.5015,
        longitude: 76.3538,
        status: 'approved'
    },
    {
        title: "Spice Festival",
        description: "Dive into Kerala's spices, aromas and culinary showcases by local artisans. Explore the spice plantations and learn about the spice trade history.",
        category: "Food",
        district: "Idukki",
        venue: "Kumily Spice Garden",
        startDate: new Date("2025-11-05"),
        endDate: new Date("2025-11-05"),
        time: "09:00 AM",
        images: ["https://images.unsplash.com/photo-1590510328503-903069695d38?auto=format&fit=crop&w=1200&q=80"],
        latitude: 9.6083,
        longitude: 77.1706,
        status: 'approved'
    }
];

export async function seedEvents() {
    try {
        await connectDB();
        console.log("Connected to MongoDB for Events Seed");

        // Clear existing events
        await Event.deleteMany({});
        console.log("Cleared existing events");

        // Insert sample events
        const insertedEvents = await Event.insertMany(sampleEvents);
        console.log(`✅ Seeded ${insertedEvents.length} events successfully!`);

        return insertedEvents;
    } catch (error: any) {
        console.error("Error seeding events:", error);
        throw error;
    }
}

// Run if called directly
if (require.main === module) {
    seedEvents()
        .then(() => {
            console.log("Event seeding completed!");
            process.exit(0);
        })
        .catch((error) => {
            console.error("Event seeding failed:", error);
            process.exit(1);
        });
}
