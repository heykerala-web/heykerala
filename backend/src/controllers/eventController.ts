import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Event from '../models/Event';
import EventReminder from '../models/EventReminder';
import Review from '../models/Review';
import User from '../models/User';
import cache from '../utils/cache';

const EVENTS_LIST_TTL = 2 * 60;  // 2 minutes (events change more often)
const EVENTS_TRENDING_TTL = 5 * 60; // 5 minutes

// ─────────────────────────────────────────────────────────────
// Helper: compute eventStatus from dates
// ─────────────────────────────────────────────────────────────
export const computeEventStatus = (startDate: Date, endDate: Date): string => {
    const now = new Date();
    if (now < startDate) return 'upcoming';
    if (now >= startDate && now <= endDate) return 'ongoing';
    return 'completed';
};

// ─────────────────────────────────────────────────────────────
// Helper: date range for smart filters
// ─────────────────────────────────────────────────────────────
const getSmartDateRange = (timeFilter: string): { start: Date; end: Date } | null => {
    const now = new Date();
    const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now); todayEnd.setHours(23, 59, 59, 999);

    switch (timeFilter) {
        case 'today':
            return { start: todayStart, end: todayEnd };
        case 'tomorrow': {
            const s = new Date(todayStart); s.setDate(s.getDate() + 1);
            const e = new Date(todayEnd); e.setDate(e.getDate() + 1);
            return { start: s, end: e };
        }
        case 'this_week': {
            const s = new Date(todayStart);
            const e = new Date(todayEnd); e.setDate(e.getDate() + 7);
            return { start: s, end: e };
        }
        case 'this_month': {
            const s = new Date(todayStart);
            const e = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
            return { start: s, end: e };
        }
        case 'upcoming': {
            const s = new Date(todayStart);
            const e = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
            return { start: s, end: e };
        }
        case 'past': {
            const s = new Date(2000, 0, 1);
            const e = new Date(todayStart);
            return { start: s, end: e };
        }
        default:
            return null;
    }
};

// ─────────────────────────────────────────────────────────────
// POST /api/events  — Add new event (Admin)
// ─────────────────────────────────────────────────────────────
export const addEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description, category, district, venue, startDate, endDate, time, image, images, latitude, longitude, ticketUrl } = req.body;

        if (!title || !startDate || !endDate) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const status = computeEventStatus(start, end);

        const event = await Event.create({
            title, description, category, district, venue,
            startDate, endDate, time, image, images, latitude, longitude, ticketUrl,
            status: 'approved',
            eventStatus: status
        });

        cache.del('events');
        res.status(201).json({ success: true, data: event });
    } catch (err) {
        next(err);
    }
};

// ─────────────────────────────────────────────────────────────
// POST /api/events/user/submission  — Submit event (Contributor)
// ─────────────────────────────────────────────────────────────
export const submitEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user._id;
        const { title, description, category, district, venue, startDate, endDate, time, image, images, latitude, longitude, ticketUrl } = req.body;

        if (!title || !startDate || !endDate) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const now = new Date(); now.setHours(0, 0, 0, 0);

        if (start < now) return res.status(400).json({ success: false, message: "Start date cannot be in the past" });
        if (end < start) return res.status(400).json({ success: false, message: "End date must be after start date" });

        const event = await Event.create({
            title, description, category, district, venue,
            startDate: start, endDate: end, time, image, images, latitude, longitude, ticketUrl,
            status: 'pending',
            eventStatus: 'upcoming',
            createdBy: userId
        });

        cache.del('events');
        res.status(201).json({ message: 'Event submitted successfully', event });
    } catch (err) {
        next(err);
    }
};

