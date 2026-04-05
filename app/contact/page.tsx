"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogIn, UserPlus, ArrowLeft, Mail, MessageSquare, Send, User } from "lucide-react";
import { LanguageSelector } from "@/components/language-selector";
import { useTranslationHook } from "@/lib/translations";

export default function ContactPage() {
  const { t } = useTranslationHook();
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError(t("contactPage.errorRequired"));
      return;
    }
    setSending(true);
    setError(null);
    setSent(false);
    try {
      // Replace with your API or email service later
      await new Promise((r) => setTimeout(r, 800));
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setError(t("contactPage.errorGeneric"));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-background font-sans">
      {/* Header – same as welcome */}
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
              <Link href="/about" className="text-primary-foreground/90 hover:text-primary-foreground text-sm font-medium transition-colors">
                {t("common.nav.about")}
              </Link>
              <Link href="/contact" className="text-primary-foreground font-medium text-sm ring-2 ring-primary-foreground/40 ring-offset-2 ring-offset-primary px-2 py-1 rounded">
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

      {/* Main – Contact form */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pt-20 sm:pt-[5.5rem] pb-8 sm:pb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> {t("contactPage.backToHome")}
        </Link>

        <div className="rounded-2xl border-2 border-border bg-card shadow-xl p-6 sm:p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-card-foreground">
              {t("contactPage.title")}
            </h1>
            <p className="mt-2 text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
              {t("contactPage.subtitle")}
            </p>
          </div>

          {sent && (
            <div className="mb-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 px-4 py-3 text-sm">
              {t("contactPage.thankYou")}
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-card-foreground mb-1.5">
                  {t("contactPage.name")} <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder={t("contactPage.placeholderName")}
                    required
                    className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-1.5">
                  {t("contactPage.email")} <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder={t("contactPage.placeholderEmail")}
                    required
                    className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-card-foreground mb-1.5">
                {t("contactPage.subject")}
              </label>
              <div className="relative">
                <MessageSquare size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <select
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-3 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none appearance-none bg-[length:16px] bg-[right_0.75rem_center] bg-no-repeat"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2378818c'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E)\"" }}
                >
                  <option value="">{t("contactPage.selectTopic")}</option>
                  <option value="general">{t("contactPage.topicGeneral")}</option>
                  <option value="support">{t("contactPage.topicSupport")}</option>
                  <option value="courses">{t("contactPage.topicCourses")}</option>
                  <option value="feedback">{t("contactPage.topicFeedback")}</option>
                  <option value="other">{t("contactPage.topicOther")}</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-card-foreground mb-1.5">
                {t("contactPage.message")} <span className="text-destructive">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder={t("contactPage.placeholderMessage")}
                required
                rows={5}
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none resize-y min-h-[120px]"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full sm:w-auto sm:min-w-[180px] inline-flex items-center justify-center gap-2 rounded-lg bg-primary py-3.5 px-6 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {sending ? (
                <>
                  <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  {t("contactPage.sending")}
                </>
              ) : (
                <>
                  <Send size={18} />
                  {t("contactPage.send")}
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="shrink-0 border-t border-border bg-card/80 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} {t("common.footer.copyright")}</p>
            <div className="flex items-center gap-4">
              <Link href="/" className="hover:text-foreground transition-colors">{t("common.nav.home")}</Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">{t("common.footer.contact")}</Link>
              <Link href="/login" className="hover:text-foreground transition-colors">{t("common.nav.login")}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
