
import mongoose from "mongoose";
import Event from "./src/models/Event";
import dotenv from "dotenv";

dotenv.config();

const checkEvents = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/heykerala_dev");
        console.log("Connected");
        const events = await Event.find({});
        console.log("Events found:", events.length);
        if (events.length > 0) {
            console.log("Sample ID:", events[0]._id.toString());
        }
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkEvents();
