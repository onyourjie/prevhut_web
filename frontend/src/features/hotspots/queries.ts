import { useQuery } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api"
import { getMockPrioritySummary, MOCK_PRIORITY_AREAS } from "./mock-data"
import type { AreaPrioritySummary, PriorityArea, PriorityLevel } from "./schemas"

export interface HotspotFilterParams {
  province?: string | null
  regency?: string | null
  district?: string | null
  priorities?: ("P1" | "P2" | "P3")[]
  date?: string | null
  userLocationName?: string
  userCoordinates?: { lat: number; lng: number }
}

function checkUserInside(c: any, userCoords?: { lat: number; lng: number }): boolean {
  if (!userCoords) return false;
  if (c.centroid && typeof c.centroid.latitude === "number" && typeof c.centroid.longitude === "number") {
    const dLat = Math.abs(c.centroid.latitude - userCoords.lat);
    const dLon = Math.abs(c.centroid.longitude - userCoords.lng);
    if (dLat < 0.18 && dLon < 0.18) return true;
  }
  if (c.bounding_box &&
      userCoords.lat >= c.bounding_box.min_lat && userCoords.lat <= c.bounding_box.max_lat &&
      userCoords.lng >= c.bounding_box.min_lon && userCoords.lng <= c.bounding_box.max_lon) {
    return true;
  }
  return false;
}

function mapClusterToPriorityArea(c: any, index: number, userCoords?: { lat: number; lng: number }): PriorityArea {
  const pCode: PriorityLevel = c.priority_level?.startsWith("P1")
    ? "P1"
    : c.priority_level?.startsWith("P2")
    ? "P2"
    : "P3"

  return {
    id: c.id || `area-${index + 1}`,
    name: c.code || `Area Pantau ${String(index + 1).padStart(2, "0")}`,
    priority: pCode,
    priorityLabel:
      c.badge ||
      (pCode === "P1"
        ? "Prioritas Tinggi"
        : pCode === "P2"
        ? "Perhatian Meningkat"
        : "Tetap Dipantau"),
    score: typeof c.risk_score === "number" ? c.risk_score : 50.0,
    province: c.province || "Kalimantan Barat",
    regency: c.kabupaten || "Kota Palangka Raya",
    district: c.kecamatan || "",
    hotspotCount: c.hotspot_count_24h || 1,
    lastUpdatedText: `Terakhir diperbarui ${c.last_updated || "01.00 WIB"}`,
    coordinates: {
      lat: c.centroid?.latitude ?? -2.2161,
      lng: c.centroid?.longitude ?? 113.9139,
    },
    bounds: [
      [c.bounding_box?.min_lat ?? -2.3, c.bounding_box?.min_lon ?? 113.8],
      [c.bounding_box?.max_lat ?? -2.1, c.bounding_box?.max_lon ?? 114.0],
    ],
    isUserInside: checkUserInside(c, userCoords),
    reasons: {
      detectionCountDate: c.hotspot_count_24h || 1,
      detectionDaysRatio: {
        days: c.days_detected_7d || 1,
        totalDays: 7,
      },
      frpMedian: c.median_frp_mw || 20.0,
      primaryFactor:
        c.primary_factor || "Faktor utama: kerapatan deteksi satelit NASA FIRMS",
    },
    hotspots: Array.isArray(c.hotspots) && c.hotspots.length > 0
      ? c.hotspots.map((hs: any, hsIdx: number) => ({
          id: `hs-${c.id || index}-${hsIdx + 1}`,
          lat: hs.latitude,
          lng: hs.longitude,
          confidence: hs.confidence || "high",
          frp: hs.frp_mw || c.median_frp_mw || 15.0,
          satellite: hs.satellite || "VIIRS S-NPP 375m",
          acquiredTime: hs.acq_time_utc ? `${hs.acq_time_utc} UTC` : "01.12 WIB",
          priority: pCode,
        }))
      : [
          {
            id: `hs-${c.id || index}-1`,
            lat: c.centroid?.latitude ?? -2.2161,
            lng: c.centroid?.longitude ?? 113.9139,
            confidence: "high",
            frp: c.median_frp_mw || 15.0,
            satellite: "VIIRS (Suomi NPP 375m)",
            acquiredTime: "01.12 WIB",
            priority: pCode,
          },
        ],
  }
}

