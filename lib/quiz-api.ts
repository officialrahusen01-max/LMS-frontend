import { apiFetch } from './api';

/**
 * Quiz Integration API for LMS Frontend
 * 
 * This file provides API helpers for the auto-generated quiz system.
 */

// Type definitions
export interface Question {
  _id: string;
  type: 'mcq' | 'subjective';
  question: string;
  options?: string[];
  correctOption?: number;
  sampleAnswer?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Quiz {
  _id: string;
  lesson: string;
  course: string;
  title: string;
  description?: string;
  questions: Question[];
  totalQuestions: number;
  mcqCount: number;
  subjectiveCount: number;
  passingScore: number;
  timeLimit: number;
  allowRetake: boolean;
  showAnswers: boolean;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  isPublished: boolean;
  generatedAt?: Date;
}

export interface QuizAnswer {
  questionId: string;
  selectedOption?: number;
  studentAnswer?: string;
}

export interface QuizResult {
  quizId: string;
  scorePercentage: number;
  score: number;
  totalPoints: number;
  passed: boolean;
  passingScore: number;
  results: Array<{
    questionId: string;
    question: string;
    type: string;
    studentAnswer?: string | number;
    isCorrect: boolean;
    feedback: string;
  }>;
  showAnswers: boolean;
}

// ============================================
// INSTRUCTOR - Generate and Manage Quizzes
// ============================================

/**
 * Generate quiz automatically from lesson content
 */
export const generateQuizForLesson = async (
  courseId: string,
  lessonId: string,
  options?: { mcqCount?: number; subjectiveCount?: number; difficulty?: string }
): Promise<Quiz> => {
  const response = await apiFetch(`instructor/courses/${courseId}/lessons/${lessonId}/generate-quiz`, {
    method: 'POST',
    body: JSON.stringify({
      mcqCount: options?.mcqCount || 5,
      subjectiveCount: options?.subjectiveCount || 3,
      difficulty: options?.difficulty || 'medium',
    }),
  });

  if (!response.ok) throw new Error('Failed to generate quiz');
  const data = await response.json();
  return data.data;
};

/**
 * Get quiz by ID (instructor view - includes answers)
 */
export const getQuiz = async (quizId: string): Promise<Quiz> => {
  const response = await apiFetch(`instructor/quizzes/${quizId}`);
  if (!response.ok) throw new Error('Failed to fetch quiz');
  return response.json();
};

/**
 * Get quiz by lesson ID
 */
export const getQuizByLesson = async (courseId: string, lessonId: string): Promise<Quiz> => {
  const response = await apiFetch(`instructor/courses/${courseId}/lessons/${lessonId}/quiz`);
  if (!response.ok) throw new Error('Failed to fetch quiz');
  return response.json();
};

/**
 * Update quiz settings
 */
export const updateQuizSettings = async (
  quizId: string,
  updates: Partial<Quiz>
): Promise<Quiz> => {
  const response = await apiFetch(`instructor/quizzes/${quizId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Failed to update quiz');
  return response.json();
};

/**
 * Publish or unpublish quiz
 */
export const publishQuiz = async (quizId: string, isPublished: boolean = true): Promise<Quiz> => {
  const response = await apiFetch(`instructor/quizzes/${quizId}/publish`, {
    method: 'PATCH',
    body: JSON.stringify({ isPublished }),
  });
  if (!response.ok) throw new Error('Failed to publish quiz');
  return response.json();
};

/**
 * Regenerate quiz questions
 */
export const regenerateQuizQuestions = async (
  quizId: string,
  options?: { mcqCount?: number; subjectiveCount?: number; difficulty?: string }
): Promise<Quiz> => {
  const response = await apiFetch(`instructor/quizzes/${quizId}/regenerate`, {
    method: 'POST',
    body: JSON.stringify({
      mcqCount: options?.mcqCount,
      subjectiveCount: options?.subjectiveCount,
      difficulty: options?.difficulty,
    }),
  });
  if (!response.ok) throw new Error('Failed to regenerate questions');
  return response.json();
};

/**
 * Delete quiz
 */
export const deleteQuiz = async (quizId: string): Promise<void> => {
  const response = await apiFetch(`instructor/quizzes/${quizId}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete quiz');
};

// ============================================
// STUDENT - Take Quizzes
// ============================================

/**
 * Get quiz for taking (student view - hides correct answers)
 */
export const getQuizForTaking = async (lessonId: string): Promise<Quiz> => {
  const response = await apiFetch(`student/lessons/${lessonId}/quiz`);
  if (!response.ok) throw new Error('Failed to fetch quiz');
  const data = await response.json();
  return data.data;
};

/**
 * Submit quiz answers
 */
export const submitQuizAnswers = async (quizId: string, answers: QuizAnswer[]): Promise<QuizResult> => {
  const response = await apiFetch(`student/quizzes/${quizId}/submit`, {
    method: 'POST',
    body: JSON.stringify({ answers }),
  });
  if (!response.ok) throw new Error('Failed to submit quiz');
  const data = await response.json();
  return data.data;
};

/**
 * Get quiz results
 */
export const getQuizResults = async (quizId: string): Promise<any> => {
  const response = await apiFetch(`student/quizzes/${quizId}/results`);
  if (!response.ok) throw new Error('Failed to fetch results');
  const data = await response.json();
  return data.data;
};

export default {
  // Instructor
  generateQuizForLesson,
  getQuiz,
  getQuizByLesson,
  updateQuizSettings,
  publishQuiz,
  regenerateQuizQuestions,
  deleteQuiz,
  // Student
  getQuizForTaking,
  submitQuizAnswers,
  getQuizResults,
};
