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

const firebaseConfig = {
  apiKey: "AIzaSyBmB3rRubda-fBB_Qzmn9uO_3uXGPwOwq0",
  authDomain: "firezone-68bd5.firebaseapp.com",
  projectId: "firezone-68bd5",
  storageBucket: "firezone-68bd5.firebasestorage.app",
  messagingSenderId: "850267577964",
  appId: "1:850267577964:web:a3165b85648d4054838249"
};

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

