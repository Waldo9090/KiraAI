import Link from "next/link";
// import { ArrowLeft } from "lucide-react"; // Still commented out for isolation
// import SharedNav from "../../shared-nav"; // Still commented out for isolation
import { BLOG_POSTS_CONTENT } from '@/app/blogs/[slug]/content';
// import { Metadata } from 'next'; // Temporarily commented out
import { notFound } from 'next/navigation';
import BlogPostClient from './BlogPostClient'; // Import the client component

// Define the structure of a blog post (can be shared or defined in content.ts as well)
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

interface Props {
  params: {
    slug: string;
  };
}

// Generate static paths for all blog posts (Server-side)
export async function generateStaticParams() {
  return Object.keys(BLOG_POSTS_CONTENT).map((slug) => ({
    slug,
  }));
}

/* // Temporarily commented out to resolve build error
// Generate metadata for the page (Server-side)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = BLOG_POSTS_CONTENT[params.slug] as BlogPostData | undefined;
  
  if (!post) {
    return {
      title: 'Blog Post Not Found',
    };
  }

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.keywords,
  };
}
*/

// This is the Server Component for the page
export default function BlogPostPage({ params }: Props) {
  const post = BLOG_POSTS_CONTENT[params.slug] as BlogPostData | undefined;

  if (!post) {
    notFound(); // Triggers the not-found page
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* <SharedNav /> */}{/* Temporarily commented out */}
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/blogs" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-8">
            {/* <ArrowLeft className="h-4 w-4 mr-2" /> */}{/* Temporarily commented out */}
            Back to Blogs
          </Link>

          {/* Render the Client Component, passing the fetched post data */}
          <BlogPostClient post={post} />
        </div>
      </main>
    </div>
  );
} 