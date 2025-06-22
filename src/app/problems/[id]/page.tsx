"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Problem {
  id: string;
  leetcodeNumber: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  solution: string;
  timeComplexity: string;
  spaceComplexity: string;
  tags: string[];
  lldQuestion: string;
  lldApproach: string;
  lldTechStack: string[];
  lldCodeExample: string;
  hldQuestion: string;
  hldApproach: string;
  hldTechStack: string[];
  hldArchitecture: string;
  systemDesignQuestion: string;
  systemDesignApproach: string;
  systemDesignDiagram: string;
  scalingConsiderations: string;
  createdAt: string;
}

export default function ProblemDetailPage() {
  const params = useParams();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("leetcode");

  useEffect(() => {
    fetchProblem();
  }, [params.id]);

  const fetchProblem = async () => {
    try {
      const response = await fetch("/api/problems");
      const data = await response.json();
      const foundProblem = data.problems?.find(
        (p: Problem) => p.id === params.id
      );
      setProblem(foundProblem || null);
    } catch (error) {
      console.error("Failed to fetch problem:", error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading problem...</div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😵</div>
          <h1 className="text-2xl font-bold text-white mb-4">
            Problem Not Found
          </h1>
          <Link
            href="/problems"
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300"
          >
            ← Back to Problems
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "leetcode", label: "Algorithm", icon: "🧮" },
    { id: "lld", label: "Frontend Design", icon: "🎨" },
    { id: "hld", label: "Backend Design", icon: "⚙️" },
    { id: "system", label: "System Design", icon: "🏗️" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/problems"
              className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
            >
              <span>←</span>
              <span>Back to Problems</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-mono text-gray-400 bg-white/10 px-3 py-1 rounded-full">
                #{problem.leetcodeNumber}
              </span>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${getDifficultyColor(
                  problem.difficulty
                )} text-black`}
              >
                {problem.difficulty.toUpperCase()}
              </span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {problem.title}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:block">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8">
          {activeTab === "leetcode" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-purple-400 mb-4">
                  🧮 Algorithm Problem
                </h2>
                <div className="bg-white/5 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Problem Description
                  </h3>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {problem.description}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Solution
                </h3>
                <div className="bg-gray-900 rounded-2xl p-6 font-mono">
                  <pre className="text-green-300 text-sm overflow-x-auto whitespace-pre-wrap">
                    {problem.solution}
                  </pre>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Time Complexity
                  </h3>
                  <p className="text-green-400 font-mono text-xl">
                    {problem.timeComplexity}
                  </p>
                </div>
                <div className="bg-white/5 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Space Complexity
                  </h3>
                  <p className="text-blue-400 font-mono text-xl">
                    {problem.spaceComplexity}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {problem.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "lld" && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-purple-400 mb-4">
                🎨 Frontend Design Application
              </h2>

              <div className="bg-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Design Challenge
                </h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {problem.lldQuestion}
                </p>
              </div>

              <div className="bg-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Approach
                </h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {problem.lldApproach}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Implementation
                </h3>
                <div className="bg-gray-900 rounded-2xl p-6 font-mono">
                  <pre className="text-green-300 text-sm overflow-x-auto whitespace-pre-wrap">
                    {problem.lldCodeExample}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {problem.lldTechStack.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "hld" && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-green-400 mb-4">
                ⚙️ Backend Design Application
              </h2>

              <div className="bg-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  System Challenge
                </h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {problem.hldQuestion}
                </p>
              </div>

              <div className="bg-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Approach
                </h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {problem.hldApproach}
                </p>
              </div>

              <div className="bg-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Architecture
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {problem.hldArchitecture}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {problem.hldTechStack.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "system" && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-orange-400 mb-4">
                🏗️ Large Scale System Design
              </h2>

              <div className="bg-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  System Design Challenge
                </h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {problem.systemDesignQuestion}
                </p>
              </div>

              <div className="bg-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Design Approach
                </h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {problem.systemDesignApproach}
                </p>
              </div>

              {problem.systemDesignDiagram && (
                <div className="bg-white/5 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    System Architecture
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {problem.systemDesignDiagram}
                  </p>
                </div>
              )}

              <div className="bg-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Scaling Considerations
                </h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {problem.scalingConsiderations}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
