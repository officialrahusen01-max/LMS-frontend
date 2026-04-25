"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiJson } from "@/lib/api";
import { BookOpen, Plus, Edit, Eye, EyeOff } from "lucide-react";

type BlogItem = {
  _id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: string;
  author: { fullName: string };
};

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const res = await apiJson<{ status: boolean; data: { blogs: BlogItem[]; total: number; page: number; limit: number; pages: number } }>("admin/blogs");
      setBlogs(res.data.blogs ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (id: string, published: boolean) => {
    try {
      await apiJson(`blogs/${id}/${published ? 'unpublish' : 'publish'}`, { method: 'POST' });
      loadBlogs(); // Reload
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
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

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-card-foreground">Blogs</h1>

      <div className="rounded-lg border border-border bg-card">
        <div className="p-4">
          {blogs.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
              <p className="mb-6">No blogs yet.</p>
              <Link
                href="/dashboard/admin/blogs/new"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                <Plus size={16} />
                Add Blog
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-card-foreground">All Blogs</h2>
                <Link
                  href="/dashboard/admin/blogs/new"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  <Plus size={16} />
                  Add Blog
                </Link>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left font-medium text-muted-foreground py-2">Title</th>
                    <th className="text-left font-medium text-muted-foreground py-2">Author</th>
                    <th className="text-left font-medium text-muted-foreground py-2">Status</th>
                    <th className="text-left font-medium text-muted-foreground py-2">Created</th>
                    <th className="text-right font-medium text-muted-foreground py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog) => (
                    <tr key={blog._id} className="border-b border-border last:border-0">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <BookOpen size={16} className="text-muted-foreground" />
                          <span className="font-medium">{blog.title}</span>
                        </div>
                      </td>
                      <td className="py-3 text-muted-foreground">{blog.author?.fullName || "Unknown"}</td>
                      <td className="py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          blog.published
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}>
                          {blog.published ? <Eye size={12} /> : <EyeOff size={12} />}
                          {blog.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => togglePublish(blog._id, blog.published)}
                            className="text-muted-foreground hover:text-foreground"
                            title={blog.published ? "Unpublish" : "Publish"}
                          >
                            {blog.published ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                          <Link
                            href={`/dashboard/blogs/${blog._id}/edit`}
                            className="text-muted-foreground hover:text-foreground"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
}