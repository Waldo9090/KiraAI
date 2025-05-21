import ChatPageClient from './ChatPageClient';

// This is the server component that handles static path generation
export async function generateStaticParams() {
  // Since this is a dynamic chat page, we'll return an empty array
  // This tells Next.js that this page should be generated at request time
  // rather than build time
  return [];
}

// This is the server component wrapper
export default function ChatPage() {
  return <ChatPageClient />;
} 