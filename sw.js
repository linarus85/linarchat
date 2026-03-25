const CACHE_NAME = 'linarchat-v1';

self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('fetch', event => {
    event.respondWith(fetch(event.request));
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

// Push уведомления (для Android)
self.addEventListener('push', function(event) {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23075e54"/%3E%3Ctext x="50" y="70" font-size="55" text-anchor="middle" fill="white"%3EL%3C/text%3E%3C/svg%3E',
            vibrate: [200, 100, 200],
            data: {
                url: data.url || '/',
                senderId: data.senderId
            }
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('/')
    );
});