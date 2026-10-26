import { useState, useMemo, useEffect, useRef } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '@/lib/api'
import { useAuthStore } from '@/store/auth.store'
import { getRegencyCoordinates } from '@/lib/kalimantan-locations'
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
  DataLoadingModal,
  usePriorityAreas,
} from '@/features/hotspots'
import type { PriorityArea, MapFilter } from '@/features/hotspots'
import { BottomNav } from '@/components/layout/bottom-nav'
import { MobileNavDrawer } from '@/components/layout/MobileNavDrawer'
import { AppSidebar } from '@/components/layout/app-sidebar'

export const Route = createFileRoute('/map')({
  component: MapPage,
})

function MapPage() {
  const { user, isAuthenticated } = useAuthStore()

  // Lokasi riil pengguna dari profil login jika sudah terautentikasi
  const userLocationName = isAuthenticated && user?.kabupaten ? user.kabupaten : null
  const userProvinceName = isAuthenticated && user?.province ? user.province : null

  const userCoordinates = useMemo(() => {
    if (!isAuthenticated || !user) return undefined
    if (typeof user.latitude === 'number' && typeof user.longitude === 'number' && user.latitude !== 0) {
      return { lat: user.latitude, lng: user.longitude }
    }
    if (userProvinceName && userLocationName) {
      return getRegencyCoordinates(userProvinceName, userLocationName)
    }
    return undefined
  }, [isAuthenticated, user, userProvinceName, userLocationName])

  // Filter geospasial fleksibel: default menampilkan seluruh Kalimantan
  const [filter, setFilter] = useState<MapFilter>({
    province: null,
    regency: null,
    district: null,
    date: new Date().toISOString().slice(0, 10),
    priorities: ['P1', 'P2', 'P3'],
  })

  const [selectedArea, setSelectedArea] = useState<PriorityArea | null>(null)
  const [isListOpen, setIsListOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isFilterLoadingModalOpen, setIsFilterLoadingModalOpen] = useState(false)
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)

  // Query Area Pantauan dari Data Service / Backend
  const { data, isFetching } = usePriorityAreas({
    province: filter.province,
    regency: filter.regency,
    district: filter.district,
    priorities: filter.priorities,
    date: filter.date,
    userLocationName: userLocationName || undefined,
    userCoordinates,
  })

  // Efek transisi halus untuk pop-up "Sedang Mengambil Data..." saat sinkronisasi satelit
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    if (isFetching) {
      setIsFilterLoadingModalOpen(true)
    } else {
      timer = setTimeout(() => {
        setIsFilterLoadingModalOpen(false)
      }, 700)
    }
    return () => clearTimeout(timer)
  }, [isFetching])

  const areas = data?.areas || []

  // Track URL area parameter that has already been focused to prevent re-opening on close/change
  const appliedAreaRef = useRef<string | null>(null)

  // Otomatis fokus dan buka detail kluster area bila URL memiliki '?area=...' (hanya sekali per nilai URL)
  useEffect(() => {
    if (areas.length === 0) return
    const urlParams = new URLSearchParams(window.location.search)
    const areaQuery = urlParams.get('area')
    if (!areaQuery) return

    if (appliedAreaRef.current !== areaQuery) {
      const match = areas.find(
        (a) =>
          a.name.toLowerCase() === areaQuery.toLowerCase() ||
          a.name.toLowerCase().includes(areaQuery.toLowerCase()) ||
          a.id === areaQuery
      )
      if (match) {
        appliedAreaRef.current = areaQuery
        setSelectedArea(match)
      }
    }
  }, [areas])

  // Ambil cuaca live sesuai kota yang sedang aktif/dipilih
  const activeCity = filter.regency || userLocationName || 'Palangka Raya'
  const { data: weatherData } = useQuery({
    queryKey: ['weather', activeCity],
    queryFn: async () => {
      try {
        const clean = activeCity.replace(/^(kabupaten|kota)\s+/i, '').trim()
        return await apiRequest<any>(`/hotspots/weather-ispu?city=${encodeURIComponent(clean)}`)
      } catch {
        return null
      }
    },
    staleTime: 1000 * 60 * 10,
  })

  const temperatureText = weatherData?.temperature_c
    ? `${weatherData.temperature_c}°C • ${weatherData.weather_desc || 'Cerah'}`
    : '31°C • Cerah'

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filter.province !== null) count += 1
    if (filter.regency !== null) count += 1
    if (filter.district !== null) count += 1
    if (filter.priorities.length < 3) count += 3 - filter.priorities.length
    if (filter.date && filter.date !== new Date().toISOString().slice(0, 10)) count += 1
    return count
  }, [filter])

  const handleClearFilter = () => {
    setFilter({
      province: null,
      regency: null,
      district: null,
      date: new Date().toISOString().slice(0, 10),
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

  const activeLocationHeader = filter.regency || filter.province || userLocationName || 'Seluruh Kalimantan'
  const activeSubLocationHeader = filter.regency
    ? (filter.province || userProvinceName || 'Kalimantan')
    : (filter.province || (userLocationName ? (userProvinceName || 'Kalimantan') : 'Seluruh Kalimantan'))

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-neutral-100 flex flex-row select-none">
      {/* Sidebar Navigasi Utama FIREZONE */}
      <AppSidebar className="hidden lg:flex" />

      {/* Konten Peta & Drawer Area Pantau */}
      <div className="flex-1 relative w-full overflow-hidden flex flex-col lg:flex-row h-full">
        <MapSidebar
          areas={areas}
          isLoading={isFetching}
          selectedArea={selectedArea}
          onSelectArea={handleSelectArea}
          filter={filter}
          onApplyFilter={(newFilter) => setFilter(newFilter)}
          onClearFilter={handleClearFilter}
          currentLocationName={activeLocationHeader}
          subLocationText={activeSubLocationHeader}
          temperatureText={temperatureText}
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
            userLocation={userCoordinates}
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
        <div className="absolute top-0 inset-x-0 z-30 p-3.5 sm:p-4 pt-[max(0.75rem,env(safe-area-inset-top))] max-w-lg mx-auto pointer-events-none lg:hidden">
          <MapHeader
            locationName={activeLocationHeader}
            locationSubtitle={activeSubLocationHeader}
            temperatureText={temperatureText}
            activeFilterCount={activeFilterCount}
            activeDistrictName={filter.district || filter.regency}
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
            regencyName={filter.regency || filter.district || activeLocationHeader}
            isFiltered={Boolean(filter.province || filter.regency || filter.district || filter.priorities.length < 3)}
            onClick={() => setIsListOpen(true)}
          />
        </div>
      )}

      {!selectedArea && <BottomNav variant="floating" onOpenMenu={() => setIsMobileDrawerOpen(true)} className="lg:hidden" />}

      {selectedArea && (
        <AreaDetailSheet
          area={selectedArea}
          onBack={() => setSelectedArea(null)}
          className="lg:hidden"
        />
      )}

      <MobileNavDrawer isOpen={isMobileDrawerOpen} onClose={() => setIsMobileDrawerOpen(false)} />

      <PriorityListSheet
        isOpen={isListOpen}
        areas={areas}
        regencyName={activeLocationHeader}
        onSelectArea={handleSelectArea}
        onClose={() => setIsListOpen(false)}
      />

      <MapFilterSheet
        isOpen={isFilterOpen}
        currentFilter={filter}
        isLoading={isFetching}
        onApply={(newFilter) => setFilter(newFilter)}
        onClose={() => setIsFilterOpen(false)}
      />

      {/* Pop-up dialog interaktif saat sinkronisasi data satelit / filter berlangsung */}
      <DataLoadingModal
        isOpen={isFilterLoadingModalOpen}
        filter={filter}
        locationName={activeLocationHeader}
        totalAreasFound={data?.totalAreasFound}
        onDismiss={() => setIsFilterLoadingModalOpen(false)}
      />
    </div>
  )
}
