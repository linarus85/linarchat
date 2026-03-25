const CACHE_NAME = 'linarchat-v1';

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
    
    // Правильный URL вашего сайта
    const urlToOpen = '/linarchat/';
    
    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then(windowClients => {
            // Проверяем, есть ли уже открытое окно
            for (let client of windowClients) {
                if (client.url.includes('/linarchat/') && 'focus' in client) {
                    return client.focus();
                }
            }
            // Если нет - открываем новое
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
