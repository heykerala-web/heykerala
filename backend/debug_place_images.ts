import mongoose from "mongoose";
import dotenv from "dotenv";
import Place from "./src/models/Place";
import fs from "fs";
import path from "path";

dotenv.config();

async function debugImages() {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        const names = ["Gavi", "Thekkady (Periyar)", "Vagamon", "Athirappilly Waterfalls"];

        for (const name of names) {
            const cleanName = name.replace(/\([^)]*\)/g, '').trim();
            const place = await Place.findOne({
                $or: [
                    { name: { $regex: new RegExp(`^${name}$`, 'i') } },
                    { name: { $regex: new RegExp(`^${cleanName}$`, 'i') } }
                ]
            });

            if (place) {
                const imgPath = place.image || (place.images && place.images[0]);
                console.log(`PLACE: ${place.name}`);
                console.log(`- Image Path: ${imgPath}`);

                if (imgPath && imgPath.startsWith('/uploads')) {
                    const fullPath = path.join(process.cwd(), imgPath);
                    console.log(`- File Exists: ${fs.existsSync(fullPath)} (${fullPath})`);
                } else {
                    console.log(`- Not a local upload path.`);
                }
            } else {
                console.log(`PLACE: ${name} NOT FOUND IN DB`);
            }
        }
    } catch (err) {
        console.error("Debug failed:", err.message);
    } finally {
        process.exit();
    }
}

debugImages();
