/**
 * API helper – backend base URL aur auth headers.
 * Backend: /api/v1/auth, /api/v1/courses, /api/v1/enrollments, /api/v1/dashboard, etc.
 */

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export function getBaseUrl(): string {
  return BASE.replace(/\/$/, "");
}

function buildApiCandidates(path: string): string[] {
  if (path.startsWith("http")) return [path];

  const cleanPath = path.replace(/^\//, "");
  const base = getBaseUrl();
  const out: string[] = [];
  const seen = new Set<string>();
  const push = (u: string) => {
    const x = u.replace(/\/+$/, "");
    if (!seen.has(x)) {
      seen.add(x);
      out.push(x);
    }
  };

  if (base) {
    push(`${base}/${cleanPath}`);

    // If env is host-only or /api, auto-try /api/v1 fallback.
    if (!/\/api\/v1$/i.test(base)) {
      if (/\/api$/i.test(base)) {
        push(`${base}/v1/${cleanPath}`);
      } else {
        push(`${base}/api/v1/${cleanPath}`);
      }
    }
  } else {
    // Last-resort local fallback for misconfigured env.
    push(`/api/v1/${cleanPath}`);
  }

  return out;
}

export function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return { "Content-Type": "application/json" };
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function refreshAccessToken(): Promise<string | null> {
  const refresh = localStorage.getItem("refreshToken");
  if (!refresh) {
    // Refresh token missing - redirect to login
    await handleTokenExpired();
    return null;
  }
  
  const candidates = buildApiCandidates("auth/refresh");
  for (const url of candidates) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: refresh }),
      });
      
      // If 401, refresh token is expired
      if (res.status === 401) {
        await handleTokenExpired();
        return null;
      }
      
      if (!res.ok) continue;
      
      const data = await res.json().catch(() => ({}));
      const newToken = data?.data?.accessToken;
      const newRefresh = data?.data?.refreshToken;
      
      if (newToken && typeof window !== "undefined") {
        localStorage.setItem("accessToken", newToken);
        if (newRefresh) localStorage.setItem("refreshToken", newRefresh);
        const { useAuthStore } = await import("./auth-store");
        const prev = useAuthStore.getState();
        useAuthStore.getState().setAuth(prev.user, newToken, newRefresh ?? prev.refreshToken);
        return newToken;
      }
    } catch (error) {
      // Network error, continue to next candidate
      continue;
    }
  }
  
  // All candidates failed - token is invalid/expired
  await handleTokenExpired();
  return null;
}

async function handleTokenExpired(): Promise<void> {
  if (typeof window === "undefined") return;
  
  // Clear localStorage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  
  // Clear auth store
  const { useAuthStore } = await import("./auth-store");
  useAuthStore.getState().logout();
  
  // Redirect to login page
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const urls = buildApiCandidates(path);
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  let headers: HeadersInit = {
    ...(isFormData ? {} : getAuthHeaders()),
    ...(options.headers as Record<string, string>),
  };
  if (isFormData && typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  let res: Response | null = null;
  let selectedUrl = urls[0];
  for (let i = 0; i < urls.length; i += 1) {
    const url = urls[i];
    selectedUrl = url;
    // Retry alternate base only for "not found" to avoid duplicate side effects.
    const r = await fetch(url, { ...options, headers });
    res = r;
    if (r.status !== 404 || i === urls.length - 1) break;
  }

  if (!res) {
    throw new Error("Request failed");
  }

  if (res.status === 401 && typeof window !== "undefined") {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers = { ...headers, Authorization: `Bearer ${newToken}` };
      res = await fetch(selectedUrl, { ...options, headers });
    } else {
      // Refresh token expired or invalid - user will be redirected by handleTokenExpired()
      // Return the 401 response
      return res;
    }
  }

  return res;
}

export async function apiJson<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await apiFetch(path, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (data as { message?: string })?.message || res.statusText || "Request failed";
    throw new Error(msg);
  }
  return data as T;
}
