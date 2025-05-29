import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import dbConnect from '@/lib/mongodb'
import Recipe from '@/models/Recipe'
import { generateRecipe, analyzeImage } from '@/lib/openai'
import { searchRecipeImage } from '@/lib/images'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const formData = await request.formData()
    const text = formData.get('text') as string
    const image = formData.get('image') as File
    const allergens = JSON.parse(formData.get('allergens') as string || '[]')
    const spiceLevel = parseInt(formData.get('spiceLevel') as string || '5')

    let description = ''
    let inputType: 'text' | 'image' = 'text'

    // Process input based on type
    if (image) {
      inputType = 'image'
      const imageBuffer = Buffer.from(await image.arrayBuffer())
      description = await analyzeImage(imageBuffer)
    } else if (text) {
      description = text.trim()
    } else {
      return NextResponse.json(
        { error: 'Either text description or image is required' },
        { status: 400 }
      )
    }

    // Generate recipe using OpenAI
    const generatedRecipe = await generateRecipe({
      description,
      allergens,
      spiceLevel,
    })

    // Search for a matching image
    const imageUrl = await searchRecipeImage(
      generatedRecipe.recipeName,
      generatedRecipe.cuisineType
    )

    // Create the complete recipe object
    const recipeData = {
      ...generatedRecipe,
      imageUrl,
      spiceLevel,
      allergens,
      originalInput: description,
      inputType,
    }    // Save to database if user is authenticated
    const session = await getServerSession()
    let savedRecipe: any = null
    
    if (session?.user?.email) {
      // Find user and save recipe
      const recipe = new Recipe({
        ...recipeData,
        userId: session.user.id,
      })
      
      savedRecipe = await recipe.save()
    }

    // Return recipe data with ID if saved
    const responseData = savedRecipe 
      ? { ...recipeData, _id: savedRecipe._id.toString() }
      : recipeData

    return NextResponse.json(responseData)
    
  } catch (error) {
    console.error('Error in recipe generation:', error)
    return NextResponse.json(
      { error: 'Failed to generate recipe' },
      { status: 500 }
    )
  }
}
