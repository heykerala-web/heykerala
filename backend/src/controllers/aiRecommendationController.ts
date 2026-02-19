import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Place from "../models/Place";
import User from "../models/User";
import mongoose from "mongoose";

export const getRecommendations = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;
        const { weather } = req.query; // e.g. "Rainy", "Sunny", "Hot"
        let recommendations: any[] = [];

        // Logic for weather-aware filtering
        let weatherFilter: any = {};
        if (weather === "Rainy") {
            weatherFilter = { category: { $in: ["Museum", "Art Gallery", "Cafe", "Temple"] } };
        } else if (weather === "Sunny") {
            weatherFilter = { category: { $in: ["Beach", "Hill Station", "Wildlife", "Trekking"] } };
        }

        if (user) {
            // Logic for logged-in users: Recommend based on saved items
            const savedPlaceIds = user.savedPlaces || [];

            // Get categories of saved items
            const savedPlaces = await Place.find({ _id: { $in: savedPlaceIds } }).select("category tags");
            const categories = [...new Set(savedPlaces.map(p => p.category))];
            const tags = [...new Set(savedPlaces.flatMap(p => p.tags))];

            // Find places in same categories or with same tags, excluding already saved ones
            recommendations = await Place.find({
                $and: [
                    {
                        $or: [
                            { category: { $in: categories } },
                            { tags: { $in: tags } }
                        ]
                    },
                    weatherFilter, // Apply weather filter if exists
                    { _id: { $nin: savedPlaceIds } },
                    { status: "approved" }
                ]
            })
                .sort({ ratingAvg: -1 })
                .limit(6);
        }

        // Fallback or guest
        if (recommendations.length < 4) {
            const fallbackQuery = {
                status: "approved",
                ...weatherFilter
            };

            const topRated = await Place.find(fallbackQuery)
                .sort({ ratingAvg: -1, ratingCount: -1 })
                .limit(8);

            // Combine and remove duplicates
            const recIds = new Set(recommendations.map(r => r._id.toString()));
            topRated.forEach(p => {
                if (!recIds.has(p._id.toString()) && recommendations.length < 8) {
                    recommendations.push(p);
                }
            });
        }

        // Final fallback if weather filter was too strict
        if (recommendations.length < 2 && Object.keys(weatherFilter).length > 0) {
            const unrestricted = await Place.find({ status: "approved" }).sort({ ratingAvg: -1 }).limit(4);
            unrestricted.forEach(p => {
                const recIds = new Set(recommendations.map(r => r._id.toString()));
                if (!recIds.has(p._id.toString()) && recommendations.length < 8) {
                    recommendations.push(p);
                }
            });
        }

        res.status(200).json(recommendations);
    } catch (error: any) {
        console.error("AI Recommendation Error:", error);
        res.status(500).json({ message: "Failed to fetch recommendations", error: error.message });
    }
};
