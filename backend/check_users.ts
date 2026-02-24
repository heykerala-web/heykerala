import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import User from "./src/models/User";
import connectDB from "./src/config/db";

async function checkUsers() {
    try {
        await connectDB();
        const users = await User.find({}, 'name email role');
        console.log("Found Users:", users.length);
        console.log(JSON.stringify(users, null, 2));
        process.exit(0);
    } catch (err) {
        console.error("Error:", err.message);
        process.exit(1);
    }
}

checkUsers();
