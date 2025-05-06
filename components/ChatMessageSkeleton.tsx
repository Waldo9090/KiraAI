import React from "react";

export default function ChatMessageSkeleton() {
  // Array of widths for the lines (in percent)
  const lines = [90, 80, 60];

  return (
    <div className="flex items-start gap-3 w-full">
      {/* Avatar placeholder - Light Blue */}
      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 mt-1 animate-pulse" />
      {/* Message skeleton - Light Blue */}
      <div className="flex-1 flex flex-col gap-2">
        {lines.map((width, i) => (
          <div
            key={i}
            className={
              "h-4 rounded-lg bg-blue-100 dark:bg-blue-900/40 animate-pulse-opacity"
            }
            style={{ width: `${width}%`, animationDelay: `${i * 0.1}s` }}
          >
            {/* Removed Shimmer overlay span */}
          </div>
        ))}
      </div>
      <style jsx global>{`
        @keyframes pulseOpacity {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; } /* Adjusted opacity slightly */
        }
        .animate-pulse-opacity {
          animation: pulseOpacity 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
} 