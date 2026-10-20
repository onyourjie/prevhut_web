import { Controller, Post, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { SyncScheduler } from './sync.scheduler.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '@prisma/client';

@ApiTags('7. Otomasi Satelit & Sinkronisasi (Sync)')
@Controller('sync')
export class SyncController {
  constructor(private syncScheduler: SyncScheduler) {}

  @Get('status')
  @ApiOperation({
    summary: 'Melihat status sinkronisasi terakhir & jadwal auto-update 3 jam',
    description: 'Menampilkan riwayat timestamp sinkronisasi terakhir, jumlah hotspot yang ditarik, dan alasan interval 3 jam.',
  })
  @ApiResponse({ status: 200, description: 'Status sinkronisasi satelit NASA FIRMS' })
  getStatus() {
    return this.syncScheduler.getSyncStatus();
  }

  @Post('trigger')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Memicu Sinkronisasi Manual ke Satelit NASA FIRMS (Khusus Admin Posko)',
    description: 'Tombol darurat pada dashboard posko untuk memaksa penarikan live data satelit detik ini juga tanpa menunggu jadwal 3 jam.',
  })
  @ApiResponse({ status: 200, description: 'Sinkronisasi live dan re-clustering spasial DBSCAN berhasil' })
  @ApiResponse({ status: 403, description: 'Hanya Admin Posko yang berhak memicu sinkronisasi' })
  triggerManualSync() {
    return this.syncScheduler.triggerSync('Manual Trigger oleh Admin Posko');
  }
}
