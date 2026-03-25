// sw.js - Service Worker для PWA и уведомлений
const CACHE_NAME = 'linarchat-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
    console.log('SW: Installing...');
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
});

// Активация
self.addEventListener('activate', (event) => {
    console.log('SW: Activating...');
    event.waitUntil(clients.claim());
});

// Обработка fetch
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Обработка push уведомлений
self.addEventListener('push', (event) => {
    console.log('SW: Push received', event);
    
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23075e54"/%3E%3Ctext x="50" y="70" font-size="55" text-anchor="middle" fill="white"%3EL%3C/text%3E%3C/svg%3E',
            badge: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23075e54"/%3E%3Ctext x="50" y="70" font-size="55" text-anchor="middle" fill="white"%3EL%3C/text%3E%3C/svg%3E',
            vibrate: [200, 100, 200],
            data: {
                url: data.url || '/'
            }
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    const urlToOpen = event.notification.data?.url || '/';
    
    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then(windowClients => {
            for (let client of windowClients) {
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});