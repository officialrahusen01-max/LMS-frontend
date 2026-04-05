/**
 * Instructor APIs – Lib backend instructor routes se integrate.
 * Routes: /api/v1/courses, lessons, blogs, comments, upload, ai (Lib/instructor/routes/index.js)
 */

import { apiFetch, apiJson } from "./api";

// ========== COURSES ==========

export type CourseItem = {
  _id: string;
  title: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  level?: string;
  category?: string;
  categories?: string[];
  tags?: string[];
  published?: boolean;
  primaryInstructor?: string;
  instructors?: { user: string; role?: string }[];
  lessonCount?: number;
  enrollmentCount?: number;
  thumbnailUrl?: string;
  coverUrl?: string;
  updatedAt?: string;
};

export type CourseListResponse = {
  success?: boolean;
  data?: CourseItem[];
  pagination?: { page: number; limit: number; total: number; pages: number };
};

export async function instructorListCourses(params?: {
  page?: number;
  limit?: number;
  category?: string;
  level?: string;
  tags?: string;
  search?: string;
}): Promise<CourseListResponse> {
  const sp = new URLSearchParams();
  if (params?.page != null) sp.set("page", String(params.page));
  if (params?.limit != null) sp.set("limit", String(params.limit));
  if (params?.category) sp.set("category", params.category);
  if (params?.level) sp.set("level", params.level);
  if (params?.tags) sp.set("tags", params.tags);
  if (params?.search) sp.set("search", params.search);
  const q = sp.toString();
  return apiJson<CourseListResponse>(q ? `courses?${q}` : "courses");
}

/** Courses you teach (draft + published), with lesson & enrollment counts. */
export async function instructorListMyTeachingCourses(params?: { page?: number; limit?: number }): Promise<CourseListResponse> {
  const sp = new URLSearchParams();
  if (params?.page != null) sp.set("page", String(params.page));
  if (params?.limit != null) sp.set("limit", String(params.limit));
  const q = sp.toString();
  return apiJson<CourseListResponse>(q ? `courses/mine?${q}` : "courses/mine");
}

export async function instructorGetCourse(id: string): Promise<{ success?: boolean; data?: CourseItem }> {
  return apiJson<{ success?: boolean; data?: CourseItem }>(`courses/${id}`);
}

