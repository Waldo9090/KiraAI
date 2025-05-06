import Image from "next/image"
import { Send, Bot, Sparkles } from "lucide-react"

export default function ChatPage() {
  return (
    <div className="min-h-screen dark:bg-gray-950">
      <header className="bg-gradient-to-b from-pink-50 to-white dark:from-gray-900 dark:to-gray-950 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 dark:text-white">Converse with Kira AI</h1>
          <p className="text-xl max-w-2xl dark:text-gray-300">Interact with our cutting-edge AI models for intelligent conversations.</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-16 border dark:border-gray-700">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 border-b dark:border-gray-600 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center mr-3">
                  <Bot className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                </div>
                <div>
                  <h3 className="font-medium dark:text-white">Kira AI</h3>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Sparkles className="h-3 w-3 mr-1" />
                    <span>Powered by GPT-4</span>
                  </div>
                </div>
              </div>
              <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </button>
            </div>

            <div className="h-96 overflow-y-auto p-4 space-y-4 dark:bg-gray-800">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <Bot className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-[80%]">
                  <p className="dark:text-gray-200">Hello! I'm Kira, your AI assistant. How can I help you today?</p>
                </div>
              </div>

              <div className="flex items-start justify-end">
                <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-3 max-w-[80%]">
                  <p className="dark:text-gray-200">
                    Can you help me write a professional email to a client about a project delay?
                  </p>
                </div>
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
                  <Image src="/placeholder.svg?height=32&width=32" alt="User avatar" width={32} height={32} />
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <Bot className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-[80%]">
                  <p className="dark:text-gray-200">
                    Here's a professional email template for communicating a project delay:
                  </p>
                  <p className="mt-2 dark:text-gray-200">Subject: Project Timeline Update - [Project Name]</p>
                  <p className="mt-2 dark:text-gray-200">Dear [Client Name],</p>
                  <p className="mt-2 dark:text-gray-200">
                    I hope this email finds you well. I'm writing to provide an update regarding our ongoing project,
                    [Project Name].
                  </p>
                  <p className="mt-2 dark:text-gray-200">
                    I want to inform you that we're experiencing a slight delay in our originally planned timeline. Due
                    to [brief explanation of reason: e.g., unforeseen technical challenges, additional requirements that
                    emerged during development], we anticipate the project completion date will be extended by
                    [timeframe, e.g., two weeks].
                  </p>
                  <p className="mt-2 dark:text-gray-200">
                    We understand the importance of this project to your business and want to assure you that our team
                    is working diligently to minimize any impact. The new projected completion date is [new date].
                  </p>
                  <p className="mt-2 dark:text-gray-200">
                    Would you be available for a brief call this week to discuss the adjusted timeline and answer any
                    questions you might have? I'm happy to provide more details about our progress and the steps we're
                    taking to ensure quality delivery.
                  </p>
                  <p className="mt-2 dark:text-gray-200">Thank you for your understanding and continued partnership.</p>
                  <p className="dark:text-gray-200">
                    Best regards,
                    <br />
                    [Your Name]
                    <br />
                    [Your Position]
                    <br />
                    [Your Contact Information]
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t dark:border-gray-600 dark:bg-gray-800">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 border dark:border-gray-600 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                />
                <button className="bg-pink-500 hover:bg-pink-600 text-white rounded-r-lg px-4 py-2 transition-colors">
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 dark:text-white">Supported AI Models</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                    <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                  </div>
                  <h3 className="font-semibold dark:text-white">GPT-4</h3>
                </div>
                \
