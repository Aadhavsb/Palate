'use client'

import { useState } from 'react'
import { Upload, Type, Zap, Utensils } from 'lucide-react'
import AllergenSelector from './AllergenSelector'
import SpiceLevel from './SpiceLevel'
import RecipeCard from './RecipeCard'
import { Recipe } from '@/types/recipe'

export default function RecipeGenerator() {
  const [inputType, setInputType] = useState<'text' | 'image'>('text')
  const [textInput, setTextInput] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [allergens, setAllergens] = useState<string[]>([])
  const [spiceLevel, setSpiceLevel] = useState(5)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null)
  const [error, setError] = useState('')
  const handleGenerate = async () => {
    if (!textInput.trim() && !imageFile) {
      setError('Please provide either text description or upload an image')
      return
    }

    setIsGenerating(true)
    setError('')
    
    try {
      const formData = new FormData()
      
      if (inputType === 'text') {
        formData.append('text', textInput)
      } else if (imageFile) {
        formData.append('image', imageFile)
      }
      
      formData.append('allergens', JSON.stringify(allergens))
      formData.append('spiceLevel', spiceLevel.toString())

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recipes/generate`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate recipe')
      }

      const data = await response.json()
      setGeneratedRecipe(data.data.recipe)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate recipe. Please try again.')
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <section id="generator" className="py-20 bg-background-charcoal">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Generate Your Perfect Recipe
          </h2>
          <p className="text-xl text-gray-300">
            Describe your dish or upload an image, and let AI create a personalized recipe for you
          </p>
        </div>

        <div className="card space-y-8">
          {/* Input Type Toggle */}
          <div className="flex justify-center">
            <div className="bg-background-dark rounded-lg p-1 flex">
              <button
                onClick={() => setInputType('text')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  inputType === 'text'
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Type className="h-4 w-4" />
                Text Description
              </button>
              <button
                onClick={() => setInputType('image')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  inputType === 'image'
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Upload className="h-4 w-4" />
                Upload Image
              </button>
            </div>
          </div>

          {/* Input Fields */}
          {inputType === 'text' ? (
            <div>
              <label className="block text-white font-medium mb-2">
                Describe your desired dish
              </label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="e.g., spicy chicken curry with rice and vegetables"
                className="w-full p-4 bg-background-dark border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none h-32 resize-none"
              />
            </div>
          ) : (
            <div>
              <label className="block text-white font-medium mb-2">
                Upload food image
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300">
                    {imageFile ? imageFile.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB</p>
                </label>
              </div>
            </div>
          )}

          {/* Allergen Selection */}
          <AllergenSelector selected={allergens} onChange={setAllergens} />

          {/* Spice Level */}
          <SpiceLevel value={spiceLevel} onChange={setSpiceLevel} />

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Generating Recipe...
              </>
            ) : (
              <>
                <Zap className="h-5 w-5" />
                Generate Recipe
              </>
            )}
          </button>
        </div>

        {/* Generated Recipe */}
        {generatedRecipe && (
          <div className="mt-12">
            <RecipeCard recipe={generatedRecipe} />
          </div>
        )}
      </div>
    </section>
  )
}
