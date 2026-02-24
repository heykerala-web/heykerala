
import mongoose from "mongoose";
import dotenv from "dotenv";
import Place from "./src/models/Place";

dotenv.config();

async function check() {
    await mongoose.connect(process.env.MONGO_URI!);
    const places = await Place.find({ $or: [{ image: "" }, { image: null }, { image: { $exists: false } }] });
    console.log(`Found ${places.length} places with missing images.`);
    places.forEach(p => console.log(`- ${p.name}`));
    process.exit(0);
}

check();
