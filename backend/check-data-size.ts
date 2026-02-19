import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Place from './src/models/Place';

dotenv.config();

const checkDataSize = async () => {
    try {
        if (!process.env.MONGO_URI) throw new Error("MONGO_URI not found");
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Check for suspicious image lengths (potential base64)
        const places = await Place.find({}).select('name images');

        let largeImageCount = 0;
        let largeDocCount = 0;

        for (const place of places) {
            // Check images
            for (const img of place.images) {
                if (img.length > 2000) { // URL shouldn't be > 2000 chars typically
                    console.log(`⚠️ Massive image string found in ${place.name}: ${img.substring(0, 50)}... (${img.length} chars)`);
                    largeImageCount++;
                }
            }
        }

        if (largeImageCount === 0) {
            console.log("✅ No massive image strings (Base64) found.");
        }

        console.log("Checked " + places.length + " places.");
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

checkDataSize();
