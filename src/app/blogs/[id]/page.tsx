"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

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

export default function BlogDetailPage() {
  const params = useParams();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [params.id]);

  const fetchBlog = async () => {
    try {
      const response = await fetch("/api/blogs");
      const data = await response.json();
      const foundBlog = data.blogs?.find((b: BlogPost) => b.id === params.id);
      setBlog(foundBlog || null);
    } catch (error) {
      console.error("Failed to fetch blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const categoryConfig = {
    "ml-platform": {
      name: "ML Platform & MLOps",
      gradient: "from-orange-400 to-red-400",
      bg: "bg-orange-500/20",
      icon: "🤖",
    },
    "distributed-systems": {
      name: "Distributed Systems",
      gradient: "from-blue-400 to-indigo-400",
      bg: "bg-blue-500/20",
      icon: "🌐",
    },
    "recommendation-systems": {
      name: "Recommendation Systems",
      gradient: "from-green-400 to-teal-400",
      bg: "bg-green-500/20",
      icon: "🎯",
    },
  };

  const renderContent = (content: string) => {
    // Simple markdown-like rendering
    return content.split("\n").map((paragraph, index) => {
      if (paragraph.startsWith("## ")) {
        return (
          <h2 key={index} className="text-2xl font-bold text-white mt-8 mb-4">
            {paragraph.substring(3)}
          </h2>
        );
      } else if (paragraph.startsWith("### ")) {
        return (
          <h3
            key={index}
            className="text-xl font-semibold text-gray-200 mt-6 mb-3"
          >
            {paragraph.substring(4)}
          </h3>
        );
      } else if (paragraph.startsWith("```")) {
        return null; // Skip code fence markers
      } else if (paragraph.trim()) {
        return (
          <p key={index} className="text-gray-300 mb-4 leading-relaxed">
            {paragraph}
          </p>
        );
      }
      return null;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading blog...</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😵</div>
          <h1 className="text-2xl font-bold text-white mb-4">Blog Not Found</h1>
          <Link
            href="/blogs"
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300"
          >
            ← Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  const config = categoryConfig[blog.category];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/blogs"
              className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
            >
              <span>←</span>
              <span>Back to Blogs</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-4xl">{config.icon}</span>
              <span className={`${config.bg} text-sm px-3 py-1 rounded-full`}>
                {config.name}
              </span>
            </div>
          </div>
          <h1
            className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent mb-4`}
          >
            {blog.title}
          </h1>
          <div className="flex items-center space-x-4 text-gray-400">
            <span>
              Published on{" "}
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span>•</span>
            <span>{blog.content.split(" ").length} words</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Key Takeaways Box */}
        {blog.keyTakeaways.length > 0 && (
          <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 mb-12">
            <h3 className="text-lg font-semibold text-purple-400 mb-4">
              🎯 Key Takeaways
            </h3>
            <ul className="space-y-2">
              {blog.keyTakeaways.map((takeaway, index) => (
                <li key={index} className="flex items-start text-gray-300">
                  <span className="text-green-400 mr-3 mt-1">✓</span>
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Blog Content */}
        <article className="prose prose-invert max-w-none">
          {renderContent(blog.content)}
        </article>

        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <h3 className="text-lg font-semibold text-gray-300 mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Related Problems */}
        {blog.relatedProblems.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-300 mb-4">
              Related LeetCode Problems
            </h3>
            <div className="space-y-3">
              {blog.relatedProblems.map((problem, index) => (
                <Link
                  key={index}
                  href="/problems"
                  className="block bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-all"
                >
                  <span className="text-blue-400">→ {problem}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Found this helpful?
          </h3>
          <p className="text-gray-300 mb-6">
            I&apos;m actively seeking opportunities in{" "}
            {config.name.toLowerCase()}.
          </p>

          <a
            href="mailto:mithileshbade98@gmail.com"
            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-all"
          >
            📧 Let&apos;s Connect
          </a>
        </div>
      </div>
    </div>
  );
}
