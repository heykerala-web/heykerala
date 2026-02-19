import mongoose, { Document, Schema } from 'mongoose';

export interface IActivityLog extends Document {
    user: string; // User ID or "Guest"
    action: string; // e.g., "LOGIN", "SUBMIT_PLACE", "REVIEW_ADDED"
    details?: string; // e.g., "User logged in", "Place ID: 123"
    ip?: string;
    userAgent?: string;
    createdAt: Date;
}

const ActivityLogSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, required: true },
    details: { type: String },
    ip: { type: String },
    userAgent: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
