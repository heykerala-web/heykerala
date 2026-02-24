import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import Place from "../models/Place";
import Stay from "../models/Stay";
import Event from "../models/Event";
import { updateTargetRating } from "../utils/reviewUtils";

// Load env from backend root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const updateRatings = async () => {
    let connection;
    try {
        const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/heykerala_dev";
        console.log("Connecting to:", mongoUri);

        connection = await mongoose.connect(mongoUri);
        console.log("Connected to DB");

        const items = [
            { model: Place, type: "place" },
            { model: Stay, type: "stay" },
            { model: Event, type: "event" }
        ];

        for (const { model, type } of items) {
            console.log(`\nUpdating ratings for all ${type}s...`);
            const documents = await model.find({});
            console.log(`Found ${documents.length} ${type}s.`);

            for (const doc of documents) {
                console.log(`  Updating ${type}: ${doc.name || doc.title}...`);
                await updateTargetRating(doc._id.toString(), type);
            }
            console.log(`Finished updating ${type}s.`);
        }

        console.log("\nAll ratings updated successfully!");
    } catch (error) {
        console.error("Error updating ratings:", error);
    } finally {
        if (connection) await mongoose.disconnect();
        process.exit();
    }
};

updateRatings();
