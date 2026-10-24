import { useQuery } from '@tanstack/react-query'
import { getMockPrioritySummary, MOCK_PRIORITY_AREAS } from './mock-data'
import type { AreaPrioritySummary, PriorityArea } from './schemas'

export interface HotspotFilterParams {
  district?: string | null
  priorities?: ('P1' | 'P2' | 'P3')[]
}

/**
 * Hook TanStack Query untuk memuat daftar area prioritas.
 * Dilengkapi delay simulasi 300ms agar skeleton loading state teruji dengan baik.
 */
export function usePriorityAreas(filter?: HotspotFilterParams) {
  return useQuery<AreaPrioritySummary>({
    queryKey: ['hotspots', 'priority-areas', filter],
    queryFn: async () => {
      // Simulasi latency jaringan
      await new Promise((resolve) => setTimeout(resolve, 300))
      return getMockPrioritySummary(filter)
    },
    staleTime: 1000 * 60 * 5, // 5 menit
  })
}

/**
 * Hook TanStack Query untuk memuat detail satu area pemantauan.
 */
export function usePriorityAreaDetail(areaId: string | null) {
  return useQuery<PriorityArea | null>({
    queryKey: ['hotspots', 'area-detail', areaId],
    queryFn: async () => {
      if (!areaId) return null
      await new Promise((resolve) => setTimeout(resolve, 200))
      const found = MOCK_PRIORITY_AREAS.find((a) => a.id === areaId)
      return found ?? null
    },
    enabled: Boolean(areaId),
  })
}
