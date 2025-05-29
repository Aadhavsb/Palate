export interface Recipe {
  _id?: string
  recipeName: string
  ingredients: string[]
  instructions: string[]
  cuisineType: string
  tags: string[]
  imageUrl: string
  cookingTime?: string
  servings?: number
  difficulty?: string
  createdAt?: Date
  userId?: string
}

export interface RecipeRequest {
  text?: string
  image?: File
  allergens: string[]
  spiceLevel: number
}

export interface UserStats {
  totalRecipes: number
  topCuisines: { [key: string]: number }
  recentRecipes: Recipe[]
  recipesOverTime: { date: string; count: number }[]
}
