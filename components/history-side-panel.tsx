"use client"

import { useState } from "react"
import { Search, Maximize2, X, MoreVertical, Folder } from "lucide-react"

interface HistorySidePanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function HistorySidePanel({ isOpen, onClose }: HistorySidePanelProps) {
  const [activeTab, setActiveTab] = useState("Chats")

  // Sample history data
  const historyItems = [
    { id: 1, text: "what", time: "09:04" },
    { id: 2, text: "whats u", time: "08:39" },
    { id: 3, text: "whats up", time: "08:27" },
    { id: 4, text: "whats up", time: "03:14" },
    { id: 5, text: "are u doing well", time: "May 2" },
    { id: 6, text: "whats good", time: "May 2" },
    { id: 7, text: "whats up man", time: "May 2" },
    { id: 8, text: "whats up", time: "May 2" },
    { id: 9, text: "hello", time: "May 2" },
    { id: 10, text: "hello", time: "May 2" },
    { id: 11, text: "whats up", time: "May 2" },
    { id: 12, text: "what is up.", time: "May 2" },
    { id: 13, text: "what are u doing", time: "May 2" },
  ]

  if (!isOpen) return null

  return (
    <div className="absolute top-0 right-0 h-full w-96 bg-white dark:bg-gray-900 border-l dark:border-gray-800 shadow-lg z-10 animate-slideIn">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path
                d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            <h2 className="text-lg font-medium dark:text-white">History</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              <Maximize2 className="h-5 w-5" />
            </button>
            <button
              className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search History"
              className="w-full pl-10 pr-4 py-2 border dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-4 border-b dark:border-gray-800">
          {["Pinned", "Chats", "Projects"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === tab
                  ? "bg-gray-900 text-white dark:bg-gray-800 dark:text-white rounded-t-md"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Folders */}
        <div className="p-4 border-b dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Folders</h3>
            <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="flex items-center justify-between py-2 px-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer">
            <div className="flex items-center">
              <Folder className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Chat History</span>
            </div>
            <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* History Items */}
        <div className="flex-1 overflow-y-auto">
          {historyItems.map((item) => (
            <div
              key={item.id}
              className="py-3 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex justify-between items-center"
            >
              <span className="text-sm text-gray-800 dark:text-gray-200">{item.text}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
