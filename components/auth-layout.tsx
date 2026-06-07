"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"

export type AuthMode = "register" | "login"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  mode: AuthMode
  brandingImage?: string
}

const DEFAULT_IMAGES: Record<AuthMode, string> = {
  login: "/images/login-photo.png",
  register: "/images/login-photo.png",
}

export default function AuthLayout({ children, title, subtitle, mode, brandingImage }: AuthLayoutProps) {
  const isLogin = mode === "login";
  const photo = brandingImage ?? DEFAULT_IMAGES[mode];

  const gridCols = isLogin
    ? "lg:grid-cols-[0.95fr_1.05fr]"
    : "lg:grid-cols-[1.05fr_0.95fr]";

  return (
    // Key: h-screen + overflow-hidden on root — page never exceeds viewport
    <div className={`h-screen w-full flex flex-col bg-background font-sans overflow-hidden`}>

      {/* Top accent line */}
      <div className={`hidden lg:grid ${gridCols} h-1.5 shrink-0 w-full`}>
        <div className={`animate-auth-strip ${isLogin ? "bg-primary" : "bg-white dark:bg-card"}`} />
        <div className={`animate-auth-strip ${isLogin ? "bg-white dark:bg-card" : "bg-primary"}`} />
      </div>

      {/* Middle: takes all remaining height, no overflow */}
      <div className={`grid grid-cols-1 ${gridCols} overflow-hidden`} style={{ flex: 1, minHeight: 0 }}>

        {isLogin ? (
          <>
            {/* BRANDING — fully fixed, no scroll */}
            <div className="relative hidden lg:block animate-auth-in-from-left">
              <BrandingInner photo={photo} />
            </div>
            {/* FORM — only this scrolls */}
            <div className="flex flex-col bg-white dark:bg-card overflow-y-auto animate-auth-in-from-right">
              <FormInner mode={mode} title={title} subtitle={subtitle}>
                {children}
              </FormInner>
            </div>
          </>
        ) : (
          <>
            {/* FORM — only this scrolls */}
            <div className="flex flex-col bg-white dark:bg-card overflow-y-auto animate-auth-in-from-left">
              <FormInner mode={mode} title={title} subtitle={subtitle}>
                {children}
              </FormInner>
            </div>
            {/* BRANDING — fully fixed, no scroll */}
            <div className="relative hidden lg:block animate-auth-in-from-right">
              <BrandingInner photo={photo} />
            </div>
          </>
        )}

      </div>

      {/* Footer — fixed at bottom */}
      <footer className="shrink-0 h-9 border-t border-border bg-card flex items-center px-4">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between text-[11px] text-muted-foreground">
          <span>© {new Date().getFullYear()} AiNextro LMS. All rights reserved.</span>
          <Link href="/" className="hover:text-foreground transition-colors">
            Back to home
          </Link>
        </div>
      </footer>

    </div>
  );
}

function BrandingInner({ photo }: { photo: string }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo}
        alt="AiNextro Illustration"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.12)" }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div style={{ position: "absolute", top: "2rem", left: "2rem", zIndex: 20 }}>
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative w-12 h-12 rounded-xl bg-white/10 ring-1 ring-white/20 flex items-center justify-center overflow-hidden">
            <Image
              src="/images/logo2.png"
              alt="AiNextro LMS"
              width={48}
              height={48}
              className="object-contain p-1.5"
              priority
            />
          </div>
        </Link>
      </div>
    </>
  );
}

function FormInner({
  mode,
  title,
  subtitle,
  children,
}: {
  mode: AuthMode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex gap-6 border-b border-border mb-6 sm:mb-8">
        <Link
          href="/register"
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            mode === "register"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Register
        </Link>
        <Link
          href="/login"
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            mode === "login"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Sign in
        </Link>
      </div>
      <div className="max-w-md w-full mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold text-card-foreground dark:text-foreground mb-1">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{subtitle}</p>
        )}
        {!subtitle && <div className="mb-6" />}
        <div>{children}</div>
      </div>
    </div>
  );
}
