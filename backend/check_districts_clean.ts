import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';
import Place from './src/models/Place';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        const districts = await Place.distinct('district');
        console.log('Districts in DB:', JSON.stringify(districts, null, 2));

        const sample = await Place.findOne({ district: 'Wayanad' });
        console.log('Sample Wayanad place:', sample?.name, 'District field:', sample?.district);

        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
}
check();
