import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { PostStatus } from '@prisma/client';
import { ModeratePostDto, ModerationAction } from './dto/moderate-post.dto.js';

@Injectable()
export class ModerationService {
  constructor(private prisma: PrismaService) {}

  async getPostReports(query: { status?: 'all' | 'pending' | 'resolved'; kabupaten?: string; search?: string }) {
    const reportWhere: any = {};
    if (query.status === 'pending') {
      reportWhere.isResolved = false;
    } else if (query.status === 'resolved') {
      reportWhere.isResolved = true;
    }

    const posts = await this.prisma.post.findMany({
      where: {
        reports: {
          some: reportWhere,
        },
        ...(query.kabupaten
          ? { kabupaten: { contains: query.kabupaten.replace(/^(kabupaten|kota)\s+/i, '').trim(), mode: 'insensitive' } }
          : {}),
        ...(query.search
          ? {
              OR: [
                { content: { contains: query.search.trim(), mode: 'insensitive' } },
                { address: { contains: query.search.trim(), mode: 'insensitive' } },
                { author: { name: { contains: query.search.trim(), mode: 'insensitive' } } },
              ],
            }
          : {}),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true,
            avatarUrl: true,
            phone: true,
            kabupaten: true,
            kecamatan: true,
          },
        },
        reports: {
          include: {
            reporter: {
              select: {
                id: true,
                name: true,
                role: true,
                avatarUrl: true,
                phone: true,
                kabupaten: true,
                kecamatan: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return posts.map((p) => {
      const unresolvedCount = p.reports.filter((r) => !r.isResolved).length;
      const reasonsCount: Record<string, number> = {};
      p.reports.forEach((r) => {
        reasonsCount[r.reason] = (reasonsCount[r.reason] || 0) + 1;
      });

      return {
        id: p.id,
        content: p.content,
        imageUrl: p.imageUrl,
        category: p.category,
        status: p.status,
        address: p.address,
        province: p.province,
        kabupaten: p.kabupaten,
        kecamatan: p.kecamatan,
        latitude: p.latitude,
        longitude: p.longitude,
        clusterCode: p.clusterCode,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        author: p.author,
        totalReports: p.reports.length,
        unresolvedReportsCount: unresolvedCount,
        reasonsSummary: reasonsCount,
        reports: p.reports,
      };
    });
  }

  async getModerationStats() {
    const totalReports = await this.prisma.postReport.count();
    const pendingReports = await this.prisma.postReport.count({ where: { isResolved: false } });
    const resolvedReports = await this.prisma.postReport.count({ where: { isResolved: true } });
    const reportedPostsCount = await this.prisma.post.count({
      where: { reports: { some: { isResolved: false } } },
    });

    return {
      totalReports,
      pendingReports,
      resolvedReports,
      reportedPostsCount,
    };
  }

  async moderatePost(adminId: string, postId: string, dto: ModeratePostDto) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: { reports: true },
    });

    if (!post) {
      throw new NotFoundException('Postingan tidak ditemukan');
    }

    if (dto.action === ModerationAction.DELETE_POST) {
      await this.prisma.post.delete({ where: { id: postId } });
      return {
        success: true,
        action: dto.action,
        message: 'Postingan berhasil dihapus permanen oleh Admin Posko.',
      };
    }

    if (dto.action === ModerationAction.REJECT_HOAX) {
      const updatedPost = await this.prisma.post.update({
        where: { id: postId },
        data: {
          status: PostStatus.DITOLAK,
        },
      });

      await this.prisma.postReport.updateMany({
        where: { postId },
        data: { isResolved: true },
      });

      return {
        success: true,
        action: dto.action,
        message: 'Postingan telah ditolak sebagai hoax/data tidak sesuai. Kontribusi skoring konfirmasi warga pada klaster telah dinonaktifkan (kembali ke 0).',
        post: updatedPost,
      };
    }

    if (dto.action === ModerationAction.APPROVE_VALID) {
      await this.prisma.postReport.updateMany({
        where: { postId },
        data: { isResolved: true },
      });

      return {
        success: true,
        action: dto.action,
        message: 'Aduan telah diabaikan. Postingan dinyatakan sah/valid.',
        post,
      };
    }

    throw new BadRequestException('Aksi moderasi tidak valid');
  }
}
