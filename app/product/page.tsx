import Link from "next/link"

export default function ProductPage() {
  return (
    <div className="min-h-screen dark:bg-gray-950">
      <header className="bg-gradient-to-b from-pink-50 to-white dark:from-gray-900 dark:to-gray-950 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 dark:text-white">Kira AI Features</h1>
          <p className="text-xl max-w-2xl dark:text-gray-300">
            See how Kira AI enhances your productivity with intelligent assistance.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 dark:text-white">Key Capabilities</h2>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4 dark:text-white">AI Chat</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Chat with multiple AI models in one place. Get instant answers, creative ideas, and solutions to complex
                problems.
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Access to GPT-4, Claude, and Gemini Pro</li>
                <li>Contextual understanding</li>
                <li>Personalized responses</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4 dark:text-white">AI Writer</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Generate high-quality content for any purpose. From emails to blog posts, Kira AI helps you write better
                and faster.
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Multiple writing styles</li>
                <li>Grammar and style suggestions</li>
                <li>Content optimization</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4 dark:text-white">AI Translator</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Break language barriers with accurate translations. Communicate effectively in over 100 languages.
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Context-aware translations</li>
                <li>Idiomatic expressions</li>
                <li>Technical vocabulary support</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4 dark:text-white">AI Search</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Find information faster with AI-powered search. Get comprehensive answers with sources.
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Real-time web search</li>
                <li>Fact-checking</li>
                <li>Source citation</li>
              </ul>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-8 dark:text-white">Getting Started</h2>

          <div className="space-y-8 mb-16">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2">
                <div className="bg-gray-200 dark:bg-gray-800 rounded-lg h-64 w-full border dark:border-gray-700"></div>
              </div>
              <div className="md:w-1/2">
                <h3 className="text-xl font-semibold mb-4 dark:text-white">1. Install the Extension</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Add Kira AI to your browser with just a few clicks. Available for Chrome, Firefox, and Edge.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
              <div className="md:w-1/2">
                <div className="bg-gray-200 dark:bg-gray-800 rounded-lg h-64 w-full border dark:border-gray-700"></div>
              </div>
              <div className="md:w-1/2">
                <h3 className="text-xl font-semibold mb-4 dark:text-white">2. Access Anywhere</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Use Kira AI on any website or application. Just press the keyboard shortcut to activate.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2">
                <div className="bg-gray-200 dark:bg-gray-800 rounded-lg h-64 w-full border dark:border-gray-700"></div>
              </div>
              <div className="md:w-1/2">
                <h3 className="text-xl font-semibold mb-4 dark:text-white">3. Get Instant Results</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Ask questions, generate content, or analyze data. Kira AI provides instant, high-quality responses.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-gray-800 p-8 rounded-lg text-center border dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Ready to boost your productivity?</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Join the community of professionals who rely on Kira AI daily.
            </p>
            <Link
              href="/pricing"
              className="inline-block bg-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-600 transition-colors"
            >
              View Pricing Plans
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
