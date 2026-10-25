import type { PriorityArea, AreaPrioritySummary } from './schemas'

/**
 * Titik tengah dan lokasi pengguna simulasi (Kabupaten Sintang, Kalimantan Barat)
 */
export const USER_CURRENT_LOCATION = {
  lat: 0.0665,
  lng: 111.4985,
  name: 'Kabupaten Sintang',
  district: 'Kecamatan Sintang',
  label: 'Lokasi saat ini',
}

/**
 * Daftar kecamatan untuk filter wilayah Kabupaten Sintang
 */
export const SINTANG_DISTRICTS = [
  'Kecamatan Sintang',
  'Kecamatan Sungai Tebelian',
  'Kecamatan Dedai',
  'Kecamatan Sepauk',
  'Kecamatan Kelam Permai',
  'Kecamatan Tempunak',
]

/**
 * Data mock realistis 10 Area Pantau sesuai dokumen desain
 */
export const MOCK_PRIORITY_AREAS: PriorityArea[] = [
  {
    id: 'area-01',
    name: 'Area Pantau 01',
    priority: 'P1',
    priorityLabel: 'Prioritas Tinggi',
    score: 85.2,
    regency: 'Kabupaten Sintang',
    district: 'Kecamatan Sintang',
    hotspotCount: 4,
    lastUpdatedText: 'Terakhir diperbarui 01.00 WIB',
    coordinates: { lat: 0.0645, lng: 111.495 },
    bounds: [
      [0.052, 111.482],
      [0.077, 111.508],
    ],
    isUserInside: true,
    reasons: {
      detectionCountDate: 4,
      detectionDaysRatio: { days: 6, totalDays: 7 },
      frpMedian: 58.33,
      primaryFactor: 'Faktor utama: jumlah deteksi pada tanggal ini',
    },
    hotspots: [
      {
        id: 'hs-01-a',
        lat: 0.0645,
        lng: 111.495,
        confidence: 'high',
        frp: 64.2,
        satellite: 'VIIRS (Suomi NPP)',
        acquiredTime: '24/09/2026, 01.12 WIB',
        priority: 'P1',
      },
      {
        id: 'hs-01-b',
        lat: 0.068,
        lng: 111.492,
        confidence: 'high',
        frp: 52.8,
        satellite: 'VIIRS (NOAA-20)',
        acquiredTime: '24/09/2026, 01.15 WIB',
        priority: 'P1',
      },
      {
        id: 'hs-01-c',
        lat: 0.059,
        lng: 111.501,
        confidence: 'nominal',
        frp: 58.0,
        satellite: 'MODIS (Aqua)',
        acquiredTime: '24/09/2026, 13.30 WIB',
        priority: 'P1',
      },
      {
        id: 'hs-01-d',
        lat: 0.072,
        lng: 111.488,
        confidence: 'high',
        frp: 71.5,
        satellite: 'VIIRS (NOAA-21)',
        acquiredTime: '24/09/2026, 02.05 WIB',
        priority: 'P1',
      },
    ],
  },
  {
    id: 'area-02',
    name: 'Area Pantau 02',
    priority: 'P2',
    priorityLabel: 'Perhatian Meningkat',
    score: 75.4,
    regency: 'Kabupaten Sintang',
    district: 'Kecamatan Sungai Tebelian',
    hotspotCount: 3,
    lastUpdatedText: 'Terakhir diperbarui 01.00 WIB',
    coordinates: { lat: 0.038, lng: 111.458 },
    bounds: [
      [0.025, 111.445],
      [0.051, 111.472],
    ],
    isUserInside: false,
    reasons: {
      detectionCountDate: 3,
      detectionDaysRatio: { days: 4, totalDays: 7 },
      frpMedian: 26.21,
      primaryFactor: 'Faktor utama: jumlah deteksi pada tanggal 24/09/26',
    },
    hotspots: [
      {
        id: 'hs-02-a',
        lat: 0.038,
        lng: 111.458,
        confidence: 'nominal',
        frp: 28.5,
        satellite: 'VIIRS (Suomi NPP)',
        acquiredTime: '24/09/2026, 01.12 WIB',
        priority: 'P2',
      },
      {
        id: 'hs-02-b',
        lat: 0.042,
        lng: 111.465,
        confidence: 'nominal',
        frp: 24.0,
        satellite: 'MODIS (Terra)',
        acquiredTime: '24/09/2026, 10.45 WIB',
        priority: 'P2',
      },
      {
        id: 'hs-02-c',
        lat: 0.031,
        lng: 111.451,
        confidence: 'low',
        frp: 18.2,
        satellite: 'VIIRS (NOAA-20)',
        acquiredTime: '24/09/2026, 01.15 WIB',
        priority: 'P2',
      },
    ],
  },
  {
    id: 'area-03',
    name: 'Area Pantau 03',
    priority: 'P2',
    priorityLabel: 'Perhatian Meningkat',
    score: 71.8,
    regency: 'Kabupaten Sintang',
    district: 'Kecamatan Sungai Tebelian',
    hotspotCount: 2,
    lastUpdatedText: 'Terakhir diperbarui 02.15 WIB',
    coordinates: { lat: 0.048, lng: 111.432 },
    bounds: [
      [0.035, 111.419],
      [0.061, 111.445],
    ],
    isUserInside: false,
    reasons: {
      detectionCountDate: 2,
      detectionDaysRatio: { days: 3, totalDays: 7 },
      frpMedian: 22.14,
      primaryFactor: 'Faktor utama: persistensi titik panas berulang',
    },
    hotspots: [
      {
        id: 'hs-03-a',
        lat: 0.048,
        lng: 111.432,
        confidence: 'nominal',
        frp: 22.14,
        satellite: 'VIIRS (Suomi NPP)',
        acquiredTime: '24/09/2026, 02.15 WIB',
        priority: 'P2',
      },
    ],
  },
  {
    id: 'area-04',
    name: 'Area Pantau 04',
    priority: 'P3',
    priorityLabel: 'Tetap Dipantau',
    score: 64.5,
    regency: 'Kabupaten Sintang',
    district: 'Kecamatan Sungai Tebelian',
    hotspotCount: 2,
    lastUpdatedText: 'Terakhir diperbarui 03.00 WIB',
    coordinates: { lat: 0.092, lng: 111.468 },
    bounds: [
      [0.08, 111.455],
      [0.104, 111.481],
    ],
    isUserInside: false,
    reasons: {
      detectionCountDate: 2,
      detectionDaysRatio: { days: 2, totalDays: 7 },
      frpMedian: 16.76,
      primaryFactor: 'Faktor utama: deteksi intensitas panas rendah',
    },
    hotspots: [
      {
        id: 'hs-04-a',
        lat: 0.092,
        lng: 111.468,
        confidence: 'low',
        frp: 16.76,
        satellite: 'MODIS (Aqua)',
        acquiredTime: '24/09/2026, 03.00 WIB',
        priority: 'P3',
      },
    ],
  },
  {
    id: 'area-05',
    name: 'Area Pantau 05',
    priority: 'P3',
    priorityLabel: 'Tetap Dipantau',
    score: 58.0,
    regency: 'Kabupaten Sintang',
    district: 'Kecamatan Dedai',
    hotspotCount: 1,
    lastUpdatedText: 'Terakhir diperbarui 04.30 WIB',
    coordinates: { lat: 0.021, lng: 111.532 },
    bounds: [
      [0.01, 111.519],
      [0.033, 111.545],
    ],
    isUserInside: false,
    reasons: {
      detectionCountDate: 1,
      detectionDaysRatio: { days: 2, totalDays: 7 },
      frpMedian: 14.5,
      primaryFactor: 'Faktor utama: verifikasi berkala posko',
    },
    hotspots: [
      {
        id: 'hs-05-a',
        lat: 0.021,
        lng: 111.532,
        confidence: 'low',
        frp: 14.5,
        satellite: 'VIIRS (Suomi NPP)',
        acquiredTime: '24/09/2026, 04.30 WIB',
        priority: 'P3',
      },
    ],
  },
  {
    id: 'area-06',
    name: 'Area Pantau 06',
    priority: 'P2',
    priorityLabel: 'Perhatian Meningkat',
    score: 72.1,
    regency: 'Kabupaten Sintang',
    district: 'Kecamatan Dedai',
    hotspotCount: 3,
    lastUpdatedText: 'Terakhir diperbarui 05.00 WIB',
    coordinates: { lat: 0.035, lng: 111.562 },
    bounds: [
      [0.022, 111.549],
      [0.048, 111.575],
    ],
    isUserInside: false,
    reasons: {
      detectionCountDate: 3,
      detectionDaysRatio: { days: 4, totalDays: 7 },
      frpMedian: 29.8,
      primaryFactor: 'Faktor utama: peningkatan suhu permukaan gambut',
    },
    hotspots: [
      {
        id: 'hs-06-a',
        lat: 0.035,
        lng: 111.562,
        confidence: 'nominal',
        frp: 29.8,
        satellite: 'VIIRS (NOAA-20)',
        acquiredTime: '24/09/2026, 05.00 WIB',
        priority: 'P2',
      },
    ],
  },
  {
    id: 'area-07',
    name: 'Area Pantau 07',
    priority: 'P1',
    priorityLabel: 'Prioritas Tinggi',
    score: 81.6,
    regency: 'Kabupaten Sintang',
    district: 'Kecamatan Sepauk',
    hotspotCount: 4,
    lastUpdatedText: 'Terakhir diperbarui 02.40 WIB',
    coordinates: { lat: 0.098, lng: 111.398 },
    bounds: [
      [0.085, 111.385],
      [0.111, 111.411],
    ],
    isUserInside: false,
    reasons: {
      detectionCountDate: 4,
      detectionDaysRatio: { days: 5, totalDays: 7 },
      frpMedian: 51.4,
      primaryFactor: 'Faktor utama: kepulan asap tebal dan angin kencang',
    },
    hotspots: [
      {
        id: 'hs-07-a',
        lat: 0.098,
        lng: 111.398,
        confidence: 'high',
        frp: 51.4,
        satellite: 'VIIRS (Suomi NPP)',
        acquiredTime: '24/09/2026, 02.40 WIB',
        priority: 'P1',
      },
    ],
  },
  {
    id: 'area-08',
    name: 'Area Pantau 08',
    priority: 'P3',
    priorityLabel: 'Tetap Dipantau',
    score: 52.3,
    regency: 'Kabupaten Sintang',
    district: 'Kecamatan Sepauk',
    hotspotCount: 1,
    lastUpdatedText: 'Terakhir diperbarui 06.00 WIB',
    coordinates: { lat: 0.115, lng: 111.412 },
    bounds: [
      [0.102, 111.399],
      [0.128, 111.425],
    ],
    isUserInside: false,
    reasons: {
      detectionCountDate: 1,
      detectionDaysRatio: { days: 1, totalDays: 7 },
      frpMedian: 12.0,
      primaryFactor: 'Faktor utama: observasi rutin batas hutan lindung',
    },
    hotspots: [
      {
        id: 'hs-08-a',
        lat: 0.115,
        lng: 111.412,
        confidence: 'low',
        frp: 12.0,
        satellite: 'MODIS (Aqua)',
        acquiredTime: '24/09/2026, 06.00 WIB',
        priority: 'P3',
      },
    ],
  },
  {
    id: 'area-09',
    name: 'Area Pantau 09',
    priority: 'P2',
    priorityLabel: 'Perhatian Meningkat',
    score: 69.4,
    regency: 'Kabupaten Sintang',
    district: 'Kecamatan Kelam Permai',
    hotspotCount: 2,
    lastUpdatedText: 'Terakhir diperbarui 04.10 WIB',
    coordinates: { lat: 0.082, lng: 111.585 },
    bounds: [
      [0.069, 111.572],
      [0.095, 111.598],
    ],
    isUserInside: false,
    reasons: {
      detectionCountDate: 2,
      detectionDaysRatio: { days: 3, totalDays: 7 },
      frpMedian: 24.6,
      primaryFactor: 'Faktor utama: dekat dengan area pemukiman warga',
    },
    hotspots: [
      {
        id: 'hs-09-a',
        lat: 0.082,
        lng: 111.585,
        confidence: 'nominal',
        frp: 24.6,
        satellite: 'VIIRS (NOAA-20)',
        acquiredTime: '24/09/2026, 04.10 WIB',
        priority: 'P2',
      },
    ],
  },
  {
    id: 'area-10',
    name: 'Area Pantau 10',
    priority: 'P3',
    priorityLabel: 'Tetap Dipantau',
    score: 48.7,
    regency: 'Kabupaten Sintang',
    district: 'Kecamatan Tempunak',
    hotspotCount: 1,
    lastUpdatedText: 'Terakhir diperbarui 05.20 WIB',
    coordinates: { lat: 0.012, lng: 111.378 },
    bounds: [
      [0.001, 111.365],
      [0.024, 111.391],
    ],
    isUserInside: false,
    reasons: {
      detectionCountDate: 1,
      detectionDaysRatio: { days: 1, totalDays: 7 },
      frpMedian: 10.2,
      primaryFactor: 'Faktor utama: pemantauan jarak jauh area perkebunan',
    },
    hotspots: [
      {
        id: 'hs-10-a',
        lat: 0.012,
        lng: 111.378,
        confidence: 'low',
        frp: 10.2,
        satellite: 'VIIRS (Suomi NPP)',
        acquiredTime: '24/09/2026, 05.20 WIB',
        priority: 'P3',
      },
    ],
  },
]

/**
 * Mendapatkan ringkasan area prioritas dengan opsi filter
 */
export function getMockPrioritySummary(filter?: {
  district?: string | null
  priorities?: ('P1' | 'P2' | 'P3')[]
}): AreaPrioritySummary {
  let filtered = [...MOCK_PRIORITY_AREAS]

  if (filter?.district) {
    filtered = filtered.filter((area) => area.district === filter.district)
  }

  if (filter?.priorities && filter.priorities.length > 0) {
    filtered = filtered.filter((area) => filter.priorities!.includes(area.priority))
  }

  const currentInside =
    filtered.find((area) => area.isUserInside && area.regency === USER_CURRENT_LOCATION.name) ??
    null

  return {
    currentLocationName: USER_CURRENT_LOCATION.name,
    currentLocationStatusText: currentInside
      ? `Prioritas tinggi pada 27 Sep 2026 • Data diperbarui 12 jam yang lalu`
      : 'Tidak ada area prioritas aktif di sekitarmu saat ini',
    currentAreaInside: currentInside,
    totalAreasFound: filtered.length,
    areas: filtered,
  }
}
