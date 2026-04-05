"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Calendar, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { studentGetBlogBySlug } from "@/lib/student-api";

function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function readTimeFromContent(text) {
  const len = (text || "").length;
  const mins = Math.max(1, Math.ceil(len / 1200));
  return `${mins} min read`;
}

function categoryLabel(b) {
  if (!b) return "Article";
  return (b.categories && b.categories[0]) || (b.tags && b.tags[0]) || "Article";
}

function authorName(b) {
  const a = b?.author;
  return a?.fullName || a?.publicUsername || "Instructor";
}

export default function StudentBlogArticlePage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    studentGetBlogBySlug(slug)
      .then((res) => {
        if (!cancelled) setPost(res?.data ?? null);
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message || "Not found");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="mt-4 text-xl font-bold text-foreground">Article not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error || "This post may be unpublished or removed."}</p>
        <Button asChild className="mt-6">
          <Link href="/student/blogs">Back to blog</Link>
        </Button>
      </div>
    );
  }

  const htmlLike = typeof post.content === "string" && /<\s*[a-z][\s\S]*>/i.test(post.content);

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2 gap-1 text-muted-foreground">
        <Link href="/student/blogs">
          <ArrowLeft className="h-4 w-4" />
          All posts
        </Link>
      </Button>
      <Badge variant="secondary" className="mb-3">
        {categoryLabel(post)}
      </Badge>
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{post.title}</h1>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Avatar className="h-9 w-9 border border-border">
          <AvatarImage src={post.author?.avatarUrl} alt={authorName(post)} />
          <AvatarFallback>{authorName(post).slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="text-sm">
          <p className="font-medium text-foreground">{authorName(post)}</p>
          <p className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(post.publishedAt || post.createdAt)} · {readTimeFromContent(post.content)}
          </p>
        </div>
      </div>
      {post.excerpt ? <p className="mt-8 text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p> : null}
      <div className="mt-8">
        {htmlLike ? (
          <div
            className="prose prose-neutral dark:prose-invert max-w-none text-foreground"
            dangerouslySetInnerHTML={{ __html: post.content || "" }}
          />
        ) : (
          <div className="whitespace-pre-wrap leading-relaxed text-foreground">{post.content || ""}</div>
        )}
      </div>
    </article>
  );
}
