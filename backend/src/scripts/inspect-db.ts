import dotenv from "dotenv";
import connectDB from "../config/db";
import Place from "../models/Place";

dotenv.config();

async function inspect() {
    try {
        await connectDB();
        const total = await Place.countDocuments();
        const missing = await Place.countDocuments({
            $or: [
                { image: { $exists: false } },
                { image: "" },
                { image: null },
                { images: { $size: 0 } }
            ]
        });
        const approved = await Place.countDocuments({ status: "approved" });
        const approvedMissing = await Place.countDocuments({
            status: "approved",
            $or: [
                { image: { $exists: false } },
                { image: "" },
                { image: null },
                { images: { $size: 0 } }
            ]
        });

        console.log(`Total: ${total}`);
        console.log(`Missing Image: ${missing}`);
        console.log(`Approved: ${approved}`);
        console.log(`Approved but missing image: ${approvedMissing}`);

        if (approvedMissing === 0 && missing > 0) {
            console.log("Found places missing images but they are not approved.");
            const sample = await Place.findOne({
                $or: [
                    { image: { $exists: false } },
                    { image: "" },
                    { image: null },
                    { images: { $size: 0 } }
                ]
            });
            console.log("Sample missing images (status):", sample?.status);
        }

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

inspect();
