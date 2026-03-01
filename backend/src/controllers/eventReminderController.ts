import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import EventReminder from '../models/EventReminder';
import Event from '../models/Event';
import User from '../models/User';
import nodemailer from 'nodemailer';

// ─────────────────────────────────────────────────────────────
// POST /api/events/:id/remind  — Set reminder
// ─────────────────────────────────────────────────────────────
export const setReminder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?._id;
        const { id: eventId } = req.params;
        const { reminderTime = '24h', notificationMethod = 'in-app', pushSubscription } = req.body;

        if (!userId) return res.status(401).json({ success: false, message: 'Login required' });
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({ success: false, message: 'Invalid event ID' });
        }

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

        // Upsert reminder
        const existing = await EventReminder.findOne({ userId, eventId });
        if (existing) {
            existing.reminderTime = reminderTime;
            existing.notificationMethod = notificationMethod;
            if (pushSubscription) existing.pushSubscription = pushSubscription;
            existing.isNotified = false;
            await existing.save();
        } else {
            await EventReminder.create({ userId, eventId, reminderTime, notificationMethod, pushSubscription });
            // Increment event reminder count
            await Event.findByIdAndUpdate(eventId, { $inc: { reminderCount: 1 } });
        }

        res.status(200).json({ success: true, message: 'Reminder set successfully', hasReminder: true });
    } catch (err) {
        next(err);
    }
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/events/:id/remind  — Remove reminder
// ─────────────────────────────────────────────────────────────
export const removeReminder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?._id;
        const { id: eventId } = req.params;

        if (!userId) return res.status(401).json({ success: false, message: 'Login required' });

        const reminder = await EventReminder.findOneAndDelete({ userId, eventId });

        if (reminder) {
            await Event.findByIdAndUpdate(eventId, { $inc: { reminderCount: -1 } });
        }

        res.status(200).json({ success: true, message: 'Reminder removed', hasReminder: false });
    } catch (err) {
        next(err);
    }
};

// ─────────────────────────────────────────────────────────────
// GET /api/events/my-reminders  — Get user's reminders
// ─────────────────────────────────────────────────────────────
export const getUserReminders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?._id;
        if (!userId) return res.status(401).json({ success: false, message: 'Login required' });

        const reminders = await EventReminder.find({ userId, isNotified: false })
            .populate('eventId', 'title district venue startDate endDate images category eventStatus')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: reminders });
    } catch (err) {
        next(err);
    }
};

// ─────────────────────────────────────────────────────────────
// Internal: Process due reminders (called by cron job)
// ─────────────────────────────────────────────────────────────
export const processDueReminders = async () => {
    try {
        const now = new Date();
        const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000 + 30 * 60 * 1000); // 24h + 30min buffer
        const in1h = new Date(now.getTime() + 1 * 60 * 60 * 1000 + 10 * 60 * 1000);   // 1h + 10min buffer
        const in30m = new Date(now.getTime() + 31 * 60 * 1000);                         // 31 min buffer

        // Get all unnotified reminders for events happening soon
        const reminders = await EventReminder.find({ isNotified: false })
            .populate<{ eventId: any }>('eventId')
            .populate<{ userId: any }>('userId', 'name email');

        const mailer = process.env.EMAIL_USER ? nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        }) : null;

        let processed = 0;

        for (const reminder of reminders) {
            const event = reminder.eventId;
            const user = reminder.userId;
            if (!event || !user) continue;

            const eventStart = new Date(event.startDate);
            let shouldNotify = false;

            if (reminder.reminderTime === '24h' && eventStart <= in24h && eventStart > now) shouldNotify = true;
            if (reminder.reminderTime === '1h' && eventStart <= in1h && eventStart > now) shouldNotify = true;
            if (reminder.reminderTime === '30min' && eventStart <= in30m && eventStart > now) shouldNotify = true;

            if (shouldNotify) {
                try {
                    // Send email
                    if (reminder.notificationMethod === 'email' && mailer && user.email) {
                        await mailer.sendMail({
                            from: `"Hey Kerala Events" <${process.env.EMAIL_USER}>`,
                            to: user.email,
                            subject: `⏰ Reminder: ${event.title} is starting soon!`,
                            html: `
                                <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:20px;border-radius:12px;">
                                    <h1 style="color:#0f766e">🎉 Event Reminder</h1>
                                    <h2 style="color:#1f2937">${event.title}</h2>
                                    <p>📍 <strong>${event.venue}, ${event.district}</strong></p>
                                    <p>📅 <strong>${new Date(event.startDate).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}</strong></p>
                                    <p>This is your ${reminder.reminderTime} reminder. Don't miss it!</p>
                                    <a href="${process.env.FRONTEND_URL}/events/${event._id}" style="display:inline-block;padding:12px 24px;background:#0f766e;color:white;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:16px;">View Event</a>
                                </div>
                            `
                        });
                    }

                    reminder.isNotified = true;
                    await reminder.save();
                    processed++;
                } catch (notifyErr) {
                    console.error('Reminder notification error:', notifyErr);
                }
            }
        }

        console.log(`[Reminders] Processed ${processed} notifications`);
        return processed;

    } catch (err) {
        console.error('[Reminders] Cron error:', err);
    }
};
