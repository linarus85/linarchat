importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDjmOj0ajsNN0oUCdyqExFZ3Fjznv1UyAE",
    authDomain: "linarchat-8fc1b.firebaseapp.com",
    projectId: "linarchat-8fc1b",
    storageBucket: "linarchat-8fc1b.firebasestorage.app",
    messagingSenderId: "120171949297",
    appId: "1:120171949297:web:ee7a964c4f0c7442960d50"
});

const messaging = firebase.messaging();

// Фоновые уведомления
messaging.onBackgroundMessage((payload) => {
    console.log('Background message:', payload);

    const notificationTitle = payload.notification?.title || 'Новое сообщение';
    const notificationOptions = {
        body: payload.notification?.body || 'У вас новое сообщение',
        icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23075e54"/%3E%3Ctext x="50" y="70" font-size="55" text-anchor="middle" fill="white"%3EL%3C/text%3E%3C/svg%3E',
        vibrate: [200, 100, 200],
        data: {
            url: '/',
            senderId: payload.data?.senderId
        }
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Клик по уведомлению
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(clients.openWindow('/'));
});

// Кэширование для PWA (опционально)
self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request));
});

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});