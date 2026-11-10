import { useState, useEffect, useRef } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Map,
  Users,
  PhoneCall,
  Menu,
  X,
  HelpCircle,
  Home,
  PlusCircle,
  LogOut,
  User,
  ChevronDown,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/lib/utils';
import { NotificationBell } from './NotificationBell';

export interface TopNavbarProps {
  className?: string;
}

export function TopNavbar({ className }: TopNavbarProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const isUserLoggedIn = Boolean(isAuthenticated && user);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Tutup dropdown profile saat klik di luar atau menekan tombol Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setProfileMenuOpen(false);
      }
    };

    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [profileMenuOpen]);

  // Tutup dropdown jika berpindah halaman
  useEffect(() => {
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
  }, [currentPath]);

  const navLinks = [
    {
      to: '/',
      label: 'Beranda',
      icon: <Home className="w-3.5 h-3.5 text-neutral-600" />,
      exact: true,
    },
    {
      to: '/map',
      label: 'Peta Sebaran Api',
      icon: <Map className="w-3.5 h-3.5 text-orange-600" />,
    },
    {
      to: '/community',
      label: 'Kabar Warga',
      icon: <Users className="w-3.5 h-3.5 text-blue-600" />,
    },
    {
      to: '/emergency',
      label: 'Siaga 24 Jam',
      icon: <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />,
    },
    {
      to: '/faq',
      label: 'FAQ & Metodologi',
      icon: <HelpCircle className="w-3.5 h-3.5 text-neutral-500" />,
    },
  ];

  return (
    <header
      className={cn(
        'fixed left-0 w-full z-50 transition-all duration-300 flex justify-center',
        // Jika sudah login: jangan pernah jadi resizable island, tetap stick full-width di atas
        isUserLoggedIn
          ? 'top-0 px-0'
          : isScrolled
          ? 'top-3 md:top-4 px-4 sm:px-6'
          : 'top-0 px-0',
        className
      )}
    >
      {/* Background Container */}
      <div
        className={cn(
          'w-full transition-all duration-300 bg-white/95 backdrop-blur-2xl flex justify-center items-center',
          // Jika sudah login: bar tetap full width tanpa rounded capsule
          isUserLoggedIn
            ? cn(
                'max-w-full rounded-none border-b py-3 px-4 sm:px-8',
                isScrolled
                  ? 'border-neutral-200/90 shadow-xs bg-white/98'
                  : 'border-neutral-200/70 shadow-none'
              )
            : isScrolled
            ? 'max-w-6xl rounded-2xl border border-neutral-200/90 shadow-xl shadow-neutral-900/5 py-2.5 md:py-3 px-4 sm:px-6'
            : 'max-w-full rounded-none border-b border-neutral-200/80 shadow-none py-3.5 sm:py-4 px-4 sm:px-8'
        )}
      >
        <div className="w-full flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={(e) => {
              if (currentPath === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-2.5 group relative z-10"
          >
            <img
              src="/logo-firezone.png"
              alt="FIREZONE Logo"
              className="w-9 h-9 rounded-xl object-contain shadow-xs group-hover:scale-105 transition-transform duration-200"
            />
            <div>
              <span className="font-heading font-bold text-base sm:text-lg text-neutral-900 tracking-tight group-hover:text-orange-600 transition block">
                FIREZONE
              </span>
              <p className="text-[10px] text-neutral-500 font-medium hidden sm:block leading-none mt-0.5">
                Portal Tanggap Darurat Karhutla
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links: Seamless & Unified directly on navbar surface */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = link.exact
                ? currentPath === link.to
                : currentPath === link.to || (link.to !== '/' && currentPath.startsWith(link.to));

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 group',
                    isActive
                      ? 'text-neutral-950 font-bold bg-neutral-100/80'
                      : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100/50'
                  )}
                >
                  <span className={cn('transition-colors', isActive ? 'text-orange-600' : 'text-neutral-500 group-hover:text-neutral-800')}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action & Controls Area */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {isAuthenticated && user ? (
              <>
                {/* Tombol Cepat Lapor Titik Api untuk Warga */}
                {currentPath !== '/profile' && (
                  <Link
                    to="/community/create"
                    className="h-9 px-3 sm:px-3.5 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-xs active:scale-98 transition duration-150 flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Lapor Api</span>
                  </Link>
                )}

                {/* Notification Bell with FCM Push Status */}
                <NotificationBell />

                {/* User Identity Pill dengan Dropdown Profil & Logout */}
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setProfileMenuOpen((prev) => !prev)}
                    className={cn(
                      'relative flex items-center gap-2 pl-1 pr-1.5 sm:pr-3 py-1 rounded-full sm:rounded-2xl border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 cursor-pointer select-none',
                      profileMenuOpen
                        ? 'bg-orange-50/80 border-orange-300 ring-2 ring-orange-500/20 shadow-xs'
                        : 'bg-white hover:bg-neutral-50/90 border-neutral-200/90 hover:border-neutral-300 shadow-2xs'
                    )}
                    aria-expanded={profileMenuOpen}
                    aria-haspopup="true"
                    aria-label="Menu Identitas Warga"
                  >
                    {/* Foto Profil Lingkaran / Squircle */}
                    <div className="relative w-8 h-8 rounded-full sm:rounded-xl overflow-hidden shrink-0 border border-neutral-200/80 bg-neutral-100">
                      <img
                        src={
                          user.avatarUrl ||
                          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80'
                        }
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1.5 ring-white" />
                    </div>

                    {/* Info Teks Identitas Warga (Desktop & Tablet) */}
                    <div className="hidden sm:flex flex-col text-left min-w-0 max-w-[120px] md:max-w-[150px]">
                      <span className="text-xs font-bold text-neutral-900 truncate leading-tight">
                        {user.name}
                      </span>
                      <span className="text-[10px] font-semibold text-orange-700 truncate leading-tight mt-0.5">
                        {user.kabupaten
                          ? `Warga ${user.kabupaten.replace('Kabupaten ', '')}`
                          : user.province
                          ? `Warga ${user.province}`
                          : 'Warga Terdaftar'}
                      </span>
                    </div>

                    {/* Chevron Indicator */}
                    <ChevronDown
                      className={cn(
                        'w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 shrink-0 hidden sm:block',
                        profileMenuOpen && 'rotate-180 text-orange-600'
                      )}
                    />
                  </button>

                  {/* Dropdown Menu Ringkas (Tanpa Header Redundan) */}
                  <AnimatePresence>
                    {profileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-neutral-200/90 shadow-lg shadow-neutral-900/10 p-1.5 z-50 overflow-hidden"
                      >
                        {/* Identitas Email Ringkas */}
                        <div className="px-2.5 py-1.5 border-b border-neutral-100 mb-1 text-left">
                          <p className="text-[11px] font-medium text-neutral-500 truncate">
                            {user.email || 'Akun Warga'}
                          </p>
                        </div>

                        {/* Opsi Menu */}
                        <div className="flex flex-col gap-0.5">
                          <Link
                            to="/profile"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 transition duration-150"
                          >
                            <User className="w-3.5 h-3.5 text-neutral-500" />
                            <span>Profil Saya</span>
                          </Link>

                          <div className="h-px bg-neutral-100 my-1" />

                          <button
                            type="button"
                            onClick={() => {
                              setProfileMenuOpen(false);
                              logout();
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50/80 transition duration-150 text-left cursor-pointer"
                          >
                            <LogOut className="w-3.5 h-3.5 text-red-500" />
                            <span>Keluar</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              currentPath !== '/profile' && (
                <>
                  <Link
                    to="/login"
                    className="hidden sm:inline-flex h-9 items-center justify-center px-4 rounded-xl text-xs font-bold text-neutral-800 bg-white hover:bg-neutral-50 border border-neutral-300 shadow-2xs transition"
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/community/create"
                    className="h-9 inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-xs active:scale-98 transition"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Lapor Api</span>
                  </Link>
                </>
              )
            )}

            {/* Hamburger Button (Khusus Tablet & Mobile: lg:hidden) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-neutral-700 hover:bg-neutral-100 transition lg:hidden focus:outline-hidden cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-4 right-4 mt-2 bg-white rounded-2xl border border-neutral-200 shadow-2xl p-4 lg:hidden z-50 text-left"
          >
            {/* User Info if logged in */}
            {isAuthenticated && user && (
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2.5">
                  <img
                    src={
                      user.avatarUrl ||
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80'
                    }
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border border-neutral-200"
                  />
                  <div>
                    <p className="text-xs font-bold text-neutral-900">{user.name}</p>
                    <span className="text-[10px] font-semibold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">
                      {user.kabupaten
                        ? `Warga ${user.kabupaten.replace('Kabupaten ', '')}`
                        : user.province
                        ? `Warga ${user.province}`
                        : 'Warga Terdaftar'}
                    </span>
                  </div>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-neutral-500 hover:text-neutral-900"
                >
                  <User className="w-4 h-4" />
                </Link>
              </div>
            )}

            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition',
                    currentPath === link.to
                      ? 'bg-orange-50 text-orange-800 font-bold'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  )}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>

            <div className="pt-3 mt-3 border-t border-neutral-100 flex flex-col gap-2">
              {isAuthenticated && user ? (
                <>
                  <Link
                    to="/community/create"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 px-4 rounded-xl text-center text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 flex items-center justify-center gap-2 transition"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Lapor Temuan Kamera HP</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full py-2 px-4 rounded-xl text-center text-xs font-semibold text-neutral-600 hover:text-red-600 hover:bg-red-50 flex items-center justify-center gap-2 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar Akun</span>
                  </button>
                </>
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
                    <span>Lapor Temuan Kamera HP</span>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
