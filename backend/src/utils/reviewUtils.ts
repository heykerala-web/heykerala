import mongoose from "mongoose";
import Review from "../models/Review";
import Place from "../models/Place";
import Stay from "../models/Stay";
import Event from "../models/Event";

export const getModelByType = (targetType: string) => {
    switch (targetType) {
        case "place": return Place;
        case "stay": return Stay;
        case "event": return Event;
        default: return null;
    }
};

export const updateTargetRating = async (targetId: string, targetType: string) => {
    const TargetModel = getModelByType(targetType);
    if (!TargetModel) return;

    const stats = await Review.aggregate([
        { $match: { targetId: new mongoose.Types.ObjectId(targetId), targetType } },
        {
            $group: {
                _id: "$targetId",
                ratingAvg: { $avg: "$rating" },
                ratingCount: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        const { ratingAvg, ratingCount } = stats[0];
        const roundedRating = parseFloat(ratingAvg.toFixed(1));
        await TargetModel.findByIdAndUpdate(targetId, {
            ratingAvg: roundedRating,
            ratingCount: ratingCount,
            ...(targetType === "place" ? { totalReviews: ratingCount } : {})
        });
        return { ratingAvg: roundedRating, ratingCount };
    } else {
        // Default to 5.0 if no reviews exist
        await TargetModel.findByIdAndUpdate(targetId, {
            ratingAvg: 5.0,
            ratingCount: 0,
            ...(targetType === "place" ? { totalReviews: 0 } : {})
        });
        return { ratingAvg: 5.0, ratingCount: 0 };
    }
};
