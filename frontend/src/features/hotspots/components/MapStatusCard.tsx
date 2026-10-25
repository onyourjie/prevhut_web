import { Navigation, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PriorityArea } from '../schemas'

export interface MapStatusCardProps {
  area?: PriorityArea | null
  statusText?: string
  onClick?: () => void
  className?: string
}

export function MapStatusCard({
  area,
  statusText,
  onClick,
  className,
}: MapStatusCardProps) {
  if (!area) {
    return (
      <div
        className={cn(
          'w-full bg-white/98 backdrop-blur-md rounded-2xl p-3.5 shadow-md border border-neutral-200/80 pointer-events-auto',
          className,
        )}
      >
        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 mb-1">
          <Navigation className="w-3.5 h-3.5 text-neutral-400" />
          <span>Status prioritas di lokasimu</span>
        </div>
        <p className="text-sm font-semibold text-neutral-800">
          Tidak ada area prioritas aktif di lokasimu
        </p>
        <p className="text-xs text-neutral-500 mt-0.5">
          {statusText || 'Semua titik pantau di sekitarmu dalam batas aman.'}
        </p>
      </div>
    )
  }

  const priorityColor =
    area.priority === 'P1'
      ? {
          badge: 'text-error-700',
          dot: 'bg-error-600 ring-2 ring-error-200',
        }
      : area.priority === 'P2'
        ? {
            badge: 'text-warning-700',
            dot: 'bg-warning-600 ring-2 ring-warning-200',
          }
        : {
            badge: 'text-purple-700',
            dot: 'bg-purple-600 ring-2 ring-purple-200',
          }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Buka rincian ${area.name}, status prioritas ${area.priority}`}
      className={cn(
        'w-full bg-white/98 backdrop-blur-md rounded-2xl p-3.5 shadow-md border border-neutral-200/80 text-left transition hover:bg-neutral-50/90 active:scale-[0.99] focus-ring cursor-pointer pointer-events-auto flex items-center justify-between gap-3',
        className,
      )}
    >
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-500">
          <Navigation className="w-3.5 h-3.5 text-brand-700 shrink-0" />
          <span>Status prioritas di lokasimu</span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn('w-2.5 h-2.5 rounded-full shrink-0', priorityColor.dot)}
            aria-hidden="true"
          />
          <h2 className="text-base font-bold text-neutral-1000 truncate">
            {area.name} <span className="text-neutral-400 font-normal">•</span>{' '}
            <span className={cn('font-bold', priorityColor.badge)}>{area.priority}</span>
          </h2>
        </div>

        <p className="text-xs text-neutral-500 line-clamp-1">
          {statusText ||
            `Prioritas tinggi pada 27 Sep 2026 • Data diperbarui 12 jam yang lalu`}
        </p>
      </div>

      <div className="w-8 h-8 rounded-full bg-neutral-100/70 flex items-center justify-center shrink-0 text-neutral-500 group-hover:text-neutral-800">
        <ChevronRight className="w-4 h-4" />
      </div>
    </button>
  )
}
