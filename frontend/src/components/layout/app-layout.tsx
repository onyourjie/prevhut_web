import React from 'react';
import { Link } from '@tanstack/react-router';
import { Flame, Bell } from 'lucide-react';
import { AppSidebar } from './app-sidebar';
import { BottomNav } from './bottom-nav';
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

  return (
    <div className="min-h-screen bg-neutral-50/70 text-neutral-900 flex">
      {/* 1. Desktop & Tablet Persistent Sidebar */}
      <AppSidebar />

      {/* 2. Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        {/* Mobile & Desktop Top Bar */}
        <header
          className={cn(
            'sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 px-4 sm:px-6 py-3 flex items-center justify-between',
            hideHeaderOnMobile && 'hidden lg:flex'
          )}
        >
          {/* Left: Mobile Brand & Page Title */}
          <div className="flex items-center gap-3">
            <Link to="/" className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-xs">
                <Flame className="w-4 h-4 animate-pulse" />
              </div>
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

            {/* Notifications Trigger */}
            <button
              type="button"
              className="w-8 h-8 rounded-lg border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 flex items-center justify-center transition relative"
              aria-label="Pusat Notifikasi"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-brand-600 absolute top-1.5 right-1.5" />
            </button>

            {/* Mobile User Avatar */}
            {isAuthenticated && user && (
              <Link to="/profile" className="lg:hidden">
                <img
                  src={
                    user.avatarUrl ||
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80'
                  }
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-neutral-300"
                />
              </Link>
            )}
          </div>
        </header>

        {/* Page Main View */}
        <main className={cn('flex-1 w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6', className)}>
          {children}
        </main>
      </div>

      {/* 3. Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
