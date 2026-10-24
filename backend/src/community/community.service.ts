import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
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
}
