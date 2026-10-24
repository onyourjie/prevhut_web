import { Link, useRouterState } from '@tanstack/react-router'
import { Flame, Map, Home, PhoneCall, LogOut, ShieldAlert, Shield, Users } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { cn } from '@/lib/utils'

export interface MainNavbarProps {
  className?: string
}

export function MainNavbar({ className }: MainNavbarProps) {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname
  const { user, isAuthenticated, logout } = useAuthStore()

  const navLinks = [
    { to: '/', label: 'Beranda', icon: <Home className="w-4 h-4" /> },
    { to: '/map', label: 'Peta Pantau', icon: <Map className="w-4 h-4" /> },
  ]

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-900 text-white">
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            ADMIN POSKO
          </span>
        )
      case 'RELAWAN':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent-100 text-accent-950 border border-accent-300">
            <Shield className="w-3 h-3 text-accent-700" />
            RELAWAN
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-100 text-brand-900 border border-brand-300">
            <Users className="w-3 h-3 text-brand-700" />
            WARGA
          </span>
        )
    }
  }

  return (
    <header
      className={cn(
        'hidden lg:flex items-center justify-between h-14 bg-white/95 backdrop-blur-md border-b border-neutral-200/90 px-6 z-40 select-none shrink-0',
        className,
      )}
    >
      {/* Kiri: Logo Brand & Tagline */}
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2.5 focus-ring rounded-lg">
          <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-xs">
            <Flame className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-neutral-1000 leading-none">
              FIREZONE
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 mt-0.5">
              Sistem Pantau Karhutla
            </span>
          </div>
        </Link>

        {/* Menu Navigasi Layar Lebar */}
        <nav aria-label="Navigasi Utama" className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive =
              currentPath === link.to ||
              (link.to !== '/' && currentPath.startsWith(link.to))
            return (
              <Link
                key={link.to}
                to={link.to}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all focus-ring',
                  isActive
                    ? 'bg-brand-50 text-brand-800 shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100/70',
                )}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Kanan: Hotline Darurat & Profil Pengguna */}
      <div className="flex items-center gap-4">
        {/* Hotline Siaga */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-900 border border-red-200/80 text-xs font-semibold">
          <PhoneCall className="w-3.5 h-3.5 text-red-600 animate-pulse" />
          <span>Posko Siaga Sintang: 112 / BPBD</span>
        </div>

        {/* Profil atau Tombol Auth */}
        {isAuthenticated && user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <img
                src={
                  user.avatarUrl ||
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80'
                }
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-neutral-300"
              />
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold leading-tight text-neutral-900 truncate max-w-[130px]">
                  {user.name}
                </span>
                <div className="mt-0.5">{getRoleBadge(user.role)}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              aria-label="Keluar dari akun"
              className="w-8 h-8 rounded-lg border border-neutral-200 hover:bg-neutral-100 flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition focus-ring cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="text-xs font-bold text-neutral-700 hover:text-neutral-900 px-3.5 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition"
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className="text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 px-3.5 py-1.5 rounded-lg shadow-2xs transition"
            >
              Daftar
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
