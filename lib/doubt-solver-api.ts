import { apiFetch } from './api';

/**
 * AI Doubt Solver - Context-Aware Q&A using RAG
 * Provides semantic search and context-aware answers based on course content
 */

// ============================================
// STUDENT - Ask Doubts
// ============================================

/** Ask a doubt - AI answers based on course context */
export const askDoubt = async (
  courseId: string,
  question: string,
  lessonId?: string
): Promise<any> => {
  const response = await apiFetch(`student/courses/${courseId}/ask-doubt`, {
    method: 'POST',
    body: JSON.stringify({ question, lessonId }),
  });
  if (!response.ok) throw new Error('Failed to ask doubt');
  return response.json();
};

/** Search for similar already-answered doubts */
export const searchSimilarDoubts = async (
  courseId: string,
  query: string
): Promise<any> => {
  const params = new URLSearchParams({ q: query });
  const response = await apiFetch(`student/courses/${courseId}/search-doubts?${params}`);
  if (!response.ok) throw new Error('Failed to search doubts');
  return response.json();
};

/** Get student's doubt history for a course */
export const getMyDoubts = async (courseId: string): Promise<any> => {
  const response = await apiFetch(`student/courses/${courseId}/my-doubts`);
  if (!response.ok) throw new Error('Failed to fetch doubt history');
  return response.json();
};

/** Get specific doubt with full details */
export const getDoubtDetail = async (doubtId: string): Promise<any> => {
  const response = await apiFetch(`student/doubts/${doubtId}`);
  if (!response.ok) throw new Error('Failed to fetch doubt details');
  return response.json();
};

/** Rate AI's answer (1-5 stars + helpful feedback) */
export const rateDoubtResponse = async (
  doubtId: string,
  rating: number,
  isHelpful?: boolean,
  clearedDoubt?: boolean
): Promise<any> => {
  const response = await apiFetch(`student/doubts/${doubtId}/feedback`, {
    method: 'POST',
    body: JSON.stringify({ rating, isHelpful, clearedDoubt }),
  });
  if (!response.ok) throw new Error('Failed to submit feedback');
  return response.json();
};

// ============================================
// INSTRUCTOR - Manage Doubts
// ============================================

/** Get common doubts in a course (what students ask most) */
export const getCommonDoubts = async (
  courseId: string,
  limit?: number
): Promise<any> => {
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());
  const response = await apiFetch(`instructor/courses/${courseId}/common-doubts?${params}`);
  if (!response.ok) throw new Error('Failed to fetch common doubts');
  return response.json();
};

/** Get all student doubts in a course */
export const getCourseDoubts = async (
  courseId: string,
  filters?: { status?: string; page?: number; limit?: number }
): Promise<any> => {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());
  
  const response = await apiFetch(`instructor/courses/${courseId}/doubts?${params}`);
  if (!response.ok) throw new Error('Failed to fetch course doubts');
  return response.json();
};

/** Get doubt statistics for a course */
export const getDoubtStats = async (courseId: string): Promise<any> => {
  const response = await apiFetch(`instructor/courses/${courseId}/doubt-stats`);
  if (!response.ok) throw new Error('Failed to fetch doubt statistics');
  return response.json();
};

/** Add instructor comment/response to a doubt */
export const commentOnDoubt = async (
  doubtId: string,
  comment: string
): Promise<any> => {
  const response = await apiFetch(`instructor/doubts/${doubtId}/comment`, {
    method: 'POST',
    body: JSON.stringify({ comment }),
  });
  if (!response.ok) throw new Error('Failed to add comment');
  return response.json();
};

export default {
  // Student APIs
  askDoubt,
  searchSimilarDoubts,
  getMyDoubts,
  getDoubtDetail,
  rateDoubtResponse,
  
  // Instructor APIs
  getCommonDoubts,
  getCourseDoubts,
  getDoubtStats,
  commentOnDoubt,
};
