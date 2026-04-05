"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  FileText,
  ArrowRight,
  Users,
  Award,
  TrendingUp,
  Clock,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { apiJson } from "@/lib/api";
import { motion } from "framer-motion";
import StudentHeroCourseSearch from "@/components/student-hero-course-search";
import { getStudentCardGradient } from "@/lib/student-card-gradients";

const MotionLink = motion(Link);

/**
 * Partners: `domain` → logo `/api/partner-logo` (server proxy; Google favicon / DDG / Clearbit).
 * Apne assets: `logo: "/images/partners/acme.png"`
 */
const TRUSTED_BY = [
  { name: "Google", domain: "google.com" },
  { name: "Microsoft", domain: "microsoft.com" },
  { name: "Amazon", domain: "amazon.com" },
  { name: "TCS", domain: "tcs.com" },
  { name: "Infosys", domain: "infosys.com" },
  { name: "Accenture", domain: "accenture.com" },
  { name: "IBM", domain: "ibm.com" },
  { name: "Adobe", domain: "adobe.com" },
  { name: "Wipro", domain: "wipro.com" },
  { name: "Cognizant", domain: "cognizant.com" },
  { name: "Capgemini", domain: "capgemini.com" },
  { name: "Deloitte", domain: "deloitte.com" },
];

function partnerLogoSrc(p) {
  if (p?.logo) return p.logo;
  if (p?.domain) return `/api/partner-logo?domain=${encodeURIComponent(p.domain)}`;
  return null;
}

function PartnerMarqueePill({ partner }) {
  const [broken, setBroken] = useState(false);
  const src = partnerLogoSrc(partner);
  const showImg = Boolean(src) && !broken;
  const initials = (partner.name || "?").slice(0, 2).toUpperCase();

  return (
    <span className="shrink-0 inline-flex items-center gap-2 sm:gap-2.5 rounded-full border border-border/90 bg-card pl-2 pr-4 py-1.5 sm:pl-2.5 sm:pr-5 sm:py-2 text-xs sm:text-sm font-semibold tracking-wide text-foreground/85 shadow-sm ring-1 ring-black/[0.02] dark:ring-white/[0.04] transition hover:border-primary/35 hover:text-primary hover:shadow-md">
      <span className="relative flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted/80 border border-border/50">
        {showImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt=""
            width={32}
            height={32}
            className="h-full w-full object-contain p-0.5"
            loading="lazy"
            referrerPolicy={src?.startsWith("/") ? undefined : "no-referrer"}
            onError={() => setBroken(true)}
          />
        ) : (
          <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground">{initials}</span>
        )}
      </span>
      <span className="pr-0.5">{partner.name}</span>
    </span>
  );
}

/** edX-style trending — tabs share card templates; category banner changes per tab */
const TRENDING_IMG_A = "/images/banner2.png";
const TRENDING_IMG_B = "/images/studentBanner.png";

const TRENDING_TABS = [
  { id: "exec", label: "Executive Education" },
  { id: "courses", label: "Courses" },
  { id: "certs", label: "Certificates" },
  { id: "masters", label: "Master's degrees" },
  { id: "bachelor", label: "Bachelor's degrees" },
];

const TRENDING_CARD_BLUEPRINT = [
  {
    title: "AI Developer Professional Certificate",
    org: "IBM",
    domain: "ibm.com",
    duration: "6 months to complete",
    image: TRENDING_IMG_B,
    topics: ["Featured", "AI & Digital Transformation"],
  },
  {
    title: "MBA Essentials",
    org: "London School of Economics",
    domain: "lse.ac.uk",
    duration: "3 months to complete",
    image: TRENDING_IMG_A,
    topics: ["Featured", "Leadership & Interpersonal Skills", "Sustainability"],
  },
  {
    title: "Advanced Cloud Architecture",
    org: "Microsoft",
    domain: "microsoft.com",
    duration: "8 weeks to complete",
    image: TRENDING_IMG_B,
    topics: ["Technology", "Cloud"],
  },
  {
    title: "UX Design Professional Certificate",
    org: "Adobe",
    domain: "adobe.com",
    duration: "4 months to complete",
    image: TRENDING_IMG_A,
    topics: ["Featured", "Design"],
  },
  {
    title: "Data Science with Python",
    org: "Google",
    domain: "google.com",
    duration: "10 weeks to complete",
    image: TRENDING_IMG_B,
    topics: ["Data Science", "AI & Digital Transformation"],
  },
  {
    title: "Leading Sustainable Business",
    org: "Oxford University",
    domain: "ox.ac.uk",
    duration: "6 weeks to complete",
    image: TRENDING_IMG_A,
    topics: ["Featured", "Sustainability", "Leadership & Interpersonal Skills"],
  },
];