export async function instructorCreateCourse(body: {
  title: string;
  shortDescription?: string;
  description?: string;
  category?: string;
  categories?: string[];
  level?: string;
  tags?: string[];
  pricingType?: string;
  price?: number;
  pricing?: { type?: string; price?: number };
}): Promise<{ success?: boolean; data?: CourseItem; message?: string }> {
  const res = await apiFetch("courses", {
    method: "POST",
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message || "Create failed");
  return data as { success?: boolean; data?: CourseItem; message?: string };
}

export async function instructorUpdateCourse(
  id: string,
  body: Partial<{
    title: string;
    shortDescription: string;
    description: string;
    category: string;
    categories: string[];
    level: string;
    tags: string[];
    thumbnailUrl: string;
    coverUrl: string;
  }>
): Promise<{ success?: boolean; data?: CourseItem; message?: string }> {
  const res = await apiFetch(`courses/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message || "Update failed");
  return data as { success?: boolean; data?: CourseItem; message?: string };
}

export async function instructorDeleteCourse(id: string): Promise<void> {
  const res = await apiFetch(`courses/${id}`, { method: "DELETE" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message || "Delete failed");
}

export async function instructorPublishCourse(id: string): Promise<{ success?: boolean; data?: CourseItem; message?: string }> {
  return apiJson<{ success?: boolean; data?: CourseItem; message?: string }>(`courses/${id}/publish`, { method: "POST" });
}

export async function instructorUnpublishCourse(id: string): Promise<{ success?: boolean; data?: CourseItem; message?: string }> {
  return apiJson<{ success?: boolean; data?: CourseItem; message?: string }>(`courses/${id}/unpublish`, { method: "POST" });
}

export async function instructorAddInstructor(courseId: string, instructorId: string, role = "contributor"): Promise<{ success?: boolean; data?: CourseItem }> {
  return apiJson<{ success?: boolean; data?: CourseItem }>(`courses/${courseId}/instructors`, {
    method: "POST",
    body: JSON.stringify({ instructorId, role }),
  });
}

export async function instructorRemoveInstructor(courseId: string, instructorId: string): Promise<void> {
  const res = await apiFetch(`courses/${courseId}/instructors/${instructorId}`, { method: "DELETE" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { message?: string }).message || "Remove failed");
  }
}

// ========== LESSONS ==========

export type LessonMediaItem = {
  type: "video" | "image" | "audio" | "document";
  url: string;
  provider?: string;
  publicId?: string;
};

export type LessonItem = {
  _id: string;
  title: string;
  slug?: string;
  type?: string;
  content?: string;
  videoUrl?: string;
  order?: number;
  duration?: number;
  media?: LessonMediaItem[];
};

export async function instructorListLessons(courseId: string): Promise<{ success?: boolean; data?: LessonItem[]; count?: number }> {
  return apiJson<{ success?: boolean; data?: LessonItem[]; count?: number }>(`courses/${courseId}/lessons`);
}

export async function instructorGetLesson(courseId: string, lessonId: string): Promise<{ success?: boolean; data?: LessonItem }> {
  return apiJson<{ success?: boolean; data?: LessonItem }>(`courses/${courseId}/lessons/${lessonId}`);
}

export async function instructorCreateLesson(
  courseId: string,
  body: { title: string; type?: string; content?: string; videoUrl?: string; order?: number; duration?: number }
): Promise<{ success?: boolean; data?: LessonItem; message?: string }> {
  const res = await apiFetch(`courses/${courseId}/lessons`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message || "Create lesson failed");
  return data as { success?: boolean; data?: LessonItem; message?: string };
}

export async function instructorUpdateLesson(
  courseId: string,
  lessonId: string,
  body: Partial<{
    title: string;
    type: string;
    content: string;
    videoUrl: string;
    order: number;
    duration: number;
    media: LessonMediaItem[];
  }>
): Promise<{ success?: boolean; data?: LessonItem; message?: string }> {
  const res = await apiFetch(`courses/${courseId}/lessons/${lessonId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message || "Update lesson failed");
  return data as { success?: boolean; data?: LessonItem; message?: string };
}

export async function instructorDeleteLesson(courseId: string, lessonId: string): Promise<void> {
  const res = await apiFetch(`courses/${courseId}/lessons/${lessonId}`, { method: "DELETE" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { message?: string }).message || "Delete lesson failed");
  }
}

export async function instructorReorderLessons(courseId: string, lessonIds: string[]): Promise<void> {
  const res = await apiFetch(`courses/${courseId}/lessons/reorder`, {
    method: "POST",
    body: JSON.stringify({ lessonIds }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { message?: string }).message || "Reorder failed");
  }
}

// ========== BLOGS ==========

export type BlogItem = {
  _id: string;
  title: string;
  slug?: string;
  content?: string;
  tags?: string[];
  isPublished?: boolean;
  publishedAt?: string;
  createdAt?: string;
  author?: string;
};

export async function instructorListBlogs(params?: { page?: number; limit?: number; tags?: string; search?: string }): Promise<{
  message?: string;
  data?: BlogItem[];
  pagination?: { currentPage: number; pages: number; total: number };
}> {
  const sp = new URLSearchParams();
  if (params?.page != null) sp.set("page", String(params.page));
  if (params?.limit != null) sp.set("limit", String(params.limit));
  if (params?.tags) sp.set("tags", params.tags);
  if (params?.search) sp.set("search", params.search);
  const q = sp.toString();
  return apiJson(q ? `blogs?${q}` : "blogs");
}

export async function instructorGetBlogBySlug(slug: string): Promise<{ message?: string; data?: BlogItem }> {
  return apiJson<{ message?: string; data?: BlogItem }>(`blogs/slug/${encodeURIComponent(slug)}`);
}

export async function instructorGetMyBlogs(params?: { page?: number; limit?: number }): Promise<{
  message?: string;
  data?: BlogItem[];
  pagination?: { currentPage: number; pages: number; total: number };
}> {
  const sp = new URLSearchParams();
  if (params?.page != null) sp.set("page", String(params.page));
  if (params?.limit != null) sp.set("limit", String(params.limit));
  const q = sp.toString();
  return apiJson<{ message?: string; data?: BlogItem[]; pagination?: { currentPage: number; pages: number; total: number } }>(
    q ? `blogs/me/articles?${q}` : "blogs/me/articles"
  );
}

export async function instructorGetBlog(id: string): Promise<{ message?: string; data?: BlogItem }> {
  return apiJson<{ message?: string; data?: BlogItem }>(`blogs/${id}`);
}

export async function instructorCreateBlog(body: { title: string; content?: string; tags?: string[] }): Promise<{ message?: string; data?: BlogItem }> {
  const res = await apiFetch("blogs", {
    method: "POST",
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message || "Create blog failed");
  return data as { message?: string; data?: BlogItem };
}

export async function instructorUpdateBlog(
  id: string,
  body: { title?: string; content?: string; tags?: string[] }
): Promise<{ message?: string; data?: BlogItem }> {
  const res = await apiFetch(`blogs/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message || "Update blog failed");
  return data as { message?: string; data?: BlogItem };
}

export async function instructorDeleteBlog(id: string): Promise<void> {
  const res = await apiFetch(`blogs/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { message?: string }).message || "Delete blog failed");
  }
}

