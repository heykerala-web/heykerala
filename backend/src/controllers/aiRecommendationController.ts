// @ts-nocheck
/**
 * aiRecommendationController.ts
 * ---------------------------------
 * Smart, rule-based recommendation engine for Hey Kerala.
 *
 * Algorithm (no AI for place selection):
 *   1. Load user preference profile from interaction history
 *   2. For logged-in users, also factor in their savedPlaces
 *   3. Score every approved place using recommendationService
 *   4. (Optional) Use OpenRouter to generate a short explanation sentence only
 *   5. Fallback to popular places if no interaction data exists
 *
 * This is intentionally simple and easy to explain in a college demo!
 */

import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import UserInteraction from '../models/UserInteraction';
import Place from '../models/Place';
import https from 'https';
import {
    getRecommendedPlaces,
    getPopularPlaces,
    UserPreferenceProfile,
} from '../services/recommendationService';

// ------------------------------------------------------------------
// Build preference profile from DB interactions
// ------------------------------------------------------------------
async function buildPreferenceProfile(
    userId: string | null,
    sessionId: string | null
): Promise<UserPreferenceProfile & { hasData: boolean }> {
    const emptyProfile = { preferredCategory: null, preferredDistrict: null, interestTags: [], hasData: false };

    if (!userId && !sessionId) return emptyProfile;

    const query: any = userId
        ? { $or: [{ userId }, ...(sessionId ? [{ sessionId }] : [])] }
        : { sessionId };

    const interactions = await UserInteraction.find(query)
        .sort({ createdAt: -1 })
        .limit(60);

    if (interactions.length === 0) return emptyProfile;

    const categoryCounts: Record<string, number> = {};
    const districtCounts: Record<string, number> = {};
    const tagCounts: Record<string, number> = {};

    for (const item of interactions) {
        const weight = item.action === 'bookmark' ? 2 : 1;
        if (item.category) categoryCounts[item.category] = (categoryCounts[item.category] || 0) + weight;
        if (item.district) districtCounts[item.district] = (districtCounts[item.district] || 0) + weight;
        if (Array.isArray(item.tags)) {
            for (const tag of item.tags) {
                tagCounts[tag] = (tagCounts[tag] || 0) + weight;
            }
        }
    }

    const preferredCategory = Object.keys(categoryCounts).sort((a, b) => categoryCounts[b] - categoryCounts[a])[0] || null;
    const preferredDistrict = Object.keys(districtCounts).sort((a, b) => districtCounts[b] - districtCounts[a])[0] || null;
    const interestTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]).slice(0, 5);

    // For logged-in users: also factor in their bookmarked places' categories/districts
    if (userId) {
        const user = await (await import('../models/User')).default.findById(userId)
            .populate('savedPlaces', 'category district tags')
            .lean();

        if (user?.savedPlaces?.length > 0) {
            for (const place of user.savedPlaces as any[]) {
                // Bookmarked = strong signal, weight 3
                if (place.category) categoryCounts[place.category] = (categoryCounts[place.category] || 0) + 3;
                if (place.district) districtCounts[place.district] = (districtCounts[place.district] || 0) + 3;
                if (Array.isArray(place.tags)) {
                    for (const tag of place.tags) {
                        tagCounts[tag] = (tagCounts[tag] || 0) + 2;
                    }
                }
            }
            // Re-pick preferred after adding saved places
            const refreshedCategory = Object.keys(categoryCounts).sort((a, b) => categoryCounts[b] - categoryCounts[a])[0] || preferredCategory;
            const refreshedDistrict = Object.keys(districtCounts).sort((a, b) => districtCounts[b] - districtCounts[a])[0] || preferredDistrict;
            const refreshedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]).slice(0, 5);

            return { preferredCategory: refreshedCategory, preferredDistrict: refreshedDistrict, interestTags: refreshedTags, hasData: true };
        }
    }

    return { preferredCategory, preferredDistrict, interestTags, hasData: true };
}

