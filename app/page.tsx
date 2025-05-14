"use client"

import { useState, useEffect, useRef, ForwardRefExoticComponent, RefAttributes } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Send,
  X,
  Clock,
  MessageCircle,
  FileText,
  Pencil,
  Search,
  Globe,
  PaintbrushIcon as PaintBrush,
  Bot,
  Zap,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  BarChart2,
  BookOpen,
  Code,
  MessageSquareIcon,
  Users,
  BookOpenCheck,
  Lightbulb,
  TrendingUp,
  ClipboardList,
  FlaskConical,
  Palette,
  Target,
  Wand2,
  Terminal,
  GitBranch,
  Database,
  Bug,
  Megaphone,
  PenTool,
  UserCheck,
  Headset,
  Smile,
  ThumbsUp,
  LucideProps,
  Mail,
} from "lucide-react"
import SharedNav from "./shared-nav"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

// --- Define Interfaces and Data for Professionals Section ---
interface RoleDetail {
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  name: string;
  description: string;
}

const expertRoleDetails = {
  Entrepreneur: [
    { icon: TrendingUp, name: "Market Opportunity Finder", description: "Identifies and analyzes potential market gaps and growth opportunities." },
    { icon: Lightbulb, name: "Strategic Planning Assistant", description: "Helps formulate business strategies and action plans for new ventures." },
    { icon: ClipboardList, name: "Pitch Deck Enhancer", description: "Refines investor pitch decks, ensuring clarity and impact." },
    { icon: Users, name: "Networking Connector", description: "Suggests potential collaborators, mentors, or investors based on goals." },
  ],
  "Data Specialist": [
    { icon: BarChart2, name: "Data Interpretation Specialist", description: "Analyzes complex datasets to extract key insights and trends." },
    { icon: BookOpenCheck, name: "Report Generation Expert", description: "Automates the creation of detailed analytical reports and summaries." },
    { icon: Clock, name: "Predictive Modeling Tool", description: "Builds forecast models based on historical data and market indicators." },
    { icon: Search, name: "Competitive Intelligence Gatherer", description: "Monitors competitors and benchmarks performance metrics." },
  ],
  "Knowledge Seeker": [
    { icon: BookOpen, name: "Literature Review Synthesizer", description: "Summarizes and synthesizes information from academic papers and articles." },
    { icon: FlaskConical, name: "Experiment Design Advisor", description: "Assists in designing research methodologies and experiments." },
    { icon: Database, name: "Knowledge Base Manager", description: "Organizes and retrieves information from vast knowledge bases." },
    { icon: FileText, name: "Grant Writing Assistant", description: "Helps structure and write compelling research grant proposals." },
  ],
  "Software Engineer": [
    { icon: Code, name: "Code Generation & Optimization", description: "Generates boilerplate code and suggests performance optimizations." },
    { icon: Bug, name: "Debugging Assistant", description: "Helps identify and resolve bugs by analyzing code and error logs." },
    { icon: GitBranch, name: "API Integration Helper", description: "Provides guidance on integrating various APIs and services." },
    { icon: Terminal, name: "Documentation Writer", description: "Generates documentation snippets based on code comments and structure." },
  ],
  "Growth Expert": [
    { icon: Megaphone, name: "Campaign Idea Generator", description: "Brainstorms creative marketing campaign ideas and angles." },
    { icon: Target, name: "Audience Segmentation Tool", description: "Helps define and segment target audiences for campaigns." },
    { icon: PenTool, name: "Copywriting Assistant", description: "Generates engaging marketing copy for ads, emails, and social media." },
    { icon: Mail, name: "Email Marketing Optimizer", description: "Suggests improvements for email subject lines, content, and timing." },
  ],
  "Customer Service": [
    { icon: Headset, name: "Support Ticket Summarizer", description: "Quickly summarizes long customer support threads to identify key issues." },
    { icon: Smile, name: "Empathetic Response Generator", description: "Crafts polite and empathetic responses to customer inquiries." },
    { icon: UserCheck, name: "FAQ Builder", description: "Identifies common questions and helps generate comprehensive FAQ answers." },
    { icon: ThumbsUp, name: "Feedback Analysis Tool", description: "Analyzes customer feedback to identify areas for service improvement." },
  ],
}

type ExpertTypeName = keyof typeof expertRoleDetails;
// --- End Definitions ---

