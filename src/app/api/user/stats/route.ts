import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import dbConnect from '@/lib/mongodb'
import Recipe from '@/models/Recipe'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    // Get user's recipes for analysis
    const recipes = await Recipe.find({ userId: session.user.id })
      .sort({ createdAt: -1 })

    // Calculate statistics
    const totalRecipes = recipes.length
    
    // Top cuisines
    const cuisineCounts: { [key: string]: number } = {}
    recipes.forEach(recipe => {
      cuisineCounts[recipe.cuisineType] = (cuisineCounts[recipe.cuisineType] || 0) + 1
    })

    // Recent recipes (last 10)
    const recentRecipes = recipes.slice(0, 10)

    // Recipes over time (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentData: { [key: string]: number } = {}
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      recentData[dateStr] = 0
    }
    
    recipes
      .filter(recipe => recipe.createdAt >= thirtyDaysAgo)
      .forEach(recipe => {
        const dateStr = recipe.createdAt.toISOString().split('T')[0]
        if (recentData[dateStr] !== undefined) {
          recentData[dateStr]++
        }
      })

    const recipesOverTime = Object.entries(recentData).map(([date, count]) => ({
      date,
      count
    }))

    const stats = {
      totalRecipes,
      topCuisines: cuisineCounts,
      recentRecipes,
      recipesOverTime
    }

    return NextResponse.json(stats)
    
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
