"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"

export default function SharedNav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  // Single dropdown state
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
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

  // Close dropdown if clicking outside
  useEffect(() => {
    if (!openDropdown) return;
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  // Helper for dropdown logic
  const dropdownProps = (key: string) => ({
    onMouseEnter: () => setOpenDropdown(key),
  });
  const isDropdownOpen = (key: string) => openDropdown === key;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 dark:bg-gray-900/90 backdrop-blur-md shadow-sm" : "bg-transparent dark:bg-black/90"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center" ref={navRef} onMouseLeave={() => setOpenDropdown(null)}>
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center">
            <div className="h-10 w-10 mr-2">
              <Image src="/logo.png" alt="ChatAI Logo" width={40} height={40} />
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-white">ChatAI</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {/* <Link href="/product" className="text-gray-700 dark:text-gray-200 hover:opacity-80">
              Product
            </Link> */}
            <Link href="/pricing" className="text-gray-700 dark:text-gray-200 hover:opacity-80">
              Pricing
            </Link>
            <Link href="/blogs" className="text-gray-700 dark:text-gray-200 hover:opacity-80">
              Blog
            </Link>
            {/* <Link href="/chat" className="text-gray-700 dark:text-gray-200 hover:opacity-80">
              Kira
            </Link> */}
          </nav>
        </div>

        {/* --- New AI Tools Nav Bar --- */}
        <div className="hidden md:flex items-center space-x-2 mr-4">
          {/* AI Chat Dropdown */}
          <div className="relative" {...dropdownProps("aiChat")}> 
            <button
              className={
                "px-3 py-1 rounded-md font-medium text-gray-800 dark:text-white transition flex items-center" +
                (isDropdownOpen("aiChat") ? " bg-purple-100 dark:bg-purple-800/50" : "")
              }
              onClick={e => {
                e.preventDefault();
                setOpenDropdown(isDropdownOpen("aiChat") ? null : "aiChat");
              }}
              aria-haspopup="true"
              aria-expanded={isDropdownOpen("aiChat")}
            >
              AI Chat <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isDropdownOpen("aiChat") && (
              <div className="absolute left-0 mt-2 w-40 bg-white dark:bg-gray-900 rounded shadow-lg z-50">
                <Link href="/chat" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">Chat Home</Link>
                <Link href="/chat/new" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">New Chat</Link>
              </div>
            )}
          </div>
          {/* AI PDF Dropdown */}
          <div className="relative" {...dropdownProps("aiPDF")}> 
            <button
              className={
                "px-3 py-1 rounded-md font-medium text-gray-800 dark:text-white transition flex items-center" +
                (isDropdownOpen("aiPDF") ? " bg-purple-100 dark:bg-purple-800/50" : "")
              }
              onClick={e => {
                e.preventDefault();
                setOpenDropdown(isDropdownOpen("aiPDF") ? null : "aiPDF");
              }}
              aria-haspopup="true"
              aria-expanded={isDropdownOpen("aiPDF")}
            >
              AI PDF <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isDropdownOpen("aiPDF") && (
              <div className="absolute left-0 mt-2 w-40 bg-white dark:bg-gray-900 rounded shadow-lg z-50">
                <Link href="/pdf" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">PDF Home</Link>
                <Link href="/pdf/summarize" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">Summarize PDF</Link>
              </div>
            )}
          </div>
          {/* AI YouTube */}
          <Link href="/youtube" className="px-3 py-1 rounded-md font-medium text-gray-800 dark:text-white hover:bg-purple-100 dark:hover:bg-purple-800/50 transition">AI YouTube</Link>
          {/* AI Writer Dropdown */}
          <div className="relative" {...dropdownProps("aiWriter")}> 
            <button
              className={
                "px-3 py-1 rounded-md font-medium text-gray-800 dark:text-white transition flex items-center" +
                (isDropdownOpen("aiWriter") ? " bg-purple-100 dark:bg-purple-800/50" : "")
              }
              onClick={e => {
                e.preventDefault();
                setOpenDropdown(isDropdownOpen("aiWriter") ? null : "aiWriter");
              }}
              aria-haspopup="true"
              aria-expanded={isDropdownOpen("aiWriter")}
            >
              AI Writer <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isDropdownOpen("aiWriter") && (
              <div className="absolute left-0 mt-2 w-40 bg-white dark:bg-gray-900 rounded shadow-lg z-50">
                <Link href="/writer" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">Writer Home</Link>
                <Link href="/writer/blog" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">Blog Writer</Link>
                <Link href="/writer/email" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">Email Writer</Link>
              </div>
            )}
          </div>
          {/* AI Study Dropdown */}
          <div className="relative" {...dropdownProps("aiStudy")}> 
            <button
              className={
                "px-3 py-1 rounded-md font-medium text-gray-800 dark:text-white transition flex items-center" +
                (isDropdownOpen("aiStudy") ? " bg-purple-100 dark:bg-purple-800/50" : "")
              }
              onClick={e => {
                e.preventDefault();
                setOpenDropdown(isDropdownOpen("aiStudy") ? null : "aiStudy");
              }}
              aria-haspopup="true"
              aria-expanded={isDropdownOpen("aiStudy")}
            >
              AI Study <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isDropdownOpen("aiStudy") && (
              <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded shadow-lg z-50">
                <Link href="/ai-translator" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">AI Translator</Link>
                <Link href="/math-solver" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">Math Solver</Link>
                <Link href="/flashcard-maker" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">Flashcard Maker</Link>
                <Link href="/math-homework-assistant" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">Math Homework Assistant</Link>
                <Link href="/physics-solver" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">Physics Solver</Link>
                <Link href="/quiz-generator" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">Quiz Generator</Link>
              </div>
            )}
          </div>
          {/* AI Tools Dropdown */}
          <div className="relative" {...dropdownProps("aiTools")}> 
            <button
              className={
                "px-3 py-1 rounded-md font-medium text-gray-800 dark:text-white transition flex items-center" +
                (isDropdownOpen("aiTools") ? " bg-purple-100 dark:bg-purple-800/50" : "")
              }
              onClick={e => {
                e.preventDefault();
                setOpenDropdown(isDropdownOpen("aiTools") ? null : "aiTools");
              }}
              aria-haspopup="true"
              aria-expanded={isDropdownOpen("aiTools")}
            >
              AI Tools <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isDropdownOpen("aiTools") && (
              <div className="absolute left-0 mt-2 w-40 bg-white dark:bg-gray-900 rounded shadow-lg z-50">
                <Link href="/tools" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">Tools Home</Link>
                <Link href="/tools/seo" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">SEO Tools</Link>
                <Link href="/tools/analytics" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">Analytics</Link>
              </div>
            )}
          </div>
          {/* AI Photo Dropdown */}
          <div className="relative" {...dropdownProps("aiPhoto")}> 
            <button
              className={
                "px-3 py-1 rounded-md font-medium text-gray-800 dark:text-white transition flex items-center" +
                (isDropdownOpen("aiPhoto") ? " bg-purple-100 dark:bg-purple-800/50" : "")
              }
              onClick={e => {
                e.preventDefault();
                setOpenDropdown(isDropdownOpen("aiPhoto") ? null : "aiPhoto");
              }}
              aria-haspopup="true"
              aria-expanded={isDropdownOpen("aiPhoto")}
            >
              AI Photo <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isDropdownOpen("aiPhoto") && (
              <div className="absolute left-0 mt-2 w-40 bg-white dark:bg-gray-900 rounded shadow-lg z-50">
                <Link href="/photo" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">Photo Home</Link>
                <Link href="/photo/edit" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">Photo Editor</Link>
                <Link href="/photo/generate" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">Image Generator</Link>
              </div>
            )}
          </div>
        </div>
        {/* --- End AI Tools Nav Bar --- */}

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
