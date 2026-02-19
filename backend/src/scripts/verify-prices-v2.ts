import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import connectDB from "../config/db";
import Place from "../models/Place";

(async () => {
    try {
        await connectDB();

        console.log("Connected. Verifying Price Levels...");

        const totalPlaces = await Place.countDocuments();
        console.log(`Total Places: ${totalPlaces}`);

        const stats = await Place.aggregate([
            { $group: { _id: "$priceLevel", count: { $sum: 1 }, names: { $push: "$name" } } }
        ]);

        console.log("\nPrice Level Distribution:");
        stats.forEach(s => {
            console.log(`[${s._id || 'MISSING'}]: ${s.count}`);
            console.log(` - Examples: ${s.names.slice(0, 3).join(", ")}`);
        });

        const missing = await Place.find({ priceLevel: { $exists: false } });
        if (missing.length > 0) {
            console.log(`\n❌ Found ${missing.length} places without priceLevel!`);
            missing.forEach(p => console.log(` - ${p.name}`));
        } else {
            console.log("\n✅ All places have priceLevel field.");
        }

        // Check for 'Low', 'Mid', 'High' confusion?
        // The Model expects: 'Free', 'Cheap', 'Moderate', 'Expensive', 'Luxury'

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();
