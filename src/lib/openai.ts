import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface RecipeGenerationRequest {
  description: string
  allergens: string[]
  spiceLevel: number
}

export interface GeneratedRecipe {
  recipeName: string
  ingredients: string[]
  instructions: string[]
  cuisineType: string
  tags: string[]
  cookingTime: string
  servings: number
  difficulty: string
}

export async function generateRecipe(request: RecipeGenerationRequest): Promise<GeneratedRecipe> {
  const { description, allergens, spiceLevel } = request
  
  const allergenText = allergens.length > 0 ? `Avoid these allergens: ${allergens.join(', ')}. ` : ''
  const spiceText = `Spice level: ${spiceLevel}/10 (0=mild, 10=extremely hot). `
  
  const prompt = `Create a detailed recipe based on this description: "${description}"

${allergenText}${spiceText}

Please respond with a JSON object in this exact format:
{
  "recipeName": "Name of the dish",
  "ingredients": ["ingredient 1", "ingredient 2", ...],
  "instructions": ["step 1", "step 2", ...],
  "cuisineType": "Type of cuisine (e.g., Italian, Mexican, Indian)",
  "tags": ["tag1", "tag2", ...] (e.g., "spicy", "vegetarian", "quick", "comfort food"),
  "cookingTime": "Total time (e.g., '30 minutes')",
  "servings": 4,
  "difficulty": "Easy/Medium/Hard"
}

Make sure:
- Instructions are clear and detailed
- Ingredients include quantities
- Tags accurately describe the dish
- Cooking time is realistic
- Consider the allergen restrictions
- Adjust spiciness according to the spice level`
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional chef and recipe creator. Always respond with valid JSON only, no additional text.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    // Parse the JSON response
    const recipe = JSON.parse(content) as GeneratedRecipe
    
    // Validate required fields
    if (!recipe.recipeName || !recipe.ingredients || !recipe.instructions) {
      throw new Error('Invalid recipe format received from AI')
    }

    return recipe
  } catch (error) {
    console.error('Error generating recipe:', error)
    throw new Error('Failed to generate recipe')
  }
}

export async function analyzeImage(imageBuffer: Buffer): Promise<string> {
  try {
    // Convert buffer to base64
    const base64Image = imageBuffer.toString('base64')
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this food image and describe what dish it appears to be. Include the main ingredients you can identify. Respond with a concise description that could be used to recreate this dish.'
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 300,
    })

    return response.choices[0]?.message?.content || 'Unable to analyze image'
  } catch (error) {
    console.error('Error analyzing image:', error)
    throw new Error('Failed to analyze image')
  }
}
