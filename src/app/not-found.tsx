'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-dark">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-primary-500">404</h1>
        <h2 className="text-2xl font-semibold text-white">Page Not Found</h2>
        <p className="text-gray-300 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link 
          href="/" 
          className="btn-primary inline-block px-6 py-3"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
