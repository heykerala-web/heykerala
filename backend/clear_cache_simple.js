import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/heykerala';

async function run() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db();
        const collection = database.collection('airecommendcaches');
        const result = await collection.deleteMany({});
        console.log(`${result.deletedCount} documents were deleted`);
    } finally {
        await client.close();
        process.exit(0);
    }
}
run().catch(console.dir);
