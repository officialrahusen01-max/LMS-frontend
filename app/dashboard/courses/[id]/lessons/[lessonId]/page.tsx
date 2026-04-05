"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  instructorGetLesson,
  instructorUpdateLesson,
  instructorUploadVideo,
  instructorUploadImage,
  type LessonMediaItem,
} from "@/lib/instructor-api";
import { ArrowLeft, Loader2, Save, Video, ImageIcon, Trash2 } from "lucide-react";

export default function EditLessonPage() {
  const params = useParams();
  const courseId = params?.id as string;
  const lessonId = params?.lessonId as string;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [duration, setDuration] = useState(0);
  const [media, setMedia] = useState<LessonMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKind, setUploadingKind] = useState<"video" | "image" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId || !lessonId) return;
    setLoading(true);
    instructorGetLesson(courseId, lessonId)
      .then((r) => {
        const d = r.data;
        if (d) {
          setTitle(d.title ?? "");
          setContent(d.content ?? "");
          setDuration(typeof d.duration === "number" ? d.duration : 0);
          setMedia(Array.isArray(d.media) ? d.media : []);
        }
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [courseId, lessonId]);

  const persistMedia = async (next: LessonMediaItem[]) => {
    if (!courseId || !lessonId) return;
    setMedia(next);
    await instructorUpdateLesson(courseId, lessonId, { media: next });
  };

  const handleAddVideo = async (file: File | null) => {
    if (!file) return;
    setUploadingKind("video");
    setError(null);
    try {
      const res = await instructorUploadVideo(file);
      const url = res.data?.url;
      if (!url) throw new Error("No video URL returned");
      const item: LessonMediaItem = {
        type: "video",
        url,
        provider: "cloudinary",
        publicId: res.data?.publicId,
      };
      await persistMedia([...media, item]);
      setMsg("Video added — save lesson below to keep title/duration in sync.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Video upload failed");
    } finally {
      setUploadingKind(null);
    }
  };

  const handleAddImage = async (file: File | null) => {
    if (!file) return;
    setUploadingKind("image");
    setError(null);
    try {
      const res = await instructorUploadImage(file);
      const url = res.data?.url;
      if (!url) throw new Error("No image URL returned");
      const item: LessonMediaItem = {
        type: "image",
        url,
        provider: "cloudinary",
        publicId: res.data?.publicId,
      };
      await persistMedia([...media, item]);
      setMsg("Image added to lesson attachments.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Image upload failed");
    } finally {
      setUploadingKind(null);
    }
  };

  const removeMediaAt = async (index: number) => {
    const next = media.filter((_, i) => i !== index);
    try {
      await persistMedia(next);
      setMsg("Attachment removed.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not remove");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !lessonId || !title.trim()) return;
    setSaving(true);
    setMsg(null);
    setError(null);
    try {
      await instructorUpdateLesson(courseId, lessonId, {
        title: title.trim(),
        content,
        duration: Number.isFinite(duration) ? duration : 0,
        media,
      });
      setMsg("Saved.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Link
        href={`/dashboard/courses/${courseId}/edit`}
        className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
      >
        <ArrowLeft size={16} /> Back to course editor
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-card-foreground">Lesson content</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Video (student player), images, text/HTML. Student learn page uses the <strong>first video</strong> in the list
          as the main player; extra images show here for reference — use HTML <code className="text-xs">&lt;img src=&quot;…&quot;&gt;</code> in
          content if you want them in the article body.
        </p>
      </div>

      {error && !msg && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
      )}

      <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
          <Video className="h-4 w-4 text-primary" />
          Video &amp; images (Cloudinary)
        </h2>
        <p className="text-xs text-muted-foreground">
          MP4 etc. up to ~200MB (see Lib limits). Images up to 5MB. Requires CLOUDINARY_* in <code>Lib/.env</code>.
        </p>
        <div className="flex flex-wrap gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-sm hover:bg-accent">
            {uploadingKind === "video" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Video className="h-4 w-4" />}
            Add video
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              className="hidden"
              disabled={!!uploadingKind}
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                e.target.value = "";
                void handleAddVideo(f);
              }}
            />
          </label>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-sm hover:bg-accent">
            {uploadingKind === "image" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
            Add image
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              disabled={!!uploadingKind}
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                e.target.value = "";
                void handleAddImage(f);
              }}
            />
          </label>
        </div>
        {media.length > 0 && (
          <ul className="space-y-3 border-t border-border pt-4">
            {media.map((m, i) => (
              <li
                key={`${m.url}-${i}`}
                className="flex flex-wrap items-start gap-3 rounded-lg border border-border bg-muted/30 p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">{m.type}</p>
                  {m.type === "video" ? (
                    <video src={m.url} className="mt-2 max-h-48 w-full max-w-md rounded border border-border" controls playsInline />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.url} alt="" className="mt-2 max-h-40 max-w-md rounded border border-border object-contain" />
                  )}
                  <p className="mt-1 truncate text-xs text-muted-foreground">{m.url}</p>
                </div>
                <button
                  type="button"
                  onClick={() => void removeMediaAt(i)}
                  className="shrink-0 rounded p-2 text-destructive hover:bg-destructive/10"
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Lesson title *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Content (HTML — embed images/videos here too if you like)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={14}
            placeholder='<p>Text</p><img src="https://..." alt="" />'
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono"
          />
        </div>
        <div className="max-w-xs">
          <label className="text-sm font-medium text-muted-foreground">Duration (minutes)</label>
          <input
            type="number"
            min={0}
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value, 10) || 0)}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        {msg && <p className="text-sm text-emerald-600">{msg}</p>}
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save lesson
        </button>
      </form>
    </div>
  );
}
