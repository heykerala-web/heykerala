const mongoose = require('mongoose');
require('dotenv').config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const collections = ['places', 'events', 'stays'];
        for (const colName of collections) {
            const collection = mongoose.connection.db.collection(colName);
            const count = await collection.countDocuments();
            console.log(`Collection ${colName}: Total = ${count}`);

            const statuses = await collection.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]).toArray();
            console.log(`Statuses for ${colName}:`, JSON.stringify(statuses, null, 2));
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

check();
