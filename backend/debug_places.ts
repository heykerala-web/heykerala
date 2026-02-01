import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Place from './src/models/Place';

dotenv.config();

const debug = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('Connected to Atlas');
        console.log('Host:', mongoose.connection.host);
        console.log('Database:', mongoose.connection.name);

        const count = await Place.countDocuments();
        console.log('Total Places:', count);

        const query = {
            $or: [{ status: 'approved' }, { status: { $exists: false } }]
        };
        const places = await Place.find(query).limit(1);
        console.log('Sample Place:', JSON.stringify(places, null, 2));

        process.exit(0);
    } catch (err) {
        console.error('Debug Error:', err);
        process.exit(1);
    }
};

debug();
