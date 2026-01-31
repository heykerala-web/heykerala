
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const EventSchema = new mongoose.Schema({
    title: String,
    status: String,
    category: String
});
const Event = mongoose.model('Event', EventSchema);

async function checkEvents() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        console.log('Checking all events...');
        const events = await Event.find({});
        console.log(`Total events: ${events.length}`);

        events.forEach(e => {
            console.log(`ID: ${e._id}, Title: ${e.title}, Status: ${e.status}, Category: ${e.category}`);
        });

        console.log('Done.');
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkEvents();
