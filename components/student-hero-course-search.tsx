"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BookOpen, Search, TrendingUp } from "lucide-react";
import { apiJson } from "@/lib/api";

/**
 * Student home hero — project glass colors on primary hero.
 * Focus: popular programs + trending (layout). Type: enrolled courses only (original result rows).
 */

type Enrollment = {
  status?: string;
  course?: { _id?: string; title?: string };
  courseId?: string | { _id?: string; title?: string };
  courseTitle?: string;
};

type CoursePreview = {
  courseId: string;
  title: string;
};

const POPULAR_PROGRAMS: {
  title: string;
  meta: string;
  image: string;
  href: string;
}[] = [
  {
    title: "CS50's Introduction to Computer Science",
    meta: "HarvardX | Course",
    image: "/images/banner2.png",
    href: "/student/cours",
  },
  {
    title: "Artificial Intelligence: Implications for Business Strategy",
    meta: "MIT Sloan School of Management | Executive Education",
    image: "/images/studentBanner.png",
    href: "/student/cours",
  },
  {
    title: "Supply Chain Design",
    meta: "MITx | Course",
    image: "/images/banner2.png",
    href: "/student/cours",
  },
  {
    title: "Data Structures & Algorithms IV",
    meta: "GTx | Course",
    image: "/images/studentBanner.png",
    href: "/student/cours",
  },
  {
    title: "Exercising Leadership: Foundational Principles",
    meta: "HarvardX | Course",
    image: "/images/banner2.png",
    href: "/student/cours",
  },
];

const TRENDING_TOPICS: { label: string; href: string }[] = [
  { label: "data science", href: "/student/cours" },
  { label: "ai", href: "/student/cours" },
  { label: "finance", href: "/student/cours" },
  { label: "business", href: "/student/cours" },
];

function ProgramRowHero({
  title,
  meta,
  imageSrc,
  href,
  onPick,
}: {
  title: string;
  meta: string;
  imageSrc: string;
  href: string;
  onPick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onPick}
      className="flex gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-primary-foreground/15"
    >
      <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-primary-foreground/10 ring-1 ring-primary-foreground/20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageSrc} alt="" className="h-full w-full object-cover" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 text-sm font-bold leading-snug text-primary-foreground">{title}</span>
        <span className="mt-0.5 block text-xs text-primary-foreground/65">{meta}</span>
      </span>
    </Link>
  );
}

