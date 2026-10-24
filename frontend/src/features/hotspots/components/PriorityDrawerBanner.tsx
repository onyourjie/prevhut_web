import { ListOrdered, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PriorityDrawerBannerProps {
  totalCount: number
  regencyName?: string
  isFiltered?: boolean
  onClick?: () => void
  className?: string
}

export function PriorityDrawerBanner({
  totalCount,
  regencyName = 'Kab. Sintang',
  isFiltered = false,
  onClick,
  className,
}: PriorityDrawerBannerProps) {
  const title = isFiltered
    ? `${totalCount} Area Pantau Ditemukan`
    : `${totalCount} Area Prioritas di ${regencyName}`

  const subtitle = isFiltered
    ? 'Lihat area pantau'
    : 'Lihat prioritas wilayah di hari ini'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Buka daftar ${title}`}
      className={cn(
        'w-full bg-white/98 backdrop-blur-md rounded-2xl p-3.5 shadow-md border border-neutral-200/80 flex items-center justify-between gap-3 text-left transition hover:bg-neutral-50/90 active:scale-[0.99] focus-ring cursor-pointer pointer-events-auto',
        className,
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0 text-brand-700">
          <ListOrdered className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex flex-col">
          <span className="text-base font-bold text-neutral-1000 truncate leading-tight">
            {title}
          </span>
          <span className="text-xs text-neutral-500 mt-0.5 truncate">{subtitle}</span>
        </div>
      </div>

      <div className="w-8 h-8 rounded-full bg-neutral-100/70 flex items-center justify-center shrink-0 text-neutral-400 group-hover:text-neutral-700">
        <ChevronUp className="w-5 h-5" />
      </div>
    </button>
  )
}
