import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, LogOut, Shield, Users, ShieldAlert, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BottomNav } from "@/components/layout/bottom-nav";
import { useAuthStore } from "@/store/auth.store";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { user, isAuthenticated, logout } = useAuthStore();

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-neutral-900 text-white">
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            ADMIN POSKO
          </span>
        );
      case "RELAWAN":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent-100 text-accent-950 border border-accent-300">
            <Shield className="w-3 h-3 text-accent-700" />
            RELAWAN
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-100 text-brand-900 border border-brand-300">
            <Users className="w-3 h-3 text-brand-700" />
            WARGA
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-1000 flex flex-col pb-20">
      <header className="border-b border-neutral-200 px-4 py-3 bg-white flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
            <Flame className="w-4 h-4" />
          </div>
          <h1 className="text-base font-extrabold tracking-tight text-neutral-1000">FIREZONE</h1>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold leading-tight">{user.name}</span>
                <span className="text-[10px] text-neutral-500 font-mono">@{user.username}</span>
              </div>
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-bold text-neutral-700 hover:text-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 px-3 py-1.5 rounded-lg shadow-sm transition"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-8 flex flex-col gap-6 text-left">
        {/* User active banner */}
        {isAuthenticated && user && (
          <div className="p-4 rounded-2xl bg-white border border-brand-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={
                  user.avatarUrl ||
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80"
                }
                alt={user.name}
                className="w-12 h-12 rounded-xl object-cover border border-neutral-200"
              />
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-bold text-sm text-neutral-900">{user.name}</h3>
                  {getRoleBadge(user.role)}
                </div>
                <p className="text-xs text-neutral-500 font-mono">@{user.username} • {user.email}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
            Sistem Peringatan Dini Karhutla
          </span>
          <h2 className="text-2xl font-extrabold text-neutral-1000 tracking-tight">
            Informasi Titik Panas & Tanggap Kebakaran Kalimantan
          </h2>
          <p className="text-sm text-neutral-700 leading-relaxed">
            Platform web tanggap bencana berbasis mobile-first untuk memantau titik panas satelit NASA FIRMS,
            laporan warga dengan live camera & GPS, dan koordinasi cepat relawan lapangan.
          </p>
        </div>

        {/* Quick Auth Cards */}
        {!isAuthenticated && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/register" className="block">
              <div className="p-4 rounded-xl border-2 border-brand-200 bg-white hover:border-brand-500 transition group shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition">
                    <Flame className="w-4 h-4" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-brand-600 transition" />
                </div>
                <h4 className="font-bold text-sm text-neutral-900 mb-1">Daftar Akun Baru</h4>
                <p className="text-xs text-neutral-500">Pilih peran Warga atau Relawan Lapangan.</p>
              </div>
            </Link>

            <Link to="/login" className="block">
              <div className="p-4 rounded-xl border-2 border-neutral-200 bg-white hover:border-neutral-400 transition group shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-700 flex items-center justify-center group-hover:bg-neutral-800 group-hover:text-white transition">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-800 transition" />
                </div>
                <h4 className="font-bold text-sm text-neutral-900 mb-1">Masuk ke Akun Anda</h4>
                <p className="text-xs text-neutral-500">Akses dasbor pemantauan karhutla.</p>
              </div>
            </Link>
          </div>
        )}

        <Card className="flex flex-col gap-3 border-2 border-brand-500/30 bg-gradient-to-b from-brand-50/40 to-white shadow-sm">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-xs">
              <Flame className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 border border-brand-200">
              FITUR BARU
            </span>
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-bold text-neutral-1000">Peta Sebaran Titik Panas</h3>
            <p className="text-xs text-neutral-600 leading-relaxed mt-1">
              Pantau 10 Area Pantau Prioritas di Kabupaten Sintang dengan status risiko P1, P2, P3, analisis FRP, dan filter wilayah interaktif.
            </p>
          </div>
          <Link to="/map" className="w-full">
            <Button variant="primary" size="long" className="w-full">
              Buka Peta Interaktif
            </Button>
          </Link>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
}
