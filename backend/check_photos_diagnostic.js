
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const PlacePhotoSchema = new mongoose.Schema({
    image: String,
    status: String,
    user: mongoose.Schema.Types.ObjectId,
    place: mongoose.Schema.Types.ObjectId,
    event: mongoose.Schema.Types.ObjectId,
    createdAt: Date
}, { timestamps: true });

const PlacePhoto = mongoose.models.PlacePhoto || mongoose.model('PlacePhoto', PlacePhotoSchema);

async function checkPhotos() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/heykerala');
        console.log('Connected successfully');

        const count = await PlacePhoto.countDocuments();
        console.log(`Total photos: ${count}`);

        const photos = await PlacePhoto.find().sort({ createdAt: -1 }).limit(10);
        console.log('Recent 10 photos:');
        photos.forEach((p, idx) => {
            console.log(`[${idx}] ID: ${p._id}`);
            console.log(`    Image: ${p.image}`);
            console.log(`    Status: ${p.status}`);
            console.log(`    CreatedAt (Raw): ${p.createdAt}`);
            console.log(`    CreatedAt (ISO): ${p.createdAt ? p.createdAt.toISOString() : 'MISSING'}`);
            console.log(`    Has User: ${!!p.user}`);
            console.log(`    Has Target (Place/Event): ${!!p.place || !!p.event}`);
            console.log('---');
        });

        await mongoose.disconnect();
        console.log('Disconnected');
    } catch (err) {
        console.error('Error during diagnostic:');
        console.error(err);
    }
}

checkPhotos();
