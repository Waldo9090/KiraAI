"use client";

import Link from "next/link"
import Image from "next/image"; // For potential logos
import { Check, X, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from 'react'; // Import useEffect
import { useTheme } from "next-themes"; // Import useTheme
import { Card, CardContent } from "@/components/ui/card"; // Import Card components

// Assume placeholders for logos if actual URLs/components aren't available
const LogoPlaceholder = ({ name }: { name: string }) => (
  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
    {name.substring(0, 1)}
  </div>
);

export default function PricingPageV2() {
  const { theme, setTheme } = useTheme(); // Use the theme hook
  const [mounted, setMounted] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("annually");

  const proPrice = billingCycle === "annually" ? 19 : 29; // Example prices
  const teamsPrice = billingCycle === "annually" ? 15 : 19; // Example prices per seat

  const proFeatures = [
    "Unlimited messages & queries",
    "Access to all basic & advanced AI models (incl. Pro models)",
    "Full conversational memory",
    "Web access & live search results",
    "Saved prompt library & slash commands",
    "Document analysis (coming soon)",
    "Priority customer support",
  ];

  const otherTools = [
    { name: "Claude AI", price: 20, logo: <LogoPlaceholder name="C" /> },
    { name: "OpenAI", price: 20, logo: <LogoPlaceholder name="O" /> },
    { name: "Gemini Advanced", price: 20, logo: <LogoPlaceholder name="G" /> },
    { name: "Perplexity AI", price: 20, logo: <LogoPlaceholder name="P" /> },
    { name: "Poe AI", price: 20, logo: <LogoPlaceholder name="Poe" /> },
  ];

  const comparisonFeatures = [
     { 
      group: "Chat Capabilities", 
      items: [
        { name: "Real-time Web Browsing", free: "Limited", pro: true },
        { name: "Full Conversation Memory", free: "Limited", pro: true },
        { name: "Chat with PDF Documents", free: false, pro: "Coming Soon" },
        { name: "Saved Prompt Library Access", free: true, pro: true },
        { name: "Slash Command Prompt Insertion", free: true, pro: true },
        { name: "Spreadsheet Query & Analysis", free: false, pro: "Coming Soon" },
      ] 
    },
    { 
      group: "Content Generation", 
      items: [
        { name: "Standard Text Generation", free: true, pro: true },
        { name: "Advanced Writing & Editing Tools", free: false, pro: true },
        { name: "AI Image Generation (Stable Diffusion)", free: false, pro: "Coming Soon" },
      ] 
    },
     { 
      group: "AI Model Access", 
      items: [
        { name: "Standard Models (GPT 4o Mini, Llama 3 8B, etc.)", free: true, pro: true },
        { name: "Advanced Models (GPT 4.1, Claude 3 Opus, etc.)", free: false, pro: true },
        { name: "Exclusive Pro Models (Claude 3.7 Sonnet, etc.)", free: false, pro: true },
        { name: "Early Access to New & Experimental Models", free: false, pro: true },
      ] 
    },
  ];

  // Prevent hydration mismatch for theme toggle
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground"> {/* Use theme background/text */}
      {/* Header Section */}
      <header className="text-center py-16 md:py-24 px-4 relative">
        {/* Add Theme Toggle Button Here */} 
        {mounted && (
           <Button 
             variant="ghost" 
             size="icon"
             className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
             onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
             aria-label="Toggle theme"
           >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
           </Button>
        )}

        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
          Unlock Limitless AI Potential with <span className="text-purple-600 dark:text-purple-400">ChatAI Pro</span>
        </h1>
        {/* Optional Subtitle */}
        {/* <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Unlock the full potential of AI with our simple, powerful plans.</p> */}
      </header>

      {/* Toggle */}
      <div className="flex justify-center mb-12 md:mb-16 px-4">
        <div className="inline-flex bg-gray-100 dark:bg-gray-800 p-1 rounded-full text-sm font-medium">
          <button 
            onClick={() => setBillingCycle("monthly")}
            className={cn(
              "px-5 py-2 rounded-full transition-colors", 
              billingCycle === "monthly" ? "bg-white dark:bg-gray-700 shadow-sm text-purple-600 dark:text-purple-300" : "text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white"
            )}
          >
            Monthly
          </button>
          <button 
             onClick={() => setBillingCycle("annually")}
             className={cn(
               "px-5 py-2 rounded-full transition-colors relative", 
               billingCycle === "annually" ? "bg-white dark:bg-gray-700 shadow-sm text-purple-600 dark:text-purple-300" : "text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white"
             )}
          >
            Annual 
            {billingCycle === 'annually' && (
              <Badge variant="secondary" className="absolute -top-2 -right-3 text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border border-purple-300 dark:border-purple-700">35% off</Badge>
            )}
             {billingCycle !== 'annually' && (
              <Badge variant="outline" className="absolute -top-2 -right-3 text-xs border-gray-300 text-gray-500 dark:border-gray-600 dark:text-gray-400">35% off</Badge>
            )}
          </button>
        </div>
      </div>

      {/* Pricing Cards Section - Updated Grid Layout */}
      <section className="container mx-auto px-4 pb-16 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start max-w-4xl mx-auto">
          
          {/* Other Tools Column - Updated Styling */}
          <div className="border border-border rounded-lg p-6 flex flex-col bg-card"> {/* Use card bg/border */}
            <h3 className="text-xl font-semibold mb-2 text-card-foreground">Compare Alternatives</h3> {/* Use card foreground */} 
            <p className="text-sm text-muted-foreground mb-6">Multiple subscriptions can add up quickly.</p> {/* Use muted foreground */} 
            <div className="space-y-3 flex-1"> {/* Use space-y-3 */} 
              {otherTools.map((tool) => (
                // Wrap each tool in a styled Card
                <Card key={tool.name} className="bg-background border-border"> {/* Nested card with different bg */} 
                  <CardContent className="p-3 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      {tool.logo}
                      <span className="font-medium text-foreground">{tool.name}</span> {/* Use foreground text */}
                    </div>
                    <span className="text-muted-foreground">${tool.price}/mo</span> {/* Use muted foreground */}
                  </CardContent>
                </Card>
              ))}
            </div>
             <p className="text-xs text-muted-foreground mt-6 text-center">Total: ${otherTools.reduce((sum, tool) => sum + tool.price, 0)}+ / month</p> {/* Sum price */}
          </div>

          {/* Pro Plan Card */}
          <div className="border-2 border-purple-600 dark:border-purple-400 rounded-lg p-8 relative shadow-lg dark:shadow-purple-900/20 flex flex-col order-2"> {/* Explicitly set order */} 
             {billingCycle === 'annually' && (
               <Badge className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-purple-600 dark:bg-purple-400 text-white dark:text-black px-4 py-1 text-sm font-semibold">35% off</Badge>
             )}
            <h3 className="text-2xl font-bold mb-3 text-center">Pro</h3>
             <p className="text-center text-gray-600 dark:text-gray-400 mb-6 h-10">For an experience without limits</p>
            <div className="text-center mb-8">
              <span className="text-4xl font-bold">${proPrice}</span>
              <span className="text-base text-gray-500 dark:text-gray-400"> / month</span>
              {billingCycle === 'annually' && <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">billed ${proPrice * 12} annually</p>}
               {billingCycle === 'monthly' && <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">billed monthly</p>}
            </div>
            <Link 
              href={billingCycle === 'annually' 
                    ? "https://buy.stripe.com/28oaFread3F6fkc7st" 
                    : "https://buy.stripe.com/eVafZL9TXcbC8VO4gg"}
              passHref 
              className="block w-full mb-8"
            >
              <Button 
                className="w-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300 font-semibold"
              >
                Buy
              </Button>
            </Link>
            <ul className="space-y-3 text-sm flex-1 mb-6">
              {proFeatures.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <Check className="h-4 w-4 text-purple-500 dark:text-purple-400 mr-3 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
             <p className="text-xs text-gray-500 dark:text-gray-400 mt-auto">We enforce Fair Use limits that are directly proportional to the price you pay after discount. <Link href="#" className="underline hover:text-purple-600">Learn more</Link></p>
          </div>

        </div>
      </section>

      {/* Feature Comparison Table Section */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16">Inclusive with ChatAI Pro plan</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-4 px-3 font-semibold w-2/5">Features</th>
                  <th className="text-center py-4 px-3 font-semibold w-1/5">Free Plan</th>
                  <th className="text-center py-4 px-3 font-semibold w-1/5"><span className="text-purple-600 dark:text-purple-400">ChatAI Pro</span></th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((group) => (
                  <React.Fragment key={group.group}>
                    <tr>
                      <td colSpan={3} className="pt-8 pb-2 px-3">
                        <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{group.group}</h4>
                      </td>
                    </tr>
                    {group.items.map((item) => (
                      <tr key={item.name} className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                        <td className="py-3 px-3 text-sm font-medium text-gray-600 dark:text-gray-300">{item.name}</td>
                        <td className="py-3 px-3 text-center">
                          {item.free === true ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : 
                           item.free === false ? <X className="h-5 w-5 text-red-400 mx-auto" /> : 
                           <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{item.free}</span>}
                        </td>
                         <td className="py-3 px-3 text-center">
                          {item.pro === true ? <Check className="h-5 w-5 text-purple-500 dark:text-purple-400 mx-auto" /> : 
                           item.pro === false ? <X className="h-5 w-5 text-red-400 mx-auto" /> : 
                           <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">{item.pro}</span>}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQs Section (Optional - can keep or remove) */}
       <section className="container mx-auto px-4 py-16 md:py-24">
         <div className="max-w-3xl mx-auto">
           <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
           <div className="space-y-6">
             <div>
                <h3 className="font-semibold text-lg mb-2">What counts as a query/message?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Each time you send a prompt to ChatAI, it counts as one message towards your limit (on the free plan). Regenerating a response also counts as a message.
                </p>
              </div>
               <div>
                <h3 className="font-semibold text-lg mb-2">Which AI models are included?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  The ChatAI Free plan includes access to standard models like GPT-4o Mini and Llama 3 8B. The ChatAI Pro plan unlocks access to all models, including advanced ones like GPT-4.1, Claude 3 Opus/Sonnet/Haiku, Gemini Pro/Flash, and early access to new additions provided via the Kira AI platform.
                </p>
              </div>
             <div>
               <h3 className="font-semibold text-lg mb-2">Can I switch plans later?</h3>
               <p className="text-gray-600 dark:text-gray-400">
                 Yes, you can upgrade or downgrade your ChatAI plan at any time from your account settings. Changes will apply from the next billing cycle.
               </p>
             </div>
             <div>
                <h3 className="font-semibold text-lg mb-2">Is there a free trial for paid plans?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                   We currently offer a generous ChatAI Free plan. We may introduce timed trials for Pro/Teams in the future.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We partner with Stripe to securely accept all major credit cards (Visa, Mastercard, American Express), Apple Pay, and Google Pay for ChatAI subscriptions.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Can I cancel anytime?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Absolutely. You can cancel your ChatAI subscription at any time. You'll retain access to paid features until the end of your current billing period.
                </p>
              </div>
           </div>
         </div>
       </section>

    </div>
  )
}
