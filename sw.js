const CACHE_NAME = 'linarchat-v3';

self.addEventListener('install', event => {
    console.log('SW installed');
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('SW activated');
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
    event.respondWith(fetch(event.request));
});

self.addEventListener('notificationclick', function(event) {
    console.log('Notification clicked');
    event.notification.close();
    event.waitUntil(clients.openWindow('/'));
});