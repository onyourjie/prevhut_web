import { useState } from 'react'
import {
  MapPin,
  Clock,
  ChevronDown,
  Navigation,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PriorityArea } from '../schemas'
import { AreaReasonsPanel } from './AreaReasonsPanel'
import { AreaHotspotList } from './AreaHotspotList'

export interface AreaDetailContentProps {
  area: PriorityArea
  onBack?: () => void
  backLabel?: string
  variant?: 'full' | 'compact' | 'panel' | 'sheet'
  className?: string
  translucent?: boolean
}

function PriorityTags({ area }: { area: PriorityArea }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span
        className={cn(
          'inline-flex items-center px-3 py-1 rounded-full font-bold border',
          area.priority === 'P1' && 'border-error-300 bg-error-50 text-error-800',
          area.priority === 'P2' && 'border-warning-300 bg-warning-50 text-warning-950',
          area.priority === 'P3' && 'border-purple-300 bg-purple-50 text-purple-950',
        )}
      >
        {area.priority} • {area.priorityLabel}
      </span>
      {area.province && (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full font-semibold border border-neutral-200 bg-neutral-100 text-neutral-700 text-xs">
          {area.province}
        </span>
      )}
      <span className="text-neutral-400">•</span>
      <span className="text-neutral-600 font-medium">Analisis FIRELINE</span>
    </div>
  )
}

function UserInsideBanner({ area }: { area: PriorityArea }) {
  if (!area.isUserInside) return null

  return (
    <div className="bg-brand-50 border border-brand-200/80 rounded-xl p-3 flex items-center gap-2 text-xs text-brand-900 font-semibold shadow-2xs">
      <Navigation className="w-4 h-4 text-brand-700 shrink-0 fill-brand-700" />
      <span>Kamu berada di dalam area pemantauan ini</span>
    </div>
  )
}

export function AreaDetailContent({
  area,
  variant = 'panel',
  className,
  translucent = false,
}: AreaDetailContentProps) {
  const [showHotspots, setShowHotspots] = useState(false)
  const isSheet = variant === 'compact' || variant === 'sheet'

  if (isSheet) {
    return (
      <div className={cn('flex flex-col gap-4 text-left select-none pb-4', className)}>
        <PriorityTags area={area} />

        <div className="flex items-center gap-2 text-xs text-neutral-700">
          <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
          <span className="font-medium">
            {[area.district, area.regency, area.province].filter(Boolean).join(', ')}
          </span>
        </div>

        <UserInsideBanner area={area} />

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
            Alasan Penetapan Prioritas
          </span>
          <AreaReasonsPanel area={area} withDividers={true} translucent={translucent} />
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 pt-1">
          <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span>{area.lastUpdatedText}</span>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowHotspots(!showHotspots)}
            className="w-full py-2.5 px-3 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-bold text-neutral-700 flex items-center justify-between transition cursor-pointer"
          >
            <span>
              {showHotspots
                ? 'Sembunyikan titik satelit'
                : `Lihat titik satelit (${area.hotspots?.length})`}
            </span>
            <ChevronDown
              className={cn('w-4 h-4 text-neutral-400 transition-transform', showHotspots && 'rotate-180')}
            />
          </button>

          {showHotspots && <AreaHotspotList area={area} translucent={translucent} />}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-4 text-left select-none', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col">
          <h2 className="text-xl font-extrabold text-neutral-1000 leading-tight">{area.name}</h2>
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span>
              {[area.district, area.regency, area.province].filter(Boolean).join(', ')}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end shrink-0">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-neutral-900">{area.score}</span>
            <span className="text-xs text-neutral-500 font-semibold">/ 100</span>
          </div>
          <span className="text-[11px] text-neutral-500 font-medium">Skor Risiko</span>
        </div>
      </div>

      <PriorityTags area={area} />

      <UserInsideBanner area={area} />

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
          Alasan Penetapan Prioritas
        </span>
        <AreaReasonsPanel area={area} withDividers={false} translucent={translucent} />
      </div>

      <AreaHotspotList area={area} translucent={translucent} />

      <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 pt-2 border-t border-neutral-200/60">
        <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <span>{area.lastUpdatedText}</span>
      </div>
    </div>
  )
}
