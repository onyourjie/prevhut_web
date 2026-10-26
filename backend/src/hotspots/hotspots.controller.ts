import { Controller, Get, Param, Query, Res } from "@nestjs/common";
import type { Response } from "express";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { HotspotsService } from "./hotspots.service.js";

@ApiTags("1. Intelijen Titik Panas & Klaster Spasial (Hotspots & AI Clusters)")
@Controller("hotspots")
export class HotspotsController {
  constructor(private hotspotsService: HotspotsService) {}

  @Get("clusters")
  @ApiOperation({
    summary: "Daftar Area Pantau Prioritas Spasial DBSCAN & Explainable Risk Score",
    description: "Mengambil klaster prioritas (P1/P2/P3) hasil sinkronisasi satelit FIRMS dan scoring mutakhir.",
  })
  @ApiQuery({ name: "priority", required: false, description: "Filter P1, P2, atau P3" })
  @ApiQuery({ name: "province", required: false, description: "Filter Provinsi (misal: Kalimantan Tengah)" })
  @ApiQuery({ name: "kabupaten", required: false, description: "Filter Kabupaten (misal: Kota Palangka Raya)" })
  @ApiQuery({ name: "kecamatan", required: false, description: "Filter Kecamatan" })
  @ApiQuery({ name: "min_score", required: false, description: "Skor risiko minimum" })
  @ApiQuery({ name: "date", required: false, description: "Tanggal observasi satelit NASA (YYYY-MM-DD)" })
  getClusters(
    @Query("priority") priority?: string,
    @Query("province") province?: string,
    @Query("kabupaten") kabupaten?: string,
    @Query("kecamatan") kecamatan?: string,
    @Query("min_score") min_score?: number,
    @Query("date") date?: string,
  ) {
    return this.hotspotsService.getClusters({ priority, province, kabupaten, kecamatan, min_score, date });
  }

  @Get("clusters/statistics")
  @ApiOperation({
    summary: "Statistik Klaster Karhutla (P1, P2, P3 & Total Titik Panas)",
  })
  getStatistics() {
    return this.hotspotsService.getStatistics();
  }

  @Get("clusters/:id")
  @ApiOperation({
    summary: "Rincian 1 Area Pantau lengkap dengan Bounding Box & Faktor Pendorong Skor",
  })
  getClusterDetail(@Param("id") id: string) {
    return this.hotspotsService.getClusterDetail(id);
  }

  @Get("live")
  @ApiOperation({
    summary: "Titik Panas Satelit Live NASA FIRMS VIIRS 375m",
  })
  getLiveHotspots(
    @Query("limit") limit?: number,
    @Query("confidence") confidence?: string,
  ) {
    return this.hotspotsService.getLiveHotspots({ limit, confidence });
  }

  @Get("weather-ispu")
  @ApiOperation({
    summary: "Kondisi Cuaca Real-time (Open-Meteo)",
  })
  getWeatherIspu(@Query("city") city?: string) {
    return this.hotspotsService.getWeatherIspu(city);
  }
  @Get("transparency/summary")
  @ApiOperation({
    summary: "Ringkasan Akuntabilitas Publik (Fitur #5 Open Data)",
  })
  getTransparencySummary() {
    return this.hotspotsService.getTransparencySummary();
  }

  @Get("transparency/download-csv")
  @ApiOperation({
    summary: "Unduh Berkas Data Terbuka CSV Seluruh Area Pantau Kalimantan",
  })
  async downloadCsv(@Res() res: Response) {
    const csvContent = await this.hotspotsService.getDownloadCsvText();
    if (!csvContent) {
      return res.status(404).json({ message: "Berkas CSV data terbuka belum tersedia" });
    }
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="fireline_priority_areas_kalimantan.csv"'
    );
    return res.send(csvContent);
  }
}
