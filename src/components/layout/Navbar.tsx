'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Menu, X, ChefHat } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session, status } = useSession()

  return (
    <nav className="bg-background-darker border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-primary-500" />
            <span className="text-2xl font-bold text-white">Palate</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-primary-500 transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-primary-500 transition-colors">
              About
            </Link>
            <Link href="/recipes" className="text-gray-300 hover:text-primary-500 transition-colors">
              Recipes
            </Link>
            {session && (
              <Link href="/dashboard" className="text-gray-300 hover:text-primary-500 transition-colors">
                Dashboard
              </Link>
            )}
            
            {/* Auth Button */}
            {status === 'loading' ? (
              <div className="w-20 h-10 bg-gray-700 rounded animate-pulse" />
            ) : session ? (
              <div className="flex items-center space-x-4">
                <img
                  src={session.user?.image || '/placeholder-avatar.png'}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <button
                  onClick={() => signOut()}
                  className="btn-secondary text-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="btn-primary text-sm"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background-charcoal rounded-lg mt-2">
              <Link href="/" className="block text-gray-300 hover:text-primary-500 px-3 py-2">
                Home
              </Link>
              <Link href="/about" className="block text-gray-300 hover:text-primary-500 px-3 py-2">
                About
              </Link>
              <Link href="/recipes" className="block text-gray-300 hover:text-primary-500 px-3 py-2">
                Recipes
              </Link>
              {session && (
                <Link href="/dashboard" className="block text-gray-300 hover:text-primary-500 px-3 py-2">
                  Dashboard
                </Link>
              )}
              
              {session ? (
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left text-gray-300 hover:text-primary-500 px-3 py-2"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => signIn('google')}
                  className="block w-full text-left text-gray-300 hover:text-primary-500 px-3 py-2"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
