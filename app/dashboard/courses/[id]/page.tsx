"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiJson } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { studentEnroll, studentGetEnrollment } from "@/lib/student-api";
import { instructorDeleteCourse } from "@/lib/instructor-api";
import {
  BookOpen,
  ArrowLeft,
  Pencil,
  Users,
  ListVideo,
  ExternalLink,
  Trash2,
  GraduationCap,
  Sparkles,
} from "lucide-react";

type PrimaryInstructor = string | { _id?: string };

type Course = {
  _id: string;
  title: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  level?: string;
  category?: string;
  published?: boolean;
  lessonCount?: number;
  primaryInstructor?: PrimaryInstructor;
  stats?: { studentsCount?: number };
  lessons?: { _id: string; title: string; order?: number }[];
};

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const user = useAuthStore((s) => s.user);
  const primaryRole = useAuthStore((s) => s.primaryRole());
  const [course, setCourse] = useState<{ success?: boolean; data?: Course } | null>(null);
  const [lessons, setLessons] = useState<{ _id: string; title: string; order?: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollMsg, setEnrollMsg] = useState<string | null>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isInstructor = primaryRole === "instructor" || primaryRole === "admin";
  const ownerId = (pi: PrimaryInstructor | undefined) => {
    if (pi == null) return "";
    if (typeof pi === "string") return pi;
    return pi._id ? String(pi._id) : "";
  };
  const isCourseOwner =
    isInstructor &&
    user?._id &&
    course?.data?.primaryInstructor &&
    ownerId(course.data.primaryInstructor) === String(user._id);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      apiJson<{ success?: boolean; data?: Course }>(`courses/${id}`),
      apiJson<{ success?: boolean; data?: { _id: string; title: string; order?: number }[] }>(`courses/${id}/lessons`).catch(() => ({ data: [] })),
      primaryRole === "student" ? studentGetEnrollment(id).then((r) => !!r?.data) : Promise.resolve(false),
    ])
      .then(([c, l, isEnrolled]) => {
        setCourse(c);
        setLessons(l?.data ?? []);
        setEnrolled(!!isEnrolled);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [id, primaryRole]);

  const handleEnroll = async () => {
    if (!id || primaryRole !== "student") return;
    setEnrolling(true);
    setEnrollMsg(null);
    try {
      await studentEnroll(id);
      setEnrollMsg("Enrolled successfully.");
      setEnrolled(true);
      router.push("/dashboard/my-courses");
    } catch (e) {
      setEnrollMsg(e instanceof Error ? e.message : "Enroll failed");
    } finally {
      setEnrolling(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!id || !isCourseOwner) return;
    if (!confirm("Delete this course permanently? Fails if students are enrolled.")) return;
    setDeleting(true);
    try {
      await instructorDeleteCourse(id);
      router.push("/dashboard/my-courses");
    } catch (e) {
      setEnrollMsg(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !course?.data) {
    return (
      <div className="space-y-4">
        <Link
          href="/dashboard/courses"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ArrowLeft size={16} /> Back to courses
        </Link>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          {error || "Course not found"}
        </div>
      </div>
    );
  }

  const c = course.data;
  const isStudent = primaryRole === "student";
  const lessonList = lessons.length ? lessons : c.lessons ?? [];
  const studentsCount = c.stats?.studentsCount ?? 0;
  const lessonCount = c.lessonCount ?? lessonList.length;

  return (
    <div className="space-y-6 max-w-4xl">
      <Link href="/dashboard/courses" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
        <ArrowLeft size={16} /> Back to courses
      </Link>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="rounded-2xl bg-primary/10 p-4 shrink-0">
            <BookOpen className="h-10 w-10 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-card-foreground">{c.title}</h1>
              {c.published ? (
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  Live
                </span>
              ) : (
                <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:text-amber-400">
                  Draft
                </span>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
              {c.level && <span className="capitalize">Level: {c.level}</span>}
              <span className="inline-flex items-center gap-1">
                <ListVideo size={14} className="text-primary" /> {lessonCount} lessons
              </span>
              {(isInstructor || studentsCount > 0) && (
                <span className="inline-flex items-center gap-1">
                  <Users size={14} className="text-primary" /> {studentsCount} students
                </span>
              )}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{c.shortDescription || "No description"}</p>
            {c.description ? (
              <p className="mt-2 text-sm text-card-foreground whitespace-pre-wrap">{c.description}</p>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-2">
              {isStudent && (
                <>
                  {enrolled ? (
                    <Link
                      href={`/dashboard/courses/${id}/learn`}
                      className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
                    >
                      Go to Learn
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={handleEnroll}
                      disabled={enrolling || !c.published}
                      title={!c.published ? "Course is not published yet" : undefined}
                      className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
                    >
                      {enrolling ? "Enrolling..." : "Enroll in course"}
                    </button>
                  )}
                  {enrolled && <span className="text-sm text-muted-foreground self-center">Already enrolled</span>}
                </>
              )}
              {isInstructor && (
                <>
                  <Link
                    href={`/dashboard/courses/${id}/edit`}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
                  >
                    <Pencil size={16} /> Edit course
                  </Link>
                  {c.published && (
                    <Link
                      href={`/student/cours/${id}/learn`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium hover:bg-muted"
                    >
                      <GraduationCap size={16} /> Student preview
                    </Link>
                  )}
                  <Link
                    href="/student/cours"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted"
                  >
                    <Sparkles size={16} /> Student catalog
                  </Link>
                  {isCourseOwner && (
                    <button
                      type="button"
                      onClick={handleDeleteCourse}
                      disabled={deleting}
                      className="inline-flex items-center gap-2 rounded-xl border border-destructive/40 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
                    >
                      <Trash2 size={16} /> {deleting ? "Deleting…" : "Delete course"}
                    </button>
                  )}
                </>
              )}
            </div>
            {enrollMsg && (
              <p
                className={`mt-3 text-sm ${
                  enrollMsg.startsWith("Enrolled") ? "text-emerald-600" : "text-destructive"
                }`}
              >
                {enrollMsg}
              </p>
            )}
          </div>
        </div>
      </div>

      {lessonList.length > 0 && (
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-3 text-xs font-semibold text-card-foreground uppercase tracking-wide">Curriculum</h2>
          <ol className="space-y-2">
            {lessonList.map((l, i) => (
              <li
                key={l._id}
                className="flex items-center gap-3 rounded-lg border border-border/80 bg-muted/20 px-3 py-2.5 text-sm"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <span className="text-foreground">{l.title}</span>
                {isInstructor && (
                  <Link
                    href={`/dashboard/courses/${id}/lessons/${l._id}`}
                    className="ml-auto text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <ExternalLink size={12} /> Edit
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
