import React from "react";
import { X, History } from "lucide-react";
import ChatHistorySidebar from "@/components/ChatHistorySidebar";

export default function HistoryPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-gray-700" />
          <span className="text-base font-semibold text-gray-800">History</span>
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>
      {/* Search */}
      <div className="p-4 pb-2">
        <input
          type="text"
          placeholder="Search History"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring"
        />
      </div>
      {/* Tabs */}
      <div className="flex px-4 gap-2 mb-2">
        <button className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 font-medium text-xs">Pinned</button>
        <button className="px-3 py-1 rounded-md bg-gray-900 text-white font-medium text-xs">Chats</button>
        <button className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 font-medium text-xs">Projects</button>
      </div>
      {/* Folders/History List */}
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        <div className="text-xs font-semibold text-gray-500 px-2 mb-2 mt-2">Folders</div>
        <div className="px-2">
          <div className="text-sm font-medium text-gray-700 mb-2">Chat History</div>
          <ChatHistorySidebar />
        </div>
      </div>
    </div>
  );
} 