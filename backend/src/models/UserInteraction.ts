import mongoose, { Document, Schema } from 'mongoose';

/**
 * UserInteraction Model
 * ---------------------
 * Tracks what users do on the site so we can build a preference profile.
 * Actions: view, bookmark, search, category_click, district_visit
 *
 * - For logged-in users, userId is set.
 * - For guests, sessionId (browser UUID from localStorage) is used.
 * This allows tracking even without login.
 */

export interface IUserInteraction extends Document {
    userId?: mongoose.Types.ObjectId | null;
    sessionId: string;       // localStorage UUID – persists per browser
    action: 'view' | 'bookmark' | 'search' | 'category_click' | 'district_visit';
    placeId?: mongoose.Types.ObjectId;
    category?: string;       // e.g., "Beach", "Hill Station", "Waterfall"
    district?: string;       // e.g., "Wayanad", "Thrissur"
    tags?: string[];         // tags of the interacted place
    createdAt: Date;
}

const UserInteractionSchema: Schema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        sessionId: { type: String, required: true, index: true },
        action: {
            type: String,
            enum: ['view', 'bookmark', 'search', 'category_click', 'district_visit'],
            required: true,
        },
        placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
        category: { type: String },
        district: { type: String },
        tags: [{ type: String }],
    },
    { timestamps: true }
);

// Composite index: fast lookup by session or user + recent time
UserInteractionSchema.index({ sessionId: 1, createdAt: -1 });
UserInteractionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.UserInteraction ||
    mongoose.model<IUserInteraction>('UserInteraction', UserInteractionSchema);
