import { Metadata } from 'next';
import SharedNav from '../shared-nav';

export const metadata: Metadata = {
  title: 'Blog Posts - ChatAI',
  description: 'Read our latest articles about AI, technology, and more.',
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <SharedNav />
      {children}
    </div>
  );
} 