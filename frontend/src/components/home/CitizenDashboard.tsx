import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  MapPin,
  Camera,
  ArrowRight,
  Wind,
  Phone,
  Truck,
  Ambulance,
  LifeBuoy,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react'
import type { PriorityArea } from '@/features/hotspots/schemas'
import type { PostItem } from '@/components/community/post-card.types'
import { apiRequest } from '@/lib/api'
import { cn, formatDateTimeIndo } from '@/lib/utils'

interface CitizenDashboardProps {
  userLocation: {
    province: string
    regency: string
    district?: string
    coords?: { lat: number; lng: number }
  }
  weatherText: string
  tempText: string
  humidityText: string
  totalHotspots: number | null
  priorityAreas: PriorityArea[]
  isSample?: boolean
  lastSyncTime: string
  observedAt?: string
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

export function CitizenDashboard({
  userLocation,
  weatherText,
  tempText,
  humidityText,
  totalHotspots,
  priorityAreas,
  isSample,
  lastSyncTime,
  observedAt,
}: CitizenDashboardProps) {
  // Query 2 laporan warga terkini dari kabupaten yang sama
  const { data: recentPosts = [] } = useQuery<PostItem[]>({
    queryKey: ['citizen-feed-snippet', userLocation.regency],
    queryFn: async () => {
      const regencyClean = userLocation.regency.replace(/^(kabupaten|kota)\s+/i, '').trim()
      const url = `/community/posts?kabupaten=${encodeURIComponent(regencyClean)}`
      const res = await apiRequest<PostItem[]>(url)
      return (res || []).slice(0, 2)
    },
  })

  // Perhitungan status ancaman bahaya
  const isDanger = (totalHotspots ?? 0) >= 10
  const isWarning = (totalHotspots ?? 0) > 0 && (totalHotspots ?? 0) < 10

  // Perkiraan ISPU jika data backend belum spesifik
  const ispuValue = useMemo(() => {
    if (totalHotspots == null || totalHotspots === 0) return 38
    if (totalHotspots < 5) return 65
    if (totalHotspots < 15) return 112
    return 165
  }, [totalHotspots])

  const ispuCategory = useMemo(() => {
    if (ispuValue <= 50) {
      return {
        label: 'Baik',
        textColor: 'text-emerald-700',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        barColor: 'bg-emerald-500',
        advice: 'Kualitas udara aman untuk beraktivitas normal di luar ruangan.',
      }
    }
    if (ispuValue <= 100) {
      return {
        label: 'Sedang',
        textColor: 'text-amber-800',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        barColor: 'bg-amber-500',
        advice: 'Udara masih wajar. Kelompok rentan disarankan mengenakan masker saat keluar.',
      }
    }
    return {
      label: 'Tidak Sehat',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      barColor: 'bg-red-500',
      advice: 'Tutup ventilasi rumah dan gunakan masker N95 jika tercium kepulan asap gambut.',
    }
  }, [ispuValue])

  // Urutkan klaster terdekat jika koordinat GPS pengguna ada
  const nearbyClusters = useMemo(() => {
    if (!priorityAreas || priorityAreas.length === 0) return []

    const userCoords = userLocation.coords
    const mapped = priorityAreas.map((area) => {
      const distance = userCoords
        ? calculateDistanceKm(
            userCoords.lat,
            userCoords.lng,
            area.coordinates.lat,
            area.coordinates.lng
          )
        : null
      return { ...area, distance }
    })

    if (userCoords) {
      mapped.sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999))
    }
    return mapped.slice(0, 3)
  }, [priorityAreas, userLocation.coords])

  return (
    <div className="space-y-6">
      {/* BAR LOKASI PEMANTAUAN (RINGKAS & BERSIH) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-neutral-900">
                {userLocation.district ? `${userLocation.district}, ` : ''}{userLocation.regency}
              </span>
              <span className="text-xs text-neutral-400 font-medium">({userLocation.province})</span>
            </div>
            <p className="text-xs text-neutral-500">
              Radius pemantauan satelit NASA FIRMS VIIRS 375m & stasiun cuaca
            </p>
          </div>
        </div>

        <Link
          to="/map"
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 hover:text-neutral-900 transition shrink-0"
        >
          <span>Buka Radar Peta</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* GRID ASIMETRIS UTAMA (7 KOLOM KIRI : 5 KOLOM KANAN) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* KOLOM KIRI: SITUASI LINGKUNGAN & KABAR LAPANGAN (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          {/* PAPAN STATUS BAHAYA & KUALITAS UDARA (TERPADU) */}
          <div
            className={cn(
              'p-5 sm:p-6 rounded-3xl border shadow-xs transition-colors',
              isDanger
                ? 'bg-red-50/70 border-red-200'
                : isWarning
                ? 'bg-amber-50/60 border-amber-200'
                : 'bg-emerald-50/40 border-emerald-200/70'
            )}
          >
            {/* Header Status Bahaya */}
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-neutral-200/60">
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    'w-3 h-3 rounded-full shrink-0',
                    isDanger
                      ? 'bg-red-600 animate-ping'
                      : isWarning
                      ? 'bg-amber-500 animate-pulse'
                      : 'bg-emerald-500'
                  )}
                />
                <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-600">
                  Status Wilayah Anda
                </span>
                <span
                  className={cn(
                    'font-black text-sm',
                    isDanger
                      ? 'text-red-700'
                      : isWarning
                      ? 'text-amber-800'
                      : 'text-emerald-700'
                  )}
                >
                  {isDanger
                    ? 'Siaga Tinggi Kebakaran'
                    : isWarning
                    ? 'Waspada Titik Panas'
                    : 'Aman & Terkendali'}
                </span>
              </div>

              {isSample && (
                <span className="text-[11px] font-semibold text-neutral-500">
                  Mode Sampel
                </span>
              )}
            </div>

            {/* Strip Angka Metrik Utama */}
            <div className="grid grid-cols-3 gap-3 py-4">
              <div>
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide block">
                  Titik Panas
                </span>
                <span className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                  {totalHotspots ?? 0}
                </span>
                <span className="text-[11px] text-neutral-500 block mt-0.5">
                  Satelit 24 Jam
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide block">
                  Indeks ISPU
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                    {ispuValue}
                  </span>
                  <span className={cn('text-xs font-extrabold', ispuCategory.textColor)}>
                    {ispuCategory.label}
                  </span>
                </div>
                <span className="text-[11px] text-neutral-500 block mt-0.5">
                  Partikulat PM2.5
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide block">
                  Suhu & Cuaca
                </span>
                <span className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight truncate block">
                  {tempText}
                </span>
                <span className="text-[11px] text-neutral-500 block mt-0.5 truncate">
                  {weatherText} • {humidityText}
                </span>
              </div>
            </div>

            {/* Rekomendasi Kesehatan ISPU Bar */}
            <div className="pt-3 border-t border-neutral-200/60 flex items-start gap-2.5">
              <Wind className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs text-neutral-700 leading-relaxed">
                <span className="font-bold text-neutral-900">Anjuran Hari Ini: </span>
                {ispuCategory.advice}
              </div>
            </div>
          </div>

          {/* RADAR KLASTER TITIK API TERDEKAT */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-neutral-900 tracking-tight">
                  Klaster Pantau Terdekat
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Hasil pengelompokan spasial satelit di sekitar area kecamatan Anda
                </p>
              </div>
              <Link
                to="/map"
                className="text-xs font-bold text-brand-700 hover:text-brand-800 transition flex items-center gap-1"
              >
                <span>Lihat Seluruhnya</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {nearbyClusters.length === 0 ? (
              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100 text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-neutral-800">
                  Tidak Ada Klaster Titik Api Aktif
                </p>
                <p className="text-[11px] text-neutral-500">
                  Belum ada deteksi titik panas signifikan di kecamatan sekitar dalam 24 jam terakhir.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {nearbyClusters.map((cluster) => (
                  <div
                    key={cluster.id}
                    className="p-3.5 rounded-2xl border border-neutral-200/80 hover:border-neutral-300 hover:shadow-2xs transition flex items-center justify-between gap-3 bg-white"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-black text-xs',
                          cluster.priority === 'P1'
                            ? 'bg-red-100 text-red-700'
                            : cluster.priority === 'P2'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-neutral-100 text-neutral-700'
                        )}
                      >
                        {cluster.priority}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-neutral-900 truncate">
                            {cluster.district || cluster.name}
                          </span>
                          {cluster.distance != null && (
                            <span className="text-[11px] text-neutral-500 font-medium shrink-0">
                              • {cluster.distance} km
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                          {cluster.hotspotCount ?? 0} titik api • Skor Risiko: {Math.round(cluster.score)}
                        </p>
                      </div>
                    </div>

                    <Link
                      to="/map"
                      search={{ district: cluster.district }}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 hover:text-neutral-900 transition shrink-0"
                    >
                      Peta
                    </Link>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 text-[11px] text-neutral-400 flex items-center justify-between border-t border-neutral-100">
              <span>Observasi satelit: {lastSyncTime}</span>
              <span>Pembaruan cuaca: {observedAt || 'Hari ini'}</span>
            </div>
          </div>

          {/* KILAS KABAR WARGA SEKITAR */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-neutral-900 tracking-tight">
                  Kabar Warga Sekitar
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Laporan situasi visual dan konfirmasi warga di {userLocation.regency}
                </p>
              </div>
              <Link
                to="/community"
                className="text-xs font-bold text-brand-700 hover:text-brand-800 transition flex items-center gap-1"
              >
                <span>Buka Komunitas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentPosts.length === 0 ? (
              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-100 text-center">
                <p className="text-xs font-bold text-neutral-700">
                  Belum ada laporan warga terbaru di {userLocation.regency}
                </p>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Jadilah yang pertama mengirim informasi situasi lapangan jika melihat kepulan asap.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    to="/community/$postId"
                    params={{ postId: post.id }}
                    className="p-3.5 rounded-2xl border border-neutral-200 hover:border-neutral-300 hover:shadow-2xs transition flex flex-col justify-between gap-3 group bg-neutral-50/40"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-neutral-500">
                        <span className="font-bold text-neutral-900 truncate">
                          {post.author.name}
                        </span>
                        <span className="shrink-0">{formatDateTimeIndo(post.createdAt)}</span>
                      </div>
                      <p className="text-xs text-neutral-700 line-clamp-2 leading-relaxed">
                        {post.content}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-neutral-200/60">
                      <span className="text-neutral-500 truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                        <span className="truncate">{post.kecamatan || post.address}</span>
                      </span>
                      <span className="font-bold text-brand-700 group-hover:translate-x-0.5 transition shrink-0">
                        Detail →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* KOLOM KANAN: AKSI CEPAT & MITIGASI WARGA (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          {/* AKSI UTAMA: LAPOR TITIK API */}
          <div className="p-6 rounded-3xl bg-neutral-900 text-white shadow-md relative overflow-hidden space-y-4">
            <div className="space-y-1.5 relative z-10">
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-400">
                Aksi Cepat Warga
              </span>
              <h3 className="text-base sm:text-lg font-black tracking-tight leading-snug">
                Lihat Kepulan Asap atau Titik Api di Lapangan?
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Unggah foto langsung kamera dengan deteksi koordinat GPS otomatis untuk percepatan verifikasi regu pemadam posko BPBD.
              </p>
            </div>

            <Link
              to="/community/create"
              className="w-full py-3 px-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98 relative z-10"
            >
              <Camera className="w-4 h-4" />
              <span>Buka Kamera & Lapor Sekarang</span>
            </Link>
          </div>

          {/* SPEED DIAL BANTUAN DARURAT (LANGSUNG TEL:) */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-neutral-900 tracking-tight">
                  Panggilan Darurat Cepat
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Bebas pulsa • Tekan langsung untuk berbicara dengan posko siaga
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <a
                href="tel:113"
                className="p-3 rounded-2xl border border-neutral-200 hover:border-red-400 hover:bg-red-50/40 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-neutral-900 group-hover:text-red-700 transition">
                      113 • Damkar
                    </h4>
                    <p className="text-[11px] text-neutral-500">Pemadaman kebakaran hutan & lahan</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-neutral-100 group-hover:bg-red-100 text-neutral-600 group-hover:text-red-700 flex items-center justify-center transition">
                  <Phone className="w-3.5 h-3.5" />
                </div>
              </a>

              <a
                href="tel:119"
                className="p-3 rounded-2xl border border-neutral-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Ambulance className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-neutral-900 group-hover:text-emerald-700 transition">
                      119 • Medis Darurat
                    </h4>
                    <p className="text-[11px] text-neutral-500">Sesak napas ISPA & korban luka</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-neutral-100 group-hover:bg-emerald-100 text-neutral-600 group-hover:text-emerald-700 flex items-center justify-center transition">
                  <Phone className="w-3.5 h-3.5" />
                </div>
              </a>

              <a
                href="tel:115"
                className="p-3 rounded-2xl border border-neutral-200 hover:border-orange-400 hover:bg-orange-50/40 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
                    <LifeBuoy className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-neutral-900 group-hover:text-orange-700 transition">
                      115 • Basarnas (SAR)
                    </h4>
                    <p className="text-[11px] text-neutral-500">Pencarian & pertolongan evakuasi</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-neutral-100 group-hover:bg-orange-100 text-neutral-600 group-hover:text-orange-700 flex items-center justify-center transition">
                  <Phone className="w-3.5 h-3.5" />
                </div>
              </a>
            </div>

            <Link
              to="/emergency"
              className="w-full py-2.5 px-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-bold text-xs transition flex items-center justify-center gap-1.5"
            >
              <span>Panduan Lengkap Evakuasi & Kompas Angin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* REKOMENDASI TINDAKAN MITIGASI MANDIRI */}
          <div className="p-5 sm:p-6 rounded-3xl bg-neutral-50 border border-neutral-200/80 space-y-3.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-700">
              Mitigasi Mandiri Saat Ini
            </h3>

            <div className="space-y-2.5 text-xs text-neutral-600">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-md bg-white border border-neutral-200 text-neutral-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <p className="leading-relaxed">
                  <strong className="text-neutral-900 font-bold">Jangan Membakar Lahan: </strong>
                  Hindari pembakaran serasah atau sampah pekarangan di siang hari saat kelembaban udara rendah.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-md bg-white border border-neutral-200 text-neutral-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <p className="leading-relaxed">
                  <strong className="text-neutral-900 font-bold">Siapkan Penampung Air: </strong>
                  Pastikan cadangan air pekarangan mencukupi untuk pembasahan dini jika semak di batas pekarangan mulai kering.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-md bg-white border border-neutral-200 text-neutral-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <p className="leading-relaxed">
                  <strong className="text-neutral-900 font-bold">Amankan Dokumen Penting: </strong>
                  Simpan surat tanah, identitas, dan obat pribadi dalam tas yang mudah dijangkau jika terjadi eskalasi darurat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

