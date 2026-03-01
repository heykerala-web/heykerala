import mongoose, { Document, Schema } from 'mongoose';

export interface IEventReminder extends Document {
    userId: mongoose.Types.ObjectId;
    eventId: mongoose.Types.ObjectId;
    reminderTime: '24h' | '1h' | '30min';
    notificationMethod: 'in-app' | 'email' | 'push';
    pushSubscription?: Record<string, any>; // PWA push subscription object
    isNotified: boolean;
    createdAt: Date;
}

const EventReminderSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    reminderTime: {
        type: String,
        enum: ['24h', '1h', '30min'],
        default: '24h'
    },
    notificationMethod: {
        type: String,
        enum: ['in-app', 'email', 'push'],
        default: 'in-app'
    },
    pushSubscription: { type: Schema.Types.Mixed },
    isNotified: { type: Boolean, default: false },
}, { timestamps: true });

// Unique constraint: one reminder per user per event
EventReminderSchema.index({ userId: 1, eventId: 1 }, { unique: true });
EventReminderSchema.index({ isNotified: 1, createdAt: 1 });

export default mongoose.model<IEventReminder>('EventReminder', EventReminderSchema);
