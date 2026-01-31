
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User";

dotenv.config();

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("Connected to DB");

        const email = "info.binsway@gmail.com";
        const user = await User.findOne({ email });

        if (!user) {
            console.log("User not found: " + email);
            process.exit(1);
        }

        user.role = "Admin";
        await user.save();
        console.log(`User ${user.email} promoted to Admin successfully.`);

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

makeAdmin();
