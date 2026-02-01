import dotenv from "dotenv";
dotenv.config();

import User from "../models/User";
import connectDB from "../config/db";
import path from "path";

// Force load env
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function promoteFirstUser() {
    try {
        console.log("Connecting to DB...");
        await connectDB();
        console.log("Connected.");

        const user = await User.findOne({});
        if (!user) {
            console.log("❌ No users found in database! Please register a user first.");
            return;
        }

        console.log(`Found user: ${user.name} (${user.email})`);
        console.log(`Current Role: ${user.role}`);

        user.role = "Admin";
        await user.save();

        console.log(`✅ Successfully promoted ${user.name} (${user.email}) to Admin!`);
        console.log("Try logging in explicitly or refreshing the admin page.");

    } catch (error: any) {
        console.error("Error promoting user:", error);
    } finally {
        process.exit(0);
    }
}

// Run if called directly
if (require.main === module) {
    promoteFirstUser();
}
