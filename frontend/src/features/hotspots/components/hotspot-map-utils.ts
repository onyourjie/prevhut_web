import { useEffect, useRef, useMemo, useState } from 'react'
import L from 'leaflet'
import { useMap, useMapEvents } from 'react-leaflet'
import type { LatLngBoundsExpression } from 'leaflet'
import type { PriorityArea, PriorityLevel } from '../schemas'

export const PRIORITY_COLOR: Record<PriorityLevel, string> = {
  P1: '#dc2626',
  P2: '#f59e0b',
  P3: '#9333ea',
}

export const WORLD_RING: [number, number][] = [
  [-85, -180],
  [-85, 180],
  [85, 180],
  [85, -180],
]

export const DESKTOP_QUERY = '(min-width: 1024px)'

const FLAME_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>'

export function createAreaMarkerIcon(area: PriorityArea, isSelected: boolean) {
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
        <span class="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-neutral-950 text-white text-[10px] font-bold leading-[18px] text-center border border-white">${area.hotspotCount ?? '—'}</span>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

export function createUserMarkerIcon() {
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

export function createCitizenReportMarkerIcon() {
  return L.divIcon({
    className: '',
    html: `
      <div class="relative flex flex-col items-center" style="transform: translate(-50%, -100%);">
        <div class="px-2.5 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-black tracking-wide shadow-lg border-2 border-white flex items-center gap-1 whitespace-nowrap mb-1">
          <span>Laporan Warga</span>
        </div>
        <div class="relative flex items-center justify-center w-8 h-8">
          <span class="absolute inline-flex h-full w-full rounded-full bg-amber-500/40 animate-ping"></span>
          <div class="w-7 h-7 rounded-full bg-amber-600 border-2 border-white shadow-xl flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
        </div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })
}

export function MapResizer() {
  const map = useMap()

  useEffect(() => {
    const container = map.getContainer()
    const observer = new ResizeObserver(() => map.invalidateSize())
    observer.observe(container)
    return () => observer.disconnect()
  }, [map])

  return null
}

export function MapCamera({
  areas,
  selectedArea,
  focusPoint,
}: {
  areas: PriorityArea[]
  selectedArea?: PriorityArea | null
  focusPoint?: { lat: number; lng: number } | null
}) {
  const map = useMap()
  const hasFitted = useRef(false)
  const areaKey = useMemo(() => areas.map((area) => area.id).join('|'), [areas])

  useEffect(() => {
    const isDesktop = window.matchMedia(DESKTOP_QUERY).matches
    const height = map.getSize().y

    // Berikan prioritas pada selectedArea agar jika pengguna memilih area klaster,
    // kamera langsung berpindah ke area tersebut meskipun focusPoint laporan warga sempat aktif
    if (selectedArea) {
      map.flyToBounds(selectedArea.bounds as LatLngBoundsExpression, {
        paddingTopLeft: isDesktop ? [60, 60] : [40, 150],
        paddingBottomRight: isDesktop ? [440, 60] : [40, Math.round(height * 0.55)],
        maxZoom: 14,
        duration: 0.8,
      })
      return
    }

    if (focusPoint) {
      map.flyTo([focusPoint.lat, focusPoint.lng], 13, {
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
  }, [selectedArea, areaKey, map, focusPoint])

  return null
}

export function MapClickHandler({ onMapClick }: { onMapClick?: () => void }) {
  useMapEvents({
    click: () => {
      onMapClick?.()
    },
  })
  return null
}

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia(DESKTOP_QUERY).matches)

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY)
    const onChange = () => setIsDesktop(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return isDesktop
}
