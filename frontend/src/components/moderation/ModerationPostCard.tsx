import { useState } from 'react'
import {
  AlertTriangle,
  CheckCircle,
  Camera,
  Video,
  MapPin,
  ChevronDown,
  ChevronUp,
  Flame,
  Phone,
  Clock,
  ExternalLink,
} from 'lucide-react'
import { formatTimeAgo, cn } from '@/lib/utils'
import { isVideoMedia } from '@/lib/cloudinary'
import { CommunityVideoPlayer } from '@/components/community/community-video-player'

export interface ReportItem {
  id: string
  postId: string
  reporterId: string
  reason: 'HOAX_INFO_PALSU' | 'FOTO_LOKASI_TIDAK_SESUAI' | 'SPAM' | 'LAINNYA'
  notes?: string | null
  isResolved: boolean
  createdAt: string
  reporter: {
    id: string
    name: string
    role: string
    avatarUrl?: string | null
    phone?: string | null
    kabupaten?: string | null
    kecamatan?: string | null
  }
}

export interface ReportedPost {
  id: string
  content: string
  imageUrl?: string | null
  category: 'DARURAT' | 'INFORMASI'
  status: 'MENUNGGU_VERIFIKASI' | 'DALAM_PENANGANAN' | 'SELESAI' | 'DITOLAK'
  address: string
  province: string
  kabupaten: string
  kecamatan: string
  latitude: number
  longitude: number
  clusterCode?: string | null
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
    role: string
    avatarUrl?: string | null
    phone?: string | null
    kabupaten?: string | null
    kecamatan?: string | null
  }
  totalReports: number
  unresolvedReportsCount: number
  reasonsSummary: Record<string, number>
  reports: ReportItem[]
}

