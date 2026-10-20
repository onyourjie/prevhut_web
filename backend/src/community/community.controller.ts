import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CommunityService } from './community.service.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { CreateUpdateDto } from './dto/create-update.dto.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { FlagPostDto } from './dto/flag-post.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { PostCategory, PostStatus } from '@prisma/client';

@ApiTags('Community & Citizen Reports (Feed Komunitas & Pelaporan)')
@Controller('community')
export class CommunityController {
  constructor(private communityService: CommunityService) {}

  @Get('posts')
  @ApiOperation({ summary: 'Melihat feed postingan komunitas (Filter: Darurat/Informasi, Lokasi, Pencarian)' })
  @ApiQuery({ name: 'category', enum: PostCategory, required: false })
  @ApiQuery({ name: 'kabupaten', required: false })
  @ApiQuery({ name: 'kecamatan', required: false })
  @ApiQuery({ name: 'status', enum: PostStatus, required: false })
  @ApiQuery({ name: 'search', required: false })
  getPosts(
    @Query('category') category?: PostCategory,
    @Query('kabupaten') kabupaten?: string,
    @Query('kecamatan') kecamatan?: string,
    @Query('status') status?: PostStatus,
    @Query('search') search?: string,
  ) {
    return this.communityService.getPosts({ category, kabupaten, kecamatan, status, search });
  }

  @Get('posts/:id')
  @ApiOperation({ summary: 'Melihat detail 1 postingan lengkap dengan Update Pengirim dan Balasan Komentar' })
  getPostDetail(@Param('id') id: string) {
    return this.communityService.getPostDetail(id);
  }

  @Post('posts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Membuat laporan titik api / postingan komunitas (Simulasi Kamera Live & GPS Otomatis)' })
  createPost(@CurrentUser('id') userId: string, @Body() dto: CreatePostDto) {
    return this.communityService.createPost(userId, dto);
  }

  @Post('posts/:id/updates')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Menambahkan perkembangan kabar terbaru dari lokasi kejadian (Update Pengirim di Figma)' })
  addUpdate(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: CreateUpdateDto,
  ) {
    return this.communityService.addUpdate(userId, id, dto);
  }

  @Post('posts/:id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Menambahkan komentar atau bukti foto peer-validation di bawah postingan' })
  addComment(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.communityService.addComment(userId, id, dto);
  }

  @Post('posts/:id/flag')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Melaporkan postingan ke Admin (Diduga info palsu, foto tidak sesuai, spam)' })
  flagPost(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: FlagPostDto,
  ) {
    return this.communityService.flagPost(userId, id, dto);
  }
}