const TRENDING_BY_TAB = {
  exec: {
    filters: [
      "Featured",
      "AI & Digital Transformation",
      "Sustainability",
      "Leadership & Interpersonal Skills",
      "Data Science",
      "Technology",
      "Design",
      "Cloud",
    ],
    viewMore: "View more featured executive education",
    category: "Executive Education",
  },
  courses: {
    filters: ["Featured", "Web development", "Data", "AI & ML", "Beginner friendly", "Popular this week"],
    viewMore: "View more trending courses",
    category: "Course",
  },
  certs: {
    filters: ["Featured", "Professional cert", "Tech skills", "Business", "Short programs"],
    viewMore: "View more certificate programs",
    category: "Certificate",
  },
  masters: {
    filters: ["Featured", "Computer Science", "Business", "Analytics", "Online"],
    viewMore: "View more master's programs",
    category: "Master's degree",
  },
  bachelor: {
    filters: ["Featured", "Undergraduate", "Foundations", "Career prep", "Flexible pace"],
    viewMore: "View more bachelor's programs",
    category: "Bachelor's degree",
  },
};

function buildTrendingCards(tabId) {
  const { category } = TRENDING_BY_TAB[tabId];
  return TRENDING_CARD_BLUEPRINT.map((c) => ({
    ...c,
    cat: category,
    topics: tabId === "exec" ? c.topics : ["Featured", "Popular this week"],
  }));
}

const trendingSpring = { type: "spring", stiffness: 420, damping: 32 };
const trendingEase = [0.22, 1, 0.36, 1];

function TrendingProgramCard({ card }) {
  const [logoBroken, setLogoBroken] = useState(false);
  const src =
    card.logo || (card.domain ? `/api/partner-logo?domain=${encodeURIComponent(card.domain)}` : null);
  const showLogo = Boolean(src) && !logoBroken;

  return (
    <MotionLink
      href={card.href ?? "/student/cours"}
      className="group flex w-[min(272px,82vw)] shrink-0 flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/95 text-left shadow-[0_1px_0_rgba(0,0,0,0.04),0_12px_32px_-8px_rgba(0,0,0,0.12)] backdrop-blur-sm transition-[box-shadow,border-color] duration-300 hover:border-primary/30 hover:shadow-[0_1px_0_rgba(0,0,0,0.03),0_20px_48px_-12px_rgba(0,0,0,0.18)] dark:shadow-[0_1px_0_rgba(255,255,255,0.04),0_12px_40px_-10px_rgba(0,0,0,0.5)]"
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.985 }}
      transition={trendingSpring}
    >
      <div className="relative border-b border-border/60 bg-gradient-to-r from-primary/[0.1] via-primary/[0.05] to-transparent px-3 py-1.5 text-[11px] font-semibold tracking-wide text-primary dark:from-primary/15 dark:via-primary/5 dark:to-transparent dark:text-primary-foreground/95">
        {card.cat}
      </div>
      <div className="relative h-40 overflow-hidden bg-muted">
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-[1]" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.image}
          alt=""
          className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.06]"
        />
        <motion.div
          className="absolute bottom-2 left-2 z-[2] flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-lg border border-white/20 bg-background/95 p-1.5 shadow-lg ring-1 ring-black/[0.06] dark:ring-white/10"
          whileHover={{ scale: 1.06 }}
          transition={trendingSpring}
        >
          {showLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt=""
              className="max-h-full max-w-full object-contain"
              onError={() => setLogoBroken(true)}
            />
          ) : (
            <span className="text-[11px] font-bold text-muted-foreground">
              {(card.org || "?").slice(0, 2).toUpperCase()}
            </span>
          )}
        </motion.div>
      </div>
      <div className="flex flex-1 flex-col p-4 pt-3">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors duration-200 group-hover:text-primary">
          {card.title}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">{card.org}</p>
        <p className="mt-auto flex items-center gap-1.5 pt-3 text-xs text-muted-foreground">
          <Clock size={14} className="shrink-0 opacity-70" />
          {card.duration}
        </p>
      </div>
    </MotionLink>
  );
}