// ------------------------------------------------------------------
// Generate explanation text via OpenRouter (optional, graceful fallback)
// ------------------------------------------------------------------
async function generateExplanation(profile: UserPreferenceProfile): Promise<string> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        // Static fallback – no API key configured
        return buildStaticExplanation(profile);
    }

    const parts: string[] = [];
    if (profile.preferredCategory) parts.push(`${profile.preferredCategory} places`);
    if (profile.interestTags.length > 0) parts.push(profile.interestTags.slice(0, 2).join(' and ') + ' destinations');
    if (profile.preferredDistrict) parts.push(`places in ${profile.preferredDistrict}`);

    if (parts.length === 0) return 'Curated picks from the best of Kerala';

    const prompt = `The user has shown interest in ${parts.join(', ')} while browsing Kerala tourism. Write ONE short, friendly sentence (max 15 words) explaining why we recommend these destinations. No emojis. Start with "Based on".`;

    const requestBody = JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [
            { role: 'user', content: prompt }
        ],
        max_tokens: 60,
        temperature: 0.6,
    });

    return new Promise((resolve) => {
        const options = {
            hostname: 'openrouter.ai',
            path: '/api/v1/chat/completions',
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody),
            },
        };

        const apiReq = https.request(options, (apiRes) => {
            let data = '';
            apiRes.on('data', (chunk) => { data += chunk; });
            apiRes.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    const text = parsed.choices?.[0]?.message?.content?.trim();
                    resolve(text || buildStaticExplanation(profile));
                } catch {
                    resolve(buildStaticExplanation(profile));
                }
            });
        });

        apiReq.on('error', () => resolve(buildStaticExplanation(profile)));
        // 1s timeout – don't block the response waiting for AI
        apiReq.setTimeout(1000, () => {
            apiReq.destroy();
            resolve(buildStaticExplanation(profile));
        });
        apiReq.write(requestBody);
        apiReq.end();
    });
}

/** Static fallback explanation builder – no API needed */
function buildStaticExplanation(profile: UserPreferenceProfile): string {
    const parts: string[] = [];
    if (profile.preferredCategory) parts.push(profile.preferredCategory.toLowerCase());
    if (profile.interestTags.length > 0) parts.push(profile.interestTags[0].toLowerCase());
    if (parts.length === 0) return 'Popular destinations loved by Kerala travellers';
    return `Based on your interest in ${parts.join(' and ')} destinations`;
}

// ------------------------------------------------------------------
// Main Route Handler: GET /api/ai/recommendations
// ------------------------------------------------------------------
export const getRecommendations = async (req: AuthRequest, res: Response) => {
    try {
        const { sessionId } = req.query as { sessionId?: string };
        const userId = req.user?._id?.toString() || null;

        // 1. Build the user preference profile
        const profile = await buildPreferenceProfile(userId, sessionId || null);

        let places: any[];
        let sectionTitle: string;
        let explanation: string;
        let isPersonalized: boolean;

        if (profile.hasData) {
            // 2a. Personalized recommendations using rule-based scoring
            places = await getRecommendedPlaces(profile, 6);

            // Start AI explanation but don't wait too long
            explanation = await generateExplanation(profile);

            sectionTitle = 'Recommended For You';
            isPersonalized = true;
        } else {
            // 2b. Fallback: show top-rated popular places, same section title for consistency
            places = await getPopularPlaces(6);
            explanation = 'Top-rated places loved by Kerala travellers – save or explore a few destinations to get personalised picks!';
            sectionTitle = 'Recommended For You';
            isPersonalized = false;
        }

        return res.status(200).json({
            places,
            explanation,
            sectionTitle,
            isPersonalized,
            preferenceProfile: profile.hasData ? {
                preferredCategory: profile.preferredCategory,
                preferredDistrict: profile.preferredDistrict,
                interestTags: profile.interestTags,
            } : null,
        });

    } catch (error: any) {
        console.error('Recommendation Error:', error.message);
        // Last-resort fallback: try to return popular places without crashing
        try {
            const fallbackPlaces = await getPopularPlaces(6);
            return res.status(200).json({
                places: fallbackPlaces,
                explanation: 'Popular destinations loved by Kerala travellers',
                sectionTitle: 'Popular Destinations in Kerala',
                isPersonalized: false,
                preferenceProfile: null,
            });
        } catch (fallbackError) {
            return res.status(500).json({ message: 'Failed to fetch recommendations', error: error.message });
        }
    }
};
