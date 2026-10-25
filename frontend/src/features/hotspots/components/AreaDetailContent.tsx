import { useState } from 'react'
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  MapPin,
  Radio,
  Calendar,
  Flame,
  Info,
  SlidersHorizontal,
  Satellite,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PriorityArea } from '../schemas'
import { PopoverInfo } from './PopoverInfo'

export interface AreaDetailContentProps {
  area: PriorityArea
  onBack?: () => void
  backLabel?: string
  variant?: 'full' | 'compact'
  className?: string
}

function getScoreColor(priority: PriorityArea['priority']) {
  if (priority === 'P1') return 'text-error-600'
  if (priority === 'P2') return 'text-warning-600'
  return 'text-purple-600'
}

function PriorityTags({ area }: { area: PriorityArea }) {
  const badgeStyle =
    area.priority === 'P1'
      ? 'bg-error-50 text-error-700 border-error-200/80'
      : area.priority === 'P2'
        ? 'bg-warning-50 text-warning-800 border-warning-200/80'
        : 'bg-purple-50 text-purple-700 border-purple-200/80'

  return (
    <div className="flex items-center gap-2 flex-wrap text-xs">
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold border',
          badgeStyle,
        )}
      >
        {area.priority} • {area.priorityLabel}
      </span>
      <span className="text-neutral-400">•</span>
      <span className="text-neutral-600 font-medium">Analisis FIRELINE</span>
    </div>
  )
}

function UserInsideBanner({ area }: { area: PriorityArea }) {
  if (!area.isUserInside) return null

  return (
    <div className="bg-warning-50 border border-warning-200/80 rounded-2xl p-3 flex items-center gap-2.5 text-xs font-medium text-warning-950">
      <Info className="w-4 h-4 text-warning-700 shrink-0" />
      <span>Lokasimu berada dalam batas area ini.</span>
    </div>
  )
}

function HotspotList({ area, translucent = false }: { area: PriorityArea; translucent?: boolean }) {
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

function ReasonsPanel({
  area,
  withDividers,
  translucent = false,
}: {
  area: PriorityArea
  withDividers: boolean
  translucent?: boolean
}) {
  const divider = withDividers ? <div className="w-full h-px bg-neutral-200/60" /> : null

  return (
    <div
      className={cn(
        'rounded-2xl p-3.5 border flex flex-col gap-3',
        translucent ? 'bg-white/50 border-white/60' : 'bg-neutral-50 border-neutral-200/80',
      )}
    >
      <div className="flex items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-2 text-neutral-700">
          <Radio className="w-4 h-4 text-neutral-500 shrink-0" />
          <span>Deteksi pada tanggal ini</span>
        </div>
        <span className="font-bold text-error-700">{area.reasons.detectionCountDate} catatan</span>
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

export function AreaDetailContent({
  area,
  onBack,
  backLabel = 'Kembali ke Daftar Area',
  variant = 'full',
  className,
}: AreaDetailContentProps) {
  const [showHotspots, setShowHotspots] = useState(false)
  const hasHotspots = Boolean(area.hotspots && area.hotspots.length > 0)
  const scoreFormatted = area.score.toString().replace('.', ',')
  const scoreColor = getScoreColor(area.priority)

  if (variant === 'compact') {
    return (
      <div className={cn('flex flex-col gap-3 select-none', className)}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-bold text-neutral-1000 leading-tight">
            Detail Area Pemantauan
          </h2>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label={backLabel}
              className="inline-flex items-center gap-1.5 min-h-[44px] -my-2 -mr-2 px-2 text-xs font-bold text-accent-900 hover:text-accent-950 rounded-lg focus-ring cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{backLabel}</span>
            </button>
          )}
        </div>

        <div className="flex items-baseline gap-2">
          <span className={cn('text-3xl font-extrabold tracking-tight', scoreColor)}>
            {scoreFormatted} / 100
          </span>
          <span className="text-xs font-medium text-neutral-500">Skor prioritas</span>
        </div>

        <PriorityTags area={area} />

        <div className="flex items-center gap-2 text-xs text-neutral-700">
          <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
          <span className="font-medium">
            {area.district}, {area.regency}
          </span>
        </div>

        <UserInsideBanner area={area} />

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-800">
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500" />
            <span>Alasan prioritas</span>
          </div>
          <ReasonsPanel area={area} withDividers={false} translucent />
        </div>

        {hasHotspots && (
          <>
            <button
              type="button"
              onClick={() => setShowHotspots((v) => !v)}
              aria-expanded={showHotspots}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] w-full rounded-xl border border-neutral-300/80 bg-white/50 text-xs font-bold text-neutral-900 hover:bg-white/80 transition focus-ring cursor-pointer"
            >
              <Satellite className="w-4 h-4" />
              <span>
                {showHotspots
                  ? 'Sembunyikan titik satelit'
                  : `Lihat titik satelit (${area.hotspots?.length})`}
              </span>
              {showHotspots ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            {showHotspots && <HotspotList area={area} translucent />}
          </>
        )}
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-4 select-none', className)}>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label={backLabel}
          className="inline-flex items-center gap-2 text-xs font-bold text-brand-700 hover:text-brand-900 p-1.5 -ml-1.5 rounded-lg hover:bg-brand-50 transition focus-ring cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{backLabel}</span>
        </button>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col">
          <h2 className="text-xl font-extrabold text-neutral-1000 leading-tight">{area.name}</h2>
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span>
              {area.district}, {area.regency}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end shrink-0">
          <span className={cn('text-3xl font-extrabold tracking-tight', scoreColor)}>
            {scoreFormatted}
          </span>
          <span className="text-[11px] font-medium text-neutral-400">Skor / 100</span>
        </div>
      </div>

      <PriorityTags area={area} />

      <UserInsideBanner area={area} />

      <div className="flex flex-col gap-2 pt-1">
        <div className="flex items-center gap-2 text-xs font-bold text-neutral-800">
          <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500" />
          <span>Alasan & Indikator Prioritas</span>
        </div>
        <ReasonsPanel area={area} withDividers />
      </div>

      {area.hotspots && area.hotspots.length > 0 && <HotspotList area={area} />}
    </div>
  )
}
