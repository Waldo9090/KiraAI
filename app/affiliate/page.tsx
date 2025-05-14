import Link from "next/link"
import { DollarSign, Users, BarChart, Gift } from "lucide-react"

export default function AffiliatePage() {
  return (
    <div className="min-h-screen">
      <header className="bg-gradient-to-b from-pink-50 to-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Kira AI Partner Program</h1>
          <p className="text-xl max-w-2xl">Generate income by sharing Kira AI with your network.</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Benefits of Becoming a Partner</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">High Commission Rates</h3>
                <p className="text-gray-600">
                  Earn 30% commission on all referred sales for the first year. That's up to $108 per referral!
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Growing Market</h3>
                <p className="text-gray-600">
                  AI tools are in high demand. Tap into a rapidly growing market with a product people love.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <BarChart className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Detailed Analytics</h3>
                <p className="text-gray-600">
                  Track your performance with our comprehensive dashboard. See clicks, conversions, and earnings in
                  real-time.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Gift className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Marketing Resources</h3>
                <p className="text-gray-600">
                  Get access to banners, email templates, and other marketing materials to help you promote Kira AI.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">How It Works</h2>

            <div className="space-y-12">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/3 flex justify-center">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center text-3xl font-bold text-purple-600">
                    1
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
                  <p className="text-gray-600 mb-4">
                    Complete our simple application form. We'll review your application and get back to you within 48
                    hours.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/3 flex justify-center">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center text-3xl font-bold text-purple-600">
                    2
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-semibold mb-2">Get Your Unique Link</h3>
                  <p className="text-gray-600 mb-4">
                    Once approved, you'll receive your unique affiliate link and access to our affiliate dashboard.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/3 flex justify-center">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center text-3xl font-bold text-purple-600">
                    3
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-semibold mb-2">Promote Kira</h3>
                  <p className="text-gray-600 mb-4">
                    Share your affiliate link on your website, social media, or email newsletter. Use our marketing
                    resources to maximize your impact.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/3 flex justify-center">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center text-3xl font-bold text-purple-600">
                    4
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-semibold mb-2">Earn Commissions</h3>
                  <p className="text-gray-600 mb-4">
                    Earn 30% commission on all referred sales. Commissions are paid monthly via PayPal or bank transfer.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-purple-50 p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to grow your income?</h2>
            <p className="text-gray-600 mb-6">
              Join our partner program now and earn rewards for each successful referral.
            </p>
            <Link
              href="#"
              className="inline-block bg-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-600 transition-colors"
            >
              Apply Now
            </Link>
          </section>
        </div>
      </main>
    </div>
  )
}
