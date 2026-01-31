
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User";

dotenv.config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("Connected to DB");

        const users = await User.find({}, "name email role");
        console.log(JSON.stringify(users, null, 2));

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkUsers();
