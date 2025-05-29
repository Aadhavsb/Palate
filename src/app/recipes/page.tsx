'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Search, Filter, SortAsc, SortDesc, Clock, Users, ChefHat } from 'lucide-react'
import { Recipe } from '@/types/recipe'
import RecipeCard from '@/components/recipe/RecipeCard'

export default function Recipes() {
  const { data: session, status } = useSession()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [cuisineFilter, setCuisineFilter] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  const cuisineTypes = [
    'Italian', 'Chinese', 'Mexican', 'Indian', 'Japanese', 'French', 'Thai', 'American',
    'Mediterranean', 'Korean', 'Vietnamese', 'Spanish', 'Greek', 'Middle Eastern'
  ]

  const difficulties = ['Easy', 'Medium', 'Hard']

  useEffect(() => {
    if (session?.user) {
      fetchRecipes()
    }
  }, [session, searchQuery, cuisineFilter, difficultyFilter, sortBy, sortOrder, currentPage])

  const fetchRecipes = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        sortBy,
        sortOrder
      })

      if (searchQuery) params.append('q', searchQuery)
      if (cuisineFilter) params.append('cuisine', cuisineFilter)
      if (difficultyFilter) params.append('difficulty', difficultyFilter)

      const response = await fetch(`/api/user/history?${params}`)
      if (response.ok) {
        const data = await response.json()
        setRecipes(data)
        // For now, we'll use a simple pagination since the API returns all recipes
        const itemsPerPage = 12
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        setRecipes(data.slice(startIndex, endIndex))
        setTotalPages(Math.ceil(data.length / itemsPerPage))
      }
    } catch (error) {
      console.error('Error fetching recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchRecipes()
  }

  const handleSortChange = (newSortBy: string) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(newSortBy)
      setSortOrder('desc')
    }
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setCuisineFilter('')
    setDifficultyFilter('')
    setSortBy('createdAt')
    setSortOrder('desc')
    setCurrentPage(1)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Please sign in to view your recipes</h2>
          <p className="text-gray-400 mb-6">Create an account to save and manage your generated recipes.</p>
          <button 
            onClick={() => window.location.href = '/api/auth/signin'}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Recipes</h1>
          <p className="text-gray-400">Manage and explore your generated recipes</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </form>

          {/* Filters */}
          {showFilters && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Cuisine Type</label>
                  <select
                    value={cuisineFilter}
                    onChange={(e) => setCuisineFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">All Cuisines</option>
                    {cuisineTypes.map(cuisine => (
                      <option key={cuisine} value={cuisine}>{cuisine}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
                  <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">All Difficulties</option>
                    {difficulties.map(difficulty => (
                      <option key={difficulty} value={difficulty}>{difficulty}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                  <div className="flex gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="createdAt">Date Created</option>
                      <option value="recipeName">Recipe Name</option>
                      <option value="cuisineType">Cuisine</option>
                      <option value="difficulty">Difficulty</option>
                    </select>
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600 transition-colors"
                    >
                      {sortOrder === 'asc' ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={clearFilters}
                  className="text-orange-500 hover:text-orange-400 transition-colors"
                >
                  Clear all filters
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Recipe Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
                <div className="h-48 bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : recipes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                >
                  Previous
                </button>
                
                <div className="flex items-center space-x-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg transition-colors ${
                            currentPage === page
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-800 border border-gray-700 text-white hover:bg-gray-700'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return <span key={page} className="text-gray-400">...</span>
                    }
                    return null
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <ChefHat className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No recipes found</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery || cuisineFilter || difficultyFilter
                ? "Try adjusting your search criteria or clear filters to see more results."
                : "Start generating recipes to see them here!"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = '/'}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Generate Recipe
              </button>
              {(searchQuery || cuisineFilter || difficultyFilter) && (
                <button 
                  onClick={clearFilters}
                  className="border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
