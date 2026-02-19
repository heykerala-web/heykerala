import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../config/db";
import Place from "../models/Place";
import { generateEmbedding, formatPlaceForEmbedding } from "../utils/embeddingUtils";

async function run() {
    try {
        await connectDB();
        console.log("Connected to MongoDB");

        const places = await Place.find({
            $or: [
                { embedding: { $exists: false } },
                { embedding: { $size: 0 } }
            ]
        });

        console.log(`Found ${places.length} places without embeddings.`);

        for (let i = 0; i < places.length; i++) {
            const place = places[i];
            console.log(`[${i + 1}/${places.length}] Generating embedding for: ${place.name}...`);

            try {
                const text = formatPlaceForEmbedding(place);
                const embedding = await generateEmbedding(text);

                if (embedding && embedding.length > 0) {
                    place.embedding = embedding;
                    await place.save();
                    console.log(`✅ Success`);
                } else {
                    console.log(`❌ Failed (Empty embedding)`);
                }
            } catch (err) {
                console.error(`❌ Error processing ${place.name}:`, err);
            }

            // Brief pause to avoid rate limits
            await new Promise(r => setTimeout(r, 200));
        }

        console.log("Embedding generation complete!");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

run();
