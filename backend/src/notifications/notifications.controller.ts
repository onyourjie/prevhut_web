import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@ApiTags('6. Pusat Notifikasi (Notifications)')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({
    summary: 'Melihat riwayat notifikasi pengguna (Dikelompokkan Hari Ini & Sebelumnya)',
    description: 'Menampilkan notifikasi bahaya titik api P1 (untuk warga) atau notifikasi penugasan baru (untuk relawan).',
  })
  @ApiResponse({ status: 200, description: 'Daftar notifikasi pengguna' })
  getMyNotifications(@CurrentUser('id') userId: string) {
    return this.notificationsService.getMyNotifications(userId);
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
