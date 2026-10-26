import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AssignmentsService } from './assignments.service.js';
import { CreateAssignmentDto } from './dto/create-assignment.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';
import { RejectTaskDto } from './dto/reject-task.dto.js';
import { VerifyTaskDto } from './dto/verify-task.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Role } from '@prisma/client';

@ApiTags('4. Penugasan Relawan Lapangan (Assignments)')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('assignments')
export class AssignmentsController {
  constructor(private assignmentsService: AssignmentsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Tugaskan Relawan ke Titik Api / Laporan Warga (Khusus Admin Posko)',
    description: 'Admin Command Center memilih relawan tersedia dan menetapkan prioritas (P1/P2) beserta instruksi lapangan.',
  })
  @ApiResponse({ status: 201, description: 'Penugasan berhasil dibuat dan notifikasi dikirim ke HP relawan' })
  @ApiResponse({ status: 403, description: 'Hanya Admin Posko yang berhak melakukan penugasan' })
  createAssignment(@CurrentUser('id') adminId: string, @Body() dto: CreateAssignmentDto) {
    return this.assignmentsService.createAssignment(adminId, dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Monitoring Seluruh Penugasan & Status Lapangan (Khusus Admin Posko)',
    description: 'Dashboard Admin untuk memantau relawan mana saja yang sedang menuju lokasi, berada di lokasi, atau telah selesai.',
  })
  @ApiResponse({ status: 200, description: 'Daftar seluruh penugasan relawan' })
  getAllAssignments() {
    return this.assignmentsService.getAllAssignments();
  }

  @Get('my-tasks')
  @Roles(Role.RELAWAN, Role.ADMIN)
  @ApiOperation({
    summary: 'Daftar Penugasan Masuk Saya (Khusus Relawan / Admin)',
    description: 'Menampilkan tugas-tugas lapangan relawan, atau seluruh penugasan jika akun Admin Posko.',
  })
  @ApiResponse({ status: 200, description: 'Daftar tugas relawan aktif' })
  getMyTasks(@CurrentUser() user: any) {
    if (user.role === Role.ADMIN) {
      return this.assignmentsService.getAllAssignments();
    }
    return this.assignmentsService.getMyTasks(user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Melihat rincian 1 data penugasan lapangan',
    description: 'Menampilkan detail lokasi, instruksi posko, pelapor asli, dan koordinat sasaran.',
  })
  @ApiResponse({ status: 200, description: 'Detail penugasan relawan' })
  @ApiResponse({ status: 404, description: 'Penugasan tidak ditemukan' })
  getAssignmentDetail(@Param('id') id: string) {
    return this.assignmentsService.getAssignmentDetail(id);
  }

  @Patch(':id/status')
  @Roles(Role.RELAWAN, Role.ADMIN)
  @ApiOperation({
    summary: 'Update Status Penanganan Lapangan (ACCEPTED -> ON_THE_WAY -> ON_SITE -> COMPLETED)',
    description: 'Relawan memperbarui status tahapan respon pemadaman saat menuju lokasi atau telah tiba.',
  })
  @ApiResponse({ status: 200, description: 'Status penugasan berhasil diperbarui' })
  updateStatus(
    @CurrentUser('id') volunteerId: string,
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.assignmentsService.updateStatus(volunteerId, id, dto);
  }

  @Post(':id/reject')
  @Roles(Role.RELAWAN)
  @ApiOperation({
    summary: 'Relawan Menolak Penugasan Disertai Alasan Jelas',
    description: 'Jika relawan berhalangan atau kekurangan alat pemadam, penolakan dicatat dan Admin Posko menerima notifikasi eskalasi.',
  })
  @ApiResponse({ status: 200, description: 'Penugasan ditolak dan alasan tercatat' })
  rejectTask(
    @CurrentUser('id') volunteerId: string,
    @Param('id') id: string,
    @Body() dto: RejectTaskDto,
  ) {
    return this.assignmentsService.rejectTask(volunteerId, id, dto);
  }

  @Post(':id/verify')
  @Roles(Role.RELAWAN)
  @ApiOperation({
    summary: 'Upload Foto Bukti Verifikasi Lapangan & Koordinat GPS Pemadaman',
    description: 'Relawan mengunggah bukti foto kondisi setelah pemadaman beserta koordinat GPS akurat. Menyelesaikan penugasan dan insiden.',
  })
  @ApiResponse({ status: 200, description: 'Bukti verifikasi lapangan diterima dan penugasan selesai' })
  verifyTask(
    @CurrentUser('id') volunteerId: string,
    @Param('id') id: string,
    @Body() dto: VerifyTaskDto,
  ) {
    return this.assignmentsService.verifyTask(volunteerId, id, dto);
  }
}
