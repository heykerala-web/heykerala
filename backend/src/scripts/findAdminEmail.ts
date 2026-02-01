import dotenv from "dotenv";
dotenv.config();

import User from "../models/User";
import connectDB from "../config/db";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function findAdmin() {
    try {
        await connectDB();
        const admin = await User.findOne({ role: "Admin" });
        if (admin) {
            console.log(`\n✅ Admin User Found:`);
            console.log(`Email: ${admin.email}`);
            console.log(`Name: ${admin.name}`);
        } else {
            console.log("\n❌ No Admin found.");
        }
    } catch (error) {
        console.error(error);
    } finally {
        process.exit(0);
    }
}

if (require.main === module) {
    findAdmin();
}
