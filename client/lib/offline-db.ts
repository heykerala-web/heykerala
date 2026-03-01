const DB_NAME = "HeyKeralaPWA";
const DB_VERSION = 2;
const STORE_NAME = "offline_bookings";

export interface OfflineBooking {
    id?: number;
    type: 'stay' | 'restaurant';
    data: any;
    timestamp: number;
}

export const initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event: any) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
            }
        };

        request.onsuccess = (event: any) => resolve(event.target.result);
        request.onerror = (event: any) => reject(event.target.error);
    });
};

export const queueBooking = async (type: 'stay' | 'restaurant', data: any) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const booking: OfflineBooking = {
            type,
            data,
            timestamp: Date.now()
        };
        const request = store.add(booking);
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
};

export const getQueuedBookings = async (): Promise<OfflineBooking[]> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const clearQueuedBooking = async (id: number) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
};
