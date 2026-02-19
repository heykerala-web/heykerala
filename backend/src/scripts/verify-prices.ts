import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import connectDB from "../config/db";
import Place from "../models/Place";

(async () => {
    try {
        await connectDB();
        const stats = await Place.aggregate([
            { $group: { _id: "$priceLevel", count: { $sum: 1 } } }
        ]);
        console.log("Price Level Stats:", JSON.stringify(stats, null, 2));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();
