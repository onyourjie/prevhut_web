import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        avatarUrl: true,
        province: true,
        kabupaten: true,
        kecamatan: true,
        latitude: true,
        longitude: true,
        isGpsAlwaysActive: true,
        isAvailable: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            comments: true,
            moderationReports: true,
            volunteerTasks: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Pengguna tidak ditemukan');
    }

    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        avatarUrl: true,
        province: true,
        kabupaten: true,
        kecamatan: true,
        latitude: true,
        longitude: true,
        isGpsAlwaysActive: true,
        isAvailable: true,
        updatedAt: true,
      },
    });

    return {
      message: 'Profil berhasil diperbarui',
      user: updated,
    };
  }

  async getUserActivities(userId: string) {
    const [posts, comments, moderationReports] = await Promise.all([
      this.prisma.post.findMany({
        where: { authorId: userId },
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { comments: true, updates: true } },
        },
      }),
      this.prisma.comment.findMany({
        where: { authorId: userId },
        orderBy: { createdAt: 'desc' },
        include: {
          post: {
            select: { id: true, content: true, category: true, address: true },
          },
        },
      }),
      this.prisma.postReport.findMany({
        where: { reporterId: userId },
        orderBy: { createdAt: 'desc' },
        include: {
          post: {
            select: { id: true, content: true, address: true },
          },
        },
      }),
    ]);

    return {
      my_posts: posts,
      my_comments: comments,
      my_reports: moderationReports,
    };
  }

  async getAvailableVolunteers() {
    return this.prisma.user.findMany({
      where: {
        role: Role.RELAWAN,
        isAvailable: true,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        avatarUrl: true,
        province: true,
        kabupaten: true,
        kecamatan: true,
        latitude: true,
        longitude: true,
        isAvailable: true,
        _count: {
          select: {
            volunteerTasks: {
              where: {
                status: {
                  in: ['ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'ON_SITE'],
                },
              },
            },
          },
        },
      },
    });
  }
}
