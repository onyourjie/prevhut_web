import { cn } from '@/lib/utils'
import type { PriorityLevel } from '../schemas'

export interface MapLegendProps {
  activePriorities?: PriorityLevel[]
  onTogglePriority?: (priority: PriorityLevel) => void
  className?: string
  showP3?: boolean
}

interface LegendItem {
  key: PriorityLevel
  label: string
  colorBadgeClass: string
  dotClass: string
  textClass: string
}

const LEGEND_ITEMS: LegendItem[] = [
  {
    key: 'P1',
    label: 'Prioritas Tinggi',
    colorBadgeClass: 'text-error-700',
    dotClass: 'bg-error-600 ring-2 ring-error-200',
    textClass: 'text-neutral-800',
  },
  {
    key: 'P2',
    label: 'Perhatian Meningkat',
    colorBadgeClass: 'text-warning-700',
    dotClass: 'bg-warning-600 ring-2 ring-warning-200',
    textClass: 'text-neutral-800',
  },
  {
    key: 'P3',
    label: 'Tetap Dipantau',
    colorBadgeClass: 'text-purple-700',
    dotClass: 'bg-purple-600 ring-2 ring-purple-200',
    textClass: 'text-neutral-800',
  },
]

export function MapLegend({
  activePriorities = ['P1', 'P2', 'P3'],
  onTogglePriority,
  className,
  showP3 = false,
}: MapLegendProps) {
  const items = showP3 ? LEGEND_ITEMS : LEGEND_ITEMS.slice(0, 2)

  return (
    <div
      role="region"
      aria-label="Legenda tingkat prioritas titik panas"
      className={cn(
        'flex items-center gap-2 overflow-x-auto no-scrollbar pointer-events-auto select-none',
        className,
      )}
    >
      {items.map((item) => {
        const isSelected = activePriorities.includes(item.key)

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onTogglePriority?.(item.key)}
            aria-pressed={isSelected}
            className={cn(
              'inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-xs shadow-xs border transition-all cursor-pointer focus-ring text-xs',
              isSelected
                ? 'border-neutral-200/90 text-neutral-800 hover:bg-neutral-50'
                : 'border-neutral-200/50 opacity-50 grayscale hover:opacity-80',
            )}
          >
            <span
              className={cn('w-2.5 h-2.5 rounded-full shrink-0', item.dotClass)}
              aria-hidden="true"
            />
            <div className="inline-flex items-center gap-1 font-semibold whitespace-nowrap">
              <span className={cn('font-bold', item.colorBadgeClass)}>{item.key}</span>
              <span className="text-neutral-300">•</span>
              <span className="text-neutral-700 font-medium">{item.label}</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
