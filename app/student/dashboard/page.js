"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiJson } from "@/lib/api";
import {
  BookOpen,
  PlayCircle,
  Calendar,
  ArrowRight,
  Clock,
  Flame,
} from "lucide-react";
import InstitutionNotices from "@/components/institution-notices";

/** Demo rows when API returns no recommendations — keeps layout like reference. */
const DEMO_RECOMMENDED = [
  {
    _id: "demo-1",
    title: "How to Learn Online",
    provider: "AiNextro LMS",
    shortDescription:
      "Build effective study habits and get the most from online courses with practical strategies from educators.",
    weeks: 1,
    level: "Introductory",
    hoursPerWeek: "4",
    tags: ["Research", "Study skills"],
    contentType: "course",
    coverImage: "/images/banner2.png",
  },
  {
    _id: "demo-2",
    title: "MicroMasters® Program in Finance",
    provider: "AiNextro LMS",
    shortDescription:
      "A graduate-level series of courses for career advancement in finance, risk, and investment analysis.",
    weeks: 70,
    level: "Number of courses",
    hoursPerWeek: "6",
    tags: ["Finance", "Career"],
    contentType: "program",
    coverImage: "/images/studentBanner.png",
  },
  {
    _id: "demo-3",
    title: "Leadership Essentials",
    provider: "AiNextro LMS",
    shortDescription:
      "Strengthen communication, team alignment, and decision-making with frameworks used by top organizations.",
    weeks: 6,
    level: "Introductory",
    hoursPerWeek: "3",
    tags: ["Leadership", "Management"],
    contentType: "course",
    coverImage: "/images/banner2.png",
  },
  {
    _id: "demo-4",
    title: "Data Science Professional Certificate",
    provider: "AiNextro LMS",
    shortDescription:
      "From Python and statistics to machine learning — a structured path toward analytics-ready skills.",
    weeks: 32,
    level: "Intermediate",
    hoursPerWeek: "5",
    tags: ["Data", "AI"],
    contentType: "program",
    coverImage: "/images/studentBanner.png",
  },
];

function normalizeRecommended(c) {
  const cats = c.categories;
  let tags = [];
  if (Array.isArray(cats)) {
    tags = cats
      .slice(0, 4)
      .map((x) => (typeof x === "string" ? x : x?.name))
      .filter(Boolean);
  }
  const contentType =
    c.contentType ||
    c.programType ||
    (c.type === "program" ? "program" : "course");

  return {
    id: String(c._id ?? c.id),
    title: c.title ?? "Course",
    provider: c.provider ?? c.org ?? "AiNextro LMS",
    shortDescription:
      c.shortDescription ||
      c.description ||
      "Discover content picked to match your learning goals on the platform.",
    weeks: c.durationWeeks ?? c.weeks ?? "—",
    level: c.level ?? "Introductory",
    hoursPerWeek:
      c.hoursPerWeek != null ? String(c.hoursPerWeek) : c.weeklyHours ?? "4",
    tags: tags.length ? tags : ["Featured", "Popular"],
    contentType: contentType === "program" ? "program" : "course",
    image: c.coverImage || c.thumbnail || c.courseImage || null,
  };
}

function RecommendedCard({ item }) {
  const exploreHref = "/student/cours";
  const isProgram = item.contentType === "program";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:shadow-md">
      <div className="flex gap-3 border-b border-border/80 bg-card p-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted ring-1 ring-border">
          {item.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.image} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <BookOpen className="h-7 w-7" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-card-foreground">
            {item.title}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{item.provider}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {item.shortDescription}
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-muted/80 px-2 py-2 text-center dark:bg-muted/50">
            <p className="text-[11px] font-semibold tabular-nums text-foreground">
              {item.weeks}
              {typeof item.weeks === "number" ? ` week${item.weeks === 1 ? "" : "s"}` : ""}
            </p>
          </div>
          <div className="rounded-lg bg-muted/80 px-2 py-2 text-center dark:bg-muted/50">
            <p className="line-clamp-2 text-[10px] font-semibold leading-tight text-foreground">
              {item.level}
            </p>
          </div>
          <div className="rounded-lg bg-muted/80 px-2 py-2 text-center dark:bg-muted/50">
            <p className="text-[11px] font-semibold text-foreground">{item.hoursPerWeek} hours</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {item.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-full bg-foreground/90 px-2.5 py-0.5 text-[10px] font-medium text-background dark:bg-foreground dark:text-background"
              >
                {t}
              </span>
            ))}
          </div>
          <Link
            href={exploreHref}
            className="shrink-0 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            {isProgram ? "Explore program" : "Explore course"}
          </Link>
        </div>
      </div>
    </article>
  );
}

