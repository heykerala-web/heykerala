
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const PlacePhotoSchema = new mongoose.Schema({
    image: String,
    status: String,
    createdAt: Date
}, { timestamps: true });

const PlacePhoto = mongoose.models.PlacePhoto || mongoose.model('PlacePhoto', PlacePhotoSchema);

async function checkPhotos() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/heykerala');
        console.log('Connected to DB');

        const photos = await PlacePhoto.find().sort({ createdAt: -1 }).limit(5);
        console.log('Recent 5 photos:');
        photos.forEach(p => {
            console.log(`ID: ${p._id}, Image: ${p.image}, Status: ${p.status}, CreatedAt: ${p.createdAt}`);
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkPhotos();
