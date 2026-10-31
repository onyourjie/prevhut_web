import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported, type Messaging } from 'firebase/messaging';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBmB3rRubda-fBB_Qzmn9uO_3uXGPwOwq0',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'firezone-68bd5.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'firezone-68bd5',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'firezone-68bd5.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '850267577964',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:850267577964:web:a3165b85648d4054838249',
};

// Inisialisasi Firebase App (Singleton)
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let messagingInstance: Messaging | null = null;

/**
 * Cek apakah perangkat saat ini adalah iOS (iPhone / iPad).
 */
export function isIosDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

/**
 * Cek apakah aplikasi sedang berjalan dalam mode PWA Standalone (dibuka dari Layar Utama).
 */
export function isStandalonePwa(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    Boolean((navigator as any).standalone)
  );
}

/**
 * Konversi URL-safe Base64 string menjadi Uint8Array untuk PushManager.
 * Diperlukan khusus oleh Safari / WebKit di iOS & macOS untuk menghindari
 * error: 'SyntaxError: The string did not match the expected pattern'.
 */
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Mendapatkan instance Firebase Messaging secara aman (menghindari crash di browser yang tidak mendukung Service Worker / Push).
 */
export async function getFirebaseMessaging(): Promise<Messaging | null> {
  if (typeof window === 'undefined') return null;

  try {
    const supported = await isSupported();
    if (!supported) {
      console.warn('[FCM] Browser ini tidak mendukung Web Push Notification.');
      return null;
    }

    if (!messagingInstance) {
      messagingInstance = getMessaging(firebaseApp);
    }
    return messagingInstance;
  } catch (error) {
    console.error('[FCM] Gagal inisialisasi Firebase Messaging:', error);
    return null;
  }
}

/**
 * Meminta izin notifikasi ke browser dan mengambil FCM Device Registration Token.
 */
export async function requestFcmToken(vapidKey?: string): Promise<string> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    throw new Error('Notifikasi tidak didukung pada browser ini.');
  }

  // Khusus iOS: Web Push WAJIB dijalankan dari Layar Utama (PWA Standalone)
  if (isIosDevice() && !isStandalonePwa()) {
    throw new Error(
      'Khusus iPhone (iOS): Buka menu Bagikan (Share) di Safari > pilih "Tambah ke Layar Utama" (Add to Home Screen), lalu buka aplikasi dari ikon tersebut untuk mengaktifkan notifikasi.',
    );
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Izin notifikasi belum diizinkan oleh pengguna.');
  }

  const messaging = await getFirebaseMessaging();
  if (!messaging) {
    throw new Error('Firebase Messaging tidak didukung pada lingkungan browser ini.');
  }

  const rawKey =
    vapidKey ||
    import.meta.env.VITE_FIREBASE_VAPID_KEY ||
    'BHgR85bc0X8z5L_3yGMPRPsIbm5XzXUegDGq5e9BzuU7kH3V_TEO0mKH8PGGKOWOv68nHjDqnm6yLDjzbvjplaY';
  const currentVapidKey = typeof rawKey === 'string' ? rawKey.trim().replace(/^["']|["']$/g, '') : '';

  if (!currentVapidKey) {
    throw new Error('VAPID key belum dikonfigurasi di environment frontend.');
  }

  let serviceWorkerRegistration: ServiceWorkerRegistration | undefined;
  if ('serviceWorker' in navigator) {
    try {
      // 1. Bersihkan registrasi service worker lama yang bermasalah (jika ada)
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          if (reg.scope.includes('firebase-cloud-messaging-push-scope')) {
            await reg.unregister();
          }
        }
      } catch {
        // Abaikan jika tidak diizinkan
      }

      // 2. Daftarkan service worker dengan scope root
      await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/' });

      // 3. Pastikan service worker sudah dalam keadaan siap & aktif (mencegah WebKit pattern error)
      serviceWorkerRegistration = await navigator.serviceWorker.ready;

      if (serviceWorkerRegistration && !serviceWorkerRegistration.active) {
        await new Promise<void>((resolve) => {
          const sw = serviceWorkerRegistration?.installing || serviceWorkerRegistration?.waiting;
          if (!sw) return resolve();
          sw.addEventListener('statechange', function onState() {
            if (sw.state === 'activated') {
              sw.removeEventListener('statechange', onState);
              resolve();
            }
          });
          setTimeout(resolve, 2500);
        });
      }
    } catch (swErr) {
      console.warn('[FCM] Service worker registration warning:', swErr);
    }
  }

  // 4. Daftarkan PushSubscription langsung dengan Uint8Array untuk WebKit/Safari
  if (serviceWorkerRegistration && 'pushManager' in serviceWorkerRegistration) {
    try {
      const existingSub = await serviceWorkerRegistration.pushManager.getSubscription();
      if (!existingSub) {
        await serviceWorkerRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(currentVapidKey) as unknown as BufferSource,
        });
      }
    } catch (subErr) {
      console.warn('[FCM] PushManager pre-subscribe warning:', subErr);
    }
  }

  try {
    const currentToken = await getToken(messaging, {
      vapidKey: currentVapidKey,
      serviceWorkerRegistration,
    });

    if (!currentToken) {
      throw new Error('Firebase tidak mengembalikan registration token.');
    }
    return currentToken;
  } catch (error: any) {
    console.error('[FCM] Error saat memanggil getToken():', error);

    const errorMsg = String(error?.message || error || '');
    if (
      errorMsg.includes('did not match the expected pattern') ||
      errorMsg.includes('SyntaxError')
    ) {
      if (isIosDevice()) {
        throw new Error(
          'Untuk pengguna iPhone (iOS), Web Push hanya bisa diaktifkan setelah website di-"Add to Home Screen" (Layar Utama).',
        );
      }
      throw new Error(
        'Format token peramban belum sinkron. Silakan muat ulang halaman atau hapus cache service worker.',
      );
    }

    throw new Error(error?.message || 'Gagal membuat token registrasi FCM.');
  }
}

/**
 * Listener untuk menerima notifikasi saat aplikasi sedang dalam kondisi foreground (tab web sedang aktif).
 */
export async function onForegroundMessage(callback: (payload: any) => void): Promise<(() => void) | null> {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return null;

  return onMessage(messaging, (payload) => {
    callback(payload);
  });
}
