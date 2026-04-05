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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight, BookOpen, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStudentCardGradient } from "@/lib/student-card-gradients";
import { studentListPublishedBlogs } from "@/lib/student-api";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const cardItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
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

function excerptFrom(b) {
  if (b.excerpt?.trim()) return b.excerpt.trim();
  const c = (b.content || "").replace(/\s+/g, " ").trim();
  return c.length > 160 ? `${c.slice(0, 160)}…` : c || "Read more on the blog.";
}

function categoryLabel(b) {
  return (b.categories && b.categories[0]) || (b.tags && b.tags[0]) || "Article";
}

function authorName(b) {
  const a = b.author;
  return a?.fullName || a?.publicUsername || "Instructor";
}

export default function StudentBlogsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    studentListPublishedBlogs({ limit: 24, page: 1 })
      .then((res) => {
        if (!cancelled) setPosts(Array.isArray(res?.data) ? res.data : []);
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message || "Failed to load blogs");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Blog</h1>
        <p className="mt-1 text-muted-foreground">
          Tips, guides, and stories from instructors — same posts as the main blog catalog.
        </p>
      </motion.div>

      {loading && (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      )}

      {error && !loading && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="rounded-xl border border-border bg-muted/30 px-6 py-12 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">No published posts yet. Check back soon.</p>
        </div>
      )}

      {!loading && posts.length > 0 && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {posts.map((post, postIdx) => (
            <motion.div key={post._id} variants={cardItem}>
              <motion.div whileHover={{ y: -4 }} className="h-full">
                <Card className="flex h-full flex-col overflow-hidden border-border/80 bg-card shadow-sm transition-shadow duration-300 hover:border-primary/20 hover:shadow-lg">
                  <Link href={`/student/blogs/${post.slug}`} className="block">
                    <div
                      className={cn(
                        "relative h-40 overflow-hidden bg-gradient-to-br",
                        !post.featuredImage && getStudentCardGradient(postIdx)
                      )}
                    >
                      {post.featuredImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.featuredImage}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        {!post.featuredImage && <BookOpen className="h-12 w-12 text-white/30" />}
                      </div>
                      <div className="absolute left-3 top-3">
                        <Badge
                          variant="secondary"
                          className="border-0 bg-white/90 text-xs text-foreground shadow-sm dark:bg-card/90"
                        >
                          {categoryLabel(post)}
                        </Badge>
                      </div>
                    </div>
                  </Link>

                  <CardHeader className="px-4 pb-2 pt-4">
                    <Link href={`/student/blogs/${post.slug}`}>
                      <h3 className="line-clamp-2 font-semibold leading-snug text-foreground transition-colors hover:text-primary">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{excerptFrom(post)}</p>
                  </CardHeader>

                  <CardFooter className="mt-auto flex flex-wrap items-center justify-between gap-3 px-4 pb-4 pt-0">
                    <div className="flex min-w-0 items-center gap-2">
                      <Avatar className="h-8 w-8 shrink-0 border-2 border-background">
                        <AvatarImage src={post.author?.avatarUrl} alt={authorName(post)} />
                        <AvatarFallback className="text-xs">{authorName(post).slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-foreground">{authorName(post)}</p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                          <span>·</span>
                          <span>{readTimeFromContent(post.content)}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="shrink-0 text-primary hover:bg-primary/10 hover:text-primary"
                      asChild
                    >
                      <Link href={`/student/blogs/${post.slug}`} className="inline-flex items-center gap-1.5">
                        Read
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
