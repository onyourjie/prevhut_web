import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { PostStatus } from '@prisma/client';
import { ModeratePostDto, ModerationAction } from './dto/moderate-post.dto.js';

@Injectable()
export class ModerationService {
  constructor(private prisma: PrismaService) {}

  async getPostReports(query: { status?: 'all' | 'pending' | 'resolved'; kabupaten?: string; search?: string }) {
    let reportFilter: any = {};
    if (query.status === 'pending') {
      reportFilter = { some: { isResolved: false } };
    } else if (query.status === 'resolved') {
      reportFilter = {
        some: { isResolved: true },
        none: { isResolved: false },
      };
    } else {
      reportFilter = { some: {} };
    }

    const posts = await this.prisma.post.findMany({
      where: {
        reports: reportFilter,
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

  async getModerationStats(query?: { kabupaten?: string }) {
    const kabFilter = query?.kabupaten
      ? {
          kabupaten: {
            contains: query.kabupaten.replace(/^(kabupaten|kota)\s+/i, '').trim(),
            mode: 'insensitive' as const,
          },
        }
      : {};

    const totalReports = await this.prisma.postReport.count({
      where: {
        ...(query?.kabupaten ? { post: kabFilter } : {}),
      },
    });

    const pendingReports = await this.prisma.postReport.count({
      where: {
        isResolved: false,
        ...(query?.kabupaten ? { post: kabFilter } : {}),
      },
    });

    const resolvedReports = await this.prisma.postReport.count({
      where: {
        isResolved: true,
        ...(query?.kabupaten ? { post: kabFilter } : {}),
      },
    });

    const totalPosts = await this.prisma.post.count({
      where: {
        ...kabFilter,
        reports: { some: {} },
      },
    });

    const pendingPosts = await this.prisma.post.count({
      where: {
        ...kabFilter,
        reports: { some: { isResolved: false } },
      },
    });

    const resolvedPosts = await this.prisma.post.count({
      where: {
        ...kabFilter,
        reports: {
          some: { isResolved: true },
          none: { isResolved: false },
        },
      },
    });

    return {
      totalReports,
      pendingReports,
      resolvedReports,
      totalPosts,
      pendingPosts,
      resolvedPosts,
      reportedPostsCount: totalPosts,
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

    const hasUnresolved = post.reports.some((r) => !r.isResolved);
    if (!hasUnresolved) {
      throw new BadRequestException('Aduan pada postingan ini telah selesai ditinjau dan statusnya tidak dapat diubah lagi.');
    }

    if (dto.action === ModerationAction.REJECT_HOAX || dto.action === ModerationAction.DELETE_POST) {
      // 1. Batalkan penugasan relawan aktif yang terhubung ke laporan palsu ini
      await this.prisma.volunteerAssignment.updateMany({
        where: {
          postId,
          status: { in: ['ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'ON_SITE'] },
        },
        data: {
          status: 'REJECTED',
          rejectionReason: 'Dibatalkan oleh Posko: Laporan warga terbukti data palsu / hoax.',
        },
      });

      // 2. Tandai seluruh aduan pada postingan ini telah diselesaikan
      await this.prisma.postReport.updateMany({
        where: { postId },
        data: { isResolved: true },
      });

      // 3. Update status postingan menjadi DITOLAK (soft-delete / disembunyikan dari publik & riwayat moderasi tersimpan)
      const updatedPost = await this.prisma.post.update({
        where: { id: postId },
        data: { status: PostStatus.DITOLAK },
      });

      return {
        success: true,
        action: dto.action,
        message: 'Postingan terbukti data palsu/hoax, berhasil ditolak dan disembunyikan dari publik.',
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
        message: 'Aduan telah diselesaikan. Postingan dinyatakan sah/valid.',
        post,
      };
    }

    throw new BadRequestException('Aksi moderasi tidak valid');
  }
}
