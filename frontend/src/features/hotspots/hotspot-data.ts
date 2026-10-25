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
 * Data area prioritas terkalibrasi FIRMS 10 Area Pantau sesuai dokumen desain
 */

import { PRIORITY_AREAS_PART1 } from './priority-areas-part1'
import { PRIORITY_AREAS_PART2 } from './priority-areas-part2'

/**
 * Data area prioritas terkalibrasi FIRMS 10 Area Pantau sesuai dokumen desain
 */
export const PRIORITY_AREAS_DATA: PriorityArea[] = [
  ...PRIORITY_AREAS_PART1,
  ...PRIORITY_AREAS_PART2,
]

/**
 * Mendapatkan ringkasan area prioritas dengan opsi filter
 */
export function getPrioritySummary(filter?: {
  district?: string | null
  priorities?: ('P1' | 'P2' | 'P3')[]
}): AreaPrioritySummary {
  let filtered = [...PRIORITY_AREAS_DATA]

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
