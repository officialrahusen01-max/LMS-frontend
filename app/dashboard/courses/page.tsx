"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { instructorListCourses } from "@/lib/instructor-api";
import { BookOpen } from "lucide-react";

export default function CoursesListPage() {
  const [res, setRes] = useState<Awaited<ReturnType<typeof instructorListCourses>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    instructorListCourses({ limit: 20 })
      .then(setRes)
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

  const courses = res?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-card-foreground">Browse Courses</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Published catalog plus your own drafts (when logged in as instructor or admin).
        </p>
      </div>

      {courses.length === 0 ? (
        <p className="rounded-lg border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
          No courses available yet.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <li key={c._id}>
              <Link
                href={`/dashboard/courses/${c._id}`}
                className="block rounded-lg border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/50 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-medium text-card-foreground">{c.title}</h2>
                      {c.published === false && (
                        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
                          Draft
                        </span>
                      )}
                      {c.published === true && (
                        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                          Live
                        </span>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {c.shortDescription || "No description"}
                    </p>
                    {c.level && (
                      <p className="mt-2 text-xs text-muted-foreground">Level: {c.level}</p>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {res?.pagination && res.pagination.pages > 1 && (
        <p className="text-sm text-muted-foreground">
          Page {res.pagination.page} of {res.pagination.pages} ({res.pagination.total} courses)
        </p>
      )}
    </div>
  );
}
