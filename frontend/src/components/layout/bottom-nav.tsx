import React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Map, PlusCircle, Users, User, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";

export interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  isSpecial?: boolean;
}

export interface BottomNavProps {
  items?: NavItem[];
  variant?: "fixed" | "floating";
  className?: string;
}

export function BottomNav({
  items,
  variant = "fixed",
  className,
}: BottomNavProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { user, isAuthenticated } = useAuthStore();

  const isVolunteer = isAuthenticated && (user?.role === "RELAWAN" || user?.role === "ADMIN");

  const effectiveItems: NavItem[] = items || (isVolunteer
    ? [
        { to: "/", label: "Beranda", icon: <Home className="w-5 h-5" /> },
        { to: "/map", label: "Peta", icon: <Map className="w-5 h-5" /> },
        {
          to: "/assignments",
          label: "Tugas",
          icon: <Shield className="w-6 h-6 text-white" />,
          isSpecial: true,
        },
        { to: "/community", label: "Komunitas", icon: <Users className="w-5 h-5" /> },
        { to: "/profile", label: "Profil", icon: <User className="w-5 h-5" /> },
      ]
    : [
        { to: "/", label: "Beranda", icon: <Home className="w-5 h-5" /> },
        { to: "/map", label: "Peta", icon: <Map className="w-5 h-5" /> },
        {
          to: "/community/create",
          label: "Lapor",
          icon: <PlusCircle className="w-6 h-6 text-white" />,
          isSpecial: true,
        },
        { to: "/community", label: "Komunitas", icon: <Users className="w-5 h-5" /> },
        { to: "/profile", label: "Profil", icon: <User className="w-5 h-5" /> },
      ]);

  const activeItem = effectiveItems.reduce<NavItem | undefined>((best, item) => {
    const matches = currentPath === item.to ||
      (item.to !== "/" && currentPath.startsWith(`${item.to}/`));
    return matches && (!best || item.to.length > best.to.length) ? item : best;
  }, undefined);

  if (variant === "floating") {
    return (
      <nav
        aria-label="Navigasi Utama Ponsel"
        className={cn(
          "fixed bottom-3 left-0 right-0 z-40 px-4 pointer-events-none select-none pb-[env(safe-area-inset-bottom)]",
          className
        )}
      >
        <div className="max-w-md mx-auto bg-white/95 backdrop-blur-md rounded-3xl border border-neutral-200/90 shadow-xl px-2 py-1.5 flex items-center justify-around pointer-events-auto">
          {effectiveItems.map((item) => {
            const isActive = item === activeItem;

            if (item.isSpecial) {
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  activeOptions={{ exact: true }}
                  aria-current={isActive ? "page" : undefined}
                  className="flex flex-col items-center justify-center -mt-5 group"
                >
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 active:scale-95 transition",
                    isVolunteer
                      ? "bg-gradient-to-tr from-emerald-600 to-teal-600 shadow-emerald-500/40"
                      : "bg-gradient-to-tr from-brand-600 to-red-600 shadow-brand-500/40"
                  )}>
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-bold text-neutral-800 mt-0.5">
                    {item.label}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: true }}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center justify-center min-h-[44px] min-w-[56px] px-3 py-1 rounded-2xl transition-all focus-ring",
                  isActive
                    ? "bg-brand-50 text-brand-700 font-bold shadow-2xs"
                    : "text-neutral-500 hover:text-neutral-900 active:scale-95"
                )}
              >
                <span className="flex items-center justify-center leading-none" aria-hidden="true">
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

  return (
    <nav
      aria-label="Navigasi Utama Ponsel"
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 lg:hidden shadow-lg pb-[env(safe-area-inset-bottom)]",
        className
      )}
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {effectiveItems.map((item) => {
          const isActive = item === activeItem;

          if (item.isSpecial) {
            return (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: true }}
                aria-current={isActive ? "page" : undefined}
                className="flex flex-col items-center justify-center -mt-5 group"
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 active:scale-95 transition",
                  isVolunteer
                    ? "bg-gradient-to-tr from-emerald-600 to-teal-600 shadow-emerald-500/40"
                    : "bg-gradient-to-tr from-brand-600 to-red-600 shadow-brand-500/40"
                )}>
                  {item.icon}
                </div>
                <span className="text-[10px] font-bold text-neutral-800 mt-1">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: true }}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full min-h-[44px] min-w-[44px] gap-1 text-xs transition-colors",
                isActive
                  ? "text-brand-700 font-bold"
                  : "text-neutral-500 font-medium hover:text-neutral-800"
              )}
            >
              <span className="flex items-center justify-center leading-none">
                {item.icon}
              </span>
              <span className="text-[11px] leading-tight truncate">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
