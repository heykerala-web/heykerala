const mongoose = require('mongoose');
require('dotenv').config();

const approveAll = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const collections = ['places', 'events', 'stays'];
        for (const colName of collections) {
            const collection = mongoose.connection.db.collection(colName);
            const result = await collection.updateMany(
                { status: { $ne: 'approved' } },
                { $set: { status: 'approved' } }
            );
            console.log(`Collection ${colName}: Updated ${result.modifiedCount} documents to approved.`);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

approveAll();
