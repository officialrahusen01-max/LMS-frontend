"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { apiJson } from "@/lib/api";
import { ArrowLeft, UserCheck, Users } from "lucide-react";

type Row = {
  _id: string;
  fullName: string;
  publicUsername: string;
  email: string;
  status?: string;
  approvedInstructor?: boolean;
};

function InstructorsContent() {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") || "all";
  const [page, setPage] = useState(1);
  const [data, setData] = useState<{ users: Row[]; total: number; pages: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const instructorFilter =
    filter === "active" ? "active" : filter === "inactive" ? "inactive" : "";

  useEffect(() => {
    setPage(1);
  }, [filter]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const q = new URLSearchParams({ role: "instructor", page: String(page), limit: "25" });
    if (instructorFilter) q.set("instructorFilter", instructorFilter);
    apiJson<{ data: { users: Row[]; total: number; pages: number } }>(`admin/users?${q}`)
      .then((r) => setData(r.data))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [page, instructorFilter]);

  const tabs = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "inactive", label: "Inactive" },
  ] as const;

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/admin"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Dashboard
      </Link>
      <h1 className="text-xl font-semibold text-card-foreground flex items-center gap-2">
        <Users className="h-6 w-6" /> Instructors
      </h1>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link
            key={t.id}
            href={t.id === "all" ? "/dashboard/admin/instructors" : `/dashboard/admin/instructors?filter=${t.id}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              (t.id === "all" && filter === "all") || filter === t.id
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

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
                  <th className="px-3 py-2 text-left font-medium">Name</th>
                  <th className="px-3 py-2 text-left font-medium">Username</th>
                  <th className="px-3 py-2 text-left font-medium">Email</th>
                  <th className="px-3 py-2 text-left font-medium">Status</th>
                  <th className="px-3 py-2 text-left font-medium">Approved</th>
                </tr>
              </thead>
              <tbody>
                {(data?.users ?? []).map((u) => (
                  <tr key={u._id} className="border-b border-border/80">
                    <td className="px-3 py-2">{u.fullName}</td>
                    <td className="px-3 py-2 text-muted-foreground">{u.publicUsername}</td>
                    <td className="px-3 py-2 text-muted-foreground">{u.email}</td>
                    <td className="px-3 py-2">{u.status ?? "—"}</td>
                    <td className="px-3 py-2">
                      {u.approvedInstructor ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600">
                          <UserCheck className="h-3.5 w-3.5" /> Yes
                        </span>
                      ) : (
                        <span className="text-amber-600">No</span>
                      )}
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

export default function AdminInstructorsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-12">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <InstructorsContent />
    </Suspense>
  );
}
