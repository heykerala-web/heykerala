import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

async function testPersona() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/heykerala');
        console.log("Connected to MongoDB.");

        const User = mongoose.model('User', new mongoose.Schema({
            savedPlaces: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Place' }],
            persona: String,
            travelInterests: [String]
        }, { strict: false }));
        const Place = mongoose.model('Place', new mongoose.Schema({ name: String, category: String }, { strict: false }));

        let user = await User.findOne({});
        if (!user) {
            console.log("No users found.");
            process.exit(0);
        }

        // Add a mock saved place if empty
        const place = await Place.findOne({});
        if (place && (!user.savedPlaces || user.savedPlaces.length === 0)) {
            user.savedPlaces = [place._id];
            await user.save();
            console.log(`Added test place ${place.name} to user's saved places.`);
        }

        const userId = user._id.toString();
        console.log(`Found user: ${userId}. Testing API...`);

        const url = `http://localhost:5000/api/ai/persona/${userId}`;
        console.log(`GET ${url}`);

        const response = await fetch(url);
        const data = await response.json();

        console.log("\nAPI Status:", response.status);
        console.log("Response Data:");
        console.log(JSON.stringify(data, null, 2));

    } catch (err) {
        console.error("Test error:", err);
    } finally {
        await mongoose.disconnect();
    }
}

testPersona();
