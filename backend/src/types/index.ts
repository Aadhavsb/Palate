export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  preferences: {
    favoriteCategories: string[];
    allergens: string[];
    spiceLevel: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Recipe {
  _id?: string;
  recipeName: string;
  ingredients: string[];
  instructions: string[];
  cuisineType: string;
  tags: string[];
  imageUrl: string;
  cookingTime?: string;
  servings?: number;
  difficulty?: string;
  spiceLevel: number;
  allergens: string[];
  userId?: string;
  originalInput: string;
  inputType: 'text' | 'image';
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RecipeRequest {
  text?: string;
  image?: Express.Multer.File;
  allergens: string[];
  spiceLevel: number;
  userId?: string;
}

export interface UserStats {
  totalRecipes: number;
  topCuisines: { [key: string]: number };
  recentRecipes: Recipe[];
  recipesOverTime: { date: string; count: number }[];
  favoriteIngredients: string[];
  averageSpiceLevel: number;
}

export interface AuthRequest extends Express.Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
  body: any;
  params: any;
  query: any;
  headers: any;
  file?: Express.Multer.File;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface RecipeFilters {
  q?: string;
  cuisine?: string;
  difficulty?: string;
  spiceLevel?: string;
  allergens?: string;
}
