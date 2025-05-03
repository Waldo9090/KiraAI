import Link from "next/link"
import Image from "next/image"
import { Send, Bot, Sparkles, MessageCircle } from "lucide-react"

export default function ChatPage() {
  return (
    <div className="min-h-screen">
      <header className="bg-gradient-to-b from-pink-50 to-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Converse with Kira AI</h1>
          <p className="text-xl max-w-2xl">Interact with our cutting-edge AI models for intelligent conversations.</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-16">
            <div className="bg-gray-50 p-4 border-b flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                  <Bot className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-medium">Kira AI</h3>
                  <div className="flex items-center text-xs text-gray-500">
                    <Sparkles className="h-3 w-3 mr-1" />
                    <span>Powered by GPT-4</span>
                  </div>
                </div>
              </div>
              <button className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </button>
            </div>

            <div className="h-96 overflow-y-auto p-4 space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <Bot className="h-4 w-4 text-pink-600" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                  <p>Hello! I'm Kira, your AI assistant. How can I help you today?</p>
                </div>
              </div>

              <div className="flex items-start justify-end">
                <div className="bg-purple-100 rounded-lg p-3 max-w-[80%]">
                  <p>Can you help me write a professional email to a client about a project delay?</p>
                </div>
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
                  <Image src="/placeholder.svg?height=32&width=32" alt="User avatar" width={32} height={32} />
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <Bot className="h-4 w-4 text-pink-600" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                  <p>Here's a professional email template for communicating a project delay:</p>
                  <p className="mt-2">Subject: Project Timeline Update - [Project Name]</p>
                  <p className="mt-2">Dear [Client Name],</p>
                  <p className="mt-2">
                    I hope this email finds you well. I'm writing to provide an update regarding our ongoing project,
                    [Project Name].
                  </p>
                  <p className="mt-2">
                    I want to inform you that we're experiencing a slight delay in our originally planned timeline. Due
                    to [brief explanation of reason: e.g., unforeseen technical challenges, additional requirements that
                    emerged during development], we anticipate the project completion date will be extended by
                    [timeframe, e.g., two weeks].
                  </p>
                  <p className="mt-2">
                    We understand the importance of this project to your business and want to assure you that our team
                    is working diligently to minimize any impact. The new projected completion date is [new date].
                  </p>
                  <p className="mt-2">
                    Would you be available for a brief call this week to discuss the adjusted timeline and answer any
                    questions you might have? I'm happy to provide more details about our progress and the steps we're
                    taking to ensure quality delivery.
                  </p>
                  <p className="mt-2">Thank you for your understanding and continued partnership.</p>
                  <p className="mt-2">Best regards,</p>
                  <p>
                    [Your Name]
                    <br />
                    [Your Position]
                    <br />
                    [Your Contact Information]
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button className="bg-pink-500 text-white rounded-r-lg px-4 py-2 hover:bg-pink-600">
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Supported AI Models</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold">GPT-4</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  OpenAI's most advanced model, capable of complex reasoning and detailed instructions.
                </p>
                <div className="text-sm text-gray-500">Available on Pro and Business plans</div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <MessageCircle className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold">Claude 2</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Anthropic's assistant model known for its helpfulness, harmlessness, and honesty.
                </p>
                <div className="text-sm text-gray-500">Available on Pro and Business plans</div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                    <Bot className="h-5 w-5 text-teal-600" />
                  </div>
                  <h3 className="font-semibold">Gemini Pro</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Google's multimodal AI model with strong reasoning and coding capabilities.
                </p>
                <div className="text-sm text-gray-500">Available on all plans</div>
              </div>
            </div>
          </section>

          <section className="bg-purple-50 p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to start a conversation?</h2>
            <p className="text-gray-600 mb-6">
              Get Kira AI today and discover intelligent assistance at your fingertips.
            </p>
            <Link
              href="/"
              className="inline-block bg-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-600 transition-colors"
            >
              Install Kira
            </Link>
          </section>
        </div>
      </main>
    </div>
  )
}
