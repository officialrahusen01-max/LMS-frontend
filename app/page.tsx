"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogIn, UserPlus, BookOpen, Award, Mail, MessageSquare, Send, User, FileCheck, Users, GraduationCap, Circle, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import { LanguageSelector } from "@/components/language-selector";
import { useTranslationHook } from "@/lib/translations";

const SLIDE_KEYS = ["slide1", "slide2", "slide3"] as const;
const SLIDE_IMAGE = "/images/authBanner.webp";

const TEACHERS = [
  { id: 1, name: "Dr. Sarah Mitchell", role: "Data Science & ML", online: true, courses: 12, students: 2840, image: null },
  { id: 2, name: "James Chen", role: "Web Development", online: true, courses: 8, students: 1920, image: null },
  { id: 3, name: "Emily Rodriguez", role: "Design & UX", online: false, courses: 6, students: 1150, image: null },
  { id: 4, name: "Prof. David Kumar", role: "Business & Strategy", online: true, courses: 10, students: 3200, image: null },
  { id: 5, name: "Lisa Park", role: "Digital Marketing", online: false, courses: 7, students: 980, image: null },
  { id: 6, name: "Michael Foster", role: "Cloud & DevOps", online: true, courses: 9, students: 2100, image: null },
  { id: 7, name: "Dr. Sarah Mitchell", role: "Data Science & ML", online: true, courses: 12, students: 2840, image: null },
  { id: 8, name: "James Chen", role: "Web Development", online: true, courses: 8, students: 1920, image: null },
  { id: 9, name: "Emily Rodriguez", role: "Design & UX", online: false, courses: 6, students: 1150, image: null },
  { id: 10, name: "Prof. David Kumar", role: "Business & Strategy", online: true, courses: 10, students: 3200, image: null },
  { id: 11, name: "Lisa Park", role: "Digital Marketing", online: false, courses: 7, students: 980, image: null },
  { id: 12, name: "Michael Foster", role: "Cloud & DevOps", online: true, courses: 9, students: 2100, image: null },
];

