/* Hey Kerala Events Service Worker */

const CACHE_NAME = 'heykerala-events-v1';
const ASSETS_TO_CACHE = [
    '/events',
    '/logo.svg',
    '/offline-image.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch with cache-first for static, network-first for events
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    if (url.pathname.includes('/api/events')) {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match(event.request);
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
    }
});

// Handle push notifications for reminders
self.addEventListener('push', (event) => {
    let data = { title: 'Event Reminder', body: 'An event you saved is starting soon!', icon: '/logo.svg' };

    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data.body = event.data.text();
        }
    }

    const options = {
        body: data.body,
        icon: data.icon || '/logo.svg',
        badge: '/icons/icon-192x192.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/events'
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});

// Background Sync for offline reminder additions and bookings
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-reminders') {
        console.log('[SW] Background Sync: Processing reminders');
    }

    if (event.tag === 'sync-bookings') {
        console.log('[SW] Background Sync: Processing bookings');
        event.waitUntil(processOfflineBookings());
    }
});

async function processOfflineBookings() {
    // Note: In a real SW, we'd need to access IndexedDB here.
    // Since SW doesn't have access to your local modules easily,
    // we'll implement a simple fetch-retry logic or use message passing.
    // For this demo/academic project, we'll assume the client handles the sync
    // when coming back online via 'online' event listener as a fallback.
    console.log('[SW] Offline bookings processing requested');
}
