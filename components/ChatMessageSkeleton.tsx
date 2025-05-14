import React from "react";

export default function ChatMessageSkeleton() {
  return (
    <div className="flex items-start gap-3 w-full py-2">
      {/* Avatar skeleton */}
      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
      {/* Message bubble skeleton */}
      <div className="flex-1">
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
        <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    </div>
  );
} 