"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiJson } from "@/lib/api";
import { ArrowLeft, Award } from "lucide-react";

type Row = {
  _id: string;
  certificateId: string;
  issuedAt?: string;
  verificationHash?: string;
  user?: { fullName?: string; email?: string; publicUsername?: string };
  course?: { title?: string; slug?: string };
};

export default function AdminCertificatesPage() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<{ items: Row[]; total: number; pages: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const q = new URLSearchParams({ page: String(page), limit: "25" });
    apiJson<{ data: { items: Row[]; total: number; pages: number } }>(`admin/certificates?${q}`)
      .then((r) => setData(r.data))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/admin"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Dashboard
      </Link>
      <h1 className="text-xl font-semibold text-card-foreground flex items-center gap-2">
        <Award className="h-6 w-6" /> Certificates
      </h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">{error}</div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">Total: {data?.total ?? 0}</p>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Certificate ID</th>
                  <th className="px-3 py-2 text-left font-medium">Learner</th>
                  <th className="px-3 py-2 text-left font-medium">Course</th>
                  <th className="px-3 py-2 text-left font-medium">Issued</th>
                </tr>
              </thead>
              <tbody>
                {(data?.items ?? []).map((c) => (
                  <tr key={String(c._id)} className="border-b border-border/80">
                    <td className="px-3 py-2 font-mono text-xs">{c.certificateId}</td>
                    <td className="px-3 py-2">
                      {c.user?.fullName ?? "—"}
                      <div className="text-xs text-muted-foreground">{c.user?.email}</div>
                    </td>
                    <td className="px-3 py-2">{c.course?.title ?? "—"}</td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {c.issuedAt ? new Date(c.issuedAt).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data && data.pages > 1 && (
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-md border px-3 py-1 text-sm disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-muted-foreground py-1">
                Page {page} / {data.pages}
              </span>
              <button
                type="button"
                disabled={page >= data.pages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-md border px-3 py-1 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
