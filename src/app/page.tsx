"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Problems", href: "/problems" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black"></div>
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav
        className={`relative z-50 backdrop-blur-xl bg-black/50 border-b border-white/10 transition-all duration-1000 ${
          isLoaded ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link
              href="/"
              className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
            >
              LeetCode → Engineering
            </Link>
            <div className="hidden md:flex space-x-8">
              {navigationItems.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 relative group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>
            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 group">
              <div className="w-6 h-0.5 bg-white mb-1 transition-all duration-300 group-hover:bg-purple-400"></div>
              <div className="w-6 h-0.5 bg-white mb-1 transition-all duration-300 group-hover:bg-purple-400"></div>
              <div className="w-6 h-0.5 bg-white transition-all duration-300 group-hover:bg-purple-400"></div>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 sm:pt-32 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center transition-all duration-1000 delay-300 ${
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
              From LeetCode
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                to Real Engineering
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Bridging algorithmic thinking with production systems.
              <br className="hidden sm:block" />
              See how <span className="text-purple-400">
                data structures
              </span>{" "}
              power real applications.
            </p>

            {/* Animated Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto mb-12">
              {[
                {
                  num: 25,
                  label: "Problems",
                  color: "from-purple-400 to-pink-400",
                },
                {
                  num: 8,
                  label: "Tech Stacks",
                  color: "from-blue-400 to-cyan-400",
                },
                {
                  num: 12,
                  label: "Architectures",
                  color: "from-green-400 to-teal-400",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`group cursor-pointer transition-all duration-500 delay-${
                    index * 100
                  } ${
                    isLoaded
                      ? "translate-y-0 opacity-100"
                      : "translate-y-10 opacity-0"
                  }`}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div
                    className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 transition-all duration-300 ${
                      hoveredCard === index
                        ? "scale-110 bg-white/10"
                        : "hover:scale-105"
                    }`}
                  >
                    <div
                      className={`text-2xl sm:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}
                    >
                      {stat.num}+
                    </div>
                    <div className="text-sm sm:text-base text-gray-400 group-hover:text-gray-300 transition-colors">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/problems">
              <button className="group relative bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
                <span className="relative z-10 flex items-center space-x-2">
                  <span>Explore Problems</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why This Approach */}
      <section id="about" className="relative z-10 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-1000 delay-500 ${
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h2 className="text-3xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Why This Approach?
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
              Traditional LeetCode preparation misses the bigger picture. I show
              you the <span className="text-purple-400">real connections</span>.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎨",
                title: "Frontend Magic",
                subtitle: "React • Vue • Svelte",
                description:
                  "Array algorithms become data visualization. Graph traversal powers component routing. Dynamic programming optimizes render cycles.",
                gradient: "from-purple-500/20 to-pink-500/20",
                border: "border-purple-500/30",
              },
              {
                icon: "⚙️",
                title: "Backend Power",
                subtitle: "Node.js • Python • Go",
                description:
                  "Sorting algorithms scale databases. Tree structures organize microservices. Hash tables power distributed caching systems.",
                gradient: "from-blue-500/20 to-cyan-500/20",
                border: "border-blue-500/30",
              },
              {
                icon: "🏗️",
                title: "System Architecture",
                subtitle: "AWS • Kubernetes • Docker",
                description:
                  "Consensus algorithms in distributed systems. Load balancing with graph theory. Consistent hashing in cloud architecture.",
                gradient: "from-green-500/20 to-teal-500/20",
                border: "border-green-500/30",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`group cursor-pointer transition-all duration-700 delay-${
                  600 + index * 100
                } ${
                  isLoaded
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
              >
                <div
                  className={`h-full bg-gradient-to-br ${item.gradient} backdrop-blur-xl border ${item.border} rounded-3xl p-6 sm:p-8 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl`}
                >
                  <div className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-purple-300 mb-4 font-mono">
                    {item.subtitle}
                  </p>
                  <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Problem - Premium Card */}
      <section className="relative z-10 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-12 transition-all duration-1000 delay-700 ${
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h2 className="text-3xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Featured Deep Dive
            </h2>
          </div>

          <Link href="/problems">
            <div
              className={`relative group cursor-pointer transition-all duration-1000 delay-800 ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 lg:p-12 group-hover:border-white/30 transition-all duration-500">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                  <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                    <span className="text-sm font-mono text-gray-400 bg-white/5 px-3 py-1 rounded-full">
                      #001
                    </span>
                    <span className="bg-gradient-to-r from-green-400 to-emerald-400 text-black px-3 py-1 rounded-full text-sm font-semibold">
                      EASY
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                      Array
                    </span>
                    <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                      Hash Table
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl sm:text-4xl font-bold mb-4 text-white group-hover:bg-gradient-to-r group-hover:from-purple-200 group-hover:to-blue-200 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
                  Two Sum Problem
                </h3>
                <p className="text-lg sm:text-xl text-gray-300 mb-12 leading-relaxed">
                  Given an array of integers, return indices of two numbers that
                  add up to a specific target.
                </p>

                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                  {[
                    {
                      title: "E-commerce Cart Logic",
                      tech: "React + TypeScript",
                      description:
                        "Find products that fit within user's budget constraints using optimized lookup",
                      icon: "🛒",
                      gradient: "from-purple-500/10 to-pink-500/10",
                      accent: "purple",
                    },
                    {
                      title: "User Matching API",
                      tech: "Node.js + Redis",
                      description:
                        "Match users with complementary skills for team formation in O(n) time",
                      icon: "👥",
                      gradient: "from-blue-500/10 to-cyan-500/10",
                      accent: "blue",
                    },
                    {
                      title: "Load Balancer Design",
                      tech: "Kubernetes + AWS",
                      description:
                        "Distribute requests across server pairs using consistent hashing principles",
                      icon: "⚖️",
                      gradient: "from-green-500/10 to-teal-500/10",
                      accent: "green",
                    },
                  ].map((app, index) => (
                    <div
                      key={index}
                      className={`bg-gradient-to-br ${app.gradient} border border-white/10 rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:border-${app.accent}-500/30`}
                    >
                      <div className="text-3xl mb-4">{app.icon}</div>
                      <h4 className="text-lg font-semibold text-white mb-2">
                        {app.title}
                      </h4>
                      <p
                        className={`text-sm text-${app.accent}-300 mb-3 font-mono`}
                      >
                        {app.tech}
                      </p>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {app.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <div className="group relative bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 inline-flex">
                    <span className="relative z-10 flex items-center space-x-2">
                      <span>Read Full Analysis</span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        →
                      </span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className={`transition-all duration-1000 delay-900 ${
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Ready to Bridge the Gap?
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Start your journey from algorithmic puzzles to production-ready
              engineering solutions.
            </p>
            <Link href="/problems">
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
                Start Learning Now
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4 md:mb-0">
              LeetCode → Engineering
            </div>
            <div className="flex space-x-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>
              &copy; 2025 LeetCode → Engineering. Bridging algorithms to
              real-world systems.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
