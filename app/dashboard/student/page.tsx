"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { studentMyCourses, studentGetAllProgress, studentMyCertificates } from "@/lib/student-api";
import { BookOpen, Award, TrendingUp } from "lucide-react";

export default function StudentDashboardPage() {
  const [enrollments, setEnrollments] = useState<{ courseTitle?: string; course?: { title?: string }; status?: string; enrolledAt?: string }[]>([]);
  const [progress, setProgress] = useState<{ course?: { title?: string }; percentComplete?: number }[]>([]);
  const [certificates, setCertificates] = useState<{ courseTitle?: string; course?: { title?: string }; issuedAt?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      studentMyCourses().then((r) => r.data ?? []),
      studentGetAllProgress().then((r) => r.data ?? []),
      studentMyCertificates().then((r) => r.data ?? []),
    ])
      .then(([enr, prog, cert]) => {
        setEnrollments(enr);
        setProgress(prog);
        setCertificates(cert);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

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

  const enrollTitle = (e: { courseTitle?: string; course?: { title?: string } }) =>
    e.courseTitle ?? e.course?.title ?? "—";

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-card-foreground">Student Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen size={20} />
            <span className="text-sm font-medium">Enrolled</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-card-foreground">{enrollments.length}</p>
          <p className="text-xs text-muted-foreground">courses</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp size={20} />
            <span className="text-sm font-medium">In progress</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-card-foreground">{progress.length}</p>
          <p className="text-xs text-muted-foreground">courses</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Award size={20} />
            <span className="text-sm font-medium">Certificates</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-card-foreground">{certificates.length}</p>
          <p className="text-xs text-muted-foreground">earned</p>
        </div>
      </div>

      {enrollments.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-card-foreground">My Enrollments</h2>
          <ul className="space-y-2 rounded-lg border border-border bg-card p-4">
            {enrollments.slice(0, 5).map((e, i) => (
              <li key={i} className="flex justify-between text-sm">
                <span className="text-foreground">{enrollTitle(e)}</span>
                <span className="text-muted-foreground">{e.status ?? "—"}</span>
              </li>
            ))}
          </ul>
          <Link href="/dashboard/my-courses" className="mt-2 inline-block text-sm text-primary hover:underline">
            View all my courses →
          </Link>
        </section>
      )}

      {enrollments.length === 0 && (
        <p className="rounded-lg border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
          Enroll in courses from <Link href="/dashboard/courses" className="text-primary hover:underline">Browse Courses</Link> to see your progress here.
        </p>
      )}
    </div>
  );
}
