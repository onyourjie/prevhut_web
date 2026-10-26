import { Link } from '@tanstack/react-router';
import { Flame, Shield } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="bg-white border-t border-neutral-200 text-neutral-600 py-12 sm:py-16 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white">
                <Flame className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-neutral-900">FIREZONE</span>
            </Link>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-sm leading-relaxed font-normal">
              Portal pemantauan spasial terbuka dan penanggulangan kebakaran hutan dan lahan (Karhutla)
              Kalimantan. Mengintegrasikan data satelit NASA FIRMS dengan verifikasi lapangan warga.
            </p>
            <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Inisiatif Kesiapsiagaan Posko BPBD Kalimantan</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Navigasi Utama</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/map" className="hover:text-orange-600 transition">
                  Peta Titik Panas Satelit
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-orange-600 transition">
                  Feed Kabar Komunitas
                </Link>
              </li>
              <li>
                <Link to="/community/create" className="hover:text-orange-600 transition">
                  Lapor Titik Api (Kamera Live)
                </Link>
              </li>
              <li>
                <Link to="/emergency" className="hover:text-orange-600 transition">
                  Pusat Layanan Darurat
                </Link>
              </li>
            </ul>
          </div>

          {/* Source Attribution */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Sumber Data Resmi</h4>
            <ul className="space-y-2 text-xs text-neutral-500">
              <li>• NASA FIRMS (VIIRS SNPP & NOAA-20)</li>
              <li>• Badan Informasi Geospasial (BIG)</li>
              <li>• BMKG (Data Cuaca & Kelembaban)</li>
              <li>• Laporan Terverifikasi Warga Lapangan</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© 2026 FIREZONE. Hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-4">
            <Link to="/map" className="hover:text-neutral-900 transition">
              Akses Data Terbuka
            </Link>
            <span>•</span>
            <Link to="/emergency" className="hover:text-neutral-900 transition">
              Protokol Siaga
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
