import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { AppLayout } from '@/components/layout/app-layout'
import { useAuthStore } from '@/store/auth.store'
import { apiRequest } from '@/lib/api'
import { usePriorityAreas } from '@/features/hotspots'
import { getDistrictOrRegencyCoordinates } from '@/lib/kalimantan-locations'
import { VolunteerDashboard } from '@/components/home/VolunteerDashboard'
import { CitizenDashboard } from '@/components/home/CitizenDashboard'
import { AdminDashboard } from '@/components/home/AdminDashboard'
import { LandingPage } from '@/components/landing/LandingPage'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/')({
  component: RootPage,
})

function RootPage() {
  const { user, isAuthenticated, hasHydrated } = useAuthStore()

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-neutral-400">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
          <span className="text-xs font-semibold tracking-wide">Memuat FIREZONE...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <LandingPage />
  }

  return <HomePage />
}

function HomePage() {
  const { user, isAuthenticated } = useAuthStore()
  const isVolunteer = user?.role === 'RELAWAN'
  const isAdmin = user?.role === 'ADMIN'

  const userProvince = user?.province || undefined
  const userRegency = user?.kabupaten || undefined
  const userDistrict = user?.kecamatan || undefined
  const userCoords = useMemo(() => {
    if (!user) return undefined
    if (typeof user.latitude === 'number' && typeof user.longitude === 'number' && user.latitude !== 0) {
      if (user.province && user.kabupaten) {
        const expected = getDistrictOrRegencyCoordinates(user.province, user.kabupaten, user.kecamatan)
        const dist = Math.hypot(user.latitude - expected.lat, user.longitude - expected.lng) * 111
        // Jika koordinat tersimpan di DB meleset > 150 km dari domisili profilnya (misal koordinat Sintang saat pindah ke Kaltim),
        // gunakan titik koordinat domisili barunya agar jarak klaster di Beranda langsung akurat!
        if (dist > 150) {
          return expected
        }
      }
      return { lat: user.latitude, lng: user.longitude }
    }
    if (user.province && user.kabupaten) {
      return getDistrictOrRegencyCoordinates(user.province, user.kabupaten, user.kecamatan)
    }
    return undefined
  }, [user])

  // Dynamic live priority areas & meteorological data sesuai lokasi profil pengguna
  const { data: priorityData, isLoading: isLoadingAreas } = usePriorityAreas({
    province: userProvince,
    regency: userRegency,
    district: userDistrict,
    userCoordinates: userCoords,
  })
  // TanStack Query: Cuaca & ISPU live
  const userCity = user?.kabupaten
    ? user.kabupaten.replace(/^(kabupaten|kota)\s+/i, '').trim()
    : ''

  const { data: weatherData } = useQuery<any>({
    queryKey: ['weather-ispu', userCity],
    queryFn: () => {
      const endpoint = userCity
        ? `/hotspots/weather-ispu?city=${encodeURIComponent(userCity)}`
        : '/hotspots/weather-ispu'
      return apiRequest(endpoint)
    },
    enabled: isAuthenticated,
  })

  const totalHotspots = useMemo<number | null>(() => {
    if (!priorityData?.areas || priorityData.areas.length === 0) return null
    let sum = 0
    let hasValidCount = false
    for (const area of priorityData.areas) {
      if (typeof area.hotspotCount === 'number') {
        sum += area.hotspotCount
        hasValidCount = true
      }
    }
    return hasValidCount ? sum : null
  }, [priorityData?.areas])
  const tempText = weatherData?.temperature_c != null ? `${weatherData.temperature_c}°C` : 'Data tidak tersedia'
  const weatherText = weatherData?.weather_desc ?? 'Data tidak tersedia'
  const humidityText = weatherData?.humidity_percent != null ? `Kelembaban ${weatherData.humidity_percent}%` : 'Data tidak tersedia'
  const topAreas = (priorityData?.areas || []).slice(0, 3)
  const topCluster = topAreas[0]
  const lastSyncTime = topCluster?.lastUpdatedText ?? 'Data tidak tersedia'

  const displayName = user?.name ? user.name.split(' ')[0] : 'Warga'
  const displayLocation = user?.kabupaten || 'Kabupaten Sintang'
  const displayProvince = user?.province || 'Kalimantan Barat'

  if (!isAuthenticated) {
    return null
  }

  return (
    <AppLayout
      title={
        isVolunteer
          ? 'Dasbor Relawan Lapangan'
          : isAdmin
          ? 'Dasbor Posko BPBD'
          : undefined
      }
      subtitle={
        isVolunteer
          ? 'Sistem Pemantauan Titik Panas & Disposisi Aksi Lapangan'
          : isAdmin
          ? 'Pusat Komando & Manajemen Tanggap Kebakaran Hutan'
          : undefined
      }
    >
      <div
        className={cn(
          'mx-auto text-left pb-24',
          isVolunteer ? 'max-w-2xl space-y-5' : 'max-w-5xl space-y-6'
        )}
      >
        {/* HEADER TOP: Halo, Nama! + Role (khusus relawan/admin) + Notification Bell */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <img
              src={
                user?.avatarUrl ||
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80'
              }
              alt={user?.name || 'User'}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Halo, {displayName}!
                </h1>
                {(isVolunteer || isAdmin) && (
                  <span
                    className={cn(
                      'px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide border',
                      isVolunteer
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-neutral-900 text-amber-400 border-neutral-700'
                    )}
                  >
                    {isVolunteer ? 'Relawan' : 'Admin Posko'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {isVolunteer
                  ? 'Regu Tanggap Siaga Kebakaran Hutan & Lahan'
                  : isAdmin
                  ? 'Pusat Komando & Manajemen Tanggap Kebakaran Hutan'
                  : 'Pantauan lingkungan terkini sekitar tempat tinggal Anda'}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION SESUAI ROLE PENGGUNA */}
        {isAdmin ? (
          <AdminDashboard
            userLocation={{
              province: displayProvince,
              regency: displayLocation,
              district: userDistrict,
              coords: userCoords,
            }}
            totalHotspots={totalHotspots}
            priorityAreas={priorityData?.areas || []}
            isSample={priorityData?.isSample}
            lastSyncTime={lastSyncTime}
          />
        ) : isVolunteer ? (
          <VolunteerDashboard
            userLocation={{
              province: displayProvince,
              regency: displayLocation,
              district: userDistrict,
              coords: userCoords,
            }}
            weatherText={weatherText}
            tempText={tempText}
            humidityText={humidityText}
            totalHotspots={totalHotspots}
            priorityAreas={priorityData?.areas || []}
            isLoadingAreas={isLoadingAreas}
            isSample={priorityData?.isSample}
            lastSyncTime={lastSyncTime}
            weatherData={weatherData}
          />
        ) : (
          /* SECTION UNTUK WARGA (REVAMP CITIZEN DASHBOARD) */
          <CitizenDashboard
            userLocation={{
              province: displayProvince,
              regency: displayLocation,
              district: userDistrict,
              coords: userCoords,
            }}
            weatherText={weatherText}
            tempText={tempText}
            humidityText={humidityText}
            totalHotspots={totalHotspots}
            priorityAreas={priorityData?.areas || []}
            isSample={priorityData?.isSample}
            lastSyncTime={lastSyncTime}
            observedAt={weatherData?.observed_at}
            weatherData={weatherData}
          />
        )}
      </div>
    </AppLayout>
  )
}
