import { useState, useMemo, useEffect, useRef } from 'react'
import { Flame, X } from 'lucide-react'
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
  const [citizenFocusPoint, setCitizenFocusPoint] = useState<{
    lat: number
    lng: number
    title: string
    subtitle?: string
  } | null>(null)
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

  // Track URL parameter that has already been focused to prevent re-opening on close/change
  const appliedAreaRef = useRef<string | null>(null)

  // Otomatis fokus dan buka detail kluster area bila URL memiliki '?area=...' atau '?lat=...&lon=...'
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const areaQuery = urlParams.get('area')
    const latQuery = urlParams.get('lat')
    const lonQuery = urlParams.get('lon')
    const labelQuery = urlParams.get('label')

    if (!areaQuery && !latQuery && !lonQuery) return

    const paramKey = `${areaQuery || ''}_${latQuery || ''}_${lonQuery || ''}`
    if (appliedAreaRef.current === paramKey) return

    // 1. Coba cocokkan dengan kluster satelit NASA jika ada
    let match: PriorityArea | undefined
    if (areaQuery && areas.length > 0) {
      match = areas.find(
        (a) =>
          a.name.toLowerCase() === areaQuery.toLowerCase() ||
          a.name.toLowerCase().includes(areaQuery.toLowerCase()) ||
          a.id === areaQuery
      )
    }

    if (match) {
      appliedAreaRef.current = paramKey
      setSelectedArea(match)
      setCitizenFocusPoint(null)
    } else if (latQuery && lonQuery) {
      // 2. Jika tidak ada kluster satelit NASA, tapi ada koordinat laporan warga
      const parsedLat = parseFloat(latQuery)
      const parsedLon = parseFloat(lonQuery)
      if (!isNaN(parsedLat) && !isNaN(parsedLon)) {
        appliedAreaRef.current = paramKey
        setSelectedArea(null)
        setCitizenFocusPoint({
          lat: parsedLat,
          lng: parsedLon,
          title: labelQuery || areaQuery || 'Laporan Titik Api Warga',
          subtitle: 'Laporan warga belum terdeteksi satelit NASA FIRMS (Perlu Ground Checking)',
        })
      }
    } else if (areaQuery) {
      // 3. Fallback jika nama wilayah ada (misal "Kota Tarakan")
      const coords = getRegencyCoordinates(undefined, areaQuery)
      appliedAreaRef.current = paramKey
      setSelectedArea(null)
      setCitizenFocusPoint({
        lat: coords.lat,
        lng: coords.lng,
        title: labelQuery || areaQuery,
        subtitle: 'Perkiraan wilayah laporan warga (Perlu Ground Checking)',
      })
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
            citizenFocusPoint={citizenFocusPoint}
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

      {/* Floating Info Banner untuk Laporan Warga Belum Ada Kluster Satelit */}
      {citizenFocusPoint && !selectedArea && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] max-w-lg w-[92%] bg-white/95 backdrop-blur-md rounded-2xl border border-amber-300 shadow-xl p-3.5 flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
              <Flame className="w-4 h-4 text-amber-600" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  Laporan Warga
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
                  Satelit Belum Mendeteksi
                </span>
              </div>
              <h4 className="text-xs font-black text-neutral-900 leading-tight">
                {citizenFocusPoint.title}
              </h4>
              <p className="text-[11px] text-neutral-600 leading-tight">
                Koordinat: {citizenFocusPoint.lat.toFixed(5)}, {citizenFocusPoint.lng.toFixed(5)} • Perlu penugasan relawan untuk *ground checking* ke lokasi.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCitizenFocusPoint(null)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition cursor-pointer shrink-0"
            title="Tutup Info"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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
