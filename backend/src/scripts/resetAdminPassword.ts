import dotenv from "dotenv";
dotenv.config();

import User from "../models/User";
import connectDB from "../config/db";
import bcrypt from "bcryptjs";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function resetAdminPassword() {
    try {
        await connectDB();
        const email = "binsway@gmail.com";
        const user = await User.findOne({ email });

        if (!user) {
            console.log("User not found!");
            return;
        }

        const newPassword = "admin123";
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        console.log(`✅ Password for ${email} has been reset to: ${newPassword}`);

    } catch (error) {
        console.error(error);
    } finally {
        process.exit(0);
    }
}

if (require.main === module) {
    resetAdminPassword();
}