// ─────────────────────────────────────────────────────────────
// GET /api/events  — List events with smart filters
// ─────────────────────────────────────────────────────────────
export const getEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { district, category, date, search, status, timeFilter, eventStatus, sort, page, limit } = req.query;
        const isAdmin = (req as any).user && (req as any).user.role === 'Admin';

        // Cache only for non-admin, non-status-filtered requests
        if (!isAdmin || !status) {
            const cacheKey = `events_list_${JSON.stringify(req.query)}`;
            const cached = cache.get<any>(cacheKey);
            if (cached) {
                res.setHeader('X-Cache', 'HIT');
                return res.status(200).json(cached);
            }
        }

        let query: any = {};

        // Approval filter
        if (isAdmin) {
            if (status) query.status = status;
        } else {
            const userId = (req as any).user?._id;
            query.$or = [{ status: 'approved' }, { status: { $exists: false } }];
            if (userId) query.$or.push({ createdBy: userId });
        }

        // District filter
        if (district && district !== 'all') {
            query.district = { $regex: new RegExp(district as string, 'i') };
        }

        // Category filter
        if (category && category !== 'all') {
            query.category = { $regex: new RegExp(category as string, 'i') };
        }

        // eventStatus filter (upcoming / ongoing / completed / cancelled)
        if (eventStatus && eventStatus !== 'all') {
            query.eventStatus = eventStatus;
        }

        // Smart date filter (today / tomorrow / this_week / this_month / upcoming / past)
        if (timeFilter && timeFilter !== 'all') {
            const range = getSmartDateRange(timeFilter as string);
            if (range) {
                query.startDate = { $lte: range.end };
                query.endDate = { $gte: range.start };
            }
        }

        // Specific date filter (calendar click)
        if (date) {
            const selectedDate = new Date(date as string);
            const startOfDay = new Date(selectedDate); startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(selectedDate); endOfDay.setHours(23, 59, 59, 999);
            query.startDate = { $lte: endOfDay };
            query.endDate = { $gte: startOfDay };
        }

        // Search
        if (search) {
            const searchQuery = { $regex: new RegExp(search as string, 'i') };
            const approvalFilter = query.$or;
            // merge with existing $or using $and
            if (approvalFilter) {
                query.$and = [
                    { $or: approvalFilter },
                    { $or: [{ title: searchQuery }, { district: searchQuery }, { venue: searchQuery }, { description: searchQuery }] }
                ];
                delete query.$or;
            } else {
                query.$or = [{ title: searchQuery }, { district: searchQuery }, { venue: searchQuery }, { description: searchQuery }];
            }
        }

        // Sorting
        let sortOption: any = { startDate: 1 };
        if (sort === 'trending') sortOption = { viewCount: -1, reminderCount: -1 };
        if (sort === 'newest') sortOption = { createdAt: -1 };
        if (sort === 'popular') sortOption = { viewCount: -1 };

        // Pagination
        const pageNum = parseInt(page as string) || 1;
        const limitNum = parseInt(limit as string) || 12;
        const skip = (pageNum - 1) * limitNum;

        const total = await Event.countDocuments(query);
        const events = await Event.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum);

        const responseData = {
            success: true,
            data: events,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                pages: Math.ceil(total / limitNum)
            }
        };

        if (!isAdmin || !status) {
            const cacheKey = `events_list_${JSON.stringify(req.query)}`;
            cache.set(cacheKey, responseData, EVENTS_LIST_TTL);
        }

        res.setHeader('X-Cache', 'MISS');
        res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=30');
        res.status(200).json(responseData);
    } catch (err) {
        next(err);
    }
};

