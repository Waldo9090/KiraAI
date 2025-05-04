import React, { useState } from "react";
import {
  X,
  Wrench,
  Search as SearchIcon,
  Eye,
  ThumbsUp,
} from "lucide-react";

// Sample Tool Data (similar to the image)
const TOOLS_DATA = [
  { title: "Username Generator", views: "41.3K", likes: 8, icon: null },
  { title: "YouTube Tag Generator", views: "25.5K", likes: 2, icon: null },
  { title: "Paragraph Generator", views: "24.7K", likes: 7, icon: null },
  { title: "Grammar Checker", views: "32.8K", likes: 16, icon: null },
  { title: "Language Translator", views: "23.9K", likes: 16, icon: null },
  { title: "Lorem Ipsum Generator", views: "17.9K", likes: 0, icon: null },
  { title: "Paraphrasing Tool", views: "45.5K", likes: 21, icon: null },
  { title: "Random Question Generator", views: "57.2K", likes: 39, icon: null },
  { title: "Random Sentence Generator", views: "52.7K", likes: 7, icon: null },
  { title: "Random Word Generator", views: "39.4K", likes: 3, icon: null },
];

interface ToolsPanelProps {
  onClose: () => void;
}

export default function ToolsPanel({ onClose }: ToolsPanelProps) {
  const [search, setSearch] = useState("");

  // Basic filtering (can be improved)
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
            {/* Make each tool clickable if needed later */}
            <div className="py-4 px-2 flex items-center gap-4">
              {/* Placeholder for Image/Icon */}
              <div className="w-16 h-10 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-gray-400">
                 <span className="text-xs">Img</span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1 text-base">
                  {tool.title}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                     <Eye className="h-3 w-3"/> {tool.views}
                  </span>
                  <span className="flex items-center gap-1">
                     <ThumbsUp className="h-3 w-3" /> {tool.likes}
                  </span>
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