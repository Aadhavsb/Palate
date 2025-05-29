import { OpenAI } from 'openai';

// Initialize OpenAI client only if API key is provided
console.log('OpenAI Service - API Key present:', !!process.env.OPENAI_API_KEY);
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

export interface RecipeGenerationRequest {
  description: string;
  allergens: string[];
  spiceLevel: number;
}

export interface GeneratedRecipe {
  recipeName: string;
  ingredients: string[];
  instructions: string[];
  cuisineType: string;
  tags: string[];
  cookingTime: string;
  servings: number;
  difficulty: string;
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export const generateRecipe = async (request: RecipeGenerationRequest): Promise<GeneratedRecipe> => {
  console.log('generateRecipe called - openai client exists:', !!openai);
  console.log('generateRecipe called - API key exists:', !!process.env.OPENAI_API_KEY);
  
  if (!openai) {
    throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.');
  }

  const { description, allergens, spiceLevel } = request;
  
  const allergenText = allergens.length > 0 ? `Avoid these allergens: ${allergens.join(', ')}. ` : '';
  const spiceText = `Spice level: ${spiceLevel}/10 (0=mild, 10=extremely hot). `;
  
  const prompt = `Create a detailed recipe based on this description: "${description}"

${allergenText}${spiceText}

Please respond with a JSON object in this exact format:
{
  "recipeName": "Name of the dish",
  "ingredients": ["ingredient 1 with quantity", "ingredient 2 with quantity", ...],
  "instructions": ["detailed step 1", "detailed step 2", ...],
  "cuisineType": "Type of cuisine (e.g., Italian, Mexican, Indian)",
  "tags": ["tag1", "tag2", ...] (e.g., "spicy", "vegetarian", "quick", "comfort food"),
  "cookingTime": "Total time (e.g., '30 minutes')",
  "servings": 4,
  "difficulty": "Easy/Medium/Hard",
  "nutritionalInfo": {
    "calories": 450,
    "protein": 25,
    "carbs": 35,
    "fat": 18
  }
}

Requirements:
- Instructions must be clear, detailed, and actionable
- Ingredients must include specific quantities and measurements
- Tags should accurately describe the dish characteristics
- Cooking time should be realistic and include prep + cook time
- Strictly respect allergen restrictions
- Adjust spiciness and ingredients according to the spice level
- Provide reasonable nutritional estimates per serving
- Ensure the recipe is practical and achievable`;
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional chef and recipe creator with expertise in nutrition. Always respond with valid JSON only, no additional text or formatting.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Clean up the response in case it has markdown formatting
    const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
    
    // Parse the JSON response
    const recipe = JSON.parse(cleanContent) as GeneratedRecipe;
    
    // Validate required fields
    if (!recipe.recipeName || !recipe.ingredients || !recipe.instructions) {
      throw new Error('Invalid recipe format received from AI');
    }

    // Ensure arrays are not empty
    if (recipe.ingredients.length === 0 || recipe.instructions.length === 0) {
      throw new Error('Recipe must have ingredients and instructions');
    }

    return recipe;
  } catch (error) {
    console.error('Error generating recipe:', error);
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse recipe from AI response');
    }
    throw new Error('Failed to generate recipe');
  }
};

export const analyzeImage = async (imageBuffer: Buffer): Promise<string> => {
  if (!openai) {
    throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.');
  }

  try {
    // Convert buffer to base64
    const base64Image = imageBuffer.toString('base64');
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this food image and provide a detailed description that could be used to recreate this dish. Include:
              1. The main dish name or type
              2. Visible ingredients you can identify
              3. Cooking method (if apparent)
              4. Style or cuisine type
              5. Any garnishes or sides visible
              
              Respond with a clear, descriptive paragraph that would help someone recreate this exact dish.`
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
      max_tokens: 400,
    });

    const description = response.choices[0]?.message?.content;
    
    if (!description) {
      throw new Error('No description received from image analysis');
    }
    
    return description;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw new Error('Failed to analyze image');
  }
};
