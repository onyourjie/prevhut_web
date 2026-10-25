import { Link } from '@tanstack/react-router'
import { MapPin, ChevronRight, Flame, Sun } from 'lucide-react'

interface LocationStatusCardProps {
  displayLocation: string
  displayProvince: string
  isPerhatianKhusus: boolean
  totalHotspots: number
  weatherText: string
  tempText: string
  humidityText: string
}

export function LocationStatusCard({
  displayLocation,
  displayProvince,
  isPerhatianKhusus,
  totalHotspots,
  weatherText,
  tempText,
  humidityText,
}: LocationStatusCardProps) {
  return (
    <div className="space-y-3">
      {/* CURRENT LOCATION BAR */}
      <Link
        to="/map"
        className="p-3.5 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-300 shadow-2xs flex items-center justify-between transition group"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs text-neutral-900 group-hover:text-brand-700 transition">
              {displayLocation}, {displayProvince}
            </div>
            <p className="text-[11px] text-neutral-400 font-medium">
              Lokasi pemantauan saat ini • Ketuk untuk lihat peta
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 transition" />
      </Link>

      {/* STATUS WILAYAH */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Status Wilayah Anda
            </span>
            <span className="font-extrabold text-sm text-neutral-900">
              {isPerhatianKhusus ? 'Perhatian Khusus' : 'Waspada Sedang'}
            </span>
          </div>

          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-600 border border-neutral-200">
            Live Satelit & Cuaca
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 font-bold uppercase block">
                Titik Panas Satelit
              </span>
              <span className="text-sm font-extrabold text-neutral-900 block">
                {totalHotspots} Hotspot
              </span>
              <span className="text-[10px] text-neutral-400">Observasi Terakhir</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 font-bold uppercase block">
                Cuaca Sekitar
              </span>
              <span className="text-sm font-extrabold text-neutral-900 block">
                {weatherText} • {tempText}
              </span>
              <span className="text-[10px] text-neutral-400">{humidityText}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
