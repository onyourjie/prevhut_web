import { z } from 'zod'

export const PriorityLevelSchema = z.enum(['P1', 'P2', 'P3'])
export type PriorityLevel = z.infer<typeof PriorityLevelSchema>

export const PriorityMetadataSchema = z.object({
  code: PriorityLevelSchema,
  label: z.string(),
  badgeColor: z.string(),
  textColor: z.string(),
})

export const HotspotPointSchema = z.object({
  id: z.string(),
  lat: z.number(),
  lng: z.number(),
  confidence: z.enum(['low', 'nominal', 'high']),
  frp: z.number(), // Fire Radiative Power (MW)
  satellite: z.string(),
  acquiredTime: z.string(),
  priority: PriorityLevelSchema,
})
export type HotspotPoint = z.infer<typeof HotspotPointSchema>

export const PriorityAreaReasonsSchema = z.object({
  detectionCountDate: z.number(),
  detectionDaysRatio: z.object({
    days: z.number(),
    totalDays: z.number(),
  }),
  frpMedian: z.number(),
  primaryFactor: z.string(),
})
export type PriorityAreaReasons = z.infer<typeof PriorityAreaReasonsSchema>

export const PriorityAreaSchema = z.object({
  id: z.string(),
  name: z.string(), // Contoh: "Area Pantau 01"
  priority: PriorityLevelSchema,
  priorityLabel: z.string(), // "Prioritas Tinggi", "Perhatian Meningkat", "Tetap Dipantau"
  score: z.number(), // Misal: 85.2
  province: z.string().optional(),
  regency: z.string(), // Kabupaten, misal: "Kabupaten Sintang"
  district: z.string(), // Kecamatan, misal: "Kecamatan Sintang"
  hotspotCount: z.number(),
  lastUpdatedText: z.string(), // Contoh: "01.00 WIB" atau "12 jam yang lalu"
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  // Bounding box area pantau [latMin, lngMin], [latMax, lngMax]
  bounds: z.tuple([
    z.tuple([z.number(), z.number()]),
    z.tuple([z.number(), z.number()]),
  ]),
  isUserInside: z.boolean().default(false),
  reasons: PriorityAreaReasonsSchema,
  hotspots: z.array(HotspotPointSchema).default([]),
})
export type PriorityArea = z.infer<typeof PriorityAreaSchema>

export const MapFilterSchema = z.object({
  province: z.string().nullable().default(null),
  regency: z.string().nullable().default(null),
  district: z.string().nullable().default(null),
  date: z.string(), // format YYYY-MM-DD
  priorities: z.array(PriorityLevelSchema).default(['P1', 'P2', 'P3']),
})
export type MapFilter = z.infer<typeof MapFilterSchema>

export const AreaPrioritySummarySchema = z.object({
  currentLocationName: z.string(),
  currentLocationStatusText: z.string(),
  currentAreaInside: PriorityAreaSchema.nullable(),
  totalAreasFound: z.number(),
  areas: z.array(PriorityAreaSchema),
})
export type AreaPrioritySummary = z.infer<typeof AreaPrioritySummarySchema>
