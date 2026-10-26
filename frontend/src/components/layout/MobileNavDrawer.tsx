import { useEffect } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import {
  Flame,
  X,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { navItems } from './app-sidebar';
import { cn } from '@/lib/utils';

export interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNavDrawer({ isOpen, onClose }: MobileNavDrawerProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { user, isAuthenticated, logout } = useAuthStore();

  // Close on ESC key and prevent body scroll when open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  // Filter items based on user role
  const visibleNavItems = navItems.filter((item) => {
    if (item.roles) {
      if (!isAuthenticated || !user) return false;
      return item.roles.includes(user.role);
    }
    return true;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
        {/* Header */}
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-xs">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-neutral-900">
                FIREZONE
              </span>
              <p className="text-[10px] text-neutral-500 font-medium leading-none">
                Kalimantan Early Hazard
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup menu navigasi"
            className="p-2 -mr-1 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition focus-ring"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin">
          <div className="px-3 py-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
            Navigasi Lengkap
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
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition group relative',
                  isActive
                    ? 'bg-brand-50 text-brand-800 font-bold border border-brand-200/60 shadow-xs'
                    : 'text-neutral-700 hover:bg-neutral-100/80 hover:text-neutral-950 active:bg-neutral-200/60'
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
                            : item.badge === 'Posko'
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
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

        {/* User Card & Logout Footer */}
        <div className="p-3 border-t border-neutral-200/80 bg-neutral-50/70">
          {isAuthenticated && user ? (
            <div className="p-2.5 rounded-xl bg-white border border-neutral-200 shadow-xs flex flex-col gap-2.5">
              <Link
                to="/profile"
                onClick={onClose}
                className="flex items-center gap-3 group"
              >
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
                      {user.kabupaten || 'Kalimantan'}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 transition" />
              </Link>

              <button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="flex items-center justify-center gap-2 w-full py-1.5 px-3 rounded-lg text-xs font-semibold text-neutral-600 hover:text-red-700 hover:bg-red-50 border border-neutral-200 hover:border-red-200 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar Sesi</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 p-1">
              <Link
                to="/login"
                onClick={onClose}
                className="w-full py-2 px-3 rounded-xl text-center text-xs font-bold text-neutral-800 bg-white border border-neutral-200 hover:bg-neutral-50 shadow-xs transition"
              >
                Masuk Akun
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="w-full py-2 px-3 rounded-xl text-center text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-xs transition"
              >
                Daftar Warga / Relawan
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