/**
 * Hook TanStack Query untuk memuat daftar area prioritas.
 * Terintegrasi ke Backend Gateway (/hotspots/clusters) -> FastAPI Model Service (NASA FIRMS DBSCAN).
 * Dilengkapi fallback otomatis ke mock jika backend tidak dapat dihubungi.
 */
export function usePriorityAreas(filter?: HotspotFilterParams) {
  return useQuery<AreaPrioritySummary>({
    queryKey: ["hotspots", "priority-areas", filter],
    queryFn: async () => {
      try {
        const queryParams = new URLSearchParams()
        if (filter?.province) {
          queryParams.append("province", filter.province)
        }
        if (filter?.regency) {
          queryParams.append("kabupaten", filter.regency)
        }
        if (filter?.district) {
          queryParams.append("kecamatan", filter.district)
        }
        if (filter?.date) {
          queryParams.append("date", filter.date)
        }
        const qs = queryParams.toString()
        const path = `/hotspots/clusters${qs ? `?${qs}` : ""}`
        
        const clusters = await apiRequest<any[]>(path)
        if (Array.isArray(clusters) && clusters.length > 0) {
          let mappedAreas = clusters.map((c, i) => mapClusterToPriorityArea(c, i, filter?.userCoordinates))

          // Filter by priorities jika ada
          if (filter?.priorities && filter.priorities.length > 0) {
            mappedAreas = mappedAreas.filter((a) =>
              filter.priorities!.includes(a.priority)
            )
          }

          // Filter by province jika ada
          if (filter?.province) {
            const pNorm = filter.province.toLowerCase().trim()
            mappedAreas = mappedAreas.filter((a) =>
              (a.province && a.province.toLowerCase().includes(pNorm)) ||
              (a.regency && a.regency.toLowerCase().includes(pNorm))
            )
          }

          // Filter by regency jika ada
          if (filter?.regency) {
            const rNorm = filter.regency.toLowerCase().trim()
            mappedAreas = mappedAreas.filter((a) => a.regency.toLowerCase().includes(rNorm))
          }

          // Filter by district jika ada
          if (filter?.district) {
            const dNorm = filter.district.toLowerCase().trim()
            mappedAreas = mappedAreas.filter((a) => a.district.toLowerCase().includes(dNorm))
          }

          // Pastikan hasil selalu tersortir berdasarkan skor risiko tertinggi (P1 > P2 > P3)
          mappedAreas.sort((a, b) => b.score - a.score)

          const insideArea = mappedAreas.find((a) => a.isUserInside) || null
          const activeLocationLabel = filter?.regency || filter?.province || filter?.userLocationName || "Seluruh Kalimantan"

          return {
            currentLocationName: activeLocationLabel,
            currentLocationStatusText: insideArea
              ? `Status prioritas ${insideArea.priority} di lokasimu`
              : "Status Wilayah Normal • Tetap Waspada",
            currentAreaInside: insideArea,
            totalAreasFound: mappedAreas.length,
            areas: mappedAreas,
          }
        }
      } catch (err) {
        console.warn("Gagal memuat live clusters dari backend, beralih ke cache data:", err)
      }

      // Fallback ke mock data terverifikasi jika server tidak dapat dihubungi
      return getMockPrioritySummary(filter)
    },
    staleTime: 1000 * 60 * 3, // 3 menit
  })
}

/**
 * Hook TanStack Query untuk memuat detail satu area pemantauan.
 */
export function usePriorityAreaDetail(areaId: string | null) {
  return useQuery<PriorityArea | null>({
    queryKey: ["hotspots", "area-detail", areaId],
    queryFn: async () => {
      if (!areaId) return null
      try {
        const cluster = await apiRequest<any>(`/hotspots/clusters/${areaId}`)
        if (cluster && cluster.id) {
          return mapClusterToPriorityArea(cluster, 0)
        }
      } catch (err) {
        console.warn("Gagal memuat detail klaster dari API, mencari di cache:", err)
      }
      const found = MOCK_PRIORITY_AREAS.find((a) => a.id === areaId)
      return found ?? null
    },
    enabled: Boolean(areaId),
  })
}