export async function instructorPublishBlog(id: string): Promise<{ message?: string; data?: BlogItem }> {
  return apiJson<{ message?: string; data?: BlogItem }>(`blogs/${id}/publish`, { method: "POST" });
}

export async function instructorUnpublishBlog(id: string): Promise<{ message?: string; data?: BlogItem }> {
  return apiJson<{ message?: string; data?: BlogItem }>(`blogs/${id}/unpublish`, { method: "POST" });
}

export async function instructorLikeBlog(id: string): Promise<{ message?: string; data?: BlogItem }> {
  return apiJson<{ message?: string; data?: BlogItem }>(`blogs/${id}/like`, { method: "POST" });
}

// ========== COMMENTS ==========

export type CommentItem = { _id: string; content: string; author?: string; likes?: number; createdAt?: string };

export async function instructorListComments(blogId: string, params?: { page?: number; limit?: number }): Promise<{
  message?: string;
  data?: CommentItem[];
  pagination?: { currentPage: number; pages: number; total: number };
}> {
  const sp = new URLSearchParams();
  if (params?.page != null) sp.set("page", String(params.page));
  if (params?.limit != null) sp.set("limit", String(params.limit));
  const q = sp.toString();
  return apiJson(q ? `blogs/${blogId}/comments?${q}` : `blogs/${blogId}/comments`);
}

export async function instructorAddComment(blogId: string, content: string, parentCommentId?: string): Promise<{ message?: string; data?: CommentItem }> {
  const res = await apiFetch(`blogs/${blogId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content, parentCommentId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message || "Add comment failed");
  return data as { message?: string; data?: CommentItem };
}

export async function instructorLikeComment(commentId: string): Promise<{ message?: string; data?: CommentItem }> {
  return apiJson<{ message?: string; data?: CommentItem }>(`blogs/comments/${commentId}/like`, { method: "POST" });
}

export async function instructorDeleteComment(commentId: string): Promise<void> {
  const res = await apiFetch(`blogs/comments/${commentId}`, { method: "DELETE" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { message?: string }).message || "Delete comment failed");
  }
}

// ========== UPLOAD ==========

export type UploadResult = { url?: string; key?: string; publicUrl?: string; publicId?: string };

export async function instructorUploadImage(file: File): Promise<{ message?: string; data?: UploadResult }> {
  const form = new FormData();
  form.append("file", file);
  const res = await apiFetch("upload/image", { method: "POST", body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message || "Image upload failed");
  return data as { message?: string; data?: UploadResult };
}

export async function instructorUploadVideo(file: File): Promise<{ message?: string; data?: UploadResult }> {
  const form = new FormData();
  form.append("file", file);
  const res = await apiFetch("upload/video", { method: "POST", body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message || "Video upload failed");
  return data as { message?: string; data?: UploadResult };
}

export async function instructorUploadDocument(file: File): Promise<{ message?: string; data?: UploadResult }> {
  const form = new FormData();
  form.append("file", file);
  const res = await apiFetch("upload/document", { method: "POST", body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message || "Document upload failed");
  return data as { message?: string; data?: UploadResult };
}

// ========== AI ==========

export async function instructorAskQuestion(question: string, courseId?: string): Promise<{ message?: string; data?: { answer?: string } }> {
  const res = await apiFetch("ai/ask", {
    method: "POST",
    body: JSON.stringify({ question, courseId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message || "Ask failed");
  return data as { message?: string; data?: { answer?: string } };
}

export async function instructorIndexCourse(courseId: string): Promise<{ message?: string; data?: unknown }> {
  return apiJson<{ message?: string; data?: unknown }>(`ai/index/courses/${courseId}`, { method: "POST" });
}

export async function instructorGenerateCourseEmbedding(courseId: string): Promise<{ message?: string; data?: unknown }> {
  return apiJson<{ message?: string; data?: unknown }>(`ai/embeddings/course/${courseId}`, { method: "POST" });
}

export async function instructorGenerateLessonEmbedding(lessonId: string): Promise<{ message?: string; data?: unknown }> {
  return apiJson<{ message?: string; data?: unknown }>(`ai/embeddings/lesson/${lessonId}`, { method: "POST" });
}

export async function instructorGenerateBlogEmbedding(blogId: string): Promise<{ message?: string; data?: unknown }> {
  return apiJson<{ message?: string; data?: unknown }>(`ai/embeddings/blog/${blogId}`, { method: "POST" });
}
