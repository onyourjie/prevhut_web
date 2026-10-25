import { MapPin, Radio, Clock, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PriorityArea } from '../schemas'

export interface AreaPriorityCardProps {
  area: PriorityArea
  onSelect: (area: PriorityArea) => void
  actionText?: string
  isSelected?: boolean
  className?: string
}

export function AreaPriorityCard({
  area,
  onSelect,
  actionText = 'Lihat detail',
  isSelected = false,
  className,
}: AreaPriorityCardProps) {
  const dotColor =
    area.priority === 'P1'
      ? 'bg-error-600 ring-2 ring-error-100'
      : area.priority === 'P2'
        ? 'bg-warning-600 ring-2 ring-warning-100'
        : 'bg-purple-600 ring-2 ring-purple-100'

  const badgeStyle =
    area.priority === 'P1'
      ? 'bg-error-50 text-error-700 border-error-200/80'
      : area.priority === 'P2'
        ? 'bg-warning-50 text-warning-800 border-warning-200/80'
        : 'bg-purple-50 text-purple-700 border-purple-200/80'

  return (
    <div
      onClick={() => onSelect(area)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onSelect(area)
      }}
      className={cn(
        'bg-white rounded-2xl p-3.5 border transition text-left flex flex-col gap-2.5 cursor-pointer focus-ring group select-none',
        isSelected
          ? 'border-brand-500 ring-2 ring-brand-100 bg-brand-50/20 shadow-xs'
          : 'border-neutral-200/80 shadow-2xs hover:border-brand-500/50 hover:shadow-md',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className={cn('w-2.5 h-2.5 rounded-full shrink-0', dotColor)} aria-hidden="true" />
          <h3 className="text-sm font-bold text-neutral-1000 truncate">{area.name}</h3>
        </div>

        <span
          className={cn(
            'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border shrink-0',
            badgeStyle,
          )}
        >
          {area.priority} • {area.score.toString().replace('.', ',')}
        </span>
      </div>

      <div className="flex flex-col gap-1 text-xs text-neutral-600">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span className="truncate">
            {[area.district, area.regency, area.province].filter(Boolean).join(', ')}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 text-[11px] text-neutral-500 mt-0.5">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span>{area.hotspotCount != null ? `${area.hotspotCount} titik satelit` : 'Data tidak tersedia'}</span>
          </div>
          <div className="flex items-center gap-1 text-neutral-400">
            <Clock className="w-3 h-3 shrink-0" />
            <span>{area.lastUpdatedText.replace('Terakhir diperbarui ', '')}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end pt-1.5 border-t border-neutral-100">
        <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 group-hover:text-brand-900 group-hover:translate-x-0.5 transition-transform">
          <span>{actionText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  )
}
