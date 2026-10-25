import { Link } from '@tanstack/react-router'
import { Info, RefreshCw, ArrowRight, ChevronRight } from 'lucide-react'
import type { PriorityArea } from '@/features/hotspots/schemas'

interface VolunteerPrioritySectionProps {
  isLoadingAreas: boolean
  topAreas: PriorityArea[]
}

export function VolunteerPrioritySection({ isLoadingAreas, topAreas }: VolunteerPrioritySectionProps) {
  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-neutral-900 tracking-tight">
          Prioritas Titik Panas
        </h3>
        <Link
          to="/map"
          className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1"
        >
          <span>Buka Peta</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200/80 flex items-center gap-2.5 text-xs text-amber-900">
        <Info className="w-4 h-4 text-amber-600 shrink-0" />
        <span className="font-medium">
          Titik panas belum berarti kebakaran terkonfirmasi.
        </span>
      </div>

      <div className="space-y-3">
        {isLoadingAreas ? (
          <div className="p-6 rounded-2xl bg-white border border-neutral-200 text-center text-xs text-neutral-400 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-brand-600" />
            <span>Sinkronisasi area prioritas satelit...</span>
          </div>
        ) : topAreas.length > 0 ? (
          topAreas.map((area) => (
            <div
              key={area.id}
              className="p-4 rounded-2xl bg-white border border-neutral-200 hover:border-red-300 shadow-2xs transition space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      area.priority === 'P1'
                        ? 'bg-red-600'
                        : area.priority === 'P2'
                        ? 'bg-amber-500'
                        : 'bg-purple-600'
                    }`}
                  />
                  <h4 className="font-extrabold text-xs text-neutral-900">
                    {area.name}
                  </h4>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                    area.priority === 'P1'
                      ? 'bg-red-100 text-red-800 border-red-200'
                      : area.priority === 'P2'
                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                      : 'bg-purple-100 text-purple-800 border-purple-200'
                  }`}
                >
                  {area.priority} • {area.priorityLabel}
                </span>
              </div>

              <p className="text-[11px] text-neutral-500">
                {[area.district, area.regency, area.province].filter(Boolean).join(', ')}
              </p>

              <div className="flex items-center justify-between text-xs text-neutral-600 pt-1 border-t border-neutral-100">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-neutral-900">
                    {area.hotspotCount} titik panas
                  </span>
                  <span className="text-neutral-300">•</span>
                  <span className="text-[11px] text-neutral-500">
                    Skor Risiko {area.score}
                  </span>
                </div>

                <Link
                  to="/map"
                  className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1"
                >
                  <span>Lihat detail</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="text-[10px] text-neutral-400">
                {area.lastUpdatedText} • {area.reasons.primaryFactor}
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-center text-xs text-neutral-500">
            Tidak ada area prioritas kritis saat ini. Wilayah dalam kondisi aman terkendali.
          </div>
        )}
      </div>

      <Link
        to="/map"
        className="w-full py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition flex items-center justify-center gap-2"
      >
        <span>Lihat Seluruh Area Pantau di Peta Interaktif</span>
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
