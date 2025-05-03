import React from "react";

export default function ChatMessageSkeleton() {
  // Array of widths for the lines (in percent)
  const lines = [90, 80, 60];

  return (
    <div className="flex items-start gap-3 w-full">
      {/* Avatar placeholder */}
      <div className="w-8 h-8 rounded-full bg-gray-200 mt-1" />
      {/* Message skeleton */}
      <div className="flex-1 flex flex-col gap-2">
        {lines.map((width, i) => (
          <div
            key={i}
            className={
              "h-4 rounded-lg bg-gradient-to-r from-blue-400 via-blue-300 to-blue-100 relative overflow-hidden animate-shimmer"
            }
            style={{ width: `${width}%` }}
          >
            {/* Shimmer overlay */}
            <span className="absolute inset-0 block bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer-overlay" />
          </div>
        ))}
      </div>
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
        }
        @keyframes shimmerOverlay {
          0% { left: -60%; }
          100% { left: 120%; }
        }
        .animate-shimmer-overlay {
          animation: shimmerOverlay 1.2s infinite linear;
          background-size: 200% 100%;
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
} 