import { useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Rectangle,
  Polygon,
  CircleMarker,
  Tooltip,
  AttributionControl,
} from 'react-leaflet'
import L from 'leaflet'
import type { PriorityArea } from '../schemas'
import { USER_CURRENT_LOCATION } from '../mock-data'
import { BASEMAPS, DEFAULT_BASEMAP, type BasemapId } from '../basemaps'
import { MapControls } from './MapControls'
import {
  PRIORITY_COLOR,
  WORLD_RING,
  createAreaMarkerIcon,
  createUserMarkerIcon,
  MapResizer,
  MapCamera,
  MapClickHandler,
} from './hotspot-map-utils'

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

export function HotspotMap({
  areas,
  selectedArea,
  onSelectArea,
  userLocation,
  hideControlsOnMobile = false,
  desktopPanelOpen = false,
  className,
}: HotspotMapProps) {
  const [basemapId, setBasemapId] = useState<BasemapId>(DEFAULT_BASEMAP)
  const basemap = BASEMAPS.find((item) => item.id === basemapId) ?? BASEMAPS[0]

  const userCoords = userLocation ?? { lat: USER_CURRENT_LOCATION.lat, lng: USER_CURRENT_LOCATION.lng }

  return (
    <div className={`relative basemap-${basemapId} ${className}`}>
      <MapContainer
        center={[userCoords.lat, userCoords.lng]}
        zoom={11}
        scrollWheelZoom
        zoomControl={false}
        attributionControl={false}
        className="w-full h-full z-0"
      >
        <MapResizer />
        <MapCamera areas={areas} selectedArea={selectedArea} />
        <MapClickHandler onMapClick={() => onSelectArea?.(null)} />

        <TileLayer url={basemap.url} maxZoom={basemap.maxZoom ?? 19} />
        <AttributionControl position="bottomleft" prefix={false} />

        {selectedArea && (
          <Polygon
            positions={[WORLD_RING, selectedArea.bounds]}
            pathOptions={{
              stroke: false,
              fillColor: '#0a0a0a',
              fillOpacity: 0.35,
              interactive: false,
            }}
          />
        )}

        {areas.map((area) => {
          const isSelected = selectedArea?.id === area.id
          const color = PRIORITY_COLOR[area.priority]

          return (
            <Rectangle
              key={`rect-${area.id}-${isSelected}`}
              bounds={area.bounds}
              pathOptions={{
                color,
                weight: isSelected ? 2.5 : 1,
                fillColor: color,
                fillOpacity: isSelected ? 0.22 : 0.08,
                dashArray: isSelected ? undefined : '3, 4',
              }}
              eventHandlers={{
                click: (e) => {
                  L.DomEvent.stopPropagation(e.originalEvent)
                  onSelectArea?.(area)
                },
              }}
            />
          )
        })}

        <Marker
          position={[userCoords.lat, userCoords.lng]}
          icon={createUserMarkerIcon()}
          interactive={false}
          zIndexOffset={100}
        />

        {selectedArea && (
          <Rectangle
            bounds={selectedArea.bounds}
            pathOptions={{
              color: '#ffffff',
              weight: 3,
              fillOpacity: 0,
              dashArray: '4, 4',
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
