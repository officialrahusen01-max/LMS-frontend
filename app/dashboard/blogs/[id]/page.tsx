"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiJson, apiFetch } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Heart, MessageCircle, ArrowLeft } from "lucide-react";

type Blog = {
  _id: string;
  title: string;
  slug?: string;
  content?: string;
  tags?: string[];
  likes?: number;
  commentCount?: number;
  isPublished?: boolean;
  author?: { fullName?: string; publicUsername?: string };
  createdAt?: string;
};

type Comment = {
  _id: string;
  content: string;
  author?: { fullName?: string };
  createdAt?: string;
  likes?: number;
};

export default function BlogDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const primaryRole = useAuthStore((s) => s.primaryRole());
  const isInstructor = primaryRole === "instructor" || primaryRole === "admin";

  const [blog, setBlog] = useState<Blog | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liking, setLiking] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const isSlug = id && !/^[0-9a-fA-F]{24}$/.test(id);
  const fetchUrl = isSlug ? `blogs/slug/${id}` : `blogs/${id}`;

  useEffect(() => {
    apiJson<{ data: Blog }>(fetchUrl)
      .then((r) => setBlog(r.data ?? null))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [fetchUrl]);

  useEffect(() => {
    if (!blog?._id) return;
    apiJson<{ data: Comment[] }>(`blogs/${blog._id}/comments`)
      .then((r) => setComments(r.data ?? []))
      .catch(() => setComments([]));
  }, [blog?._id]);

  const blogId = blog?._id ?? id;

  const handleLike = async () => {
    if (!blogId || liking) return;
    setLiking(true);
    try {
      await apiFetch(`blogs/${blogId}/like`, { method: "POST" });
      setBlog((b) => (b ? { ...b, likes: (b.likes ?? 0) + 1 } : null));
    } finally {
      setLiking(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogId || !commentText.trim() || submittingComment) return;
    setSubmittingComment(true);
    try {
      const res = await apiFetch(`blogs/${blogId}/comments`, {
        method: "POST",
        body: JSON.stringify({ content: commentText.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.data) {
        setComments((prev) => [data.data, ...prev]);
        setCommentText("");
        setBlog((b) => (b ? { ...b, commentCount: (b.commentCount ?? 0) + 1 } : null));
      }
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="space-y-4">
        <Link href="/dashboard/blogs" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
          <ArrowLeft size={16} /> Back to blogs
        </Link>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          {error || "Blog not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/dashboard/blogs" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
        <ArrowLeft size={16} /> Back to blogs
      </Link>

      <article className="rounded-lg border border-border bg-card p-6">
        <h1 className="text-xl font-semibold text-card-foreground">{blog.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {blog.author?.fullName ?? blog.author?.publicUsername ?? "Author"} ·{" "}
          {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ""}
        </p>
        <div className="mt-4 prose prose-sm max-w-none text-card-foreground">
          {blog.content?.split("\n").map((p, i) => (
            <p key={i} className="mb-2">{p}</p>
          )) ?? <p>No content</p>}
        </div>
        {blog.tags?.length ? (
          <p className="mt-4 text-xs text-muted-foreground">Tags: {blog.tags.join(", ")}</p>
        ) : null}

        <div className="mt-6 flex items-center gap-4">
          <button
            type="button"
            onClick={handleLike}
            disabled={liking}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-1.5 text-sm hover:bg-accent disabled:opacity-50"
          >
            <Heart size={16} /> {blog.likes ?? 0}
          </button>
        </div>
      </article>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-card-foreground">
          <MessageCircle size={18} /> Comments ({comments.length})
        </h2>
        <form onSubmit={handleAddComment} className="mb-4">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            rows={2}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={submittingComment || !commentText.trim()}
            className="mt-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {submittingComment ? "Posting..." : "Post comment"}
          </button>
        </form>
        <ul className="space-y-3">
          {comments.map((c) => (
            <li key={c._id} className="rounded-lg border border-border bg-card p-3 text-sm">
              <p className="text-card-foreground">{c.content}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {c.author?.fullName ?? "User"} · {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {isInstructor && (
        <Link
          href={`/dashboard/blogs/${blog._id}/edit`}
          className="inline-block rounded-md border border-border bg-secondary px-4 py-2 text-sm hover:bg-accent"
        >
          Edit blog
        </Link>
      )}
    </div>
  );
}
