"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { studentVerifyCertificate } from "@/lib/student-api";
import { CheckCircle } from "lucide-react";

type VerifyResult = {
  certificateId?: string;
  studentName?: string;
  course?: string;
  issuedAt?: string;
  valid?: boolean;
};

export default function VerifyCertificatePage() {
  const params = useParams();
  const hash = params?.hash as string;
  const [data, setData] = useState<{ data?: VerifyResult } | null>(null);
  const [loading, setLoading] = useState(!!hash);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hash) {
      setError("Invalid link");
      setLoading(false);
      return;
    }
    studentVerifyCertificate(hash)
      .then((json) => {
        if (json?.data?.valid) setData(json as { data?: VerifyResult });
        else setError("Certificate not found or invalid");
      })
      .catch(() => setError("Verification failed"))
      .finally(() => setLoading(false));
  }, [hash]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <p className="text-destructive">{error || "Invalid certificate"}</p>
        <Link href="/login" className="mt-4 text-primary hover:underline">Go to login</Link>
      </div>
    );
  }

  const d = data.data;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm text-center">
        <div className="inline-flex rounded-full bg-emerald-100 p-3 text-emerald-600">
          <CheckCircle size={32} />
        </div>
        <h1 className="mt-4 text-lg font-semibold text-card-foreground">Certificate verified</h1>
        <dl className="mt-4 space-y-2 text-left text-sm">
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Course</dt>
            <dd className="font-medium text-card-foreground">{d.course ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Student</dt>
            <dd className="font-medium text-card-foreground">{d.studentName ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Issued</dt>
            <dd className="font-medium text-card-foreground">
              {d.issuedAt ? new Date(d.issuedAt).toLocaleDateString() : "—"}
            </dd>
          </div>
        </dl>
        <Link href="/login" className="mt-6 inline-block text-sm text-primary hover:underline">
          Go to LMS
        </Link>
      </div>
    </div>
  );
}
