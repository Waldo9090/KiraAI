import Link from "next/link"
import { Users, Shield, Zap, BarChart } from "lucide-react"

export default function TeamsPage() {
  return (
    <div className="min-h-screen">
      <header className="bg-gradient-to-b from-pink-50 to-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Kira AI for Organizations</h1>
          <p className="text-xl max-w-2xl">Boost your team's efficiency with collaborative AI tools.</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Why Organizations Choose Kira AI</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Centralized Management</h3>
                <p className="text-gray-600">
                  Manage all team members from a single dashboard. Add or remove users with just a few clicks.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Enterprise-Grade Security</h3>
                <p className="text-gray-600">
                  Keep your data secure with SSO, role-based access control, and enterprise-grade encryption.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Shared Resources</h3>
                <p className="text-gray-600">
                  Share prompts, templates, and AI-generated content across your team to maintain consistency.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <BarChart className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Usage Analytics</h3>
                <p className="text-gray-600">
                  Track usage patterns and optimize your team's AI workflow with detailed analytics.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Organization Plans</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold mb-2">Team</h3>
                <p className="text-gray-600 mb-6">For small to medium-sized teams</p>
                <div className="text-4xl font-bold mb-2">
                  $19.99<span className="text-gray-400 text-base font-normal">/user/month</span>
                </div>
                <p className="text-gray-500 mb-6">Billed annually</p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>5-50 team members</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>All Pro features</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Team dashboard</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Shared templates</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Basic analytics</span>
                  </li>
                </ul>

                <Link
                  href="#"
                  className="block text-center py-2 px-4 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition-colors"
                >
                  Get Started
                </Link>
              </div>

              <div className="bg-white p-8 rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                <p className="text-gray-600 mb-6">For large organizations</p>
                <div className="text-4xl font-bold mb-2">Custom</div>
                <p className="text-gray-500 mb-6">Contact sales for pricing</p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Unlimited team members</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>All Team features</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>SSO integration</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Advanced security controls</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Dedicated account manager</span>
                  </li>
                </ul>

                <Link
                  href="#"
                  className="block text-center py-2 px-4 border border-pink-500 text-pink-500 rounded-lg font-medium hover:bg-pink-50 transition-colors"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">How Organizations Leverage Kira AI</h2>

            <div className="space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Marketing Teams</h3>
                <p className="text-gray-600 mb-4">
                  Marketing teams use Kira to generate content ideas, write copy, and analyze campaign performance. With
                  shared templates, teams can maintain a consistent brand voice across all channels.
                </p>
                <div className="text-sm text-purple-600 font-medium">
                  "Kira has transformed our content creation process. We're producing twice as much content in half the
                  time." - Marketing Director at TechCorp
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Customer Support</h3>
                <p className="text-gray-600 mb-4">
                  Support teams use Kira to draft responses, summarize customer issues, and access knowledge base
                  information quickly. This leads to faster response times and higher customer satisfaction.
                </p>
                <div className="text-sm text-purple-600 font-medium">
                  "Our average response time has decreased by 40% since implementing Kira across our support team." -
                  Support Manager at ServicePro
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Research & Development</h3>
                <p className="text-gray-600 mb-4">
                  R&D teams use Kira to analyze research papers, generate hypotheses, and document findings. The AI
                  assistant helps researchers stay on the cutting edge of their field.
                </p>
                <div className="text-sm text-purple-600 font-medium">
                  "Kira has become an indispensable research partner for our team. It helps us process information
                  faster and make connections we might have missed." - Lead Researcher at BioInnovate
                </div>
              </div>
            </div>
          </section>

          <section className="bg-purple-50 p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to elevate your team?</h2>
            <p className="text-gray-600 mb-6">
              Join countless organizations already enhancing their workflow with Kira AI.
            </p>
            <Link
              href="#"
              className="inline-block bg-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-600 transition-colors"
            >
              Schedule a Demo
            </Link>
          </section>
        </div>
      </main>
    </div>
  )
}
