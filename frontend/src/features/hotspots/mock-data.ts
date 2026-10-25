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

import { MOCK_AREAS_PART1 } from './mock-areas-part1'
import { MOCK_AREAS_PART2 } from './mock-areas-part2'

/**
 * Data mock realistis 10 Area Pantau sesuai dokumen desain
 */
export const MOCK_PRIORITY_AREAS: PriorityArea[] = [
  ...MOCK_AREAS_PART1,
  ...MOCK_AREAS_PART2,
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
