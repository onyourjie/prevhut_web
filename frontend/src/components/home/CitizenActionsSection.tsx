import { Link } from '@tanstack/react-router'
import { BookOpen, PhoneCall, Flame, Users, ChevronRight } from 'lucide-react'
import type { PriorityArea } from '@/features/hotspots/schemas'

interface CitizenActionsSectionProps {
  weatherText: string
  totalHotspots: number
  tempText: string
  displayLocation: string
  topCluster?: PriorityArea
  observedAt?: string
  lastSyncTime: string
  onOpenEvacuationModal: () => void
  onOpenEmergencyModal: () => void
}

export function CitizenActionsSection({
  weatherText,
  totalHotspots,
  tempText,
  displayLocation,
  topCluster,
  observedAt,
  lastSyncTime,
  onOpenEvacuationModal,
  onOpenEmergencyModal,
}: CitizenActionsSectionProps) {
  return (
    <div className="space-y-4">
      {/* KONDISI SEKITAR KAMU */}
      <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
        <h3 className="text-xs font-extrabold text-neutral-800 uppercase tracking-wider">
          Kondisi Sekitar Kamu
        </h3>

        <div className="space-y-1.5">
          <h4 className="font-extrabold text-sm text-neutral-900">
            Cuaca {weatherText.toLowerCase()}, {totalHotspots} titik panas terpantau satelit.
          </h4>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Suhu sekitar {tempText}. Dalam pengamatan satelit NASA FIRMS terakhir, terpantau total {totalHotspots} titik panas di {displayLocation} dan sekitarnya.
            {topCluster ? ` Area pantau tertinggi adalah ${topCluster.name} (${topCluster.district}) dengan skor risiko ${topCluster.score}.` : ''}
          </p>
        </div>

        <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2 text-[10px] text-neutral-400">
          <span>Sumber Cuaca: Stasiun Meteorologi • {observedAt || 'WIB'}</span>
          <span>Sumber Titik Panas: {lastSyncTime}</span>
        </div>
      </div>

      {/* AKSI CEPAT TANGGAP */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold text-neutral-800 uppercase tracking-wider px-1">
          Aksi Cepat Tanggap
        </h3>

        <button
          type="button"
          onClick={onOpenEvacuationModal}
          className="w-full p-4 rounded-2xl bg-white border border-neutral-200 hover:border-brand-500 hover:shadow-md transition text-left flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-neutral-900 group-hover:text-brand-700 transition">
                Protokol & Panduan Evakuasi Cepat
              </h4>
              <p className="text-[11px] text-neutral-500">
                5 Langkah keselamatan diri saat kabut asap & kebakaran lahan mendekat
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 transition" />
        </button>

        <button
          type="button"
          onClick={onOpenEmergencyModal}
          className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-red-600 to-brand-600 hover:from-red-700 hover:to-brand-700 text-white font-extrabold text-sm shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer"
        >
          <PhoneCall className="w-5 h-5 animate-pulse" />
          <span>Panggil Bantuan Darurat (113 Damkar, 115 SAR)</span>
        </button>
      </div>

      {/* SHORTCUT LAPOR TITIK API */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <Link to="/community/create" className="block group">
          <div className="p-4 rounded-2xl bg-white border border-neutral-200 hover:border-red-500 hover:shadow-md transition space-y-2">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-105 transition">
              <Flame className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-extrabold text-neutral-900 group-hover:text-red-700 transition">
              Lapor Titik Api
            </h4>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Kamera langsung & deteksi GPS otomatis untuk verifikasi posko.
            </p>
          </div>
        </Link>

        <Link to="/community" className="block group">
          <div className="p-4 rounded-2xl bg-white border border-neutral-200 hover:border-orange-500 hover:shadow-md transition space-y-2">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-105 transition">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-extrabold text-neutral-900 group-hover:text-orange-700 transition">
              Kabar Warga
            </h4>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Lihat kabar warga, status penanganan relawan, & kolom komentar.
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
