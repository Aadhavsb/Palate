'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-dark">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-red-500">Oops!</h1>
        <h2 className="text-2xl font-semibold text-white">Something went wrong</h2>
        <p className="text-gray-300 max-w-md">
          An unexpected error occurred. Please try again.
        </p>        <div className="flex gap-4 justify-center">
          <button 
            onClick={reset}
            className="btn-primary px-6 py-3"
          >
            Try Again
          </button>
          <Link 
            href="/" 
            className="btn-secondary px-6 py-3"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
