import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
    title: string;
    description: string;
    category: string;
    district: string;
    venue: string;
    startDate: Date;
    endDate: Date;
    time: string;
    images: string[];
    image?: string;
    latitude?: number;
    longitude?: number;
    ratingAvg?: number;
    ratingCount?: number;
    // Approval workflow status (existing)
    status: 'pending' | 'approved' | 'rejected';
    // Auto-computed event lifecycle status
    eventStatus: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    // Trending & Popularity tracking
    viewCount: number;
    reminderCount: number;
    // Admin control
    isFeatured: boolean;
    ticketUrl?: string;
    createdBy?: string;
    createdAt: Date;
    updatedAt: Date;
}

const EventSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true }, // Festival, Cultural, Music, etc.
    district: { type: String, required: true },
    venue: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    time: { type: String }, // e.g., "10:00 AM" or "All Day"
    images: [{ type: String }],
    image: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    ratingAvg: { type: Number, default: 5.0 },
    ratingCount: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    eventStatus: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        default: 'upcoming'
    },
    viewCount: { type: Number, default: 0 },
    reminderCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    ticketUrl: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Pre-save hook to sync image with the first element of images array
EventSchema.pre('save', function (this: IEvent, next) {
    if ((!this.image || this.image === '') && this.images && this.images.length > 0) {
        this.image = this.images[0];
    }
    next();
});

// Index for fast trending queries
EventSchema.index({ viewCount: -1, reminderCount: -1 });
EventSchema.index({ startDate: 1, endDate: 1 });
EventSchema.index({ district: 1, eventStatus: 1 });

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
