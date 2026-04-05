"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiJson } from "@/lib/api";
import {
  BookOpen,
  Users,
  Award,
  FileText,
  PlusCircle,
  List,
  ArrowRight,
  Sparkles,
  TrendingUp,
  GraduationCap,
  BarChart3,
} from "lucide-react";
import InstitutionNotices from "@/components/institution-notices";
import { EnrollmentBarChart } from "@/components/enrollment-bar-chart";

type InstructorStats = {
  courses?: { _id: string; title: string; slug: string; published: boolean }[];
  enrollments?: { courses?: { courseTitle: string; enrollmentCount: number }[]; totalEnrollments?: number };
  certificates?: { totalCertificates?: number; certificatesThisMonth?: number };
  blog?: { totalBlogs?: number; publishedBlogs?: number };
};

export default function InstructorDashboardPage() {
  const [data, setData] = useState<{ data?: InstructorStats } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiJson<{ message: string; data: InstructorStats }>("dashboard/instructor")
      .then((res) => setData(res))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.data ?? {};
  const courses = stats.courses ?? [];
  const enrollments = stats.enrollments ?? {};
  const totalEnrollments = enrollments.totalEnrollments ?? 0;
  const enrollmentByCourse = enrollments.courses ?? [];
  const certs = stats.certificates ?? {};
  const blog = stats.blog ?? {};

  const publishedCount = useMemo(() => courses.filter((c) => c.published).length, [courses]);
  const draftCount = courses.length - publishedCount;

  const enrollmentChartItems = useMemo(() => {
    return [...enrollmentByCourse]
      .sort((a, b) => (b.enrollmentCount ?? 0) - (a.enrollmentCount ?? 0))
      .map((row) => ({
        title: row.courseTitle,
        count: row.enrollmentCount ?? 0,
      }));
  }, [enrollmentByCourse]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <span className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-5 text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="relative isolate space-y-8 pb-4">
      {/* Soft backdrop — highlights this page without tinting the whole app chrome */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,hsl(var(--primary)/0.12),transparent_50%),radial-gradient(ellipse_80%_50%_at_100%_20%,hsl(var(--primary)/0.06),transparent_45%)] dark:bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,hsl(var(--primary)/0.18),transparent_50%),radial-gradient(ellipse_80%_50%_at_100%_20%,hsl(var(--primary)/0.1),transparent_45%)]"
      />

      {/* Hero — premium spotlight */}
      <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.14] via-card to-card p-8 shadow-[0_24px_80px_-24px_hsl(var(--primary)/0.35)] ring-1 ring-primary/10 sm:p-10 dark:from-primary/20 dark:shadow-[0_28px_90px_-28px_hsl(var(--primary)/0.45)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.2]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(128,128,128,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,0.06) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="pointer-events-none absolute right-1/4 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-amber-400/10 blur-2xl dark:bg-amber-400/15" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-5">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-xl shadow-primary/40 ring-4 ring-primary/15">
              <GraduationCap className="h-8 w-8" />
            </div>
            <div>
              <p className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary backdrop-blur-sm dark:bg-primary/15">
                <Sparkles className="h-3.5 w-3.5" /> Instructor hub
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-card-foreground sm:text-4xl">
                Your teaching dashboard
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                Everything you teach — courses, learners, certificates, and content — highlighted in one premium workspace.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link
              href="/dashboard/courses/new"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/35 transition hover:shadow-xl hover:shadow-primary/40 hover:brightness-105 active:scale-[0.98]"
            >
              <PlusCircle size={18} /> New course
            </Link>
            <Link
              href="/dashboard/my-courses"
              className="inline-flex items-center gap-2 rounded-2xl border border-border/80 bg-background/60 px-5 py-3 text-sm font-semibold text-card-foreground shadow-sm backdrop-blur-md transition hover:border-primary/30 hover:bg-muted/50 hover:shadow-md"
            >
              <BookOpen size={18} /> My teaching
            </Link>
          </div>
        </div>
      </section>

      {/* KPI cards — elevated tiles */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Courses",
            value: courses.length,
            sub: `${publishedCount} live · ${draftCount} draft`,
            icon: BookOpen,
            bar: "from-sky-500 via-primary to-cyan-400",
            iconWrap: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
          },
          {
            label: "Students",
            value: totalEnrollments,
            sub: "Active enrollments",
            subIcon: TrendingUp,
            icon: Users,
            bar: "from-emerald-500 via-teal-500 to-emerald-400",
            iconWrap: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
          },
          {
            label: "Certificates",
            value: certs.totalCertificates ?? 0,
            sub: `${certs.certificatesThisMonth ?? 0} this month`,
            icon: Award,
            bar: "from-amber-500 via-orange-400 to-amber-300",
            iconWrap: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
          },
          {
            label: "Blog",
            value: blog.publishedBlogs ?? 0,
            sub: `${blog.totalBlogs ?? 0} total posts`,
            icon: FileText,
            bar: "from-violet-500 via-purple-500 to-fuchsia-400",
            iconWrap: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card/90 p-6 shadow-md shadow-black/[0.04] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-black/[0.08] dark:bg-card/80 dark:shadow-black/20 dark:hover:shadow-primary/10"
          >
            <div
              className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-95 ${card.bar}`}
              aria-hidden
            />
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{card.label}</span>
              <div className={`rounded-xl p-2.5 ${card.iconWrap}`}>
                <card.icon size={20} strokeWidth={2} />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold tabular-nums tracking-tight text-card-foreground sm:text-4xl">{card.value}</p>
            <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              {"subIcon" in card && card.subIcon ? (
                <>
                  <card.subIcon size={12} className="text-emerald-500" /> {card.sub}
                </>
              ) : (
                card.sub
              )}
            </p>
          </div>
        ))}
      </div>

      <InstitutionNotices />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Enrollments by course */}
        <div className="lg:col-span-2 rounded-2xl border border-border/80 bg-card/90 p-6 shadow-lg shadow-black/[0.04] ring-1 ring-border/40 backdrop-blur-sm dark:bg-card/80 dark:shadow-black/25">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-card-foreground">Enrollments by course</h2>
                <p className="text-xs text-muted-foreground">Where your learners are concentrated</p>
              </div>
            </div>
            <Link
              href="/dashboard/my-courses"
              className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-primary transition hover:bg-primary/10 hover:underline"
            >
              Manage courses
            </Link>
          </div>
          {enrollmentByCourse.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-muted/30 py-10 text-center text-sm text-muted-foreground">
              No enrollment data yet. Publish a course and share it with learners.
            </p>
          ) : (
            <>
              <div className="mb-6 rounded-xl border border-border/50 bg-muted/20 p-2 sm:p-4">
                <EnrollmentBarChart items={enrollmentChartItems} valueLabel="Students" />
              </div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Breakdown</p>
            <ul className="max-h-[320px] space-y-2 overflow-y-auto pr-1">
              {enrollmentByCourse.slice(0, 12).map((row, i) => (
                <li
                  key={`${row.courseTitle}-${i}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-gradient-to-r from-muted/30 to-transparent px-4 py-3 text-sm transition hover:border-primary/20 hover:from-primary/5"
                >
                  <span className="min-w-0 truncate font-medium text-card-foreground">{row.courseTitle}</span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    {row.enrollmentCount}{" "}
                    <span className="hidden sm:inline">{row.enrollmentCount === 1 ? "student" : "students"}</span>
                  </span>
                </li>
              ))}
            </ul>
            </>
          )}
        </div>

        {/* Quick actions */}
        <div className="rounded-2xl border border-border/80 bg-gradient-to-b from-card to-card/95 p-6 shadow-lg shadow-black/[0.04] ring-1 ring-primary/10 backdrop-blur-sm dark:from-card dark:to-card/90 dark:shadow-black/25">
          <h2 className="mb-1 text-base font-semibold text-card-foreground">Quick actions</h2>
          <p className="mb-4 text-xs text-muted-foreground">Shortcuts to your workflow</p>
          <ul className="space-y-1.5">
            {[
              { href: "/dashboard/courses/new", label: "Create course", icon: PlusCircle },
              { href: "/dashboard/my-courses", label: "Edit my courses", icon: BookOpen },
              { href: "/dashboard/blogs/new", label: "Write blog post", icon: FileText },
              { href: "/dashboard/blogs/mine", label: "My blog posts", icon: List },
              { href: "/dashboard/courses", label: "Browse catalog", icon: ArrowRight },
              { href: "/student", label: "Preview student app", icon: Sparkles },
            ].map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-primary/15 hover:bg-primary/5 hover:text-card-foreground hover:shadow-sm"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon size={16} strokeWidth={2} />
                  </span>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Your courses strip */}
      <section className="rounded-2xl border border-border/80 bg-card/90 p-6 shadow-lg shadow-black/[0.04] ring-1 ring-border/40 backdrop-blur-sm dark:bg-card/80 dark:shadow-black/25">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-card-foreground">Your courses</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Recently touched — jump back to editing</p>
          </div>
          <Link
            href="/dashboard/courses/new"
            className="inline-flex w-fit items-center gap-1.5 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10"
          >
            <PlusCircle size={16} /> New course
          </Link>
        </div>
        {courses.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-muted/30 py-10 text-center text-sm text-muted-foreground">
            You have not created any courses yet.{" "}
            <Link href="/dashboard/courses/new" className="font-medium text-primary hover:underline">
              Create your first course
            </Link>
          </p>
        ) : (
          <ul className="divide-y divide-border/80 overflow-hidden rounded-xl border border-border/60 bg-muted/10">
            {courses.slice(0, 8).map((c) => (
              <li
                key={c._id}
                className="flex flex-col gap-2 px-4 py-3.5 transition hover:bg-primary/[0.04] sm:flex-row sm:items-center sm:justify-between"
              >
                <Link
                  href={`/dashboard/courses/${c._id}/edit`}
                  className="min-w-0 font-medium text-foreground hover:text-primary hover:underline"
                >
                  {c.title}
                </Link>
                <div className="flex shrink-0 items-center gap-3">
                  <span className={c.published ? "text-xs font-semibold text-emerald-600" : "text-xs font-medium text-amber-600"}>
                    {c.published ? "Published" : "Draft"}
                  </span>
                  <Link
                    href={`/dashboard/courses/${c._id}/edit`}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Edit →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
        {courses.length > 8 && (
          <Link href="/dashboard/my-courses" className="mt-3 inline-block text-sm text-primary hover:underline">
            View all {courses.length} courses →
          </Link>
        )}
      </section>
    </div>
  );
}
