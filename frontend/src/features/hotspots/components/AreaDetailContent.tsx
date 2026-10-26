import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  MapPin,
  Clock,
  ChevronDown,
  Navigation,
  MessageSquare,
  ExternalLink,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { apiRequest } from '@/lib/api'
import type { PriorityArea } from '../schemas'
import { AreaReasonsPanel } from './AreaReasonsPanel'
import { AreaHotspotList } from './AreaHotspotList'

export interface AreaDetailContentProps {
  area: PriorityArea
  onBack?: () => void
  backLabel?: string
  variant?: 'full' | 'compact' | 'panel' | 'sheet'
  className?: string
  translucent?: boolean
}

function PriorityTags({ area }: { area: PriorityArea }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span
        className={cn(
          'inline-flex items-center px-3 py-1 rounded-full font-bold border',
          area.priority === 'P1' && 'border-error-300 bg-error-50 text-error-800',
          area.priority === 'P2' && 'border-warning-300 bg-warning-50 text-warning-950',
          area.priority === 'P3' && 'border-purple-300 bg-purple-50 text-purple-950',
        )}
      >
        {area.priority} • {area.priorityLabel}
      </span>
      {area.province && (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full font-semibold border border-neutral-200 bg-neutral-100 text-neutral-700 text-xs">
          {area.province}
        </span>
      )}
      <span className="text-neutral-400">•</span>
      <span className="text-neutral-600 font-medium">Analisis FIRELINE</span>
    </div>
  )
}

