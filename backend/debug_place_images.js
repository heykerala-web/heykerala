const mongoose = require('mongoose');
require('dotenv').config();

async function debug() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const Place = mongoose.model('Place', new mongoose.Schema({
            name: String,
            image: String,
            images: [String]
        }));

        const names = ["Gavi", "Thekkady (Periyar)", "Vagamon", "Athirappilly Waterfalls"];

        for (const name of names) {
            const cleanName = name.replace(/\([^)]*\)/g, '').trim();
            const place = await Place.findOne({
                $or: [
                    { name: { $regex: new RegExp('^' + name + '$', 'i') } },
                    { name: { $regex: new RegExp('^' + cleanName + '$', 'i') } }
                ]
            });

            if (place) {
                console.log(`PLACE: ${place.name}`);
                console.log(`- image: ${place.image}`);
                console.log(`- images: ${JSON.stringify(place.images)}`);
            } else {
                console.log(`PLACE: ${name} NOT FOUND`);
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        mongoose.connection.close();
    }
}

debug();
