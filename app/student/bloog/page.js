"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/** Old URL — redirects to /student/blogs */
export default function BloogRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/student/blogs");
  }, [router]);
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted-foreground">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm">Redirecting to blog…</p>
    </div>
  );
}
