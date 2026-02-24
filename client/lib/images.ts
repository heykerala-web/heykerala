import { API_BASE_URL } from "./api";

/**
 * PRODUCTION-READY FALLBACK CONSTANTS
 * Curated high-quality, high-performance CDN links for major categories.
 */
export const FALLBACK_IMAGES = {
    PLACE: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200&auto=format&fit=crop', // Kerala Backwaters
    RESTAURANT: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop', // Elegant Restaurant
    STAY: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop', // Resort Pool
    EVENT: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1200&auto=format&fit=crop', // Festival/Concert
    DEFAULT: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop', // General Travel
} as const;

/**
 * Centralized utility to get a fallback image by category.
 * Performance: Uses constant O(1) lookup.
 */
export const getFallbackImage = (category?: string): string => {
    if (!category) return FALLBACK_IMAGES.DEFAULT;

    const cat = category.toLowerCase();
    if (cat.includes('restaurant') || cat.includes('food') || cat.includes('cuisine')) return FALLBACK_IMAGES.RESTAURANT;
    if (cat.includes('stay') || cat.includes('hotel') || cat.includes('resort')) return FALLBACK_IMAGES.STAY;
    if (cat.includes('event') || cat.includes('festival')) return FALLBACK_IMAGES.EVENT;
    if (cat.includes('place') || cat.includes('destination')) return FALLBACK_IMAGES.PLACE;

    return FALLBACK_IMAGES.DEFAULT;
};

/**
 * Simple hash function to generate a seed from a string for AI fallbacks
 */
const getHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
};

/**
 * Dynamic AI Image Generation Utility
 * Useful for specific items that need a unique visual representation.
 */
export const getTourismImage = (name: string, category: string, width = 800, height = 600, seedOverride?: number) => {
    const cleanName = name?.trim() || '';
    const cleanCategory = category?.trim() || '';

    let promptText = `${cleanName} ${cleanCategory} Kerala scenic tourism 8k realistic`;
    const foodTerms = ['breakfast', 'lunch', 'dinner', 'restaurant', 'meal', 'food', 'cafe', 'dining', 'cuisine', 'dish', 'curry'];
    const isFood = foodTerms.some(term => cleanName.toLowerCase().includes(term) || cleanCategory.toLowerCase().includes(term));

    if (isFood) {
        promptText = `Delicious ${cleanName} Kerala traditional cuisine food dish served on banana leaf authentic restaurant 8k professional food photography`;
    }

    const prompt = encodeURIComponent(promptText);
    const seed = seedOverride !== undefined ? seedOverride : getHash(cleanName + cleanCategory);

    return `https://image.pollinations.ai/prompt/${prompt}?width=${width}&height=${height}&nologo=true&seed=${seed}`;
};

/**
 * ARCHITECTURAL CORE: getFullImageUrl
 * Handles logic for backend paths, external URLs, and multi-tier fallbacks.
 */
export const getFullImageUrl = (path: string | null | undefined, name?: string, category?: string): string => {
    // 1. If path exists and is a full URL (AI or external)
    if (path && (path.startsWith('http') || path.startsWith('https://'))) {
        return path;
    }

    // 2. If path is a backend relative path
    if (path && path.startsWith('/uploads')) {
        return `${API_BASE_URL}${path}`;
    }

    // 3. If path is a local public folder asset
    if (path && path.startsWith('/')) {
        return path;
    }

    // 4. Missing path - Use Static Fallback logic
    if (!path) {
        // Option A: Use Name + Category for AI fallback (High richness)
        if (name && category) {
            return getTourismImage(name, category);
        }
        // Option B: Static Category-based fallback (Fast & Reliable)
        return getFallbackImage(category);
    }

    // Default catch-all
    return `${API_BASE_URL}/${path}`;
};
