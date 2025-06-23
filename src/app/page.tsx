"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import StreakCalendar from "./components/StreakCalendar";

interface Stats {
  totalProblems: number;
  totalBlogs: number;
  currentStreak: number;
  longestStreak: number;
  dueReviews: number;
}

interface BlogPost {
  id: string;
  title: string;
  category: "ml-platform" | "distributed-systems" | "recommendation-systems";
  createdAt: string;
}

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalProblems: 0,
    totalBlogs: 0,
    currentStreak: 0,
    longestStreak: 0,
    dueReviews: 0,
  });
  const [recentBlogs, setRecentBlogs] = useState<BlogPost[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    setIsLoaded(true);
    fetchStats();
    fetchRecentBlogs();
    checkDailyReminders();
  }, []);

  const fetchStats = async () => {
    try {
      const [problemsRes, blogsRes, streakRes, reviewsRes] = await Promise.all([
        fetch("/api/problems"),
        fetch("/api/blogs"),
        fetch("/api/checkin"),
        fetch("/api/reviews"),
      ]);

      const problemsData = await problemsRes.json();
      const blogsData = await blogsRes.json();
      const streakData = await streakRes.json();
      const reviewsData = await reviewsRes.json();

      setStats({
        totalProblems: problemsData.problems?.length || 0,
        totalBlogs: blogsData.blogs?.length || 0,
        currentStreak: streakData.currentStreak || 0,
        longestStreak: streakData.longestStreak || 0,
        dueReviews: reviewsData.dueCount || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchRecentBlogs = async () => {
    try {
      const response = await fetch("/api/blogs?limit=3");
      const data = await response.json();
      setRecentBlogs(data.blogs || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const checkDailyReminders = async () => {
    try {
      const response = await fetch("/api/notifications");
      const data = await response.json();
      setNotifications(data.reminders || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleDailyCheckIn = async () => {
    try {
      const response = await fetch("/api/checkin", {
        method: "POST",
      });
      if (response.ok) {
        fetchStats();
        alert("Daily check-in completed! Keep up the great work!");
      }
    } catch (error) {
      console.error("Check-in error:", error);
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

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black"></div>
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation with Notifications */}
      <nav className="relative z-50 backdrop-blur-xl bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link
              href="/"
              className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
            >
              Mithilesh&apos;s Engineering Journey
            </Link>
            <div className="flex items-center space-x-6">
              {/* Notification Bell */}
              {notifications.length > 0 && (
                <div className="relative group">
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
                    <span className="text-2xl">🔔</span>
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  </button>
                  <div className="absolute right-0 mt-2 w-80 bg-gray-900 rounded-2xl shadow-2xl p-4 hidden group-hover:block">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">
                      Study Reminders
                    </h3>
                    {notifications.map((notif, i) => (
                      <div
                        key={i}
                        className="text-sm text-gray-400 py-2 border-b border-gray-800 last:border-0"
                      >
                        {notif}
                      </div>
                    ))}
                    <Link
                      href="/anki"
                      className="block mt-2 text-center text-purple-400 hover:text-purple-300"
                    >
                      Start Review Session →
                    </Link>
                  </div>
                </div>
              )}

              {/* Daily Check-in Button */}
              <button
                onClick={handleDailyCheckIn}
                className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 rounded-xl font-semibold hover:scale-105 transition-all"
              >
                📅 Daily Check-in
              </button>

              <Link
                href="/admin"
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Stats */}
      <section className="relative z-10 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Mithilesh Kumar
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Software Engineer • Distributed Systems • ML Infrastructure
            </p>

            {/* Current Streak Display */}
            <div className="inline-flex items-center space-x-2 bg-orange-500/20 text-orange-300 px-6 py-3 rounded-full mb-8">
              <span className="text-2xl">🔥</span>
              <span className="text-lg font-semibold">
                {stats.currentStreak} Day Streak
              </span>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="text-3xl font-bold text-purple-400">
                  {stats.totalProblems}
                </div>
                <div className="text-sm text-gray-400">Problems Solved</div>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="text-3xl font-bold text-blue-400">
                  {stats.totalBlogs}
                </div>
                <div className="text-sm text-gray-400">Technical Blogs</div>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="text-3xl font-bold text-green-400">
                  {stats.longestStreak}
                </div>
                <div className="text-sm text-gray-400">Longest Streak</div>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="text-3xl font-bold text-orange-400">
                  {stats.dueReviews}
                </div>
                <div className="text-sm text-gray-400">Reviews Due</div>
              </div>
            </div>
          </div>

          {/* GitHub-like Contribution Calendar */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-300">
              Daily Learning Activity
            </h2>
            <StreakCalendar />
          </div>

          {/* Quick Actions for Recruiters */}
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Interested in My Profile?
              </h2>
              <p className="text-gray-300 mb-6">
                I&apos;m actively seeking opportunities in distributed systems,
                ML infrastructure, and backend engineering.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="mailto:your-email@example.com"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-all"
                >
                  📧 Request Interview
                </a>
                <a
                  href="/resume.pdf"
                  className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-semibold transition-all"
                >
                  📄 Download Resume
                </a>
              </div>
            </div>
          </div>

          {/* Specialized Knowledge Sections */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-300">
              Specialized Knowledge Areas
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(categoryConfig).map(([key, config]) => (
                <Link key={key} href={`/blogs?category=${key}`}>
                  <div className="group cursor-pointer">
                    <div
                      className={`${config.bg} backdrop-blur-xl border border-white/10 rounded-3xl p-8 transition-all duration-500 hover:scale-105 hover:border-white/20`}
                    >
                      <div className="text-5xl mb-4">{config.icon}</div>
                      <h3
                        className={`text-xl font-bold mb-2 bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}
                      >
                        {config.name}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Deep dives into {config.name.toLowerCase()} concepts and
                        implementations
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Blog Posts */}
          {recentBlogs.length > 0 && (
            <div className="mb-16">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-300">
                  Recent Technical Deep Dives
                </h2>
                <Link
                  href="/blogs"
                  className="text-purple-400 hover:text-purple-300"
                >
                  View All →
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {recentBlogs.map((blog) => (
                  <Link key={blog.id} href={`/blogs/${blog.id}`}>
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:scale-105 transition-all">
                      <span
                        className={`inline-block ${
                          categoryConfig[blog.category].bg
                        } text-sm px-3 py-1 rounded-full mb-3`}
                      >
                        {categoryConfig[blog.category].name}
                      </span>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {blog.title}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/problems">
              <div className="bg-purple-500/10 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 hover:scale-105 transition-all text-center">
                <div className="text-4xl mb-3">🧮</div>
                <h3 className="text-lg font-semibold text-purple-300">
                  LeetCode Solutions
                </h3>
                <p className="text-gray-400 text-sm mt-2">
                  With real-world applications
                </p>
              </div>
            </Link>
            <Link href="/anki">
              <div className="bg-blue-500/10 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 hover:scale-105 transition-all text-center">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="text-lg font-semibold text-blue-300">
                  Spaced Repetition
                </h3>
                <p className="text-gray-400 text-sm mt-2">
                  {stats.dueReviews} reviews pending
                </p>
              </div>
            </Link>
            <Link href="/blogs">
              <div className="bg-green-500/10 backdrop-blur-xl border border-green-500/30 rounded-2xl p-6 hover:scale-105 transition-all text-center">
                <div className="text-4xl mb-3">📝</div>
                <h3 className="text-lg font-semibold text-green-300">
                  Technical Blogs
                </h3>
                <p className="text-gray-400 text-sm mt-2">
                  In-depth technical articles
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
