import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class HotspotsService {
  private readonly logger = new Logger(HotspotsService.name);
  private readonly dataServiceUrl: string;

  constructor(private configService: ConfigService) {
    this.dataServiceUrl = this.configService.get<string>("DATA_SERVICE_URL", "http://localhost:8000");
  }

  async getClusters(query: {
    priority?: string;
    province?: string;
    kabupaten?: string;
    kecamatan?: string;
    min_score?: number;
    date?: string;
  }) {
    const params = new URLSearchParams();
    if (query.priority) params.append("priority", query.priority);
    if (query.province) params.append("province", query.province);
    if (query.kabupaten) params.append("kabupaten", query.kabupaten);
    if (query.kecamatan) params.append("kecamatan", query.kecamatan);
    if (query.min_score !== undefined) params.append("min_score", String(query.min_score));
    if (query.date) params.append("date", query.date);

    const url = `${this.dataServiceUrl}/api/clusters?${params.toString()}`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Data service HTTP ${res.status}`);
      return await res.json();
    } catch (err: any) {
      this.logger.error(`Gagal memanggil data service clusters: ${err.message}`);
      return [];
    }
  }

  async getClusterDetail(id: string) {
    const url = `${this.dataServiceUrl}/api/clusters/${id}`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Data service HTTP ${res.status}`);
      return await res.json();
    } catch (err: any) {
      this.logger.error(`Gagal memanggil data service cluster detail: ${err.message}`);
      return null;
    }
  }

  async getStatistics() {
    const url = `${this.dataServiceUrl}/api/clusters/statistics`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Data service HTTP ${res.status}`);
      return await res.json();
    } catch (err: any) {
      this.logger.error(`Gagal memanggil data service statistics: ${err.message}`);
      return null;
    }
  }

  async getLiveHotspots(query?: { limit?: number; confidence?: string }) {
    const params = new URLSearchParams();
    if (query?.limit) params.append("limit", String(query.limit));
    if (query?.confidence) params.append("confidence", query.confidence);

    const url = `${this.dataServiceUrl}/api/hotspots/live?${params.toString()}`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Data service HTTP ${res.status}`);
      return await res.json();
    } catch (err: any) {
      this.logger.error(`Gagal memanggil live hotspots: ${err.message}`);
      return [];
    }
  }

  async getWeatherIspu(city?: string) {
    const url = city
      ? `${this.dataServiceUrl}/api/weather-ispu/${city}`
      : `${this.dataServiceUrl}/api/weather-ispu`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Data service HTTP ${res.status}`);
      return await res.json();
    } catch (err: any) {
      this.logger.error(`Gagal memanggil weather ispu: ${err.message}`);
      return null;
    }
  }
}
