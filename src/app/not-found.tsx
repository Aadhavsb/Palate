import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '404 - Page Not Found | Palate',
  description: 'The page you are looking for does not exist.',
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-dark">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8">The page you are looking for does not exist.</p>
        <Link 
          href="/" 
          className="btn-primary px-6 py-3 text-lg inline-block"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
