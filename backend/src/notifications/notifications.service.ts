import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

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
}
