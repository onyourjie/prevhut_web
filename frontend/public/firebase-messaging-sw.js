// Scripts for firebase and firebase messaging in Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.14.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.0/firebase-messaging-compat.js');

// Aktifkan langsung service worker tanpa menunggu tab lama ditutup
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

const configParams = new URL(self.location.href).searchParams;
const firebaseConfig = Object.fromEntries([
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
].map((key) => [key, configParams.get(key) || '']));

if (Object.values(firebaseConfig).every(Boolean)) {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  // Handle background messages
  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Background message received:', payload);

    // Jika pesan sudah membawa blok 'notification', FCM dan APNs (di iOS) sudah otomatis
    // menampilkannya ke layar pengguna. Jangan panggil showNotification lagi agar tidak muncul 2x (ganda).
    if (payload.notification) {
      return;
    }

    // Hanya tampilkan secara manual jika pesan berupa data-only payload
    const title = payload.data?.title || 'Firezone - Peringatan Titik Api';
    const options = {
      body: payload.data?.body || 'Ada pembaruan status kewaspadaan di wilayah Anda.',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: payload.data?.tag || 'firezone-alert',
      data: payload.data || {},
      vibrate: [200, 100, 200],
    };

    self.registration.showNotification(title, options);
  });
} else {
  console.error('[firebase-messaging-sw.js] Konfigurasi Firebase belum tersedia.');
}

// Handle notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.click_action || event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
