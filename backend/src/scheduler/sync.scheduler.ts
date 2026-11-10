import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { PostCategory, PostStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { normalizeDataServiceUrl } from '../common/url.util.js';

function haversineDistKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371.0;
  const dLat = ((lat2 - lat1) * Math.PI) / 180.0;
  const dLon = ((lon2 - lon1) * Math.PI) / 180.0;
  const a =
    Math.sin(dLat / 2.0) ** 2 +
    Math.cos((lat1 * Math.PI) / 180.0) *
      Math.cos((lat2 * Math.PI) / 180.0) *
      Math.sin(dLon / 2.0) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

@Injectable()
export class SyncScheduler {
  private readonly logger = new Logger(SyncScheduler.name);
  private lastSyncResult: any = null;
  private lastSyncTime: Date | null = null;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  /**
   * Cron Job otomatis setiap 3 jam (01.00, 04.00, 07.00, 10.00, 13.00, 16.00, 19.00, 22.00 WIB)
   * Selaras dengan siklus orbit satelit NASA FIRMS (VIIRS SNPP & NOAA-20/21)
   */
  @Cron('0 1,4,7,10,13,16,19,22 * * *', { timeZone: 'Asia/Jakarta' })
  async handleScheduledSync() {
    this.logger.log('Menjalankan sinkronisasi terjadwal data NASA FIRMS & re-clustering...');
    await this.triggerSync('Automated Cron Job (Setiap 3 Jam)');
  }

  private async reconcilePostsAfterSync(dataServiceUrl: string) {
    try {
      const res = await fetch(`${dataServiceUrl}/api/clusters`);
      if (!res.ok) return { updatedClusterCodes: 0, autoResolvedPosts: 0 };
      const liveClusters = await res.json();
      if (!Array.isArray(liveClusters)) return { updatedClusterCodes: 0, autoResolvedPosts: 0 };

      const activePosts = await this.prisma.post.findMany({
        where: {
          category: PostCategory.DARURAT,
          status: { in: [PostStatus.MENUNGGU_VERIFIKASI, PostStatus.DALAM_PENANGANAN] },
        },
        include: {
          assignments: {
            where: {
              status: { in: ['ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'ON_SITE'] },
            },
          },
        },
      });

      let updatedClusterCodes = 0;
      let autoResolvedPosts = 0;

      for (const post of activePosts) {
        let bestCluster: any = null;
        let bestDist = Infinity;
        for (const c of liveClusters) {
          const cLat = c?.centroid?.latitude;
          const cLon = c?.centroid?.longitude;
          if (typeof cLat === 'number' && typeof cLon === 'number') {
            const d = haversineDistKm(post.latitude, post.longitude, cLat, cLon);
            if (d <= 25.0 && d < bestDist) {
              bestDist = d;
              bestCluster = c;
            }
          }
        }

        if (bestCluster && bestCluster.code) {
          // Klaster satelit masih aktif di koordinat ini -> sinkronkan kode peringkatnya (misal Area Pantau 01 -> Area Pantau 03)
          if (post.clusterCode !== bestCluster.code) {
            await this.prisma.post.update({
              where: { id: post.id },
              data: { clusterCode: String(bestCluster.code) },
            });
            updatedClusterCodes += 1;
          }
        } else {
          // Tidak ada lagi titik panas satelit dalam radius <= 25 km dari titik laporan warga
          const hasActiveAssignment = post.assignments && post.assignments.length > 0;
          if (post.status === PostStatus.MENUNGGU_VERIFIKASI && !hasActiveAssignment) {
            await this.prisma.post.update({
              where: { id: post.id },
              data: { status: PostStatus.SELESAI },
            });
            await this.prisma.postUpdate.create({
              data: {
                postId: post.id,
                authorId: post.authorId,
                content:
                  'Status laporan diperbarui otomatis menjadi Padam karena pada pembaruan data satelit NASA FIRMS terbaru sudah tidak terdeteksi lagi titik panas aktif di sekitar lokasi laporan ini.',
              },
            });
            autoResolvedPosts += 1;
          }
        }
      }

      if (updatedClusterCodes > 0 || autoResolvedPosts > 0) {
        this.logger.log(
          `Rekonsiliasi pasca-sync selesai: ${updatedClusterCodes} kode klaster diperbarui, ${autoResolvedPosts} laporan tanpa titik api satelit otomatis ditandai Padam.`
        );
      }

      return { updatedClusterCodes, autoResolvedPosts };
    } catch (err: any) {
      this.logger.warn(`Gagal menjalankan rekonsiliasi postingan pasca-sync: ${err.message}`);
      return { updatedClusterCodes: 0, autoResolvedPosts: 0 };
    }
  }

  async triggerSync(triggerSource: string = 'Manual Admin') {
    const rawUrl = this.configService.get<string>('DATA_SERVICE_URL', 'http://localhost:8000');
    const dataServiceUrl = normalizeDataServiceUrl(rawUrl);
    const syncEndpoint = `${dataServiceUrl}/api/sync`;

    try {
      this.logger.log(`Menghubungi Data Microservice di: ${syncEndpoint}`);
      const response = await fetch(syncEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Data service mengembalikan status HTTP ${response.status}`);
      }

      const data = await response.json();
      const reconciliation = await this.reconcilePostsAfterSync(dataServiceUrl);

      this.lastSyncTime = new Date();
      this.lastSyncResult = {
        ...data,
        reconciliation,
        triggered_by: triggerSource,
        last_sync_wib: this.lastSyncTime.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) + ' WIB',
      };

      this.logger.log(`Sinkronisasi berhasil! ${data.hotspots_synced} titik panas disinkronkan, ${data.clusters_generated} klaster DBSCAN diperbarui.`);
      return this.lastSyncResult;
    } catch (error: any) {
      this.logger.error(`Gagal menyinkronkan data eksternal: ${error.message}`);
      return {
        status: 'error',
        message: `Gagal menyinkronkan: ${error.message}`,
        triggered_by: triggerSource,
        last_sync: this.lastSyncTime,
      };
    }
  }

  getSyncStatus() {
    return {
      auto_sync_interval: 'Setiap 3 Jam (01.00, 04.00, 07.00, 10.00, 13.00, 16.00, 19.00, 22.00 WIB)',
      reasoning: 'Sesuai latensi downlink satelit VIIRS NASA (~3 jam) dan label pembaharuan',
      last_sync_time: this.lastSyncTime,
      last_result: this.lastSyncResult,
    };
  }
}
