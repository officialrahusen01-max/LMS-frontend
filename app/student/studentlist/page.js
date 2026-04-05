"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Award,
  Calendar,
  Play,
  ChevronRight,
  Loader2,
  GraduationCap,
} from "lucide-react";
import { apiJson } from "@/lib/api";
import { cn } from "@/lib/utils";
import { getStudentCardGradient } from "@/lib/student-card-gradients";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

function formatDate(val) {
  if (!val) return "—";
  return new Date(val).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StudentList() {
  const [enrollments, setEnrollments] = useState([]);
  const [progressList, setProgressList] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      apiJson("enrollments/me").then((r) => r?.data ?? []),
      apiJson("enrollments/me/progress").then((r) => r?.data ?? []),
      apiJson("certificates/me").then((r) => r?.data ?? []),
    ])
      .then(([enr, prog, cert]) => {
        if (!cancelled) {
          setEnrollments(Array.isArray(enr) ? enr : []);
          setProgressList(Array.isArray(prog) ? prog : []);
          setCertificates(Array.isArray(cert) ? cert : []);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || "Failed to load your data.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const progressByCourse = progressList.reduce((acc, p) => {
    const cid = p?.course?._id ?? p?.course ?? p?.courseId;
    if (cid) acc[String(cid)] = p;
    return acc;
  }, {});

  const activeEnrollments = enrollments.filter(
    (e) => e?.status !== "cancelled" && e?.status !== "expired"
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center justify-center min-h-[40vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">Loading your learning track…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Make sure you are logged in as a student. These details come from your enrollments, progress, and certificates.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          My Learning
        </h1>
        <p className="mt-1 text-muted-foreground">
          Your enrolled courses, progress, and certificates — all in one place.
        </p>
      </motion.div>

      {/* Enrolled courses + progress */}
      <section className="mb-12">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <BookOpen className="h-5 w-5 text-primary" />
          My Courses
        </h2>
        {activeEnrollments.length === 0 ? (
          <Card className="border-border/80 bg-card">
            <CardContent className="py-10 text-center">
              <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-3 text-muted-foreground">You are not enrolled in any course yet.</p>
              <Button asChild variant="default" className="mt-4" size="sm">
                <Link href="/student/cours">Browse courses</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {activeEnrollments.map((e, idx) => {
              const courseId = e?.course?._id ?? e?.course ?? e?.courseId;
              const progress = courseId ? progressByCourse[String(courseId)] : null;
              const percent = progress?.percentComplete ?? 0;
              const title = e?.course?.title ?? "Course";

              return (
                <motion.div key={e._id} variants={item}>
                  <motion.div whileHover={{ y: -4 }} className="h-full">
                    <Card className="h-full overflow-hidden border-border/80 bg-card shadow-sm hover:shadow-lg hover:border-primary/20 transition-shadow duration-300 flex flex-col">
                      <div
                        className={cn(
                          "relative h-32 bg-gradient-to-br",
                          getStudentCardGradient(idx)
                        )}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="w-10 h-10 text-white/40" />
                        </div>
                        <div className="absolute bottom-2 left-2 right-2">
                          <Progress value={percent} className="h-1.5 bg-white/30" />
                        </div>
                      </div>
                      <CardHeader className="pb-2 pt-4 px-4">
                        <h3 className="font-semibold text-foreground line-clamp-2 leading-snug">
                          {title}
                        </h3>
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Enrolled {formatDate(e?.enrolledAt)}
                        </p>
                      </CardHeader>
                      <CardFooter className="px-4 pb-4 pt-0 mt-auto flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">
                          {percent}% complete
                        </span>
                        <Button variant="ghost" size="sm" asChild className="text-primary">
                          <Link
                            href={courseId ? `/student/cours/${courseId}/learn` : "/student/cours"}
                            className="inline-flex items-center gap-1"
                          >
                            Continue
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </section>

      {/* Certificates */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <Award className="h-5 w-5 text-primary" />
          My Certificates
        </h2>
        {certificates.length === 0 ? (
          <Card className="border-border/80 bg-card">
            <CardContent className="py-8 text-center">
              <Award className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Complete a course to earn a certificate.
              </p>
            </CardContent>
          </Card>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {certificates.map((cert, idx) => (
              <motion.div key={cert._id} variants={item}>
                <motion.div whileHover={{ y: -4 }} className="h-full">
                  <Card className="h-full overflow-hidden border-border/80 bg-card shadow-sm hover:shadow-lg hover:border-primary/20 transition-shadow duration-300">
                    <div
                      className={cn(
                        "relative h-24 bg-gradient-to-br",
                        getStudentCardGradient(idx + 2)
                      )}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Award className="w-12 h-12 text-white/40" />
                      </div>
                    </div>
                    <CardHeader className="pb-2 pt-4 px-4">
                      <h3 className="font-semibold text-foreground line-clamp-2">
                        {cert?.course?.title ?? cert?.courseTitle ?? "Course"}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {cert?.certificateId && (
                          <span className="font-mono">{cert.certificateId}</span>
                        )}
                        {cert?.issuedAt && (
                          <>
                            {" · "}
                            Issued {formatDate(cert.issuedAt)}
                          </>
                        )}
                      </p>
                    </CardHeader>
                    <CardFooter className="px-4 pb-4 pt-0">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/student/certificates/${cert._id}`}>
                          View certificate
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}

export default StudentList;