function RecommendedForYouSection({ recommendedCourses, loading, error }) {
  const [filter, setFilter] = useState("all");

  const items = useMemo(() => {
    const raw =
      recommendedCourses && recommendedCourses.length > 0
        ? recommendedCourses.map(normalizeRecommended)
        : DEMO_RECOMMENDED.map(normalizeRecommended);

    if (filter === "all") return raw;
    if (filter === "courses") return raw.filter((x) => x.contentType !== "program");
    return raw.filter((x) => x.contentType === "program");
  }, [recommendedCourses, filter]);

  const filters = [
    { id: "all", label: "All" },
    { id: "courses", label: "Courses" },
    { id: "programs", label: "Programs" },
  ];

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6 lg:p-8">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-card-foreground sm:text-2xl">
            <Flame className="h-6 w-6 shrink-0 text-primary" strokeWidth={2} />
            Recommended For You
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Based on your interests, we think you&apos;ll like these.
          </p>
        </div>
      </div>

      <div className="mt-5 inline-flex rounded-xl border border-border bg-muted/50 p-1 dark:bg-muted/30">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${filter === f.id
                ? "bg-card text-foreground shadow-sm ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-14">
          <span className="h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : error ? (
        <p className="mt-6 rounded-lg border border-border bg-muted/40 py-8 text-center text-sm text-muted-foreground">
          Couldn&apos;t load recommendations.{" "}
          <Link href="/student/cours" className="font-medium text-primary underline">
            Browse courses
          </Link>
        </p>
      ) : items.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
          No items in this category. Try <strong>All</strong> or{" "}
          <Link href="/student/cours" className="font-medium text-primary underline">
            browse catalog
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-6 grid gap-5 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.id}>
              <RecommendedCard item={item} />
            </li>
          ))}
        </ul>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground sm:text-left">
        <Link
          href="/student/cours"
          className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
        >
          Browse all courses <ArrowRight className="h-4 w-4" />
        </Link>
      </p>
    </section>
  );
}

/** edX-style hero CTAs at top of My Learning (dashboard). */
function MyLearningHeroCards() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-6 rounded-2xl bg-primary px-6 py-8 text-primary-foreground shadow-md ring-1 ring-primary/10 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-8 lg:px-10">
        <div className="min-w-0 max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Jump back into your learning
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-primary-foreground/90 sm:text-base">
            Pick up right where you left off or start learning something new.
          </p>
        </div>
        <Link
          href="/student/dashboard#my-courses"
          className="inline-flex w-full shrink-0 items-center justify-center rounded-full border-2 border-primary-foreground/30 bg-primary-foreground px-7 py-3.5 text-center text-sm font-bold text-primary shadow-sm transition hover:bg-primary-foreground/95 sm:w-auto"
        >
          Go to your dashboard
        </Link>
      </div>

      <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card px-6 py-8 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-8 lg:px-10">
        <div className="min-w-0 max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground sm:text-3xl">
            Want to explore more learning opportunities?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Search our vast library of courses, programs, and degrees to find what works best for you.
          </p>
        </div>
        <Link
          href="/student/cours"
          className="inline-flex w-full shrink-0 items-center justify-center rounded-full bg-primary px-7 py-3.5 text-center text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90 sm:w-auto"
        >
          Search learning options
        </Link>
      </div>
    </div>
  );
}

