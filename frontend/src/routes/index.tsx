import { useState, useEffect } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Bell, Shield, Users } from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'
import { useAuthStore } from '@/store/auth.store'
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
import { MapIntelBanner } from '@/components/home/MapIntelBanner'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { user, isAuthenticated, updateUser } = useAuthStore()
  const isVolunteer = user?.role === 'RELAWAN'
  const isAdmin = user?.role === 'ADMIN'

  // Active Task for volunteer
  const [activeTask, setActiveTask] = useState<ActiveTask | null>(null)

  // Volunteer availability
  const [isAvailable, setIsAvailable] = useState<boolean>(user?.isAvailable ?? true)
  const [isTogglingAvail, setIsTogglingAvail] = useState(false)

  // Modals for Warga
  const [isEvacuationModalOpen, setIsEvacuationModalOpen] = useState(false)
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false)

  // Dynamic live priority areas & meteorological data
  const { data: priorityData, isLoading: isLoadingAreas } = usePriorityAreas()
  const [weatherData, setWeatherData] = useState<any>(null)

  useEffect(() => {
    apiRequest('/hotspots/weather-ispu')
      .then((res) => setWeatherData(res))
      .catch((err) => console.warn('Weather live fetch fallback:', err))
  }, [])

  const totalHotspots = priorityData?.areas.reduce((acc, a) => acc + a.hotspotCount, 0) ?? 4
  const ispuValue = weatherData?.ispu_value ?? 58
  const ispuCategory = weatherData?.ispu_category ?? 'Sedang'
  const tempText = weatherData?.temperature_c ? `${weatherData.temperature_c}°C` : '31°C'
  const weatherText = weatherData?.weather_desc ?? 'Cerah Berawan'
  const humidityText = weatherData?.humidity_percent ? `Kelembaban ${weatherData.humidity_percent}%` : 'Kelembaban 68%'
  const topAreas = (priorityData?.areas || []).slice(0, 3)
  const topCluster = topAreas[0]
  const lastSyncTime = topCluster?.lastUpdatedText ?? 'Baru saja • Satelit NASA FIRMS'

  // Fetch volunteer assignments if RELAWAN
  useEffect(() => {
    if (isAuthenticated && (isVolunteer || isAdmin)) {
      const fetchMyTasks = async () => {
        try {
          const tasks = await apiRequest('/assignments/my-tasks')
          const ongoing = (tasks || []).find((t: ActiveTask) =>
            ['ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'ON_SITE'].includes(t.status)
          )
          setActiveTask(ongoing || null)
        } catch (err) {
          console.error('Gagal memuat tugas aktif:', err)
        }
      }
      fetchMyTasks()
    }
  }, [isAuthenticated, isVolunteer, isAdmin])

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

        {/* LOKASI DAN STATUS WILAYAH */}
        <LocationStatusCard
          displayLocation={displayLocation}
          displayProvince={displayProvince}
          isPerhatianKhusus={Boolean(priorityData?.currentAreaInside)}
          ispuValue={ispuValue}
          ispuCategory={ispuCategory}
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
            lastSyncTime={lastSyncTime}
            onOpenEvacuationModal={() => setIsEvacuationModalOpen(true)}
            onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
          />
        )}

        {/* PETA INTELIJEN SEBARAN TITIK PANAS BANNER */}
        <MapIntelBanner
          totalAreas={priorityData?.totalAreasFound ?? 10}
          displayLocation={displayLocation}
        />
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
