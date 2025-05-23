'use client'
import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";

const HistoryPanel = dynamic(() => import("@/components/HistoryPanel"), { ssr: false });

const TOOLS = [
  {
    name: "Essay Writer",
    description: "Generate Fast, Plagiarism-Free Essays in Minutes–try for free",
    href: "/writer/blog",
  },
  {
    name: "AI Literature Review Generator",
    description: "Get Clear, Concise and Structured Information in One Click",
    href: "/writer/literature-review",
  },
  {
    name: "Sentence Rewriter",
    description: "The only tool you need to rewrite your sentences and make them x15 better",
    href: "/writer/sentence-rewriter",
  },
  {
    name: "Paragraph Rewriter",
    description: "Rewrite content in seconds without losing meaning or context.",
    href: "/writer/paragraph-rewriter",
  },
  {
    name: "Excel Formula Generator",
    description: "Convert plain English into complex formulas instantly.",
    href: "/tools/excel-formula-generator",
  },
  {
    name: "AI Detector",
    description: "Detect AI-generated content with high accuracy.",
    href: "/ai-detection",
  },
  // Add more tools as needed from shared-nav
];

export default function AiToolsPage() {
  const [historyOpen, setHistoryOpen] = useState(true);
  return (
    <div className="flex min-h-screen bg-gray-50 pb-16">
      {/* History Panel */}
      {historyOpen && (
        <div className="hidden md:block"><HistoryPanel onClose={() => setHistoryOpen(false)} /></div>
      )}
      {/* Main Content */}
      <div className="flex-1">
        <section className="text-center py-12 px-4">
          <h1 className="text-5xl font-extrabold mb-2 text-gray-900">Free AI tools</h1>
          <p className="text-xl text-gray-700 mb-8">Free AI Tools for Writing, Research, & More | Merlin AI</p>
          <div className="max-w-xl mx-auto mb-8">
            <Input
              type="text"
              placeholder="Search for AI tools..."
              className="w-full h-12 px-4 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-purple-300 text-base"
            />
          </div>
        </section>
        <section className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-4">
            <span className="flex-1 border-t border-gray-200" />
            <span>Trending Tools</span>
            <span className="flex-1 border-t border-gray-200" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOOLS.map((tool) => (
              <Link
                key={tool.name}
                href={tool.href}
                className="bg-white rounded-2xl shadow p-6 hover:shadow-lg border border-gray-100 transition block"
              >
                <h3 className="font-semibold text-lg mb-2">{tool.name}</h3>
                <p className="text-gray-700 text-base">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
} 