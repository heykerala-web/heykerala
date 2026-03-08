// @ts-nocheck
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import UserInteraction from '../models/UserInteraction';

/**
 * interactionController.ts
 * -------------------------
 * Handles tracking of user interactions and building preference profiles.
 *
 * Endpoints:
 *   POST /api/interactions/track          – record one interaction event
 *   GET  /api/interactions/preferences    – aggregate profile from recent events
 */

// ------------------------------------------------------------------
// POST /api/interactions/track
// ------------------------------------------------------------------
/**
 * trackInteraction
 * Records a single user action (view, bookmark, search, category click, etc.)
 * This is called silently in the background (fire-and-forget from client).
 */
export const trackInteraction = async (req: Request | AuthRequest, res: Response) => {
    try {
        const { sessionId, action, placeId, category, district, tags } = req.body;

        // sessionId is required to identify the browser session (even for guests)
        if (!sessionId || !action) {
            return res.status(400).json({ message: 'sessionId and action are required' });
        }

        // Validate action type
        const validActions = ['view', 'bookmark', 'search', 'category_click', 'district_visit'];
        if (!validActions.includes(action)) {
            return res.status(400).json({ message: `Invalid action. Must be one of: ${validActions.join(', ')}` });
        }

        // Get userId if logged in (set by auth middleware if token present)
        const userId = (req as AuthRequest).user?._id || null;

        // Save the interaction
        await UserInteraction.create({
            userId,
            sessionId,
            action,
            placeId: placeId || undefined,
            category: category || undefined,
            district: district || undefined,
            tags: Array.isArray(tags) ? tags : [],
        });

        // Don't wait for this – just confirm receipt
        res.status(201).json({ success: true });
    } catch (error: any) {
        console.error('Interaction tracking error:', error.message);
        // Return 200 even on error so the client (fire-and-forget) isn't affected
        res.status(200).json({ success: false });
    }
};

// ------------------------------------------------------------------
// GET /api/interactions/preferences
// ------------------------------------------------------------------
/**
 * getUserPreferences
 * Aggregates recent interaction history into a preference profile.
 * Looks at last 50 interactions for sessionId (or userId if logged in).
 *
 * Returns: { preferredCategory, preferredDistrict, interestTags }
 */
export const getUserPreferences = async (req: Request | AuthRequest, res: Response) => {
    try {
        const { sessionId } = req.query;
        const userId = (req as AuthRequest).user?._id;

        if (!sessionId && !userId) {
            return res.status(400).json({ message: 'sessionId or auth token required' });
        }

        // Build query – prefer userId if available
        const query: any = userId
            ? { $or: [{ userId }, { sessionId }] }
            : { sessionId };

        // Fetch last 50 interactions, most recent first
        const interactions = await UserInteraction.find(query)
            .sort({ createdAt: -1 })
            .limit(50);

        if (interactions.length === 0) {
            return res.status(200).json({
                preferredCategory: null,
                preferredDistrict: null,
                interestTags: [],
                hasData: false,
            });
        }

        // Count category frequencies
        const categoryCounts: Record<string, number> = {};
        const districtCounts: Record<string, number> = {};
        const tagCounts: Record<string, number> = {};

        for (const interaction of interactions) {
            // Weight bookmark higher then view
            const weight = interaction.action === 'bookmark' ? 2 : 1;

            if (interaction.category) {
                categoryCounts[interaction.category] = (categoryCounts[interaction.category] || 0) + weight;
            }
            if (interaction.district) {
                districtCounts[interaction.district] = (districtCounts[interaction.district] || 0) + weight;
            }
            if (Array.isArray(interaction.tags)) {
                for (const tag of interaction.tags) {
                    tagCounts[tag] = (tagCounts[tag] || 0) + weight;
                }
            }
        }

        // Pick the most frequent category and district
        const preferredCategory = Object.keys(categoryCounts).sort(
            (a, b) => categoryCounts[b] - categoryCounts[a]
        )[0] || null;

        const preferredDistrict = Object.keys(districtCounts).sort(
            (a, b) => districtCounts[b] - districtCounts[a]
        )[0] || null;

        // Pick top 5 tags
        const interestTags = Object.keys(tagCounts)
            .sort((a, b) => tagCounts[b] - tagCounts[a])
            .slice(0, 5);

        return res.status(200).json({
            preferredCategory,
            preferredDistrict,
            interestTags,
            hasData: true,
        });
    } catch (error: any) {
        console.error('Get preferences error:', error.message);
        res.status(500).json({ message: 'Failed to get preferences' });
    }
};
