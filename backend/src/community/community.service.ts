import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { CreateUpdateDto } from './dto/create-update.dto.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { FlagPostDto } from './dto/flag-post.dto.js';
import { PostCategory, PostStatus, Role } from '@prisma/client';

@Injectable()
export class CommunityService {
  private readonly logger = new Logger(CommunityService.name);
  private readonly dataServiceUrl = process.env.DATA_SERVICE_URL || 'http://localhost:8000';

  constructor(private prisma: PrismaService) {}

  async getUserQuota(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException("Pengguna tidak ditemukan");

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const postsToday = await this.prisma.post.count({
      where: {
        authorId: userId,
        createdAt: { gte: oneDayAgo },
      },
    });

    const maxDaily = user.role === "WARGA" ? 3 : 999;
    const remainingQuota = Math.max(0, maxDaily - postsToday);

    return {
      role: user.role,
      postsToday,
      maxDaily,
      remainingQuota,
      canPost: postsToday < maxDaily,
    };
  }

  async getPosts(query: {
    category?: PostCategory;
    province?: string;
    provinsi?: string;
    kabupaten?: string;
    kecamatan?: string;
    clusterCode?: string;
    status?: PostStatus;
    search?: string;
  }) {
    const andConditions: any[] = [];

    if (query.category) {
      andConditions.push({ category: query.category });
    }
    if (query.status) {
      andConditions.push({ status: query.status });
    }
    if (query.clusterCode) {
      andConditions.push({ clusterCode: { contains: query.clusterCode.trim(), mode: 'insensitive' } });
    }
    const provQuery = (query.province || query.provinsi || '').trim();
    if (provQuery) {
      andConditions.push({
        OR: [
          { province: { contains: provQuery, mode: 'insensitive' } },
          { address: { contains: provQuery, mode: 'insensitive' } },
        ],
      });
    }
    if (query.kabupaten && query.kabupaten.trim()) {
      const rawKab = query.kabupaten.trim();
      const cleanKab = rawKab.replace(/^(kabupaten|kota)\s+/i, '').trim();
      andConditions.push({
        OR: [
          { kabupaten: { contains: rawKab, mode: 'insensitive' } },
          { kabupaten: { contains: cleanKab, mode: 'insensitive' } },
          { address: { contains: rawKab, mode: 'insensitive' } },
          { address: { contains: cleanKab, mode: 'insensitive' } },
        ],
      });
    }
    if (query.kecamatan && query.kecamatan.trim()) {
      const rawKec = query.kecamatan.trim();
      const cleanKec = rawKec.replace(/^(kecamatan|kec\.)\s+/i, '').trim();
      andConditions.push({
        OR: [
          { kecamatan: { contains: rawKec, mode: 'insensitive' } },
          { kecamatan: { contains: cleanKec, mode: 'insensitive' } },
          { address: { contains: rawKec, mode: 'insensitive' } },
          { address: { contains: cleanKec, mode: 'insensitive' } },
        ],
      });
    }
    if (query.search && query.search.trim()) {
      const s = query.search.trim();
      andConditions.push({
        OR: [
          { content: { contains: s, mode: 'insensitive' } },
          { address: { contains: s, mode: 'insensitive' } },
          { author: { name: { contains: s, mode: 'insensitive' } } },
        ],
      });
    }

    const where: any = andConditions.length > 0 ? { AND: andConditions } : {};

    const posts = await this.prisma.post.findMany({
      where,
      orderBy: [
        { category: 'asc' }, // DARURAT comes first
        { createdAt: 'desc' },
      ],
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true,
            avatarUrl: true,
            kabupaten: true,
            kecamatan: true,
          },
        },
        updates: {
          orderBy: { createdAt: 'desc' },
          take: 2,
        },
        _count: {
          select: {
            comments: true,
            updates: true,
          },
        },
        assignments: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            volunteer: { select: { id: true, name: true, phone: true, avatarUrl: true, kabupaten: true } },
          },
        },
      },
    });

    // Sinkronisasi klaster: pasangkan assignment HANYA jika sedang aktif berjalan
    // ATAU jika selesai setelah postingan tersebut dibuat (bukan tugas masa lalu)
    const enrichedPosts = await Promise.all(
      posts.map(async (p) => {
        if ((!p.assignments || p.assignments.length === 0) && p.clusterCode) {
          const clusterAssignment = await this.prisma.volunteerAssignment.findFirst({
            where: {
              clusterCode: p.clusterCode,
              OR: [
                { status: { in: ['ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'ON_SITE'] } },
                {
                  status: 'COMPLETED',
                  completedAt: { gte: p.createdAt },
                },
              ],
            },
            orderBy: { createdAt: 'desc' },
            include: {
              volunteer: { select: { id: true, name: true, phone: true, avatarUrl: true, kabupaten: true } },
            },
          });
          if (clusterAssignment) {
            return { ...p, assignments: [clusterAssignment] };
          }
        }
        return p;
      })
    );

    return enrichedPosts;
  }

  async getPostDetail(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true,
            avatarUrl: true,
            province: true,
            kabupaten: true,
            kecamatan: true,
          },
        },
        updates: {
          orderBy: { createdAt: 'asc' },
          include: {
            author: { select: { id: true, name: true, role: true, avatarUrl: true } },
          },
        },
        comments: {
          orderBy: { createdAt: 'asc' },
          include: {
            author: { select: { id: true, name: true, role: true, avatarUrl: true } },
          },
        },
        assignments: {
          orderBy: { createdAt: "desc" },
          include: {
            volunteer: { select: { id: true, name: true, phone: true, avatarUrl: true, kabupaten: true } },
          },
        },
        _count: {
          select: { comments: true, updates: true, reports: true },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Postingan tidak ditemukan');
    }

    // Jika belum ada assignment langsung tapi ada clusterCode, ambil penugasan klaster
    // HANYA jika tugas sedang aktif atau diselesaikan setelah laporan warga dibuat
    if ((!post.assignments || post.assignments.length === 0) && post.clusterCode) {
      const clusterAssignment = await this.prisma.volunteerAssignment.findFirst({
        where: {
          clusterCode: post.clusterCode,
          OR: [
            { status: { in: ['ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'ON_SITE'] } },
            {
              status: 'COMPLETED',
              completedAt: { gte: post.createdAt },
            },
          ],
        },
        orderBy: { createdAt: 'desc' },
        include: {
          volunteer: { select: { id: true, name: true, phone: true, avatarUrl: true, kabupaten: true } },
        },
      });
      if (clusterAssignment) {
        post.assignments = [clusterAssignment];
      }
    }

    return post;
  }

  async createPost(userId: string, dto: CreatePostDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException("Pengguna tidak ditemukan");

    // Rate Limit 3x per 24 jam untuk WARGA
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const postsToday = await this.prisma.post.count({
      where: {
        authorId: userId,
        createdAt: { gte: oneDayAgo },
      },
    });

    if (user.role === "WARGA" && postsToday >= 3) {
      throw new BadRequestException(
        "Batas kuota pelaporan harian tercapai (maksimal 3 laporan per 24 jam untuk Warga). Hal ini untuk mencegah laporan spam dan duplikasi. Anda dapat menambahkan komentar atau informasi tambahan pada postingan yang sudah ada."
      );
    }
    const post = await this.prisma.post.create({
      data: {
        authorId: userId,
        category: dto.category,
        content: dto.content,
        imageUrl: dto.imageUrl ?? 'https://images.unsplash.com/photo-1542385151-efd9000785a0?w=800',
        isLiveCamera: dto.isLiveCamera ?? true,
        address: dto.address,
        province: dto.province ?? 'Kalimantan Barat',
        kabupaten: dto.kabupaten ?? 'Kabupaten Sintang',
        kecamatan: dto.kecamatan ?? 'Kecamatan Sungai Tebelian',
        latitude: dto.latitude,
        longitude: dto.longitude,
        clusterCode: dto.clusterCode,
        status: dto.category === PostCategory.DARURAT ? PostStatus.MENUNGGU_VERIFIKASI : PostStatus.SELESAI,
      },
      include: {
        author: {
          select: { id: true, name: true, role: true, avatarUrl: true },
        },
      },
    });

    // Teruskan laporan darurat warga ke microservice data & clustering (FastAPI) untuk live citizen boost
    try {
      fetch(`${this.dataServiceUrl}/api/community/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: { name: user.name, role: user.role },
          category: dto.category === PostCategory.DARURAT ? "Darurat" : "Informasi",
          address: dto.address,
          content: dto.content,
          image_url: dto.imageUrl,
          coordinates: {
            latitude: dto.latitude,
            longitude: dto.longitude,
            kabupaten: dto.kabupaten,
            kecamatan: dto.kecamatan,
          },
        }),
      }).catch((err) => this.logger.warn(`Gagal meneruskan laporan ke data service: ${err.message}`));
    } catch {}

    return {
      message:
        dto.category === PostCategory.DARURAT
          ? "Postingan darurat berhasil dipublikasikan dan disematkan di komunitas!"
          : "Informasi berhasil dibagikan ke komunitas!",
      post,
    };
  }

  async addUpdate(userId: string, postId: string, dto: CreateUpdateDto) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Postingan tidak ditemukan');
    }

    // Only original poster or admin can post update
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (post.authorId !== userId && user?.role !== 'ADMIN') {
      throw new ForbiddenException('Hanya pembuat laporan atau admin posko yang dapat menambahkan update pengirim');
    }

    const update = await this.prisma.postUpdate.create({
      data: {
        postId,
        authorId: userId,
        content: dto.content,
        imageUrl: dto.imageUrl,
      },
      include: {
        author: { select: { id: true, name: true, role: true, avatarUrl: true } },
      },
    });

    return {
      message: 'Update kondisi lapangan berhasil ditambahkan',
      update,
    };
  }

  async addComment(userId: string, postId: string, dto: CreateCommentDto) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Postingan tidak ditemukan');
    }

    const comment = await this.prisma.comment.create({
      data: {
        postId,
        authorId: userId,
        content: dto.content,
        imageUrl: dto.imageUrl,
      },
      include: {
        author: { select: { id: true, name: true, role: true, avatarUrl: true } },
      },
    });

    return {
      message: 'Komentar berhasil dikirim',
      comment,
    };
  }

  async flagPost(userId: string, postId: string, dto: FlagPostDto) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Postingan tidak ditemukan');
    }

    const report = await this.prisma.postReport.create({
      data: {
        postId,
        reporterId: userId,
        reason: dto.reason,
        notes: dto.notes,
      },
    });

    return {
      message: 'Laporan pelanggaran konten telah diterima untuk ditinjau oleh Admin Posko.',
      report,
    };
  }
  async uploadMedia(body: { data?: string; filename?: string }) {
    if (!body || !body.data) {
      throw new BadRequestException("Data file media base64 wajib disertakan");
    }

    const uploadsDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    let mime = "video/mp4";
    let base64Content = body.data;

    if (body.data.startsWith("data:")) {
      const commaIdx = body.data.indexOf(",");
      const meta = body.data.substring(0, commaIdx);
      base64Content = body.data.substring(commaIdx + 1);
      const mimeMatch = meta.match(/data:([^;]+)/);
      if (mimeMatch) mime = mimeMatch[1];
    }

    let ext = "mp4";
    if (mime.includes("webm")) ext = "webm";
    else if (mime.includes("jpeg") || mime.includes("jpg")) ext = "jpg";
    else if (mime.includes("png")) ext = "png";
    else if (mime.includes("mp4")) ext = "mp4";

    const cleanFilename = body.filename
      ? body.filename.replace(/[^a-zA-Z0-9._-]/g, "_")
      : `media-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    
    const filePath = path.join(uploadsDir, cleanFilename);
    const buffer = Buffer.from(base64Content, "base64");
    fs.writeFileSync(filePath, buffer);

    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    return {
      url: `${baseUrl}/uploads/${cleanFilename}`,
      filename: cleanFilename,
      mimeType: mime,
      size: buffer.length,
    };
  }

  async getIncidents(user: any, query: { kabupaten?: string; status?: string; search?: string }) {
    const where: any = { category: PostCategory.DARURAT };
    if (query.kabupaten) {
      where.kabupaten = { contains: query.kabupaten, mode: 'insensitive' };
    }
    if (query.status) {
      where.status = query.status;
    }
    if (query.search) {
      where.OR = [
        { clusterCode: { contains: query.search, mode: 'insensitive' } },
        { address: { contains: query.search, mode: 'insensitive' } },
        { content: { contains: query.search, mode: 'insensitive' } },
        { kabupaten: { contains: query.search, mode: 'insensitive' } },
        { kecamatan: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const posts = await this.prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true, phone: true, role: true, avatarUrl: true },
        },
      },
    });

    const assignments = await this.prisma.volunteerAssignment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        volunteer: {
          select: { id: true, name: true, phone: true, avatarUrl: true, kabupaten: true, province: true },
        },
      },
    });

    const groupsMap = new Map<string, any>();

    for (const post of posts) {
      const groupKey = post.clusterCode
        ? `cluster:${post.clusterCode}`
        : `loc:${post.kecamatan || ''}_${post.kabupaten || ''}`;

      if (!groupsMap.has(groupKey)) {
        // Cari assignment yang masih aktif, atau jika completed, completed setelah postingan terbaru dibuat
        const matchAssignment =
          assignments.find((a) => {
            const isMatch = (post.clusterCode && a.clusterCode === post.clusterCode) || a.postId === post.id;
            if (!isMatch) return false;
            // Jika assignment masih aktif berjalan: valid
            if (['ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'ON_SITE'].includes(a.status)) return true;
            // Jika assignment sudah selesai di masa lalu: hanya valid jika selesai setelah laporan ini dibuat
            if (a.status === 'COMPLETED' && a.completedAt && new Date(a.completedAt) >= new Date(post.createdAt)) {
              return true;
            }
            return false;
          }) || null;

        groupsMap.set(groupKey, {
          key: groupKey,
          clusterCode: post.clusterCode || null,
          title: post.clusterCode || `Titik Api ${post.kecamatan ? post.kecamatan + ', ' : ''}${post.kabupaten || 'Kalimantan'}`,
          address: post.address,
          province: post.province,
          kabupaten: post.kabupaten,
          kecamatan: post.kecamatan,
          latitude: post.latitude,
          longitude: post.longitude,
          status: post.status,
          posts: [],
          assignment: matchAssignment,
          isAssignedToMe: user?.role === Role.RELAWAN && matchAssignment?.volunteerId === user?.id,
          isInMyKabupaten: Boolean(
            user?.kabupaten && post.kabupaten && post.kabupaten.toLowerCase().includes(user.kabupaten.toLowerCase())
          ),
          latestCreatedAt: post.createdAt,
        });
      }

      const group = groupsMap.get(groupKey);
      group.posts.push(post);
      if (new Date(post.createdAt) > new Date(group.latestCreatedAt)) {
        group.latestCreatedAt = post.createdAt;
      }
    }

    const result = Array.from(groupsMap.values()).map((g) => {
      const hasUnverifiedPosts = g.posts.some((p: any) => p.status === PostStatus.MENUNGGU_VERIFIKASI);
      const hasActiveAssignment = Boolean(
        g.assignment &&
        ['ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'ON_SITE'].includes(g.assignment.status)
      );
      const anyPostDalamPenanganan = g.posts.some((p: any) => p.status === PostStatus.DALAM_PENANGANAN);
      const allPostsSelesai = g.posts.length > 0 && g.posts.every((p: any) => p.status === PostStatus.SELESAI);

      let overallStatus: PostStatus = PostStatus.MENUNGGU_VERIFIKASI;
      if (hasUnverifiedPosts && !hasActiveAssignment) {
        // Ada laporan baru yang masuk setelah tugas sebelumnya selesai -> Wajib Menunggu Disposisi Baru!
        overallStatus = PostStatus.MENUNGGU_VERIFIKASI;
      } else if (hasActiveAssignment || anyPostDalamPenanganan) {
        overallStatus = PostStatus.DALAM_PENANGANAN;
      } else if (allPostsSelesai || g.assignment?.status === 'COMPLETED') {
        overallStatus = PostStatus.SELESAI;
      }

      return {
        ...g,
        status: overallStatus,
        totalReports: g.posts.length,
      };
    });

    result.sort((a, b) => {
      const rank: Record<string, number> = {
        MENUNGGU_VERIFIKASI: 1,
        DALAM_PENANGANAN: 2,
        SELESAI: 3,
        DITOLAK: 4,
      };
      const diff = (rank[a.status] || 5) - (rank[b.status] || 5);
      if (diff !== 0) return diff;
      return new Date(b.latestCreatedAt).getTime() - new Date(a.latestCreatedAt).getTime();
    });

    return result;
  }
}
