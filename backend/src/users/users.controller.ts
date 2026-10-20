import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Role } from '@prisma/client';

@ApiTags('Users & Profile (Profil Saya & Aktivitas)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Melihat profil lengkap dan ringkasan aktivitas (Layar Profil Figma)' })
  getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Memperbarui profil (Nama, HP, Toggle GPS Selalu Aktif)' })
  updateProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Get('activities')
  @ApiOperation({ summary: 'Melihat riwayat "Aktivitas Saya" (Postingan Saya, Komentar Saya, Laporan Saya)' })
  getUserActivities(@CurrentUser('id') userId: string) {
    return this.usersService.getUserActivities(userId);
  }

  @Get('volunteers')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Melihat daftar relawan yang tersedia (Khusus Admin Posko untuk Penugasan)' })
  getAvailableVolunteers() {
    return this.usersService.getAvailableVolunteers();
  }
}
