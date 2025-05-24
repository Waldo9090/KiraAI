import React, { useState } from "react";
import {
  X,
  Wrench,
  Search as SearchIcon,
} from "lucide-react";
import Link from "next/link";

// Expanded and Sample Tool Data
const TOOLS = [
  { name: "AI Chat", href: "/chat", description: "Chat with AI in natural language." },
  { name: "Ask AI", href: "/chat/ask-ai", description: "Ask any question to AI." },
  { name: "ChatGPT", href: "/chat/chatgpt", description: "Interact with OpenAI's ChatGPT." },
  { name: "Ask GPT", href: "/chat/ask-gpt", description: "Ask GPT for answers and insights." },
  { name: "Ask Gemini", href: "/chat/ask-gemini", description: "Ask Gemini for smart responses." },
  { name: "Ask Qwen3", href: "/chat/ask-qwen3", description: "Ask Qwen3 for help." },
  { name: "Ask Claude", href: "/chat/ask-claude", description: "Ask Claude for creative answers." },
  { name: "Ask DeepSeek", href: "/chat/ask-deepseek", description: "Ask DeepSeek for research and more." },
  { name: "ChatPDF", href: "/pdf/chatpdf", description: "Chat with your PDF documents." },
  { name: "Chat Doc", href: "/pdf/chat-doc", description: "Chat with DOC files." },
  { name: "Chat PPT", href: "/pdf/chat-ppt", description: "Chat with PowerPoint files." },
  { name: "AI Scholar", href: "/pdf/ai-scholar", description: "AI-powered academic research assistant." },
  { name: "AI PDF OCR", href: "/pdf/ocr", description: "Extract text from PDFs using OCR." },
  { name: "AI PDF Viewer", href: "/pdf/viewer", description: "View and analyze PDFs with AI." },
  { name: "AI PDF Insights", href: "/pdf/insights", description: "Get insights from your PDFs." },
  { name: "AI PDF Reader", href: "/pdf/reader", description: "Read and summarize PDFs with AI." },
  { name: "AI Detector", href: "/writer/ai-detector", description: "Detect AI-generated content." },
  { name: "AI Paraphraser", href: "/writer/paraphraser", description: "Paraphrase text with AI." },
  { name: "AI Humanizer", href: "/writer/humanizer", description: "Make AI text sound more human." },
  { name: "AI Bypass", href: "/writer/bypass", description: "Bypass AI detection tools." },
  { name: "AI Story Generator", href: "/writer/story-generator", description: "Generate stories with AI." },
  { name: "AI Email Writer", href: "/writer/email-writer", description: "Write emails with AI assistance." },
  { name: "Love Message Generator", href: "/writer/love-message", description: "Generate love messages with AI." },
  { name: "AI Translator", href: "/study/translator", description: "Translate text with AI." },
  { name: "Math Solver", href: "/study/math-solver", description: "Solve math problems with AI." },
  { name: "Flashcard Maker", href: "/study/flashcard-maker", description: "Create flashcards with AI." },
  { name: "Math Homework Assistant", href: "/study/math-homework", description: "Get help with math homework." },
  { name: "Physics Solver", href: "/study/physics-solver", description: "Solve physics problems with AI." },
  { name: "Quiz Generator", href: "/study/quiz-generator", description: "Generate quizzes with AI." },
  { name: "Image To Text", href: "/tools/image-to-text", description: "Extract text from images." },
  { name: "Image Translator", href: "/tools/image-translator", description: "Translate text in images." },
  { name: "Passport/ID Card Scanner", href: "/tools/id-scanner", description: "Scan passports and ID cards with AI." },
  { name: "AI Receipt & Invoice Scanner", href: "/tools/receipt-invoice-scanner", description: "Scan receipts and invoices with AI." },
  { name: "Convert to Studio Ghibili", href: "/photo/ghibli", description: "Transform photos into Studio Ghibili style." },
  { name: "Convert to Action Figure", href: "/photo/action-figure", description: "Turn photos into action figures." },
  { name: "Convert Pet to Human", href: "/photo/pet-to-human", description: "See your pet as a human!" },
  { name: "Convert Photo to Watercolor", href: "/photo/watercolor", description: "Watercolor effect for your photos." },
  { name: "More Styles", href: "/photo/more-styles", description: "Explore more AI photo styles." },
];

interface ToolsPanelProps {
  onClose: () => void;
}

export default function ToolsPanel({ onClose }: ToolsPanelProps) {
  const [search, setSearch] = useState("");

  const filteredTools = TOOLS.filter((tool) =>
    tool.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white w-[380px] border-l flex-shrink-0 dark:bg-gray-900 dark:border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10 dark:bg-gray-900 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          <span className="text-base font-semibold text-gray-800 dark:text-white">
            AI Tools
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 pb-2 bg-white sticky top-[65px] z-10 dark:bg-gray-900">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            placeholder="Search Tools"
            className="w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus:ring-indigo-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tool List */}
      <ul className="flex-1 px-2 pb-4 divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto">
        {filteredTools.map((tool, idx) => (
          <li key={idx}>
            <div className="py-3 px-2 flex items-center gap-4">
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                  {tool.name}
                </div>
              </div>
            </div>
          </li>
        ))}
        {filteredTools.length === 0 && (
          <li>
            <div className="text-center text-gray-400 dark:text-gray-500 py-8">
              No tools found.
            </div>
          </li>
        )}
      </ul>
    </div>
  );
} 