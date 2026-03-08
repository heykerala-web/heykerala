const DB_NAME = "HeyKeralaPWA";
const DB_VERSION = 3; // bumped to 3 to add saved_items store
const STORE_BOOKINGS = "offline_bookings";
const STORE_SAVED = "saved_items";
const STORE_USER = "cached_user";

export interface OfflineBooking {
    id?: number;
    type: 'stay' | 'restaurant';
    data: any;
    timestamp: number;
}

export interface CachedSavedItems {
    userId: string;
    savedPlaces: any[];
    savedStays: any[];
    savedEvents: any[];
    cachedAt: number;
}

export const initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event: any) => {
            const db = event.target.result;
            // Offline bookings store (existing)
            if (!db.objectStoreNames.contains(STORE_BOOKINGS)) {
                db.createObjectStore(STORE_BOOKINGS, { keyPath: "id", autoIncrement: true });
            }
            // Saved items cache store (new)
            if (!db.objectStoreNames.contains(STORE_SAVED)) {
                db.createObjectStore(STORE_SAVED, { keyPath: "userId" });
            }
            // Cached user store (new)
            if (!db.objectStoreNames.contains(STORE_USER)) {
                db.createObjectStore(STORE_USER, { keyPath: "userId" });
            }
        };

        request.onsuccess = (event: any) => resolve(event.target.result);
        request.onerror = (event: any) => reject(event.target.error);
    });
};

// ─── Offline Bookings ─────────────────────────────────────────────────────────

export const queueBooking = async (type: 'stay' | 'restaurant', data: any) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_BOOKINGS], "readwrite");
        const store = transaction.objectStore(STORE_BOOKINGS);
        const booking: OfflineBooking = { type, data, timestamp: Date.now() };
        const request = store.add(booking);
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
};

export const getQueuedBookings = async (): Promise<OfflineBooking[]> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_BOOKINGS], "readonly");
        const store = transaction.objectStore(STORE_BOOKINGS);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const clearQueuedBooking = async (id: number) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_BOOKINGS], "readwrite");
        const store = transaction.objectStore(STORE_BOOKINGS);
        const request = store.delete(id);
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
};

// ─── Saved Items Cache ─────────────────────────────────────────────────────────

export const cacheSavedItems = async (
    userId: string,
    data: { savedPlaces: any[]; savedStays: any[]; savedEvents: any[] }
): Promise<void> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_SAVED], "readwrite");
        const store = transaction.objectStore(STORE_SAVED);
        const record: CachedSavedItems = {
            userId,
            savedPlaces: data.savedPlaces || [],
            savedStays: data.savedStays || [],
            savedEvents: data.savedEvents || [],
            cachedAt: Date.now(),
        };
        const request = store.put(record);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

export const getCachedSavedItems = async (
    userId: string
): Promise<CachedSavedItems | null> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_SAVED], "readonly");
        const store = transaction.objectStore(STORE_SAVED);
        const request = store.get(userId);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
    });
};

// ─── Cached User ───────────────────────────────────────────────────────────────

export const cacheUser = async (user: any): Promise<void> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_USER], "readwrite");
        const store = transaction.objectStore(STORE_USER);
        const request = store.put({ userId: user.id || user._id, ...user });
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

export const getCachedUser = async (userId: string): Promise<any | null> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_USER], "readonly");
        const store = transaction.objectStore(STORE_USER);
        const request = store.get(userId);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
    });
};
