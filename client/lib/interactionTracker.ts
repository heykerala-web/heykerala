/**
 * interactionTracker.ts
 * ----------------------
 * Client-side utility for tracking user interactions with tourist places.
 * This is FIRE-AND-FORGET: tracking calls never block the UI.
 *
 * How it works:
 *   1. Each browser gets a unique UUID stored in localStorage (sessionId)
 *   2. When a user views/bookmarks/searches/clicks, we silently POST to the backend
 *   3. The backend aggregates these events to build a preference profile
 *   4. The recommendation engine uses the profile to score places
 *
 * Events we track:
 *   - 'view'           → User navigated to a place detail page
 *   - 'bookmark'       → User saved/bookmarked a place
 *   - 'search'         → User searched for something
 *   - 'category_click' → User clicked a category badge (Beach, Hill Station, etc.)
 *   - 'district_visit' → User filtered by district
 */

import { API_URL } from '@/lib/api';

// ------------------------------------------------------------------
// Session ID: persistent UUID per browser session
// ------------------------------------------------------------------

/**
 * getSessionId
 * Returns a UUID stored in localStorage.
 * Creates a new one the first time (for new browsers / cleared storage).
 */
export function getSessionId(): string {
    if (typeof window === 'undefined') return 'ssr'; // SSR safety

    const KEY = 'hk_session_id';
    let id = localStorage.getItem(KEY);

    if (!id) {
        // Generate a simple UUID v4
        id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
        localStorage.setItem(KEY, id);
    }

    return id;
}

// ------------------------------------------------------------------
// Interaction Event Types
// ------------------------------------------------------------------

export type InteractionAction =
    | 'view'
    | 'bookmark'
    | 'search'
    | 'category_click'
    | 'district_visit';

export interface InteractionData {
    placeId?: string;
    category?: string;
    district?: string;
    tags?: string[];
}

// ------------------------------------------------------------------
// Core Tracking Function
// ------------------------------------------------------------------

/**
 * trackEvent
 * Silently sends an interaction event to the backend.
 * Never throws – any failure is swallowed so the UI is never affected.
 *
 * Usage examples:
 *   trackEvent('view', { placeId: '...', category: 'Beach', district: 'Thrissur', tags: ['sea', 'sand'] })
 *   trackEvent('category_click', { category: 'Waterfall' })
 *   trackEvent('search', {})
 *   trackEvent('bookmark', { placeId: '...', category: 'Hill Station', district: 'Wayanad' })
 */
export function trackEvent(action: InteractionAction, data: InteractionData = {}): void {
    // Run asynchronously without blocking
    (async () => {
        try {
            const sessionId = getSessionId();
            const token = typeof window !== 'undefined'
                ? localStorage.getItem('token') || sessionStorage.getItem('token')
                : null;

            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            await fetch(`${API_URL}/interactions/track`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    sessionId,
                    action,
                    ...data,
                }),
            });

            // Also call the new engagement increment endpoints for the Place model
            if (data.placeId) {
                let incrementPath = '';
                if (action === 'view') incrementPath = `/places/${data.placeId}/view`;
                else if (action === 'bookmark') incrementPath = `/places/${data.placeId}/bookmark-click`;
                else if (action === 'search') incrementPath = `/places/${data.placeId}/search-click`;

                if (incrementPath) {
                    await fetch(`${API_URL}${incrementPath}`, {
                        method: 'POST',
                        headers
                    });
                }
            }
        } catch {
            // Silently ignore – tracking errors should NEVER affect the user experience
        }
    })();
}

// ------------------------------------------------------------------
// Convenience helpers
// ------------------------------------------------------------------

/** Track a place view (call this from the place detail page) */
export function trackPlaceView(placeId: string, category: string, district: string, tags: string[] = []) {
    trackEvent('view', { placeId, category, district, tags });
}

/** Track a bookmark/save action */
export function trackBookmark(placeId: string, category: string, district: string) {
    trackEvent('bookmark', { placeId, category, district });
}

/** Track a category click (e.g., user clicked "Beach" in the category grid) */
export function trackCategoryClick(category: string) {
    trackEvent('category_click', { category });
}

/** Track a search query */
export function trackSearch() {
    trackEvent('search', {});
}
