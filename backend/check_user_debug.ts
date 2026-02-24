import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User";

dotenv.config();

async function checkUser() {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        const email = "info.binsway@gmail.com";
        const user = await User.findOne({ email });
        if (user) {
            console.log(`USER_EXISTS: ${email} found with role ${user.role}`);
        } else {
            console.log(`USER_NOT_FOUND: ${email}`);
        }
    } catch (err) {
        console.error("Error checking user:", err.message);
    } finally {
        process.exit();
    }
}

checkUser();
