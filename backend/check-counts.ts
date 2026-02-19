import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Place from './src/models/Place';
import Stay from './src/models/Stay';

dotenv.config();

const checkCounts = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI not found");
        }
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('Connected to MongoDB');

        const placeCount = await Place.countDocuments();
        const stayCount = await Stay.countDocuments();

        console.log(`Total Places: ${placeCount}`);
        console.log(`Total Stays: ${stayCount}`);

        if (placeCount > 50 && stayCount > 50) {
            console.log('✅ Database appears to be well-seeded.');
        } else {
            console.log('⚠️ Database counts are lower than expected.');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error checking counts:', err);
        process.exit(1);
    }
};

checkCounts();
