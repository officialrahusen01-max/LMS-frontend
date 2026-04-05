"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LogIn, UserPlus, BookOpen, ArrowLeft } from "lucide-react";
import { LanguageSelector } from "@/components/language-selector";
import { useTranslationHook } from "@/lib/translations";

export default function AboutPage() {
  const { t, tArray } = useTranslationHook();
  const functionsList = tArray("about.functionsList");
  const standardsList = tArray("about.standardsList");
  return (
    <div className="min-h-screen w-full flex flex-col bg-background font-sans">
      {/* Header – same as home with Home, About Us, Contact Us */}
      <header className="fixed top-0 left-0 right-0 bg-primary z-50 overflow-hidden shadow-lg">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-foreground/5 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-primary-foreground/10 pointer-events-none" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3 sm:gap-4">
              <div className="relative flex items-center justify-center rounded-xl bg-primary-foreground/10 px-4 py-2.5 sm:px-5 sm:py-3 shadow-lg ring-1 ring-primary-foreground/20">
                <div className="w-36 h-10 sm:w-44 sm:h-12 relative">
                  <Image
                    src="/images/logo2.png"
                    alt="AiNextro LMS"
                    fill
                    className="object-contain drop-shadow-sm"
                    priority
                  />
                </div>
              </div>
              <div className="hidden sm:block pl-3 border-l border-primary-foreground/20">
                <p className="text-primary-foreground/90 text-[11px] font-medium tracking-widest uppercase">
                  {t("common.tagline")}
                </p>
              </div>
            </Link>
            <nav className="hidden sm:flex items-center gap-4 lg:gap-5">
              <Link href="/" className="text-primary-foreground/90 hover:text-primary-foreground text-sm font-medium transition-colors">
                {t("common.nav.home")}
              </Link>
              <Link href="/about" className="text-primary-foreground font-medium text-sm ring-2 ring-primary-foreground/40 ring-offset-2 ring-offset-primary px-2 py-1 rounded">
                {t("common.nav.about")}
              </Link>
              <Link href="/contact" className="text-primary-foreground/90 hover:text-primary-foreground text-sm font-medium transition-colors">
                {t("common.nav.contact")}
              </Link>
              <LanguageSelector variant="header" />
            </nav>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg bg-primary-foreground/15 hover:bg-primary-foreground/25 border border-primary-foreground/20 px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium text-primary-foreground transition-colors"
              >
                <LogIn size={16} className="shrink-0" />
                <span className="hidden sm:inline">{t("common.nav.login")}</span>
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-primary-foreground text-primary px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity shadow-md"
              >
                <UserPlus size={16} className="shrink-0" />
                {t("common.nav.signUp")}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main – About Us content (ICAI-style layout) */}
      <main className="flex-1 w-full pt-20 sm:pt-[5.5rem]">
        <div className="relative overflow-hidden">
          {/* Light wave/pattern background */}
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q 25 0 50 10 T 100 10' stroke='%2328a0a0' fill='none' stroke-width='0.5'/%3E%3Cpath d='M0 14 Q 25 4 50 14 T 100 14' stroke='%2328a0a0' fill='none' stroke-width='0.5'/%3E%3C/svg%3E")`,
              backgroundSize: "120px 40px",
            }}
          />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
              <ArrowLeft size={16} /> {t("common.backToHome")}
            </Link>

            {/* Centered logo + title */}
            <div className="flex flex-col items-center text-center mb-10 sm:mb-14">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mb-4">
                <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-card-foreground">
                {t("about.title")}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">{t("about.subtitle")}</p>
            </div>

            {/* Intro paragraphs – justified */}
            <div className="space-y-5 text-card-foreground text-sm sm:text-base leading-relaxed text-justify mb-10 sm:mb-14">
              <p>{t("about.p1")}</p>
              <p>{t("about.p2")}</p>
              <p>{t("about.p3")}</p>
            </div>

            {/* Two columns – Functions & Standards */}
            <div className="grid sm:grid-cols-2 gap-8 sm:gap-10">
              <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm">
                <h2 className="text-lg font-bold text-card-foreground mb-4 pb-2 border-b border-border">
                  {t("about.functions")}
                </h2>
                <ul className="space-y-2.5 text-sm sm:text-base text-muted-foreground">
                  {functionsList.map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-primary shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-primary" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm">
                <h2 className="text-lg font-bold text-card-foreground mb-4 pb-2 border-b border-border">
                  {t("about.standards")}
                </h2>
                <ul className="space-y-2.5 text-sm sm:text-base text-muted-foreground">
                  {standardsList.map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-primary shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-primary" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="shrink-0 border-t border-border bg-card/80 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} {t("common.footer.copyright")}</p>
            <div className="flex items-center gap-4">
              <Link href="/" className="hover:text-foreground transition-colors">{t("common.nav.home")}</Link>
              <Link href="/about" className="hover:text-foreground transition-colors">{t("common.nav.about")}</Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">{t("common.nav.contact")}</Link>
              <Link href="/login" className="hover:text-foreground transition-colors">{t("common.nav.login")}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