export const REASON_LABELS: Record<string, { label: string; badgeClass: string }> = {
  HOAX_INFO_PALSU: {
    label: 'Diduga Informasi Palsu / Hoax',
    badgeClass: 'bg-red-100 text-red-800 border-red-200',
  },
  FOTO_LOKASI_TIDAK_SESUAI: {
    label: 'Foto / Lokasi Tidak Sesuai',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  SPAM: {
    label: 'Spam / Iklan',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  LAINNYA: {
    label: 'Alasan Lainnya',
    badgeClass: 'bg-neutral-100 text-neutral-800 border-neutral-200',
  },
}

export interface ModerationPostCardProps {
  post: ReportedPost
  isProcessing: boolean
  onModerate: (
    postId: string,
    action: 'REJECT_HOAX' | 'APPROVE_VALID',
    postTitle: string
  ) => Promise<void>
  onOpenLightbox: (media: {
    url: string
    authorName?: string
    address?: string
    category?: 'DARURAT' | 'INFORMASI'
  }) => void
}

export function ModerationPostCard({
  post,
  isProcessing,
  onModerate,
  onOpenLightbox,
}: ModerationPostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasUnresolved = post.unresolvedReportsCount > 0

  return (
    <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden transition hover:border-neutral-300">
      {/* Top Header of Post Card */}
      <div className="p-4 sm:p-5 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50/40">
        <div className="flex items-center gap-3">
          <img
            src={
              post.author?.avatarUrl ||
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80'
            }
            alt={post.author?.name || 'Pelapor'}
            className="w-10 h-10 rounded-full object-cover border border-neutral-200 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-neutral-900">
                {post.author?.name || 'Warga'}
              </span>
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.2 rounded font-bold uppercase',
                  post.author?.role === 'ADMIN'
                    ? 'bg-neutral-900 text-amber-400'
                    : post.author?.role === 'RELAWAN'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-brand-100 text-brand-800'
                )}
              >
                {post.author?.role}
              </span>
              {post.author?.phone && (
                <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {post.author.phone}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
              <Clock className="w-3 h-3" />
              <span>Diposting {formatTimeAgo(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Status & Category Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {post.clusterCode && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <Flame className="w-3 h-3 text-amber-600" />
              {post.clusterCode}
            </span>
          )}
          <span
            className={cn(
              'px-2.5 py-1 rounded-full text-[11px] font-black tracking-wide uppercase',
              post.category === 'DARURAT'
                ? 'bg-red-100 text-red-700 border border-red-200'
                : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
            )}
          >
            {post.category}
          </span>

          {/* Status Moderasi Posko: Hanya 'Sah', 'Ditolak', atau 'Perlu Ditinjau' */}
          {post.status === 'DITOLAK' ? (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border bg-rose-100 text-rose-800 border-rose-300">
              Status: Ditolak (Palsu / Hoax)
            </span>
          ) : !hasUnresolved ? (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border bg-emerald-100 text-emerald-800 border-emerald-300">
              Status: Sah (Valid)
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border bg-amber-100 text-amber-800 border-amber-300">
              Status: Perlu Ditinjau
            </span>
          )}
        </div>
      </div>

      {/* Post Content & Media */}
      <div className="p-4 sm:p-5 space-y-3.5">
        {/* Address Line */}
        <div className="flex items-start gap-2 text-xs text-neutral-600">
          <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
          <span className="font-semibold">{post.address}</span>
        </div>

        {/* Post Text */}
        <p className="text-sm font-medium text-neutral-800 whitespace-pre-line leading-relaxed">
          {post.content}
        </p>

        {/* Media Preview (Video & Foto berukuran proporsional yang sama) */}
        {post.imageUrl && (
          <div className="relative rounded-2xl overflow-hidden bg-black max-w-md border border-neutral-200 shadow-2xs group aspect-video sm:aspect-[16/10] flex items-center justify-center">
            {isVideoMedia(post.imageUrl) ? (
              <>
                <CommunityVideoPlayer
                  src={post.imageUrl}
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold pointer-events-none z-10">
                  <Video className="w-3 h-3 text-amber-400" />
                  <span>Video Lapangan</span>
                </div>
              </>
            ) : (
              <>
                <img
                  src={post.imageUrl}
                  alt="Bukti foto lapangan"
                  className="w-full h-full object-contain group-hover:scale-102 transition duration-300 cursor-pointer"
                  onClick={() =>
                    onOpenLightbox({
                      url: post.imageUrl!,
                      authorName: post.author?.name,
                      address: post.address,
                      category: post.category,
                    })
                  }
                />
                <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold pointer-events-none">
                  <Camera className="w-3 h-3 text-amber-400" />
                  <span>Foto Lapangan</span>
                </div>
              </>
            )}

            <button
              type="button"
              onClick={() =>
                onOpenLightbox({
                  url: post.imageUrl!,
                  authorName: post.author?.name,
                  address: post.address,
                  category: post.category,
                })
              }
              className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/90 text-neutral-800 text-[11px] font-bold hover:bg-white shadow-xs transition cursor-pointer z-10"
              title="Perbesar tampilan media"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Perbesar</span>
            </button>
          </div>
        )}

        {/* Report Alert Box (Crucial Section) */}
        <div className="mt-4 p-4 rounded-2xl bg-rose-50/70 border border-rose-200/90 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="text-xs font-black text-rose-950">
                Diadukan oleh {post.totalReports} akun warga & relawan
              </span>
              {hasUnresolved && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white shadow-2xs">
                  {post.unresolvedReportsCount} Perlu Ditinjau
                </span>
              )}
            </div>

            {/* Breakdown Badges */}
            <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
              {Object.entries(post.reasonsSummary).map(([reason, count]) => {
                const info = REASON_LABELS[reason] || {
                  label: reason,
                  badgeClass: 'bg-neutral-100 text-neutral-700',
                }
                return (
                  <span
                    key={reason}
                    className={cn(
                      'px-2 py-0.5 rounded-md font-bold border text-[10px]',
                      info.badgeClass
                    )}
                  >
                    {info.label}: {count}
                  </span>
                )
              })}
            </div>
          </div>

          {/* Expandable List of Reporters & Notes */}
          <div className="pt-2 border-t border-rose-200/60">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:text-rose-900 transition cursor-pointer"
            >
              <span>{isExpanded ? 'Sembunyikan' : 'Lihat'} rincian akun pelapor ({post.reports.length})</span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isExpanded && (
              <div className="mt-3 space-y-2.5">
                {post.reports.map((r, idx) => {
                  const reasonInfo = REASON_LABELS[r.reason] || {
                    label: r.reason,
                    badgeClass: 'bg-neutral-100 text-neutral-700',
                  }
                  return (
                    <div
                      key={r.id || idx}
                      className="p-3 rounded-xl bg-white border border-rose-200/80 shadow-2xs space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <img
                            src={
                              r.reporter?.avatarUrl ||
                              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80'
                            }
                            alt={r.reporter?.name || 'Pelapor'}
                            className="w-6 h-6 rounded-full object-cover border border-neutral-200 shrink-0"
                          />
                          <span className="font-bold text-neutral-900">
                            {r.reporter?.name || 'Warga'}
                          </span>
                          <span className="text-[10px] font-semibold text-neutral-500">
                            ({r.reporter?.role || 'WARGA'})
                          </span>
                          {r.reporter?.phone && (
                            <span className="text-[11px] text-neutral-400">
                              • {r.reporter.phone}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-neutral-400">
                          {formatTimeAgo(r.createdAt)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded text-[10px] font-bold border',
                            reasonInfo.badgeClass
                          )}
                        >
                          {reasonInfo.label}
                        </span>
                        {r.isResolved && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Terselesaikan
                          </span>
                        )}
                      </div>

                      {r.notes ? (
                        <p className="text-[11px] text-neutral-700 bg-neutral-50 p-2 rounded-lg border border-neutral-200/70 italic">
                          "{r.notes}"
                        </p>
                      ) : (
                        <p className="text-[11px] text-neutral-400 italic">
                          (Tidak ada catatan tambahan)
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Bar Footer */}
      <div className="p-4 sm:p-5 border-t border-neutral-100 bg-neutral-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-[11px] text-neutral-500">
          {hasUnresolved ? (
            <span className="font-medium text-neutral-600">
              Pilih tindakan moderasi untuk menyelesaikan aduan warga terhadap postingan ini:
            </span>
          ) : post.status === 'DITOLAK' ? (
            <span className="inline-flex items-center gap-1.5 font-bold text-xs text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Postingan ini telah DITOLAK (Data Palsu / Hoax) & disembunyikan dari publik</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 font-bold text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Postingan ini telah diverifikasi SAH (Valid) & aktif di komunitas</span>
            </span>
          )}
        </div>

        {hasUnresolved && (
          <div className="flex items-center gap-2 flex-wrap">
            {/* Action: Reject as Fake / Hoax */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => onModerate(post.id, 'REJECT_HOAX', post.content)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 transition shadow-xs disabled:opacity-50 cursor-pointer"
              title="Tolak postingan dan tandai sebagai data palsu / hoax"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Tolak (Data Palsu / Hoax)</span>
            </button>

            {/* Action: Approve as Valid */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => onModerate(post.id, 'APPROVE_VALID', post.content)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 active:scale-95 transition shadow-2xs disabled:opacity-50 cursor-pointer"
              title="Abaikan aduan dan tetapkan postingan sebagai konten yang sah"
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Abaikan Aduan (Sah)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
