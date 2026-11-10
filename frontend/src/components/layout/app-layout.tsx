import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { AppSidebar } from './app-sidebar';
import { BottomNav } from './bottom-nav';
import { MobileNavDrawer } from './MobileNavDrawer';
import { TopNavbar } from './TopNavbar';
import { NotificationBell } from './NotificationBell';
import { Footer } from './Footer';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/lib/utils';

export interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  hideHeaderOnMobile?: boolean;
  className?: string;
}

export function AppLayout({
  children,
  title,
  subtitle,
  hideHeaderOnMobile = false,
  className,
}: AppLayoutProps) {
  const { user, isAuthenticated } = useAuthStore();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Warga dan pengunjung (unauthenticated) menggunakan TopNavbar publik yang leluasa
  // Hanya ADMIN dan RELAWAN yang menggunakan layout Sidebar (Command Center)
  const isCitizenOrGuest = !isAuthenticated || user?.role === 'WARGA';

  if (isCitizenOrGuest) {
    return (
      <div className="min-h-screen bg-neutral-50/50 text-neutral-900 flex flex-col">
        {/* Top Navbar Bersih & Luwes untuk Pengunjung dan Warga */}
        <TopNavbar />

        {/* Page Main View untuk Pengunjung dan Warga */}
        <div className="flex-1 w-full flex flex-col pt-18 sm:pt-20 pb-20">
          {(title || subtitle) && (
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 text-left">
              {title && (
                <h1 className="text-xl sm:text-2xl font-heading font-bold text-neutral-900">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">{subtitle}</p>
              )}
            </div>
          )}

          <main className={cn('flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6', className)}>
            {children}
          </main>
        </div>

        {/* Footer untuk semua halaman pengunjung dan warga */}
        <Footer />

        {/* Mobile Bottom Navigation */}
        <BottomNav variant="floating" onOpenMenu={() => setIsMobileDrawerOpen(true)} />

        {/* Mobile Navigation Drawer */}
        <MobileNavDrawer
          isOpen={isMobileDrawerOpen}
          onClose={() => setIsMobileDrawerOpen(false)}
        />
      </div>
    );
  }

  // Jika sudah login (khusus RELAWAN atau ADMIN), gunakan layout Dasbor Operasional dengan Sidebar
  return (
    <div className="min-h-screen bg-neutral-50/70 text-neutral-900 flex">
      {/* 1. Desktop & Tablet Persistent Sidebar */}
      <AppSidebar />

      {/* 2. Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0 pb-28 lg:pb-8">
        {/* Mobile & Desktop Top Bar */}
        <header
          className={cn(
            'sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between',
            hideHeaderOnMobile && 'hidden lg:flex'
          )}
        >
          {/* Left: Mobile Hamburger & Brand & Page Title */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link to="/" className="lg:hidden flex items-center gap-2 group">
              <img
                src="/logo-firezone.png"
                alt="FIREZONE"
                className="w-8 h-8 rounded-xl object-contain shadow-xs group-hover:scale-105 transition"
              />
              <span className="font-extrabold text-sm tracking-tight text-neutral-900">
                FIREZONE
              </span>
            </Link>

            {title && (
              <div className="hidden sm:block border-l border-neutral-200 pl-3">
                <h1 className="text-sm font-bold text-neutral-900 leading-tight">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-[11px] text-neutral-500">{subtitle}</p>
                )}
              </div>
            )}
          </div>

          {/* Right: Quick actions & user menu */}
          <div className="flex items-center gap-2.5">
            {/* Notifications Center with FCM Push */}
            <NotificationBell />

            {/* Mobile User Avatar / Menu Shortcut */}
            {isAuthenticated && user && (
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(true)}
                className="lg:hidden focus-ring rounded-full"
                aria-label="Buka Profil dan Menu"
              >
                <img
                  src={
                    user.avatarUrl ||
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80'
                  }
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border border-neutral-300 ring-1 ring-brand-500/20"
                />
              </button>
            )}
          </div>
        </header>

        {/* Page Main View */}
        <main className={cn('flex-1 w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6', className)}>
          {children}
        </main>
      </div>

      {/* 3. Mobile Navigation Drawer (All 8 Items & Profile) */}
      <MobileNavDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
      />

      {/* 4. Mobile Bottom Navigation (Floating Pill Consistent across all views) */}
      <BottomNav variant="floating" onOpenMenu={() => setIsMobileDrawerOpen(true)} />
    </div>
  );
}
