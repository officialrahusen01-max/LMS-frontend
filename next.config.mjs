/** @type {import('next').NextConfig} */
const backendOrigin =
  process.env.BACKEND_ORIGIN ||
  process.env.INTERNAL_API_ORIGIN ||
  "http://127.0.0.1:5000";

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  /**
   * Browser → same-origin `/api/v1/*` → Next forwards to Express (`Lib` server).
   * Set BACKEND_ORIGIN to match Lib (Lib/.env PORT). ECONNREFUSED = wrong port or Lib not running.
   */
  async rewrites() {
    const origin = String(backendOrigin).replace(/\/$/, "");
    return [
      {
        source: "/api/v1/:path*",
        destination: `${origin}/api/v1/:path*`,
      },
    ];
  },
}

export default nextConfig