export default function Home() {
  const router = useRouter()
  const [showBanner, setShowBanner] = useState(true)
  const [cyclingWord, setCyclingWord] = useState("answers")
  const [activeExpert, setActiveExpert] = useState<ExpertTypeName>("Entrepreneur")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [inputValue, setInputValue] = useState("")

  // --- Define expertTypes array using new icons ---
  const expertTypes: { name: ExpertTypeName; icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>> }[] = [
    { name: "Entrepreneur", icon: Briefcase },
    { name: "Data Specialist", icon: BarChart2 },
    { name: "Knowledge Seeker", icon: BookOpen },
    { name: "Software Engineer", icon: Code },
    { name: "Growth Expert", icon: Megaphone },
    { name: "Customer Service", icon: Headset },
  ]
  // --- End expertTypes definition ---

  // Refs for animation elements
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const expertsRef = useRef<HTMLDivElement>(null)
  const faqRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const words = ["answers", "essays", "diagrams", "emails", "discussions"]
    let index = 0

    const interval = setInterval(() => {
      index = (index + 1) % words.length
      setCyclingWord(words[index])
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const elements = [heroRef, featuresRef, expertsRef, faqRef]
      elements.forEach((ref) => {
        if (ref.current) {
          const top = ref.current.getBoundingClientRect().top
          const windowHeight = window.innerHeight
          if (top < windowHeight * 0.75) {
            ref.current.classList.add("animate-fadeInUp")
            ref.current.classList.remove("opacity-0")
          }
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  // Get current roles based on active expert
  const currentRoles = expertRoleDetails[activeExpert] || expertRoleDetails["Entrepreneur"]

  const handleInputSubmit = () => {
    if (inputValue.trim()) {
      const encodedPrompt = encodeURIComponent(inputValue.trim())
      router.push(`/dashboard/new?prompt=${encodedPrompt}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleInputSubmit()
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-50 via-white to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-950 transition-colors duration-300">
      {/* Top Banner */}
      {showBanner && (
        <div className="bg-purple-200 dark:bg-purple-900/30 py-3 px-4 flex justify-between items-center">
          <div className="flex-1 text-center">
            <span className="text-sm dark:text-white">Try OpenAI's latest and smartest model of</span>
            <Link href="#" className="ml-2 text-sm font-medium dark:text-white hover:underline">
              Try it now →
            </Link>
          </div>
          <button onClick={() => setShowBanner(false)} aria-label="Close banner">
            <X className="h-4 w-4 dark:text-white" />
          </button>
        </div>
      )}

      <SharedNav />

      <main className="flex-1">
        <section className="py-16 px-4" ref={heroRef}>
          <div className="max-w-3xl mx-auto text-center mb-8 animate-fadeIn">
             <h1 className="text-5xl md:text-6xl font-bold mb-4 dark:text-white">
               <span className="block">ChatAI: Prompt for </span>
               <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 animate-gradient">
                 {cyclingWord}
               </span>
             </h1>

            <div className="relative max-w-2xl mx-auto mt-12 mb-12">
              <div className="flex items-center border-2 rounded-full p-2 pl-4 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm">
                <div className="text-purple-500 mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                    <path d="M7 20.5a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0Z" />
                    <path d="M21 3v0" />
                  </svg>
                </div>
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Write a haiku about climate change"
                  className="flex-1 outline-none text-lg text-gray-700 dark:text-gray-200 dark:bg-gray-800"
                />
                <Button 
                  size="icon" 
                  className="rounded-full bg-gray-900 dark:bg-gray-200 text-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-300 w-10 h-10"
                  onClick={handleInputSubmit}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section
          className="py-16 px-4 bg-gradient-to-b from-white to-pink-50 dark:from-gray-950 dark:to-gray-900"
          ref={featuresRef}
        >
          <div className="max-w-6xl mx-auto animate-fadeIn transition-all duration-700">
            <h2 className="text-4xl font-bold text-center mb-16 font-sans dark:text-white">One Platform, Infinite Capabilities</h2>

            <div className="grid grid-cols-4 md:grid-cols-8 gap-8 mb-12">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-indigo-600 dark:text-purple-300" />
                </div>
                <h3 className="font-medium text-indigo-600 dark:text-purple-300">Intelligent Chat</h3>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-indigo-600 dark:text-purple-300" />
                </div>
                <h3 className="font-medium text-indigo-600 dark:text-purple-300">Smart Summaries</h3>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mb-4">
                  <Pencil className="h-6 w-6 text-indigo-600 dark:text-purple-300" />
                </div>
                <h3 className="font-medium text-indigo-600 dark:text-purple-300">Effortless Writing</h3>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-indigo-600 dark:text-purple-300" />
                </div>
                <h3 className="font-medium text-indigo-600 dark:text-purple-300">AI-Powered Search</h3>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-indigo-600 dark:text-purple-300" />
                </div>
                <h3 className="font-medium text-indigo-600 dark:text-purple-300">Global Translation</h3>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mb-4">
                  <PaintBrush className="h-6 w-6 text-indigo-600 dark:text-purple-300" />
                </div>
                <h3 className="font-medium text-indigo-600 dark:text-purple-300">Creative Art Generation</h3>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mb-4">
                  <Bot className="h-6 w-6 text-indigo-600 dark:text-purple-300" />
                </div>
                <h3 className="font-medium text-indigo-600 dark:text-purple-300">Custom Bot Building</h3>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-indigo-600 dark:text-purple-300" />
                </div>
                <h3 className="font-medium text-indigo-600 dark:text-purple-300">AI PowerUps</h3>
              </div>
            </div>

            <p className="text-center text-lg mb-12 dark:text-gray-300">Your central hub for leveraging the world's best AI.</p>
          </div>
        </section>

        <section className="py-16 px-4 dark:bg-gray-950" ref={expertsRef}>
          <div className="max-w-6xl mx-auto animate-fadeIn transition-all duration-700">
            <h2 className="text-4xl font-bold text-center mb-16 font-sans dark:text-white">Empowering Professionals.</h2>

            <div className="flex flex-wrap justify-center gap-8 mb-16">
              {expertTypes.map((expert) => {
                const Icon = expert.icon
                const isActive = expert.name === activeExpert
                return (
                  <button
                    key={expert.name}
                    onClick={() => setActiveExpert(expert.name)}
                    className="flex flex-col items-center transition-all duration-200 transform hover:scale-105 w-24 text-center"
                  >
                    <div
                      className={`w-12 h-12 ${isActive ? "bg-indigo-100 dark:bg-purple-900/50" : "bg-gray-100 dark:bg-gray-800"} rounded-full flex items-center justify-center mb-2 transition-colors`}
                    >
                      <Icon className={`h-6 w-6 ${isActive ? "text-indigo-600 dark:text-purple-300" : "text-gray-600 dark:text-gray-400"} transition-colors`} />
                    </div>
                    <span className={`${isActive ? "text-indigo-600 dark:text-purple-300" : "text-gray-600 dark:text-gray-400"} font-medium text-sm transition-colors`}>
                      {expert.name}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8 transform hover:shadow-lg transition-all duration-300">
              <div className="grid md:grid-cols-2 gap-8">
                {currentRoles.map((role: RoleDetail, index: number) => {
                  const RoleIcon = role.icon;
                  return (
                    <div key={index} className="flex gap-4">
                      <div className="w-10 h-10 bg-indigo-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <RoleIcon className="h-5 w-5 text-indigo-600 dark:text-purple-300" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-2 dark:text-white">{role.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {role.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section
          className="py-16 px-4 bg-gradient-to-b from-white to-pink-50 dark:from-gray-950 dark:to-gray-900"
          ref={faqRef}
        >
          <div className="max-w-3xl mx-auto animate-fadeIn transition-all duration-700">
            <h2 className="text-3xl font-bold text-center mb-12 font-sans dark:text-white">Common Questions</h2>

            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden">
                <button
                  className="w-full text-left p-6 flex justify-between items-center focus:outline-none"
                  onClick={() => toggleFaq(0)}
                >
                  <h3 className="font-medium text-lg dark:text-white">What is ChatAI?</h3>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform ${expandedFaq === 0 ? 'transform rotate-180' : ''}`}
                  />
                </button>
                {expandedFaq === 0 && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 dark:text-gray-300">
                      ChatAI is an all-in-one AI assistant, powered by Kira AI technology. It helps you with various tasks like writing, summarizing,
                      translating, and more, integrating AI assistance wherever you need it.
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden">
                <button className="w-full text-left p-6 flex justify-between items-center focus:outline-none" onClick={() => toggleFaq(1)}>
                  <h3 className="font-medium text-lg dark:text-white">How much does ChatAI cost?</h3>
                  <ChevronDown className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform ${expandedFaq === 1 ? 'transform rotate-180' : ''}`} />
                </button>
                {expandedFaq === 1 && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 dark:text-gray-300">
                      ChatAI offers both free and premium plans. The free plan provides access to essential features, while premium plans start at $9.99/month and unlock additional capabilities, higher usage limits, and access to more advanced AI models.
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden">
                <button className="w-full text-left p-6 flex justify-between items-center focus:outline-none" onClick={() => toggleFaq(2)}>
                  <h3 className="font-medium text-lg dark:text-white">Which AI models does ChatAI support?</h3>
                  <ChevronDown className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform ${expandedFaq === 2 ? 'transform rotate-180' : ''}`} />
                </button>
                {expandedFaq === 2 && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 dark:text-gray-300">
                      ChatAI provides access to a wide range of AI models, including leading options like GPT-4, Claude, Gemini Pro, and others (leveraging powerful Kira AI technology). The specific models available depend on your subscription plan.
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden">
                <button className="w-full text-left p-6 flex justify-between items-center focus:outline-none" onClick={() => toggleFaq(3)}>
                  <h3 className="font-medium text-lg dark:text-white">Is my data secure with ChatAI?</h3>
                  <ChevronDown className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform ${expandedFaq === 3 ? 'transform rotate-180' : ''}`} />
                </button>
                {expandedFaq === 3 && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 dark:text-gray-300">
                      Yes, ChatAI takes data security seriously. We don't store your conversations or data unless you explicitly save them. All data transmission is encrypted, and we comply with major privacy regulations to protect your information.
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden">
                <button className="w-full text-left p-6 flex justify-between items-center focus:outline-none" onClick={() => toggleFaq(4)}>
                  <h3 className="font-medium text-lg dark:text-white">How do I get started with ChatAI?</h3>
                  <ChevronDown className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform ${expandedFaq === 4 ? 'transform rotate-180' : ''}`} />
                </button>
                {expandedFaq === 4 && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 dark:text-gray-300">
                      Getting started is easy! Sign up for ChatAI. You can use our web interface directly.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
