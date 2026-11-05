import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { NotificationsService } from './notifications.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { NotificationType } from '@prisma/client';

export class RegisterFcmTokenDto {
  @ApiProperty({ description: 'FCM Registration Token dari browser / perangkat' })
  @IsString()
  @IsNotEmpty()
  fcmToken: string;

  @ApiProperty({ required: false, default: 'web', description: 'Platform perangkat (web, android, ios)' })
  @IsString()
  @IsOptional()
  deviceType?: string;
}

export class SendTestPushDto {
  @ApiProperty({ required: false, default: 'Tes Notifikasi Firezone' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false, default: 'Ini adalah notifikasi uji coba Firebase Cloud Messaging.' })
  @IsString()
  @IsOptional()
  message?: string;
}

@ApiTags('6. Pusat Notifikasi (Notifications)')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({
    summary: 'Melihat riwayat notifikasi pengguna (Dikelompokkan Hari Ini & Sebelumnya)',
    description:
      'Menampilkan notifikasi bahaya titik api P1 (untuk warga) atau notifikasi penugasan baru (untuk relawan).',
  })
  @ApiResponse({ status: 200, description: 'Daftar notifikasi pengguna' })
  getMyNotifications(@CurrentUser('id') userId: string) {
    return this.notificationsService.getMyNotifications(userId);
  }

  @Post('fcm-token')
  @ApiOperation({ summary: 'Mendaftarkan FCM Token dari perangkat/browser pengguna' })
  @ApiResponse({ status: 201, description: 'Token FCM berhasil disimpan' })
  async registerFcmToken(
    @CurrentUser('id') userId: string,
    @Body() dto: RegisterFcmTokenDto,
    @Headers('user-agent') userAgent?: string,
  ) {
    const result = await this.notificationsService.registerFcmToken(
      userId,
      dto.fcmToken,
      dto.deviceType || 'web',
      userAgent,
    );
    return {
      success: true,
      message: 'Token FCM berhasil didaftarkan',
      data: result,
    };
  }

  @Delete('fcm-token')
  @ApiOperation({ summary: 'Menghapus FCM Token saat logout' })
  @ApiResponse({ status: 200, description: 'Token FCM dihapus dari akun' })
  async unregisterFcmToken(@CurrentUser('id') userId: string, @Body() dto: RegisterFcmTokenDto) {
    await this.notificationsService.unregisterFcmToken(userId, dto.fcmToken);
    return {
      success: true,
      message: 'Token FCM berhasil dihapus',
    };
  }

  @Post('test-push')
  @ApiOperation({ summary: 'Mengirim notifikasi tes ke akun sendiri untuk verifikasi' })
  @ApiResponse({ status: 201, description: 'Notifikasi tes berhasil dikirim' })
  testPushNotification(@CurrentUser('id') userId: string, @Body() dto: SendTestPushDto) {
    return this.notificationsService.createAndSendNotification({
      userId,
      title: dto.title || 'Tes Notifikasi Firezone',
      message: dto.message || 'Ini adalah notifikasi uji coba Firebase Cloud Messaging.',
      type: NotificationType.SISTEM,
      url: '/emergency',
    });
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Menandai 1 notifikasi telah dibaca' })
  @ApiResponse({ status: 200, description: 'Notifikasi ditandai dibaca' })
  markAsRead(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.notificationsService.markAsRead(userId, id);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Menandai seluruh notifikasi telah dibaca' })
  @ApiResponse({ status: 200, description: 'Seluruh notifikasi ditandai dibaca' })
  markAllAsRead(@CurrentUser('id') userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }
}
