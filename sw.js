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

self.addEventListener('push', function(event) {
    console.log('Push received:', event);
    if (event.data) {
        try {
            const data = event.data.json();
            const options = {
                body: data.body,
                icon: '/linarchat/icon-192.png',
                badge: '/linarchat/icon-192.png',
                vibrate: [200, 100, 200],
                data: {
                    url: data.url || '/linarchat/',
                    senderId: data.senderId
                },
                actions: [
                    {
                        action: 'open',
                        title: 'Открыть чат'
                    }
                ]
            };
            event.waitUntil(self.registration.showNotification(data.title, options));
        } catch (e) {
            console.error('Push data error:', e);
        }
    }
});

self.addEventListener('notificationclick', function(event) {
    console.log('Notification clicked:', event);
    event.notification.close();
    
    const urlToOpen = event.notification.data?.url || '/linarchat/';
    
    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then(windowClients => {
            for (let client of windowClients) {
                if (client.url.includes('/linarchat/') && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});

self.addEventListener('message', function(event) {
    console.log('SW received message:', event.data);
});
