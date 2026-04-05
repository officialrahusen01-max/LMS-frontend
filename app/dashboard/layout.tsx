"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import DashboardSidebar from "@/components/dashboard-sidebar";

/** Same shell on server + first client paint — Zustand persist only exists on client, so auth differs until mounted. */
function DashboardLoadingShell() {
  return (
    <div className="flex h-screen overflow-hidden bg-background items-center justify-center">
      <span className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const primaryRole = useAuthStore((s) => s.primaryRole());

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    if (!isAuthenticated) {
      const isAdminPath = pathname.startsWith("/dashboard/admin");
      router.replace(isAdminPath ? "/admin/login" : "/login");
      return;
    }
    const segment = pathname.split("/")[2];
    if (segment === "student" && primaryRole !== "student" && primaryRole !== "admin") {
      router.replace(`/dashboard/${primaryRole ?? "student"}`);
    }
    if (segment === "instructor" && primaryRole !== "instructor" && primaryRole !== "admin") {
      router.replace(`/dashboard/${primaryRole ?? "student"}`);
    }
    if (segment === "admin" && primaryRole !== "admin") {
      router.replace(`/dashboard/${primaryRole ?? "student"}`);
    }
  }, [mounted, isAuthenticated, primaryRole, pathname, router]);

  if (!mounted) {
    return <DashboardLoadingShell />;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen overflow-hidden bg-background items-center justify-center">
        <p className="text-muted-foreground">Redirecting to sign in…</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto bg-muted/30">
        <div className="p-4 lg:p-6">
          <div className="bg-card rounded-xl border border-border shadow-sm min-h-[calc(100vh-2rem)] p-4 md:p-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