const sliderCourses = [
  { title: "Full-Stack Web Development", tag: "In progress" },
  { title: "Advanced React & Next.js", tag: "Popular" },
  { title: "Data Structures & Algorithms", tag: "Recommended" },
  { title: "UI/UX Design Essentials", tag: "Design" },
];

export default function StudentHomePage() {
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoadingStats(true);
    setStatsError(null);
    apiJson("dashboard/student")
      .then((r) => {
        if (!cancelled) setStats(r?.data ?? null);
      })
      .catch((e) => {
        if (!cancelled) setStatsError(e?.message || "Failed to load dashboard stats");
      })
      .finally(() => {
        if (!cancelled) setLoadingStats(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const enrollmentCount = (stats?.enrollments ?? []).filter((e) => e?.status !== "cancelled").length;
  const certificateCount = (stats?.certificates ?? []).length;
  const avgProgress = useMemo(() => {
    const list = stats?.progress ?? [];
    if (!Array.isArray(list) || list.length === 0) return 0;
    const total = list.reduce((sum, p) => sum + (Number(p?.percentComplete) || 0), 0);
    return Math.round(total / list.length);
  }, [stats]);

  const recent = useMemo(() => {
    const items = stats?.recentActivity ?? [];
    if (!Array.isArray(items)) return [];
    // Each item: { courseTitle, courseSlug, recentlyCompleted: [lesson], updatedAt }
    return items.slice(0, 6);
  }, [stats]);

  const trendPillRef = useRef(null);
  const trendCardRef = useRef(null);
  const [trendTab, setTrendTab] = useState(TRENDING_TABS[0].id);
  const [trendFilter, setTrendFilter] = useState(TRENDING_BY_TAB[TRENDING_TABS[0].id].filters[0]);

  useEffect(() => {
    setTrendFilter(TRENDING_BY_TAB[trendTab].filters[0]);
  }, [trendTab]);

  const trendTabConfig = TRENDING_BY_TAB[trendTab];
  const trendCardsList = useMemo(() => buildTrendingCards(trendTab), [trendTab]);
  const trendCardsVisible = useMemo(() => {
    const first = trendTabConfig.filters[0];
    if (trendFilter === first) return trendCardsList;
    const filtered = trendCardsList.filter((c) => (c.topics || []).includes(trendFilter));
    return filtered.length ? filtered : trendCardsList;
  }, [trendFilter, trendTabConfig, trendCardsList]);

  const scrollTrendRow = (ref, delta) => ref.current?.scrollBy({ left: delta, behavior: "smooth" });

  return (
    <>
      {/* Hero + slider + trusted strip (ek hi block — niche touch) */}
      <section className="relative w-full overflow-hidden bg-primary flex flex-col">
        {/* Blurred student banner background */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/images/studentBanner.png"
            alt="Student learning"
            className="w-full h-full object-cover scale-110 opacity-30"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/75 to-primary/40" />

        {/* Enrolled courses search — hero top, centered */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-12 pb-1">
          <StudentHeroCourseSearch />
        </div>

        <div className="relative z-10 flex w-full flex-1 items-center min-h-[300px] sm:min-h-[380px] lg:min-h-[62vh]">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-16 lg:pb-20 pt-4 sm:pt-8 lg:pt-10">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.15em] text-primary-foreground/80 mb-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground/85" />
                  You are logged in as student
                </p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground leading-tight">
                  Continue your{" "}
                  <span className="underline decoration-primary-foreground/70 decoration-4 underline-offset-4">
                    learning journey
                  </span>
                </h1>
                <p className="mt-4 text-base sm:text-lg text-primary-foreground/95 max-w-xl">
                  Jump back into your courses, track your progress in real-time, and unlock
                  certificates that boost your career — all from your student dashboard.
                </p>
                <div className="mt-7 flex flex-wrap gap-4">
                  <Link
                    href="/student/dashboard"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary-foreground text-primary px-5 py-3 text-sm font-semibold shadow-lg hover:opacity-90 transition-opacity"
                  >
                    Go to My Learning <ArrowRight size={18} />
                  </Link>
                  <Link
                    href="/student/cours"
                    className="inline-flex items-center gap-2 rounded-lg border border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground px-5 py-3 text-sm font-medium hover:bg-primary-foreground/20 transition-colors"
                  >
                    Browse all courses
                  </Link>
                </div>
                <div className="mt-6 flex flex-wrap gap-4 text-xs text-primary-foreground/80">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary-foreground/10 px-3 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground/70" />
                    Progress synced across all devices
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary-foreground/10 px-3 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground/55" />
                    Certificates issued instantly on completion
                  </span>
                </div>
              </div>

              {/* Simple auto-scrolling slider style list */}
              <div className="hidden sm:block">
                <div className="relative h-full">
                  <div className="absolute -top-6 -right-4 h-16 w-16 rounded-full bg-primary-foreground/10 blur-2xl" />
                  <div className="absolute -bottom-10 -left-6 h-20 w-20 rounded-full bg-primary-foreground/15 blur-3xl" />

                  <div className="relative overflow-hidden rounded-2xl bg-primary-foreground/5 border border-primary-foreground/15 shadow-xl">
                    <div className="px-4 pt-4 pb-3 flex items-center justify-between">
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary-foreground/70">
                        Your courses
                      </p>
                      <span className="text-[11px] text-primary-foreground/70">
                        Auto-scroll preview
                      </span>
                    </div>
                    <div className="relative h-64 overflow-hidden">
                      <div className="absolute inset-0 animate-[slide-up_16s_linear_infinite]">
                        {[...sliderCourses, ...sliderCourses].map((c, idx) => (
                          <div
                            key={`${c.title}-${idx}`}
                            className="mx-3 mb-3 rounded-xl bg-gradient-to-r shadow-md text-primary-foreground/95"
                            style={{ backgroundImage: undefined }}
                          >
                            <div
                              className={`rounded-xl bg-gradient-to-r ${getStudentCardGradient(idx)} px-4 py-3 flex items-center justify-between gap-3`}
                            >
                              <div className="min-w-0">
                                <p className="text-xs uppercase tracking-wide text-white/80">
                                  {c.tag}
                                </p>
                                <p className="mt-1 text-sm font-semibold text-white line-clamp-2">
                                  {c.title}
                                </p>
                              </div>
                              <Link
                                href="/student/dashboard"
                                className="shrink-0 inline-flex items-center justify-center rounded-full bg-white/15 text-white px-3 py-1 text-[11px] font-medium hover:bg-white/25 transition-colors"
                              >
                                Continue
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                      <style jsx>{`
                      @keyframes slide-up {
                        0% {
                          transform: translateY(0);
                        }
                        100% {
                          transform: translateY(-50%);
                        }
                      }
                    `}</style>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted by — hero se chipka (same section) */}
        <div className="relative z-10 w-full border-t border-primary-foreground/15 bg-primary-foreground/[0.08] backdrop-blur-md overflow-hidden">
          <div className="absolute -top-20 left-[8%] h-48 w-48 rounded-full bg-primary-foreground/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 right-[6%] h-56 w-56 rounded-full bg-primary-foreground/10 blur-3xl pointer-events-none opacity-70" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-4 sm:pt-3 sm:pb-5">
            <div className="rounded-2xl border border-border/80 bg-card/80 backdrop-blur-sm shadow-sm overflow-hidden -mt-1 sm:-mt-0.5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-border/60 bg-gradient-to-r from-card via-card to-primary/[0.03]">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                        Partners
                      </span>
                      <span className="text-[11px] text-muted-foreground font-medium">
                        {TRUSTED_BY.length}+ global brands
                      </span>
                    </div>
                    <p className="mt-1.5 text-base sm:text-lg font-bold text-foreground tracking-tight">
                      Trusted by learners from leading companies
                    </p>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-xl">
                      Teams and professionals use AiNextro LMS-style learning paths to upskill, certify, and grow.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:flex-col sm:items-end sm:gap-1">
                  <div
                    className="hidden sm:flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground shadow-inner"
                    aria-hidden
                  >
                    <ChevronRight size={20} strokeWidth={2} />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground hidden sm:block">
                    Scroll
                  </span>
                </div>
              </div>

              <div className="relative group px-1 sm:px-2 py-4 sm:py-5">
                <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-12 sm:w-20 bg-gradient-to-r from-card to-transparent" />
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-12 sm:w-20 bg-gradient-to-l from-card to-transparent" />

                <div className="mx-2 rounded-xl border border-dashed border-border/70 bg-muted/25 px-2 py-3 sm:py-4 shadow-inner">
                  <div className="overflow-hidden rounded-lg">
                    <div className="flex w-max gap-4 sm:gap-5 md:gap-6 items-center animate-[partner-marquee_45s_linear_infinite] group-hover:[animation-play-state:paused]">
                      {[...TRUSTED_BY, ...TRUSTED_BY].map((partner, i) => (
                        <PartnerMarqueePill key={`${partner.name}-${i}`} partner={partner} />
                      ))}
                    </div>
                  </div>
                </div>
                <style jsx>{`
                @keyframes partner-marquee {
                  0% {
                    transform: translateX(0);
                  }
                  100% {
                    transform: translateX(-50%);
                  }
                }
              `}</style>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LMS-style feature section */}
      <section className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/6 via-transparent to-transparent pointer-events-none" />
            <div className="absolute -top-14 -right-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

            <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] items-center p-6 sm:p-10">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
                  Student dashboard
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Tools & Progress
                </p>
                <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                  Learn smarter with progress, certificates & quick access
                </h2>
                <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl">
                  Enroll in courses, complete lessons, and earn verified certificates. Everything is synced with your account and available anytime.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="group rounded-xl border border-border bg-background/60 p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                        <BookOpen size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">My Learning</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Track enrollments, progress, and certificates.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group rounded-xl border border-border bg-background/60 p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                        <TrendingUp size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">Progress tracking</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Completion % updates as you finish lessons.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group rounded-xl border border-border bg-background/60 p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                        <Award size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">Certificates</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Get certificates on 100% completion.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group rounded-xl border border-border bg-background/60 p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                        <Users size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">Explore & connect</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Find courses and connect with other learners.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="/student/dashboard"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity"
                  >
                    Open My Learning <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/student/cours"
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted/40 transition-colors"
                  >
                    Browse courses
                  </Link>
                </div>

                <p className="mt-4 text-xs text-muted-foreground">
                  Tip: Use the top search bar to open any enrolled course instantly.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -right-5 -top-5 h-full w-full rounded-3xl bg-primary/10" aria-hidden />
                <div className="relative overflow-hidden rounded-3xl border border-border bg-muted shadow-xl">
                  <div className="aspect-[4/3]">
                    <img
                      src="/images/banner2.png"
                      alt="Student banner"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-border bg-background/70 p-3 text-center">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Courses</p>
                    <p className="mt-1 text-lg font-bold text-foreground">{enrollmentCount}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-background/70 p-3 text-center">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Progress</p>
                    <p className="mt-1 text-lg font-bold text-foreground">{avgProgress}%</p>
                  </div>
                  <div className="rounded-xl border border-border bg-background/70 p-3 text-center">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Certs</p>
                    <p className="mt-1 text-lg font-bold text-foreground">{certificateCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick stats + recent activity */}
      <section className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Your overview</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Snapshot of your learning progress and recent activity.
              </p>
            </div>
            <Link
              href="/student/dashboard"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              View details <ArrowRight size={16} />
            </Link>
          </div>

          {loadingStats ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : statsError ? (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
              {statsError}
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] items-start">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Enrolled courses
                    </p>
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <p className="mt-3 text-2xl font-bold text-foreground">{enrollmentCount}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Active enrollments</p>
                </div>

                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Avg progress
                    </p>
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <p className="mt-3 text-2xl font-bold text-foreground">{avgProgress}%</p>
                  <p className="mt-1 text-xs text-muted-foreground">Across your courses</p>
                </div>

                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Certificates
                    </p>
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <p className="mt-3 text-2xl font-bold text-foreground">{certificateCount}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Earned so far</p>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Clock size={16} className="text-primary" /> Recent activity
                  </h3>
                  <Link href="/student/studentlist" className="text-xs font-medium text-primary hover:underline">
                    My learning
                  </Link>
                </div>
                <div className="p-5">
                  {recent.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No recent activity yet. Start a lesson and your progress will appear here.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {recent.map((r, idx) => (
                        <li key={r?.courseSlug ?? r?.courseTitle ?? idx} className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {r?.courseTitle ?? "Course"}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                              Recently completed:{" "}
                              {(r?.recentlyCompleted ?? [])
                                .slice(0, 2)
                                .map((l) => l?.title)
                                .filter(Boolean)
                                .join(", ") || "—"}
                            </p>
                          </div>
                          <Link
                            href="/student/dashboard"
                            className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                          >
                            Open <ArrowRight size={14} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Trending (edX-style) — premium + motion */}
      <section className="relative overflow-hidden border-t border-border bg-gradient-to-b from-muted/50 via-background to-muted/30">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-primary/[0.07] blur-3xl"
          animate={{ opacity: [0.5, 0.85, 0.5], scale: [1, 1.08, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-primary/[0.05] blur-3xl"
          animate={{ opacity: [0.4, 0.75, 0.4], scale: [1.05, 1, 1.05] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        <div className="relative z-[1] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, ease: trendingEase }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/90">
              Curated for you
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Trending on <span className="text-primary">AiNextro</span>
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Explore programs learners are starting this week — switch category or filter to refine.
            </p>
          </motion.div>

          <motion.div
            className="mt-7 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:thin] sm:flex-wrap sm:overflow-visible"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08, duration: 0.45, ease: trendingEase }}
          >
            {TRENDING_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTrendTab(tab.id)}
                className={`relative shrink-0 overflow-hidden rounded-full px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${trendTab === tab.id
                    ? "text-primary-foreground"
                    : "text-foreground hover:text-foreground/90"
                  }`}
              >
                {trendTab === tab.id && (
                  <motion.span
                    layoutId="trending-main-tab"
                    className="absolute inset-0 rounded-full bg-primary shadow-md shadow-primary/25"
                    transition={trendingSpring}
                  />
                )}
                {trendTab !== tab.id && (
                  <span className="absolute inset-0 rounded-full bg-background/90 ring-1 ring-border/90 shadow-sm transition-colors hover:bg-muted/70" />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </motion.div>

          <div className="relative mt-6">
            <motion.button
              type="button"
              aria-label="Scroll filters left"
              className="absolute left-0 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-background/95 shadow-md backdrop-blur-sm hover:bg-muted sm:flex"
              onClick={() => scrollTrendRow(trendPillRef, -200)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
            >
              <ChevronLeft size={18} />
            </motion.button>
            <motion.button
              type="button"
              aria-label="Scroll filters right"
              className="absolute right-0 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-background/95 shadow-md backdrop-blur-sm hover:bg-muted sm:flex"
              onClick={() => scrollTrendRow(trendPillRef, 200)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
            >
              <ChevronRight size={18} />
            </motion.button>
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-[1] w-8 bg-gradient-to-r from-background/90 to-transparent sm:w-12" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-[1] w-8 bg-gradient-to-l from-background/90 to-transparent sm:w-12" />
            <div
              ref={trendPillRef}
              className="flex gap-2 overflow-x-auto px-1 py-1 sm:px-11 [-ms-overflow-style:none] [scrollbar-width:thin]"
            >
              {trendTabConfig.filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setTrendFilter(f)}
                  className={`relative shrink-0 overflow-hidden rounded-full px-4 py-2 text-xs font-medium transition-colors duration-200 ${trendFilter === f ? "text-primary-foreground" : "text-foreground"
                    }`}
                >
                  {trendFilter === f && (
                    <motion.span
                      layoutId="trending-filter-pill"
                      className="absolute inset-0 rounded-full bg-primary"
                      transition={trendingSpring}
                    />
                  )}
                  {trendFilter !== f && (
                    <span className="absolute inset-0 rounded-full border border-border/90 bg-background/95 shadow-sm ring-1 ring-black/[0.03] transition-colors hover:border-primary/25 dark:ring-white/[0.06]" />
                  )}
                  <span className="relative z-10 font-semibold">{f}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative mt-9">
            <motion.button
              type="button"
              aria-label="Scroll programs left"
              className="absolute left-0 top-[42%] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-background/95 shadow-lg backdrop-blur-sm hover:bg-muted md:flex"
              onClick={() => scrollTrendRow(trendCardRef, -300)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
            >
              <ChevronLeft size={20} />
            </motion.button>
            <motion.button
              type="button"
              aria-label="Scroll programs right"
              className="absolute right-0 top-[42%] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-background/95 shadow-lg backdrop-blur-sm hover:bg-muted md:flex"
              onClick={() => scrollTrendRow(trendCardRef, 300)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
            >
              <ChevronRight size={20} />
            </motion.button>
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-[1] w-10 bg-gradient-to-r from-background/95 to-transparent md:w-14" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-[1] w-10 bg-gradient-to-l from-background/95 to-transparent md:w-14" />
            <div
              ref={trendCardRef}
              className="overflow-x-auto px-1 pb-2 pt-1 md:px-12 [-ms-overflow-style:none] [scrollbar-width:thin]"
            >
              <motion.div
                key={`${trendTab}-${trendFilter}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.28, ease: trendingEase }}
                className="flex min-w-max gap-5 md:gap-6"
              >
                {trendCardsVisible.map((card, idx) => (
                  <motion.div
                    key={`${card.title}-${idx}`}
                    initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      delay: 0.055 * idx,
                      duration: 0.48,
                      ease: trendingEase,
                    }}
                  >
                    <TrendingProgramCard card={card} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            <MotionLink
              href="/student/cours"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
              whileHover={{ x: 3 }}
              transition={trendingSpring}
            >
              {trendTabConfig.viewMore}
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowRight size={16} className="inline" />
              </motion.span>
            </MotionLink>
          </motion.div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h2 className="text-xl sm:text-2xl font-bold text-card-foreground text-center mb-10">
            What would you like to do next?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/student/dashboard"
              className="group flex flex-col items-center rounded-xl border-2 border-border bg-muted/40 p-6 sm:p-8 text-center transition hover:border-primary/50 hover:shadow-lg"
            >
              <div className="rounded-full bg-primary/10 p-4 text-primary group-hover:bg-primary/20 transition-colors">
                <BookOpen size={28} />
              </div>
              <h3 className="mt-4 font-semibold text-card-foreground">My Learning</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                View enrolled courses, progress and certificates.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Open <ArrowRight size={14} />
              </span>
            </Link>

            <Link
              href="/student/cours"
              className="group flex flex-col items-center rounded-xl border-2 border-border bg-muted/40 p-6 sm:p-8 text-center transition hover:border-primary/50 hover:shadow-lg"
            >
              <div className="rounded-full bg-primary/10 p-4 text-primary group-hover:bg-primary/20 transition-colors">
                <BookOpen size={28} />
              </div>
              <h3 className="mt-4 font-semibold text-card-foreground">Courses</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Discover new content and expand your skills.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Browse <ArrowRight size={14} />
              </span>
            </Link>

            <Link
              href="/student/blogs"
              className="group flex flex-col items-center rounded-xl border-2 border-border bg-muted/40 p-6 sm:p-8 text-center transition hover:border-primary/50 hover:shadow-lg"
            >
              <div className="rounded-full bg-primary/10 p-4 text-primary group-hover:bg-primary/20 transition-colors">
                <FileText size={28} />
              </div>
              <h3 className="mt-4 font-semibold text-card-foreground">Blog</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Read articles, tips and platform updates.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Read <ArrowRight size={14} />
              </span>
            </Link>

            <Link
              href="/student/studentlist"
              className="group flex flex-col items-center rounded-xl border-2 border-border bg-muted/40 p-6 sm:p-8 text-center transition hover:border-primary/50 hover:shadow-lg"
            >
              <div className="rounded-full bg-primary/10 p-4 text-primary group-hover:bg-primary/20 transition-colors">
                <Users size={28} />
              </div>
              <h3 className="mt-4 font-semibold text-card-foreground">Students</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                See other learners enrolled on the platform.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                View <ArrowRight size={14} />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
