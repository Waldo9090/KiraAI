import Link from 'next/link'
import SharedNav from './shared-nav'

export default function NotFound() {
  return (
    <>
      <SharedNav />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-white dark:bg-gray-950 px-4">
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">404 - Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">The page you are looking for does not exist.</p>
        <Link 
          href="/"
          className="px-4 py-2 rounded-md bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:opacity-90 transition-opacity"
        >
          Return Home
        </Link>
      </div>
    </>
  )
} 