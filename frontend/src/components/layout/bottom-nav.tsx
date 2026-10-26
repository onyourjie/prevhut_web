import React from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import {
  Home,
  Map,
  PlusCircle,
  Shield,
  PhoneCall,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';

export interface NavItem {
  to?: string;
  label: string;
  icon: React.ReactNode;
  isSpecial?: boolean;
  onClick?: () => void;
}

export interface BottomNavProps {
  items?: NavItem[];
  variant?: 'fixed' | 'floating';
  className?: string;
  onOpenMenu?: () => void;
}

export function BottomNav({
  items,
  variant: _variant = 'floating',
  className,
  onOpenMenu,
}: BottomNavProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { user, isAuthenticated } = useAuthStore();

  const isVolunteerOrAdmin =
    isAuthenticated && (user?.role === 'RELAWAN' || user?.role === 'ADMIN');

  const emergencyItem: NavItem = {
    to: '/emergency',
    label: 'Panggilan',
    icon: <PhoneCall className="w-5 h-5 text-orange-600" />,
  };

  const effectiveItems: NavItem[] =
    items ||
    (isVolunteerOrAdmin
      ? [
          { to: '/', label: 'Beranda', icon: <Home className="w-5 h-5" /> },
          { to: '/map', label: 'Peta', icon: <Map className="w-5 h-5" /> },
          {
            to: '/assignments',
            label: 'Tugas',
            icon: <Shield className="w-6 h-6 text-white" />,
            isSpecial: true,
          },
          emergencyItem,
          {
            label: 'Lainnya',
            icon: <Menu className="w-5 h-5" />,
            onClick: onOpenMenu,
          },
        ]
      : [
          { to: '/', label: 'Beranda', icon: <Home className="w-5 h-5" /> },
          { to: '/map', label: 'Peta', icon: <Map className="w-5 h-5" /> },
          {
            to: '/community/create',
            label: 'Lapor',
            icon: <PlusCircle className="w-6 h-6 text-white" />,
            isSpecial: true,
          },
          emergencyItem,
          {
            label: 'Lainnya',
            icon: <Menu className="w-5 h-5" />,
            onClick: onOpenMenu,
          },
        ]);

  // Determine active item
  const activeRouteItem = effectiveItems.find((item) => {
    if (!item.to) return false;
    if (item.to === '/') return currentPath === '/';
    return currentPath === item.to || (item.to !== '/' && currentPath.startsWith(item.to + '/'));
  });

  return (
    <nav
      aria-label="Navigasi Utama Ponsel"
      className={cn(
        'fixed bottom-3 left-0 right-0 z-40 px-3 sm:px-4 pointer-events-none select-none pb-[env(safe-area-inset-bottom)] lg:hidden',
        className
      )}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-neutral-200/90 max-w-md mx-auto p-1.5 sm:p-2 flex items-center justify-between pointer-events-auto">
        {effectiveItems.map((item) => {
          const isActive = item.to
            ? item === activeRouteItem
            : !activeRouteItem;

          if (item.isSpecial && item.to) {
            const specialGradient =
              item.to === '/assignments'
                ? 'bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 shadow-emerald-500/40 text-white'
                : 'bg-gradient-to-tr from-brand-600 via-red-600 to-orange-500 shadow-brand-500/40 text-white';

            return (
              <Link
                key={item.label}
                to={item.to}
                activeOptions={{ exact: true }}
                aria-current={isActive ? 'page' : undefined}
                className="flex flex-col items-center justify-center -mt-5 group"
              >
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 active:scale-95 transition',
                    specialGradient,
                    isActive &&
                      (item.to === '/assignments'
                        ? 'ring-4 ring-emerald-400/50 scale-105'
                        : 'ring-4 ring-brand-400/50 scale-105')
                  )}
                >
                  {item.icon}
                </div>
                <span className="text-[10px] font-bold text-neutral-800 mt-0.5 text-center leading-tight">
                  {item.label}
                </span>
              </Link>
            );
          }

          if (item.onClick) {
            return (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                className={cn(
                  'flex flex-col items-center justify-center min-h-[44px] min-w-[52px] sm:min-w-[56px] px-2.5 sm:px-3 py-1 rounded-2xl transition-all focus-ring cursor-pointer',
                  isActive
                    ? 'bg-brand-50 text-brand-700 font-bold shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-900 active:scale-95'
                )}
              >
                <span
                  className="flex items-center justify-center leading-none"
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
                <span className="text-[10px] mt-0.5 leading-tight truncate max-w-[64px]">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.to!}
              activeOptions={{ exact: true }}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex flex-col items-center justify-center min-h-[44px] min-w-[52px] sm:min-w-[56px] px-2.5 sm:px-3 py-1 rounded-2xl transition-all focus-ring',
                isActive
                  ? 'bg-brand-50 text-brand-700 font-bold shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900 active:scale-95'
              )}
            >
              <span
                className="flex items-center justify-center leading-none"
                aria-hidden="true"
              >
                {item.icon}
              </span>
              <span className="text-[10px] mt-0.5 leading-tight truncate max-w-[64px]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
