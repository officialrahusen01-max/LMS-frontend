"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiFetch, apiJson } from "@/lib/api";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Circle,
  Loader2,
  Lock,
} from "lucide-react";

function enrollmentHasCourse(enrollments, courseId) {
  const id = String(courseId);
  return (enrollments || []).some((e) => {
    if (e?.status === "cancelled") return false;
    const cid =
      e?.course?._id != null
        ? String(e.course._id)
        : e?.course != null
          ? String(e.course)
          : e?.courseId?._id != null
            ? String(e.courseId._id)
            : e?.courseId != null
              ? String(e.courseId)
              : null;
    return cid === id;
  });
}

function isLessonDone(progress, lessonId) {
  const sid = String(lessonId);
  const rows = progress?.lessons || [];
  return rows.some((l) => {
    if (!l?.completed) return false;
    const lid = l.lesson?._id != null ? String(l.lesson._id) : l.lesson != null ? String(l.lesson) : null;
    return lid === sid;
  });
}

export default function CourseLearnPage() {
  const params = useParams();
  const courseId = params?.courseId ? String(params.courseId) : "";

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [actionError, setActionError] = useState(null);

  const load = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    setError(null);
    try {
      const [courseRes, lessonsRes, enrRes] = await Promise.all([
        apiJson(`courses/${courseId}`),
        apiJson(`courses/${courseId}/lessons`),
        apiJson("enrollments/me").catch(() => ({ data: [] })),
      ]);

      const c = courseRes?.data;
      const rawLessons = Array.isArray(lessonsRes?.data) ? lessonsRes.data : [];
      const list = [...rawLessons].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const enrList = Array.isArray(enrRes?.data) ? enrRes.data : [];

      if (!c) throw new Error("Course not found");

      setCourse(c);
      setLessons(list);

      const isEnrolled = enrollmentHasCourse(enrList, courseId);
      setEnrolled(isEnrolled);

      if (isEnrolled) {
        try {
          const progRes = await apiJson(`enrollments/courses/${courseId}/progress`);
          setProgress(progRes?.data ?? null);
        } catch {
          setProgress(null);
        }
      } else {
        setProgress(null);
      }
    } catch (e) {
      setError(e?.message || "Failed to load course");
      setCourse(null);
      setLessons([]);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (lessons.length === 0) {
      setSelectedId(null);
      return;
    }
    setSelectedId((prev) => {
      if (prev && lessons.some((l) => String(l._id) === String(prev))) return prev;
      return String(lessons[0]._id);
    });
  }, [lessons]);

  const selectedLesson = useMemo(
    () => lessons.find((l) => String(l._id) === String(selectedId)) || null,
    [lessons, selectedId],
  );

  const percent = progress?.percentComplete ?? 0;
  const firstVideo = selectedLesson?.media?.find((m) => m.type === "video");

  const markComplete = async () => {
    if (!selectedLesson?._id || !enrolled || completing) return;
    setActionError(null);
    setCompleting(true);
    try {
      const res = await apiFetch(
        `enrollments/courses/${courseId}/lessons/${selectedLesson._id}/complete`,
        { method: "PUT", body: JSON.stringify({}) },
      );
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.message || "Could not update progress");
      setProgress(body?.data ?? progress);
      await load();
    } catch (e) {
      setActionError(e?.message || "Could not mark lesson complete");
    } finally {
      setCompleting(false);
    }
  };

  if (!courseId) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-muted-foreground">
        Invalid course.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading course…</p>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-6 text-destructive">
          {error}
        </div>
        <Link
          href="/student/cours"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to courses
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-5">
          <div className="min-w-0">
            <Link
              href="/student/dashboard"
              className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> My learning
            </Link>
            <h1 className="truncate text-xl font-bold text-card-foreground sm:text-2xl">
              {course?.title ?? "Course"}
            </h1>
            {course?.shortDescription && (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{course.shortDescription}</p>
            )}
          </div>
          {enrolled && (
            <div className="w-full shrink-0 sm:max-w-xs">
              <div className="flex justify-between text-xs font-medium text-muted-foreground">
                <span>Progress</span>
                <span>{percent}%</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${Math.min(100, percent)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,280px)_1fr]">
        <aside className="h-fit rounded-xl border border-border bg-card shadow-sm lg:sticky lg:top-24">
          <div className="border-b border-border px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Lessons ({lessons.length})
            </p>
          </div>
          <nav className="max-h-[min(60vh,520px)] overflow-y-auto p-2">
            {lessons.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">No lessons yet.</p>
            ) : (
              <ul className="space-y-0.5">
                {lessons.map((les, idx) => {
                  const active = String(les._id) === String(selectedId);
                  const done = enrolled && isLessonDone(progress, les._id);
                  return (
                    <li key={les._id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(String(les._id))}
                        className={`flex w-full items-start gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                          active
                            ? "bg-primary/10 font-semibold text-primary"
                            : "text-card-foreground hover:bg-muted/80"
                        }`}
                      >
                        <span className="mt-0.5 shrink-0">
                          {done ? (
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground" />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="text-muted-foreground">{idx + 1}. </span>
                          {les.title}
                        </span>
                        {active && <ChevronRight className="h-4 w-4 shrink-0 opacity-50" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </nav>
        </aside>

        <main className="min-w-0 rounded-xl border border-border bg-card shadow-sm">
          {!enrolled && (
            <div className="flex flex-col items-center justify-center gap-4 border-b border-border bg-muted/30 px-6 py-10 text-center">
              <Lock className="h-10 w-10 text-muted-foreground" />
              <div>
                <p className="font-semibold text-card-foreground">Enroll to access lessons</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Join this course to track progress and mark lessons complete.
                </p>
              </div>
              <Link
                href="/student/cours"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                <BookOpen className="h-4 w-4" />
                Browse &amp; enroll
              </Link>
            </div>
          )}

          {selectedLesson ? (
            <div className="p-4 sm:p-6">
              <h2 className="text-lg font-bold text-card-foreground sm:text-xl">{selectedLesson.title}</h2>
              {selectedLesson.duration > 0 && (
                <p className="mt-1 text-xs text-muted-foreground">~{selectedLesson.duration} min</p>
              )}

              {firstVideo?.url && (
                <div className="mt-4 overflow-hidden rounded-lg border border-border bg-black shadow-inner">
                  <video
                    key={firstVideo.url}
                    src={firstVideo.url}
                    controls
                    className="aspect-video w-full"
                    playsInline
                  >
                    <track kind="captions" />
                  </video>
                </div>
              )}

              {selectedLesson.content ? (
                <div
                  className="prose-custom mt-6 max-w-none text-sm leading-relaxed text-card-foreground [&_a]:text-primary [&_img]:max-w-full [&_p]:mb-3 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5"
                  dangerouslySetInnerHTML={{ __html: selectedLesson.content }}
                />
              ) : (
                !firstVideo?.url && (
                  <p className="mt-6 text-sm text-muted-foreground">No content for this lesson yet.</p>
                )
              )}

              {enrolled && (
                <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-6">
                  {actionError && (
                    <p className="w-full text-sm text-destructive">{actionError}</p>
                  )}
                  <button
                    type="button"
                    disabled={completing || isLessonDone(progress, selectedLesson._id)}
                    onClick={markComplete}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {completing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    {isLessonDone(progress, selectedLesson._id) ? "Completed" : "Mark as complete"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 px-6 py-20 text-muted-foreground">
              <BookOpen className="h-12 w-12 opacity-40" />
              <p>Select a lesson to start.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
