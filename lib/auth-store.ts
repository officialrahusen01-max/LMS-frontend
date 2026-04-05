"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  _id: string;
  fullName: string;
  publicUsername: string;
  email: string;
  roles: string[];
  status?: string;
  approvedInstructor?: boolean;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (user: User | null, accessToken: string | null, refreshToken: string | null) => void;
  logout: () => void | Promise<void>;
  isAuthenticated: () => boolean;
  primaryRole: () => "student" | "instructor" | "admin" | null;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      setAuth: (user, accessToken, refreshToken) => {
        if (typeof window !== "undefined") {
          if (accessToken) localStorage.setItem("accessToken", accessToken);
          else localStorage.removeItem("accessToken");
          if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
          else localStorage.removeItem("refreshToken");
        }
        set({ user, accessToken, refreshToken });
      },

      logout: async () => {
        const refreshToken = get().refreshToken;
        if (typeof window !== "undefined" && refreshToken) {
          try {
            const base = (await import("./api")).getBaseUrl();
            await fetch(`${base}/auth/logout`, {
              method: "POST",
              headers: (await import("./api")).getAuthHeaders(),
              body: JSON.stringify({ refreshToken }),
            });
          } catch {
            // ignore – clear local anyway
          }
        }
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
        set({ user: null, accessToken: null, refreshToken: null });
      },

      isAuthenticated: () => {
        const { accessToken } = get();
        return !!accessToken;
      },

      primaryRole: () => {
        const { user } = get();
        const roles = user?.roles || [];
        if (roles.includes("admin")) return "admin";
        if (roles.includes("instructor")) return "instructor";
        if (roles.includes("student")) return "student";
        return null;
      },
    }),
    {
      name: "lms-auth",
      partialize: (s) => ({ user: s.user, accessToken: s.accessToken, refreshToken: s.refreshToken }),
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken && typeof window !== "undefined")
          localStorage.setItem("accessToken", state.accessToken);
        if (state?.refreshToken && typeof window !== "undefined")
          localStorage.setItem("refreshToken", state.refreshToken);
      },
    }
  )
);
