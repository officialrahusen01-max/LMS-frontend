"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiJson } from "@/lib/api";
import { FileText } from "lucide-react";

type Blog = {
  _id: string;
  title: string;
  slug?: string;
  excerpt?: string;
  published?: boolean;
  likes?: number;
  commentCount?: number;
  createdAt?: string;
};

export default function BlogsListPage() {
  const [res, setRes] = useState<{ data?: Blog[]; pagination?: { total: number } } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiJson<{ data: Blog[]; pagination?: { total: number } }>("blogs?limit=20")
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
      <h1 className="text-xl font-semibold text-card-foreground">Blogs</h1>

      {list.length === 0 ? (
        <p className="rounded-lg border border-border bg-muted/50 p-6 text-muted-foreground">
          No blogs yet.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((b) => (
            <li key={b._id}>
              <Link
                href={`/dashboard/blogs/${b.slug ?? b._id}`}
                className="block rounded-lg border border-border bg-card p-4 shadow-sm hover:border-primary/50 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-medium text-card-foreground">{b.title}</h2>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {b.excerpt ?? "No excerpt"}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {b.likes ?? 0} likes · {b.commentCount ?? 0} comments
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {res?.pagination && res.pagination.total > 0 && (
        <p className="text-sm text-muted-foreground">Total: {res.pagination.total}</p>
      )}
    </div>
  );
}
