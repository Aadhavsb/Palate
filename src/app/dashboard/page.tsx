'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Calendar, TrendingUp, ChefHat, Clock } from 'lucide-react'
import { UserStats } from '@/types/recipe'
import RecipeCard from '@/components/recipe/RecipeCard'

const COLORS = ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5']

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/auth/signin')
    }
  }, [status])

  useEffect(() => {
    if (session?.user) {
      fetchStats()
    }
  }, [session])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/user/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        setError('Failed to fetch statistics')
      }
    } catch (err) {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={fetchStats} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <p className="text-gray-400">No data available</p>
      </div>
    )
  }

  // Prepare data for charts
  const cuisineData = Object.entries(stats.topCuisines).map(([cuisine, count]) => ({
    name: cuisine,
    value: count
  }))

  const timeData = stats.recipesOverTime.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    count: item.count
  }))

  return (
    <div className="min-h-screen bg-background-dark pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {session?.user?.name}!
          </h1>
          <p className="text-gray-300">
            Here's your cooking journey at a glance
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChefHat className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.totalRecipes}</div>
            <div className="text-gray-400">Recipes Generated</div>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {Object.keys(stats.topCuisines).length}
            </div>
            <div className="text-gray-400">Cuisines Explored</div>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stats.recipesOverTime.reduce((sum, item) => sum + item.count, 0)}
            </div>
            <div className="text-gray-400">Last 30 Days</div>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stats.totalRecipes > 0 ? Math.round(stats.totalRecipes * 25 / 60) : 0}h
            </div>
            <div className="text-gray-400">Time Saved</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Cuisine Distribution */}
          <div className="card">
            <h3 className="text-xl font-semibold text-white mb-6">Favorite Cuisines</h3>
            {cuisineData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={cuisineData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {cuisineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                No cuisine data available
              </div>
            )}
          </div>

          {/* Recipe Generation Over Time */}
          <div className="card">
            <h3 className="text-xl font-semibold text-white mb-6">Recipe Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Recipes */}
        <div className="card">
          <h3 className="text-xl font-semibold text-white mb-6">Recent Recipes</h3>
          {stats.recentRecipes.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.recentRecipes.slice(0, 6).map((recipe, index) => (
                <div key={index} className="transform scale-95">
                  <RecipeCard recipe={recipe} showActions={false} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ChefHat className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No recipes generated yet</p>
              <p className="text-gray-500 mb-6">Start creating your first recipe!</p>
              <a href="/#generator" className="btn-primary">
                Generate Recipe
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
