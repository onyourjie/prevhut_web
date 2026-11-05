import { apiRequest } from '@/lib/api';

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'ALERT_PRIORITAS' | 'TUGAS_BARU' | 'UPDATE_STATUS' | 'KOMENTAR' | 'SISTEM';
  isRead: boolean;
  metadata?: any;
  createdAt: string;
}

export interface NotificationsResponse {
  total: number;
  unread_count: number;
  grouped: {
    hari_ini: NotificationItem[];
    sebelumnya: NotificationItem[];
  };
  all: NotificationItem[];
}

/**
 * Mengambil daftar riwayat notifikasi pengguna.
 */
export async function fetchMyNotifications(): Promise<NotificationsResponse> {
  return apiRequest<NotificationsResponse>('/notifications');
}

/**
 * Menandai satu notifikasi sebagai dibaca.
 */
export async function markNotificationRead(id: string): Promise<any> {
  return apiRequest(`/notifications/${id}/read`, {
    method: 'PATCH',
  });
}

/**
 * Menandai semua notifikasi sebagai dibaca.
 */
export async function markAllNotificationsRead(): Promise<any> {
  return apiRequest('/notifications/read-all', {
    method: 'PATCH',
  });
}

/**
 * Mendaftarkan token perangkat FCM ke backend.
 */
export async function registerDeviceFcmToken(
  fcmToken: string,
  deviceType: string = 'web',
): Promise<any> {
  return apiRequest('/notifications/fcm-token', {
    method: 'POST',
    body: JSON.stringify({ fcmToken, deviceType }),
  });
}

/**
 * Menghapus token perangkat FCM saat logout.
 */
export async function unregisterDeviceFcmToken(fcmToken: string): Promise<any> {
  return apiRequest('/notifications/fcm-token', {
    method: 'DELETE',
    body: JSON.stringify({ fcmToken }),
  });
}

/**
 * Mengirim notifikasi tes ke akun sendiri untuk memverifikasi FCM.
 */
export async function sendTestPushNotification(
  title?: string,
  message?: string,
): Promise<any> {
  return apiRequest('/notifications/test-push', {
    method: 'POST',
    body: JSON.stringify({ title, message }),
  });
}

