import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { CreateUpdateDto } from './dto/create-update.dto.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { FlagPostDto } from './dto/flag-post.dto.js';
import { PostCategory, PostStatus } from '@prisma/client';

@Injectable()
export class CommunityService {
  constructor(private prisma: PrismaService) {}

  async getPosts(query: {
    category?: PostCategory;
    kabupaten?: string;
    kecamatan?: string;
    status?: PostStatus;
    search?: string;
  }) {
    const where: any = {};

    if (query.category) {
      where.category = query.category;
    }
    if (query.kabupaten) {
      where.kabupaten = { contains: query.kabupaten, mode: 'insensitive' };
    }
    if (query.kecamatan) {
      where.kecamatan = { contains: query.kecamatan, mode: 'insensitive' };
    }
    if (query.status) {
      where.status = query.status;
    }
    if (query.search) {
      where.OR = [
        { content: { contains: query.search, mode: 'insensitive' } },
        { address: { contains: query.search, mode: 'insensitive' } },
        { author: { name: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    return this.prisma.post.findMany({
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
      },
    });
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
          include: {
            volunteer: { select: { id: true, name: true, phone: true } },
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

    return post;
  }

  async createPost(userId: string, dto: CreatePostDto) {
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

    return {
      message:
        dto.category === PostCategory.DARURAT
          ? 'Postingan darurat berhasil dipublikasikan dan disematkan di komunitas!'
          : 'Informasi berhasil dibagikan ke komunitas!',
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
}
