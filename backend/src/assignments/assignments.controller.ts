import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
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

@ApiTags('Volunteer Dispatch & Field Operations (Penugasan Relawan Lapangan)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('assignments')
export class AssignmentsController {
  constructor(private assignmentsService: AssignmentsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin Posko menugaskan Relawan ke titik api atau laporan darurat warga' })
  createAssignment(@CurrentUser('id') adminId: string, @Body() dto: CreateAssignmentDto) {
    return this.assignmentsService.createAssignment(adminId, dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin Posko memantau seluruh riwayat penugasan dan status penanganan lapangan' })
  getAllAssignments() {
    return this.assignmentsService.getAllAssignments();
  }

  @Get('my-tasks')
  @Roles(Role.RELAWAN)
  @ApiOperation({ summary: 'Relawan melihat daftar penugasan lapangan yang ditugaskan kepada dirinya' })
  getMyTasks(@CurrentUser('id') volunteerId: string) {
    return this.assignmentsService.getMyTasks(volunteerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Melihat detail lengkap satu penugasan' })
  getAssignmentDetail(@Param('id') id: string) {
    return this.assignmentsService.getAssignmentDetail(id);
  }

  @Patch(':id/status')
  @Roles(Role.RELAWAN, Role.ADMIN)
  @ApiOperation({ summary: 'Memperbarui status penanganan (ACCEPTED -> ON_THE_WAY -> ON_SITE -> COMPLETED)' })
  updateStatus(
    @CurrentUser('id') volunteerId: string,
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.assignmentsService.updateStatus(volunteerId, id, dto);
  }

  @Post(':id/reject')
  @Roles(Role.RELAWAN)
  @ApiOperation({ summary: 'Relawan menolak penugasan disertai alasan yang jelas' })
  rejectTask(
    @CurrentUser('id') volunteerId: string,
    @Param('id') id: string,
    @Body() dto: RejectTaskDto,
  ) {
    return this.assignmentsService.rejectTask(volunteerId, id, dto);
  }

  @Post(':id/verify')
  @Roles(Role.RELAWAN)
  @ApiOperation({ summary: 'Relawan mengunggah foto bukti verifikasi lapangan dan koordinat GPS hasil pemadaman' })
  verifyTask(
    @CurrentUser('id') volunteerId: string,
    @Param('id') id: string,
    @Body() dto: VerifyTaskDto,
  ) {
    return this.assignmentsService.verifyTask(volunteerId, id, dto);
  }
}
