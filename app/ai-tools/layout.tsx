import Link from "next/link";
import Image from "next/image";
import { PlusCircle, History as HistoryIcon, MessageSquare, Wrench } from "lucide-react";

export default function AiToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-white dark:bg-gray-950">
      <div className="w-60 bg-gray-50 dark:bg-gray-900 border-r dark:border-gray-800 flex flex-col h-full flex-shrink-0">
        <div className="p-4 flex items-center justify-between border-b dark:border-gray-800">
          <div className="flex items-center">
            <div className="h-6 w-6 mr-2">
              <Image src="/logo.png" alt="ChatAI Logo" width={24} height={24} />
            </div>
            <span className="text-lg font-medium text-gray-800 dark:text-gray-200">ChatAI</span>
          </div>
        </div>
        <div className="flex-1 overflow-auto px-3">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-3 pt-4">Menu</p>
          <nav className="space-y-1">
            <Link href="/dashboard/new" className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              <PlusCircle className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
              <span>New</span>
            </Link>
            <Link href="/dashboard" className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              <HistoryIcon className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
              <span>History</span>
            </Link>
            <Link href="/dashboard" className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              <MessageSquare className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
              <span>Prompts</span>
            </Link>
            <Link href="/ai-tools" className="flex items-center px-3 py-2 text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              <Wrench className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
              <span>Tools</span>
            </Link>
          </nav>
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-3 border-b dark:border-gray-800 h-16 flex-shrink-0 bg-white dark:bg-gray-950 sticky top-0 z-20">
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate" title="AI Tools">AI Tools</span>
        </header>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 