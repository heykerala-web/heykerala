/**
 * Simple in-memory TTL cache for backend API responses.
 * No external dependencies needed – uses a Map with expiry timestamps.
 *
 * Usage:
 *   import cache from '../utils/cache';
 *   cache.set('places_all', data, 300);   // cache for 5 minutes
 *   const hit = cache.get('places_all');  // returns null if expired
 *   cache.del('places');                  // delete all keys starting with 'places'
 */

interface CacheEntry<T> {
    value: T;
    expiresAt: number; // epoch ms
}

class TTLCache {
    private store = new Map<string, CacheEntry<any>>();
    private cleanupInterval: NodeJS.Timeout;

    constructor() {
        // Periodic cleanup every 5 minutes to prevent memory leaks
        this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
        // Don't block process exit
        if (this.cleanupInterval.unref) this.cleanupInterval.unref();
    }

    /** Get a cached value. Returns null if missing or expired. */
    get<T>(key: string): T | null {
        const entry = this.store.get(key);
        if (!entry) return null;
        if (Date.now() > entry.expiresAt) {
            this.store.delete(key);
            return null;
        }
        return entry.value as T;
    }

    /** Store a value with a TTL in seconds. */
    set<T>(key: string, value: T, ttlSeconds: number): void {
        this.store.set(key, {
            value,
            expiresAt: Date.now() + ttlSeconds * 1000,
        });
    }

    /**
     * Delete all cache entries whose keys start with the given prefix.
     * Useful for invalidation: cache.del('places') removes 'places_all', 'places_page1_...', etc.
     */
    del(prefix: string): void {
        for (const key of this.store.keys()) {
            if (key.startsWith(prefix)) {
                this.store.delete(key);
            }
        }
    }

    /** Remove expired entries from store. */
    private cleanup(): void {
        const now = Date.now();
        for (const [key, entry] of this.store.entries()) {
            if (now > entry.expiresAt) {
                this.store.delete(key);
            }
        }
    }

    /** Current number of cached entries (for debugging). */
    size(): number {
        return this.store.size;
    }
}

// Singleton instance shared across all controllers
const cache = new TTLCache();
export default cache;
