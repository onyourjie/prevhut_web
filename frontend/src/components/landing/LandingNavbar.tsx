import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame,
  Map,
  Users,
  PhoneCall,
  PlusCircle,
  Menu,
  X,
  LayoutDashboard,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

export function LandingNavbar() {
  const { user, isAuthenticated } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex justify-center ${
        isScrolled ? 'top-3 md:top-4 px-4 sm:px-6' : 'top-0 px-0'
      }`}
    >
      {/* Background Pill: Seamlessly resizes from full-width border-b to a floating island capsule */}
      <div
        className={`w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] bg-white/90 backdrop-blur-2xl flex justify-center items-center ${
          isScrolled
            ? 'max-w-5xl rounded-2xl border border-neutral-200/90 shadow-xl shadow-neutral-900/5 py-2.5 md:py-3 px-4 sm:px-6'
            : 'max-w-full rounded-none border-b border-neutral-200/70 shadow-none py-3.5 sm:py-4 px-4 sm:px-8'
        }`}
      >
        <div className="w-full flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-2.5 group relative z-10"
          >
            <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold shadow-md shadow-orange-600/20 group-hover:scale-105 transition-transform duration-200">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-base sm:text-lg text-neutral-900 tracking-tight group-hover:text-orange-600 transition">
                  FIREZONE
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-orange-100 text-orange-800 border border-orange-200">
                  KALIMANTAN
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 font-medium hidden sm:block leading-none mt-0.5">
                Portal Tanggap Darurat Karhutla
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-neutral-100/70 border border-neutral-200/80 p-1 rounded-xl">
            <a
              href="#tentang"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-700 hover:text-neutral-900 hover:bg-white transition"
            >
              Kondisi Lapangan
            </a>
            <a
              href="#cara-kerja"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-700 hover:text-neutral-900 hover:bg-white transition"
            >
              Alur Tanggap Darurat
            </a>
            <Link
              to="/map"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-700 hover:text-neutral-900 hover:bg-white transition flex items-center gap-1.5"
            >
              <Map className="w-3.5 h-3.5 text-orange-600" />
              <span>Peta Sebaran Api</span>
            </Link>
            <Link
              to="/community"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-700 hover:text-neutral-900 hover:bg-white transition flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>Kabar Warga</span>
            </Link>
            <Link
              to="/emergency"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-700 hover:text-neutral-900 hover:bg-white transition flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span>Siaga 24 Jam</span>
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-100 border border-neutral-200 hover:bg-neutral-200/60 transition"
                >
                  <img
                    src={
                      user.avatarUrl ||
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80'
                    }
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-xs font-bold text-neutral-900">{user.name.split(' ')[0]}</span>
                </Link>

                <Link
                  to="/"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-xs transition"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition"
                >
                  Masuk
                </Link>
                <Link
                  to="/community/create"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-xs active:scale-95 transition"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Lapor Titik Api</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 hover:text-neutral-900 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Floating Island Dropdown) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden absolute top-[calc(100%+0.5rem)] left-0 w-full px-4 flex justify-center pointer-events-auto"
          >
            <div className="w-full max-w-5xl bg-white/95 backdrop-blur-3xl border border-neutral-200/90 shadow-2xl p-5 rounded-2xl flex flex-col gap-3">
              <a
                href="#tentang"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-sm font-semibold text-neutral-800 hover:bg-neutral-100 transition"
              >
                Kondisi Lapangan
              </a>
              <a
                href="#cara-kerja"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-sm font-semibold text-neutral-800 hover:bg-neutral-100 transition"
              >
                Alur Tanggap Darurat
              </a>
              <Link
                to="/map"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-neutral-800 hover:bg-neutral-100 transition"
              >
                <Map className="w-4 h-4 text-orange-600" />
                <span>Peta Titik Panas Satelit</span>
              </Link>
              <Link
                to="/community"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-neutral-800 hover:bg-neutral-100 transition"
              >
                <Users className="w-4 h-4 text-blue-600" />
                <span>Kabar Warga & Komunitas</span>
              </Link>
              <Link
                to="/emergency"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-neutral-800 hover:bg-neutral-100 transition"
              >
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                <span>Kontak Siaga 24 Jam</span>
              </Link>

              <div className="pt-3 border-t border-neutral-200 flex flex-col gap-2">
                {isAuthenticated ? (
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 px-4 rounded-xl text-center text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 transition"
                  >
                    Buka Dashboard Pengguna
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-2.5 px-4 rounded-xl text-center text-sm font-bold text-neutral-800 bg-neutral-100 border border-neutral-200 hover:bg-neutral-200 transition"
                    >
                      Masuk Akun
                    </Link>
                    <Link
                      to="/community/create"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-2.5 px-4 rounded-xl text-center text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 flex items-center justify-center gap-2 transition"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Lapor Titik Api Lapangan</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
