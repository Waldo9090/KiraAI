"use client"

import { useState, useEffect, ForwardRefExoticComponent, RefAttributes } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Send,
  X,
  MessageCircle,
  FileText,
  Pencil,
  Search,
  Globe,
  PaintbrushIcon as PaintBrush,
  Bot,
  Zap,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  BarChart2,
  BookOpen,
  Code,
  MessageSquareIcon,
  Users,
  Clock,
  Mail,
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Define RoleDetail interface
interface RoleDetail {
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  name: string;
  description: string;
}

// Define role details for each expert type
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
  // Add other expert types if needed
}

// Define ExpertTypeName type
type ExpertTypeName = keyof typeof expertRoleDetails;

export default function Home() {
  const [showBanner, setShowBanner] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const [cyclingWord, setCyclingWord] = useState("answers")
  const [activeExpert, setActiveExpert] = useState<ExpertTypeName>("Entrepreneur")

  const expertTypes: { name: ExpertTypeName; icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>> }[] = [
    { name: "Entrepreneur", icon: Briefcase },
    { name: "Data Specialist", icon: BarChart2 },
    { name: "Knowledge Seeker", icon: BookOpen },
    { name: "Software Engineer", icon: Code },
    { name: "Growth Expert", icon: MessageSquareIcon },
    { name: "Customer Service", icon: Users },
  ]

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
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const currentRoles = expertRoleDetails[activeExpert] || expertRoleDetails["Entrepreneur"]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-pink-50 via-white to-white">
      {/* Top Banner */}
      {showBanner && (
        <div className="bg-purple-200 py-3 px-4 flex justify-between items-center">
          <div className="flex-1 text-center">
            <span className="text-sm">Try OpenAI's latest and smartest model of</span>
            <Link href="#" className="ml-2 text-sm font-medium">
              Try it now →
            </Link>
          </div>
          <button onClick={() => setShowBanner(false)} aria-label="Close banner">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Navigation */}
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
              href="/login"
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

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-5xl font-bold mb-4">
              <span className="block">Prompt for </span>
              <span className="italic">{cyclingWord}</span>
            </h1>

            <div className="relative max-w-xl mx-auto mt-12">
              <div className="flex items-center border rounded-full p-2 pl-4 bg-white shadow-sm">
                <div className="text-purple-500 mr-2">
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
                    <path d="M7 20.5a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0Z" />
                    <path d="M21 3v0" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Write a haiku about climate change"
                  className="flex-1 outline-none text-gray-700"
                />
                <Button size="sm" className="rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="text-center mt-8 mb-12">
            <p className="text-gray-700 mb-4">
              <span className="font-medium">Thousands of users worldwide</span>
              <span className="mx-4">|</span>
              <span className="font-medium">Available across platforms</span>
            </p>
          </div>
        </section>

        {/* All-in-one AI assistant Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-white to-pink-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">Complete AI solution</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="font-medium text-indigo-600">AI chat</h3>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="font-medium text-indigo-600">AI summary</h3>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <Pencil className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="font-medium text-indigo-600">AI writer</h3>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="font-medium text-indigo-600">AI search</h3>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="font-medium text-indigo-600">AI translator</h3>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <PaintBrush className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="font-medium text-indigo-600">AI art</h3>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <Bot className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="font-medium text-indigo-600">Bot platform</h3>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="font-medium text-indigo-600">AI PowerUP</h3>
              </div>
            </div>

            <p className="text-center text-lg mb-12">Access premium AI models in a single interface.</p>
          </div>
        </section>

        {/* Built for professionals Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">Designed for experts.</h2>

            <div className="flex flex-wrap justify-center gap-8 mb-16">
              {expertTypes.map((expert) => {
                const Icon = expert.icon
                const isActive = expert.name === activeExpert
                return (
                  <button
                    key={expert.name}
                    onClick={() => setActiveExpert(expert.name)}
                    className="flex flex-col items-center transition-all duration-200"
                  >
                    <div
                      className={`w-12 h-12 ${isActive ? "bg-indigo-100" : "bg-gray-100"} rounded-full flex items-center justify-center mb-2`}
                    >
                      <Icon className={`h-6 w-6 ${isActive ? "text-indigo-600" : "text-gray-600"}`} />
                    </div>
                    <span className={`${isActive ? "text-indigo-600" : "text-gray-600"} font-medium`}>
                      {expert.name}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Dynamic Roles based on activeExpert */}
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {currentRoles.map((role: RoleDetail, index: number) => {
                   const RoleIcon = role.icon;
                   return (
                      <div key={index} className="flex gap-4">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <RoleIcon className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">{role.name}</h3>
                          <p className="text-sm text-gray-600">
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

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-pink-50 to-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Common Questions</h2>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">What is Kira AI?</AccordionTrigger>
                <AccordionContent>
                  Kira AI is an all-in-one AI assistant that helps you with various tasks like writing, summarizing,
                  translating, and more. It integrates with your browser and other platforms to provide AI assistance
                  wherever you need it.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">How much does Kira AI cost?</AccordionTrigger>
                <AccordionContent>
                  Kira AI offers both free and premium plans. The free plan gives you access to basic features, while
                  premium plans start at $9.99/month and offer additional features, higher usage limits, and access to
                  more advanced AI models.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">Which AI models does Kira AI support?</AccordionTrigger>
                <AccordionContent>
                  Kira AI supports a wide range of AI models including GPT-4, Claude, Gemini Pro, and more. The specific
                  models available depend on your subscription plan.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">Is my data secure with Kira AI?</AccordionTrigger>
                <AccordionContent>
                  Yes, Kira AI takes data security seriously. We don't store your conversations or data unless you
                  explicitly save them. All data transmission is encrypted, and we comply with major privacy
                  regulations.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left">Can I use Kira AI on my mobile device?</AccordionTrigger>
                <AccordionContent>
                  Yes, Kira AI is available on mobile devices through our iOS and Android apps. You can download them
                  from the App Store or Google Play Store to access Kira AI's features on the go.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left">How do I get started with Kira AI?</AccordionTrigger>
                <AccordionContent>
                  Getting started is easy! Simply install the Kira AI extension from the Chrome Web Store, create an
                  account, and you're ready to go. You can also download our mobile apps or access Kira AI through our
                  web interface.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>
    </div>
  )
}
