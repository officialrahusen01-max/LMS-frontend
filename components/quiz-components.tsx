'use client';

import { useState, useEffect } from 'react';
import {
  generateQuizForLesson,
  getQuizForTaking,
  submitQuizAnswers,
  publishQuiz,
  getQuiz,
  type Quiz,
  type QuizAnswer,
  type QuizResult,
  type Question,
} from '@/lib/quiz-api';

/**
 * Instructor Component: Quiz Generator
 */
export const QuizGeneratorComponent = ({ courseId, lessonId }: { courseId: string; lessonId: string }) => {
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateQuiz = async () => {
    try {
      setLoading(true);
      setError(null);
      const generatedQuiz = await generateQuizForLesson(courseId, lessonId, {
        mcqCount: 5,
        subjectiveCount: 3,
        difficulty: 'medium',
      });
      setQuiz(generatedQuiz);
    } catch (err: any) {
      setError(err.message || 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishQuiz = async () => {
    if (!quiz) return;
    try {
      setLoading(true);
      setError(null);
      await publishQuiz(quiz._id, true);
      setQuiz({ ...quiz, isPublished: true });
    } catch (err: any) {
      setError(err.message || 'Failed to publish quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Quiz Generator</h2>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      
      <button 
        onClick={handleGenerateQuiz}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded enabled:hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate Quiz'}
      </button>
      
      {quiz && (
        <div className="mt-6 p-4 bg-gray-50 rounded">
          <h3 className="text-xl font-semibold mb-2">{quiz.title}</h3>
          <p className="text-sm text-gray-600 mb-2">Total Questions: {quiz.totalQuestions}</p>
          <p className="text-sm text-gray-600 mb-4">MCQ: {quiz.mcqCount}, Subjective: {quiz.subjectiveCount}</p>
          
          <button 
            onClick={handlePublishQuiz}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded enabled:hover:bg-green-600 disabled:opacity-50"
          >
            {quiz.isPublished ? 'Unpublish' : 'Publish'}
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Student Component: Quiz Taker
 */
export const QuizTakerComponent = ({ lessonId, quizId }: { lessonId: string; quizId: string }) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [results, setResults] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizData = await getQuizForTaking(lessonId);
        setQuiz(quizData);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch quiz');
      }
    };
    fetchQuiz();
  }, [lessonId]);

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;
    try {
      setLoading(true);
      setError(null);
      
      const formattedAnswers: QuizAnswer[] = quiz.questions.map((q: Question) => ({
        questionId: q._id,
        selectedOption: q.type === 'mcq' ? answers[q._id] : undefined,
        studentAnswer: q.type === 'subjective' ? answers[q._id] : undefined,
      }));

      const result = await submitQuizAnswers(quizId, formattedAnswers);
      setResults(result);
    } catch (err: any) {
      setError(err.message || 'Failed to submit quiz');
    } finally {
      setLoading(false);
    }
  };

  if (!quiz) {
    return <div className="p-6 text-center">Loading quiz...</div>;
  }

  if (results) {
    return <QuizResultsComponent results={results} />;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">{quiz.title}</h2>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <div className="space-y-6">
        {quiz.questions.map((question: Question, idx: number) => (
          <div key={question._id} className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-2">
              {idx + 1}. {question.question}
            </h4>
            <p className="text-sm text-gray-600 mb-4">Difficulty: {question.difficulty}</p>

            {question.type === 'mcq' ? (
              <div className="space-y-2">
                {question.options?.map((option: string, optIdx: number) => (
                  <label key={optIdx} className="flex items-center">
                    <input
                      type="radio"
                      name={question._id}
                      value={optIdx}
                      checked={answers[question._id] === optIdx}
                      onChange={() => handleAnswerChange(question._id, optIdx)}
                      className="mr-3"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            ) : (
              <textarea
                value={answers[question._id] || ''}
                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                placeholder="Enter your answer here..."
                className="w-full h-24 p-3 border rounded resize-none"
              />
            )}
          </div>
        ))}
      </div>

      <button 
        onClick={handleSubmitQuiz} 
        disabled={loading}
        className="mt-6 w-full px-6 py-3 bg-blue-500 text-white rounded font-semibold enabled:hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Quiz'}
      </button>
    </div>
  );
};

/**
 * Results Component: Display Quiz Results
 */
export const QuizResultsComponent = ({ results }: { results: QuizResult }) => {
  const { score, totalPoints, scorePercentage, passed, passingScore, results: detailedResults, showAnswers } = results;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Quiz Results</h2>

      <div className={`p-6 rounded-lg mb-6 ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
        <h3 className={`text-xl font-bold mb-2 ${passed ? 'text-green-700' : 'text-red-700'}`}>
          {passed ? '✓ Passed' : '✗ Failed'}
        </h3>
        <p className={`text-lg ${passed ? 'text-green-700' : 'text-red-700'}`}>
          Score: {score} / {totalPoints} ({scorePercentage.toFixed(2)}%)
        </p>
        <p className="text-sm mt-2">Required: {passingScore}%</p>
      </div>

      {showAnswers && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Detailed Results:</h3>
          {detailedResults.map((result: any, idx: number) => (
            <div 
              key={result.questionId} 
              className={`p-4 rounded-lg border ${
                result.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}
            >
              <p className="font-semibold mb-2">{idx + 1}. {result.question}</p>
              <p className="text-sm text-gray-600 mb-2">Type: {result.type}</p>
              
              {result.type === 'mcq' && (
                <p className="text-sm mb-2">Your Answer: Option {(result.studentAnswer as number) + 1}</p>
              )}
              {result.type === 'subjective' && (
                <p className="text-sm mb-2">Your Answer: {result.studentAnswer}</p>
              )}
              
              <p className={`text-sm font-semibold ${result.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {result.feedback}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default {
  QuizGeneratorComponent,
  QuizTakerComponent,
  QuizResultsComponent,
};
