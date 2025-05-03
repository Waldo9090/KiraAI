"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

export default function SharedNav() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center">
            <div className="h-10 w-10 mr-2">
              <Image src="/logo.png" alt="Kira AI Logo" width={40} height={40} />
            </div>
            <span className={`text-xl font-bold ${isScrolled ? "text-gray-800" : "text-gray-800"}`}>Kira AI</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/product" className={`hover:opacity-80 ${isScrolled ? "text-gray-700" : "text-gray-700"}`}>
              Product
            </Link>
            <Link href="/pricing" className={`hover:opacity-80 ${isScrolled ? "text-gray-700" : "text-gray-700"}`}>
              Pricing
            </Link>
            <Link href="/chat" className={`hover:opacity-80 ${isScrolled ? "text-gray-700" : "text-gray-700"}`}>
              Kira
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard"
            className="bg-white text-gray-800 border rounded-full px-4 py-2 flex items-center transition-colors hover:bg-gray-50"
          >
            <span>Get Started</span>
          </Link>
          <button className={`p-2 rounded-full ${isScrolled ? "bg-gray-100" : "bg-white/80"}`}>
            <span className="sr-only">Toggle theme</span>
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
          </button>
        </div>
      </div>
    </header>
  )
}
