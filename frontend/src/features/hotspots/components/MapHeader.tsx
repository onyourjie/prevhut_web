import { MapPin, ChevronRight, SlidersHorizontal, Sun, X } from 'lucide-react'

export interface MapHeaderProps {
  locationName?: string
  locationSubtitle?: string
  temperatureText?: string
  activeFilterCount?: number
  activeDistrictName?: string | null
  onOpenFilter?: () => void
  onClearFilter?: () => void
  onLocationClick?: () => void
}

export function MapHeader({
  locationName = 'Kabupaten Sintang',
  locationSubtitle = 'Lokasi saat ini',
  temperatureText = '31°C • Cerah',
  activeFilterCount = 0,
  activeDistrictName = null,
  onOpenFilter,
  onClearFilter,
  onLocationClick,
}: MapHeaderProps) {
  return (
    <div className="w-full flex flex-col gap-2 pointer-events-auto">
      <button
        type="button"
        onClick={onLocationClick}
        aria-label={`Ubah lokasi pengamatan: saat ini ${locationName}`}
        className="w-full bg-white rounded-2xl p-3.5 shadow-md border border-neutral-200/80 flex items-center justify-between gap-3 text-left transition hover:bg-neutral-50/80 active:scale-[0.99] focus-ring cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-brand-700" />
          </div>
          <div className="min-w-0 flex flex-col">
            <span className="text-base font-bold text-neutral-1000 truncate leading-tight">
              {locationName}
            </span>
            <span className="text-xs text-neutral-500 mt-0.5">{locationSubtitle}</span>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-neutral-400 shrink-0" />
      </button>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        {activeFilterCount > 0 ? (
          <div className="inline-flex items-center gap-1.5 px-3 min-h-[40px] rounded-full bg-white shadow-xs border border-brand-500/40 text-brand-800 text-xs font-semibold shrink-0">
            <button
              type="button"
              onClick={onOpenFilter}
              className="py-2 rounded-full hover:bg-brand-50 transition cursor-pointer focus-ring"
            >
              Filter ({activeFilterCount})
            </button>
            <button
              type="button"
              onClick={onClearFilter}
              aria-label="Hapus filter"
              className="p-0.5 rounded-full hover:bg-brand-200/60 inline-flex items-center cursor-pointer focus-ring"
            >
              <X className="w-3.5 h-3.5 text-brand-700" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenFilter}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-full bg-white shadow-xs border border-neutral-200/80 text-neutral-800 text-xs font-semibold shrink-0 hover:bg-neutral-50 transition cursor-pointer focus-ring"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-700" />
            <span>Filter</span>
          </button>
        )}

        <div className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-full bg-white shadow-xs border border-neutral-200/80 text-neutral-800 text-xs font-semibold shrink-0 select-none">
          <Sun className="w-4 h-4 text-amber-500" />
          <span>{temperatureText}</span>
        </div>

        {activeDistrictName && (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-full bg-white shadow-xs border border-neutral-200/80 text-neutral-700 text-xs font-medium shrink-0 max-w-[200px] truncate select-none">
            <span className="truncate">{activeDistrictName}</span>
          </div>
        )}
      </div>
    </div>
  )
}
