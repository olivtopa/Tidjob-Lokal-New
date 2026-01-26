// Service Worker for PWA support
// Previously handled Push Notifications, now cleaned up.
// Kept to allow "Install App" functionality.

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// Fetch handler can be added here if offline support is desired later
