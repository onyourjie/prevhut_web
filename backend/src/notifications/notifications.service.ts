import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { FcmService } from './fcm.service.js';
import { NotificationType } from '@prisma/client';

export interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
  metadata?: any;
  url?: string;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private prisma: PrismaService,
    private fcmService: FcmService,
  ) {}

  async getMyNotifications(userId: string) {
    const notifications = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const now = new Date();
    const today = notifications.filter((n) => {
      const d = new Date(n.createdAt);
      return d.toDateString() === now.toDateString();
    });

    const past = notifications.filter((n) => {
      const d = new Date(n.createdAt);
      return d.toDateString() !== now.toDateString();
    });

    return {
      total: notifications.length,
      unread_count: notifications.filter((n) => !n.isRead).length,
      grouped: {
        hari_ini: today,
        sebelumnya: past,
      },
      all: notifications,
    };
  }

  async markAsRead(userId: string, id: string) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  /**
   * Menyimpan atau memperbarui FCM Device Registration Token untuk pengguna.
   */
  async registerFcmToken(
    userId: string,
    fcmToken: string,
    deviceType: string = 'web',
    userAgent?: string,
  ) {
    if (!fcmToken?.trim()) {
      this.logger.warn(`[FCM] Gagal register token: fcmToken kosong untuk user ${userId}`);
      return null;
    }

    const device = await this.prisma.userDevice.upsert({
      where: { fcmToken: fcmToken.trim() },
      create: {
        userId,
        fcmToken: fcmToken.trim(),
        deviceType,
        userAgent,
      },
      update: {
        userId,
        deviceType,
        userAgent,
        updatedAt: new Date(),
      },
    });

    this.logger.log(
      `[FCM] Token perangkat berhasil didaftarkan di database untuk user ${userId} (${deviceType})`,
    );

    return device;
  }

  /**
   * Menghapus FCM Token saat pengguna logout dari perangkat.
   */
  async unregisterFcmToken(userId: string, fcmToken: string) {
    if (!fcmToken?.trim()) return;

    return this.prisma.userDevice.deleteMany({
      where: {
        userId,
        fcmToken: fcmToken.trim(),
      },
    });
  }

  /**
   * Membuat notifikasi baru di database sekaligus mengirim Push Notification melalui FCM.
   */
  async createAndSendNotification(params: CreateNotificationParams) {
    const { userId, title, message, type = NotificationType.SISTEM, metadata, url } = params;

    // 1. Simpan ke database (In-app notification history)
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        metadata: metadata ? metadata : undefined,
      },
    });

    // 2. Ambil token perangkat pengguna
    let targetDevicesCount = 0;
    let pushSent = false;

    try {
      const userDevices = await this.prisma.userDevice.findMany({
        where: { userId },
        select: { fcmToken: true },
      });

      const tokens = userDevices.map((d) => d.fcmToken);
      targetDevicesCount = tokens.length;

      if (tokens.length === 0) {
        this.logger.warn(
          `[FCM] Belum ada device token terdaftar untuk user ${userId}. Push tidak dikirim.`,
        );
      } else if (!this.fcmService.isReady()) {
        this.logger.warn(
          `[FCM] Layanan FCM belum siap (file service account belum terkonfigurasi). Push tidak dikirim.`,
        );
      } else {
        const result = await this.fcmService.sendMulticast(tokens, {
          title,
          body: message,
          data: {
            notificationId: notification.id,
            type,
            ...(metadata && typeof metadata === 'object'
              ? { metadata: JSON.stringify(metadata) }
              : {}),
          },
          url: url || '/notifications',
        });

        pushSent = result.successCount > 0;

        // 3. Bersihkan token yang sudah tidak aktif / expired
        if (result.invalidTokens.length > 0) {
          await this.prisma.userDevice.deleteMany({
            where: {
              fcmToken: { in: result.invalidTokens },
            },
          });
          this.logger.log(
            `[FCM] Dibersihkan ${result.invalidTokens.length} token tidak valid dari user ${userId}`,
          );
        }
      }
    } catch (err) {
      this.logger.error(`[FCM] Gagal mengirim push notification ke user ${userId}:`, err);
    }

    return {
      ...notification,
      targetDevicesCount,
      pushSent,
    };
  }

  /**
   * Mengirim notifikasi yang sama ke banyak pengguna sekaligus secara efisien:
   * - 1 query createMany untuk riwayat in-app (lonceng)
   * - 1 query ambil seluruh token perangkat
   * - FCM multicast per batch 500 token (batas maksimal FCM)
   * Masing-masing pengguna boleh memiliki pesan berbeda (misal jarak km), dikelompokkan per isi pesan.
   */
  async sendBulkNotifications(
    items: Array<{ userId: string; title: string; message: string }>,
    options: { type?: NotificationType; metadata?: any; url?: string } = {},
  ) {
    if (!items || items.length === 0) return { stored: 0, pushSuccess: 0 };
    const { type = NotificationType.SISTEM, metadata, url } = options;

    await this.prisma.notification.createMany({
      data: items.map((it) => ({
        userId: it.userId,
        title: it.title,
        message: it.message,
        type,
        metadata: metadata ? metadata : undefined,
      })),
    });

    if (!this.fcmService.isReady()) {
      this.logger.warn('[FCM] Layanan FCM belum siap. Notifikasi massal hanya disimpan in-app.');
      return { stored: items.length, pushSuccess: 0 };
    }

    const devices = await this.prisma.userDevice.findMany({
      where: { userId: { in: items.map((it) => it.userId) } },
      select: { userId: true, fcmToken: true },
    });
    if (devices.length === 0) return { stored: items.length, pushSuccess: 0 };

    // Kelompokkan token berdasarkan isi pesan yang identik agar bisa dikirim multicast
    const msgByUser = new Map(items.map((it) => [it.userId, it]));
    const groups = new Map<string, { title: string; message: string; tokens: string[] }>();
    for (const d of devices) {
      const it = msgByUser.get(d.userId);
      if (!it) continue;
      const key = `${it.title}||${it.message}`;
      if (!groups.has(key)) groups.set(key, { title: it.title, message: it.message, tokens: [] });
      groups.get(key)!.tokens.push(d.fcmToken);
    }

    let pushSuccess = 0;
    const invalidTokens: string[] = [];
    for (const g of groups.values()) {
      for (let i = 0; i < g.tokens.length; i += 500) {
        const chunk = g.tokens.slice(i, i + 500);
        const result = await this.fcmService.sendMulticast(chunk, {
          title: g.title,
          body: g.message,
          data: {
            type,
            ...(metadata && typeof metadata === 'object' ? { metadata: JSON.stringify(metadata) } : {}),
          },
          url: url || '/notifications',
        });
        pushSuccess += result.successCount;
        invalidTokens.push(...result.invalidTokens);
      }
    }

    if (invalidTokens.length > 0) {
      await this.prisma.userDevice.deleteMany({ where: { fcmToken: { in: invalidTokens } } });
    }

    return { stored: items.length, pushSuccess };
  }

  /**
   * Mengirim notifikasi siaran berdasarkan topik (misal: 'warga-kalbar', 'peringatan-umum').
   */
  async broadcastTopicAlert(topic: string, title: string, message: string, url?: string) {
    return this.fcmService.sendTopic(topic, {
      title,
      body: message,
      url: url || '/map',
    });
  }
}
