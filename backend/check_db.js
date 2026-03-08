const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const categories = await mongoose.connection.db.collection('places').distinct('category');
        console.log('CATEGORIES:', JSON.stringify(categories));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
run();
