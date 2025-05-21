"use client"

import ReactMarkdown from 'react-markdown'
import { Button } from "@/components/ui/button"
import { Clock, Calendar, Tag, Share2 } from "lucide-react"

// Define the structure of a blog post
interface BlogPostData {
  title: string;
  date: string;
  readTime: string;
  category: string;
  author: string;
  content: string;
  description: string;
  keywords: string[];
  metaTitle: string;
  metaDescription: string;
}

interface BlogPostClientProps {
  post: BlogPostData;
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          // You could add a toast notification here for better UX
          console.log("Article link copied to clipboard!");
        })
        .catch(err => {
          console.error("Failed to copy article link: ", err);
        });
    }
  };

  return (
    <>
      {/* Blog Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            {post.date}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            {post.readTime}
          </div>
          <div className="flex items-center">
            <Tag className="h-4 w-4 mr-2" />
            {post.category}
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <article className="prose dark:prose-invert max-w-none">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </article>

      {/* Keywords/Tags */}
      <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
        <div className="flex flex-wrap gap-2">
          {post.keywords?.map((keyword: string, index: number) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
            >
              #{keyword}
            </span>
          ))}
        </div>
      </div>

      {/* Share Button */}
      <div className="mt-8">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" />
          Share Article
        </Button>
      </div>
    </>
  );
} 