export default function WelcomePage() {
  const { t } = useTranslationHook();
  const [current, setCurrent] = useState(0);
  const teachersScrollRef = useRef<HTMLDivElement>(null);
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % SLIDE_KEYS.length);
  }, []);

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setContactForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setContactError(null);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setContactError(t("home.contact.errorRequired"));
      return;
    }
    setSending(true);
    setContactError(null);
    setSent(false);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setSent(true);
      setContactForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setContactError(t("home.contact.errorGeneric"));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-background font-sans overflow-x-hidden">
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
            {/* Logo + tagline */}
            <div className="flex items-center gap-3 sm:gap-4">
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
            </div>

            {/* Nav: Home, About Us, Contact Us, Language + Login & Sign up */}
            <nav className="hidden sm:flex items-center gap-4 lg:gap-5">
              <Link href="/" className="text-primary-foreground/90 hover:text-primary-foreground text-sm font-medium transition-colors">
                {t("common.nav.home")}
              </Link>
              <Link href="/about" className="text-primary-foreground/90 hover:text-primary-foreground text-sm font-medium transition-colors">
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
                {t("common.nav.signUp")} For Free
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-20 sm:pt-[5.5rem]">
      <section className="relative w-full min-h-[320px] sm:min-h-[400px] lg:min-h-[calc(100vh-160px)] z-10">
        <div className="absolute inset-0 overflow-hidden">
          {SLIDE_KEYS.map((key, i) => (
            <div
              key={key}
              className="absolute inset-0 transition-opacity duration-600 ease-out"
              style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
            >
              <Image
                src={SLIDE_IMAGE}
                alt=""
                fill
                className="object-cover object-center brightness-[0.8]"
                sizes="100vw"
                priority={i === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/93 via-primary/50 to-primary/20" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-14 lg:pr-[calc(420px+2rem)] xl:pr-[calc(480px+2.5rem)]">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-[1.1] max-w-3xl drop-shadow-xl">
                  {t(`home.hero.${key}.title`)}
                </h2>
                <p className="mt-4 text-lg sm:text-xl lg:text-2xl text-primary-foreground/95 max-w-2xl leading-relaxed">
                  {t(`home.hero.${key}.subtitle`)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-10 lg:left-14 flex gap-3 z-20">
          {SLIDE_KEYS.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all ${
                i === current
                  ? "h-3 w-10 bg-primary-foreground ring-2 ring-primary-foreground/50"
                  : "h-3 w-3 bg-primary-foreground/50 hover:bg-primary-foreground/70"
              }`}
            />
          ))}
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-full max-w-[380px] sm:max-w-[420px] xl:max-w-[480px] flex items-center justify-end p-4 sm:p-6 lg:p-8 xl:p-10 z-20 min-h-0 overflow-y-auto">
          <div className="w-full max-h-full rounded-2xl border-2 border-border bg-card/95 backdrop-blur-sm shadow-2xl p-6 sm:p-8 overflow-y-auto my-auto">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-card-foreground">
                {t("home.getStarted.title")}
              </h3>
              <p className="mt-2 sm:mt-3 text-sm sm:text-base text-muted-foreground">
                {t("home.getStarted.subtitle")}
              </p>
            </div>
            <div className="space-y-4 sm:space-y-5">
              <Link
                href="/login"
                className="flex items-center justify-center gap-3 w-full rounded-xl bg-primary py-3.5 sm:py-4 px-5 text-sm sm:text-base font-semibold text-primary-foreground hover:opacity-90 transition-opacity focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <LogIn size={20} className="shrink-0" />
                {t("home.getStarted.signIn")}
              </Link>
              <div className="relative py-1.5 sm:py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <p className="relative flex justify-center">
                  <span className="bg-card px-3 sm:px-4 text-xs sm:text-sm text-muted-foreground uppercase tracking-wider">{t("home.getStarted.or")}</span>
                </p>
              </div>
              <Link
                href="/register"
                className="flex items-center justify-center gap-3 w-full rounded-xl border-2 border-primary py-3.5 sm:py-4 px-5 text-sm sm:text-base font-semibold text-primary hover:bg-primary/5 transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <UserPlus size={20} className="shrink-0" />
                {t("home.getStarted.register")}
              </Link>
            </div>
            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border space-y-3 sm:space-y-4">
              <p className="text-xs sm:text-sm font-semibold text-card-foreground flex items-center gap-2">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-destructive" /> {t("home.getStarted.quickGuide")}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                <strong className="text-card-foreground">{t("home.getStarted.newUser")}</strong> {t("home.getStarted.newUserDesc")}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                <strong className="text-card-foreground">{t("home.getStarted.alreadyJoined")}</strong> {t("home.getStarted.alreadyJoinedDesc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Our experts" className="w-full py-10 sm:py-12 bg-muted/40 border-t border-border overflow-hidden">
        <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6 px-4">
          {t("home.experts")}
        </p>
        <div className="relative flex items-center gap-3 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => teachersScrollRef.current?.scrollBy({ left: -280, behavior: "smooth" })}
            aria-label="Scroll left"
            className="z-10 shrink-0 rounded-full bg-card border-2 border-border p-2.5 shadow-md hover:bg-muted hover:border-primary/30 transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <ChevronLeft className="w-6 h-6 text-primary" />
          </button>
          <div
            ref={teachersScrollRef}
            className="flex-1 min-w-0 overflow-x-auto overflow-y-hidden scroll-smooth py-2"
            style={{ scrollbarWidth: "thin", WebkitOverflowScrolling: "touch" }}
          >
            <div className="flex w-max min-h-[7rem] gap-8 sm:gap-10 px-1">
              {[...TEACHERS, ...TEACHERS].map((t, i) => (
                <div key={`${t.id}-${i}`} className="flex shrink-0 flex-col items-center gap-3">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/15 border-2 border-primary/30 flex items-center justify-center overflow-hidden ring-2 ring-background shadow-lg">
                    <Image
                      src="/images/logo2.png"
                      alt=""
                      fill
                      className="object-contain p-2"
                      sizes="96px"
                    />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">{t.name.split(" ")[0]}</span>
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => teachersScrollRef.current?.scrollBy({ left: 280, behavior: "smooth" })}
            aria-label="Scroll right"
            className="z-10 shrink-0 rounded-full bg-card border-2 border-border p-2.5 shadow-md hover:bg-muted hover:border-primary/30 transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <ChevronRight className="w-6 h-6 text-primary" />
          </button>
        </div>
      </section>

      <section id="why" aria-label="Why choose us" className="w-full py-16 sm:py-24 bg-background border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-card-foreground">
              {t("home.why.title")}
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("home.why.subtitle")}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="rounded-2xl border-2 border-border bg-card p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="rounded-xl bg-primary/10 w-14 h-14 flex items-center justify-center mb-6">
                <BookOpen className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-card-foreground mb-3">
                {t("home.why.card1.title")}
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                {t("home.why.card1.desc")}
              </p>
            </div>
            <div className="rounded-2xl border-2 border-border bg-card p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="rounded-xl bg-primary/10 w-14 h-14 flex items-center justify-center mb-6">
                <FileCheck className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-card-foreground mb-3">
                {t("home.why.card2.title")}
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                {t("home.why.card2.desc")}
              </p>
            </div>
            <div className="rounded-2xl border-2 border-border bg-card p-8 shadow-lg hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1">
              <div className="rounded-xl bg-primary/10 w-14 h-14 flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-card-foreground mb-3">
                {t("home.why.card3.title")}
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                {t("home.why.card3.desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="instructors" aria-label="Our instructors" className="w-full py-16 sm:py-24 border-t border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-card-foreground">
              {t("home.instructors.title")}
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("home.instructors.subtitle")}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {TEACHERS.map((teacher) => (
              <div key={teacher.id} className="rounded-2xl border-2 border-border bg-card p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow flex flex-col">
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/15 border-2 border-primary/30 flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-background">
                    <Image
                      src="/images/logo2.png"
                      alt=""
                      fill
                      className="object-contain p-1.5"
                      sizes="80px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-card-foreground truncate">{teacher.name}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{teacher.role}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${teacher.online ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                        <Circle className={`w-2 h-2 fill-current ${teacher.online ? "text-emerald-500" : ""}`} />
                        {teacher.online ? t("common.online") : t("common.offline")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-muted/50 px-4 py-3 text-center">
                    <p className="text-2xl sm:text-3xl font-bold text-card-foreground">{teacher.courses}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{t("common.courses")}</p>
                  </div>
                  <div className="rounded-xl bg-muted/50 px-4 py-3 text-center">
                    <p className="text-2xl sm:text-3xl font-bold text-card-foreground">{teacher.students.toLocaleString()}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{t("common.students")}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us – form left, Google Map right */}
      <section id="contact" aria-label="Contact us" className="w-full border-t border-border bg-background py-16 sm:py-24 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-card-foreground">
              {t("home.contact.title")}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
              {t("home.contact.subtitle")}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
            {/* Form – left */}
            <div className="rounded-2xl border-2 border-border bg-card shadow-xl p-6 sm:p-8 lg:p-10 flex flex-col">
              <h3 className="text-xl font-bold text-card-foreground mb-1">{t("home.contact.sendMessage")}</h3>
              <p className="text-sm text-muted-foreground mb-6">{t("home.contact.fillForm")}</p>
              {sent && (
                <div className="mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 px-5 py-4 text-base">
                  {t("home.contact.thankYou")}
                </div>
              )}
              {contactError && (
                <div className="mb-6 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive px-5 py-4 text-base">
                  {contactError}
                </div>
              )}
              <form onSubmit={handleContactSubmit} className="space-y-5 flex-1 flex flex-col">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-name" className="block text-base font-medium text-card-foreground mb-2">
                      {t("home.contact.name")} <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        value={contactForm.name}
                        onChange={handleContactChange}
                        placeholder={t("home.contact.placeholderName")}
                        required
                        className="w-full rounded-xl border border-input bg-background pl-11 pr-4 py-3 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-base font-medium text-card-foreground mb-2">
                      {t("home.contact.email")} <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        value={contactForm.email}
                        onChange={handleContactChange}
                        placeholder={t("home.contact.placeholderEmail")}
                        required
                        className="w-full rounded-xl border border-input bg-background pl-11 pr-4 py-3 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-subject" className="block text-base font-medium text-card-foreground mb-2">
                    {t("home.contact.subject")}
                  </label>
                  <div className="relative">
                    <MessageSquare size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <select
                      id="contact-subject"
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleContactChange}
                      className="w-full rounded-xl border border-input bg-background pl-11 pr-4 py-3 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none appearance-none bg-no-repeat bg-[length:16px] bg-[right_0.75rem_center]"
                      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2378818c'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E)\"" }}
                    >
                      <option value="">{t("home.contact.selectTopic")}</option>
                      <option value="general">{t("home.contact.topicGeneral")}</option>
                      <option value="support">{t("home.contact.topicSupport")}</option>
                      <option value="courses">{t("home.contact.topicCourses")}</option>
                      <option value="feedback">{t("home.contact.topicFeedback")}</option>
                      <option value="other">{t("home.contact.topicOther")}</option>
                    </select>
                  </div>
                </div>
                <div className="flex-1 min-h-0">
                  <label htmlFor="contact-message" className="block text-base font-medium text-card-foreground mb-2">
                    {t("home.contact.message")} <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    placeholder={t("home.contact.placeholderMessage")}
                    required
                    rows={4}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none resize-y min-h-[120px]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full sm:w-auto min-w-[200px] inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-4 px-6 text-base font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {sending ? (
                    <>
                      <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      {t("home.contact.sending")}
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      {t("home.contact.send")}
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Google Map – right, same height as form */}
            <div className="rounded-2xl border-2 border-border bg-card shadow-xl overflow-hidden flex flex-col min-h-[280px] sm:min-h-[320px] lg:min-h-[420px]">
              <div className="p-4 sm:p-5 border-b border-border bg-muted/30">
                <h3 className="text-lg font-bold text-card-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden />
                  {t("common.findUs")}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{t("common.findUsDesc")}</p>
              </div>
              <div className="relative flex-1 w-full min-h-[240px] sm:min-h-[280px] lg:min-h-[360px]">
                <iframe
                  title="Office location on Google Maps"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56933.791!2d75.7727232!3d26.9975522!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4adf4c57e281%3A0xce3c2d7738b4b43!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1709123456789!5m2!1sen!2sin"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 w-full h-full border-0 bg-muted"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      </main>

      {/* Footer – sections: logo, contact, links */}
      <footer className="shrink-0 border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 text-card-foreground">
                <BookOpen size={24} className="shrink-0 text-primary" />
                <span className="text-lg font-bold">AiNextro LMS</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground max-w-xs">
                {t("common.footer.tagline")}
              </p>
            </div>
            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold text-card-foreground uppercase tracking-wider mb-4">{t("common.footer.contact")}</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <a href="tel:+919772609110" className="flex items-center gap-2 hover:text-foreground transition-colors">
                    <Phone size={16} className="shrink-0" /> 9772609110
                  </a>
                </li>
                <li>
                  <a href="tel:+919660439686" className="flex items-center gap-2 hover:text-foreground transition-colors">
                    <Phone size={16} className="shrink-0" /> 9660439686
                  </a>
                </li>
                <li>
                  <a href="mailto:officialrahusen01@gmail.com" className="flex items-center gap-2 hover:text-foreground transition-colors break-all">
                    <Mail size={16} className="shrink-0 mt-0.5" /> officialrahusen01@gmail.com
                  </a>
                </li>
              </ul>
            </div>
            {/* Quick links */}
            <div>
              <h4 className="text-sm font-semibold text-card-foreground uppercase tracking-wider mb-4">{t("common.footer.quickLinks")}</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">{t("common.nav.about")}</Link></li>
                <li><Link href="/#contact" className="hover:text-foreground transition-colors">{t("common.nav.contact")}</Link></li>
                <li><Link href="/login" className="hover:text-foreground transition-colors">{t("common.nav.login")}</Link></li>
                <li><Link href="/register" className="hover:text-foreground transition-colors">{t("common.nav.signUp")}</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} {t("common.footer.copyright")}</p>
            <p className="flex items-center gap-2">
              <Award size={16} className="shrink-0" /> {t("common.footer.empowering")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
