import { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  HotspotMap,
  MapHeader,
  MapLegend,
  MapStatusCard,
  PriorityDrawerBanner,
  AreaDetailSheet,
  AreaDetailPanel,
  PriorityListSheet,
  MapFilterSheet,
  MapSidebar,
  usePriorityAreas,
  USER_CURRENT_LOCATION,
} from '@/features/hotspots'
import type { PriorityArea, MapFilter } from '@/features/hotspots'
import { BottomNav } from '@/components/layout/bottom-nav'
import { MainNavbar } from '@/components/layout/main-navbar'

export const Route = createFileRoute('/map')({
  component: MapPage,
})

function MapPage() {
  const [filter, setFilter] = useState<MapFilter>({
    regency: USER_CURRENT_LOCATION.name,
    district: null,
    date: '2026-09-24',
    priorities: ['P1', 'P2', 'P3'],
  })

  const [selectedArea, setSelectedArea] = useState<PriorityArea | null>(null)
  const [isListOpen, setIsListOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const { data } = usePriorityAreas({
    district: filter.district,
    priorities: filter.priorities,
  })

  const areas = data?.areas || []

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filter.district !== null) count += 1
    if (filter.priorities.length < 3) count += 3 - filter.priorities.length
    return count
  }, [filter])

  const handleClearFilter = () => {
    setFilter({
      regency: USER_CURRENT_LOCATION.name,
      district: null,
      date: '2026-09-24',
      priorities: ['P1', 'P2', 'P3'],
    })
  }

  const handleTogglePriority = (p: 'P1' | 'P2' | 'P3') => {
    setFilter((prev) => {
      const exists = prev.priorities.includes(p)
      if (exists && prev.priorities.length > 1) {
        return { ...prev, priorities: prev.priorities.filter((item) => item !== p) }
      }
      if (!exists) {
        return { ...prev, priorities: [...prev.priorities, p] }
      }
      return prev
    })
  }

  const handleSelectArea = (area: PriorityArea | null) => {
    setSelectedArea(area)
  }

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-neutral-100 flex flex-col select-none">
      <MainNavbar />

      <div className="flex-1 relative w-full overflow-hidden flex flex-col lg:flex-row h-full">
        <MapSidebar
          areas={areas}
          selectedArea={selectedArea}
          onSelectArea={handleSelectArea}
          filter={filter}
          onApplyFilter={(newFilter) => setFilter(newFilter)}
          onClearFilter={handleClearFilter}
          currentLocationName={data?.currentLocationName || 'Kabupaten Sintang'}
          temperatureText="31°C • Cerah"
          currentAreaInside={data?.currentAreaInside}
          currentLocationStatusText={data?.currentLocationStatusText}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          className="hidden lg:flex"
        />

        <div className="flex-1 relative h-full w-full overflow-hidden">
          <HotspotMap
            areas={areas}
            selectedArea={selectedArea}
            onSelectArea={handleSelectArea}
            hideControlsOnMobile={Boolean(selectedArea)}
            desktopPanelOpen={Boolean(selectedArea)}
            className="w-full h-full"
          />

          {selectedArea && (
            <AreaDetailPanel
              key={selectedArea.id}
              area={selectedArea}
              onClose={() => setSelectedArea(null)}
              className="max-lg:hidden"
            />
          )}

          <div className="absolute bottom-6 left-6 z-[400] hidden lg:flex pointer-events-auto">
            <MapLegend
              activePriorities={filter.priorities}
              onTogglePriority={handleTogglePriority}
              showP3={true}
            />
          </div>
        </div>
      </div>

      {!selectedArea && (
        <div className="absolute top-0 inset-x-0 z-30 p-4 pt-[max(1rem,env(safe-area-inset-top))] max-w-md mx-auto pointer-events-none lg:hidden">
          <MapHeader
            locationName={data?.currentLocationName || 'Kabupaten Sintang'}
            locationSubtitle="Lokasi saat ini"
            temperatureText="31°C • Cerah"
            activeFilterCount={activeFilterCount}
            activeDistrictName={filter.district}
            onOpenFilter={() => setIsFilterOpen(true)}
            onClearFilter={handleClearFilter}
            onLocationClick={() => setIsFilterOpen(true)}
          />
        </div>
      )}

      {!selectedArea && (
        <div className="absolute bottom-0 inset-x-0 z-30 p-4 pb-20 max-w-md mx-auto pointer-events-none flex flex-col gap-2.5 lg:hidden">
          <MapLegend
            activePriorities={filter.priorities}
            onTogglePriority={handleTogglePriority}
            showP3={filter.priorities.includes('P3')}
          />

          {data?.currentAreaInside && (
            <MapStatusCard
              area={data.currentAreaInside}
              statusText={data.currentLocationStatusText}
              onClick={() => setSelectedArea(data.currentAreaInside)}
            />
          )}

          <PriorityDrawerBanner
            totalCount={data?.totalAreasFound ?? 0}
            regencyName={filter.district || 'Kab. Sintang'}
            isFiltered={Boolean(filter.district || filter.priorities.length < 3)}
            onClick={() => setIsListOpen(true)}
          />
        </div>
      )}

      {!selectedArea && <BottomNav variant="floating" className="lg:hidden" />}

      {selectedArea && (
        <AreaDetailSheet
          area={selectedArea}
          onBack={() => setSelectedArea(null)}
          className="lg:hidden"
        />
      )}

      <PriorityListSheet
        areas={areas}
        regencyName={filter.district || 'Kab. Sintang'}
        isOpen={isListOpen}
        onClose={() => setIsListOpen(false)}
        onSelectArea={(area) => setSelectedArea(area)}
        className="lg:hidden"
      />

      <MapFilterSheet
        isOpen={isFilterOpen}
        currentFilter={filter}
        onApply={(newFilter) => setFilter(newFilter)}
        onClose={() => setIsFilterOpen(false)}
        className="lg:hidden"
      />
    </div>
  )
}
