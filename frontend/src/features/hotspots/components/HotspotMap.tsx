import { useEffect, useMemo, useRef, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Rectangle,
  Polygon,
  CircleMarker,
  Tooltip,
  AttributionControl,
  useMap,
  useMapEvents,
} from 'react-leaflet'
import L from 'leaflet'
import type { LatLngBoundsExpression } from 'leaflet'
import type { PriorityArea, PriorityLevel } from '../schemas'
import { USER_CURRENT_LOCATION } from '../mock-data'
import { BASEMAPS, DEFAULT_BASEMAP } from '../basemaps'
import type { BasemapId } from '../basemaps'
import { MapControls } from './MapControls'

export interface HotspotMapProps {
  areas: PriorityArea[]
  selectedArea?: PriorityArea | null
  onSelectArea?: (area: PriorityArea | null) => void
  userLocation?: { lat: number; lng: number }
  hideControlsOnMobile?: boolean
  /** Panel rincian desktop terbuka di kanan; geser kontrol peta agar tidak tertimpa. */
  desktopPanelOpen?: boolean
  className?: string
}

const PRIORITY_COLOR: Record<PriorityLevel, string> = {
  P1: '#dc2626',
  P2: '#f59e0b',
  P3: '#9333ea',
}

const WORLD_RING: [number, number][] = [
  [-85, -180],
  [-85, 180],
  [85, 180],
  [85, -180],
]

const DESKTOP_QUERY = '(min-width: 1024px)'

const FLAME_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>'

