import dotenv from "dotenv";
dotenv.config();

import User from "../models/User";
import connectDB from "../config/db";

// Force load env if not picked up
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function checkAdmin() {
    try {
        console.log("Connecting to DB...");
        await connectDB();
        console.log("Connected to MongoDB");

        const users = await User.find({}, "name email role");
        console.log("\n--- User List ---");
        console.table(users.map(u => ({ id: u._id, name: u.name, email: u.email, role: u.role })));

        const adminCount = users.filter(u => u.role === "Admin").length;
        console.log(`\nTotal Users: ${users.length}`);
        console.log(`Admin Users: ${adminCount}`);

        if (adminCount === 0) {
            console.log("\n⚠️ No Admin user found! You should create one or update an existing user.");
        }

    } catch (error: any) {
        console.error("Error checking users:", error);
    } finally {
        process.exit(0);
    }
}

// Run if called directly
if (require.main === module) {
    checkAdmin();
}
