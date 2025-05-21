"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import SharedNav from "../../shared-nav"
import { BLOG_POSTS_CONTENT } from "./content"

export default function BlogPost() {
  const params = useParams()
  const slug = params.slug as string
  const content = BLOG_POSTS_CONTENT[slug]

  if (!content) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <SharedNav />
        <main className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Blog Post Not Found</h1>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <SharedNav />
      
      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Back Button */}
        <Link 
          href="/blogs" 
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>

        {/* Blog Content */}
        <article 
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </main>
    </div>
  )
} 