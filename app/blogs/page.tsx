"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import SharedNav from "../shared-nav"
import { BLOG_POSTS_CONTENT } from "./[slug]/content"

interface BlogPost {
  slug: string
  title: string
  date: string
  readTime: string
  category: string
  description: string
}

export default function BlogsPage() {
  const router = useRouter()

  // Convert the content object into an array with slugs
  const blogPosts = Object.entries(BLOG_POSTS_CONTENT).map(([slug, post]) => ({
    slug,
    title: post.title,
    date: post.date,
    readTime: post.readTime,
    category: post.category,
    description: post.description
  }));

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <SharedNav />
      
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">Blog</h1>

        {/* Blog Posts List */}
        <div className="space-y-12">
          {blogPosts.map((post) => (
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