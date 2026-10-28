import { create } from "zustand";
import { persist } from "zustand/middleware";
import { queryClient } from "@/lib/query-client";

export type UserRole = "WARGA" | "RELAWAN" | "ADMIN";

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string | null;
  province?: string | null;
  kabupaten?: string | null;
  kecamatan?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isGpsAlwaysActive?: boolean;
  isAvailable?: boolean;
  createdAt?: string;
}

export interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (partial: Partial<User>) => void;
  logout: () => void;
  setHasHydrated: (val: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      hasHydrated: false,
      setAuth: (user, token) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("firezone_token", token);
        }
        set((state) => {
          if (state.user?.id && state.user.id !== user.id) {
            queryClient.clear();
          }
          return { user, token, isAuthenticated: true };
        });
      },
      updateUser: (partial) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        }));
      },
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("firezone_token");
        }
        queryClient.clear();
        set({ user: null, token: null, isAuthenticated: false });
      },
      setHasHydrated: (val) => set({ hasHydrated: val }),
    }),
    {
      name: "firezone_auth",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
