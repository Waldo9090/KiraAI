"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import SharedNav from "../shared-nav"

interface BlogPost {
  slug: string
  title: string
  date: string
  readTime: string
  category: string
  description: string
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-end-an-email-to-a-professor",
    title: "How to End an Email to a Professor: Best Practices & Examples",
    date: "May 20, 2025",
    readTime: "6 min read",
    category: "Writing",
    description: "Learn professional ways to end emails to professors with examples, templates, and best practices. Get tips for formal closings that leave a lasting impression."
  },
  {
    slug: "what-does-gpt-stand-for-in-chat-gpt",
    title: "GPT Full Form: What Does GPT Stand for in ChatGPT?",
    date: "May 20, 2025",
    readTime: "10 min",
    category: "AI Technology",
    description: "Understand the meaning behind GPT in ChatGPT, exploring its components, evolution, and capabilities in this comprehensive guide."
  },
  {
    slug: "how-to-use-chat-gpt-in-netherlands",
    title: "How to Use ChatGPT in the Netherlands with ChatAI",
    date: "May 20, 2025",
    readTime: "8 min",
    category: "Tutorials",
    description: "Learn how to access and use ChatGPT in the Netherlands through ChatAI, with Dutch language support and region-free access."
  },
  {
    slug: "chatgpt-4o-free-how-to-use-gpt-4o",
    title: "Get GPT-4o Free: How to Use ChatGPT-4o Without Paying",
    date: "May 20, 2025",
    readTime: "8 min read",
    category: "Tutorials",
    description: "Learn how to access GPT-4o for free through ChatAI. Get unlimited access to OpenAI's most advanced multimodal AI model without spending a cent."
  },
  {
    slug: "best-chatgpt-alternative-in-china",
    title: "The Best ChatGPT Alternative in China",
    date: "May 20, 2025",
    readTime: "6 min",
    category: "AI Tools",
    description: "Discover ChatAI - the leading ChatGPT alternative for users in China, offering full GPT-4 capabilities without VPN requirements."
  }
];

export default function BlogsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <SharedNav />
      
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">Blog</h1>

        {/* Blog Posts List */}
        <div className="space-y-12">
          {BLOG_POSTS.map((post) => (
            <article 
              key={post.slug}
              className="group border-b border-gray-200 dark:border-gray-800 pb-8 last:border-0"
            >
              <Link href={`/blogs/${post.slug}`}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                    <span>•</span>
                    <span>{post.category}</span>
                  </div>
                  
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-600 dark:text-gray-400">
                    {post.description}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
} 