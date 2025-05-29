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

  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    
    if (file.size > maxSize) {
      return 'File size must be less than 10MB'
    }
    
    if (!allowedTypes.includes(file.type)) {
      return 'Only PNG, JPG, JPEG, and WebP files are allowed'
    }
    
    return null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const validation = validateFile(file)
    if (validation) {
      setError(validation)
      setImageFile(null)
      return
    }
    
    setError('')
    setImageFile(file)
  }
  const handleGenerate = async () => {
    if (inputType === 'text' && !textInput.trim()) {
      setError('Please provide a text description')
      return
    }
    
    if (inputType === 'image' && !imageFile) {
      setError('Please upload an image')
      return
    }

    setIsGenerating(true)
    setError('')
    
    try {
      const { getSession } = await import('next-auth/react')
      const session = await getSession()
      
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const formData = new FormData()
      
      if (inputType === 'text') {
        formData.append('text', textInput)
      } else if (imageFile) {
        formData.append('image', imageFile)
      }
      
      formData.append('allergens', JSON.stringify(allergens))
      formData.append('spiceLevel', spiceLevel.toString())

      const headers: Record<string, string> = {}
      if (session?.user?.email) {
        headers['X-User-Email'] = session.user.email
      }

      const response = await fetch(`${API_BASE_URL}/recipes/generate`, {
        method: 'POST',
        headers,
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to generate recipe' }))
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.success || !data.data?.recipe) {
        throw new Error('Invalid response from server')
      }
      
      setGeneratedRecipe(data.data.recipe)
    } catch (err) {
      console.error('Recipe generation error:', err)
      
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Cannot connect to server. Please check if the backend is running.')
      } else {
        setError(err instanceof Error ? err.message : 'Failed to generate recipe. Please try again.')
      }
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
                onClick={() => {
                  setInputType('text')
                  setError('')
                  setImageFile(null)
                }}
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
                onClick={() => {
                  setInputType('image')
                  setError('')
                  setTextInput('')
                }}
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
              <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                error ? 'border-red-500' : 'border-gray-600 hover:border-primary-500'
              }`}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300">
                    {imageFile ? imageFile.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">PNG, JPG, JPEG, WebP up to 10MB</p>
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
            disabled={isGenerating || (inputType === 'text' && !textInput.trim()) || (inputType === 'image' && !imageFile)}
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
