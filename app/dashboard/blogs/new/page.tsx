"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { instructorCreateBlog } from "@/lib/instructor-api";
import { useAuthStore } from "@/lib/auth-store";
import { ArrowLeft } from "lucide-react";

export default function NewBlogPage() {
  const router = useRouter();
  const primaryRole = useAuthStore((s) => s.primaryRole());
  const isAdmin = primaryRole === "admin";
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [categories, setCategories] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [published, setPublished] = useState(false);
  const [includeInAi, setIncludeInAi] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const body: any = {
        title: title.trim(),
        content: content.trim(),
        tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      };
      if (isAdmin) {
        body.excerpt = excerpt.trim() || undefined;
        body.categories = categories ? categories.split(",").map((c) => c.trim()).filter(Boolean) : [];
        body.seo = {
          metaTitle: metaTitle.trim() || undefined,
          metaDescription: metaDescription.trim() || undefined,
          canonicalUrl: canonicalUrl.trim() || undefined,
        };
        body.featuredImage = featuredImage.trim() || undefined;
        body.published = published;
        body.includeInAi = includeInAi;
      }
      const { data } = await instructorCreateBlog(body);
      const blogId = data?._id;
      if (blogId) router.push(`/dashboard/blogs/${blogId}/edit`);
      else router.push("/dashboard/blogs/mine");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link href="/dashboard/blogs/mine" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
        <ArrowLeft size={16} /> Back to my blogs
      </Link>
      <h1 className="text-xl font-semibold text-card-foreground">New blog</h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border bg-card p-6">
        <div>
          <label className="block text-sm font-medium text-muted-foreground">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
          />
        </div>
        {isAdmin && (
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-muted-foreground">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
          />
        </div>
        {isAdmin && (
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Categories (comma-separated)</label>
            <input
              type="text"
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              placeholder="cat1, cat2"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-muted-foreground">Tags (comma-separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="tag1, tag2"
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        {isAdmin && (
          <>
            <div>
              <label className="block text-sm font-medium text-muted-foreground">SEO Meta Title</label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground">SEO Meta Description</label>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground">Canonical URL</label>
              <input
                type="url"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground">Featured Image URL</label>
              <input
                type="url"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="rounded"
              />
              <label className="text-sm font-medium text-muted-foreground">Published</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={includeInAi}
                onChange={(e) => setIncludeInAi(e.target.checked)}
                className="rounded"
              />
              <label className="text-sm font-medium text-muted-foreground">Include in AI</label>
            </div>
          </>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Creating..." : "Create blog"}
        </button>
      </form>
    </div>
  );
}
