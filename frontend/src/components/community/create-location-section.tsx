import { Link } from "@tanstack/react-router";
import { MapPin, ExternalLink, Flame } from "lucide-react";

interface CreateLocationSectionProps {
  province: string;
  kabupaten: string;
  kecamatan: string;
  latitude: number;
  longitude: number;
  specificLocation?: string;
  onSpecificLocationChange?: (val: string) => void;
  detectedClusterCode?: string;
}

export function CreateLocationSection({
  province,
  kabupaten,
  kecamatan,
  latitude,
  longitude,
  specificLocation = "",
  onSpecificLocationChange,
  detectedClusterCode,
}: CreateLocationSectionProps) {
  return (
    <div className="space-y-3">
      {/* 1. Wilayah Administratif Sesuai Profil */}
      <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                Wilayah Domisili
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Sesuai Profil
              </span>
            </div>
            <p className="text-xs text-neutral-900 font-bold truncate mt-0.5">
              {[kecamatan, kabupaten, province].filter(Boolean).join(", ")}
            </p>
            <span className="text-[10px] text-neutral-400 font-mono block mt-0.5">
              Koordinat Wilayah: {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </span>
          </div>
        </div>

        <Link
          to="/profile"
          className="px-3 py-1.5 rounded-xl border border-neutral-200 hover:border-brand-500 text-neutral-600 hover:text-brand-600 text-xs font-bold transition flex items-center gap-1.5 shrink-0 bg-white cursor-pointer"
          title="Ubah domisili di profil"
        >
          <span>Ubah di Profil</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Indikator Deteksi Klaster Satelit Terhubung jika ada */}
      {detectedClusterCode && (
        <div className="px-3.5 py-2.5 rounded-xl bg-orange-50 border border-orange-200/90 flex items-center gap-2 text-orange-950 text-xs shadow-2xs">
          <Flame className="w-4 h-4 text-orange-600 shrink-0" />
          <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
            <span className="font-bold truncate">
              Terhubung ke {detectedClusterCode}
            </span>
            <span className="text-[10px] font-semibold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md shrink-0">
              Satelit NASA FIRMS
            </span>
          </div>
        </div>
      )}

      {/* 2. Detail Patokan / Alamat Lapangan */}
      {onSpecificLocationChange && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-neutral-800">
              Detail Patokan / Alamat Kejadian
            </label>
            <span className="text-[10px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
              Sangat Dianjurkan
            </span>
          </div>
          <input
            type="text"
            value={specificLocation}
            onChange={(e) => onSpecificLocationChange(e.target.value)}
            placeholder="Contoh: Desa Pembuang Hulu RT 03, Jl. Poros Km 5 dekat batas kebun sawit"
            className="w-full text-xs p-3.5 rounded-xl border border-neutral-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 leading-relaxed shadow-2xs"
          />
          <p className="text-[11px] text-neutral-500 leading-snug">
            Sebutkan nama desa, jalan, RT/RW, atau patokan terdekat agar regu pemadam BPBD dan relawan dapat langsung menuju ke titik lokasi kebakaran.
          </p>
        </div>
      )}
    </div>
  );
}
