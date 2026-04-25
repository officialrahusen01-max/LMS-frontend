"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiJson } from "@/lib/api";
import { ArrowLeft } from "lucide-react";

type BlogFormData = {
  title: string;
  excerpt: string;
  content: string;
  categories: string;
  tags: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  featuredImage: string;
  published: boolean;
  includeInAi: boolean;
};

type BlogCreateBody = {
  title: string;
  excerpt?: string;
  content: string;
  categories?: string[];
  tags?: string[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
  };
  featuredImage?: string;
  published: boolean;
  includeInAi: boolean;
};

export default function AdminNewBlogPage() {
  const router = useRouter();
  const [form, setForm] = useState<BlogFormData>({
    title: "",
    excerpt: "",
    content: "",
    categories: "",
    tags: "",
    metaTitle: "",
    metaDescription: "",
    canonicalUrl: "",
    featuredImage: "",
    published: false,
    includeInAi: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError("Title and content are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const body: BlogCreateBody = {
        title: form.title.trim(),
        excerpt: form.excerpt.trim() || undefined,
        content: form.content.trim(),
        categories: form.categories ? form.categories.split(",").map((c) => c.trim()).filter(Boolean) : [],
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        seo: {
          metaTitle: form.metaTitle.trim() || undefined,
          metaDescription: form.metaDescription.trim() || undefined,
          canonicalUrl: form.canonicalUrl.trim() || undefined,
        },
        featuredImage: form.featuredImage.trim() || undefined,
        published: form.published,
        includeInAi: form.includeInAi,
      };
      const res = await apiJson<{ message: string; data: any }>("blogs", {
        method: "POST",
        body: JSON.stringify(body),
      });
      router.push("/dashboard/admin/blogs");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create blog");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link href="/dashboard/admin" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
        <ArrowLeft size={16} /> Back to admin dashboard
      </Link>
      <h1 className="text-xl font-semibold text-card-foreground">Create New Blog (Admin)</h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border bg-card p-6">
        <div>
          <label className="block text-sm font-medium text-muted-foreground">Title *</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground">Excerpt</label>
          <textarea
            name="excerpt"
            value={form.excerpt}
            onChange={handleChange}
            rows={3}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground">Content *</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={10}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground">Categories (comma-separated)</label>
          <input
            type="text"
            name="categories"
            value={form.categories}
            onChange={handleChange}
            placeholder="cat1, cat2"
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground">Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="tag1, tag2"
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground">SEO Meta Title</label>
          <input
            type="text"
            name="metaTitle"
            value={form.metaTitle}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground">SEO Meta Description</label>
          <textarea
            name="metaDescription"
            value={form.metaDescription}
            onChange={handleChange}
            rows={2}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground">Canonical URL</label>
          <input
            type="url"
            name="canonicalUrl"
            value={form.canonicalUrl}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground">Featured Image URL</label>
          <input
            type="url"
            name="featuredImage"
            value={form.featuredImage}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="published"
            checked={form.published}
            onChange={handleChange}
            className="rounded"
          />
          <label className="text-sm font-medium text-muted-foreground">Published</label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="includeInAi"
            checked={form.includeInAi}
            onChange={handleChange}
            className="rounded"
          />
          <label className="text-sm font-medium text-muted-foreground">Include in AI</label>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Creating..." : "Create Blog"}
        </button>
      </form>
    </div>
  );
}