import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service.js";
import { PostStatus } from "@prisma/client";

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

/**
 * Formula Fairness Crowd Urgency Multiplier (Diminishing Returns)
 * Sesuai model resmi pada notebooks/prevhut_data_modeling.ipynb & clustering.py:
 * - 0 laporan: +0.0 poin
 * - 1 laporan: +5.0 poin (Ground-truth verification / Dual Confirmed)
 * - 2-3 laporan: +10.0 poin (Konsensus warga sekitar)
 * - >=4 laporan: maks +15.0 poin (Eskalasi darurat publik)
 */
function calculateCitizenBoost(reportCount: number): number {
  if (reportCount === 0) return 0.0;
  if (reportCount === 1) return 5.0;
  if (reportCount <= 3) return 10.0;
  return Math.min(15.0, 10.0 + (reportCount - 3) * 1.0);
}

@Injectable()
export class HotspotsService {
  private readonly logger = new Logger(HotspotsService.name);
  private readonly dataServiceUrl: string;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.dataServiceUrl = this.configService.get<string>("DATA_SERVICE_URL", "http://localhost:8000");
  }

  /**
   * Menghubungkan data laporan warga dari PostgreSQL secara live ke model scoring satelit NASA FIRMS.
   * Mengkalkulasi ulang final risk score, status prioritas, dan faktor penjelasan transparan.
   */
  private async enrichClustersWithLiveReports(clusters: any[]) {
    if (!Array.isArray(clusters) || clusters.length === 0) return clusters;

    // Ambil seluruh laporan aktif warga (Menunggu Verifikasi & Sedang Ditangani)
    let activePosts: Array<{
      id: string;
      clusterCode: string | null;
      kabupaten: string;
      latitude: number;
      longitude: number;
      status: PostStatus;
    }> = [];

    try {
      activePosts = await this.prisma.post.findMany({
        where: {
          status: { in: [PostStatus.MENUNGGU_VERIFIKASI, PostStatus.DALAM_PENANGANAN] },
        },
        select: {
          id: true,
          clusterCode: true,
          kabupaten: true,
          latitude: true,
          longitude: true,
          status: true,
        },
      });
    } catch (err: any) {
      this.logger.warn(`Gagal mengambil laporan aktif dari PostgreSQL: ${err.message}`);
    }

    return clusters.map((c) => {
      // 1. Cocokkan laporan warga dengan klaster ini secara geospasial & batas administratif
      const matched = activePosts.filter((p) => {
        const hasPostCoords = typeof p.latitude === "number" && typeof p.longitude === "number";
        const hasClusterCoords =
          typeof c.centroid?.latitude === "number" && typeof c.centroid?.longitude === "number";

        // JIKA ADA KOORDINAT GPS: Validasi jarak fisik mutlak (Haversine)
        if (hasPostCoords && hasClusterCoords) {
          const d = haversineDistKm(c.centroid.latitude, c.centroid.longitude, p.latitude, p.longitude);
          // Jika jarak > 25 km, TOLAK secara mutlak (mencegah laporan beda kabupaten/provinsi bocor ratusan km)
          if (d > 25.0) {
            return false;
          }
          // Jika dalam radius <= 25 km, valid
          return true;
        }

        // Bounding box klaster (jika ada koordinat)
        if (
          hasPostCoords &&
          c.bounding_box &&
          p.latitude >= c.bounding_box.min_lat - 0.05 &&
          p.latitude <= c.bounding_box.max_lat + 0.05 &&
          p.longitude >= c.bounding_box.min_lon - 0.05 &&
          p.longitude <= c.bounding_box.max_lon + 0.05
        ) {
          return true;
        }

        // JIKA TIDAK ADA KOORDINAT GPS: Hanya cocokkan jika clusterCode sama DAN kabupaten sesuai
        if (p.clusterCode) {
          const normP = p.clusterCode.trim().toLowerCase();
          const normCode = (c.code || "").trim().toLowerCase();
          const normId = (c.id || "").trim().toLowerCase();
          const isCodeMatch = normP === normCode || normP === normId;

          if (isCodeMatch) {
            // Validasi kabupaten jika tersedia
            if (p.kabupaten && (c.kabupaten || Array.isArray(c.kabupaten_list))) {
              const cleanPostKab = p.kabupaten.toLowerCase().replace(/^(kabupaten|kota)\s+/, "").trim();
              const clusterKabs = [
                ...(c.kabupaten ? [c.kabupaten] : []),
                ...(Array.isArray(c.kabupaten_list) ? c.kabupaten_list : []),
              ].map((k: string) => k.toLowerCase().replace(/^(kabupaten|kota)\s+/, "").trim());

              const isKabMatch = clusterKabs.some((k: string) => cleanPostKab.includes(k) || k.includes(cleanPostKab));
              if (!isKabMatch) {
                // Berbeda kabupaten -> tolak untuk mencegah mismatch
                return false;
              }
            }
            return true;
          }
        }

        return false;
      });

      const reportCount = matched.length;
      const citizenBoost = calculateCitizenBoost(reportCount);

      // Base score murni dari satelit (Activity 40% + Persistence 35% + Intensity 25%)
      const baseScore =
        typeof c.base_risk_score === "number"
          ? c.base_risk_score
          : typeof c.risk_score === "number"
          ? c.risk_score
          : 50.0;

      // Bonus kedekatan permukiman (Proximity Urgency)
      let proximityUrgency = 0.0;
      if (typeof c.distance_to_settlement_km === "number") {
        if (c.distance_to_settlement_km < 3.0) proximityUrgency = 8.0;
        else if (c.distance_to_settlement_km <= 7.0) proximityUrgency = 4.0;
      }

      // Final Risk Score sesuai formula resmi data modeling
      const finalScore = Math.min(
        100.0,
        Number((baseScore + proximityUrgency + citizenBoost).toFixed(1))
      );

      // Reklasifikasi tingkat prioritas dinamis
      let priorityLevel = c.priority_level;
      let badge = c.badge;
      if (finalScore >= 80.0) {
        priorityLevel = "P1 - Prioritas Tinggi";
        badge = "Prioritas Tinggi";
      } else if (finalScore >= 65.0) {
        priorityLevel = "P2 - Perhatian Meningkat";
        badge = "Perhatian Meningkat";
      } else {
        priorityLevel = "P3 - Waspada Ringan";
        badge = "Waspada Ringan";
      }

      // Update status validasi komunitas dan faktor pendorong utama
      let citizenValidationStatus = c.citizen_validation_status;
      let primaryFactor = c.primary_factor;

      if (reportCount >= 2) {
        citizenValidationStatus = `🔴 Dikonfirmasi ${reportCount} Laporan Darurat Warga`;
        primaryFactor = `Divalidasi langsung oleh ${reportCount} laporan warga sekitar (+${citizenBoost} Poin)`;
      } else if (reportCount === 1) {
        citizenValidationStatus = "🟡 Dikonfirmasi 1 Laporan Warga Lapangan";
        primaryFactor = `Dikonfirmasi oleh 1 laporan warga terdekat (+${citizenBoost} Poin)`;
      } else {
        citizenValidationStatus = "🛡️ Belum Ada Laporan Lapangan";
      }

      return {
        ...c,
        base_risk_score: baseScore,
        citizen_reports_count: reportCount,
        citizen_urgency_boost: citizenBoost,
        citizen_validation_status: citizenValidationStatus,
        risk_score: finalScore,
        priority_level: priorityLevel,
        badge: badge,
        primary_factor: primaryFactor,
      };
    });
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
    if (query.province) params.append("province", query.province);
    if (query.kabupaten) params.append("kabupaten", query.kabupaten);
    if (query.kecamatan) params.append("kecamatan", query.kecamatan);
    if (query.min_score !== undefined) params.append("min_score", String(query.min_score));
    if (query.date) params.append("date", query.date);

    const url = `${this.dataServiceUrl}/api/clusters?${params.toString()}`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Data service HTTP ${res.status}`);
      const rawClusters = await res.json();
      let enriched = await this.enrichClustersWithLiveReports(rawClusters);

      // Re-sort berdasarkan skor risiko tertinggi (Prioritas P1 > P2 > P3)
      enriched.sort((a, b) => (b.risk_score || 0) - (a.risk_score || 0));

      // Jika ada filter priority, saring setelah kalkulasi final skor & kenaikan kelas
      if (query.priority) {
        const pNorm = query.priority.toUpperCase().trim();
        enriched = enriched.filter((c) => c.priority_level?.startsWith(pNorm));
      }

      return enriched;
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
      const raw = await res.json();
      if (!raw) return null;
      const enriched = await this.enrichClustersWithLiveReports([raw]);
      return enriched[0] || null;
    } catch (err: any) {
      this.logger.error(`Gagal memanggil data service cluster detail: ${err.message}`);
      return null;
    }
  }

  async getStatistics() {
    try {
      const clusters = await this.getClusters({});
      if (!clusters || clusters.length === 0) return null;

      const p1Count = clusters.filter((c) => c.priority_level?.startsWith("P1")).length;
      const p2Count = clusters.filter((c) => c.priority_level?.startsWith("P2")).length;
      const p3Count = clusters.filter((c) => c.priority_level?.startsWith("P3")).length;
      const totalHotspots = clusters.reduce((acc, c) => acc + (c.hotspot_count_24h || 0), 0);

      return {
        total_clusters: clusters.length,
        p1_high_priority: p1Count,
        p2_medium_priority: p2Count,
        p3_low_priority: p3Count,
        total_hotspots_24h: totalHotspots,
      };
    } catch (err: any) {
      this.logger.error(`Gagal memanggil statistics: ${err.message}`);
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
  async getTransparencySummary() {
    const url = `${this.dataServiceUrl}/api/transparency/summary`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Data service HTTP ${res.status}`);
      return await res.json();
    } catch (err: any) {
      this.logger.error(`Gagal memanggil transparency summary: ${err.message}`);
      return null;
    }
  }

  async getDownloadCsvText(): Promise<string | null> {
    const url = `${this.dataServiceUrl}/api/transparency/download-csv`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Data service HTTP ${res.status}`);
      return await res.text();
    } catch (err: any) {
      this.logger.error(`Gagal mengunduh CSV data terbuka: ${err.message}`);
      return null;
    }
  }
}
