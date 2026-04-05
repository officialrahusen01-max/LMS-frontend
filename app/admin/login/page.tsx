"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Shield, ArrowLeft } from "lucide-react";
import AuthLayout from "@/components/auth-layout";
import { getBaseUrl } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import type { User } from "@/lib/auth-store";

type Phase = "email" | "otp";

export default function AdminLoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const primaryRole = useAuthStore((s) => s.primaryRole());

  useEffect(() => {
    if (isAuthenticated && primaryRole === "admin") {
      router.replace("/dashboard/admin");
    }
  }, [isAuthenticated, primaryRole, router]);

  const [phase, setPhase] = useState<Phase>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function requestOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      setError("Please enter your admin email.");
      return;
    }
    setLoading(true);
    try {
      const base = getBaseUrl();
      const res = await fetch(`${base}/auth/admin/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof data?.message === "string" ? data.message : "Could not send code"
        );
      }
      setInfo(
        typeof data?.message === "string"
          ? data.message
          : "If this email is registered as an active admin, a login code was sent."
      );
      setPhase("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = email.trim().toLowerCase();
    const code = otp.replace(/\D/g, "").slice(0, 6);
    if (code.length !== 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setLoading(true);
    try {
      const base = getBaseUrl();
      const res = await fetch(`${base}/auth/admin/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, otp: code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof data?.message === "string" ? data.message : "Verification failed"
        );
      }
      const accessToken = data?.data?.accessToken;
      const refreshToken = data?.data?.refreshToken;
      const user = data?.data?.user as User | undefined;
      if (!accessToken || !refreshToken) {
        throw new Error("Invalid server response");
      }
      const roles = user?.roles ?? [];
      if (!roles.includes("admin")) {
        throw new Error("This login is not valid for admin access.");
      }
      setAuth(user ?? null, accessToken, refreshToken);
      router.push("/dashboard/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      mode="login"
      title="Admin sign in"
      subtitle="Use your admin email. We’ll send a one-time code — enter it to sign in."
    >
      <div className="space-y-4">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Student / instructor login
        </Link>

        {phase === "email" ? (
          <form onSubmit={requestOtp} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="admin-email" className="block text-sm font-medium text-card-foreground">
                Admin email
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@yourdomain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-md border border-input bg-background px-4 py-2.5 pl-10 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {loading ? "Sending…" : "Send login code"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="space-y-5">
            <p className="text-xs text-muted-foreground">
              Code sent to <span className="font-medium text-foreground">{email.trim()}</span>
            </p>
            <div className="space-y-1.5">
              <label htmlFor="admin-otp" className="block text-sm font-medium text-card-foreground">
                6-digit code
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Shield className="h-4 w-4" />
                </div>
                <input
                  id="admin-otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full rounded-md border border-input bg-background px-4 py-2.5 pl-10 text-center text-lg tracking-[0.4em] font-mono text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || otp.replace(/\D/g, "").length !== 6}
              className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {loading ? "Verifying…" : "Verify & sign in"}
            </button>
            <button
              type="button"
              onClick={() => {
                setPhase("email");
                setOtp("");
                setError(null);
                setInfo(null);
              }}
              className="w-full text-xs text-primary hover:underline"
            >
              Use a different email
            </button>
          </form>
        )}

        {info && phase === "otp" && (
          <p className="text-sm text-muted-foreground text-center">{info}</p>
        )}
        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}
      </div>
    </AuthLayout>
  );
}
