import { useState, useEffect, useMemo } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Bell, Shield, Users } from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'
import { useAuthStore } from '@/store/auth.store'
import type { Assignment } from '@/components/assignments/assignment.types'
import { apiRequest } from '@/lib/api'
import { usePriorityAreas } from '@/features/hotspots'
import { showSuccessToast, showErrorToast } from '@/lib/swal'
import { EvacuationGuideModal } from '@/components/home/EvacuationGuideModal'
import { EmergencyCallModal } from '@/components/home/EmergencyCallModal'
import { VolunteerActiveTaskCard, type ActiveTask } from '@/components/home/VolunteerActiveTaskCard'
import { VolunteerPrioritySection } from '@/components/home/VolunteerPrioritySection'
import { VolunteerAvailabilityCard } from '@/components/home/VolunteerAvailabilityCard'
import { LocationStatusCard } from '@/components/home/LocationStatusCard'
import { CitizenActionsSection } from '@/components/home/CitizenActionsSection'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { user, isAuthenticated, hasHydrated, updateUser } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      navigate({ to: '/login' })
    }
  }, [hasHydrated, isAuthenticated, navigate])
  const isVolunteer = user?.role === 'RELAWAN'
  const isAdmin = user?.role === 'ADMIN'



  // Volunteer availability
  const [isAvailable, setIsAvailable] = useState<boolean>(user?.isAvailable ?? true)
  const [isTogglingAvail, setIsTogglingAvail] = useState(false)

  // Modals for Warga
  const [isEvacuationModalOpen, setIsEvacuationModalOpen] = useState(false)
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false)

  const userProvince = user?.province || undefined
  const userRegency = user?.kabupaten || undefined
  const userDistrict = user?.kecamatan || undefined
  const userCoords =
    user?.latitude && user?.longitude
      ? { lat: user.latitude, lng: user.longitude }
      : undefined

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

  // TanStack Query: Tugas aktif relawan
  const { data: myTasks = [] } = useQuery<Assignment[]>({
    queryKey: ['my-active-tasks'],
    queryFn: () => apiRequest<Assignment[]>('/assignments/my-tasks'),
    enabled: isAuthenticated && (isVolunteer || isAdmin),
  })

  const activeTask = useMemo<ActiveTask | null>(() => {
    const ongoing = myTasks.find((t) =>
      ['ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'ON_SITE'].includes(t.status)
    )
    if (!ongoing) return null
    return {
      id: ongoing.id,
      reportId: ongoing.post?.id ?? ongoing.postId ?? '',
      title: ongoing.post?.content || ongoing.notes || 'Penugasan Lapangan',
      locationName: ongoing.post?.address || ongoing.clusterCode || 'Lokasi tidak tersedia',
      urgency: ongoing.priorityLevel,
      status: ongoing.status,
      assignedAt: new Date(ongoing.createdAt).toLocaleString('id-ID'),
    }
  }, [myTasks])

  const totalHotspots = priorityData?.areas.reduce<number | null>((total, area) =>
    total != null && area.hotspotCount != null ? total + area.hotspotCount : null, 0) ?? null
  const tempText = weatherData?.temperature_c != null ? `${weatherData.temperature_c}°C` : 'Data tidak tersedia'
  const weatherText = weatherData?.weather_desc ?? 'Data tidak tersedia'
  const humidityText = weatherData?.humidity_percent != null ? `Kelembaban ${weatherData.humidity_percent}%` : 'Data tidak tersedia'
  const topAreas = (priorityData?.areas || []).slice(0, 3)
  const topCluster = topAreas[0]
  const lastSyncTime = topCluster?.lastUpdatedText ?? 'Data tidak tersedia'

  // Handle availability toggle
  const handleToggleAvailability = async () => {
    const nextVal = !isAvailable
    setIsTogglingAvail(true)
    try {
      await apiRequest('/users/profile', {
        method: 'PATCH',
        body: JSON.stringify({ isAvailable: nextVal }),
      })
      setIsAvailable(nextVal)
      updateUser({ isAvailable: nextVal })
      showSuccessToast(
        nextVal
          ? 'Status: Siap Siaga Bertugas (Available)'
          : 'Status: Sedang Istirahat / Off Duty'
      )
    } catch {
      showErrorToast('Gagal memperbarui status kesiapan')
    } finally {
      setIsTogglingAvail(false)
    }
  }

  const displayName = user?.name ? user.name.split(' ')[0] : 'Warga'
  const displayLocation = user?.kabupaten || 'Kabupaten Sintang'
  const displayProvince = user?.province || 'Kalimantan Barat'

  if (!isAuthenticated) {
    return null
  }

  return (
    <AppLayout
      title={isVolunteer ? 'Dasbor Relawan Lapangan' : 'Dasbor Warga Karhutla'}
      subtitle={
        isVolunteer
          ? 'Sistem Pemantauan Titik Panas & Disposisi Aksi Lapangan'
          : 'Deteksi Dini Bahaya Kebakaran Lahan & Tanggap Bencana'
      }
    >
      <div className="max-w-2xl mx-auto space-y-5 text-left pb-24">
        {/* HEADER TOP: Halo, Nama! + Badge Role + Notification Bell */}
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
                <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                  Halo, {displayName}!
                </h1>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide border ${
                    isVolunteer
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : isAdmin
                      ? 'bg-neutral-900 text-amber-400 border-neutral-700'
                      : 'bg-orange-100 text-orange-800 border-orange-200'
                  }`}
                >
                  {isVolunteer ? 'Relawan' : isAdmin ? 'Admin Posko' : 'Warga'}
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-medium">
                {isVolunteer
                  ? 'Regu Tanggap Siaga Kebakaran Hutan & Lahan'
                  : 'Pantauan lingkungan terkini sekitar tempat tinggal Anda'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/emergency"
              className="w-10 h-10 rounded-full bg-white border border-neutral-200 hover:border-neutral-300 shadow-2xs flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition"
              title="Notifikasi & Kontak Darurat"
            >
              <Bell className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {priorityData?.isSample && (
          <p role="status" className="text-xs font-bold text-amber-800">Data sampel • Bukan pengamatan terkini</p>
        )}

        {/* LOKASI DAN STATUS WILAYAH */}
        <LocationStatusCard
          displayLocation={displayLocation}
          displayProvince={displayProvince}
          hasPriorityAlert={Boolean(priorityData?.currentAreaInside)}
          currentLocationStatusText={priorityData?.currentLocationStatusText ?? 'Data tidak tersedia'}
          sourceLabel={priorityData?.isSample ? 'Data sampel' : priorityData || weatherData ? 'Satelit & Cuaca' : 'Data tidak tersedia'}
          totalHotspots={totalHotspots}
          weatherText={weatherText}
          tempText={tempText}
          humidityText={humidityText}
        />

        {/* SECTION SESUAI ROLE PENGGUNA */}
        {isVolunteer || isAdmin ? (
          <>
            {/* KESIAPSIAGAAN RELAWAN */}
            <VolunteerAvailabilityCard
              isAvailable={isAvailable}
              isTogglingAvailability={isTogglingAvail}
              onToggle={handleToggleAvailability}
            />

            {/* WIDGET TUGAS LAPANGAN AKTIF */}
            <VolunteerActiveTaskCard activeTask={activeTask} />

            {/* PRIORITAS TITIK PANAS (FIGMA RELAWAN) */}
            <VolunteerPrioritySection
              isLoadingAreas={isLoadingAreas}
              topAreas={topAreas}
            />

            {/* QUICK ACTIONS UNTUK RELAWAN */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link to="/assignments" className="block group">
                <div className="p-4 rounded-2xl bg-white border border-neutral-200 hover:border-emerald-500 hover:shadow-md transition space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-extrabold text-neutral-900 group-hover:text-emerald-700 transition">
                    Lembar Penugasan
                  </h4>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    Daftar aksi disposisi tugas verifikasi lapangan dari posko.
                  </p>
                </div>
              </Link>

              <Link to="/community" className="block group">
                <div className="p-4 rounded-2xl bg-white border border-neutral-200 hover:border-orange-500 hover:shadow-md transition space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-105 transition">
                    <Users className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-extrabold text-neutral-900 group-hover:text-orange-700 transition">
                    Laporan Warga
                  </h4>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    Pantau informasi langsung dari warga untuk tindakan cepat.
                  </p>
                </div>
              </Link>
            </div>
          </>
        ) : (
          /* SECTION UNTUK WARGA */
          <CitizenActionsSection
            weatherText={weatherText}
            totalHotspots={totalHotspots}
            tempText={tempText}
            displayLocation={displayLocation}
            topCluster={topCluster}
            observedAt={weatherData?.observed_at}
            isSample={priorityData?.isSample}
            lastSyncTime={lastSyncTime}
            onOpenEvacuationModal={() => setIsEvacuationModalOpen(true)}
            onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
          />
        )}
      </div>

      {/* MODAL PANDUAN & PROTOKOL EVAKUASI CEPAT */}
      <EvacuationGuideModal
        isOpen={isEvacuationModalOpen}
        onClose={() => setIsEvacuationModalOpen(false)}
      />

      {/* MODAL PANGGILAN DARURAT */}
      <EmergencyCallModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
    </AppLayout>
  )
}
