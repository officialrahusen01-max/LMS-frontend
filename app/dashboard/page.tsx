"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";

export default function DashboardPage() {
  const router = useRouter();
  const primaryRole = useAuthStore((s) => s.primaryRole());

  useEffect(() => {
    const role = primaryRole ?? "student";
    if (role === "student") {
      router.replace("/student");
    } else {
      router.replace(`/dashboard/${role}`);
    }
  }, [primaryRole, router]);

  return (
    <div className="flex items-center justify-center py-12">
      <span className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
