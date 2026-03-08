/**
 * recommendationService.ts
 * -------------------------
 * Pure, rule-based scoring algorithm for place recommendations.
 * No AI is used here – this is a deterministic system easy to explain
 * during a college project demo.
 *
 * Scoring Rules:
 *   +5  if place.category === preferredCategory
 *   +3  if place.district === preferredDistrict
 *   +2  for each matching tag between place.tags and interestTags
 *   +1  if place.ratingAvg >= 4.5 (popularity bonus)
 */

import Place from '../models/Place';

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export interface UserPreferenceProfile {
    preferredCategory: string | null;
    preferredDistrict: string | null;
    interestTags: string[];
}

export interface ScoredPlace {
    _id: any;
    name: string;
    image: string;
    images?: string[];
    ratingAvg: number;
    category: string;
    district: string;
    score: number;
}

// ------------------------------------------------------------------
// Core Scoring Function
// ------------------------------------------------------------------

/**
 * scorePlace
 * Calculates a recommendation score for a single place based on
 * how well it matches the user's preference profile.
 */
function scorePlace(place: any, profile: UserPreferenceProfile): number {
    let score = 0;

    // +5 same category (strongest signal)
    if (profile.preferredCategory && place.category === profile.preferredCategory) {
        score += 5;
    }

    // +3 same district
    if (profile.preferredDistrict && place.district === profile.preferredDistrict) {
        score += 3;
    }

    // +2 per matching tag
    if (profile.interestTags.length > 0 && Array.isArray(place.tags)) {
        const lowerTags = profile.interestTags.map((t) => t.toLowerCase());
        for (const tag of place.tags) {
            if (lowerTags.includes(tag.toLowerCase())) {
                score += 2;
            }
        }
    }

    // +1 popularity bonus
    if (place.ratingAvg >= 4.5) {
        score += 1;
    }

    return score;
}

// ------------------------------------------------------------------
// Main Export
// ------------------------------------------------------------------

/**
 * getRecommendedPlaces
 * Fetches all approved places from DB, scores each one, sorts by score,
 * and returns the top N results.
 *
 * @param profile - User preference profile derived from interaction history
 * @param topN    - Number of places to return (default: 5)
 */
export async function getRecommendedPlaces(
    profile: UserPreferenceProfile,
    topN = 5
): Promise<ScoredPlace[]> {
    // Optimization: Instead of fetching ALL places, fetch top 200 
    // This reduces DB transfer time and memory usage.
    const places = await Place.find({ status: 'approved' })
        .select('_id name image images ratingAvg category district tags views')
        .sort({ ratingAvg: -1, views: -1 })
        .limit(200);

    if (places.length === 0) return [];

    // Score every place
    const scored: ScoredPlace[] = places.map((place) => ({
        _id: place._id,
        name: place.name,
        image: place.image || (place.images && place.images[0]) || '',
        images: place.images,
        ratingAvg: place.ratingAvg || 0,
        category: place.category,
        district: place.district,
        score: scorePlace(place, profile),
    }));

    // Sort by score descending, then by ratingAvg as tiebreaker
    scored.sort((a, b) => b.score - a.score || b.ratingAvg - a.ratingAvg);

    return scored.slice(0, topN);
}

/**
 * getPopularPlaces
 * Fallback for guests / new users with no interaction history.
 * Simply returns the top N places by ratingAvg.
 */
export async function getPopularPlaces(topN = 5): Promise<ScoredPlace[]> {
    const places = await Place.find({ status: 'approved' })
        .select('_id name image images ratingAvg category district')
        .sort({ ratingAvg: -1 })
        .limit(topN);

    return places.map((place) => ({
        _id: place._id,
        name: place.name,
        image: place.image || (place.images && place.images[0]) || '',
        images: place.images,
        ratingAvg: place.ratingAvg || 0,
        category: place.category,
        district: place.district,
        score: 0,
    }));
}
