import { NextRequest, NextResponse } from "next/server";

/** SSRF-safe: only normal-looking hostnames */
function isSafeDomain(d: string): boolean {
  if (!d || d.length > 120) return false;
  return /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i.test(d);
}

function sources(domain: string): string[] {
  const enc = encodeURIComponent(domain);
  return [
    `https://www.google.com/s2/favicons?domain=${enc}&sz=128`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    `https://logo.clearbit.com/${enc}`,
  ];
}

/**
 * Proxies partner favicons/logos so the browser loads same-origin URLs
 * (Clearbit / favicons often fail when loaded directly from the client).
 */
export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain")?.trim().toLowerCase();
  if (!domain || !isSafeDomain(domain)) {
    return NextResponse.json({ error: "Invalid domain" }, { status: 400 });
  }

  for (const url of sources(domain)) {
    try {
      const res = await fetch(url, {
        headers: {
          Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
          "User-Agent": "Mozilla/5.0 (compatible; LMS-PartnerLogo/1.0)",
        },
        signal: AbortSignal.timeout(10000),
        next: { revalidate: 604800 },
      });
      if (!res.ok) continue;
      const buf = await res.arrayBuffer();
      if (buf.byteLength < 32) continue;

      let ct = res.headers.get("content-type") || "";
      if (!ct.startsWith("image/")) {
        ct = url.includes("duckduckgo") && url.endsWith(".ico") ? "image/x-icon" : "image/png";
      }

      return new NextResponse(buf, {
        status: 200,
        headers: {
          "Content-Type": ct,
          "Cache-Control": "public, max-age=604800, s-maxage=604800",
        },
      });
    } catch {
      continue;
    }
  }

  return new NextResponse(null, { status: 404 });
}
