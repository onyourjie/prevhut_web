import { useEffect, useRef, useState } from 'react'
import { Plus, Minus, LocateFixed, Layers, Map as MapIcon, Mountain, Satellite, Check } from 'lucide-react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import { cn } from '@/lib/utils'
import { BASEMAPS } from '../basemaps'
import type { BasemapId } from '../basemaps'

export interface MapControlsProps {
  onLocateUser?: () => void
  userLocation?: { lat: number; lng: number }
  basemap?: BasemapId
  onBasemapChange?: (id: BasemapId) => void
}

const BASEMAP_ICONS: Record<BasemapId, React.ReactNode> = {
  osm: <MapIcon className="w-4 h-4" />,
  topo: <Mountain className="w-4 h-4" />,
  satellite: <Satellite className="w-4 h-4" />,
}

export function MapControls({ onLocateUser, userLocation, basemap, onBasemapChange }: MapControlsProps) {
  const map = useMap()
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLayerOpen, setIsLayerOpen] = useState(false)

  useEffect(() => {
    if (containerRef.current) {
      L.DomEvent.disableClickPropagation(containerRef.current)
      L.DomEvent.disableScrollPropagation(containerRef.current)
    }
  }, [])

  const handleRecenter = () => {
    if (!userLocation) return
    map.flyTo([userLocation.lat, userLocation.lng], 13, {
      duration: 0.8,
    })
    onLocateUser?.()
  }

  const buttonBase =
    'w-11 h-11 min-w-[44px] min-h-[44px] bg-white shadow-md border border-neutral-200/80 flex items-center justify-center text-neutral-800 hover:bg-neutral-50 active:scale-95 transition-all focus-ring cursor-pointer'

  return (
    <div ref={containerRef} className="flex flex-col gap-3 items-center pointer-events-auto">
      {basemap && onBasemapChange && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsLayerOpen((prev) => !prev)}
            aria-label="Ganti tampilan peta"
            aria-expanded={isLayerOpen}
            className={cn(buttonBase, 'rounded-full text-brand-700')}
          >
            <Layers className="w-5 h-5" />
          </button>

          {isLayerOpen && (
            <div
              role="menu"
              aria-label="Pilihan tampilan peta"
              className="absolute right-full mr-2 top-0 w-56 bg-white rounded-2xl shadow-xl border border-neutral-200/90 p-1.5 flex flex-col gap-0.5"
            >
              {BASEMAPS.map((item) => {
                const isActive = item.id === basemap
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="menuitemradio"
                    aria-checked={isActive}
                    onClick={() => {
                      onBasemapChange(item.id)
                      setIsLayerOpen(false)
                    }}
                    className={cn(
                      'flex items-center gap-2.5 px-2.5 py-2 min-h-[44px] rounded-xl text-left transition focus-ring cursor-pointer',
                      isActive ? 'bg-brand-50 text-brand-800' : 'hover:bg-neutral-50 text-neutral-800',
                    )}
                  >
                    <span
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                        isActive ? 'bg-brand-100 text-brand-700' : 'bg-neutral-100 text-neutral-600',
                      )}
                    >
                      {BASEMAP_ICONS[item.id]}
                    </span>
                    <span className="flex-1 min-w-0 flex flex-col">
                      <span className="text-xs font-bold leading-tight">{item.label}</span>
                      <span className="text-[11px] text-neutral-500 leading-tight truncate">
                        {item.description}
                      </span>
                    </span>
                    {isActive && <Check className="w-4 h-4 text-brand-700 shrink-0" />}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {userLocation && (
        <button
          type="button"
          onClick={handleRecenter}
          aria-label="Arahkan ke lokasi saya"
          className={cn(buttonBase, 'rounded-full text-brand-700')}
        >
          <LocateFixed className="w-5 h-5" />
        </button>
      )}

      <div className="w-11 min-w-[44px] rounded-2xl bg-white shadow-md border border-neutral-200/80 flex flex-col items-center overflow-hidden">
        <button
          type="button"
          onClick={() => map.zoomIn()}
          aria-label="Perbesar peta"
          className="w-full h-11 min-h-[44px] flex items-center justify-center text-neutral-800 hover:bg-neutral-50 active:bg-neutral-100 transition-colors focus-ring cursor-pointer"
        >
          <Plus className="w-5 h-5" />
        </button>

        <div className="w-6 h-px bg-neutral-200" />

        <button
          type="button"
          onClick={() => map.zoomOut()}
          aria-label="Perkecil peta"
          className="w-full h-11 min-h-[44px] flex items-center justify-center text-neutral-800 hover:bg-neutral-50 active:bg-neutral-100 transition-colors focus-ring cursor-pointer"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
