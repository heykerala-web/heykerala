import dotenv from "dotenv";
dotenv.config();

import Place from "../models/Place";
import connectDB from "../config/db";
import { extendedPlaces } from "./extendedPlaces";

export async function seedPlaces() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    // Clear existing places
    await Place.deleteMany({});
    console.log("Cleared existing places");

    // Add status: "approved" to all places
    const approvedPlaces = extendedPlaces.map(place => ({
      ...place,
      status: "approved"
    }));

    // Insert sample places
    const insertedPlaces = await Place.insertMany(approvedPlaces);
    console.log(`✅ Seeded ${insertedPlaces.length} places successfully!`);

    return insertedPlaces;
  } catch (error: any) {
    console.error("Error seeding places:", error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedPlaces()
    .then(() => {
      console.log("Seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}






