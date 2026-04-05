"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function BloogSlugRedirectPage() {
  const router = useRouter();
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  useEffect(() => {
    if (slug) router.replace(`/student/blogs/${encodeURIComponent(slug)}`);
    else router.replace("/student/blogs");
  }, [router, slug]);
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted-foreground">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm">Redirecting</p>
    </div>
  );
}
