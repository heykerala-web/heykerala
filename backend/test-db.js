const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();

async function checkDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        const places = await db.collection('places').find({ name: /Jain Temple/i }).toArray();
        const amba = await db.collection('places').find({ name: /Ambalavayal/i }).toArray();

        fs.writeFileSync('../output-db.json', JSON.stringify({ places, amba }, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkDB();
