import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { requestFcmToken, onForegroundMessage, isIosDevice, isStandalonePwa } from '@/lib/firebase';
import {
  registerDeviceFcmToken,
  sendTestPushNotification,
} from './api';
import { Toast, FirezoneSwal } from '@/lib/swal';
import { useQueryClient } from '@tanstack/react-query';

const FCM_LOCAL_TOKEN_KEY = 'firezone_fcm_token';

export function useFcmNotification() {
  const { isAuthenticated, user } = useAuthStore();
  const queryClient = useQueryClient();

  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Periksa dukungan browser dan status izin awal
  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setPermission('unsupported');
      return;
    }

    setPermission(Notification.permission);
    const savedToken = localStorage.getItem(FCM_LOCAL_TOKEN_KEY);
    if (savedToken) {
      setFcmToken(savedToken);
    }
  }, []);

  // Daftarkan ulang token jika pengguna login dan izin sudah granted sebelumnya
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      const savedToken = localStorage.getItem(FCM_LOCAL_TOKEN_KEY);
      if (savedToken) {
        registerDeviceFcmToken(savedToken, 'web').catch((err) => {
          console.warn('[FCM] Gagal refresh token ke backend:', err);
        });
      } else {
        requestFcmToken()
          .then((token) => {
            if (token) {
              localStorage.setItem(FCM_LOCAL_TOKEN_KEY, token);
              setFcmToken(token);
              registerDeviceFcmToken(token, 'web').catch(() => {});
            }
          })
          .catch((err) => {
            console.warn('[FCM] Silent token refresh warning:', err);
          });
      }
    }
  }, [isAuthenticated, user]);

  // Listener notifikasi saat tab web sedang terbuka (Foreground)
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    onForegroundMessage((payload) => {
      console.log('[FCM] Menerima notifikasi foreground:', payload);

      const title = payload.notification?.title || payload.data?.title || 'Peringatan Firezone';
      const body = payload.notification?.body || payload.data?.body || 'Ada informasi titik api baru.';

      // 1. Tampilkan native OS/system notification (Windows Toast / Mobile Shade)
      if (
        typeof window !== 'undefined' &&
        'Notification' in window &&
        Notification.permission === 'granted'
      ) {
        try {
          new Notification(title, {
            body,
            icon: '/icon-192.png',
            tag: payload.data?.tag || 'firezone-alert',
          });
        } catch {
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready
              .then((reg) => {
                reg.showNotification(title, {
                  body,
                  icon: '/icon-192.png',
                  tag: payload.data?.tag || 'firezone-alert',
                });
              })
              .catch(() => {});
          }
        }
      }

      // 2. Tampilkan toast pemberitahuan di pojok layar
      Toast.fire({
        icon: 'warning',
        title: title,
        text: body,
      });

      // 3. Refresh cache data notifikasi di TanStack Query
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    })
      .then((unsub) => {
        unsubscribe = unsub;
      })
      .catch((err) => {
        console.warn('[FCM] Foreground listener error:', err);
      });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [queryClient]);

  // Fungsi untuk meminta izin notifikasi dan mendaftarkan perangkat
  const enableNotifications = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      Toast.fire({
        icon: 'error',
        title: 'Browser Tidak Mendukung',
        text: 'Perangkat atau peramban ini tidak mendukung Web Push Notification.',
      });
      return false;
    }

    // Panduan khusus untuk pengguna iOS Safari yang belum memasang PWA
    if (isIosDevice() && !isStandalonePwa()) {
      FirezoneSwal.fire({
        icon: 'info',
        title: 'Pasang ke Layar Utama',
        html: `
          <div style="text-align: left; font-size: 13px; line-height: 1.6; color: #404040;">
            <p>Untuk pengguna <b>iPhone (iOS)</b>, notifikasi web hanya dapat aktif jika aplikasi dijalankan dari Layar Utama:</p>
            <ol style="margin-top: 8px; padding-left: 18px;">
              <li>Ketuk tombol <b>Bagikan (Share)</b> di bagian bawah Safari.</li>
              <li>Pilih menu <b>Tambah ke Layar Utama (Add to Home Screen)</b>.</li>
              <li>Buka aplikasi Firezone dari ikon di Layar Utama HP Anda.</li>
              <li>Masuk dan klik kembali tombol <b>Aktifkan</b>.</li>
            </ol>
          </div>
        `,
        confirmButtonText: 'Saya Mengerti',
        confirmButtonColor: '#ea580c',
      });
      return false;
    }

    setIsLoading(true);
    try {
      const token = await requestFcmToken();
      const currentPerm = Notification.permission;
      setPermission(currentPerm);

      if (!token || currentPerm !== 'granted') {
        Toast.fire({
          icon: 'info',
          title: 'Izin Belum Diberikan',
          text: 'Pemberitahuan darurat tidak dapat dikirimkan jika izin notifikasi ditolak.',
        });
        return false;
      }

      localStorage.setItem(FCM_LOCAL_TOKEN_KEY, token);
      setFcmToken(token);

      if (isAuthenticated) {
        await registerDeviceFcmToken(token, 'web');
      }

      Toast.fire({
        icon: 'success',
        title: 'Notifikasi Aktif',
        text: 'Perangkat Anda siap menerima peringatan darurat karhutla.',
      });

      return true;
    } catch (error: any) {
      console.error('[FCM] Gagal mengaktifkan notifikasi:', error);
      const detailMsg = error?.message || 'Terjadi kendala saat registrasi token notifikasi.';
      Toast.fire({
        icon: 'error',
        title: 'Gagal Mengaktifkan',
        text: detailMsg,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Fungsi untuk mengirim notifikasi tes mandiri
  const testPush = useCallback(async () => {
    if (!isAuthenticated) {
      FirezoneSwal.fire({
        icon: 'warning',
        title: 'Silakan Masuk',
        text: 'Masuk akun terlebih dahulu untuk menguji coba pengiriman push notification.',
      });
      return;
    }

    setIsLoading(true);
    try {
      let currentToken = fcmToken || localStorage.getItem(FCM_LOCAL_TOKEN_KEY);

      // Jika belum ada token sama sekali di storage, coba buat token baru
      if (!currentToken) {
        currentToken = await requestFcmToken();
        if (currentToken) {
          localStorage.setItem(FCM_LOCAL_TOKEN_KEY, currentToken);
          setFcmToken(currentToken);
        }
      }

      // Pastikan token selalu terdaftar & sinkron di backend sebelum test-push
      if (currentToken) {
        await registerDeviceFcmToken(currentToken, 'web');
      }

      const res = await sendTestPushNotification(
        '🔥 Uji Coba Peringatan Firezone',
        'Sistem Push Notification FCM berhasil terhubung dengan server dan peramban Anda.',
      );

      if (res && res.targetDevicesCount === 0) {
        Toast.fire({
          icon: 'warning',
          title: 'Perangkat Belum Tersimpan',
          text: 'Token FCM belum terdaftar di database. Silakan klik tombol Sinkron terlebih dahulu.',
        });
        return;
      }

      Toast.fire({
        icon: 'success',
        title: 'Notifikasi Tes Dikirim',
        text: `Terkirim ke ${res?.targetDevicesCount || 1} perangkat. Periksa notifikasi sistem di desktop atau HP Anda!`,
      });
    } catch (error: any) {
      console.error('[FCM] Gagal mengirim tes push:', error);
      Toast.fire({
        icon: 'error',
        title: 'Gagal Mengirim Tes',
        text: error?.message || 'Pastikan server backend sedang aktif.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, fcmToken]);

  return {
    permission,
    fcmToken,
    isSubscribed: Boolean(fcmToken && permission === 'granted'),
    isLoading,
    enableNotifications,
    testPush,
  };
}