export default function StudentHeroCourseSearch() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    apiJson("enrollments/me")
      .then((r) => {
        if (r && typeof r === "object" && Array.isArray((r as any).data)) {
          setEnrollments((r as any).data);
        } else {
          setEnrollments([]);
        }
      })
      .catch(() => setEnrollments([]));
  }, []);

  const myCourses: CoursePreview[] = useMemo(() => {
    return enrollments
      .filter((e) => e && e.status !== "cancelled")
      .map((e) => {
        let id: string | undefined;
        if (typeof e.courseId === "string") id = e.courseId;
        else if (typeof e.courseId === "object" && e.courseId?._id) id = e.courseId._id;
        else if (e.course && e.course._id) id = e.course._id;
        else if (typeof e.course === "string") id = e.course as string;

        const title =
          e.courseTitle ??
          (typeof e.courseId === "object" && e.courseId?.title) ??
          (e.course && typeof e.course === "object" && e.course.title) ??
          "Course";

        return id ? { courseId: id, title } : null;
      })
      .filter(Boolean) as CoursePreview[];
  }, [enrollments]);

  const qLower = searchQuery.trim().toLowerCase();
  const isTyping = Boolean(qLower);

  /** Pehle jaisa: sirf enrolled courses filter (type karte waqt). */
  const searchResults = useMemo(() => {
    if (!qLower) return [];
    return myCourses
      .filter((c) => (c.title || "").toLowerCase().includes(qLower))
      .slice(0, 8);
  }, [myCourses, qLower]);

  const enrolledPreview = useMemo(() => myCourses.slice(0, 6), [myCourses]);

  const pickLink = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  useEffect(() => {
    function handleClickOutside(ev: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(ev.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="mx-auto w-full max-w-xl sm:max-w-2xl">
      <p className="mb-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-foreground/65">
        Find your course
      </p>
      <div className="relative" ref={searchRef}>
        <div
          className="pointer-events-none absolute -inset-1 rounded-full bg-primary-foreground/15 blur-lg"
          aria-hidden
        />
        <div className="relative flex items-center gap-3 rounded-full border border-primary-foreground/30 bg-primary-foreground/[0.14] py-2.5 pl-5 pr-3 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.35)] backdrop-blur-md ring-1 ring-primary-foreground/15 transition-shadow focus-within:border-primary-foreground/45 focus-within:bg-primary-foreground/[0.18] focus-within:ring-primary-foreground/25 sm:py-3 sm:pl-6">
          <Search
            className="h-5 w-5 shrink-0 text-primary-foreground/55 sm:h-[1.35rem] sm:w-[1.35rem]"
            strokeWidth={2}
          />
          <input
            type="search"
            autoComplete="off"
            placeholder="Search your enrolled courses…"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            aria-expanded={searchOpen}
            aria-controls="student-course-search-panel"
            aria-autocomplete="list"
            className="min-w-0 flex-1 bg-transparent text-base text-primary-foreground placeholder:text-primary-foreground/45 focus:outline-none sm:text-lg"
          />
        </div>

        {searchOpen && (
          <div
            id="student-course-search-panel"
            role="listbox"
            className="absolute left-0 right-0 top-[calc(100%+0.65rem)] z-30 max-h-[min(70vh,520px)] overflow-y-auto rounded-2xl border border-primary-foreground/25 bg-primary-foreground/[0.08] py-2 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.45)] ring-1 ring-primary-foreground/10 backdrop-blur-2xl supports-[backdrop-filter]:bg-primary-foreground/[0.06]"
          >
            {!isTyping && (
              <>
                <p className="px-3 pt-1 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/45">
                  Most popular programs
                </p>
                <ul className="px-1.5 pb-2">
                  {POPULAR_PROGRAMS.map((p, i) => (
                    <li key={`${p.title}-${i}`}>
                      <ProgramRowHero
                        title={p.title}
                        meta={p.meta}
                        imageSrc={p.image}
                        href={p.href}
                        onPick={pickLink}
                      />
                    </li>
                  ))}
                </ul>

                <div className="mx-2 border-t border-primary-foreground/15" role="separator" />

                <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/45">
                  Trending now
                </p>
                <ul className="px-1.5 pb-2 space-y-0.5">
                  {TRENDING_TOPICS.map((t) => (
                    <li key={t.label}>
                      <Link
                        href={t.href}
                        onClick={pickLink}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/15"
                      >
                        <TrendingUp className="h-4 w-4 shrink-0 text-primary-foreground/90" strokeWidth={2} />
                        {t.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                {enrolledPreview.length > 0 && (
                  <>
                    <div className="mx-2 border-t border-primary-foreground/15" role="separator" />
                    <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/45">
                      Your courses
                    </p>
                    <ul className="px-1.5 pb-1">
                      {enrolledPreview.map((c) => (
                        <li key={c.courseId}>
                          <Link
                            href={`/student/cours/${c.courseId}/learn`}
                            onClick={pickLink}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-primary-foreground transition-colors hover:bg-primary-foreground/15"
                          >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/15 text-primary-foreground ring-1 ring-primary-foreground/20">
                              <BookOpen className="h-4 w-4" strokeWidth={2} />
                            </span>
                            <span className="min-w-0 flex-1 truncate font-medium">{c.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {enrolledPreview.length === 0 && (
                  <p className="px-4 pb-3 pt-0 text-center text-xs text-primary-foreground/55">
                    No enrollments yet — open{" "}
                    <Link
                      href="/student/cours"
                      className="font-medium text-primary-foreground/85 underline decoration-primary-foreground/30 underline-offset-2"
                      onClick={pickLink}
                    >
                      Browse all courses
                    </Link>{" "}
                    to start.
                  </p>
                )}
              </>
            )}

            {isTyping && searchResults.length === 0 && (
              <p className="px-4 py-5 text-center text-sm text-primary-foreground/75">
                No courses match your search.
              </p>
            )}

            {isTyping && searchResults.length > 0 && (
              <ul className="px-1.5 py-1">
                {searchResults.map((c) => (
                  <li key={String(c.courseId)}>
                    <Link
                      href={`/student/cours/${c.courseId}/learn`}
                      onClick={pickLink}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-primary-foreground transition-colors hover:bg-primary-foreground/15"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/15 text-primary-foreground ring-1 ring-primary-foreground/20">
                        <BookOpen className="h-4 w-4" strokeWidth={2} />
                      </span>
                      <span className="min-w-0 flex-1 truncate font-medium">{c.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
