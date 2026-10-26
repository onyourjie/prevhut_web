import React from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import {
  Flame,
  Home,
  Map,
  Users,
  PlusCircle,
  Shield,
  PhoneCall,
  User,
  LogOut,
  ChevronRight,
  ClipboardList,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/lib/utils';

export interface NavItemDef {
  to: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  roles?: ('WARGA' | 'RELAWAN' | 'ADMIN')[];
}

export const navItems: NavItemDef[] = [
  {
    to: '/',
    label: 'Beranda',
    description: 'Status wilayah & peringatan dini',
    icon: <Home className="w-5 h-5 text-brand-600" />,
  },
  {
    to: '/map',
    label: 'Peta',
    description: 'Peta klaster titik panas NASA FIRMS',
    icon: <Map className="w-5 h-5 text-orange-600" />,
  },
  {
    to: '/community',
    label: 'Komunitas',
    description: 'Kabar warga & unggahan darurat',
    icon: <Users className="w-5 h-5 text-accent-600" />,
    badge: 'Feed',
  },
  {
    to: '/community/create',
    label: 'Lapor Titik Api',
    description: 'Kamera langsung & verifikasi GPS',
    icon: <PlusCircle className="w-5 h-5 text-red-600" />,
    badge: 'Darurat',
  },
  {
    to: '/reports',
    label: 'Laporan',
    description: 'Manajemen insiden & disposisi relawan',
    icon: <ClipboardList className="w-5 h-5 text-blue-600" />,
    badge: 'Posko',
    roles: ['ADMIN'], // Khusus Admin Posko
  },
  {
    to: '/assignments',
    label: 'Penugasan Relawan',
    description: 'Disposisi lapangan tim posko BPBD',
    icon: <Shield className="w-5 h-5 text-emerald-600" />,
    roles: ['RELAWAN', 'ADMIN'], // Khusus Relawan dan Admin
  },
  {
    to: '/emergency',
    label: 'Panggilan Darurat',
    description: 'Kontak Damkar 113, SAR, Ambulans',
    icon: <PhoneCall className="w-5 h-5 text-orange-600" />,
  },
  {
    to: '/profile',
    label: 'Profil Pengguna',
    description: 'Data diri, aktivitas, & toggle GPS',
    icon: <User className="w-5 h-5 text-indigo-600" />,
  },
];

export function AppSidebar({ className }: { className?: string }) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { user, isAuthenticated, logout } = useAuthStore();

  // Filter items based on active user role
  const visibleNavItems = navItems.filter((item) => {
    if (item.roles) {
      if (!isAuthenticated || !user) return false;
      return item.roles.includes(user.role);
    }
    return true;
  });

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col w-72 bg-white border-r border-neutral-200 h-screen sticky top-0 shrink-0 z-30 select-none shadow-xs',
        className
      )}
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-sm shadow-brand-500/30 group-hover:scale-105 transition">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-neutral-900">FIREZONE</span>
            </div>
            <p className="text-[11px] text-neutral-500 font-medium">Kalimantan Early Hazard</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
        <div className="px-3 pb-2 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
          Navigasi Utama
        </div>

        {visibleNavItems.map((item) => {
          const isActive =
            item.to === '/'
              ? currentPath === '/'
              : currentPath.startsWith(item.to);

          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition group relative',
                isActive
                  ? 'bg-brand-50 text-brand-800 font-bold border border-brand-200/60 shadow-xs'
                  : 'text-neutral-700 hover:bg-neutral-100/80 hover:text-neutral-950'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition',
                  isActive
                    ? 'bg-white shadow-xs'
                    : 'bg-neutral-100 group-hover:bg-white'
                )}
              >
                {item.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="truncate leading-tight">{item.label}</span>
                  {item.badge && (
                    <span
                      className={cn(
                        'text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider',
                        item.badge === 'Darurat'
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : 'bg-neutral-200/70 text-neutral-700'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-neutral-500 font-normal truncate mt-0.5">
                  {item.description}
                </p>
              </div>

              {isActive && (
                <div className="w-1.5 h-6 bg-brand-600 rounded-full absolute right-1.5" />
              )}
            </Link>
          );
        })}
      </div>

      {/* User Footer Profile Card */}
      <div className="p-3 border-t border-neutral-200/80 bg-neutral-50/60">
        {isAuthenticated && user ? (
          <div className="p-2.5 rounded-xl bg-white border border-neutral-200 shadow-xs flex flex-col gap-2.5">
            <Link to="/profile" className="flex items-center gap-3 group">
              <img
                src={
                  user.avatarUrl ||
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80'
                }
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border border-neutral-200 ring-2 ring-brand-500/20"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-neutral-900 truncate group-hover:text-brand-700 transition">
                    {user.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={cn(
                      'px-1.5 py-0.2 rounded text-[10px] font-bold uppercase',
                      user.role === 'ADMIN'
                        ? 'bg-neutral-900 text-amber-400'
                        : user.role === 'RELAWAN'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-brand-100 text-brand-800'
                    )}
                  >
                    {user.role}
                  </span>
                  <span className="text-[11px] text-neutral-500 truncate">
                    {user.kabupaten || 'Sintang'}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 transition" />
            </Link>

            <button
              type="button"
              onClick={logout}
              className="flex items-center justify-center gap-2 w-full py-1.5 px-3 rounded-lg text-xs font-semibold text-neutral-600 hover:text-red-700 hover:bg-red-50 border border-neutral-200 hover:border-red-200 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar Sesi</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 p-2">
            <Link
              to="/login"
              className="w-full py-2 px-3 rounded-xl text-center text-xs font-bold text-neutral-800 bg-white border border-neutral-200 hover:bg-neutral-50 shadow-xs transition"
            >
              Masuk Akun
            </Link>
            <Link
              to="/register"
              className="w-full py-2 px-3 rounded-xl text-center text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-xs transition"
            >
              Daftar Warga / Relawan
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
