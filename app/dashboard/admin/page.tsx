"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiJson } from "@/lib/api";
import {
  Users,
  BookOpen,
  GraduationCap,
  Award,
  Activity,
  UserCheck,
  UserX,
  Megaphone,
} from "lucide-react";
import { EnrollmentBarChart } from "@/components/enrollment-bar-chart";

type RoleMetrics = {
  totalInstructors?: number;
  instructorActive?: number;
  instructorInactive?: number;
  totalStudents?: number;
};

type AdminStats = {
  users?: { totalUsers?: number; activeUsers?: number; suspendedUsers?: number };
  roleMetrics?: RoleMetrics;
  courses?: { totalCourses?: number; publishedCourses?: number; draftCourses?: number };
  enrollments?: { totalEnrollments?: number; activeEnrollments?: number; completedEnrollments?: number };
  certificates?: { totalCertificates?: number; certificatesThisMonth?: number };
  sessions?: { activeSessions?: number; revokedSessions?: number };
  topCourses?: { courseTitle: string; enrollmentCount: number }[];
};

function StatLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`block rounded-lg border border-border bg-card p-4 shadow-sm transition hover:border-primary/40 hover:shadow-md ${className}`}
    >
      {children}
    </Link>
  );
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<{ data?: AdminStats } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiJson<{ message: string; data: AdminStats }>("dashboard/admin")
      .then((res) => setData(res))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const statsPreview = data?.data ?? {};
  const topCoursesPreview = statsPreview.topCourses ?? [];
  const topCoursesChartItems = useMemo(
    () =>
      [...topCoursesPreview]
        .sort((a, b) => (b.enrollmentCount ?? 0) - (a.enrollmentCount ?? 0))
        .map((c) => ({ title: c.courseTitle, count: c.enrollmentCount ?? 0 })),
    [topCoursesPreview],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        {error}
      </div>
    );
  }

  const stats = data?.data ?? {};
  const rm = stats.roleMetrics ?? {};
  const users = stats.users ?? {};
  const courses = stats.courses ?? {};
  const enrollments = stats.enrollments ?? {};
  const certificates = stats.certificates ?? {};
  const sessions = stats.sessions ?? {};
  const topCourses = stats.topCourses ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-card-foreground">Admin dashboard</h1>
        <Link
          href="/dashboard/admin/institution-updates"
          className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          <Megaphone className="h-4 w-4" />
          Institution updates
        </Link>
      </div>

      <p className="text-sm text-muted-foreground">
        Click a card to open the full list or section. Course catalog (view / manage) is under{" "}
        <Link href="/dashboard/courses" className="text-primary font-medium hover:underline">
          All courses
        </Link>
        .
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatLink href="/dashboard/admin/instructors">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users size={20} />
            <span className="text-sm font-medium">Total instructors</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-card-foreground">{rm.totalInstructors ?? 0}</p>
          <p className="mt-1 text-xs text-primary">Open instructor list →</p>
        </StatLink>

        <StatLink href="/dashboard/admin/students">
          <div className="flex items-center gap-2 text-muted-foreground">
            <GraduationCap size={20} />
            <span className="text-sm font-medium">Total students</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-card-foreground">{rm.totalStudents ?? 0}</p>
          <p className="mt-1 text-xs text-primary">Open student list →</p>
        </StatLink>

        <StatLink href="/dashboard/admin/instructors?filter=active">
          <div className="flex items-center gap-2 text-muted-foreground">
            <UserCheck size={20} />
            <span className="text-sm font-medium">Instructors active</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
            {rm.instructorActive ?? 0}
          </p>
          <p className="text-xs text-muted-foreground">Approved + active account</p>
        </StatLink>

        <StatLink href="/dashboard/admin/instructors?filter=inactive">
          <div className="flex items-center gap-2 text-muted-foreground">
            <UserX size={20} />
            <span className="text-sm font-medium">Instructors inactive</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-amber-700 dark:text-amber-400">
            {rm.instructorInactive ?? 0}
          </p>
          <p className="text-xs text-muted-foreground">Pending approval or not active</p>
        </StatLink>

        <StatLink href="/dashboard/courses">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen size={20} />
            <span className="text-sm font-medium">Total courses</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-card-foreground">{courses.totalCourses ?? 0}</p>
          <p className="text-xs text-muted-foreground">
            Published: {courses.publishedCourses ?? 0} · Draft: {courses.draftCourses ?? 0}
          </p>
        </StatLink>

        <StatLink href="/dashboard/admin/certificates">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Award size={20} />
            <span className="text-sm font-medium">Certificates issued</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-card-foreground">
            {certificates.totalCertificates ?? 0}
          </p>
          <p className="text-xs text-muted-foreground">This month: {certificates.certificatesThisMonth ?? 0}</p>
        </StatLink>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users size={20} />
            <span className="text-sm font-medium">All user accounts</span>
          </div>
          <p className="mt-2 text-lg font-semibold text-card-foreground">{users.totalUsers ?? 0}</p>
          <p className="text-xs text-muted-foreground">
            Active: {users.activeUsers ?? 0} · Suspended: {users.suspendedUsers ?? 0}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Activity size={20} />
            <span className="text-sm font-medium">Sessions</span>
          </div>
          <p className="mt-2 text-lg font-semibold text-card-foreground">Active: {sessions.activeSessions ?? 0}</p>
          <p className="text-xs text-muted-foreground">Revoked: {sessions.revokedSessions ?? 0}</p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <GraduationCap size={20} />
          <span className="text-sm font-medium">Enrollments</span>
        </div>
        <p className="mt-2 text-lg font-semibold text-card-foreground">{enrollments.totalEnrollments ?? 0}</p>
        <p className="text-xs text-muted-foreground">
          Active: {enrollments.activeEnrollments ?? 0} · Completed: {enrollments.completedEnrollments ?? 0}
        </p>
      </div>

      {topCourses.length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-card-foreground">Top courses by enrollment</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Visual overview and full list</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 shadow-sm sm:p-4">
            <EnrollmentBarChart items={topCoursesChartItems} valueLabel="Enrollments" className="aspect-auto h-[min(400px,55vh)] w-full" />
          </div>
          <ul className="space-y-2 rounded-lg border border-border bg-card p-4">
            {topCourses.map((c, i) => (
              <li key={i} className="flex justify-between gap-3 text-sm">
                <span className="min-w-0 text-foreground">{c.courseTitle}</span>
                <span className="shrink-0 tabular-nums text-muted-foreground">{c.enrollmentCount} enrollments</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
