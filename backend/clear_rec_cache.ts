import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AIRecommendCache from './src/models/AIRecommendCache';

dotenv.config();

async function clearCache() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/heykerala');
        console.log('Connected to MongoDB');

        const res = await AIRecommendCache.deleteMany({});
        console.log(`Cleared ${res.deletedCount} cache entries`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

clearCache();
