import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db";
import Place from "../models/Place";

dotenv.config();

async function test() {
    try {
        console.log("Connecting to DB...");
        await connectDB();
        console.log("Connected.");

        const count = await Place.countDocuments();
        console.log(`Total Places: ${count}`);

        const missing = await Place.countDocuments({
            $or: [
                { image: { $exists: false } },
                { image: "" },
                { image: null },
                { images: { $size: 0 } }
            ]
        });
        console.log(`Places missing images: ${missing}`);

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

test();
