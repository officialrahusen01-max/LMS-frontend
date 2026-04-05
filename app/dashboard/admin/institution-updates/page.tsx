"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiJson, apiFetch } from "@/lib/api";
import { ArrowLeft, Megaphone, Trash2 } from "lucide-react";

type Item = {
  _id: string;
  title: string;
  content: string;
  targetAudience: string;
  published: boolean;
  createdAt?: string;
  createdBy?: { fullName?: string; email?: string };
};

export default function AdminInstitutionUpdatesPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    targetAudience: "all",
    published: true,
  });

  const load = () => {
    setLoading(true);
    apiJson<{ data: { items: Item[]; total: number } }>("admin/institution-updates?limit=50")
      .then((r) => {
        setItems(r.data?.items ?? []);
        setTotal(r.data?.total ?? 0);
        setError(null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await apiFetch("admin/institution-updates", {
        method: "POST",
        body: JSON.stringify({
          title: form.title.trim(),
          content: form.content.trim(),
          targetAudience: form.targetAudience,
          published: form.published,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as { message?: string }).message || "Save failed");
      setForm({ title: "", content: "", targetAudience: "all", published: true });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(id: string, published: boolean) {
    const res = await apiFetch(`admin/institution-updates/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ published: !published }),
    });
    if (res.ok) load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this update?")) return;
    const res = await apiFetch(`admin/institution-updates/${id}`, { method: "DELETE" });
    if (res.ok) load();
  }

  return (
    <div className="space-y-8">
      <Link
        href="/dashboard/admin"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Dashboard
      </Link>
      <h1 className="text-xl font-semibold text-card-foreground flex items-center gap-2">
        <Megaphone className="h-6 w-6" /> Institution updates
      </h1>
      <p className="text-sm text-muted-foreground max-w-2xl">
        Messages you publish here appear to students and/or instructors on their dashboards (audience
        you select). Use for holidays, policy changes, or platform news.
      </p>

      <form
        onSubmit={handleCreate}
        className="space-y-4 rounded-lg border border-border bg-card p-6 max-w-2xl"
      >
        <h2 className="text-sm font-semibold">New update</h2>
        <div>
          <label className="block text-xs font-medium text-muted-foreground">Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            maxLength={200}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground">Message</label>
          <textarea
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            rows={5}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground">Audience</label>
            <select
              value={form.targetAudience}
              onChange={(e) => setForm((f) => ({ ...f, targetAudience: e.target.value }))}
              className="mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="all">Everyone (students + instructors)</option>
              <option value="students">Students only</option>
              <option value="instructors">Instructors only</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm mt-6">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
            />
            Published
          </label>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {saving ? "Saving…" : "Publish update"}
        </button>
      </form>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <section>
        <h2 className="text-sm font-semibold mb-3">Previous updates ({total})</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((it) => (
              <li
                key={it._id}
                className="rounded-lg border border-border bg-card p-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium text-card-foreground">{it.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {it.targetAudience} · {it.published ? "Published" : "Draft"} ·{" "}
                    {it.createdAt ? new Date(it.createdAt).toLocaleString() : ""}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap line-clamp-3">
                    {it.content}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => togglePublished(it._id, it.published)}
                    className="text-xs rounded-md border px-2 py-1 hover:bg-muted"
                  >
                    {it.published ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(it._id)}
                    className="text-xs rounded-md border border-destructive/50 text-destructive px-2 py-1 inline-flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
