import Link from "next/link"
import { Check } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <header className="bg-gradient-to-b from-pink-50 to-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Clear, Straightforward Plans</h1>
          <p className="text-xl max-w-2xl">Select the perfect option for your needs and get started with Kira AI.</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-gray-100 p-1 rounded-full">
              <button className="px-4 py-2 rounded-full bg-white shadow-sm font-medium text-pink-600">Monthly</button>
              <button className="px-4 py-2 rounded-full text-gray-700 font-medium">Annual (Save 20%)</button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white p-8 rounded-lg border border-gray-200 flex flex-col">
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <p className="text-gray-600 mb-6">Basic AI assistance for casual users</p>
              <div className="text-4xl font-bold mb-6">
                $0<span className="text-gray-400 text-base font-normal">/month</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Access to basic AI models</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>25 messages per day</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Standard response speed</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Basic writing assistance</span>
                </li>
              </ul>

              <Link
                href="#"
                className="text-center py-2 px-4 border border-pink-500 text-pink-500 rounded-lg font-medium hover:bg-pink-50 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white p-8 rounded-lg border-2 border-purple-600 flex flex-col relative">
              <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                POPULAR
              </div>
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <p className="text-gray-600 mb-6">Advanced features for professionals</p>
              <div className="text-4xl font-bold mb-6">
                $9.99<span className="text-gray-400 text-base font-normal">/month</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Access to advanced AI models</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Unlimited messages</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Priority response speed</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Advanced writing tools</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>AI image generation</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Document analysis</span>
                </li>
              </ul>

              <Link
                href="#"
                className="block text-center py-2 px-4 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Business Plan */}
            <div className="bg-white p-8 rounded-lg border border-gray-200 flex flex-col">
              <h3 className="text-xl font-bold mb-2">Business</h3>
              <p className="text-gray-600 mb-6">Enterprise-grade AI for teams</p>
              <div className="text-4xl font-bold mb-6">
                $29.99<span className="text-gray-400 text-base font-normal">/month</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Access to all AI models</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Unlimited messages</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Fastest response speed</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>All Pro features</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Team collaboration</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Admin dashboard</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Priority support</span>
                </li>
              </ul>

              <Link
                href="#"
                className="text-center py-2 px-4 border border-pink-500 text-pink-500 rounded-lg font-medium hover:bg-pink-50 transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </div>

          <div className="mt-16 bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Questions About Pricing</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-2">Can I switch plans later?</h3>
                <p className="text-gray-600">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be applied to your next billing
                  cycle.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Is there a free trial for paid plans?</h3>
                <p className="text-gray-600">
                  Yes, we offer a 7-day free trial for both Pro and Business plans. No credit card required.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600">
                  We accept all major credit cards, PayPal, and Apple Pay. For Business plans, we also offer invoice
                  payment.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
                <p className="text-gray-600">
                  Yes, you can cancel your subscription at any time. You'll continue to have access until the end of
                  your billing period.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
