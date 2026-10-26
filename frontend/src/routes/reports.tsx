import { useState, useMemo, useEffect } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ClipboardList,
  Search,
  Flame,
  Shield,
  RefreshCw,
} from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'
import { useAuthStore } from '@/store/auth.store'
import { apiRequest } from '@/lib/api'
import { cn } from '@/lib/utils'
import { CreateAssignmentModal } from '@/components/assignments/CreateAssignmentModal'
import { MediaLightboxModal } from '@/components/community/media-lightbox-modal'
import {
  IncidentCard,
  type IncidentGroup,
  type IncidentPost,
} from '@/components/reports/IncidentCard'

export type { IncidentGroup, IncidentPost }

export const Route = createFileRoute('/reports')({
  component: ReportsPage,
})

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
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout title="Manajemen Laporan & Insiden">
      <div className="space-y-6 max-w-5xl mx-auto pb-16">
        {/* Header Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-neutral-900 text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md border border-neutral-800">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
              <Flame className="w-3.5 h-3.5 text-brand-400" />
              <span className="text-xs text-neutral-300 font-semibold">
                Sistem Insiden Karhutla
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">
              Pusat Laporan & Insiden Karhutla
            </h1>
            <p className="text-xs text-neutral-300 max-w-xl leading-relaxed">
              Laporan darurat dari warga di area atau desa yang sama dikelompokkan ke dalam satu insiden. Menugaskan relawan ke suatu insiden otomatis memperbarui seluruh laporan warga terkait.
            </p>
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
            {filteredIncidents.map((incident) => (
              <IncidentCard
                key={incident.key}
                incident={incident}
                isExpanded={expandedKeys[incident.key] ?? false}
                onToggleExpand={toggleExpand}
                onAssign={setAssignIncident}
                onOpenLightbox={setLightboxMediaUrl}
              />
            ))}
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
