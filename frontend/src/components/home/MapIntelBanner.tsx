import { Link } from '@tanstack/react-router'
import { Flame, ArrowRight } from 'lucide-react'

interface MapIntelBannerProps {
  totalAreas: number
  displayLocation: string
}

export function MapIntelBanner({ totalAreas, displayLocation }: MapIntelBannerProps) {
  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 text-white shadow-xl border border-neutral-800 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-500 text-white flex items-center justify-center">
            <Flame className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-xs tracking-wide">
            Peta Intelijen Karhutla
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-brand-300 border border-white/10">
          Live Satelit NASA
        </span>
      </div>

      <div>
        <h4 className="font-extrabold text-sm text-white">
          Pantau {totalAreas} Area Prioritas di {displayLocation}
        </h4>
        <p className="text-xs text-neutral-300 leading-relaxed mt-1">
          Visualisasi klaster titik panas DBSCAN, intensitas FRP (Fire Radiative Power), arah angin, dan radius bahaya pemukiman.
        </p>
      </div>

      <Link
        to="/map"
        className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30"
      >
        <span>Buka Peta Sebaran Lengkap</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
