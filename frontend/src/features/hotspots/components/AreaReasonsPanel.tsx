import { Radio, Calendar, Flame, Info, Users, ShieldAlert } from 'lucide-react'
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
  const hasCitizenBoost = Boolean(
    area.reasons.citizenReportsCount && area.reasons.citizenReportsCount > 0
  )

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

      {hasCitizenBoost && (
        <>
          {divider}
          <div className="flex items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-1.5 text-neutral-800">
              <Users className="w-4 h-4 text-brand-600 shrink-0" />
              <span className="font-semibold">Validasi warga lapangan</span>
              <PopoverInfo
                title="Ground Truth Laporan Warga"
                content="Laporan lapangan warga sekitar yang terverifikasi. Memberikan lonjakan urgensi prioritas (Fairness Crowd Urgency Multiplier) sesuai model PREVHUT/FIRELINE."
              />
            </div>
            <span className="font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-lg border border-brand-200 shadow-2xs">
              {area.reasons.citizenReportsCount} laporan (+{area.reasons.citizenUrgencyBoost} poin)
            </span>
          </div>
        </>
      )}

      <div
        className={cn(
          'rounded-xl p-3 flex items-center gap-2 text-xs font-medium border transition',
          hasCitizenBoost
            ? 'bg-amber-50/90 border-amber-300 text-amber-950 font-semibold'
            : 'bg-error-50/80 border-error-200/70 text-error-900'
        )}
      >
        {hasCitizenBoost ? (
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
        ) : (
          <Info className="w-4 h-4 text-error-600 shrink-0" />
        )}
        <span>{area.reasons.primaryFactor}</span>
      </div>
    </div>
  )
}
