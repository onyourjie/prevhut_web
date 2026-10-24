import React from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { Home, Map, MessageCircle, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface NavItem {
  to: string
  label: string
  icon: React.ReactNode
}

export interface BottomNavProps {
  items?: NavItem[]
  variant?: 'fixed' | 'floating'
  className?: string
}

const defaultNavItems: NavItem[] = [
  { to: '/', label: 'Beranda', icon: <Home className="w-5 h-5" /> },
  { to: '/map', label: 'Peta', icon: <Map className="w-5 h-5" /> },
  { to: '/reports', label: 'Laporan', icon: <MessageCircle className="w-5 h-5" /> },
  { to: '/login', label: 'Profil', icon: <User className="w-5 h-5" /> },
]

export function BottomNav({
  items = defaultNavItems,
  variant = 'fixed',
  className,
}: BottomNavProps) {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  if (variant === 'floating') {
    return (
      <nav
        aria-label="Navigasi Utama Ponsel"
        className={cn(
          'fixed bottom-3 left-0 right-0 z-40 px-4 pointer-events-none select-none pb-[env(safe-area-inset-bottom)]',
          className,
        )}
      >
        <div className="max-w-md mx-auto bg-white/95 backdrop-blur-md rounded-3xl border border-neutral-200/90 shadow-xl px-2 py-1.5 flex items-center justify-around pointer-events-auto">
          {items.map((item) => {
            const isActive =
              currentPath === item.to ||
              (item.to !== '/' && currentPath.startsWith(item.to))
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex flex-col items-center justify-center min-h-[44px] min-w-[56px] px-3 py-1 rounded-2xl transition-all focus-ring',
                  isActive
                    ? 'bg-brand-50 text-brand-700 font-bold shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-900 active:scale-95',
                )}
              >
                <span className="flex items-center justify-center leading-none" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="text-[10px] mt-0.5 leading-tight truncate max-w-[64px]">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    )
  }

  return (
    <nav
      aria-label="Navigasi Utama Ponsel"
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200 lg:hidden shadow-xs pb-[env(safe-area-inset-bottom)]',
        className,
      )}
    >
      <div className="flex items-center justify-around h-14 max-w-md mx-auto px-2">
        {items.map((item) => {
          const isActive =
            currentPath === item.to ||
            (item.to !== '/' && currentPath.startsWith(item.to))
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full min-h-[44px] min-w-[44px] gap-0.5 text-xs transition-colors focus-ring',
                isActive
                  ? 'text-brand-700 font-bold'
                  : 'text-neutral-600 font-medium hover:text-neutral-900',
              )}
            >
              <span className="flex items-center justify-center leading-none" aria-hidden="true">
                {item.icon}
              </span>
              <span className="text-[11px] leading-tight truncate max-w-[72px]">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
