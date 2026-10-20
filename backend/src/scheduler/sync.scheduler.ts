import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SyncScheduler {
  private readonly logger = new Logger(SyncScheduler.name);
  private lastSyncResult: any = null;
  private lastSyncTime: Date | null = null;

  constructor(private configService: ConfigService) {}

  /**
   * Cron Job otomatis setiap 3 jam (01.00, 04.00, 07.00, 10.00, 13.00, 16.00, 19.00, 22.00 WIB)
   * Selaras dengan siklus orbit satelit NASA FIRMS (VIIRS SNPP & NOAA-20/21)
   */
  @Cron('0 1,4,7,10,13,16,19,22 * * *')
  async handleScheduledSync() {
    this.logger.log('Menjalankan sinkronisasi terjadwal data NASA FIRMS & re-clustering...');
    await this.triggerSync('Automated Cron Job (Setiap 3 Jam)');
  }

  async triggerSync(triggerSource: string = 'Manual Admin') {
    const dataServiceUrl = this.configService.get<string>('DATA_SERVICE_URL', 'http://localhost:8000');
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
      this.lastSyncTime = new Date();
      this.lastSyncResult = {
        ...data,
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
