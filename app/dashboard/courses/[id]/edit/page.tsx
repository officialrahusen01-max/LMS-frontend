"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  instructorGetCourse,
  instructorListLessons,
  instructorCreateLesson,
  instructorDeleteLesson,
  instructorPublishCourse,
  instructorUnpublishCourse,
  instructorUpdateCourse,
  instructorReorderLessons,
  instructorUploadImage,
} from "@/lib/instructor-api";
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  Send,
  EyeOff,
  Info,
  Pencil,
  ChevronUp,
  ChevronDown,
  Save,
  Loader2,
  ImageIcon,
} from "lucide-react";

type Course = {
  _id: string;
  title: string;
  shortDescription?: string;
  description?: string;
  level?: string;
  tags?: string[];
  categories?: string[];
  published?: boolean;
  thumbnailUrl?: string;
  coverUrl?: string;
};

type Lesson = {
  _id: string;
  title: string;
  order?: number;
};

export default function EditCoursePage() {
  const params = useParams();
  const id = params?.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [adding, setAdding] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [savingMeta, setSavingMeta] = useState(false);
  const [saveMetaMsg, setSaveMetaMsg] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);
  const [uploadingVisual, setUploadingVisual] = useState<"cover" | "thumbnail" | null>(null);
  const [visualMsg, setVisualMsg] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("beginner");
  const [tagsStr, setTagsStr] = useState("");
  const [categoriesStr, setCategoriesStr] = useState("");

  const load = () => {
    if (!id) return;
    Promise.all([
      instructorGetCourse(id).then((r) => r.data ?? null),
      instructorListLessons(id).then((r) => r.data ?? []),
    ])
      .then(([c, l]) => {
        setCourse(c ?? null);
        setLessons(l ?? []);
        if (c) {
          setTitle(c.title ?? "");
          setShortDescription(c.shortDescription ?? "");
          setDescription(c.description ?? "");
          setLevel(c.level ?? "beginner");
          setTagsStr((c.tags ?? []).join(", "));
          setCategoriesStr((c.categories ?? []).join(", "));
        }
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    load();
  }, [id]);

  const handleSaveMeta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !title.trim() || !shortDescription.trim()) return;
    setSavingMeta(true);
    setSaveMetaMsg(null);
    try {
      await instructorUpdateCourse(id, {
        title: title.trim(),
        shortDescription: shortDescription.trim(),
        description: description.trim(),
        level,
        tags: tagsStr
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        categories: categoriesStr
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });
      setSaveMetaMsg("Saved.");
      load();
    } catch (e) {
      setSaveMetaMsg(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSavingMeta(false);
    }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle.trim() || adding) return;
    setAdding(true);
    try {
      await instructorCreateLesson(id, { title: newLessonTitle.trim(), order: lessons.length });
      setNewLessonTitle("");
      load();
    } catch {
      // ignore
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm("Delete this lesson?")) return;
    try {
      await instructorDeleteLesson(id, lessonId);
      load();
    } catch {
      // ignore
    }
  };

  const moveLesson = async (index: number, dir: -1 | 1) => {
    const j = index + dir;
    if (j < 0 || j >= lessons.length || reordering) return;
    setReordering(true);
    try {
      const next = [...lessons];
      [next[index], next[j]] = [next[j], next[index]];
      const ids = next.map((l) => l._id);
      await instructorReorderLessons(id, ids);
      setLessons(next);
    } catch {
      load();
    } finally {
      setReordering(false);
    }
  };

  const handleCourseImageUpload = async (field: "coverUrl" | "thumbnailUrl", file: File | null) => {
    if (!id || !file) return;
    setVisualMsg(null);
    setUploadingVisual(field === "coverUrl" ? "cover" : "thumbnail");
    try {
      const res = await instructorUploadImage(file);
      const url = res.data?.url;
      if (!url) throw new Error("Upload returned no URL");
      await instructorUpdateCourse(id, { [field]: url });
      setVisualMsg(field === "coverUrl" ? "Banner updated." : "Thumbnail updated.");
      load();
    } catch (e) {
      setVisualMsg(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploadingVisual(null);
    }
  };

  const handlePublish = async (publish: boolean) => {
    setPublishError(null);
    setPublishing(true);
    try {
      if (publish) await instructorPublishCourse(id);
      else await instructorUnpublishCourse(id);
      setCourse((c) => (c ? { ...c, published: publish } : null));
    } catch (e) {
      setPublishError(e instanceof Error ? e.message : "Publish failed");
    } finally {
      setPublishing(false);
    }
  };

  if (loading && !course) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="space-y-4">
        <Link href={`/dashboard/courses/${id}`} className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
          <ArrowLeft size={16} /> Back
        </Link>
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link href={`/dashboard/courses/${id}`} className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
            <ArrowLeft size={16} /> Back to course
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-card-foreground">Edit course</h1>
          <p className="text-sm text-muted-foreground mt-1">{course?.title}</p>
        </div>
        <button
          type="button"
          onClick={() => handlePublish(!course?.published)}
          disabled={publishing || (!course?.published && lessons.length === 0)}
          title={
            !course?.published && lessons.length === 0
              ? "Add at least one lesson, then publish."
              : undefined
          }
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm font-medium hover:bg-accent disabled:opacity-50"
        >
          {course?.published ? <EyeOff size={18} /> : <Send size={18} />}
          {course?.published ? "Unpublish" : "Publish to catalog"}
        </button>
      </div>

      {!course?.published && (
        <div className="flex gap-3 rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-sm text-card-foreground">
          <Info className="h-5 w-5 shrink-0 text-sky-600 dark:text-sky-400" />
          <div>
            <p className="font-medium">Draft — students ko sirf publish ke baad dikhega</p>
            <p className="mt-1 text-muted-foreground">
              Lessons add karein, content bharein, phir publish karein.
            </p>
          </div>
        </div>
      )}

      {publishError && (
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {publishError}
        </div>
      )}

      <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-base font-semibold text-card-foreground mb-4">Course details</h2>
        <form onSubmit={handleSaveMeta} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Short description *</label>
            <input
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Full description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Categories (comma-separated)</label>
              <input
                value={categoriesStr}
                onChange={(e) => setCategoriesStr(e.target.value)}
                placeholder="Web, React"
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Tags (comma-separated)</label>
            <input
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          {saveMetaMsg && (
            <p className={`text-sm ${saveMetaMsg === "Saved." ? "text-emerald-600" : "text-destructive"}`}>{saveMetaMsg}</p>
          )}
          <button
            type="submit"
            disabled={savingMeta}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {savingMeta ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save details
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-base font-semibold text-card-foreground mb-1 flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-primary" />
          Banner & thumbnail
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          <strong>Cover (banner)</strong> — wide image; course page / headers.{" "}
          <strong>Thumbnail</strong> — square-ish; course cards &amp; lists. Cloudinary required (
          <code className="text-xs">Lib/.env</code>).
        </p>
        {visualMsg && (
          <p className={`mb-3 text-sm ${visualMsg.endsWith(".") && !visualMsg.includes("fail") ? "text-emerald-600" : "text-destructive"}`}>
            {visualMsg}
          </p>
        )}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Course banner (cover)</label>
            <div className="relative aspect-[21/9] overflow-hidden rounded-lg border border-border bg-muted">
              {course?.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={course.coverUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">No banner</div>
              )}
            </div>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              disabled={!!uploadingVisual}
              className="block w-full text-xs text-muted-foreground file:mr-2 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary-foreground"
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                void handleCourseImageUpload("coverUrl", f ?? null);
              }}
            />
            {uploadingVisual === "cover" && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Thumbnail (card image)</label>
            <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-muted">
              {course?.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={course.thumbnailUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">No thumbnail</div>
              )}
            </div>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              disabled={!!uploadingVisual}
              className="block w-full text-xs text-muted-foreground file:mr-2 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary-foreground"
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                void handleCourseImageUpload("thumbnailUrl", f ?? null);
              }}
            />
            {uploadingVisual === "thumbnail" && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-base font-semibold text-card-foreground mb-4">Lessons</h2>
        <form onSubmit={handleAddLesson} className="mb-4 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={newLessonTitle}
            onChange={(e) => setNewLessonTitle(e.target.value)}
            placeholder="New lesson title"
            className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={adding || !newLessonTitle.trim()}
            className="inline-flex items-center justify-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            <Plus size={16} /> Add lesson
          </button>
        </form>
        <ul className="space-y-2">
          {lessons.map((l, index) => (
            <li
              key={l._id}
              className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2"
            >
              <GripVertical size={16} className="text-muted-foreground shrink-0" />
              <span className="flex-1 min-w-[8rem] text-sm font-medium text-card-foreground">{l.title}</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={reordering || index === 0}
                  onClick={() => moveLesson(index, -1)}
                  className="rounded p-1.5 text-muted-foreground hover:bg-background disabled:opacity-30"
                  aria-label="Move up"
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  type="button"
                  disabled={reordering || index === lessons.length - 1}
                  onClick={() => moveLesson(index, 1)}
                  className="rounded p-1.5 text-muted-foreground hover:bg-background disabled:opacity-30"
                  aria-label="Move down"
                >
                  <ChevronDown size={16} />
                </button>
              </div>
              <Link
                href={`/dashboard/courses/${id}/lessons/${l._id}`}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium hover:bg-background"
              >
                <Pencil size={14} /> Content
              </Link>
              <button
                type="button"
                onClick={() => handleDeleteLesson(l._id)}
                className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                aria-label="Delete lesson"
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
        {lessons.length === 0 && <p className="text-sm text-muted-foreground">No lessons yet — add one to unlock publish.</p>}
      </section>
    </div>
  );
}
