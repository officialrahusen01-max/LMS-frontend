"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiJson } from "@/lib/api";
import { studentGetProgress, studentCompleteLesson, type ProgressData } from "@/lib/student-api";
import { ArrowLeft, BookOpen, CheckCircle } from "lucide-react";

type Lesson = {
  _id: string;
  title: string;
  content?: string;
  order?: number;
  duration?: number;
};

export default function CourseLearnPage() {
  const params = useParams();
  const id = params?.id as string;
  const [course, setCourse] = useState<{ title?: string } | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completing, setCompleting] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      apiJson<{ data: { title?: string } }>(`courses/${id}`).then((r) => r.data),
      apiJson<{ data: Lesson[] }>(`courses/${id}/lessons`).then((r) => r.data ?? []),
      studentGetProgress(id),
    ])
      .then(([c, l, p]) => {
        setCourse(c ?? null);
        setLessons(l ?? []);
        setProgress(p ?? null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [id]);

  const completedIds =
    progress?.completedLessons ??
    (progress?.lessons ?? [])
      .filter((l) => l.completed)
      .map((l) => (typeof l.lesson === "string" ? l.lesson : (l.lesson as { _id: string })._id));
  const completedSet = new Set(completedIds);
  const totalLessons = lessons.length;
  const completedCount = progress?.lessonsCompleted ?? completedIds.length;

  const handleComplete = async (lessonId: string) => {
    if (completing) return;
    setCompleting(lessonId);
    try {
      await studentCompleteLesson(id, lessonId, { secondsWatched: 0 });
      setProgress((prev) => ({
        ...prev,
        lessonsCompleted: (prev?.lessonsCompleted ?? completedCount) + 1,
        totalLessons,
        percentComplete: totalLessons ? (((prev?.lessonsCompleted ?? completedCount) + 1) / totalLessons) * 100 : 0,
        completedLessons: [...(prev?.completedLessons ?? []), lessonId],
      }));
    } catch {
      // ignore
    } finally {
      setCompleting(null);
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
      <div className="space-y-4">
        <Link href={`/dashboard/courses/${id}`} className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
          <ArrowLeft size={16} /> Back to course
        </Link>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href={`/dashboard/courses/${id}`} className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
        <ArrowLeft size={16} /> Back to course
      </Link>

      <div className="rounded-lg border border-border bg-card p-6">
        <h1 className="text-xl font-semibold text-card-foreground">{course?.title ?? "Course"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Progress: {completedCount} / {totalLessons} lessons ({progress?.percentComplete ?? 0}%)
        </p>
        <div className="mt-2 h-2 w-full rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progress?.percentComplete ?? 0}%` }}
          />
        </div>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-card-foreground">Lessons</h2>
        <ul className="space-y-2">
          {lessons.map((l) => {
            const done = completedSet.has(l._id);
            return (
              <li
                key={l._id}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-4"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {done ? (
                    <CheckCircle size={20} className="shrink-0 text-emerald-600" />
                  ) : (
                    <BookOpen size={20} className="shrink-0 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium text-card-foreground">{l.title}</span>
                </div>
                {!done && (
                  <button
                    type="button"
                    onClick={() => handleComplete(l._id)}
                    disabled={completing === l._id}
                    className="shrink-0 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                  >
                    {completing === l._id ? "..." : "Mark complete"}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
        {lessons.length === 0 && (
          <p className="rounded-lg border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
            No lessons in this course yet.
          </p>
        )}
      </section>
    </div>
  );
}
