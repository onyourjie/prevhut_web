import { useState } from 'react'
import { MoreVertical, Flag } from 'lucide-react'
import { formatTimeAgo, cn } from '@/lib/utils'
import type { PostAuthor } from './post-card.types'

interface PostCardHeaderProps {
  author?: PostAuthor
  createdAt: string
  onReportClick: () => void
}

export function PostCardHeader({
  author,
  createdAt,
  onReportClick,
}: PostCardHeaderProps) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="p-4 sm:p-5 pb-3 flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <img
          src={
            author?.avatarUrl ||
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80'
          }
          alt={author?.name || 'Warga'}
          className="w-10 h-10 rounded-full object-cover border border-neutral-200 shrink-0"
        />
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-sm text-neutral-900 leading-tight">
              {author?.name}
            </span>
            <span className="text-neutral-300">•</span>
            <span
              className={cn(
                'text-[11px] font-bold px-1.5 py-0.2 rounded border',
                author?.role === 'ADMIN'
                  ? 'bg-neutral-900 text-amber-400 border-neutral-800'
                  : author?.role === 'RELAWAN'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-orange-100 text-orange-800 border-orange-300',
              )}
            >
              {author?.role === 'ADMIN'
                ? 'Admin Posko'
                : author?.role === 'RELAWAN'
                ? 'Relawan'
                : 'Warga'}
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            {formatTimeAgo(createdAt)}
          </p>
        </div>
      </div>

      {/* Three dots dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowMenu(!showMenu)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 transition cursor-pointer"
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
            <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-neutral-200 py-1.5 z-30 animate-in fade-in zoom-in-95">
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
  )
}
