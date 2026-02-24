const mongoose = require('mongoose');
require('dotenv').config();

async function listAll() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const Place = mongoose.model('Place', new mongoose.Schema({
            name: String,
            image: String,
            images: [String],
            status: String
        }));

        const places = await Place.find({ status: 'approved' });
        console.log(`TOTAL APPROVED PLACES: ${places.length}`);

        places.forEach(p => {
            console.log(`- ${p.name} | Image: ${p.image}`);
        });
    } catch (e) {
        console.error(e);
    } finally {
        mongoose.connection.close();
    }
}

listAll();
