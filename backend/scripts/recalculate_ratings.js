const mongoose = require('mongoose');
require('dotenv').config();

// Define Schemas locally to avoid import issues
const placeSchema = new mongoose.Schema({
    name: String,
    ratingAvg: { type: Number, default: 5 },
    ratingCount: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    status: String
});

const staySchema = new mongoose.Schema({
    name: String,
    ratingAvg: { type: Number, default: 5 },
    ratingCount: { type: Number, default: 0 }
});

const eventSchema = new mongoose.Schema({
    name: String,
    ratingAvg: { type: Number, default: 5 },
    ratingCount: { type: Number, default: 0 }
});

const reviewSchema = new mongoose.Schema({
    targetId: mongoose.Types.ObjectId,
    targetType: String,
    rating: Number
});

const Place = mongoose.model('Place', placeSchema);
const Stay = mongoose.model('Stay', staySchema);
const Event = mongoose.model('Event', eventSchema);
const Review = mongoose.model('Review', reviewSchema);

async function recalculate() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        const models = [
            { model: Place, type: 'place' },
            { model: Stay, type: 'stay' },
            { model: Event, type: 'event' }
        ];

        for (const { model, type } of models) {
            const items = await model.find({});
            console.log(`Processing ${items.length} ${type} items...`);

            for (const item of items) {
                const stats = await Review.aggregate([
                    { $match: { targetId: item._id, targetType: type } },
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
                    await model.findByIdAndUpdate(item._id, {
                        ratingAvg: roundedRating,
                        ratingCount: ratingCount,
                        ...(type === 'place' ? { totalReviews: ratingCount } : {})
                    });
                    console.log(`- Updated ${item.name}: ${roundedRating} (${ratingCount} reviews)`);
                } else {
                    // Reset to 5.0 if no reviews exist
                    await model.findByIdAndUpdate(item._id, {
                        ratingAvg: 5.0,
                        ratingCount: 0,
                        ...(type === 'place' ? { totalReviews: 0 } : {})
                    });
                    console.log(`- Reset ${item.name}: 5.0 (0 reviews)`);
                }
            }
        }

        console.log("Recalculation complete!");
    } catch (err) {
        console.error("Error during recalculation:", err);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
}

recalculate();
