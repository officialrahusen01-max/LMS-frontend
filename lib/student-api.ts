/**
 * Student APIs – Lib backend student routes se integrate.
 * Routes: /api/v1/enrollments, /api/v1/certificates (see Lib/student/routes/index.js)
 */

import { apiFetch, apiJson, getBaseUrl } from "./api";

// --- Enrollments (Lib: enrollmentRouter) ---

export type EnrollmentItem = {
  _id?: string;
  courseId?: string;
  courseTitle?: string;
  course?: { _id: string; title?: string };
  status?: string;
  enrolledAt?: string;
};

export type MyCoursesResponse = { message?: string; data?: EnrollmentItem[]; count?: number };

export async function studentMyCourses(): Promise<MyCoursesResponse> {
  return apiJson<MyCoursesResponse>("enrollments/me");
}

export async function studentGetEnrollment(courseId: string): Promise<{ message?: string; data?: EnrollmentItem | null }> {
  return apiJson<{ message?: string; data?: EnrollmentItem | null }>(`enrollments/me/courses/${courseId}`).catch(() => ({
    data: null,
  }));
}

export async function studentEnroll(courseId: string): Promise<void> {
  const res = await apiFetch(`enrollments/courses/${courseId}/enroll`, { method: "POST" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message || "Enroll failed");
}

export async function studentCancelEnrollment(courseId: string): Promise<void> {
  await apiFetch(`enrollments/me/courses/${courseId}`, { method: "DELETE" });
}

// --- Progress (Lib: enrollmentRouter) ---

export type LessonProgressItem = { lesson: string | { _id: string }; completed?: boolean };
export type ProgressData = {
  percentComplete?: number;
  lessonsCompleted?: number;
  totalLessons?: number;
  completedLessons?: string[];
  lessons?: LessonProgressItem[];
};

export async function studentGetProgress(courseId: string): Promise<ProgressData | null> {
  const res = await apiJson<{ data?: ProgressData }>(`enrollments/courses/${courseId}/progress`);
  return res?.data ?? null;
}

export async function studentCompleteLesson(
  courseId: string,
  lessonId: string,
  opts?: { secondsWatched?: number; lastPosition?: number }
): Promise<void> {
  await apiFetch(`enrollments/courses/${courseId}/lessons/${lessonId}/complete`, {
    method: "PUT",
    body: JSON.stringify(opts ?? { secondsWatched: 0 }),
  });
}

export async function studentGetCompletedLessons(courseId: string): Promise<string[]> {
  const res = await apiJson<{ data?: string[] }>(`enrollments/courses/${courseId}/progress/completed-lessons`);
  return res?.data ?? [];
}

export type AllProgressItem = {
  course?: { title?: string };
  percentComplete?: number;
  lessonsCompleted?: number;
  totalLessons?: number;
};
export type AllProgressResponse = { message?: string; data?: AllProgressItem[]; count?: number };

export async function studentGetAllProgress(): Promise<AllProgressResponse> {
  return apiJson<AllProgressResponse>("enrollments/me/progress");
}

// --- Certificates (Lib: certificateRouter) ---

export type CertificateItem = {
  _id: string;
  certificateId?: string;
  course?: { title?: string };
  courseTitle?: string;
  issuedAt?: string;
  verificationHash?: string;
};

export type MyCertificatesResponse = { message?: string; data?: CertificateItem[]; count?: number };

export async function studentMyCertificates(): Promise<MyCertificatesResponse> {
  return apiJson<MyCertificatesResponse>("certificates/me");
}

export async function studentGetCertificate(certificateId: string): Promise<{ data?: CertificateItem }> {
  return apiJson<{ data?: CertificateItem }>(`certificates/${certificateId}`);
}

/** Public – no auth. Verify certificate by hash. */
export async function studentVerifyCertificate(hash: string): Promise<{
  data?: { valid?: boolean; studentName?: string; course?: string; issuedAt?: string; certificateId?: string };
}> {
  const r = await fetch(`${getBaseUrl()}/certificates/verify/${hash}`);
  return r.json();
}

// --- Public blogs (Lib: GET /v1/blogs, GET /v1/blogs/slug/:slug) — published only ---

export type PublicBlogItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  tags?: string[];
  categories?: string[];
  featuredImage?: string;
  publishedAt?: string;
  createdAt?: string;
  author?: { fullName?: string; publicUsername?: string; avatarUrl?: string };
};

export type PublicBlogsListResponse = {
  message?: string;
  data?: PublicBlogItem[];
  pagination?: { currentPage: number; pages: number; total: number };
};

export async function studentListPublishedBlogs(params?: {
  page?: number;
  limit?: number;
}): Promise<PublicBlogsListResponse> {
  const sp = new URLSearchParams();
  if (params?.page != null) sp.set("page", String(params.page));
  if (params?.limit != null) sp.set("limit", String(params.limit));
  const q = sp.toString();
  return apiJson<PublicBlogsListResponse>(q ? `blogs?${q}` : "blogs");
}

export async function studentGetBlogBySlug(slug: string): Promise<{ message?: string; data?: PublicBlogItem }> {
  return apiJson<{ message?: string; data?: PublicBlogItem }>(`blogs/slug/${encodeURIComponent(slug)}`);
}
