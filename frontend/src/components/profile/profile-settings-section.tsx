import { Link } from '@tanstack/react-router';
import { Navigation, Info, Globe, HelpCircle, LogOut, ChevronRight } from 'lucide-react';

interface ProfileSettingsSectionProps {
  gpsActive: boolean;
  onToggleGps: () => void;
  onLogout: () => void;
}

export function ProfileSettingsSection({
  gpsActive,
  onToggleGps,
  onLogout,
}: ProfileSettingsSectionProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-extrabold text-neutral-800 uppercase tracking-wider px-1">
        Pengaturan
      </h3>

      <div className="bg-white rounded-2xl border border-neutral-200 divide-y divide-neutral-100 overflow-hidden shadow-xs">
        {/* GPS Selalu Aktif */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-800">GPS Selalu Aktif</h4>
              <p className="text-[10px] text-neutral-500">
                {gpsActive ? 'Lokasi diperbarui otomatis via satelit' : 'Ketuk tombol untuk aktifkan GPS'}
              </p>
            </div>
          </div>

          {/* Toggle switch with solid vivid colors */}
          <button
            type="button"
            onClick={onToggleGps}
            className="w-12 h-6 rounded-full transition duration-200 ease-in-out relative p-0.5"
            style={{ backgroundColor: gpsActive ? '#eb5314' : '#d1d5db' }}
            aria-label="Toggle GPS Selalu Aktif"
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                gpsActive ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Tentang FIREZONE */}
        <Link
          to="/about"
          className="p-4 flex items-center justify-between hover:bg-neutral-50 transition cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 group-hover:bg-orange-50 group-hover:text-orange-600 text-neutral-700 flex items-center justify-center transition">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-800 block">Tentang FIREZONE</span>
              <span className="text-[10px] text-neutral-500">Misi, arsitektur sistem & data satelit</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 transition" />
        </Link>

        {/* Bahasa */}
        <div className="p-4 flex items-center justify-between hover:bg-neutral-50 transition">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-700 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-neutral-800">Bahasa</span>
          </div>
          <span className="text-xs text-neutral-600 font-semibold">Indonesia</span>
        </div>

        {/* Bantuan */}
        <Link
          to="/faq"
          className="p-4 flex items-center justify-between hover:bg-neutral-50 transition cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 group-hover:bg-orange-50 group-hover:text-orange-600 text-neutral-700 flex items-center justify-center transition">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-800 block">Bantuan & FAQ</span>
              <span className="text-[10px] text-neutral-500">Metodologi & pertanyaan umum</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 transition" />
        </Link>

        {/* Keluar */}
        <div
          onClick={onLogout}
          className="p-4 flex items-center justify-between hover:bg-red-50 text-red-600 transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold">Keluar dari Akun</span>
          </div>
          <ChevronRight className="w-4 h-4 text-red-400" />
        </div>
      </div>
    </div>
  );
}
