"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { ChevronDown } from "lucide-react"

const NAV_ITEMS = [
  {
    label: "AI Chat",
    dropdown: [
      { label: "AI Chat", href: "/chat" },
      { label: "Ask AI", href: "/chat/ask-ai" },
      { label: "ChatGPT", href: "/chat/chatgpt" },
      { label: "Ask GPT", href: "/chat/ask-gpt" },
      { label: "Ask Gemini", href: "/chat/ask-gemini" },
      { label: "Ask Qwen3", href: "/chat/ask-qwen3" },
      { label: "Ask Claude", href: "/chat/ask-claude" },
      { label: "Ask DeepSeek", href: "/chat/ask-deepseek" },
    ],
  },
  {
    label: "AI PDF",
    dropdown: [
      { label: "ChatPDF", href: "/pdf/chatpdf" },
      { label: "Chat Doc", href: "/pdf/chat-doc" },
      { label: "Chat PPT", href: "/pdf/chat-ppt" },
      { label: "AI Scholar", href: "/pdf/ai-scholar" },
      { label: "AI PDF OCR", href: "/pdf/ocr" },
      { label: "AI PDF Viewer", href: "/pdf/viewer" },
      { label: "AI PDF Insights", href: "/pdf/insights" },
      { label: "AI PDF Reader", href: "/pdf/reader" },
    ],
  },
  {
    label: "AI YouTube",
    dropdown: null,
    href: "/youtube"
  },
  {
    label: "AI Writer",
    dropdown: [
      { label: "AI Detector", href: "/writer/ai-detector" },
      { label: "AI Paraphraser", href: "/writer/paraphraser" },
      { label: "AI Humanizer", href: "/writer/humanizer" },
      { label: "AI Bypass", href: "/writer/bypass" },
      { label: "AI Story Generator", href: "/writer/story-generator" },
      { label: "AI Email Writer", href: "/writer/email-writer" },
      { label: "Love Message Generator", href: "/writer/love-message" },
    ],
  },
  {
    label: "AI Study",
    dropdown: [
      { label: "AI Translator", href: "/study/translator" },
      { label: "AI Math Solver", href: "/math-solver" },
      { label: "Flashcard Maker", href: "/study/flashcard-maker" },
      { label: "Math Homework Assistant", href: "/study/math-homework" },
      { label: "Physics Solver", href: "/study/physics-solver" },
      { label: "Quiz Generator", href: "/study/quiz-generator" },
    ],
  },
  {
    label: "AI Tools",
    dropdown: [
      { label: "Image To Text", href: "/tools/image-to-text" },
      { label: "Image Translator", href: "/tools/image-translator" },
      { label: "Passport/ID Card Scanner", href: "/tools/id-scanner" },
      { label: "AI Receipt & Invoice Scanner", href: "/tools/receipt-invoice-scanner" },
    ],
  },
  {
    label: "AI Photo",
    dropdown: [
      { label: "Convert to Studio Ghibili", href: "/photo/ghibli" },
      { label: "Convert to Action Figure", href: "/photo/action-figure" },
      { label: "Convert Pet to Human", href: "/photo/pet-to-human" },
      { label: "Convert Photo to Watercolor", href: "/photo/watercolor" },
      { label: "More Styles", href: "/photo/more-styles" },
    ],
  },
];

export default function SharedNav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 dark:bg-gray-900/90 backdrop-blur-md shadow-sm" : "bg-transparent dark:bg-black/90"
      }`}
    >
      <div ref={navRef} className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center">
            <div className="h-10 w-10 mr-2">
              <Image src="/logo.png" alt="ChatAI Logo" width={40} height={40} />
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-white">ChatAI</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/blogs"
              className="font-semibold text-lg text-gray-900 dark:text-white hover:text-purple-700 transition"
            >
              Blogs
            </Link>
            <Link
              href="/pricing"
              className="font-semibold text-lg text-gray-900 dark:text-white hover:text-purple-700 transition"
            >
              Pricing
            </Link>
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="relative">
                {item.dropdown ? (
                  <>
                    <button
                      className="flex items-center font-semibold text-lg text-gray-900 dark:text-white focus:outline-none transition"
                      type="button"
                      onClick={() =>
                        setOpenDropdown(openDropdown === item.label ? null : item.label)
                      }
                    >
                      {item.label}
                      <ChevronDown className="ml-1 w-4 h-4" />
                    </button>
                    {openDropdown === item.label && (
                      <div
                        className="absolute left-0 mt-2 min-w-[220px] bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 py-2 z-50 transition-all duration-150 block"
                      >
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            className="block px-5 py-2 text-gray-800 dark:text-gray-100 hover:bg-purple-50 dark:hover:bg-gray-800 text-base whitespace-nowrap"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href || '#'}
                    className="font-semibold text-lg text-gray-900 dark:text-white hover:text-purple-700 transition"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="/login"
            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border dark:border-gray-700 rounded-full px-4 py-2 flex items-center transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <span>Get Started</span>
          </Link>
          <button
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 dark:border dark:border-gray-700"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-yellow-300"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
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
      </div>
    </header>
  )
}
