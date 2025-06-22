"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Problem {
  id: string;
  leetcodeNumber: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  tags: string[];
  createdAt: string;
}

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"All" | "Easy" | "Medium" | "Hard">(
    "All"
  );

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const response = await fetch("/api/problems");
      const data = await response.json();
      setProblems(data.problems || []);
    } catch (error) {
      console.error("Failed to fetch problems:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProblems = problems.filter(
    (problem) => filter === "All" || problem.difficulty === filter
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "from-green-400 to-emerald-400";
      case "Medium":
        return "from-yellow-400 to-orange-400";
      case "Hard":
        return "from-red-400 to-pink-400";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "Medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "Hard":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading problems...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                LeetCode → Engineering
              </h1>
              <p className="text-gray-400 mt-2">
                {problems.length} problems bridging algorithms to real systems
              </p>
            </div>
            <Link
              href="/"
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all duration-300"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          {["All", "Easy", "Medium", "Hard"].map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => setFilter(difficulty as any)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                filter === difficulty
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  : "bg-white/10 text-gray-400 hover:text-white hover:bg-white/20"
              }`}
            >
              {difficulty}
              {difficulty !== "All" && (
                <span className="ml-2 text-xs opacity-70">
                  ({problems.filter((p) => p.difficulty === difficulty).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Problems Grid */}
        {filteredProblems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🤔</div>
            <h2 className="text-2xl font-bold text-gray-400 mb-2">
              No problems found
            </h2>
            <p className="text-gray-500">
              {filter !== "All"
                ? `No ${filter} problems available yet.`
                : "Start by creating your first problem in the admin dashboard."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProblems.map((problem, index) => (
              <Link
                key={problem.id}
                href={`/problems/${problem.id}`}
                className="group"
              >
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 transition-all duration-500 hover:scale-105 hover:bg-white/10 hover:border-white/20 h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-mono text-gray-400 bg-white/10 px-3 py-1 rounded-full">
                      #{problem.leetcodeNumber}
                    </span>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full border ${getDifficultyBg(
                        problem.difficulty
                      )}`}
                    >
                      {problem.difficulty.toUpperCase()}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:bg-gradient-to-r group-hover:from-purple-200 group-hover:to-blue-200 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {problem.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                    {problem.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {problem.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {problem.tags.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{problem.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Read More */}
                  <div className="flex items-center text-sm text-purple-400 group-hover:text-purple-300 transition-colors">
                    <span>Read Full Analysis</span>
                    <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