function UserInsideBanner({ area }: { area: PriorityArea }) {
  if (!area.isUserInside) return null

  return (
    <div className="bg-brand-50 border border-brand-200/80 rounded-xl p-3 flex items-center gap-2 text-xs text-brand-900 font-semibold shadow-2xs">
      <Navigation className="w-4 h-4 text-brand-700 shrink-0 fill-brand-700" />
      <span>Kamu berada di dalam area pemantauan ini</span>
    </div>
  )
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371.0;
  const dLat = ((lat2 - lat1) * Math.PI) / 180.0;
  const dLon = ((lon2 - lon1) * Math.PI) / 180.0;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180.0) *
      Math.cos((lat2 * Math.PI) / 180.0) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function AreaCitizenReports({ area }: { area: PriorityArea }) {
  const [isOpen, setIsOpen] = useState(true)

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['area-community-reports', area.name, area.regency, area.coordinates?.lat, area.coordinates?.lng],
    queryFn: async () => {
      try {
        let rawReports: any[] = [];
        // 1. Ambil berdasarkan clusterCode
        const byCluster = await apiRequest<any[]>(
          `/community/posts?clusterCode=${encodeURIComponent(area.name)}`
        );
        if (Array.isArray(byCluster) && byCluster.length > 0) {
          rawReports = byCluster;
        } else if (area.regency) {
          // 2. Fallback berdasarkan kabupaten klaster
          const byRegency = await apiRequest<any[]>(
            `/community/posts?kabupaten=${encodeURIComponent(area.regency)}`
          );
          if (Array.isArray(byRegency)) rawReports = byRegency;
        }

        // 3. Validasi spasial & batas administratif ketat: Radius <= 25 km dari centroid klaster
        return rawReports.filter((r) => {
          if (
            typeof r.latitude === 'number' &&
            typeof r.longitude === 'number' &&
            typeof area.coordinates?.lat === 'number' &&
            typeof area.coordinates?.lng === 'number'
          ) {
            const dist = haversineKm(
              area.coordinates.lat,
              area.coordinates.lng,
              r.latitude,
              r.longitude
            );
            return dist <= 25.0; // Maksimal radius 25 km
          }

          if (r.kabupaten && area.regency) {
            const cleanR = r.kabupaten.toLowerCase().replace(/^(kabupaten|kota)\s+/, '').trim();
            const cleanA = area.regency.toLowerCase().replace(/^(kabupaten|kota)\s+/, '').trim();
            return cleanR.includes(cleanA) || cleanA.includes(cleanR);
          }

          return false;
        });
      } catch {
        return [];
      }
    },
    staleTime: 1000 * 60 * 3,
  })

  return (
    <div className="pt-2">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-2.5 px-3 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-bold text-neutral-800 flex items-center justify-between transition cursor-pointer shadow-2xs"
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-brand-600" />
          <span>Laporan Warga Terkait ({reports.length})</span>
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-neutral-400 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div className="mt-2 space-y-2">
          {isLoading ? (
            <div className="p-3 bg-neutral-50 rounded-xl text-center text-neutral-400 text-xs flex items-center justify-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Memuat laporan warga...</span>
            </div>
          ) : reports.length === 0 ? (
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/60 text-center text-[11px] text-neutral-500">
              Belum ada laporan darurat warga di area pantau ini.
            </div>
          ) : (
            reports.slice(0, 3).map((report) => (
              <Link
                key={report.id}
                to="/community/$postId"
                params={{ postId: report.id }}
                className="block p-3 rounded-xl bg-white border border-neutral-200 hover:border-brand-400 hover:shadow-xs transition space-y-1.5 cursor-pointer text-left group"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-[10px] font-bold text-neutral-900 truncate">
                      {report.author?.name || 'Warga'}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-600 shrink-0">
                      {report.author?.role || 'Warga'}
                    </span>
                  </div>
                  <span
                    className={cn(
                      'text-[9px] font-black px-1.5 py-0.5 rounded-full border shrink-0',
                      report.status === 'SELESAI'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : report.status === 'DALAM_PENANGANAN'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    )}
                  >
                    {report.status === 'SELESAI'
                      ? 'Padam'
                      : report.status === 'DALAM_PENANGANAN'
                      ? 'Ditangani'
                      : 'Verifikasi'}
                  </span>
                </div>

                <p className="text-[11px] text-neutral-700 font-medium line-clamp-2 leading-relaxed">
                  {report.content}
                </p>

                <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-0.5">
                  <span className="truncate max-w-[200px]">{report.address}</span>
                  <span className="text-brand-600 font-bold group-hover:underline shrink-0 flex items-center gap-0.5">
                    Lihat detail <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export function AreaDetailContent({
  area,
  variant = 'panel',
  className,
  translucent = false,
}: AreaDetailContentProps) {
  const [showHotspots, setShowHotspots] = useState(false)
  const isSheet = variant === 'compact' || variant === 'sheet'

  if (isSheet) {
    return (
      <div className={cn('flex flex-col gap-4 text-left select-none pb-4', className)}>
        <PriorityTags area={area} />

        <div className="flex items-center gap-2 text-xs text-neutral-700">
          <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
          <span className="font-medium">
            {[area.district, area.regency, area.province].filter(Boolean).join(', ')}
          </span>
        </div>

        <UserInsideBanner area={area} />

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
            Alasan Penetapan Prioritas
          </span>
          <AreaReasonsPanel area={area} withDividers={true} translucent={translucent} />
        </div>

        {/* Laporan Warga Terkait */}
        <AreaCitizenReports area={area} />

        <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 pt-1">
          <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span>{area.lastUpdatedText}</span>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowHotspots(!showHotspots)}
            className="w-full py-2.5 px-3 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-bold text-neutral-700 flex items-center justify-between transition cursor-pointer"
          >
            <span>
              {showHotspots
                ? 'Sembunyikan titik satelit'
                : `Lihat titik satelit (${area.hotspots?.length || 0})`}
            </span>
            <ChevronDown
              className={cn('w-4 h-4 text-neutral-400 transition-transform', showHotspots && 'rotate-180')}
            />
          </button>

          {showHotspots && <AreaHotspotList area={area} translucent={translucent} />}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-4 text-left select-none', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <h2 className="text-xl font-extrabold text-neutral-1000 leading-tight">{area.name}</h2>
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1">
              <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>
                {[area.district, area.regency, area.province].filter(Boolean).join(', ')}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-neutral-900">{area.score}</span>
              <span className="text-xs text-neutral-500 font-semibold">/ 100</span>
            </div>
            <span className="text-[11px] text-neutral-500 font-medium">Skor Risiko</span>
          </div>
        </div>
      </div>

      <PriorityTags area={area} />

      <UserInsideBanner area={area} />

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
          Alasan Penetapan Prioritas
        </span>
        <AreaReasonsPanel area={area} withDividers={false} translucent={translucent} />
      </div>

      {/* Laporan Warga Terkait */}
      <AreaCitizenReports area={area} />

      <AreaHotspotList area={area} translucent={translucent} />

      <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 pt-2 border-t border-neutral-200/60">
        <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <span>{area.lastUpdatedText}</span>
      </div>
    </div>
  )
}
