"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface ProblemData {
  // LeetCode Details
  leetcodeNumber: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  solution: string;
  timeComplexity: string;
  spaceComplexity: string;
  tags: string[];
  leetcodeUrl: string; // New field for LeetCode URL

  // LLD (Low Level Design)
  lldQuestion: string;
  lldApproach: string;
  lldTechStack: string[];
  lldCodeExample: string;

  // HLD (High Level Design)
  hldQuestion: string;
  hldApproach: string;
  hldTechStack: string[];
  hldArchitecture: string;

  // System Design
  systemDesignQuestion: string;
  systemDesignApproach: string;
  systemDesignDiagram: string;
  scalingConsiderations: string;
}

export default function AdminDashboard() {
  const [formData, setFormData] = useState<ProblemData>({
    leetcodeNumber: 0,
    title: "",
    difficulty: "Easy",
    description: "",
    solution: "",
    timeComplexity: "",
    spaceComplexity: "",
    tags: [],
    leetcodeUrl: "", // Initialize new field
    lldQuestion: "",
    lldApproach: "",
    lldTechStack: [],
    lldCodeExample: "",
    hldQuestion: "",
    hldApproach: "",
    hldTechStack: [],
    hldArchitecture: "",
    systemDesignQuestion: "",
    systemDesignApproach: "",
    systemDesignDiagram: "",
    scalingConsiderations: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTab, setCurrentTab] = useState("leetcode");
  const [autoCommit, setAutoCommit] = useState(true); // Toggle for auto-commit

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/problems/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();

        // Show success message
        alert("Problem saved successfully!");

        // Auto-commit to GitHub if enabled
        if (autoCommit) {
          try {
            const githubResponse = await fetch("/api/github/commit", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ problemData: formData }),
            });

            if (githubResponse.ok) {
              console.log("✅ Committed to GitHub successfully!");
              alert("Problem saved and committed to GitHub!");
            } else {
              console.error(
                "⚠️ GitHub commit failed, but problem was saved locally"
              );
            }
          } catch (error) {
            console.error("GitHub commit error:", error);
            alert(
              "Problem saved locally, but GitHub commit failed. Check console for details."
            );
          }
        }

        // Create initial review entry for Anki system
        try {
          await fetch("/api/reviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              problemId: result.problemId,
              quality: 0, // Initial review
            }),
          });
        } catch (error) {
          console.error("Failed to create review entry:", error);
        }

        // Reset form
        setFormData({
          leetcodeNumber: 0,
          title: "",
          difficulty: "Easy",
          description: "",
          solution: "",
          timeComplexity: "",
          spaceComplexity: "",
          tags: [],
          leetcodeUrl: "",
          lldQuestion: "",
          lldApproach: "",
          lldTechStack: [],
          lldCodeExample: "",
          hldQuestion: "",
          hldApproach: "",
          hldTechStack: [],
          hldArchitecture: "",
          systemDesignQuestion: "",
          systemDesignApproach: "",
          systemDesignDiagram: "",
          scalingConsiderations: "",
        });

        // Reset to first tab
        setCurrentTab("leetcode");
      } else {
        alert("Error saving problem. Please check the console for details.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error saving problem. Please check the console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof ProblemData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = (
    tag: string,
    field: "tags" | "lldTechStack" | "hldTechStack"
  ) => {
    if (tag.trim()) {
      updateFormData(field, [...formData[field], tag.trim()]);
    }
  };

  const removeTag = (
    index: number,
    field: "tags" | "lldTechStack" | "hldTechStack"
  ) => {
    updateFormData(
      field,
      formData[field].filter((_, i) => i !== index)
    );
  };

  const tabs = [
    { id: "leetcode", label: "LeetCode Problem", icon: "🧮" },
    { id: "lld", label: "Low Level Design", icon: "🎨" },
    { id: "hld", label: "High Level Design", icon: "⚙️" },
    { id: "system", label: "System Design", icon: "🏗️" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-400 mt-2">
                Create new LeetCode → Engineering post
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Auto-commit toggle */}
              <label className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-xl">
                <input
                  type="checkbox"
                  checked={autoCommit}
                  onChange={(e) => setAutoCommit(e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-gray-900 border-gray-600 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-300">
                  Auto-commit to GitHub
                </span>
              </label>

              <Link
                href="/problems"
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all duration-300"
              >
                View Problems
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  currentTab === tab.id
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                    : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:block">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* LeetCode Tab */}
          {currentTab === "leetcode" && (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 space-y-6">
              <h2 className="text-2xl font-bold text-purple-400 mb-6">
                🧮 LeetCode Problem
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">
                    Problem Number
                  </label>
                  <input
                    type="number"
                    value={formData.leetcodeNumber || ""}
                    onChange={(e) =>
                      updateFormData("leetcodeNumber", parseInt(e.target.value))
                    }
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white"
                    placeholder="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) =>
                      updateFormData("difficulty", e.target.value)
                    }
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateFormData("title", e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white"
                  placeholder="Two Sum"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">LeetCode URL</label>
                <input
                  type="url"
                  value={formData.leetcodeUrl}
                  onChange={(e) =>
                    updateFormData("leetcodeUrl", e.target.value)
                  }
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white"
                  placeholder="https://leetcode.com/problems/two-sum/"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    updateFormData("description", e.target.value)
                  }
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white h-32"
                  placeholder="Given an array of integers, return indices of two numbers such that they add up to a specific target..."
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  Solution (Code)
                </label>
                <textarea
                  value={formData.solution}
                  onChange={(e) => updateFormData("solution", e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white h-40 font-mono text-sm"
                  placeholder="function twoSum(nums: number[], target: number): number[] {..."
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">
                    Time Complexity
                  </label>
                  <input
                    type="text"
                    value={formData.timeComplexity}
                    onChange={(e) =>
                      updateFormData("timeComplexity", e.target.value)
                    }
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white"
                    placeholder="O(n)"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    Space Complexity
                  </label>
                  <input
                    type="text"
                    value={formData.spaceComplexity}
                    onChange={(e) =>
                      updateFormData("spaceComplexity", e.target.value)
                    }
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white"
                    placeholder="O(n)"
                    required
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-gray-300 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(index, "tags")}
                        className="text-purple-300 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white"
                  placeholder="Add tag and press Enter"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag((e.target as HTMLInputElement).value, "tags");
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                />
              </div>
            </div>
          )}

          {/* LLD Tab */}
          {currentTab === "lld" && (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 space-y-6">
              <h2 className="text-2xl font-bold text-purple-400 mb-6">
                🎨 Low Level Design
              </h2>

              <div>
                <label className="block text-gray-300 mb-2">LLD Question</label>
                <textarea
                  value={formData.lldQuestion}
                  onChange={(e) =>
                    updateFormData("lldQuestion", e.target.value)
                  }
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white h-32"
                  placeholder="Design a shopping cart component that finds products matching user's budget constraints..."
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">LLD Approach</label>
                <textarea
                  value={formData.lldApproach}
                  onChange={(e) =>
                    updateFormData("lldApproach", e.target.value)
                  }
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white h-40"
                  placeholder="We can use the Two Sum algorithm to efficiently find product combinations that fit within the user's budget..."
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  LLD Code Example
                </label>
                <textarea
                  value={formData.lldCodeExample}
                  onChange={(e) =>
                    updateFormData("lldCodeExample", e.target.value)
                  }
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white h-48 font-mono text-sm"
                  placeholder="interface Product { id: string; price: number; name: string; }..."
                  required
                />
              </div>

              {/* LLD Tech Stack */}
              <div>
                <label className="block text-gray-300 mb-2">Tech Stack</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.lldTechStack.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(index, "lldTechStack")}
                        className="text-blue-300 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white"
                  placeholder="React, TypeScript, etc."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag(
                        (e.target as HTMLInputElement).value,
                        "lldTechStack"
                      );
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                />
              </div>
            </div>
          )}

          {/* HLD Tab */}
          {currentTab === "hld" && (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 space-y-6">
              <h2 className="text-2xl font-bold text-green-400 mb-6">
                ⚙️ High Level Design
              </h2>

              <div>
                <label className="block text-gray-300 mb-2">HLD Question</label>
                <textarea
                  value={formData.hldQuestion}
                  onChange={(e) =>
                    updateFormData("hldQuestion", e.target.value)
                  }
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white h-32"
                  placeholder="Design a user matching API that pairs users with complementary skills..."
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">HLD Approach</label>
                <textarea
                  value={formData.hldApproach}
                  onChange={(e) =>
                    updateFormData("hldApproach", e.target.value)
                  }
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white h-40"
                  placeholder="We can apply the Two Sum pattern to match users by storing required skills in a hash map..."
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Architecture</label>
                <input
                  type="text"
                  value={formData.hldArchitecture}
                  onChange={(e) =>
                    updateFormData("hldArchitecture", e.target.value)
                  }
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white"
                  placeholder="Microservices with Redis Cache"
                  required
                />
              </div>

              {/* HLD Tech Stack */}
              <div>
                <label className="block text-gray-300 mb-2">Tech Stack</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.hldTechStack.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(index, "hldTechStack")}
                        className="text-green-300 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white"
                  placeholder="Node.js, Redis, PostgreSQL, etc."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag(
                        (e.target as HTMLInputElement).value,
                        "hldTechStack"
                      );
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                />
              </div>
            </div>
          )}

          {/* System Design Tab */}
          {currentTab === "system" && (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 space-y-6">
              <h2 className="text-2xl font-bold text-orange-400 mb-6">
                🏗️ System Design
              </h2>

              <div>
                <label className="block text-gray-300 mb-2">
                  System Design Question
                </label>
                <textarea
                  value={formData.systemDesignQuestion}
                  onChange={(e) =>
                    updateFormData("systemDesignQuestion", e.target.value)
                  }
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white h-32"
                  placeholder="Design a load balancer that distributes requests across server pairs efficiently..."
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  System Design Approach
                </label>
                <textarea
                  value={formData.systemDesignApproach}
                  onChange={(e) =>
                    updateFormData("systemDesignApproach", e.target.value)
                  }
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white h-40"
                  placeholder="Using the Two Sum concept, we can implement consistent hashing to pair requests with optimal server combinations..."
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  System Diagram (URL or Description)
                </label>
                <input
                  type="text"
                  value={formData.systemDesignDiagram}
                  onChange={(e) =>
                    updateFormData("systemDesignDiagram", e.target.value)
                  }
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white"
                  placeholder="https://example.com/diagram.png or describe the architecture"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  Scaling Considerations
                </label>
                <textarea
                  value={formData.scalingConsiderations}
                  onChange={(e) =>
                    updateFormData("scalingConsiderations", e.target.value)
                  }
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white h-32"
                  placeholder="How this system scales to millions of users, potential bottlenecks, and optimization strategies..."
                  required
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-center space-x-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-12 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save Problem"}
            </button>

            {isSubmitting && (
              <div className="flex items-center space-x-2 text-gray-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
                <span className="text-sm">Processing...</span>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