// ─────────────────────────────────────────────────────────────
// GET /api/events/calendar?month=2&year=2026  — Calendar grouped view
// ─────────────────────────────────────────────────────────────
export const getCalendarEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { month, year, district } = req.query;
        const m = parseInt(month as string) || new Date().getMonth() + 1;
        const y = parseInt(year as string) || new Date().getFullYear();

        const startOfMonth = new Date(y, m - 1, 1);
        const endOfMonth = new Date(y, m, 0, 23, 59, 59, 999);

        const query: any = {
            $or: [{ status: 'approved' }, { status: { $exists: false } }],
            startDate: { $lte: endOfMonth },
            endDate: { $gte: startOfMonth }
        };

        if (district && district !== 'all') {
            query.district = { $regex: new RegExp(district as string, 'i') };
        }

        const events = await Event.find(query).sort({ startDate: 1 });

        // Group by date
        const grouped: Record<string, any[]> = {};
        events.forEach(event => {
            const start = new Date(event.startDate);
            const end = new Date(event.endDate);
            const cur = new Date(start);
            cur.setHours(0, 0, 0, 0);

            while (cur <= end && cur <= endOfMonth) {
                if (cur >= startOfMonth) {
                    const key = cur.toISOString().split('T')[0];
                    if (!grouped[key]) grouped[key] = [];
                    grouped[key].push({
                        _id: event._id,
                        title: event.title,
                        category: event.category,
                        district: event.district,
                        venue: event.venue,
                        startDate: event.startDate,
                        endDate: event.endDate,
                        eventStatus: event.eventStatus,
                        images: event.images,
                        isFeatured: event.isFeatured,
                    });
                }
                cur.setDate(cur.getDate() + 1);
            }
        });

        res.status(200).json({ success: true, data: grouped, month: m, year: y });
    } catch (err) {
        next(err);
    }
};

// ─────────────────────────────────────────────────────────────
// GET /api/events/trending  — Top 8 trending events
// ─────────────────────────────────────────────────────────────
export const getTrendingEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cachedTrending = cache.get<any>('events_trending');
        if (cachedTrending) {
            res.setHeader('X-Cache', 'HIT');
            return res.status(200).json(cachedTrending);
        }

        const now = new Date();
        const events = await Event.find({
            $or: [{ status: 'approved' }, { status: { $exists: false } }],
            endDate: { $gte: now }  // only active/upcoming
        })
            .sort({ viewCount: -1, reminderCount: -1, startDate: 1 })
            .limit(8);

        const trendingData = { success: true, data: events };
        cache.set('events_trending', trendingData, EVENTS_TRENDING_TTL);
        res.setHeader('X-Cache', 'MISS');
        res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
        res.status(200).json(trendingData);
    } catch (err) {
        next(err);
    }
};

// ─────────────────────────────────────────────────────────────
// GET /api/events/featured  — Featured events
// ─────────────────────────────────────────────────────────────
export const getFeaturedEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await Event.find({
            $or: [{ status: 'approved' }, { status: { $exists: false } }],
            isFeatured: true,
            endDate: { $gte: new Date() }
        }).sort({ startDate: 1 }).limit(6);

        res.status(200).json({ success: true, data: events });
    } catch (err) {
        next(err);
    }
};

// ─────────────────────────────────────────────────────────────
// GET /api/events/:id  — Single event with view count increment
// ─────────────────────────────────────────────────────────────
export const getEventById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid Event ID format" });
        }

        const event = await Event.findByIdAndUpdate(
            id,
            { $inc: { viewCount: 1 } },
            { new: true }
        );

        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

        const isApproved = event.status === 'approved' || !(event as any).status;
        const user = (req as any).user;
        const isAdmin = user && user.role === 'Admin';
        const isCreator = user && event.createdBy?.toString() === user._id.toString();

        if (!isApproved && !isAdmin && !isCreator) {
            return res.status(403).json({ success: false, message: 'Event pending approval' });
        }

        // Check if current user has set a reminder
        let hasReminder = false;
        const userId = (req as any).user?._id;
        if (userId) {
            const reminder = await EventReminder.findOne({ userId, eventId: id });
            hasReminder = !!reminder;
        }

        res.status(200).json({ success: true, data: { ...event.toObject(), hasReminder } });
    } catch (err) {
        next(err);
    }
};

