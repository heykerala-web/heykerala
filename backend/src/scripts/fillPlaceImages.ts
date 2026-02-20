import dotenv from "dotenv";
import connectDB from "../config/db";
import Place from "../models/Place";
import { generateTourismImage } from "../utils/imageAIUtils";

dotenv.config();

/**
 * Script to find places without images and generate them using AI.
 */
async function fillMissingImages() {
    try {
        console.log("1. Starting connectDB...");
        await connectDB();
        console.log("2. Connected to DB.");

        console.log("3. Querying places...");
        const places = await Place.find({
            $or: [
                { image: { $exists: false } },
                { image: "" },
                { image: null },
                { images: { $size: 0 } }
            ]
        });
        console.log(`4. Found ${places.length} places missing images.`);

        if (places.length === 0) {
            console.log("✅ No places to process.");
            process.exit(0);
        }

        const limit = 1; // Start with JUST ONE to verify it works and check costs/credits
        const toProcess = places.slice(0, limit);
        console.log(`5. Selected ${toProcess.length} place(s) for processing.`);

        for (const place of toProcess) {
            console.log(`\n🔹 Processing ${place.name} (Status: ${place.status})...`);
            const imageUrl = await generateTourismImage(place.name);

            if (imageUrl) {
                console.log(`   ✅ Image generated: ${imageUrl.substring(0, 60)}...`);
                place.image = imageUrl;
                if (!place.images) place.images = [];
                place.images.push(imageUrl);

                console.log(`   💾 Saving to DB...`);
                await place.save();
                console.log(`   ✅ Saved.`);
            } else {
                console.warn(`   ❌ Generation failed.`);
            }
        }

        console.log(`\n✨ Finished processing ${toProcess.length} places.`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Error running fillPlaceImages script:", error);
        process.exit(1);
    }
}

fillMissingImages();
