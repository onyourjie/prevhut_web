import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import {
  ShieldCheck,
  ShieldAlert,
  Phone,
  MapPin,
  Truck,
  CheckCircle2,
  Navigation,
  Flame,
  Sun,
  Wind,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  Loader2,
  Compass,
  Users,
  Camera,
  RefreshCw,
} from 'lucide-react'
import { useVolunteerAssignments } from '@/components/assignments/useVolunteerAssignments'
import { RejectTaskModal } from '@/components/assignments/RejectTaskModal'
import { VerifyTaskModal } from '@/components/assignments/VerifyTaskModal'
import type { PriorityArea } from '@/features/hotspots/schemas'
import type { Assignment } from '@/components/assignments/assignment.types'
import { formatTimeAgo, cn } from '@/lib/utils'

interface VolunteerDashboardProps {
  userLocation: {
    province?: string
    regency?: string
    district?: string
    coords?: { lat: number; lng: number }
  }
  weatherText: string
  tempText: string
  humidityText: string
  totalHotspots: number | null
  priorityAreas: PriorityArea[]
  isLoadingAreas: boolean
  isSample?: boolean
  lastSyncTime: string
  weatherData?: any
}

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371.0
  const dLat = ((lat2 - lat1) * Math.PI) / 180.0
  const dLon = ((lon2 - lon1) * Math.PI) / 180.0
  const a =
    Math.sin(dLat / 2.0) ** 2 +
    Math.cos((lat1 * Math.PI) / 180.0) *
      Math.cos((lat2 * Math.PI) / 180.0) *
      Math.sin(dLon / 2.0) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c * 10) / 10
}

