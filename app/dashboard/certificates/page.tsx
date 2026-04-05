"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { studentMyCertificates, type CertificateItem } from "@/lib/student-api";
import { Award, ExternalLink } from "lucide-react";

function certTitle(c: CertificateItem): string {
  return c.courseTitle ?? (c.course && typeof c.course === "object" ? c.course.title ?? "" : "") ?? "Certificate";
}

export default function CertificatesPage() {
  const [res, setRes] = useState<{ data?: CertificateItem[]; count?: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    studentMyCertificates()
      .then(setRes)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
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

  const list = res?.data ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-card-foreground">My Certificates</h1>

      {list.length === 0 ? (
        <p className="rounded-lg border border-border bg-muted/50 p-6 text-muted-foreground">
          You have no certificates yet. Complete courses to earn certificates.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <li
              key={c._id}
              className="rounded-lg border border-border bg-card p-4 shadow-sm flex flex-col"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-medium text-card-foreground">{certTitle(c)}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {c.issuedAt ? new Date(c.issuedAt).toLocaleDateString() : "—"}
                  </p>
                  {c.verificationHash && (
                    <Link
                      href={`/verify/${c.verificationHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      Verify <ExternalLink size={12} />
                    </Link>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
