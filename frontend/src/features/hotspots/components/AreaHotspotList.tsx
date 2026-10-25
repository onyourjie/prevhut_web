import { Satellite } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PriorityArea } from '../schemas'
import { PopoverInfo } from './PopoverInfo'

interface AreaHotspotListProps {
  area: PriorityArea
  translucent?: boolean
}

export function AreaHotspotList({ area, translucent = false }: AreaHotspotListProps) {
  const hotspots = area.hotspots ?? []

  return (
    <div className="flex flex-col gap-2 pt-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-neutral-800">Titik Panas Satelit ({hotspots.length})</span>
        <div className="inline-flex items-center gap-1 text-neutral-500">
          <PopoverInfo
            title="Kepercayaan deteksi"
            content="Seberapa yakin satelit bahwa titik panas yang terdeteksi benar-benar ada."
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {hotspots.map((hs) => (
          <div
            key={hs.id}
            className={cn(
              'rounded-xl p-3 border shadow-2xs flex items-center justify-between gap-3 text-xs',
              translucent ? 'bg-white/50 border-white/60' : 'bg-white border-neutral-200/80',
            )}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0 text-neutral-700">
                <Satellite className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex flex-col">
                <span className="font-bold text-neutral-900 truncate">{hs.satellite}</span>
                <span className="text-[11px] text-neutral-600">{hs.acquiredTime}</span>
              </div>
            </div>

            <div className="flex flex-col items-end shrink-0">
              <span className="font-bold text-brand-700">{hs.frp} MW</span>
              <span className="text-[10px] text-neutral-600 capitalize">Akurasi {hs.confidence}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