// ─────────────────────────────────────────────────────────────
// PUT /api/events/:id  — Update event
// ─────────────────────────────────────────────────────────────
export const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid Event ID format" });
        }

        const allowedFields = ['title', 'description', 'category', 'district', 'venue', 'startDate', 'endDate', 'time', 'image', 'images', 'latitude', 'longitude', 'status', 'isFeatured', 'ticketUrl', 'eventStatus'];
        const updateData: any = {};
        Object.keys(req.body).forEach(key => {
            if (allowedFields.includes(key)) updateData[key] = req.body[key];
        });

        // Sync primary image if images provided but image is not
        if ((!updateData.image || updateData.image === '') && updateData.images && updateData.images.length > 0) {
            updateData.image = updateData.images[0];
        }

        // Recalculate eventStatus if dates changed
        if (updateData.startDate || updateData.endDate) {
            const existing = await Event.findById(id);
            if (existing) {
                const start = updateData.startDate ? new Date(updateData.startDate) : existing.startDate;
                const end = updateData.endDate ? new Date(updateData.endDate) : existing.endDate;
                if (updateData.eventStatus !== 'cancelled') {
                    updateData.eventStatus = computeEventStatus(start, end);
                }
            }
        }

        const event = await Event.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

        cache.del('events');
        res.status(200).json({ success: true, data: event });
    } catch (err) {
        next(err);
    }
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/events/:id  — Delete event
// ─────────────────────────────────────────────────────────────
export const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid Event ID format" });
        }

        const event = await Event.findByIdAndDelete(id);
        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

        // Cascading delete
        await Review.deleteMany({ targetId: id, targetType: "event" });
        await EventReminder.deleteMany({ eventId: id });
        cache.del('events');

        res.status(200).json({ success: true, message: 'Event deleted successfully' });
    } catch (err) {
        next(err);
    }
};

// ─────────────────────────────────────────────────────────────
// PUT /api/events/:id/featured  — Toggle featured (Admin)
// ─────────────────────────────────────────────────────────────
export const toggleFeatured = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid Event ID" });
        }

        const event = await Event.findById(id);
        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

        event.isFeatured = !event.isFeatured;
        await event.save();

        res.status(200).json({ success: true, isFeatured: event.isFeatured, message: `Event ${event.isFeatured ? 'featured' : 'unfeatured'} successfully` });
    } catch (err) {
        next(err);
    }
};

// ─────────────────────────────────────────────────────────────
// POST /api/events/bulk-upload  — CSV bulk upload (Admin)
// ─────────────────────────────────────────────────────────────
export const bulkUploadEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { events } = req.body; // Array of event objects parsed from CSV on frontend

        if (!Array.isArray(events) || events.length === 0) {
            return res.status(400).json({ success: false, message: "No events data provided" });
        }

        const results = { created: 0, failed: 0, errors: [] as string[] };

        for (const ev of events) {
            try {
                const { title, description, category, district, venue, startDate, endDate, time, ticketUrl } = ev;
                if (!title || !startDate || !endDate || !district || !venue) {
                    results.failed++;
                    results.errors.push(`Skipped "${title || 'unknown'}": missing required fields`);
                    continue;
                }

                const start = new Date(startDate);
                const end = new Date(endDate);

                await Event.create({
                    title, description: description || '', category: category || 'Other',
                    district, venue, startDate: start, endDate: end, time, ticketUrl,
                    status: 'approved',
                    eventStatus: computeEventStatus(start, end),
                    images: []
                });

                results.created++;
            } catch (e: any) {
                results.failed++;
                results.errors.push(`Error for "${ev.title}": ${e.message}`);
            }
        }

        res.status(200).json({ success: true, results });
    } catch (err) {
        next(err);
    }
};

// ─────────────────────────────────────────────────────────────
// POST /api/events/auto-expire  — Auto-update eventStatus (Cron job trigger)
// ─────────────────────────────────────────────────────────────
export const autoExpireEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const now = new Date();

        // Mark ongoing events
        const ongoingResult = await Event.updateMany(
            { startDate: { $lte: now }, endDate: { $gte: now }, eventStatus: { $ne: 'cancelled' } },
            { $set: { eventStatus: 'ongoing' } }
        );

        // Mark completed events
        const completedResult = await Event.updateMany(
            { endDate: { $lt: now }, eventStatus: { $nin: ['cancelled', 'completed'] } },
            { $set: { eventStatus: 'completed' } }
        );

        // Mark upcoming events that haven't started
        const upcomingResult = await Event.updateMany(
            { startDate: { $gt: now }, eventStatus: { $nin: ['cancelled', 'upcoming'] } },
            { $set: { eventStatus: 'upcoming' } }
        );

        res.status(200).json({
            success: true,
            updated: {
                ongoing: ongoingResult.modifiedCount,
                completed: completedResult.modifiedCount,
                upcoming: upcomingResult.modifiedCount
            }
        });
    } catch (err) {
        next(err);
    }
};

