'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Clock, Users, ChefHat, Heart, Share2, BookOpen } from 'lucide-react'
import { Recipe } from '@/types/recipe'
import { useSession } from 'next-auth/react'

interface RecipeCardProps {
  recipe: Recipe
  showActions?: boolean
}

export default function RecipeCard({ recipe, showActions = true }: RecipeCardProps) {
  const { data: session } = useSession()
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = async () => {
    if (!session) return
    
    try {
      const response = await fetch('/api/user/save-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId: recipe._id })
      })
      
      if (response.ok) {
        setIsSaved(!isSaved)
      }
    } catch (error) {
      console.error('Failed to save recipe:', error)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.recipeName,
          text: `Check out this delicious ${recipe.cuisineType} recipe!`,
          url: window.location.href
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Recipe link copied to clipboard!')
    }
  }

  return (
    <div className="recipe-card">
      {/* Header with Image */}
      <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
        <Image
          src={recipe.imageUrl || '/placeholder-food.jpg'}
          alt={recipe.recipeName}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Recipe Info Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-bold text-white mb-2">
            {recipe.recipeName}
          </h3>
          <div className="flex items-center gap-4 text-white/90">
            {recipe.cookingTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{recipe.cookingTime}</span>
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span className="text-sm">{recipe.servings} servings</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <ChefHat className="h-4 w-4" />
              <span className="text-sm">{recipe.cuisineType}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {recipe.tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Ingredients */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Ingredients
        </h4>
        <ul className="space-y-2">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="text-gray-300 flex items-start gap-2">
              <span className="text-primary-500 mt-1">•</span>
              {ingredient}
            </li>
          ))}
        </ul>
      </div>

      {/* Instructions */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-white mb-3">
          Instructions
        </h4>
        <ol className="space-y-3">
          {recipe.instructions.map((instruction, index) => (
            <li key={index} className="text-gray-300 flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </span>
              <span>{instruction}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Actions */}
      {showActions && session && (
        <div className="flex gap-3 pt-4 border-t border-gray-700">
          <button
            onClick={handleSave}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
              isSaved
                ? 'bg-red-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
            {isSaved ? 'Saved' : 'Save'}
          </button>
          
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg font-medium transition-colors"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>
      )}
    </div>
  )
}
