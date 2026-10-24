export type BasemapId = 'osm' | 'topo' | 'satellite'

export interface BasemapConfig {
  id: BasemapId
  label: string
  description: string
  url: string
  maxZoom: number
  subdomains?: string[]
  attribution: string
}

export const BASEMAPS: BasemapConfig[] = [
  {
    id: 'osm',
    label: 'Peta',
    description: 'Jalan dan batas wilayah',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxZoom: 19,
    subdomains: ['a', 'b', 'c'],
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  {
    id: 'topo',
    label: 'Topografi',
    description: 'Relief dan tutupan hutan',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    maxZoom: 17,
    subdomains: ['a', 'b', 'c'],
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)',
  },
  {
    id: 'satellite',
    label: 'Satelit',
    description: 'Citra udara terbaru',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 19,
    attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics',
  },
]

export const DEFAULT_BASEMAP: BasemapId = 'osm'
