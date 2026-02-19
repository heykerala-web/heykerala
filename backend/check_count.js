const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const PlaceSchema = new mongoose.Schema({}, { strict: false });
const Place = mongoose.model('Place', PlaceSchema);

async function checkCount() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await Place.countDocuments({ status: 'approved' });
        console.log(`Total Approved Places in DB: ${count}`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkCount();
