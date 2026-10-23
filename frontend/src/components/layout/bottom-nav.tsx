import React from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { Home, Map, Users, Palette } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface NavItem {
  to: string
  label: string
  icon: React.ReactNode
}

export interface BottomNavProps {
  items?: NavItem[]
  className?: string
}

const defaultNavItems: NavItem[] = [
  { to: '/', label: 'Beranda', icon: <Home className="w-5 h-5" /> },
  { to: '/map', label: 'Peta', icon: <Map className="w-5 h-5" /> },
  { to: '/community', label: 'Komunitas', icon: <Users className="w-5 h-5" /> },
  { to: '/ui-kit', label: 'UI Kit', icon: <Palette className="w-5 h-5" /> },
]

export function BottomNav({ items = defaultNavItems, className }: BottomNavProps) {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

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
          const isActive = currentPath === item.to || (item.to !== '/' && currentPath.startsWith(item.to))
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
