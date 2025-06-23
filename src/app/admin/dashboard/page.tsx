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
  leetcodeUrl: string;

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

interface BlogData {
  title: string;
  category: "ml-platform" | "distributed-systems" | "recommendation-systems";
  content: string;
  tags: string[];
  keyTakeaways: string[];
  relatedProblems: string[];
}

export default function AdminDashboard() {
  const [formType, setFormType] = useState<"problem" | "blog">("problem");
  const [formData, setFormData] = useState<ProblemData>({
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

  const [blogData, setBlogData] = useState<BlogData>({
    title: "",
    category: "ml-platform",
    content: "",
    tags: [],
    keyTakeaways: [],
    relatedProblems: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTab, setCurrentTab] = useState("leetcode");
  const [autoCommit, setAutoCommit] = useState(true);

  const handleProblemSubmit = async (e: React.FormEvent) => {
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
              alert("Problem saved and committed to GitHub!");
            }
          } catch (error) {
            console.error("GitHub commit error:", error);
          }
        }

        // Create initial review entry
        try {
          await fetch("/api/reviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              problemId: result.problemId,
              quality: 0,
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
        setCurrentTab("leetcode");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error saving problem.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
      });

      if (response.ok) {
        alert("Blog saved successfully!");

        // Reset blog form
        setBlogData({
          title: "",
          category: "ml-platform",
          content: "",
          tags: [],
          keyTakeaways: [],
          relatedProblems: [],
        });
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error saving blog.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof ProblemData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateBlogData = (field: keyof BlogData, value: any) => {
    setBlogData((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = (
    tag: string,
    field: "tags" | "lldTechStack" | "hldTechStack"
  ) => {
    if (tag.trim()) {
      updateFormData(field, [...formData[field], tag.trim()]);
    }
  };

  const addBlogTag = (
    tag: string,
    field: "tags" | "keyTakeaways" | "relatedProblems"
  ) => {
    if (tag.trim()) {
      updateBlogData(field, [...blogData[field], tag.trim()]);
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

  const removeBlogTag = (
    index: number,
    field: "tags" | "keyTakeaways" | "relatedProblems"
  ) => {
    updateBlogData(
      field,
      blogData[field].filter((_, i) => i !== index)
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
                Create content to showcase your expertise
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Form Type Toggle */}
              <div className="flex bg-white/10 rounded-xl p-1">
                <button
                  onClick={() => setFormType("problem")}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    formType === "problem"
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                      : "text-gray-400"
                  }`}
                >
                  Problem
                </button>
                <button
                  onClick={() => setFormType("blog")}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    formType === "blog"
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                      : "text-gray-400"
                  }`}
                >
                  Blog Post
                </button>
              </div>

              {/* Auto-commit toggle */}
              {formType === "problem" && (
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
              )}

              <Link
                href="/"
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all duration-300"
              >
                View Site
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {formType === "problem" ? (
          <form onSubmit={handleProblemSubmit} className="space-y-8">
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
                        updateFormData(
                          "leetcodeNumber",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white"
                      placeholder="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Difficulty
                    </label>
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
                  <label className="block text-gray-300 mb-2">
                    LeetCode URL
                  </label>
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
                  <label className="block text-gray-300 mb-2">
                    Description
                  </label>
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
                  <label className="block text-gray-300 mb-2">
                    LLD Question
                  </label>
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
                  <label className="block text-gray-300 mb-2">
                    LLD Approach
                  </label>
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
                  <label className="block text-gray-300 mb-2">
                    HLD Question
                  </label>
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
                  <label className="block text-gray-300 mb-2">
                    HLD Approach
                  </label>
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
                  <label className="block text-gray-300 mb-2">
                    Architecture
                  </label>
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
        ) : (
          // Blog Form
          <form onSubmit={handleBlogSubmit} className="space-y-8">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 space-y-6">
              <h2 className="text-2xl font-bold text-purple-400 mb-6">
                📝 Technical Blog Post
              </h2>

              <div>
                <label className="block text-gray-300 mb-2">Blog Title</label>
                <input
                  type="text"
                  value={blogData.title}
                  onChange={(e) => updateBlogData("title", e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white"
                  placeholder="Building Scalable ML Pipelines with Apache Spark"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Category</label>
                <select
                  value={blogData.category}
                  onChange={(e) => updateBlogData("category", e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white"
                >
                  <option value="ml-platform">ML Platform & MLOps</option>
                  <option value="distributed-systems">
                    Distributed Systems
                  </option>
                  <option value="recommendation-systems">
                    Recommendation Systems
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  Content (Markdown supported)
                </label>
                <textarea
                  value={blogData.content}
                  onChange={(e) => updateBlogData("content", e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white h-96 font-mono text-sm"
                  placeholder="## Introduction&#10;&#10;In this post, we'll explore how to build scalable ML pipelines..."
                  required
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-gray-300 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {blogData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeBlogTag(index, "tags")}
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
                      addBlogTag((e.target as HTMLInputElement).value, "tags");
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                />
              </div>

              {/* Key Takeaways */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Key Takeaways
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {blogData.keyTakeaways.map((takeaway, index) => (
                    <span
                      key={index}
                      className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                    >
                      <span>{takeaway}</span>
                      <button
                        type="button"
                        onClick={() => removeBlogTag(index, "keyTakeaways")}
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
                  placeholder="Add key takeaway and press Enter"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addBlogTag(
                        (e.target as HTMLInputElement).value,
                        "keyTakeaways"
                      );
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                />
              </div>

              {/* Related Problems */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Related LeetCode Problems
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {blogData.relatedProblems.map((problem, index) => (
                    <span
                      key={index}
                      className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                    >
                      <span>{problem}</span>
                      <button
                        type="button"
                        onClick={() => removeBlogTag(index, "relatedProblems")}
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
                  placeholder="Problem name or number"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addBlogTag(
                        (e.target as HTMLInputElement).value,
                        "relatedProblems"
                      );
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-center space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-12 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Publish Blog"}
              </button>

              {isSubmitting && (
                <div className="flex items-center space-x-2 text-gray-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
                  <span className="text-sm">Processing...</span>
                </div>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
