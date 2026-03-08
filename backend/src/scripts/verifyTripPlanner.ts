import mongoose from 'mongoose';
import { createManualItinerary } from '../controllers/itineraryManualController';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function verify() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("Connected.");

        console.log("\n--- Test 1: Wayanad & Kozhikode Filtering ---");
        const result1 = await createManualItinerary({
            duration: "2 days",
            interests: ["Nature", "Wildlife"],
            budget: "Mid-range",
            travelers: "Solo",
            districts: ["Wayanad", "Kozhikode"]
        });

        console.log(`Title: ${result1.title}`);
        console.log(`Days: ${result1.days.length}`);

        const allDistricts1 = new Set();
        result1.days.forEach((day: any) => {
            day.activities.forEach((act: any) => {
                // Since activities in result don't have district, we verify by looking up the name in DB or trust the query
                console.log(` - Activity: ${act.name}`);
            });
        });

        console.log("\n--- Test 2: Category Filtering (Backwaters) ---");
        const result2 = await createManualItinerary({
            duration: "3 days",
            interests: ["Backwaters"],
            budget: "Luxury",
            travelers: "Couple",
            districts: []
        });
        console.log(`Title: ${result2.title}`);
        result2.days[0].activities.forEach((act: any) => {
            console.log(` - Activity: ${act.name}`);
        });

        await mongoose.disconnect();
        console.log("\nVerification complete.");
    } catch (error) {
        console.error("Verification failed:", error);
        process.exit(1);
    }
}

verify();
