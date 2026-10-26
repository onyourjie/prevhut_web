import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAssignmentDto } from './dto/create-assignment.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';
import { RejectTaskDto } from './dto/reject-task.dto.js';
import { VerifyTaskDto } from './dto/verify-task.dto.js';
import { AssignmentStatus, PostStatus, NotificationType, Role, PostCategory } from '@prisma/client';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  async createAssignment(adminId: string, dto: CreateAssignmentDto) {
    const volunteer = await this.prisma.user.findUnique({
      where: { id: dto.volunteerId },
    });
    if (!volunteer || volunteer.role !== Role.RELAWAN) {
      throw new BadRequestException('Pengguna yang ditugaskan harus berstatus Relawan.');
    }

    const assignment = await this.prisma.volunteerAssignment.create({
      data: {
        adminId,
        volunteerId: dto.volunteerId,
        postId: dto.postId,
        clusterCode: dto.clusterCode,
        priorityLevel: dto.priorityLevel,
        status: AssignmentStatus.ASSIGNED,
        notes: dto.notes,
      },
      include: {
        volunteer: { select: { id: true, name: true, phone: true } },
        post: { select: { id: true, content: true, address: true, category: true } },
      },
    });

    // Update post status to DALAM_PENANGANAN if linked to citizen report
    if (dto.postId) {
      await this.prisma.post.update({
        where: { id: dto.postId },
        data: { status: PostStatus.DALAM_PENANGANAN },
      });
    }

    // Sinkronisasi: otomatis ubah semua laporan warga di cluster/area yang sama menjadi DALAM_PENANGANAN
    if (dto.clusterCode) {
      await this.prisma.post.updateMany({
        where: {
          category: PostCategory.DARURAT,
          clusterCode: dto.clusterCode,
          status: PostStatus.MENUNGGU_VERIFIKASI,
        },
        data: { status: PostStatus.DALAM_PENANGANAN },
      });
    }

    // Send notification to volunteer
    await this.prisma.notification.create({
      data: {
        userId: dto.volunteerId,
        title: `Penugasan Lapangan Baru (${dto.priorityLevel})`,
        message: `Admin Posko menugaskan kamu ke ${dto.clusterCode ?? 'lokasi laporan warga'}. Ketuk untuk lihat rute & detail tugas.`,
        type: NotificationType.TUGAS_BARU,
        metadata: { assignmentId: assignment.id },
      },
    });

    return {
      message: 'Penugasan relawan berhasil dikirim',
      assignment,
    };
  }

  async getAllAssignments() {
    return this.prisma.volunteerAssignment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        volunteer: {
          select: { id: true, name: true, phone: true, avatarUrl: true },
        },
        admin: {
          select: { id: true, name: true },
        },
        post: {
          select: { id: true, content: true, address: true, imageUrl: true, latitude: true, longitude: true },
        },
      },
    });
  }

  async getMyTasks(volunteerId: string) {
    return this.prisma.volunteerAssignment.findMany({
      where: { volunteerId },
      orderBy: { createdAt: 'desc' },
      include: {
        post: {
          select: { id: true, content: true, address: true, imageUrl: true, latitude: true, longitude: true },
        },
        admin: {
          select: { id: true, name: true, phone: true },
        },
      },
    });
  }

  async getAssignmentDetail(id: string) {
    const task = await this.prisma.volunteerAssignment.findUnique({
      where: { id },
      include: {
        volunteer: { select: { id: true, name: true, phone: true, avatarUrl: true } },
        admin: { select: { id: true, name: true, phone: true } },
        post: {
          include: {
            author: { select: { id: true, name: true, phone: true, avatarUrl: true } },
            updates: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Data penugasan tidak ditemukan');
    }

    return task;
  }

  async updateStatus(volunteerId: string, assignmentId: string, dto: UpdateStatusDto) {
    const task = await this.prisma.volunteerAssignment.findUnique({ where: { id: assignmentId } });
    if (!task) {
      throw new NotFoundException('Data penugasan tidak ditemukan');
    }
    if (task.volunteerId !== volunteerId) {
      throw new ForbiddenException('Anda hanya dapat mengubah status tugas yang ditugaskan kepada Anda');
    }

    const updated = await this.prisma.volunteerAssignment.update({
      where: { id: assignmentId },
      data: {
        status: dto.status,
        completedAt: dto.status === AssignmentStatus.COMPLETED ? new Date() : undefined,
      },
      include: {
        post: true,
      },
    });

    // If completed, update post status as well
    if (dto.status === AssignmentStatus.COMPLETED) {
      if (updated.postId) {
        await this.prisma.post.update({
          where: { id: updated.postId },
          data: { status: PostStatus.SELESAI },
        });
      }
      if (updated.clusterCode) {
        await this.resolveClusterPosts(updated.clusterCode, updated.id);
      }
    }

    return {
      message: `Status penugasan berhasil diubah menjadi ${dto.status}`,
      assignment: updated,
    };
  }

  async rejectTask(volunteerId: string, assignmentId: string, dto: RejectTaskDto) {
    const task = await this.prisma.volunteerAssignment.findUnique({ where: { id: assignmentId } });
    if (!task) {
      throw new NotFoundException('Data penugasan tidak ditemukan');
    }
    if (task.volunteerId !== volunteerId) {
      throw new ForbiddenException('Akses ditolak');
    }

    const updated = await this.prisma.volunteerAssignment.update({
      where: { id: assignmentId },
      data: {
        status: AssignmentStatus.REJECTED,
        rejectionReason: dto.rejectionReason,
      },
    });

    // Notify Admin Posko about rejection
    await this.prisma.notification.create({
      data: {
        userId: task.adminId,
        title: 'Penugasan Ditolak oleh Relawan',
        message: `Relawan menolak tugas di ${task.clusterCode ?? 'lokasi laporan'} dengan alasan: "${dto.rejectionReason}". Silakan tugaskan relawan lain.`,
        type: NotificationType.UPDATE_STATUS,
        metadata: { assignmentId },
      },
    });

    return {
      message: 'Penugasan telah ditolak. Alasan berhasil dicatat untuk Posko Komando.',
      assignment: updated,
    };
  }

  async verifyTask(volunteerId: string, assignmentId: string, dto: VerifyTaskDto) {
    const task = await this.prisma.volunteerAssignment.findUnique({ where: { id: assignmentId } });
    if (!task) {
      throw new NotFoundException('Data penugasan tidak ditemukan');
    }
    if (task.volunteerId !== volunteerId) {
      throw new ForbiddenException('Akses ditolak');
    }

    const updated = await this.prisma.volunteerAssignment.update({
      where: { id: assignmentId },
      data: {
        status: AssignmentStatus.COMPLETED,
        verificationPhoto: dto.verificationPhoto,
        verificationGpsLat: dto.verificationGpsLat,
        verificationGpsLon: dto.verificationGpsLon,
        notes: dto.completionNotes ? `${task.notes ?? ''}\n[Catatan Lapangan]: ${dto.completionNotes}` : task.notes,
        completedAt: new Date(),
      },
    });

    if (task.postId) {
      await this.prisma.post.update({
        where: { id: task.postId },
        data: { status: PostStatus.SELESAI },
      });
    }

    // Sinkronisasi: ubah laporan warga di cluster yang sama menjadi SELESAI jika tidak ada penugasan lain yang aktif
    if (task.clusterCode) {
      await this.resolveClusterPosts(task.clusterCode, task.id);
    }

    return {
      message: 'Bukti verifikasi lapangan berhasil diunggah. Penugasan selesai!',
      assignment: updated,
    };
  }

  private async resolveClusterPosts(clusterCode: string, currentAssignmentId: string) {
    const stillActive = await this.prisma.volunteerAssignment.count({
      where: {
        clusterCode,
        id: { not: currentAssignmentId },
        status: {
          in: [
            AssignmentStatus.ASSIGNED,
            AssignmentStatus.ACCEPTED,
            AssignmentStatus.ON_THE_WAY,
            AssignmentStatus.ON_SITE,
          ],
        },
      },
    });

    if (stillActive === 0) {
      await this.prisma.post.updateMany({
        where: {
          category: PostCategory.DARURAT,
          clusterCode,
          status: PostStatus.DALAM_PENANGANAN,
        },
        data: { status: PostStatus.SELESAI },
      });
    }
  }
}
