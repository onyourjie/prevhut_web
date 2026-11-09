import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { MoreVertical, Flag, MapPin, ArrowRight } from 'lucide-react'
import { formatTimeAgo, cn } from '@/lib/utils'
import type { PostAuthor } from './post-card.types'

interface PostCardHeaderProps {
  author?: PostAuthor
  createdAt: string
  category: 'DARURAT' | 'INFORMASI'
  status?: string
  locationText?: string
  clusterCode?: string | null
  onReportClick: () => void
}

export function PostCardHeader({
  author,
  createdAt,
  category,
  status,
  locationText,
  clusterCode,
  onReportClick,
}: PostCardHeaderProps) {
  const [showMenu, setShowMenu] = useState(false)
  const isEmergency = category === 'DARURAT'

  return (
    <div className="p-4 sm:p-5 pb-2.5 flex items-start justify-between gap-3">
      {/* Author info & location metadata */}
      <div className="flex items-start gap-3 min-w-0">
        <img
          src={
            author?.avatarUrl ||
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80'
          }
          alt={author?.name || 'Warga'}
          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0 mt-0.5"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-extrabold text-sm text-slate-900 leading-tight truncate">
              {author?.name || 'Warga'}
            </span>
            {author?.role && author.role !== 'WARGA' && (
              <span
                className={cn(
                  'text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded',
                  author.role === 'ADMIN'
                    ? 'bg-slate-900 text-amber-400'
                    : 'bg-emerald-100 text-emerald-800'
                )}
              >
                {author.role === 'ADMIN' ? 'Admin Posko' : 'Relawan'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 flex-wrap">
            <span>{formatTimeAgo(createdAt)}</span>
            {locationText && (
              <>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 truncate max-w-[240px] text-slate-600 font-medium">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{locationText}</span>
                </span>
              </>
            )}
          </div>

          {/* NASA Cluster Link (if tagged) */}
          {clusterCode && (
            <div className="mt-1.5">
              <Link
                to="/map"
                search={{ area: clusterCode }}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-700 hover:text-brand-800 bg-brand-50/80 hover:bg-brand-100/80 border border-brand-200/70 px-2 py-0.5 rounded-md transition"
              >
                <span>Satelit NASA: {clusterCode}</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Right side: Status Tag & Options Menu */}
      <div className="flex items-center gap-2 shrink-0">
        {isEmergency ? (
          <span
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-extrabold border',
              status === 'SELESAI'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : status === 'DALAM_PENANGANAN'
                ? 'bg-blue-50 text-blue-800 border-blue-200'
                : 'bg-red-50 text-red-700 border-red-200'
            )}
          >
            <span
              className={cn(
                'w-1.5 h-1.5 rounded-full',
                status === 'SELESAI'
                  ? 'bg-emerald-600'
                  : status === 'DALAM_PENANGANAN'
                  ? 'bg-blue-600 animate-pulse'
                  : 'bg-red-600'
              )}
            />
            <span>
              {status === 'SELESAI'
                ? 'Padam'
                : status === 'DALAM_PENANGANAN'
                ? 'Ditangani'
                : 'Darurat Api'}
            </span>
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200/80">
            Informasi
          </span>
        )}

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Opsi Postingan"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95">
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false)
                    onReportClick()
                  }}
                  className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 text-left transition cursor-pointer"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>Laporkan postingan</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