function createAreaMarkerIcon(area: PriorityArea, isSelected: boolean) {
  const color = PRIORITY_COLOR[area.priority]
  const size = isSelected ? 38 : 32
  const pulse =
    area.priority === 'P1'
      ? `<span class="absolute inset-0 rounded-full animate-ping" style="background:${color};opacity:.45;animation-duration:2s"></span>`
      : ''
  const shadow = isSelected
    ? 'box-shadow:0 0 0 4px rgba(234,88,12,.45),0 4px 10px rgba(0,0,0,.3);'
    : 'box-shadow:0 2px 6px rgba(0,0,0,.3);'

  return L.divIcon({
    className: '',
    html: `
      <div class="relative" style="width:${size}px;height:${size}px;">
        ${pulse}
        <div class="relative w-full h-full rounded-full flex items-center justify-center cursor-pointer transition-all duration-200" style="background:${color};border:3px solid #fff;${shadow}">
          ${FLAME_SVG}
        </div>
        <span class="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-neutral-950 text-white text-[10px] font-bold leading-[18px] text-center border border-white">${area.hotspotCount}</span>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

function createUserMarkerIcon() {
  return L.divIcon({
    className: '',
    html: `
      <div class="relative flex items-center justify-center" style="width:36px;height:36px;">
        <span class="absolute inline-flex h-full w-full rounded-full bg-blue-500/25 animate-ping" style="animation-duration:2.5s;"></span>
        <span class="absolute inline-flex h-6 w-6 rounded-full bg-blue-500/20"></span>
        <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-600 border-2 border-white shadow-md"></span>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  })
}

/**
 * Hitung ulang ukuran peta saat kontainernya berubah (sidebar dibuka atau ditutup,
 * rotasi layar), supaya tile tidak menyisakan area abu-abu.
 */
function MapResizer() {
  const map = useMap()

  useEffect(() => {
    const container = map.getContainer()
    const observer = new ResizeObserver(() => map.invalidateSize())
    observer.observe(container)
    return () => observer.disconnect()
  }, [map])

  return null
}

/**
 * Atur kamera: tampilkan seluruh area pantau saat tidak ada pilihan,
 * dan fokus ke area terpilih dengan ruang kosong untuk header dan bottom sheet di mobile.
 */
function MapCamera({
  areas,
  selectedArea,
}: {
  areas: PriorityArea[]
  selectedArea?: PriorityArea | null
}) {
  const map = useMap()
  const hasFitted = useRef(false)
  const areaKey = useMemo(() => areas.map((area) => area.id).join('|'), [areas])

  useEffect(() => {
    const isDesktop = window.matchMedia(DESKTOP_QUERY).matches
    const height = map.getSize().y

    if (selectedArea) {
      map.flyToBounds(selectedArea.bounds as LatLngBoundsExpression, {
        paddingTopLeft: isDesktop ? [60, 60] : [40, 150],
        paddingBottomRight: isDesktop ? [440, 60] : [40, Math.round(height * 0.55)],
        maxZoom: 14,
        duration: 0.8,
      })
      return
    }

    if (areas.length === 0) return

    const bounds = L.latLngBounds(areas.map((area) => area.bounds[0]))
    areas.forEach((area) => bounds.extend(area.bounds[1]))

    map.fitBounds(bounds, {
      paddingTopLeft: isDesktop ? [60, 60] : [30, 200],
      paddingBottomRight: isDesktop ? [60, 80] : [30, 280],
      maxZoom: 13,
      animate: hasFitted.current,
      duration: 0.8,
    })
    hasFitted.current = true
    // areaKey mewakili isi areas, supaya kamera tidak bergerak karena identitas array saja
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedArea, areaKey, map])

  return null
}

function MapClickHandler({ onMapClick }: { onMapClick?: () => void }) {
  useMapEvents({
    click: () => {
      onMapClick?.()
    },
  })
  return null
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia(DESKTOP_QUERY).matches)

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY)
    const onChange = () => setIsDesktop(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return isDesktop
}

export function HotspotMap({
  areas,
  selectedArea,
  onSelectArea,
  userLocation = { lat: USER_CURRENT_LOCATION.lat, lng: USER_CURRENT_LOCATION.lng },
  hideControlsOnMobile = false,
  desktopPanelOpen = false,
  className = 'w-full h-full',
}: HotspotMapProps) {
  const isDesktop = useIsDesktop()
  const [basemapId, setBasemapId] = useState<BasemapId>(DEFAULT_BASEMAP)
  const userMarkerIcon = useMemo(() => createUserMarkerIcon(), [])
  const basemap = BASEMAPS.find((item) => item.id === basemapId) ?? BASEMAPS[0]

  const selectedColor = selectedArea ? PRIORITY_COLOR[selectedArea.priority] : '#ea580c'
  const maskHole = selectedArea
    ? ([
        [selectedArea.bounds[0][0], selectedArea.bounds[0][1]],
        [selectedArea.bounds[0][0], selectedArea.bounds[1][1]],
        [selectedArea.bounds[1][0], selectedArea.bounds[1][1]],
        [selectedArea.bounds[1][0], selectedArea.bounds[0][1]],
      ] as [number, number][])
    : null

  return (
    <div className={`relative basemap-${basemap.id} ${className}`}>
      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={12}
        zoomControl={false}
        attributionControl={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          key={basemap.id}
          url={basemap.url}
          maxZoom={basemap.maxZoom}
          subdomains={basemap.subdomains ?? 'abc'}
          attribution={basemap.attribution}
        />
        <AttributionControl position="bottomright" prefix={false} />

        <MapResizer />
        <MapCamera areas={areas} selectedArea={selectedArea} />
        <MapClickHandler
          onMapClick={() => {
            if (selectedArea) onSelectArea?.(null)
          }}
        />

        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={userMarkerIcon}
          zIndexOffset={1000}
        />

        {maskHole && (
          <Polygon
            positions={[WORLD_RING, maskHole]}
            pathOptions={{
              stroke: false,
              fillColor: '#0a0a0a',
              fillOpacity: isDesktop ? 0.35 : 0.12,
              interactive: false,
            }}
          />
        )}

        {selectedArea && (
          <Rectangle
            bounds={selectedArea.bounds as LatLngBoundsExpression}
            pathOptions={{
              color: selectedColor,
              weight: 2.5,
              dashArray: '8, 6',
              fillColor: selectedColor,
              fillOpacity: 0.14,
              interactive: false,
            }}
          />
        )}

        {selectedArea?.hotspots.map((hotspot) => (
          <CircleMarker
            key={hotspot.id}
            center={[hotspot.lat, hotspot.lng]}
            radius={Math.min(Math.max(hotspot.frp / 6, 5), 14)}
            pathOptions={{
              color: '#ffffff',
              weight: 1.5,
              fillColor: PRIORITY_COLOR[hotspot.priority],
              fillOpacity: 0.85,
            }}
            eventHandlers={{
              click: (e) => {
                L.DomEvent.stopPropagation(e.originalEvent)
              },
            }}
          />
        ))}

        {areas.map((area) => {
          const isSelected = selectedArea?.id === area.id

          return (
            <Marker
              key={`${area.id}-${isSelected}`}
              position={[area.coordinates.lat, area.coordinates.lng]}
              icon={createAreaMarkerIcon(area, isSelected)}
              zIndexOffset={isSelected ? 500 : 0}
              eventHandlers={{
                click: (e) => {
                  L.DomEvent.stopPropagation(e.originalEvent)
                  onSelectArea?.(area)
                },
              }}
            >
              <Tooltip direction="top" offset={[0, -20]} opacity={1} className="area-tooltip">
                <span className="font-bold">{area.name}</span>
                <span className="text-neutral-500">
                  {' '}
                  {area.priority} {area.score.toString().replace('.', ',')}
                </span>
              </Tooltip>
            </Marker>
          )
        })}

        <div
          className={`absolute top-1/2 -translate-y-1/2 z-[400] pointer-events-none transition-[right] duration-300 right-4 ${
            desktopPanelOpen ? 'lg:right-[calc(1rem+400px+1rem)]' : ''
          } ${hideControlsOnMobile ? 'max-lg:hidden' : ''}`}
        >
          <MapControls basemap={basemapId} onBasemapChange={setBasemapId} />
        </div>
      </MapContainer>
    </div>
  )
}