/** In-progress courses (started but not 100%) — quick resume row */
function ContinueLearningStrip({ progressList, loading, error }) {
  const rows = useMemo(() => {
    const list = progressList || [];
    return list
      .filter((p) => {
        const pct = Number(p?.percentComplete) || 0;
        return pct > 0 && pct < 100;
      })
      .sort((a, b) => (Number(b?.percentComplete) || 0) - (Number(a?.percentComplete) || 0))
      .slice(0, 8)
      .map((p) => {
        const cid = p?.courseId?._id ?? p?.courseId;
        const title = p?.courseTitle ?? "Course";
        const pct = Number(p?.percentComplete) || 0;
        return { cid: cid ? String(cid) : null, title, pct };
      });
  }, [progressList]);

  if (loading || error || rows.length === 0) return null;

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-card-foreground">
        <PlayCircle className="h-5 w-5 text-primary" />
        Continue learning
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {rows.map((row) => (
          <Link
            key={row.cid || row.title}
            href={row.cid ? `/student/cours/${row.cid}/learn` : "/student/cours"}
            className="min-w-[200px] max-w-[240px] shrink-0 rounded-xl border border-border bg-muted/30 p-4 transition hover:border-primary/30 hover:bg-muted/50"
          >
            <p className="line-clamp-2 text-sm font-semibold text-foreground">{row.title}</p>
            <p className="mt-2 text-xs text-muted-foreground">{row.pct}% complete</p>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary">
              Resume <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

// Backend: GET /v1/dashboard/student → { data: { enrollments, progress, certificates, recommendedCourses, recentActivity } }
function StudentDashboard() {
  const [stats, setStats] = useState(null);
  const [smart, setSmart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([apiJson("dashboard/student"), apiJson("student/smart-learning/recommendations")])
      .then((results) => {
        if (cancelled) return;
        const statsRes = results[0]?.status === "fulfilled" ? results[0].value : null;
        const smartRes = results[1]?.status === "fulfilled" ? results[1].value : null;
        setStats(statsRes?.data ?? null);
        setSmart(smartRes?.data ?? null);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e?.message || "Failed to load");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const enrollments = stats?.enrollments ?? [];
  const recommendedCourses = stats?.recommendedCourses ?? [];
  const progressByCourse = (stats?.progress ?? []).reduce((acc, p) => {
    const cid = p?.courseId?._id ?? p?.courseId;
    if (cid) acc[String(cid)] = p;
    return acc;
  }, {});

  const isCancelled = (e) => e?.status === "cancelled";
  const activeCourses = enrollments.filter((e) => !isCancelled(e));
  const cancelledCourses = enrollments.filter(isCancelled);
  const smartNext = smart?.suggestedNext?.[0] || null;

  const courseImage = (c) =>
    c?.coverImage || c?.thumbnail || c?.courseImage || null;
  const courseTitle = (e) =>
    e?.courseTitle ?? e?.course?.title ?? e?.title ?? "Course";
  const courseId = (e) => e?.courseId?._id ?? e?.courseId ?? e?.course?._id ?? e?._id;
  const courseDate = (c) => {
    const d = c?.enrolledAt || c?.updatedAt || c?.createdAt;
    return d
      ? new Date(d).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      : "—";
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-card-foreground sm:text-3xl">
            My learning
          </h1>
        </header>

        <InstitutionNotices />

        <MyLearningHeroCards />

        <ContinueLearningStrip
          progressList={stats?.progress}
          loading={loading}
          error={error}
        />

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6 lg:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-card-foreground sm:text-2xl">
                AI study coach
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Personalized next steps based on your progress.
              </p>
            </div>
            <Link
              href="/student/help"
              className="shrink-0 rounded-full border border-border bg-muted/40 px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-muted/60"
            >
              Ask a question
            </Link>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Next best lesson
              </p>
              {loading ? (
                <p className="mt-2 text-sm text-muted-foreground">Loading…</p>
              ) : smartNext?.nextLesson ? (
                <div className="mt-2">
                  <p className="text-sm font-semibold text-foreground">{smartNext.courseTitle || "Course"}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {smartNext.nextLesson.title || "Next lesson"}
                  </p>
                  <Link
                    href={`/student/cours/${smartNext.courseId}/learn`}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                  >
                    Resume <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  Enroll in a course to get a personalized lesson plan.
                </p>
              )}
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Weak topics
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Open a course and we’ll highlight lessons you started but haven’t finished.
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                Tip: Use <span className="font-semibold text-foreground">Continue learning</span> cards to resume fast.
              </p>
            </div>
          </div>
        </section>

        <RecommendedForYouSection
          recommendedCourses={recommendedCourses}
          loading={loading}
          error={error}
        />

        <section id="my-courses" className="scroll-mt-24">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-card-foreground">
            <BookOpen className="h-5 w-5 text-primary" />
            My Courses
          </h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : error ? (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
              {error}
            </div>
          ) : activeCourses.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-6 text-center">
              <p className="text-muted-foreground">You are not enrolled in any active course.</p>
              <Link
                href="/student/cours"
                className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Browse courses <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeCourses.map((e) => {
                const cid = courseId(e);
                const percent = progressByCourse[String(cid)]?.percentComplete ?? 0;
                return (
                  <li
                    key={e._id ?? cid}
                    className="overflow-hidden rounded-lg border border-border bg-card shadow-sm transition hover:shadow-md"
                  >
                    <Link
                      href={cid ? `/student/cours/${cid}/learn` : "/student/cours"}
                      className="block"
                    >
                      <div className="aspect-video w-full bg-muted">
                        {courseImage(e) ? (
                          <img
                            src={courseImage(e)}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-muted-foreground">
                            <BookOpen className="h-12 w-12" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-card-foreground line-clamp-2">
                          {courseTitle(e)}
                        </h3>
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar size={12} /> Enrolled: {courseDate(e)}
                        </p>
                        {percent > 0 && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {percent}% complete
                          </p>
                        )}
                      </div>
                    </Link>
                    {cid && (
                      <div className="border-t border-border px-4 py-2">
                        <Link
                          href={`/student/cours/${cid}/learn`}
                          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                        >
                          <PlayCircle size={14} /> Continue learning
                        </Link>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {!loading && !error && cancelledCourses.length > 0 && (
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-muted-foreground">
              <Clock className="h-5 w-5" />
              Cancelled enrollments
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cancelledCourses.map((e) => (
                <li
                  key={e._id ?? courseId(e)}
                  className="overflow-hidden rounded-lg border border-border bg-card opacity-80"
                >
                  <div className="aspect-video w-full bg-muted">
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <BookOpen className="h-12 w-12" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-card-foreground line-clamp-2">
                      {courseTitle(e)}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Enrolled: {courseDate(e)}
                    </p>
                    <span className="mt-2 inline-block rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      Cancelled
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
