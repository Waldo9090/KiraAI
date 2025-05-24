"use client"

import React, { useState, useEffect, useCallback, useRef, createContext } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Home, Wrench, MessageSquare, HistoryIcon, PlusCircle, MoreHorizontal, Plus, Zap } from "lucide-react"
import { useTheme } from "next-themes"
import HistoryPanel from "@/components/HistoryPanel"
import PromptsPanel from "@/components/PromptsPanel"
import ToolsPanel from "@/components/ToolsPanel"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { db } from "@/lib/firebase/config"
import { doc, getDoc } from "firebase/firestore"
import { cn } from "@/lib/utils"
import { UsageProvider } from '@/context/UsageContext'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import UsagePopup from "@/components/UsagePopup"
import DashboardHeader from "@/components/DashboardHeader"
import { SidebarFooter } from "@/components/ui/sidebar"

// Define type for Prompt Panel tab
// type PromptTab = "community" | "saved";

// --- Define Prompt Paste Context --- 
export const PromptPasteContext = createContext<{
  setPromptSetter: (setter: ((prompt: string) => void) | null) => void;
  pastePrompt: (prompt: string) => void;
  historyOpen: boolean;
  isPromptsOpen: boolean;
  isToolsOpen: boolean;
}>({
  setPromptSetter: () => { console.warn("PromptPasteContext not ready"); },
  pastePrompt: () => { console.warn("PromptPasteContext not ready"); },
  historyOpen: false,
  isPromptsOpen: false,
  isToolsOpen: false,
});
// --- End Context Definition ---

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [isPromptsOpen, setIsPromptsOpen] = useState(false)
  const [isToolsOpen, setIsToolsOpen] = useState(false)
  const [currentChatTitle, setCurrentChatTitle] = useState<string | null>(null)

  // --- Context Logic --- 
  const promptSetterRef = useRef<((prompt: string) => void) | null>(null);

  const setPromptSetter = useCallback((setter: ((prompt: string) => void) | null) => {
    if (setter) {
      console.log("Prompt setter registered.");
      promptSetterRef.current = setter;
    } else {
      console.log("Prompt setter unregistered.");
      promptSetterRef.current = null;
    }
  }, []);

  const pastePrompt = useCallback((prompt: string) => {
    if (promptSetterRef.current) {
      console.log("Pasting prompt...");
      promptSetterRef.current(prompt);
    } else {
      console.warn("Paste prompt called, but no setter registered.");
    }
  }, []);

  // --- Context value including panel states and new function ---
  const contextValue = {
    setPromptSetter,
    pastePrompt,
    historyOpen,
    isPromptsOpen,
    isToolsOpen,
  };
  // --- End Context Logic ---

  useEffect(() => {
    setMounted(true)
  }, [])

  // --- Effect to fetch chat title when on a chat page --- 
  useEffect(() => {
    const fetchChatTitle = async (chatId: string) => {
      if (!user || !user.email) {
         setCurrentChatTitle(null); // Clear title if no user
         return;
      }
      const chatDocPath = `savedHistory/${user.email}/chats/${chatId}`;
      const chatDocRef = doc(db, chatDocPath);
      try {
        const docSnap = await getDoc(chatDocRef);
        if (docSnap.exists()) {
          setCurrentChatTitle(docSnap.data().title || "Chat");
        } else {
          console.warn("Chat document not found for title fetch:", chatDocPath);
          setCurrentChatTitle("Chat"); // Fallback title
        }
      } catch (error) {
        console.error("Error fetching chat title:", error);
        setCurrentChatTitle("Chat"); // Fallback title on error
      }
    };

    const chatPathMatch = pathname.match(/^\/dashboard\/chat\/([^\/]+)$/);
    if (chatPathMatch && chatPathMatch[1]) {
      const chatId = chatPathMatch[1];
      fetchChatTitle(chatId);
    } else {
      setCurrentChatTitle(null); // Clear title if not on a chat page
    }
  // Rerun when pathname or user changes
  }, [pathname, user]); 
  // --- End Chat Title Fetch Effect --- 

  const handleToggleHistory = () => {
    const nextHistoryOpen = !historyOpen;
    setHistoryOpen(nextHistoryOpen);
    if (nextHistoryOpen) {
      setIsPromptsOpen(false);
      setIsToolsOpen(false);
    }
  }

  const handleTogglePrompts = () => {
    const nextPromptsOpen = !isPromptsOpen;
    setIsPromptsOpen(nextPromptsOpen);
    if (nextPromptsOpen) {
      setHistoryOpen(false);
      setIsToolsOpen(false);
    }
  }

  const handleToggleTools = () => {
    const nextToolsOpen = !isToolsOpen;
    setIsToolsOpen(nextToolsOpen);
    if (nextToolsOpen) {
      setHistoryOpen(false);
      setIsPromptsOpen(false);
    }
  };

  // --- Determine Page Title --- 
  const getPageTitle = () => {
    if (isToolsOpen) return "Tools";
    if (isPromptsOpen) return "Prompts";
    if (currentChatTitle) return currentChatTitle; // Use fetched chat title if available
    if (pathname === "/dashboard/new") return "New Chat";
    // Removed generic startsWith check as currentChatTitle handles it
    return "Dashboard"; // Default
  };
  const pageTitle = getPageTitle();
  // --- End Page Title --- 

  return (
    <UsageProvider>
      <PromptPasteContext.Provider value={contextValue}>
        <div className="flex h-screen bg-white dark:bg-gray-950">
          <div className="w-60 bg-gray-50 dark:bg-gray-900 border-r dark:border-gray-800 flex flex-col h-full flex-shrink-0">
            <div className="p-4 flex items-center justify-between border-b dark:border-gray-800">
              <div className="flex items-center">
                <div className="h-6 w-6 mr-2">
                  <Image src="/logo.png" alt="Kira AI Logo" width={24} height={24} />
                </div>
                <span className="text-lg font-medium text-gray-800 dark:text-gray-200">kira</span>
              </div>
              <button
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
              >
                {mounted && theme === "dark" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2" />
                    <path d="M12 21v2" />
                    <path d="M4.22 4.22l1.42 1.42" />
                    <path d="M18.36 18.36l1.42 1.42" />
                    <path d="M1 12h2" />
                    <path d="M21 12h2" />
                    <path d="M4.22 19.78l1.42-1.42" />
                    <path d="M18.36 5.64l1.42-1.42" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                  </svg>
                )}
              </button>
            </div>

            <div className="flex-1 overflow-auto px-3">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-3 pt-4">Menu</p>
              <nav className="space-y-1">
                <Link
                  href="/dashboard/new"
                  className={`flex items-center px-3 py-2 text-sm rounded-md ${ 
                    pathname === "/dashboard/new" || pathname === "/dashboard"
                      ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <PlusCircle className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                  <span>New</span>
                </Link>
                <button
                  onClick={handleToggleHistory}
                  className={`flex items-center px-3 py-2 text-sm rounded-md w-full text-left ${ 
                    historyOpen
                      ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <HistoryIcon className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                  <span>History</span>
                </button>
                <button
                  onClick={handleTogglePrompts}
                  className={`flex items-center px-3 py-2 text-sm rounded-md w-full text-left ${ 
                    isPromptsOpen
                      ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <MessageSquare className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                  <span>Prompts</span>
                </button>
                <button
                  onClick={handleToggleTools}
                  className={`flex items-center px-3 py-2 text-sm rounded-md w-full text-left ${ 
                    isToolsOpen
                      ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Wrench className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                  <span>Tools</span>
                </button>
              </nav>
            </div>
            <SidebarFooter />
          </div>

          {historyOpen && (
            <HistoryPanel onClose={() => setHistoryOpen(false)} />
          )}
          {isPromptsOpen && (
            <PromptsPanel onClose={() => setIsPromptsOpen(false)} />
          )}
          {isToolsOpen && (
            <ToolsPanel onClose={() => setIsToolsOpen(false)} />
          )}

          <div className="flex-1 flex flex-col overflow-hidden">
            <DashboardHeader pageTitle={pageTitle} />
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </PromptPasteContext.Provider>
    </UsageProvider>
  )
}
