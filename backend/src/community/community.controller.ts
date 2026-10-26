import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CommunityService } from './community.service.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { CreateUpdateDto } from './dto/create-update.dto.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { FlagPostDto } from './dto/flag-post.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { PostCategory, PostStatus, Role } from '@prisma/client';

@ApiTags('3. Komunitas & Laporan Warga (Community)')
@Controller('community')
export class CommunityController {
  constructor(private communityService: CommunityService) {}

  @Get("quota")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Cek sisa kuota postingan harian pengguna (Maks 3 per hari untuk akun Warga)",
    description: "Mengembalikan jumlah laporan yang dibuat dalam 24 jam terakhir dan sisa kuota yang dapat digunakan.",
  })
  @ApiResponse({ status: 200, description: "Informasi sisa kuota postingan" })
  getUserQuota(@CurrentUser("id") userId: string) {
    return this.communityService.getUserQuota(userId);
  }

  @Get("posts")
  @ApiOperation({
    summary: 'Melihat feed postingan komunitas (Filter: Darurat/Informasi, Lokasi, Pencarian)',
    description: 'Menampilkan feed kabar warga & relawan. Postingan Darurat otomatis disematkan di posisi teratas.',
  })
  @ApiQuery({ name: 'category', enum: PostCategory, required: false, description: 'Filter kategori: DARURAT atau INFORMASI' })
  @ApiQuery({ name: 'province', required: false, description: 'Filter provinsi (contoh: Kalimantan Barat)' })
  @ApiQuery({ name: 'provinsi', required: false, description: 'Alias filter provinsi' })
  @ApiQuery({ name: 'kabupaten', required: false, description: 'Filter kabupaten (contoh: Kabupaten Sintang)' })
  @ApiQuery({ name: 'kecamatan', required: false, description: 'Filter kecamatan (contoh: Kecamatan Sungai Tebelian)' })
  @ApiQuery({ name: 'status', enum: PostStatus, required: false, description: 'Filter status laporan' })
  @ApiQuery({ name: 'clusterCode', required: false, description: 'Filter kode area pantauan / cluster satelit' })
  @ApiQuery({ name: 'search', required: false, description: 'Pencarian kata kunci deskripsi/alamat/nama pelapor' })
  @ApiResponse({ status: 200, description: 'Daftar postingan feed komunitas' })
  getPosts(
    @Query('category') category?: PostCategory,
    @Query('province') province?: string,
    @Query('provinsi') provinsi?: string,
    @Query('kabupaten') kabupaten?: string,
    @Query('kecamatan') kecamatan?: string,
    @Query('clusterCode') clusterCode?: string,
    @Query('status') status?: PostStatus,
    @Query('search') search?: string,
  ) {
    const selectedProvince = province || provinsi;
    return this.communityService.getPosts({
      category,
      province: selectedProvince,
      kabupaten,
      kecamatan,
      clusterCode,
      status,
      search,
    });
  }

  @Get('posts/:id')
  @ApiOperation({
    summary: 'Melihat detail 1 postingan lengkap dengan Update Pengirim dan Balasan Komentar',
    description: 'Menampilkan foto kejadian, label kamera langsung, alamat GPS terdeteksi, timeline pembaruan pengirim, dan komentar warga.',
  })
  @ApiResponse({ status: 200, description: 'Detail lengkap postingan' })
  @ApiResponse({ status: 404, description: 'Postingan tidak ditemukan' })
  getPostDetail(@Param('id') id: string) {
    return this.communityService.getPostDetail(id);
  }

  @Post('posts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Membuat laporan titik api / postingan baru (Simulasi Kamera Live & GPS Otomatis)',
    description: 'Form pelaporan warga. Menyimpan kategori DARURAT/INFORMASI, foto bukti kamera langsung, dan koordinat GPS lokasi kejadian.',
  })
  @ApiResponse({ status: 201, description: 'Laporan berhasil dibuat dan disematkan' })
  @ApiResponse({ status: 401, description: 'Perlu login terlebih dahulu' })
  createPost(@CurrentUser('id') userId: string, @Body() dto: CreatePostDto) {
    return this.communityService.createPost(userId, dto);
  }

  @Post('posts/:id/updates')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Menambahkan perkembangan kabar terbaru dari lokasi (Fitur Update Pengirim)',
    description: 'Hanya pelapor asli atau admin yang dapat memposting update berkala di postingan darurat.',
  })
  @ApiResponse({ status: 201, description: 'Update perkembangan berhasil ditambahkan' })
  @ApiResponse({ status: 403, description: 'Hanya pembuat postingan asli yang dapat menambahkan update' })
  addUpdate(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: CreateUpdateDto,
  ) {
    return this.communityService.addUpdate(userId, id, dto);
  }

  @Post('posts/:id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Menambahkan komentar atau bukti foto peer-validation di bawah postingan',
    description: 'Warga dan relawan dapat saling berdiskusi, memberikan informasi kondisi angin, atau melampirkan foto verifikasi tambahan.',
  })
  @ApiResponse({ status: 201, description: 'Komentar berhasil dipublikasikan' })
  addComment(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.communityService.addComment(userId, id, dto);
  }

  @Post('posts/:id/flag')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Melaporkan postingan ke Admin (Diduga info palsu, foto tidak sesuai, spam)',
    description: 'Fitur moderasi komunitas dari popup Opsi Postingan',
  })
  @ApiResponse({ status: 201, description: 'Laporan moderasi berhasil dikirim ke Admin Posko' })
  flagPost(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: FlagPostDto,
  ) {
    return this.communityService.flagPost(userId, id, dto);
  }
  @Post("upload")
  @ApiOperation({
    summary: "Upload media foto / rekaman video lapangan ke storage server lokal",
    description: "Menyimpan file media (foto/video) ke storage lokal dan mengembalikan URL statis yang mendukung HTTP range-request.",
  })
  @ApiResponse({ status: 201, description: "File berhasil diunggah" })
  uploadMedia(@Body() body: { data?: string; filename?: string }) {
    return this.communityService.uploadMedia(body);
  }

  @Get('incidents')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Melihat daftar insiden/laporan warga terkelompok per titik lokasi (Khusus Admin Posko BPBD)',
  })
  getIncidents(
    @CurrentUser() user: any,
    @Query('kabupaten') kabupaten?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.communityService.getIncidents(user, { kabupaten, status, search });
  }

}