export function VolunteerDashboard({
  userLocation,
  weatherText,
  tempText,
  humidityText,
  totalHotspots,
  priorityAreas,
  isLoadingAreas,
  isSample,
  lastSyncTime,
}: VolunteerDashboardProps) {
  const {
    activeAssignments,
    isLoading: isLoadingAssignments,
    updatingTaskId,
    isAvailable,
    isTogglingAvailability,
    handleToggleAvailability,
    handleUpdateStatus,
    rejectingTask,
    setRejectingTask,
    rejectionReason,
    setRejectionReason,
    isSubmittingReject,
    handleSubmitReject,
    verifyingTask,
    setVerifyingTask,
    verificationPhoto,
    setVerificationPhoto,
    verificationLat,
    setVerificationLat,
    verificationLon,
    setVerificationLon,
    isDetectingGps,
    completionNotes,
    setCompletionNotes,
    isSubmittingVerify,
    isUploadingPhoto,
    handleSubmitVerify,
    handleDetectGps,
    handlePhotoUpload,
  } = useVolunteerAssignments()

  // Prioritaskan tugas aktif: ASSIGNED (butuh respon) -> ON_SITE -> ON_THE_WAY -> ACCEPTED
  const prioritizedActiveTasks = useMemo(() => {
    const order: Record<string, number> = {
      ASSIGNED: 1,
      ON_SITE: 2,
      ON_THE_WAY: 3,
      ACCEPTED: 4,
    }
    return [...activeAssignments].sort((a, b) => {
      const rankA = order[a.status] || 99
      const rankB = order[b.status] || 99
      return rankA - rankB
    })
  }, [activeAssignments])

  const primaryTask: Assignment | undefined = prioritizedActiveTasks[0]
  const otherTasksCount = prioritizedActiveTasks.length - 1

  // Hitung jarak klaster satelit terdekat dari koordinat relawan
  const nearestClusterInfo = useMemo(() => {
    if (!userLocation.coords || !priorityAreas || priorityAreas.length === 0) {
      return null
    }
    const userLat = userLocation.coords.lat
    const userLng = userLocation.coords.lng

    let minDistance = Infinity
    let nearest: PriorityArea | null = null

    for (const area of priorityAreas) {
      const d = calculateDistanceKm(
        userLat,
        userLng,
        area.coordinates.lat,
        area.coordinates.lng
      )
      if (d < minDistance) {
        minDistance = d
        nearest = area
      }
    }

    if (!nearest) return null
    return {
      area: nearest,
      distanceKm: minDistance,
    }
  }, [userLocation.coords, priorityAreas])

  // Status bahaya kebakaran lokal
  const isDanger = totalHotspots != null && totalHotspots >= 10
  const isWarning = totalHotspots != null && totalHotspots > 0 && totalHotspots < 10

  const isUpdating = primaryTask ? updatingTaskId === primaryTask.id : false

  return (
    <div className="space-y-5">
      {isSample && (
        <p role="status" className="text-xs font-bold text-amber-800">
          Data sampel • Bukan pengamatan terkini
        </p>
      )}

      {/* 1. PAPAN KESIAPSIAGAAN RELAWAN & HOTLINE POSKO */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors',
                isAvailable
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              )}
            >
              {isAvailable ? (
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-slate-500" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'w-2 h-2 rounded-full',
                    isAvailable ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'
                  )}
                />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  {isAvailable ? 'Siaga Bertugas' : 'Mode Istirahat'}
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {isAvailable
                  ? 'Terdaftar aktif menerima instruksi penugasan darurat dari Posko BPBD.'
                  : 'Penugasan darurat baru dialihkan sementara ke relawan lain.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleToggleAvailability}
              disabled={isTogglingAvailability}
              className={cn(
                'px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs disabled:opacity-60',
                isAvailable
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              )}
            >
              {isTogglingAvailability ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : isAvailable ? (
                <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5" />
              )}
              <span>{isAvailable ? 'Ambil Jeda Istirahat' : 'Aktifkan Kesiagaan'}</span>
            </button>

            <a
              href="tel:08115711234"
              className="px-3 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-bold flex items-center gap-1.5 transition"
              title="Hubungi Posko Induk BPBD via Telepon"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Hotline Posko</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. PUSAT MISI TAKTIS LAPANGAN (INTERACTIVE ACTIVE MISSION CARD) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-600" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Operasi Lapangan Anda
            </h3>
          </div>
          <Link
            to="/assignments"
            className="text-xs font-bold text-orange-700 hover:text-orange-800 flex items-center gap-1"
          >
            <span>Semua Penugasan</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoadingAssignments ? (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center flex items-center justify-center gap-2 text-xs text-slate-500">
            <RefreshCw className="w-4 h-4 animate-spin text-orange-600" />
            <span>Memeriksa status penugasan lapangan...</span>
          </div>
        ) : primaryTask ? (
          <div
            className={cn(
              'p-4 sm:p-5 rounded-2xl bg-white border shadow-xs space-y-4',
              primaryTask.status === 'ASSIGNED'
                ? 'border-l-4 border-l-red-600 border-red-200 bg-red-50/20'
                : primaryTask.status === 'ON_SITE'
                ? 'border-l-4 border-l-purple-600 border-slate-200'
                : 'border-l-4 border-l-orange-500 border-slate-200'
            )}
          >
            {/* Status Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'w-2.5 h-2.5 rounded-full',
                    primaryTask.status === 'ASSIGNED'
                      ? 'bg-red-600 animate-ping'
                      : primaryTask.status === 'ON_SITE'
                      ? 'bg-purple-600 animate-pulse'
                      : 'bg-orange-500 animate-pulse'
                  )}
                />
                <span
                  className={cn(
                    'px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wide border',
                    primaryTask.status === 'ASSIGNED'
                      ? 'bg-red-100 text-red-800 border-red-300'
                      : primaryTask.status === 'ACCEPTED'
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : primaryTask.status === 'ON_THE_WAY'
                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                      : 'bg-purple-100 text-purple-800 border-purple-300'
                  )}
                >
                  {primaryTask.status === 'ASSIGNED'
                    ? 'Instruksi Baru: Menunggu Konfirmasi'
                    : primaryTask.status === 'ACCEPTED'
                    ? 'Tugas Diterima: Persiapan Berangkat'
                    : primaryTask.status === 'ON_THE_WAY'
                    ? 'Sedang Menuju Lokasi Sasaran'
                    : 'Tiba di Lokasi: Siap Ground Check'}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wide',
                    primaryTask.priorityLevel === 'P1'
                      ? 'bg-red-600 text-white'
                      : primaryTask.priorityLevel === 'P2'
                      ? 'bg-amber-500 text-white'
                      : 'bg-emerald-600 text-white'
                  )}
                >
                  {primaryTask.priorityLevel}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {formatTimeAgo(primaryTask.createdAt)}
                </span>
              </div>
            </div>

            {/* Judul & Alamat Lokasi Sasaran */}
            <div>
              <h4 className="text-base font-black text-slate-900 leading-snug">
                {primaryTask.post?.content ||
                  primaryTask.notes ||
                  'Penugasan Penanganan Titik Api'}
              </h4>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-2">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-800">
                    {primaryTask.post?.address ||
                      primaryTask.clusterCode ||
                      'Lokasi koordinat target'}
                  </span>
                </div>
                {primaryTask.post?.latitude != null && primaryTask.post?.longitude != null && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${primaryTask.post.latitude},${primaryTask.post.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-orange-700 hover:text-orange-800 font-bold hover:underline"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Petunjuk Rute Maps</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Instruksi Khusus dari Posko BPBD */}
            {primaryTask.notes && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-1">
                <span className="font-extrabold text-[11px] text-slate-900 uppercase tracking-wide block">
                  Instruksi Posko BPBD:
                </span>
                <p className="leading-relaxed text-slate-600">
                  {primaryTask.notes}
                </p>
                {primaryTask.admin?.phone && (
                  <div className="pt-1 text-[11px] text-slate-500">
                    Posko Pengirim: {primaryTask.admin.name} (
                    <a
                      href={`tel:${primaryTask.admin.phone}`}
                      className="text-orange-700 font-bold hover:underline"
                    >
                      {primaryTask.admin.phone}
                    </a>
                    )
                  </div>
                )}
              </div>
            )}

            {/* Stepper Progres Aksi Lapangan */}
            <div className="pt-2 border-t border-slate-100">
              <div className="grid grid-cols-4 gap-1 text-center">
                <div className="space-y-1">
                  <div
                    className={cn(
                      'h-1.5 rounded-full',
                      ['ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'ON_SITE', 'COMPLETED'].includes(
                        primaryTask.status
                      )
                        ? 'bg-emerald-500'
                        : 'bg-slate-200'
                    )}
                  />
                  <span className="text-[10px] font-bold text-slate-600 block">
                    Disposisi
                  </span>
                </div>
                <div className="space-y-1">
                  <div
                    className={cn(
                      'h-1.5 rounded-full',
                      ['ACCEPTED', 'ON_THE_WAY', 'ON_SITE', 'COMPLETED'].includes(
                        primaryTask.status
                      )
                        ? 'bg-emerald-500'
                        : 'bg-slate-200'
                    )}
                  />
                  <span className="text-[10px] font-bold text-slate-600 block">
                    Diterima
                  </span>
                </div>
                <div className="space-y-1">
                  <div
                    className={cn(
                      'h-1.5 rounded-full',
                      ['ON_THE_WAY', 'ON_SITE', 'COMPLETED'].includes(primaryTask.status)
                        ? 'bg-emerald-500'
                        : 'bg-slate-200'
                    )}
                  />
                  <span className="text-[10px] font-bold text-slate-600 block">
                    Menuju Lokasi
                  </span>
                </div>
                <div className="space-y-1">
                  <div
                    className={cn(
                      'h-1.5 rounded-full',
                      ['ON_SITE', 'COMPLETED'].includes(primaryTask.status)
                        ? 'bg-emerald-500'
                        : 'bg-slate-200'
                    )}
                  />
                  <span className="text-[10px] font-bold text-slate-600 block">
                    Tiba di Lokasi
                  </span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS (Glove-friendly, high contrast) */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
              {primaryTask.status === 'ASSIGNED' && (
                <>
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus(primaryTask.id, 'ACCEPTED')}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs transition shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    <span>Terima Tugas Lapangan</span>
                  </button>
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => setRejectingTask(primaryTask)}
                    className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 font-bold text-xs transition border border-slate-200 cursor-pointer disabled:opacity-60"
                  >
                    <span>Tolak Tugas</span>
                  </button>
                </>
              )}

              {primaryTask.status === 'ACCEPTED' && (
                <>
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus(primaryTask.id, 'ON_THE_WAY')}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 active:scale-95 text-white font-black text-xs transition shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Truck className="w-4 h-4" />
                    )}
                    <span>Mulai Berangkat (OTW)</span>
                  </button>
                  {primaryTask.post?.latitude != null && primaryTask.post?.longitude != null && (
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${primaryTask.post.latitude},${primaryTask.post.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition border border-slate-200 flex items-center gap-1.5"
                    >
                      <Navigation className="w-3.5 h-3.5 text-orange-600" />
                      <span>Rute Maps</span>
                    </a>
                  )}
                </>
              )}

              {primaryTask.status === 'ON_THE_WAY' && (
                <>
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus(primaryTask.id, 'ON_SITE')}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-black text-xs transition shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <MapPin className="w-4 h-4" />
                    )}
                    <span>Saya Sudah Tiba di Lokasi</span>
                  </button>
                  {primaryTask.post?.latitude != null && primaryTask.post?.longitude != null && (
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${primaryTask.post.latitude},${primaryTask.post.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition border border-slate-200 flex items-center gap-1"
                    >
                      <Navigation className="w-3.5 h-3.5 text-orange-600" />
                      <span>Rute</span>
                    </a>
                  )}
                </>
              )}

              {primaryTask.status === 'ON_SITE' && (
                <>
                  <button
                    type="button"
                    onClick={() => setVerifyingTask(primaryTask)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Kirim Verifikasi Lapangan (Foto + GPS)</span>
                  </button>
                  <a
                    href="tel:08115711234"
                    className="py-2.5 px-3.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition border border-red-200 flex items-center gap-1.5"
                    title="Minta Bantuan Tim Tambahan ke Posko"
                  >
                    <Phone className="w-3.5 h-3.5 text-red-600" />
                    <span>Minta Dukungan</span>
                  </a>
                </>
              )}
            </div>

            {/* Notifikasi tugas tambahan lain jika ada */}
            {otherTasksCount > 0 && (
              <div className="pt-2 text-[11px] text-slate-500 text-center border-t border-slate-100">
                Terdapat <span className="font-bold text-slate-800">{otherTasksCount}</span> penugasan
                lain dalam antrean Anda.{' '}
                <Link to="/assignments" className="text-orange-700 font-bold hover:underline">
                  Buka Lembar Penugasan
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-xs text-emerald-950">
                  Semua Penugasan Selesai
                </h4>
                <p className="text-[11px] text-emerald-700 mt-0.5 leading-relaxed">
                  Tidak ada instruksi tugas darurat baru saat ini. Pantau radar titik panas terdekat dan
                  jaga kesiapsiagaan peralatan.
                </p>
              </div>
            </div>
            <Link
              to="/assignments"
              className="text-xs font-bold text-emerald-800 hover:text-emerald-900 shrink-0 flex items-center gap-1"
            >
              <span>Riwayat</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* 3. SITUASI LAPANGAN & BAHAYA KARHUTLA (SITUATIONAL AWARENESS) */}
      <div className="space-y-3">
        {/* LOKASI MONITORING STRIP */}
        <Link
          to="/map"
          className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-orange-300 shadow-xs flex items-center justify-between transition group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="font-black text-xs text-slate-900 group-hover:text-orange-700 transition">
                {userLocation.regency || 'Kabupaten Sintang'}, {userLocation.province || 'Kalimantan Barat'}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Pembaruan satelit NASA FIRMS • Terakhir sinkron: {lastSyncTime}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition" />
        </Link>

        {/* 3-KOLOM INDIKATOR BAHAYA */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Titik Panas */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Hotspot Satelit
              </span>
              <Flame
                className={cn(
                  'w-4 h-4',
                  isDanger
                    ? 'text-red-600'
                    : isWarning
                    ? 'text-amber-500'
                    : 'text-emerald-500'
                )}
              />
            </div>
            <div className="text-xl font-black text-slate-900">
              {totalHotspots != null ? `${totalHotspots} Titik` : '0 Titik'}
            </div>
            <div
              className={cn(
                'text-[11px] font-bold',
                isDanger
                  ? 'text-red-700'
                  : isWarning
                  ? 'text-amber-700'
                  : 'text-emerald-700'
              )}
            >
              {isDanger
                ? 'Siaga Tinggi Kebakaran'
                : isWarning
                ? 'Waspada Titik Panas'
                : 'Wilayah Terkendali'}
            </div>
          </div>

          {/* Cuaca & Suhu */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Suhu Lapangan
              </span>
              <Sun className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-xl font-black text-slate-900">{tempText}</div>
            <div className="text-[11px] text-slate-600 font-medium truncate">
              {weatherText}
            </div>
          </div>

          {/* Kelembaban Udara */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Kelembaban Udara
              </span>
              <Wind className="w-4 h-4 text-sky-500" />
            </div>
            <div className="text-xl font-black text-slate-900">
              {humidityText.replace(/^Kelembaban\s+/i, '')}
            </div>
            <div className="text-[11px] text-slate-600 font-medium">
              Indikator kekeringan lahan
            </div>
          </div>
        </div>

        {/* PROXIMITY CALLOUT JIKA ADA KLASTER TERDEKAT */}
        {nearestClusterInfo && (
          <div className="p-3 rounded-xl bg-orange-50/80 border border-orange-200/90 flex items-center justify-between text-xs text-orange-950">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-orange-700 shrink-0" />
              <div>
                <span className="font-bold">Klaster Terdekat: </span>
                <span className="font-extrabold">{nearestClusterInfo.area.name}</span>
                <span className="text-orange-700 font-medium ml-1">
                  (±{nearestClusterInfo.distanceKm} km dari posisi GPS Anda)
                </span>
              </div>
            </div>
            <Link
              to="/map"
              className="text-xs font-bold text-orange-800 hover:text-orange-950 flex items-center gap-0.5 shrink-0 ml-2"
            >
              <span>Peta</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* 4. RADAR TITIK PANAS PRIORITAS SATELIT */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Prioritas Area Pantau Satelit
            </h3>
          </div>
          <Link
            to="/map"
            className="text-xs font-bold text-orange-700 hover:text-orange-800 flex items-center gap-1"
          >
            <span>Buka Peta Operasi</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoadingAreas ? (
          <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-orange-600" />
            <span>Sinkronisasi area prioritas satelit...</span>
          </div>
        ) : priorityAreas.length > 0 ? (
          <div className="space-y-2.5">
            {priorityAreas.slice(0, 3).map((area) => (
              <div
                key={area.id}
                className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-red-300 shadow-2xs transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'w-2.5 h-2.5 rounded-full',
                        area.priority === 'P1'
                          ? 'bg-red-600'
                          : area.priority === 'P2'
                          ? 'bg-amber-500'
                          : 'bg-emerald-600'
                      )}
                    />
                    <h4 className="font-black text-xs text-slate-900">{area.name}</h4>
                  </div>
                  <span
                    className={cn(
                      'px-2.5 py-0.5 rounded-full text-[10px] font-black border',
                      area.priority === 'P1'
                        ? 'bg-red-100 text-red-800 border-red-200'
                        : area.priority === 'P2'
                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    )}
                  >
                    {area.priority} • {area.priorityLabel}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500">
                  {[area.district, area.regency, area.province].filter(Boolean).join(', ')}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900">
                      {area.hotspotCount != null
                        ? `${area.hotspotCount} hotspot`
                        : 'Data belum sinkron'}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[11px] text-slate-500">
                      Skor Risiko {area.score}
                    </span>
                  </div>

                  <Link
                    to="/map"
                    className="text-xs font-bold text-orange-700 hover:text-orange-800 flex items-center gap-1"
                  >
                    <span>Cek Polygon</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500">
            Tidak ada area prioritas titik panas aktif di wilayah ini.
          </div>
        )}
      </div>

      {/* 5. PUSAT AKSI TAKTIS LAPANGAN (QUICK COMMAND HUB) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <Link to="/assignments" className="block group">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-500 hover:shadow-xs transition space-y-1.5 h-full">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold group-hover:scale-105 transition">
              <Truck className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-black text-slate-900 group-hover:text-emerald-700 transition">
              Lembar Penugasan
            </h4>
            <p className="text-[11px] text-slate-500 leading-snug">
              Daftar penugasan tim, riwayat verifikasi pemadaman, dan status respon.
            </p>
          </div>
        </Link>

        <Link to="/map" className="block group">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-orange-500 hover:shadow-xs transition space-y-1.5 h-full">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center font-bold group-hover:scale-105 transition">
              <Compass className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-black text-slate-900 group-hover:text-orange-700 transition">
              Peta Operasi Spasial
            </h4>
            <p className="text-[11px] text-slate-500 leading-snug">
              Pantau polygon risiko, clustering DBSCAN titik panas, dan arah angin.
            </p>
          </div>
        </Link>

        <Link to="/community" search={{ category: 'DARURAT' }} className="block group">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-red-500 hover:shadow-xs transition space-y-1.5 h-full">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-700 flex items-center justify-center font-bold group-hover:scale-105 transition">
              <Users className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-black text-slate-900 group-hover:text-red-700 transition">
              Aduan Darurat Warga
            </h4>
            <p className="text-[11px] text-slate-500 leading-snug">
              Informasi langsung titik api warga untuk verifikasi lapangan cepat.
            </p>
          </div>
        </Link>
      </div>

      {/* 6. MODALS LAPANGAN */}
      {rejectingTask && (
        <RejectTaskModal
          task={rejectingTask}
          reason={rejectionReason}
          isSubmitting={isSubmittingReject}
          onReasonChange={setRejectionReason}
          onClose={() => {
            setRejectingTask(null)
            setRejectionReason('')
          }}
          onSubmit={handleSubmitReject}
        />
      )}

      {verifyingTask && (
        <VerifyTaskModal
          task={verifyingTask}
          photo={verificationPhoto}
          lat={verificationLat}
          lon={verificationLon}
          notes={completionNotes}
          isUploading={isUploadingPhoto}
          isDetectingGps={isDetectingGps}
          isSubmitting={isSubmittingVerify}
          onPhotoChange={setVerificationPhoto}
          onLatChange={setVerificationLat}
          onLonChange={setVerificationLon}
          onNotesChange={setCompletionNotes}
          onDetectGps={handleDetectGps}
          onFileUpload={handlePhotoUpload}
          onClose={() => {
            setVerifyingTask(null)
            setVerificationPhoto('')
            setCompletionNotes('')
          }}
          onSubmit={handleSubmitVerify}
        />
      )}
    </div>
  )
}
