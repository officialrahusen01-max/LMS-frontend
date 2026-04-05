"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Star,
  GraduationCap,
  Play,
  Loader2,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { apiJson } from "@/lib/api";
import { getStudentCardGradient } from "@/lib/student-card-gradients";

// Backend: GET /v1/courses → { success, data: courses, pagination }
// POST /v1/enrollments/courses/:courseId/enroll → enroll
// GET /v1/enrollments/me → { data: enrollments } to know enrolled course ids

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function StudentCours() {
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrollingId, setEnrollingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [enrolledOnly, setEnrolledOnly] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([
      apiJson("courses?limit=24&page=1").then((r) => (r?.success ? r?.data ?? [] : [])),
      apiJson("enrollments/me").then((r) => {
        const list = r?.data ?? [];
        return new Set(
          list
            .filter((e) => e?.status !== "cancelled")
            .map((e) => String(e?.course?._id ?? e?.course ?? e?.courseId?._id ?? e?.courseId))
        );
      }),
    ])
      .then(([list, ids]) => {
        if (!cancelled) {
          setCourses(Array.isArray(list) ? list : []);
          setEnrolledIds(ids || new Set());
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || "Failed to load courses.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const handleEnroll = (courseId) => {
    if (!courseId || enrollingId) return;
    setEnrollingId(courseId);
    apiJson(`enrollments/courses/${courseId}/enroll`, { method: "POST" })
      .then(() => {
        setEnrolledIds((prev) => new Set([...prev, String(courseId)]));
      })
      .catch((err) => {
        alert(err?.message || "Enrollment failed.");
      })
      .finally(() => setEnrollingId(null));
  };

  const courseTitle = (c) => c?.title ?? "Course";
  const courseId = (c) => c?._id;
  const amount = (c) =>
    c?.pricing?.price ?? c?.pricing?.amount ?? 0;
  const isFree = (c) => (c?.pricing?.type || "free") === "free";
  const courseThumb = (c) => c?.coverUrl || c?.thumbnailUrl || null;

  const levelOptions = useMemo(() => {
    const s = new Set();
    courses.forEach((c) => {
      if (c?.level && String(c.level).trim()) s.add(String(c.level).trim());
    });
    return Array.from(s).sort();
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return courses.filter((c) => {
      const cid = courseId(c);
      const enrolled = cid ? enrolledIds.has(String(cid)) : false;
      if (enrolledOnly && !enrolled) return false;
      if (levelFilter !== "all" && String(c?.level || "") !== levelFilter) return false;
      if (!q) return true;
      const title = (courseTitle(c) || "").toLowerCase();
      const desc = (c?.shortDescription || c?.description || "").toLowerCase();
      return title.includes(q) || desc.includes(q);
    });
  }, [courses, searchQuery, levelFilter, enrolledOnly, enrolledIds]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Courses
        </h1>
        <p className="mt-1 text-muted-foreground">
          Explore published courses and enroll to start learning.
        </p>
      </motion.div>

      {!loading && !error && courses.length > 0 && (
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-end">
          <div className="min-w-[200px] flex-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Search
            </label>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Course title or description…"
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/25"
            />
          </div>
          <div className="w-full min-w-[140px] sm:w-44">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Level
            </label>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/25"
            >
              <option value="all">All levels</option>
              {levelOptions.map((lv) => (
                <option key={lv} value={lv}>
                  {lv}
                </option>
              ))}
            </select>
          </div>
          <label className="flex cursor-pointer items-center gap-2 pb-2 text-sm font-medium text-foreground">
            <input
              type="checkbox"
              checked={enrolledOnly}
              onChange={(e) => setEnrolledOnly(e.target.checked)}
              className="h-4 w-4 rounded border-input text-primary focus:ring-primary/30"
            />
            Enrolled only
          </label>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Loading courses…</p>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {filteredCourses.map((course, idx) => {
            const cid = courseId(course);
            const enrolled = cid ? enrolledIds.has(String(cid)) : false;
            const enrolling = enrollingId === cid;
            const thumb = courseThumb(course);
            return (
              <motion.div key={course._id} variants={cardItem}>
                <motion.div
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="h-full"
                >
                  <Card className="h-full overflow-hidden border-border/80 bg-card shadow-sm hover:shadow-lg hover:border-primary/20 transition-shadow duration-300 flex flex-col">
                    <div
                      className={cn(
                        "relative h-36 overflow-hidden bg-gradient-to-br",
                        !thumb && getStudentCardGradient(idx)
                      )}
                    >
                      {thumb ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={thumb}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/35" />
                        </>
                      ) : null}
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center"
                        >
                          <Play className="w-7 h-7 text-white fill-white ml-1" />
                        </motion.div>
                      </div>
                      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-black/40 px-2 py-1 text-xs font-medium text-white backdrop-blur">
                        <GraduationCap className="w-3.5 h-3.5" />
                        {course?.totalLessons ?? 0} lessons
                      </div>
                    </div>

                    <CardHeader className="pb-2 pt-4 px-4">
                      <h3 className="font-semibold text-foreground line-clamp-2 leading-snug">
                        {courseTitle(course)}
                      </h3>
                      {course.level && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Level: {course.level}
                        </p>
                      )}
                    </CardHeader>

                    <CardContent className="px-4 py-0 flex-1 space-y-3">
                      {course.shortDescription && (
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {course.shortDescription}
                        </p>
                      )}
                      <div className="flex items-center gap-2 flex-wrap">
                        {isFree(course) ? (
                          <span className="text-lg font-bold text-foreground">Free</span>
                        ) : (
                          <span className="text-lg font-bold text-foreground">
                            ₹{Number(amount(course)).toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className="px-4 pb-4 pt-2 flex flex-col gap-2 border-t border-border/50 mt-auto">
                      {enrolled ? (
                        <Button asChild variant="default" size="sm" className="w-full">
                          <Link
                            href={cid ? `/student/cours/${cid}/learn` : "/student/cours"}
                            className="inline-flex items-center gap-1"
                          >
                            Continue learning
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </Button>
                      ) : (
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full"
                          disabled={enrolling}
                          onClick={() => handleEnroll(cid)}
                        >
                          {enrolling ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              Enrolling…
                            </>
                          ) : (
                            "Enroll"
                          )}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {!loading && !error && courses.length > 0 && filteredCourses.length === 0 && (
        <div className="rounded-lg border border-border bg-card p-10 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">No courses match your filters.</p>
          <button
            type="button"
            className="mt-4 text-sm font-semibold text-primary hover:underline"
            onClick={() => {
              setSearchQuery("");
              setLevelFilter("all");
              setEnrolledOnly(false);
            }}
          >
            Clear filters
          </button>
        </div>
      )}

      {!loading && !error && courses.length === 0 && (
        <div className="rounded-lg border border-border bg-card p-10 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">No published courses available yet.</p>
        </div>
      )}
    </div>
  );
}

export default StudentCours;
