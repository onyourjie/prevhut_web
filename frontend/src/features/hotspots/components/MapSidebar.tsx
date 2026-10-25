import { useState } from 'react'
import {
  MapPin,
  ChevronLeft,
  ChevronRight,
  Sun,
  SlidersHorizontal,
  X,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PriorityArea, MapFilter } from '../schemas'
import { AreaPriorityCard } from './AreaPriorityCard'
import { AreaFilterForm } from './AreaFilterForm'
import { MapStatusCard } from './MapStatusCard'

export interface MapSidebarProps {
  areas: PriorityArea[]
  selectedArea?: PriorityArea | null
  onSelectArea: (area: PriorityArea | null) => void
  filter: MapFilter
  onApplyFilter: (filter: MapFilter) => void
  onClearFilter: () => void
  currentLocationName?: string
  subLocationText?: string
  temperatureText?: string
  currentAreaInside?: PriorityArea | null
  currentLocationStatusText?: string
  isCollapsed: boolean
  onToggleCollapse: () => void
  className?: string
}

export function MapSidebar({
  areas,
  selectedArea,
  onSelectArea,
  filter,
  onApplyFilter,
  onClearFilter,
  currentLocationName,
  subLocationText,
  temperatureText = '31°C • Cerah',
  currentAreaInside,
  currentLocationStatusText,
  isCollapsed,
  onToggleCollapse,
  className,
}: MapSidebarProps) {
  const [activeTab, setActiveTab] = useState<'list' | 'filter'>('list')

  const activeFilterCount =
    (filter.province ? 1 : 0) +
    (filter.regency ? 1 : 0) +
    (filter.district ? 1 : 0) +
    (filter.priorities.length < 3 ? 3 - filter.priorities.length : 0) +
    (filter.date !== new Date().toISOString().slice(0, 10) ? 1 : 0)

  return (
    <aside
      aria-label="Panel Navigasi dan Analisis Peta"
      className={cn(
        'relative bg-white border-r border-neutral-200/90 h-full flex flex-col z-30 transition-all duration-300 ease-in-out shadow-sm select-none',
        isCollapsed ? 'w-0 border-r-0' : 'w-[400px] xl:w-[440px] shrink-0',
        className,
      )}
    >
      <button
        type="button"
        onClick={onToggleCollapse}
        aria-label={isCollapsed ? 'Buka panel samping peta' : 'Tutup panel samping peta'}
        className="absolute -right-3.5 top-5 z-40 w-7 h-7 bg-white rounded-full shadow-md border border-neutral-300 flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition cursor-pointer focus-ring"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {!isCollapsed && (
        <div className="w-[400px] xl:w-[440px] h-full flex flex-col overflow-hidden">
          <div className="p-4 border-b border-neutral-200/80 bg-neutral-50/60 flex flex-col gap-3 shrink-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center shrink-0 text-brand-700">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex flex-col">
                  <h1 className="text-sm font-bold text-neutral-1000 truncate">
                    {currentLocationName}
                  </h1>
                  <span className="text-[11px] text-neutral-500 truncate">
                    {subLocationText || (filter.province ? filter.province : "Seluruh Kalimantan")} • {areas.length} Area Pantau
                  </span>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white shadow-2xs border border-neutral-200 text-xs font-semibold text-neutral-800 shrink-0">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>{temperatureText}</span>
              </div>
            </div>

            {(
              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center p-1 bg-neutral-200/60 rounded-xl flex-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('list')}
                    className={cn(
                      'flex-1 py-1 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer focus-ring text-center',
                      activeTab === 'list'
                        ? 'bg-white text-neutral-900 shadow-2xs'
                        : 'text-neutral-600 hover:text-neutral-900',
                    )}
                  >
                    Area Pantau ({areas.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('filter')}
                    className={cn(
                      'flex-1 py-1 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer focus-ring text-center flex items-center justify-center gap-1.5',
                      activeTab === 'filter'
                        ? 'bg-white text-neutral-900 shadow-2xs'
                        : 'text-neutral-600 hover:text-neutral-900',
                    )}
                  >
                    <SlidersHorizontal className="w-3 h-3" />
                    <span>Filter {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
                  </button>
                </div>

                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={onClearFilter}
                    className="p-2 rounded-xl text-xs font-semibold text-brand-700 hover:bg-brand-50 flex items-center gap-1 shrink-0 focus-ring cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Reset</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            {activeTab === 'list' ? (
              <div className="p-4 flex flex-col gap-3">
                {currentAreaInside && (
                  <MapStatusCard
                    area={currentAreaInside}
                    statusText={currentLocationStatusText}
                    onClick={() => onSelectArea(currentAreaInside)}
                    className="shadow-2xs"
                  />
                )}

                <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 flex items-center gap-2.5 text-xs font-semibold text-amber-950">
                  <Info className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Titik panas belum berarti kebakaran terkonfirmasi</span>
                </div>

                {areas.length === 0 ? (
                  <div className="py-16 text-center text-xs text-neutral-500">
                    Tidak ada area pantauan yang sesuai dengan filter aktif.
                  </div>
                ) : (
                  areas.map((area) => (
                    <AreaPriorityCard
                      key={area.id}
                      area={area}
                      isSelected={selectedArea?.id === area.id}
                      onSelect={(item) => onSelectArea(item)}
                      actionText="Lihat rincian"
                    />
                  ))
                )}
              </div>
            ) : (
              <div className="p-5">
                <AreaFilterForm
                  currentFilter={filter}
                  onApply={(newFilter) => {
                    onApplyFilter(newFilter)
                    setActiveTab('list')
                  }}
                  onReset={onClearFilter}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  )
}
