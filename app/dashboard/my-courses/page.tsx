"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/lib/auth-store";
import { studentMyCourses, studentCancelEnrollment, type MyCoursesResponse, type EnrollmentItem } from "@/lib/student-api";
import { instructorListMyTeachingCourses, type CourseItem } from "@/lib/instructor-api";
import {
  BookOpen,
  ArrowRight,
  PlayCircle,
  XCircle,
  Users,
  ListVideo,
  Pencil,
  ExternalLink,
  PlusCircle,
} from "lucide-react";

function courseId(e: EnrollmentItem): string | undefined {
  return e.courseId ?? (e.course && typeof e.course === "object" ? e.course._id : undefined);
}
function courseTitle(e: EnrollmentItem): string {
  return e.courseTitle ?? (e.course && typeof e.course === "object" ? e.course.title ?? "" : "") ?? "Course";
}

function StudentMyCoursesView() {
  const [res, setRes] = useState<MyCoursesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const load = () => {
    studentMyCourses()
      .then(setRes)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    load();
  }, []);

  const handleCancel = async (cid: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cancelling || !confirm("Cancel enrollment in this course?")) return;
    setCancelling(cid);
    try {
      await studentCancelEnrollment(cid);
      setRes((r) => ({ ...r!, data: (r?.data ?? []).filter((e) => courseId(e) !== cid) }));
    } catch {
      load();
    } finally {
      setCancelling(null);
    }
  };

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

  const list = res?.data ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-card-foreground">My Courses</h1>

      {list.length === 0 ? (
        <div className="rounded-lg border border-border bg-muted/50 p-6 text-center">
          <p className="text-muted-foreground">You are not enrolled in any course yet.</p>
          <Link
            href="/dashboard/courses"
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Browse courses <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((e) => {
            const cid = courseId(e);
            return (
              <li key={e._id ?? cid} className="rounded-lg border border-border bg-card p-4 shadow-sm">
                <Link href={cid ? `/dashboard/courses/${cid}` : "#"} className="block">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-medium text-card-foreground">{courseTitle(e)}</h2>
                      <p className="mt-1 text-xs text-muted-foreground">{e.status ?? "—"}</p>
                      {e.enrolledAt && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Enrolled: {new Date(e.enrolledAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
                <div className="mt-3 flex flex-wrap gap-2">
                  {cid && (
                    <>
                      <Link
                        href={`/dashboard/courses/${cid}/learn`}
                        className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
                      >
                        <PlayCircle size={14} /> Learn
                      </Link>
                      <button
                        type="button"
                        onClick={(ev) => handleCancel(cid, ev)}
                        disabled={cancelling === cid}
                        className="inline-flex items-center gap-1 rounded-md border border-destructive/50 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10 disabled:opacity-50"
                      >
                        <XCircle size={14} /> Cancel
                      </button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function InstructorTeachingView() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    instructorListMyTeachingCourses({ limit: 50 })
      .then((r) => setCourses(r.data ?? []))
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-card-foreground">Courses I teach</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Drafts and published courses where you are an instructor.
          </p>
        </div>
        <Link
          href="/dashboard/courses/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 shrink-0"
        >
          <PlusCircle size={18} /> New course
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
            <BookOpen className="h-7 w-7" />
          </div>
          <p className="text-muted-foreground max-w-md mx-auto">
            You have not created any courses yet. Start with a title and description — you can add lessons and publish when ready.
          </p>
          <Link
            href="/dashboard/courses/new"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <PlusCircle size={18} /> Create your first course
          </Link>
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((c) => (
            <li
              key={c._id}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="relative aspect-[16/9] bg-muted">
                {c.thumbnailUrl ? (
                  <Image
                    src={c.thumbnailUrl}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/15 to-muted">
                    <BookOpen className="h-12 w-12 text-primary/40" />
                  </div>
                )}
                <span
                  className={
                    c.published
                      ? "absolute right-2 top-2 rounded-full bg-emerald-600/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white"
                      : "absolute right-2 top-2 rounded-full bg-amber-500/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white"
                  }
                >
                  {c.published ? "Live" : "Draft"}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h2 className="font-semibold text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {c.title}
                </h2>
                {c.shortDescription && (
                  <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{c.shortDescription}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <ListVideo size={14} className="text-primary" />
                    {c.lessonCount ?? 0} lessons
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users size={14} className="text-primary" />
                    {c.enrollmentCount ?? 0} students
                  </span>
                  {c.level && <span className="capitalize">{c.level}</span>}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/dashboard/courses/${c._id}/edit`}
                    className="inline-flex flex-1 min-w-[7rem] items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
                  >
                    <Pencil size={14} /> Edit
                  </Link>
                  <Link
                    href={`/dashboard/courses/${c._id}`}
                    className="inline-flex flex-1 min-w-[7rem] items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-card-foreground hover:bg-muted"
                  >
                    <ExternalLink size={14} /> View
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function MyCoursesPage() {
  const primaryRole = useAuthStore((s) => s.primaryRole()) ?? "student";

  if (primaryRole === "instructor" || primaryRole === "admin") {
    return <InstructorTeachingView />;
  }

  return <StudentMyCoursesView />;
}
