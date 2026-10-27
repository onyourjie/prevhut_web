import { Link } from '@tanstack/react-router'
import {
  ClipboardList,
  MapPin,
  AlertTriangle,
  Phone,
  Truck,
  ChevronDown,
  ChevronUp,
  Flame,
  Camera,
  Navigation,
  ArrowRight,
} from 'lucide-react'
import { formatTimeAgo, cn } from '@/lib/utils'

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

export interface IncidentCardProps {
  incident: IncidentGroup
  isExpanded: boolean
  onToggleExpand: (key: string) => void
  onAssign: (incident: IncidentGroup) => void
  onOpenLightbox: (imageUrl: string) => void
}

export function IncidentCard({
  incident,
  isExpanded,
  onToggleExpand,
  onAssign,
  onOpenLightbox,
}: IncidentCardProps) {
  const assignment = incident.assignment

  return (
    <article
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
                  : 'bg-amber-100 text-amber-800 border-amber-300'
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
          {(() => {
            const firstPost = incident.posts?.[0]
            const incidentLat = incident.latitude ?? firstPost?.latitude
            const incidentLon = incident.longitude ?? firstPost?.longitude

            return (
              <Link
                to="/map"
                search={{
                  area: incident.clusterCode || incident.title,
                  ...(incidentLat != null && incidentLon != null
                    ? { lat: Number(incidentLat), lon: Number(incidentLon) }
                    : {}),
                  label: incident.title,
                }}
                className="px-3 py-1.5 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-900 text-xs font-bold transition flex items-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5 text-orange-700" />
                <span>Buka di Peta</span>
              </Link>
            )
          })()}
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
              onClick={() => p.imageUrl && onOpenLightbox(p.imageUrl)}
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
              onClick={() => onAssign(incident)}
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
            onClick={() => onToggleExpand(incident.key)}
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
}
