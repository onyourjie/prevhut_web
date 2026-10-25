import { Radio, Calendar, Flame, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PriorityArea } from '../schemas'
import { PopoverInfo } from './PopoverInfo'

interface AreaReasonsPanelProps {
  area: PriorityArea
  withDividers: boolean
  translucent?: boolean
}

export function AreaReasonsPanel({
  area,
  withDividers,
  translucent = false,
}: AreaReasonsPanelProps) {
  const divider = withDividers ? <div className="w-full h-px bg-neutral-200/60" /> : null

  return (
    <div
      className={cn(
        'rounded-2xl p-3.5 border flex flex-col gap-3',
        translucent ? 'bg-white/50 border-white/60' : 'bg-neutral-50 border-neutral-200/80',
      )}
    >
      <div className="flex items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-1.5 text-neutral-700">
          <Radio className="w-4 h-4 text-neutral-500 shrink-0" />
          <span>Deteksi pada tanggal ini</span>
          <PopoverInfo
            title="Deteksi pada tanggal ini"
            content="Jumlah titik panas (anomali termal) yang tercatat oleh sensor satelit NASA FIRMS pada tanggal observasi yang dipilih."
          />
        </div>
        <span className="font-bold text-error-700">{area.reasons.detectionCountDate} titik panas</span>
      </div>

      {divider}

      <div className="flex items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-1.5 text-neutral-700">
          <Calendar className="w-4 h-4 text-neutral-500 shrink-0" />
          <span>Hari dengan deteksi</span>
          <PopoverInfo
            title="Hari dengan deteksi"
            content="Berapa hari titik panas terdeteksi di area ini selama 7 hari terakhir."
          />
        </div>
        <span className="font-bold text-neutral-900">
          {area.reasons.detectionDaysRatio.days} dari {area.reasons.detectionDaysRatio.totalDays} hari
        </span>
      </div>

      {divider}

      <div className="flex items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-1.5 text-neutral-700">
          <Flame className="w-4 h-4 text-neutral-500 shrink-0" />
          <span>Daya panas (FRP)</span>
          <PopoverInfo
            title="Daya panas (FRP)"
            content="Seberapa besar energi panas yang terdeteksi satelit di area ini."
          />
        </div>
        <span className="font-bold text-neutral-900">
          {area.reasons.frpMedian.toString().replace('.', ',')} MW (median)
        </span>
      </div>

      <div className="bg-error-50/80 border border-error-200/70 rounded-xl p-3 flex items-center gap-2 text-xs text-error-900 font-medium">
        <Info className="w-4 h-4 text-error-600 shrink-0" />
        <span>{area.reasons.primaryFactor}</span>
      </div>
    </div>
  )
}
