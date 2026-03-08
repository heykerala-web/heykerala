import { Request, Response } from "express";
import Place from "../models/Place";
import Stay from "../models/Stay";
import Event from "../models/Event";
import { generateEmbedding } from "../utils/embeddingUtils";

/**
 * Performs a semantic search for places based on a natural language query.
 */
export const semanticSearch = async (req: Request, res: Response) => {
    try {
        const { q, type = 'all' } = req.query;

        if (!q || typeof q !== "string") {
            return res.status(400).json({ message: "Search query is required" });
        }

        // We will perform parallel searches based on the requested 'type'
        // and then aggregate/normalize the results.

        let placesPromise: Promise<any[]> = Promise.resolve([]);
        let staysPromise: Promise<any[]> = Promise.resolve([]);
        let eventsPromise: Promise<any[]> = Promise.resolve([]);

        const user = (req as any).user;
        const userId = user?._id;
        // const isAdmin = user && user.role === 'Admin'; // Admin check not strictly needed if creator check covers it

        // Approval filter: Only show approved items or items created by the user
        const approvalFilter = userId
            ? { $or: [{ status: 'approved' }, { status: { $exists: false } }, { createdBy: userId }] }
            : { $or: [{ status: 'approved' }, { status: { $exists: false } }] };

        // Define model-specific queries to avoid schema mismatch
        const placeQuery = {
            $and: [
                {
                    $or: [
                        { name: { $regex: q, $options: "i" } },
                        { description: { $regex: q, $options: "i" } },
                        { category: { $regex: q, $options: "i" } },
                        { district: { $regex: q, $options: "i" } }
                    ]
                },
                approvalFilter
            ]
        };

        const stayQuery = {
            $and: [
                {
                    $or: [
                        { name: { $regex: q, $options: "i" } },
                        { description: { $regex: q, $options: "i" } },
                        { type: { $regex: q, $options: "i" } },
                        { district: { $regex: q, $options: "i" } }
                    ]
                },
                approvalFilter
            ]
        };

        const eventQuery = {
            $and: [
                {
                    $or: [
                        { title: { $regex: q, $options: "i" } },
                        { description: { $regex: q, $options: "i" } },
                        { category: { $regex: q, $options: "i" } },
                        { district: { $regex: q, $options: "i" } }
                    ]
                },
                approvalFilter
            ]
        };

        if (type === 'all' || type === 'place') {
            placesPromise = Place.find(placeQuery).limit(5).lean().exec();
        }
        if (type === 'all' || type === 'stay') {
            staysPromise = Stay.find(stayQuery).limit(5).lean().exec();
        }
        if (type === 'all' || type === 'event') {
            eventsPromise = Event.find(eventQuery).limit(5).lean().exec();
        }

        const [places, stays, events] = await Promise.all([placesPromise, staysPromise, eventsPromise]);

        // Normalize results
        const normalizedResults = [
            ...(places as any[]).map(p => ({
                _id: p._id,
                name: p.name,
                description: p.description,
                category: p.category,
                district: p.district,
                image: p.images?.[0] || "",
                type: 'place',
                score: 1 // Default score for basic search
            })),
            ...(stays as any[]).map(s => ({
                _id: s._id,
                name: s.name,
                description: s.description,
                category: s.type, // Map 'type' to category
                district: s.district,
                image: s.images?.[0] || "",
                type: 'stay',
                score: 1
            })),
            ...(events as any[]).map(e => ({
                _id: e._id,
                name: e.title, // Map 'title' to name
                description: e.description,
                category: e.category,
                district: e.district,
                image: e.images?.[0] || "",
                type: 'event',
                score: 1
            }))
        ];

        // Shuffle or sort results? For now, shuffle to mix them if 'all'
        // A simple shuffle:
        // normalizedResults.sort(() => Math.random() - 0.5); 
        // Better: keep them grouped or prioritized. Let's return as is, frontend can group or mix. 
        // Actually, mixing is better for "Vibe" search.

        res.status(200).json(normalizedResults);

    } catch (error: any) {
        console.error("Search Error:", error);
        res.status(500).json({ message: "Search failed", error: error.message });
    }
};
