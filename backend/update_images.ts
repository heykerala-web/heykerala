import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import connectDB from "./src/config/db";
import Place from "./src/models/Place";

async function updateImages() {
    try {
        await connectDB();
        console.log("Connected to MongoDB...");

        const updates = [
            { name: "Maravanthuruthu", image: "/places/munroeisland.jpg" },
            { name: "Nelliyampathy Hills", image: "/places/ponmudi.jpg" },
            { name: "Chendamangalam", image: "/places/hill-palacemuseum.webp" }
        ];

        for (const update of updates) {
            const result = await Place.updateOne(
                { name: update.name },
                { $set: { image: update.image, images: [update.image] } }
            );
            if (result.matchedCount > 0) {
                console.log(`✅ Updated ${update.name} with ${update.image}`);
            } else {
                console.log(`⚠️ Could not find place with name: ${update.name}`);
            }
        }

        console.log("Update completed.");
        process.exit(0);
    } catch (error) {
        console.error("Update failed:", error);
        process.exit(1);
    }
}

updateImages();
