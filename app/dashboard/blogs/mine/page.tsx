"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  instructorGetMyBlogs,
  instructorPublishBlog,
  instructorUnpublishBlog,
  instructorDeleteBlog,
} from "@/lib/instructor-api";
import { apiJson } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { FileText, Edit, Trash2, Send, EyeOff } from "lucide-react";

type Blog = {
  _id: string;
  title: string;
  slug?: string;
  isPublished?: boolean;
  publishedAt?: string;
  createdAt?: string;
};

export default function MyBlogsPage() {
  const [res, setRes] = useState<{ data?: Blog[]; pagination?: { total: number } } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const primaryRole = useAuthStore((s) => s.primaryRole());

  useEffect(() => {
    const load = primaryRole === "admin" 
      ? apiJson<{ status: boolean; data: { blogs: any[]; total: number; page: number; limit: number; pages: number } }>("admin/blogs").then(r => ({
          data: r.data.blogs.map(b => ({ ...b, isPublished: b.published })),
          pagination: { total: r.data.total }
        }))
      : instructorGetMyBlogs();
    load
      .then(setRes)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [primaryRole]);

  const handlePublish = async (id: string, publish: boolean) => {
    try {
      if (publish) await instructorPublishBlog(id);
      else await instructorUnpublishBlog(id);
      setRes((r) => ({
        ...r!,
        data: (r?.data ?? []).map((b) =>
          b._id === id ? { ...b, isPublished: publish, publishedAt: publish ? new Date().toISOString() : undefined } : b
        ),
      }));
    } catch {
      // ignore
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog?")) return;
    try {
      await instructorDeleteBlog(id);
      setRes((r) => ({ ...r!, data: (r?.data ?? []).filter((b) => b._id !== id) }));
    } catch {
      // ignore
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
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        {error}
      </div>
    );
  }

  const list = res?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-card-foreground">My Blogs</h1>
        <Link
          href="/dashboard/blogs/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          New blog
        </Link>
      </div>

      {list.length === 0 ? (
        <p className="rounded-lg border border-border bg-muted/50 p-6 text-muted-foreground">
          You have not written any blogs yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {list.map((b) => (
            <li
              key={b._id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                <div>
                  <Link href={`/dashboard/blogs/${b.slug ?? b._id}`} className="font-medium text-card-foreground hover:underline">
                    {b.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {b.isPublished ? "Published" : "Draft"} · {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/blogs/${b._id}/edit`}
                  className="inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-xs hover:bg-accent"
                >
                  <Edit size={14} /> Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handlePublish(b._id, !b.isPublished)}
                  className="inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-xs hover:bg-accent"
                >
                  {b.isPublished ? <EyeOff size={14} /> : <Send size={14} />} {b.isPublished ? "Unpublish" : "Publish"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(b._id)}
                  className="inline-flex items-center gap-1 rounded border border-destructive/50 px-2 py-1 text-xs text-destructive hover:bg-destructive/10"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
