import { createFileRoute, Link } from '@tanstack/react-router';
import {
  Flame,
  Users,
  ArrowRight,
  AlertTriangle,
  Radio,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/store/auth.store';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <AppLayout
      title="Dasbor Karhutla"
      subtitle="Sistem Intelijen Titik Panas & Tanggap Bencana Warga"
    >
      <div className="max-w-3xl mx-auto space-y-6 text-left">
        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-brand-950 text-white p-6 sm:p-8 shadow-xl border border-neutral-800">
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-300 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
              <span>Satelit NASA FIRMS Terpantau Aktif</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white max-w-xl">
              Deteksi Dini Bahaya Kebakaran Lahan & Transparansi Publik Kalimantan
            </h1>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-lg">
              Integrasi klastering geospasial DBSCAN satelit FIRMS dengan verifikasi kamera langsung warga (*crowd intelligence*) dan sistem penugasan relawan lapangan.
            </p>

            <div className="pt-2 flex flex-wrap gap-2.5">
              <Link
                to="/community"
                className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm"
              >
                <Users className="w-4 h-4" />
                <span>Buka Feed Komunitas</span>
              </Link>
              <Link
                to="/community/create"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition flex items-center gap-2"
              >
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Lapor Titik Api Sekarang</span>
              </Link>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-64 h-64 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Quick Access Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link to="/community" className="block group">
            <div className="p-4 rounded-2xl bg-white border border-neutral-200 hover:border-brand-500 hover:shadow-md transition space-y-2">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-105 transition">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-extrabold text-neutral-900 group-hover:text-brand-700 transition">
                Kabar Komunitas
              </h3>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                Pantau laporan warga sekitar, foto langsung kejadian, & perkembangan pemadaman.
              </p>
            </div>
          </Link>

          <Link to="/community/create" className="block group">
            <div className="p-4 rounded-2xl bg-white border border-neutral-200 hover:border-red-500 hover:shadow-md transition space-y-2">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-105 transition">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-extrabold text-neutral-900 group-hover:text-red-700 transition">
                Lapor Darurat
              </h3>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                Laporkan titik asap dengan simulasi kamera langsung & deteksi GPS otomatis.
              </p>
            </div>
          </Link>

          <Link to="/emergency" className="block group">
            <div className="p-4 rounded-2xl bg-white border border-neutral-200 hover:border-emerald-500 hover:shadow-md transition space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-extrabold text-neutral-900 group-hover:text-emerald-700 transition">
                Kontak Siaga 113
              </h3>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                Panggilan cepat bebas pulsa Pemadam Kebakaran, Tim SAR, Polisi, dan Ambulans.
              </p>
            </div>
          </Link>
        </div>

        {/* User Card if Logged in */}
        {isAuthenticated && user && (
          <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={
                  user.avatarUrl ||
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80'
                }
                alt={user.name}
                className="w-11 h-11 rounded-full object-cover border border-neutral-200"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-xs text-neutral-900">{user.name}</h4>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold uppercase bg-brand-100 text-brand-800">
                    {user.role}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  {user.kabupaten || 'Kabupaten Sintang'}, {user.province || 'Kalimantan Barat'}
                </p>
              </div>
            </div>

            <Link
              to="/profile"
              className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1"
            >
              <span>Lihat Profil</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* UI Kit & Documentation Link */}
        <Card className="flex items-center justify-between p-4">
          <div>
            <h4 className="text-xs font-bold text-neutral-900">Etalase UI Kit & Token Warna</h4>
            <p className="text-[11px] text-neutral-500">
              Desain sistem, tipografi Plus Jakarta Sans, dan komponen sesuai mockup Figma.
            </p>
          </div>
          <Link
            to="/ui-kit"
            className="px-3 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-bold text-neutral-700 transition"
          >
            Buka UI Kit
          </Link>
        </Card>
      </div>
    </AppLayout>
  );
}