// ─────────────────────────────────────────────────────────────
// GET /api/events/ai-recommendations  — AI event suggestions (Protected)
// ─────────────────────────────────────────────────────────────
export const getAIEventRecommendations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?._id;
        const apiKey = process.env.OPENROUTER_API_KEY;

        // Always return some events if AI is unavailable
        const fallbackEvents = await Event.find({
            $or: [{ status: 'approved' }, { status: { $exists: false } }],
            endDate: { $gte: new Date() }
        }).sort({ viewCount: -1 }).limit(5);

        if (!apiKey) {
            return res.status(200).json({ success: true, data: fallbackEvents, source: 'fallback' });
        }

        let user: any = null;
        let userContext = 'General Kerala tourism';

        if (userId) {
            user = await User.findById(userId);
            if (user) {
                const interests = user.travelInterests?.join(', ') || 'General';
                const district = user.location || 'anywhere in Kerala';
                userContext = `User interests: ${interests}. Preferred area: ${district}`;
            }
        }

        // Get upcoming events from DB for AI to choose from
        const upcomingEvents = await Event.find({
            $or: [{ status: 'approved' }, { status: { $exists: false } }],
            endDate: { $gte: new Date() }
        }).limit(30);

        if (upcomingEvents.length === 0) {
            return res.status(200).json({ success: true, data: [], source: 'empty' });
        }

        const eventList = upcomingEvents.map(e =>
            `${e._id}|${e.title}|${e.category}|${e.district}|${new Date(e.startDate).toDateString()}`
        ).join('\n');

        const prompt = `You are a Kerala tourism expert. Based on the user context, recommend 5 events from the list.

User context: ${userContext}

Available events (format: id|title|category|district|date):
${eventList}

Respond ONLY with a JSON array of event IDs in this exact format:
{"eventIds": ["id1", "id2", "id3", "id4", "id5"]}

Choose events that best match the user's interests and location. Do not include any other text.`;

        const body = JSON.stringify({
            model: 'google/gemini-2.0-flash-001',
            messages: [
                { role: 'system', content: 'You are a Kerala tourism AI that recommends events. Respond only with valid JSON.' },
                { role: 'user', content: prompt }
            ],
            max_tokens: 300,
            temperature: 0.5,
            response_format: { type: 'json_object' }
        });

        try {
            const https = require('https');
            const makeReq = () => new Promise<any>((resolve, reject) => {
                const reqOptions = {
                    hostname: 'openrouter.ai',
                    path: '/api/v1/chat/completions',
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(body)
                    }
                };
                const r = https.request(reqOptions, (apiRes: any) => {
                    let data = '';
                    apiRes.on('data', (chunk: any) => { data += chunk; });
                    apiRes.on('end', () => {
                        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
                    });
                });
                r.on('error', reject);
                r.write(body);
                r.end();
            });

            const aiResponse = await makeReq();
            const content = aiResponse.choices?.[0]?.message?.content;
            if (!content) throw new Error('No AI content');

            const parsed = JSON.parse(content.replace(/```json|```/g, '').trim());
            const recommendedIds: string[] = parsed.eventIds || [];

            // Fetch the recommended events in order
            const recommended = await Promise.all(
                recommendedIds.slice(0, 5).map((id: string) =>
                    mongoose.Types.ObjectId.isValid(id) ? Event.findById(id) : null
                )
            );

            const validRecommended = recommended.filter(Boolean);
            return res.status(200).json({ success: true, data: validRecommended, source: 'ai' });

        } catch (aiErr) {
            console.error('AI Event Recommendations error:', aiErr);
            return res.status(200).json({ success: true, data: fallbackEvents, source: 'fallback' });
        }

    } catch (err) {
        next(err);
    }
};
