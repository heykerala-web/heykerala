
import mongoose from "mongoose";
import dotenv from "dotenv";
import AIRecommendCache from "./src/models/AIRecommendCache";

dotenv.config();

async function clearCache() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("Connected.");

        console.log("Clearing AI Recommendation Cache...");
        const result = await AIRecommendCache.deleteMany({});
        console.log(`Successfully cleared ${result.deletedCount} cache entries.`);

        process.exit(0);
    } catch (error) {
        console.error("Error clearing cache:", error);
        process.exit(1);
    }
}

clearCache();
