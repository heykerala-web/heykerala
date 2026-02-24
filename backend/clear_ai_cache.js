const mongoose = require('mongoose');
require('dotenv').config();

async function clearCache() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const Cache = mongoose.model('AIRecommendCache', new mongoose.Schema({
            category: String,
            result: Array
        }, { collection: 'airecommendcaches' }));

        const result = await Cache.deleteMany({});
        console.log(`CLEARED CACHE: Deleted ${result.deletedCount} items.`);
    } catch (e) {
        console.error(e);
    } finally {
        mongoose.connection.close();
    }
}

clearCache();
