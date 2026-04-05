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
}

export default function AuthLayout({ children, title, subtitle, mode }: AuthLayoutProps) {
  const isLogin = mode === "login";
  // Login: branding left (order 1), form right (order 2). Register: form left (order 1), branding right (order 2).
  const formOrder = isLogin ? 2 : 1;
  const brandingOrder = isLogin ? 1 : 2;

  return (
    <div className="min-h-screen w-full flex flex-col bg-background font-sans">
      {/* Top accent line: login = theme|white, register = white|theme */}
      <div className="hidden lg:grid lg:grid-cols-[0.95fr_1.05fr] h-1.5 shrink-0 w-full">
        <div className={`animate-auth-strip ${isLogin ? "bg-primary" : "bg-white dark:bg-card"}`} />
        <div className={`animate-auth-strip ${isLogin ? "bg-white dark:bg-card" : "bg-primary"}`} />
      </div>

      {/* Two-column layout: order swap by mode */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] min-h-0">
        {/* Branding column – left on login, right on register */}
        <div
          key={`branding-${mode}`}
          className={`relative hidden lg:flex flex-col bg-primary px-8 py-12 overflow-hidden ${
            isLogin ? "animate-auth-in-from-left" : "animate-auth-in-from-right"
          }`}
          style={{ order: brandingOrder }}
        >
          <div className="shrink-0 absolute top-8 left-8">
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

          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div
            className="absolute top-1/4 -left-8 w-48 h-px bg-primary-foreground/20 rotate-[-28deg]"
            aria-hidden
          />
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <h2 className="text-3xl sm:text-4xl xl:text-[2.75rem] font-bold text-primary-foreground leading-tight tracking-tight">
              Start learning
              <br />
              <span className="text-primary-foreground/90">with AiNextro LMS</span>
            </h2>
            <p className="mt-6 text-sm text-primary-foreground/70 leading-relaxed max-w-xs mx-auto">
              One platform for courses, certificates, and career growth. Join thousands of learners.
            </p>
          </div>
        </div>

        {/* Form column – right on login, left on register */}
        <div
          key={`form-${mode}`}
          className={`flex flex-col bg-white dark:bg-card min-h-[calc(100vh-3.5rem)] ${
            isLogin ? "animate-auth-in-from-right" : "animate-auth-in-from-left"
          }`}
          style={{ order: formOrder }}
        >
          <div className="flex-1 flex flex-col px-4 sm:px-6 py-6 sm:py-8 overflow-y-auto">
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

            <div className="max-w-md w-full mx-auto flex flex-col flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-card-foreground dark:text-foreground mb-1">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{subtitle}</p>
              )}
              {!subtitle && <div className="mb-6" />}

              <div className="flex-1">{children}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Thin footer strip */}
      <footer className="shrink-0 h-9 border-t border-border bg-card flex items-center px-4">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between text-[11px] text-muted-foreground">
          <span>© {new Date().getFullYear()} AiNextro LMS. All rights reserved.</span>
          <Link href="/" className="hover:text-foreground transition-colors">
            Back to home
          </Link>
        </div>
      </footer>
    </div>
  )
}
