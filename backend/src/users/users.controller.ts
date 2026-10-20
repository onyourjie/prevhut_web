import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Role } from '@prisma/client';

@ApiTags('2. Profil & Pengguna (Users)')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({
    summary: 'Melihat profil lengkap dan ringkasan aktivitas',
    description: 'Menampilkan nama, email, no HP, domisili, peran, toggle GPS selalu aktif, serta jumlah total postingan dan komentar pengguna.',
  })
  @ApiResponse({ status: 200, description: 'Data profil berhasil diambil' })
  @ApiResponse({ status: 401, description: 'Unauthorized: Perlu login terlebih dahulu' })
  getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Patch('profile')
  @ApiOperation({
    summary: 'Memperbarui profil (Nama, HP, Toggle GPS Selalu Aktif, Status Siap Tugas)',
    description: 'Menyimpan perubahan data profil atau pengaturan sistem dari layar Edit Profile.',
  })
  @ApiResponse({ status: 200, description: 'Profil berhasil diperbarui' })
  updateProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Get('activities')
  @ApiOperation({
    summary: 'Melihat riwayat "Aktivitas Saya" (Postingan Saya, Komentar Saya, Laporan Saya)',
    description: 'Mengelompokkan seluruh riwayat kontribusi pengguna.',
  })
  @ApiResponse({ status: 200, description: 'Riwayat aktivitas pengguna' })
  getUserActivities(@CurrentUser('id') userId: string) {
    return this.usersService.getUserActivities(userId);
  }

  @Get('volunteers')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Melihat daftar relawan yang tersedia (Khusus Admin Posko)',
    description: 'Menampilkan relawan terdaftar dengan status isAvailable=true beserta jumlah tugas aktif yang sedang ditangani.',
  })
  @ApiResponse({ status: 200, description: 'Daftar relawan siap ditugaskan' })
  @ApiResponse({ status: 403, description: 'Akses ditolak: Hanya Admin Posko yang dapat mengakses endpoint ini' })
  getAvailableVolunteers() {
    return this.usersService.getAvailableVolunteers();
  }
}
