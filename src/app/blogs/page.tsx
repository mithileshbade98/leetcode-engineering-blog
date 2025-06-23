"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface BlogPost {
  id: string;
  title: string;
  category: "ml-platform" | "distributed-systems" | "recommendation-systems";
  content: string;
  tags: string[];
  keyTakeaways: string[];
  relatedProblems: string[];
  createdAt: string;
}

export default function BlogsPage() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get("category");

  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryFilter || "all"
  );

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/blogs");
      const data = await response.json();
      setBlogs(data.blogs || []);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const categoryConfig = {
    "ml-platform": {
      name: "ML Platform & MLOps",
      gradient: "from-orange-400 to-red-400",
      bg: "bg-orange-500/20",
      border: "border-orange-500/30",
      icon: "🤖",
      description: "Machine Learning infrastructure, pipelines, and operations",
    },
    "distributed-systems": {
      name: "Distributed Systems",
      gradient: "from-blue-400 to-indigo-400",
      bg: "bg-blue-500/20",
      border: "border-blue-500/30",
      icon: "🌐",
      description: "Scalability, reliability, and distributed computing",
    },
    "recommendation-systems": {
      name: "Recommendation Systems",
      gradient: "from-green-400 to-teal-400",
      bg: "bg-green-500/20",
      border: "border-green-500/30",
      icon: "🎯",
      description: "Personalization, ranking, and recommendation algorithms",
    },
  };

  const filteredBlogs =
    selectedCategory === "all"
      ? blogs
      : blogs.filter((blog) => blog.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading blogs...</div>
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
                Technical Deep Dives
              </h1>
              <p className="text-gray-400 mt-2">
                {blogs.length} articles on system design and engineering
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
        {/* Category Filters */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-300 mb-6">
            Browse by Expertise
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(categoryConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`group relative overflow-hidden rounded-3xl transition-all duration-500 ${
                  selectedCategory === key ? "scale-105" : "hover:scale-105"
                }`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-10 group-hover:opacity-20`}
                ></div>
                <div
                  className={`relative ${config.bg} backdrop-blur-xl border ${config.border} rounded-3xl p-8`}
                >
                  <div className="text-5xl mb-4">{config.icon}</div>
                  <h3
                    className={`text-xl font-bold mb-2 bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}
                  >
                    {config.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {config.description}
                  </p>
                  <div className="text-2xl font-bold text-white">
                    {blogs.filter((b) => b.category === key).length} Articles
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Show All Button */}
          <div className="text-center mt-6">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedCategory === "all"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  : "bg-white/10 text-gray-400 hover:text-white hover:bg-white/20"
              }`}
            >
              Show All Articles
            </button>
          </div>
        </div>

        {/* Blog Posts Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-400 mb-2">
              No articles yet
            </h2>
            <p className="text-gray-500">
              Check back soon for technical deep dives!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredBlogs.map((blog) => (
              <Link key={blog.id} href={`/blogs/${blog.id}`}>
                <article className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-500">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-4xl">
                        {categoryConfig[blog.category].icon}
                      </span>
                      <div>
                        <span
                          className={`inline-block ${
                            categoryConfig[blog.category].bg
                          } text-sm px-3 py-1 rounded-full`}
                        >
                          {categoryConfig[blog.category].name}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(blog.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold mb-4 text-white group-hover:bg-gradient-to-r group-hover:from-purple-200 group-hover:to-blue-200 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {blog.title}
                  </h2>

                  <p className="text-gray-400 mb-6 line-clamp-3">
                    {blog.content.substring(0, 200)}...
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {blog.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{blog.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center text-sm text-purple-400 group-hover:text-purple-300 transition-colors">
                      <span>Read Full Article</span>
                      <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                        →
                      </span>
                    </div>
                  </div>

                  {blog.keyTakeaways.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-sm text-gray-500 mb-2">
                        Key Takeaways:
                      </p>
                      <ul className="text-sm text-gray-400 space-y-1">
                        {blog.keyTakeaways
                          .slice(0, 2)
                          .map((takeaway, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-400 mr-2">✓</span>
                              {takeaway}
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
