import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import dbConnect from '@/lib/mongodb'
import Recipe from '@/models/Recipe'
import User from '@/models/User'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    // Get user's recipes
    const recipes = await Recipe.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(50)

    return NextResponse.json(recipes)
    
  } catch (error) {
    console.error('Error fetching user history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    )
  }
}
