import { Link } from "@tanstack/react-router";
import { MapPin, ExternalLink } from "lucide-react";

interface CreateLocationSectionProps {
  province: string;
  kabupaten: string;
  kecamatan: string;
  latitude: number;
  longitude: number;
}

export function CreateLocationSection({
  province,
  kabupaten,
  kecamatan,
  latitude,
  longitude,
}: CreateLocationSectionProps) {
  return (
    <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-between gap-3 shadow-2xs">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
          <MapPin className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
              Lokasi Laporan
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
            Koordinat: {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </span>
        </div>
      </div>

      <Link
        to="/profile"
        className="px-3 py-1.5 rounded-xl border border-neutral-200 hover:border-brand-500 text-neutral-600 hover:text-brand-600 text-xs font-bold transition flex items-center gap-1.5 shrink-0 bg-white"
        title="Ubah domisili di profil"
      >
        <span>Ubah di Profil</span>
        <ExternalLink className="w-3 h-3" />
      </Link>
    </div>
  );
}
