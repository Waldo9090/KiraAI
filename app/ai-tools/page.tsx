'use client'
import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";

// const HistoryPanel = dynamic(() => import("@/components/HistoryPanel"), { ssr: false });

const TOOLS = [
  // AI Chat
  { name: "AI Chat", href: "/chat", description: "Chat with AI in natural language." },
  { name: "Ask AI", href: "/chat/ask-ai", description: "Ask any question to AI." },
  { name: "ChatGPT", href: "/chat/chatgpt", description: "Interact with OpenAI's ChatGPT." },
  { name: "Ask GPT", href: "/chat/ask-gpt", description: "Ask GPT for answers and insights." },
  { name: "Ask Gemini", href: "/chat/ask-gemini", description: "Ask Gemini for smart responses." },
  { name: "Ask Qwen3", href: "/chat/ask-qwen3", description: "Ask Qwen3 for help." },
  { name: "Ask Claude", href: "/chat/ask-claude", description: "Ask Claude for creative answers." },
  { name: "Ask DeepSeek", href: "/chat/ask-deepseek", description: "Ask DeepSeek for research and more." },
  // AI PDF
  { name: "ChatPDF", href: "/pdf/chatpdf", description: "Chat with your PDF documents." },
  { name: "Chat Doc", href: "/pdf/chat-doc", description: "Chat with DOC files." },
  { name: "Chat PPT", href: "/pdf/chat-ppt", description: "Chat with PowerPoint files." },
  { name: "AI Scholar", href: "/pdf/ai-scholar", description: "AI-powered academic research assistant." },
  { name: "AI PDF OCR", href: "/pdf/ocr", description: "Extract text from PDFs using OCR." },
  { name: "AI PDF Viewer", href: "/pdf/viewer", description: "View and analyze PDFs with AI." },
  { name: "AI PDF Insights", href: "/pdf/insights", description: "Get insights from your PDFs." },
  { name: "AI PDF Reader", href: "/pdf/reader", description: "Read and summarize PDFs with AI." },
  // AI Writer
  { name: "AI Detector", href: "/writer/ai-detector", description: "Detect AI-generated content." },
  { name: "AI Paraphraser", href: "/writer/paraphraser", description: "Paraphrase text with AI." },
  { name: "AI Humanizer", href: "/writer/humanizer", description: "Make AI text sound more human." },
  { name: "AI Bypass", href: "/writer/bypass", description: "Bypass AI detection tools." },
  { name: "AI Story Generator", href: "/writer/story-generator", description: "Generate stories with AI." },
  { name: "AI Email Writer", href: "/writer/email-writer", description: "Write emails with AI assistance." },
  { name: "Love Message Generator", href: "/writer/love-message", description: "Generate love messages with AI." },
  // AI Study
  { name: "AI Translator", href: "/study/translator", description: "Translate text with AI." },
  { name: "Math Solver", href: "/study/math-solver", description: "Solve math problems with AI." },
  { name: "Flashcard Maker", href: "/study/flashcard-maker", description: "Create flashcards with AI." },
  { name: "Math Homework Assistant", href: "/study/math-homework", description: "Get help with math homework." },
  { name: "Physics Solver", href: "/study/physics-solver", description: "Solve physics problems with AI." },
  { name: "Quiz Generator", href: "/study/quiz-generator", description: "Generate quizzes with AI." },
  // AI Tools
  { name: "Image To Text", href: "/tools/image-to-text", description: "Extract text from images." },
  { name: "Image Translator", href: "/tools/image-translator", description: "Translate text in images." },
  { name: "Passport/ID Card Scanner", href: "/tools/id-scanner", description: "Scan passports and ID cards with AI." },
  { name: "AI Receipt & Invoice Scanner", href: "/tools/receipt-invoice-scanner", description: "Scan receipts and invoices with AI." },
  // AI Photo
  { name: "Convert to Studio Ghibili", href: "/photo/ghibli", description: "Transform photos into Studio Ghibili style." },
  { name: "Convert to Action Figure", href: "/photo/action-figure", description: "Turn photos into action figures." },
  { name: "Convert Pet to Human", href: "/photo/pet-to-human", description: "See your pet as a human!" },
  { name: "Convert Photo to Watercolor", href: "/photo/watercolor", description: "Watercolor effect for your photos." },
  { name: "More Styles", href: "/photo/more-styles", description: "Explore more AI photo styles." },
];

export default function AiToolsPage() {
  // No historyOpen state, no HistoryPanel
  return (
    <div className="flex min-h-screen bg-gray-50 pb-16">
      {/* Only the sidebar from layout.tsx will be visible */}
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