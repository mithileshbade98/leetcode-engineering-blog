"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Problem {
  id: string;
  leetcodeNumber: number;
  title: string;
  difficulty: string;
  description: string;
  solution: string;
}

interface ReviewData {
  problemId: string;
  lastReviewed: string;
  nextReview: string;
  interval: number;
  repetitions: number;
  easeFactor: number;
}

export default function AnkiReviewPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [dueReviews, setDueReviews] = useState<ReviewData[]>([]);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDueReviews();
  }, []);

  const fetchDueReviews = async () => {
    try {
      // Fetch all problems
      const problemsRes = await fetch("/api/problems");
      const problemsData = await problemsRes.json();
      setProblems(problemsData.problems || []);

      // Fetch reviews
      const reviewsRes = await fetch("/api/reviews");
      const reviewsData = await reviewsRes.json();
      setDueReviews(reviewsData.dueReviews || []);

      // Set first due problem
      if (
        reviewsData.dueReviews?.length > 0 &&
        problemsData.problems?.length > 0
      ) {
        const firstDueProblem = problemsData.problems.find(
          (p: Problem) => p.id === reviewsData.dueReviews[0].problemId
        );
        setCurrentProblem(firstDueProblem || null);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (quality: 0 | 1 | 2 | 3 | 4 | 5) => {
    if (!currentProblem) return;

    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: currentProblem.id,
          quality,
        }),
      });

      // Move to next problem
      const remainingReviews = dueReviews.filter(
        (r) => r.problemId !== currentProblem.id
      );
      setDueReviews(remainingReviews);

      if (remainingReviews.length > 0) {
        const nextProblem = problems.find(
          (p) => p.id === remainingReviews[0].problemId
        );
        setCurrentProblem(nextProblem || null);
        setShowAnswer(false);
      } else {
        setCurrentProblem(null);
      }
    } catch (error) {
      console.error("Failed to save review:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading reviews...</div>
      </div>
    );
  }

  if (!currentProblem) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-white mb-4">All caught up!</h1>
          <p className="text-gray-400 mb-8">
            No problems due for review right now.
          </p>
          <Link
            href="/problems"
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300"
          >
            Browse Problems
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Anki Review Mode
              </h1>
              <p className="text-gray-400 mt-2">
                {dueReviews.length} problems due for review
              </p>
            </div>
            <Link
              href="/"
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all duration-300"
            >
              Exit Review
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-500"
              style={{
                width: `${
                  ((problems.length - dueReviews.length) / problems.length) *
                  100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Problem Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-mono text-gray-400">
                #{currentProblem.leetcodeNumber}
              </span>
              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  currentProblem.difficulty === "Easy"
                    ? "bg-green-500/20 text-green-300"
                    : currentProblem.difficulty === "Medium"
                    ? "bg-yellow-500/20 text-yellow-300"
                    : "bg-red-500/20 text-red-300"
                }`}
              >
                {currentProblem.difficulty}
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-4">{currentProblem.title}</h2>
            <p className="text-gray-300 leading-relaxed">
              {currentProblem.description}
            </p>
          </div>

          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:scale-105 transition-all duration-300"
            >
              Show Solution
            </button>
          ) : (
            <div>
              <div className="bg-gray-900 rounded-2xl p-6 mb-6 font-mono">
                <pre className="text-green-300 text-sm overflow-x-auto whitespace-pre-wrap">
                  {currentProblem.solution}
                </pre>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center mb-4">
                  How difficult was this?
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  <button
                    onClick={() => handleReview(1)}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-300 py-3 rounded-xl transition-all duration-300"
                  >
                    Again
                  </button>
                  <button
                    onClick={() => handleReview(2)}
                    className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 py-3 rounded-xl transition-all duration-300"
                  >
                    Hard
                  </button>
                  <button
                    onClick={() => handleReview(4)}
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 py-3 rounded-xl transition-all duration-300"
                  >
                    Good
                  </button>
                  <button
                    onClick={() => handleReview(5)}
                    className="bg-green-500/20 hover:bg-green-500/30 text-green-300 py-3 rounded-xl transition-all duration-300"
                  >
                    Easy
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
