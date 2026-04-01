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

// Обработка фоновых уведомлений
self.addEventListener('push', function(event) {
    console.log('Push received:', event);
    if (event.data) {
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

// Синхронизация в фоне
self.addEventListener('sync', function(event) {
    console.log('Sync event:', event);
    if (event.tag === 'sync-messages') {
        event.waitUntil(syncMessages());
    }
});

async function syncMessages() {
    try {
        const clients = await clients.matchAll();
        if (clients.length === 0) {
            console.log('App is closed, messages will be synced later');
        }
        return true;
    } catch (error) {
        console.error('Sync error:', error);
        return false;
    }
}
