import React, { useState } from "react";
import {
  X,
  Wrench,
  Search as SearchIcon,
} from "lucide-react";

// Expanded and Sample Tool Data
const TOOLS_DATA = [
  { title: "Username Generator" },
  { title: "YouTube Tag Generator" },
  { title: "Paragraph Generator" },
  { title: "Grammar Checker" },
  { title: "Language Translator" },
  { title: "Lorem Ipsum Generator" },
  { title: "Paraphrasing Tool" },
  { title: "Random Question Generator" },
  { title: "Random Sentence Generator" },
  { title: "Random Word Generator" },
  { title: "Blog Post Idea Generator" },
  { title: "Code Explainer" },
  { title: "Meeting Summarizer" },
  { title: "Email Subject Line Generator" },
  { title: "Password Generator" },
  { title: "Resume Bullet Point Enhancer" },
  { title: "Recipe Generator" },
  { title: "Workout Planner" },
];

interface ToolsPanelProps {
  onClose: () => void;
}

export default function ToolsPanel({ onClose }: ToolsPanelProps) {
  const [search, setSearch] = useState("");

  const filteredTools = TOOLS_DATA.filter((tool) =>
    tool.title.toLowerCase().includes(search.toLowerCase())
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
                  {tool.title}
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