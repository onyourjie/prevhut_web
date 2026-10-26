import { useState, useMemo, useEffect } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ClipboardList,
  MapPin,
  AlertTriangle,
  Phone,
  Truck,
  ChevronDown,
  ChevronUp,
  Search,
  Flame,
  Shield,
  RefreshCw,
  Camera,
  Navigation,
  ArrowRight,
} from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'
import { useAuthStore } from '@/store/auth.store'
import { apiRequest } from '@/lib/api'
import { formatTimeAgo, cn } from '@/lib/utils'
import { CreateAssignmentModal } from '@/components/assignments/CreateAssignmentModal'
import { MediaLightboxModal } from '@/components/community/media-lightbox-modal'

export const Route = createFileRoute('/reports')({
  component: ReportsPage,
})

export interface IncidentPost {
  id: string
  content: string
  imageUrl?: string
  address: string
  latitude?: number
  longitude?: number
  isLiveCamera?: boolean
  createdAt: string
  status: string
  author?: {
    id: string
    name: string
    phone?: string
    role: string
    avatarUrl?: string
  }
}

export interface IncidentGroup {
  key: string
  clusterCode?: string | null
  title: string
  address: string
  province: string
  kabupaten: string
  kecamatan: string
  latitude?: number
  longitude?: number
  status: 'MENUNGGU_VERIFIKASI' | 'DALAM_PENANGANAN' | 'SELESAI'
  totalReports: number
  posts: IncidentPost[]
  assignment?: any
  isAssignedToMe?: boolean
  isInMyKabupaten?: boolean
  latestCreatedAt: string
}

function ReportsPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const queryClient = useQueryClient()

  // Redirect non-admin users
  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/login' })
    } else if (user?.role !== 'ADMIN') {
      if (user?.role === 'RELAWAN') {
        navigate({ to: '/assignments' })
      } else {
        navigate({ to: '/' })
      }
    }
  }, [isAuthenticated, user?.role, navigate])

  // Filters state
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')
  const [selectedKabupaten, setSelectedKabupaten] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  // Expanded cards
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({})

  // Modals state
  const [assignIncident, setAssignIncident] = useState<IncidentGroup | null>(null)
  const [lightboxMediaUrl, setLightboxMediaUrl] = useState<string | null>(null)

  // Fetch incidents (enabled only for ADMIN)
  const { data: incidents = [], isLoading, refetch } = useQuery<IncidentGroup[]>({
    queryKey: ['incidents-list', selectedKabupaten, selectedStatus, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (selectedKabupaten !== 'ALL') params.set('kabupaten', selectedKabupaten)
      if (selectedStatus !== 'ALL') params.set('status', selectedStatus)
      if (searchQuery.trim()) params.set('search', searchQuery.trim())
      return await apiRequest<IncidentGroup[]>(`/community/incidents?${params.toString()}`)
    },
    enabled: isAuthenticated && user?.role === 'ADMIN',
  })

  // Unique kabupatens from loaded incidents
  const availableKabupatens = useMemo(() => {
    const set = new Set<string>()
    incidents.forEach((g) => {
      if (g.kabupaten) set.add(g.kabupaten)
    })
    return Array.from(set).sort()
  }, [incidents])

  const filteredIncidents = incidents

  // Summary counts
  const totalCount = incidents.length
  const pendingCount = incidents.filter((g) => g.status === 'MENUNGGU_VERIFIKASI').length
  const inProgressCount = incidents.filter((g) => g.status === 'DALAM_PENANGANAN').length
  const completedCount = incidents.filter((g) => g.status === 'SELESAI').length

  const toggleExpand = (key: string) => {
    setExpandedKeys((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // Fallback access check
  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <AppLayout title="Akses Terbatas">
        <div className="py-20 text-center max-w-sm mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-neutral-900">
              Halaman Khusus Admin Posko
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Halaman Manajemen Laporan & Insiden Terpadu hanya dapat diakses oleh akun Admin Posko BPBD. Relawan lapangan dapat melihat penugasan pemadaman melalui menu Operasi Relawan.
            </p>
          </div>
          <Link
            to={user?.role === 'RELAWAN' ? '/assignments' : '/'}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold"
          >
            <span>{user?.role === 'RELAWAN' ? 'Buka Operasi Relawan' : 'Kembali ke Beranda'}</span>
          </Link>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout
      title="Manajemen Laporan & Insiden"
      subtitle="Konsolidasi laporan warga per titik lokasi untuk disposisi tim pemadaman"
    >
      <div className="max-w-4xl mx-auto space-y-5 pb-28 text-left">
        {/* Header Hero Banner */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-800 to-brand-950 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border bg-amber-400 text-neutral-950 border-amber-300">
                Posko BPBD (Admin)
              </span>
              <span className="text-neutral-400 text-xs">•</span>
              <span className="text-xs text-neutral-300 font-semibold">
                Sistem Insiden Karhutla
              </span>
            </div>
            <h1 className="text-lg sm:xl font-extrabold tracking-tight">
              Pusat Laporan & Insiden Karhutla
            </h1>
            <p className="text-xs text-neutral-300 max-w-xl leading-relaxed">
              Laporan darurat dari warga di area atau desa yang sama dikelompokkan ke dalam satu insiden. Menugaskan relawan ke suatu insiden otomatis memperbarui seluruh laporan warga terkait.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={() => refetch()}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition text-xs font-bold flex items-center gap-1.5 cursor-pointer backdrop-blur-xs"
              title="Perbarui Data"
            >
              <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
              <span className="hidden sm:inline">Segarkan</span>
            </button>
          </div>
        </div>

        {/* Metric Overview Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
              Total Insiden Titik Api
            </span>
            <span className="text-2xl font-black text-neutral-900 block">{totalCount}</span>
            <span className="text-[10px] text-neutral-500">Kelompok titik pantau</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/90 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
              Menunggu Disposisi
            </span>
            <span className="text-2xl font-black text-amber-900 block">{pendingCount}</span>
            <span className="text-[10px] text-amber-700 font-medium">Perlu penugasan tim</span>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/90 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
              Sedang Ditangani
            </span>
            <span className="text-2xl font-black text-blue-900 block">{inProgressCount}</span>
            <span className="text-[10px] text-blue-700 font-medium">Tim bergerak di lokasi</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/90 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
              Tuntas / Padam
            </span>
            <span className="text-2xl font-black text-emerald-900 block">{completedCount}</span>
            <span className="text-[10px] text-emerald-700 font-medium">Foto bukti terverifikasi</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-3 shadow-2xs">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama area, desa, kecamatan, atau nama warga..."
                className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
              />
            </div>

            {/* Kabupaten Filter */}
            {availableKabupatens.length > 0 && (
              <div className="w-full sm:w-48 shrink-0">
                <select
                  value={selectedKabupaten}
                  onChange={(e) => setSelectedKabupaten(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                >
                  <option value="ALL">Semua Kabupaten</option>
                  {availableKabupatens.map((kab) => (
                    <option key={kab} value={kab}>
                      {kab}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {(
                [
                  { id: 'ALL', label: 'Semua Status' },
                  { id: 'MENUNGGU_VERIFIKASI', label: 'Menunggu Disposisi' },
                  { id: 'DALAM_PENANGANAN', label: 'Dalam Penanganan' },
                  { id: 'SELESAI', label: 'Selesai Padam' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedStatus(tab.id)}
                  className={cn(
                    'px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer',
                    selectedStatus === tab.id
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Incident Groups Feed */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-neutral-400 gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-brand-600" />
            <span className="text-xs font-semibold">Memuat data kelompok laporan...</span>
          </div>
        ) : filteredIncidents.length === 0 ? (
          <div className="py-16 text-center max-w-sm mx-auto space-y-3 bg-white rounded-3xl border border-neutral-200 p-8 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-neutral-800">
                Tidak Ada Laporan yang Cocok
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                {searchQuery || selectedStatus !== 'ALL'
                  ? 'Coba ganti filter status atau kata kunci pencarian.'
                  : 'Saat ini belum ada laporan darurat warga pada kategori ini.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredIncidents.map((incident) => {
              const isExpanded = expandedKeys[incident.key] ?? false
              const assignment = incident.assignment

              return (
                <article
                  key={incident.key}
                  className={cn(
                    'bg-white rounded-3xl border transition-all overflow-hidden shadow-xs hover:shadow-md flex flex-col',
                    incident.status === 'MENUNGGU_VERIFIKASI'
                      ? 'border-amber-300 ring-1 ring-amber-400/20'
                      : 'border-neutral-200'
                  )}
                >
                  {/* Card Header */}
                  <div className="p-5 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Status Badge */}
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border',
                            incident.status === 'SELESAI'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : incident.status === 'DALAM_PENANGANAN'
                              ? 'bg-blue-100 text-blue-800 border-blue-300'
                              : 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                          )}
                        >
                          <Flame className="w-3.5 h-3.5" />
                          <span>
                            {incident.status === 'SELESAI'
                              ? 'Sudah Padam'
                              : incident.status === 'DALAM_PENANGANAN'
                              ? 'Dalam Penanganan'
                              : 'Menunggu Disposisi'}
                          </span>
                        </span>

                        {/* Total Citizen Reports */}
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold">
                          <Flame className="w-3 h-3 text-rose-600" />
                          <span>{incident.totalReports} Laporan Warga</span>
                        </span>
                      </div>

                      <h3 className="text-base font-black text-neutral-900 leading-tight">
                        {incident.title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs text-neutral-600 pt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span className="truncate">
                          {[incident.kecamatan, incident.kabupaten, incident.province]
                            .filter(Boolean)
                            .join(', ')}
                        </span>
                      </div>
                    </div>

                    {/* Action Quick Link to Map */}
                    <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                      <Link
                        to="/map"
                        search={{ area: incident.clusterCode || incident.title }}
                        className="px-3 py-1.5 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-900 text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <Navigation className="w-3.5 h-3.5 text-orange-700" />
                        <span>Buka di Peta</span>
                      </Link>
                    </div>
                  </div>

                  {/* Photo Collage of Citizen Reports */}
                  <div className="px-5 pt-4">
                    <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Dokumentasi Warga ({incident.totalReports} Foto/Sudut Pandang)</span>
                      <span className="text-neutral-400 font-normal">
                        Terakhir {formatTimeAgo(incident.latestCreatedAt)}
                      </span>
                    </div>

                    <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                      {incident.posts.map((p, idx) => (
                        <div
                          key={p.id}
                          onClick={() => p.imageUrl && setLightboxMediaUrl(p.imageUrl)}
                          className="relative w-28 sm:w-36 h-24 rounded-2xl overflow-hidden border border-neutral-200 shrink-0 bg-neutral-900 group cursor-pointer shadow-2xs"
                        >
                          <img
                            src={p.imageUrl || 'https://images.unsplash.com/photo-1542385151-efd9000785a0?w=800'}
                            alt={`Laporan warga ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2 text-white">
                            <span className="text-[10px] font-bold truncate">
                              {p.author?.name || 'Warga'}
                            </span>
                            <span className="text-[9px] text-neutral-300">
                              {formatTimeAgo(p.createdAt)}
                            </span>
                          </div>
                          {p.isLiveCamera && (
                            <div className="absolute top-1.5 left-1.5 bg-black/60 rounded-md p-1">
                              <Camera className="w-2.5 h-2.5 text-amber-400" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Operational Volunteer Status & Duties Box */}
                  <div className="p-5 pt-3 space-y-3">
                    {/* Status Box */}
                    {assignment ? (
                      <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              assignment.volunteer?.avatarUrl ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
                            }
                            alt={assignment.volunteer?.name}
                            className="w-10 h-10 rounded-xl object-cover border border-neutral-200 shrink-0"
                          />
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black text-neutral-900">
                                {assignment.volunteer?.name}
                              </span>
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                                {assignment.volunteer?.kabupaten || 'Relawan'}
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-600">
                              Status Operasi:{' '}
                              <strong className="text-neutral-900">
                                {assignment.status === 'ASSIGNED'
                                  ? 'Menunggu Konfirmasi Relawan'
                                  : assignment.status === 'ACCEPTED'
                                  ? 'Tugas Diterima (Siap Meluncur)'
                                  : assignment.status === 'ON_THE_WAY'
                                  ? 'Regu Meluncur ke Lokasi'
                                  : assignment.status === 'ON_SITE'
                                  ? 'Di Lokasi Pemadaman'
                                  : assignment.status === 'COMPLETED'
                                  ? 'Pemadaman Selesai Tuntas'
                                  : assignment.status}
                              </strong>
                            </p>
                            {assignment.volunteer?.phone && (
                              <p className="text-[10px] text-neutral-500">
                                Telp: {assignment.volunteer.phone}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                          <span className="text-xs font-bold text-neutral-500 bg-neutral-100 px-3 py-1.5 rounded-xl border border-neutral-200">
                            Regu Aktif
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* If not yet assigned */
                      <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-amber-950 font-black text-xs">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Belum ada regu relawan ditugaskan</span>
                          </div>
                          <p className="text-[11px] text-neutral-600">
                            {incident.totalReports} warga menunggu respon pemadaman di area ini.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setAssignIncident(incident)}
                          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-black transition shadow-sm shadow-brand-500/20 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Tugaskan Relawan ke Area Ini</span>
                        </button>
                      </div>
                    )}

                    {/* Accordion Toggle: Rincian Tiap Laporan Warga */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => toggleExpand(incident.key)}
                        className="w-full py-2 px-3 rounded-xl bg-neutral-50 hover:bg-neutral-100/80 text-neutral-700 text-xs font-bold transition flex items-center justify-between cursor-pointer border border-neutral-200/60"
                      >
                        <div className="flex items-center gap-2">
                          <ClipboardList className="w-3.5 h-3.5 text-neutral-400" />
                          <span>
                            {isExpanded
                              ? 'Tutup rincian pelapor'
                              : `Lihat rincian ${incident.totalReports} pelapor warga & nomor telepon`}
                          </span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-neutral-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-neutral-400" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="mt-3 space-y-2.5 pl-2 border-l-2 border-neutral-200">
                          {incident.posts.map((post, idx) => (
                            <div
                              key={post.id}
                              className="p-3.5 rounded-2xl bg-neutral-50/70 border border-neutral-200 space-y-2 text-left"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <img
                                    src={
                                      post.author?.avatarUrl ||
                                      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80'
                                    }
                                    alt={post.author?.name}
                                    className="w-7 h-7 rounded-full object-cover border border-neutral-200 shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-xs text-neutral-900 truncate">
                                        {post.author?.name || 'Warga'}
                                      </span>
                                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-neutral-200 text-neutral-700 shrink-0">
                                        Pelapor #{idx + 1}
                                      </span>
                                    </div>
                                    <span className="text-[10px] text-neutral-400">
                                      {formatTimeAgo(post.createdAt)}
                                    </span>
                                  </div>
                                </div>

                                {post.author?.phone && (
                                  <a
                                    href={`tel:${post.author.phone}`}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold flex items-center gap-1 transition shrink-0"
                                  >
                                    <Phone className="w-3 h-3" />
                                    <span>Hubungi Warga</span>
                                  </a>
                                )}
                              </div>

                              <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                                "{post.content}"
                              </p>

                              <div className="flex items-center justify-between pt-1 border-t border-neutral-200/60 text-[11px]">
                                <span className="text-neutral-500 truncate max-w-[240px]">
                                  {post.address}
                                </span>
                                <Link
                                  to="/community/$postId"
                                  params={{ postId: post.id }}
                                  className="text-brand-600 font-extrabold hover:underline flex items-center gap-1 shrink-0"
                                >
                                  <span>Buka Postingan</span>
                                  <ArrowRight className="w-3 h-3" />
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>

      {/* DISPOSISI MODAL */}
      {assignIncident && (
        <CreateAssignmentModal
          isOpen={!!assignIncident}
          targetPost={assignIncident.posts[0]}
          onClose={() => setAssignIncident(null)}
          onSuccess={() => {
            refetch()
            queryClient.invalidateQueries({ queryKey: ['community-posts'] })
          }}
        />
      )}

      {/* LIGHTBOX */}
      {lightboxMediaUrl && (
        <MediaLightboxModal
          isOpen={!!lightboxMediaUrl}
          onClose={() => setLightboxMediaUrl(null)}
          mediaUrl={lightboxMediaUrl}
          category="DARURAT"
          authorName="Dokumentasi Laporan Warga"
          authorRole="WARGA"
          address="Foto kejadian kebakaran lahan"
          dateStr=""
          isLiveCamera={true}
        />
      )}
    </AppLayout>
  )
}
