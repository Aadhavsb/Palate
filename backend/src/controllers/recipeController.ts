import { Response } from 'express';
import multer from 'multer';
import Recipe from '../models/Recipe';
import { generateRecipe, analyzeImage } from '../services/openaiService';
import { searchRecipeImage } from '../services/imageService';
import { ApiResponse, AuthRequest, RecipeRequest, PaginationQuery, RecipeFilters } from '../types';

// Generate recipe from text or image
export const generateRecipeFromInput = async (req: AuthRequest, res: Response<ApiResponse>): Promise<void> => {  try {
    console.log('=== Recipe Generation Started ===');
    console.log('Request body:', req.body);
    console.log('File uploaded:', !!req.file);
    console.log('Request headers X-User-Email:', req.headers['x-user-email']);
    console.log('req.user:', req.user);
    console.log('User ID will be:', req.user?.id || 'undefined');
    
    const { text, allergens = [], spiceLevel = 5 } = req.body;
    const image = req.file;

    let description = '';
    let inputType: 'text' | 'image' = 'text';    // Parse allergens if it's a string
    let parsedAllergens: string[] = [];
    console.log('Raw allergens value:', allergens, 'Type:', typeof allergens);
    
    if (typeof allergens === 'string') {
      try {
        parsedAllergens = JSON.parse(allergens);
        console.log('Parsed allergens from string:', parsedAllergens);
      } catch (error) {
        console.warn('Failed to parse allergens, using empty array:', allergens);
        parsedAllergens = [];
      }
    } else if (Array.isArray(allergens)) {
      parsedAllergens = allergens;
      console.log('Allergens already array:', parsedAllergens);
    } else {
      console.warn('Allergens is neither string nor array, using empty array. Type:', typeof allergens, 'Value:', allergens);
      parsedAllergens = [];
    }

    // Parse spice level
    const parsedSpiceLevel = typeof spiceLevel === 'string' ? parseInt(spiceLevel, 10) : spiceLevel;

    // Handle text input
    if (text && text.trim()) {
      console.log('Processing text input:', text);
      description = text.trim();
      inputType = 'text';
    }
    // Handle image input
    else if (image) {
      console.log('Processing image input, file size:', image.size);
      inputType = 'image';
      try {
        description = await analyzeImage(image.buffer);
        console.log('Image analysis result:', description);
      } catch (error) {
        console.error('Image analysis failed:', error);
        throw new Error('Failed to analyze the uploaded image. Please try with a different image or use text description instead.');
      }
    }
    // No valid input provided
    else {
      res.status(400).json({
        success: false,
        error: 'Either text description or image is required'
      });
      return;
    }

    console.log('Generating recipe with description:', description);
    
    // Generate recipe using OpenAI
    const generatedRecipe = await generateRecipe({
      description,
      allergens: parsedAllergens,
      spiceLevel: parsedSpiceLevel,
    });

    // Search for a matching image
    const imageUrl = await searchRecipeImage(
      generatedRecipe.recipeName,
      generatedRecipe.cuisineType
    );    // Create the complete recipe object
    const recipeData = {
      ...generatedRecipe,
      imageUrl,
      spiceLevel: parsedSpiceLevel,
      allergens: parsedAllergens,
      originalInput: description,
      inputType,
      userId: req.user?.id || undefined
    };

    // Save to database
    const recipe = new Recipe(recipeData);
    await recipe.save();

    res.status(201).json({
      success: true,
      message: 'Recipe generated successfully',
      data: { recipe: { ...recipeData, _id: recipe._id } }
    });
  } catch (error) {
    console.error('Error generating recipe:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate recipe'
    });
  }
};

// Get user's recipe history
export const getUserRecipes = async (req: AuthRequest, res: Response<ApiResponse>): Promise<void> => {
  try {
    const { page = '1', limit = '10', sortBy = 'createdAt', sortOrder = 'desc' } = req.query as PaginationQuery;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Get recipes with pagination
    const recipes = await Recipe.find({ userId: req.user!.id })
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Recipe.countDocuments({ userId: req.user!.id });

    res.status(200).json({
      success: true,
      data: {
        recipes,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalRecipes: total,
          hasNext: pageNum < Math.ceil(total / limitNum),
          hasPrev: pageNum > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching user recipes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recipes'
    });
  }
};

// Get recipe by ID
export const getRecipeById = async (req: AuthRequest, res: Response<ApiResponse>): Promise<void> => {
  try {
    const { id } = req.params;

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      res.status(404).json({
        success: false,
        error: 'Recipe not found'
      });
      return;
    }

    // Check if user owns the recipe (if authentication is provided)
    if (req.user && recipe.userId && recipe.userId.toString() !== req.user.id) {
      res.status(403).json({
        success: false,
        error: 'Not authorized to access this recipe'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { recipe }
    });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recipe'
    });
  }
};

// Search recipes
export const searchRecipes = async (req: AuthRequest, res: Response<ApiResponse>): Promise<void> => {
  try {
    const { 
      q = '', 
      cuisine, 
      difficulty, 
      spiceLevel, 
      allergens,
      page = '1', 
      limit = '10' 
    } = req.query as RecipeFilters & PaginationQuery;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build search query
    const searchQuery: any = {};

    // Text search
    if (q) {
      searchQuery.$text = { $search: q };
    }

    // Filter by cuisine
    if (cuisine) {
      searchQuery.cuisineType = { $regex: cuisine, $options: 'i' };
    }

    // Filter by difficulty
    if (difficulty) {
      searchQuery.difficulty = difficulty;
    }

    // Filter by spice level
    if (spiceLevel) {
      const spiceLevelNum = parseInt(spiceLevel);
      searchQuery.spiceLevel = { $lte: spiceLevelNum };
    }

    // Filter by allergens (exclude recipes with these allergens)
    if (allergens) {
      const allergenArray = allergens.split(',');
      searchQuery.allergens = { $nin: allergenArray };
    }

    // Only show user's recipes if authenticated
    if (req.user) {
      searchQuery.userId = req.user.id;
    }

    const recipes = await Recipe.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Recipe.countDocuments(searchQuery);

    res.status(200).json({
      success: true,
      data: {
        recipes,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalRecipes: total,
          hasNext: pageNum < Math.ceil(total / limitNum),
          hasPrev: pageNum > 1
        }
      }
    });
  } catch (error) {
    console.error('Error searching recipes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search recipes'
    });
  }
};

// Delete recipe
export const deleteRecipe = async (req: AuthRequest, res: Response<ApiResponse>): Promise<void> => {
  try {
    const { id } = req.params;

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      res.status(404).json({
        success: false,
        error: 'Recipe not found'
      });
      return;
    }

    // Check if user owns the recipe
    if (recipe.userId && recipe.userId.toString() !== req.user!.id) {
      res.status(403).json({
        success: false,
        error: 'Not authorized to delete this recipe'
      });
      return;
    }

    await Recipe.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Recipe deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete recipe'
    });
  }
};

// Get public recipes (for discovery)
export const getPublicRecipes = async (req: AuthRequest, res: Response<ApiResponse>): Promise<void> => {
  try {
    const { page = '1', limit = '20', cuisine, difficulty } = req.query as PaginationQuery & RecipeFilters;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build filter query
    const filterQuery: any = {};

    if (cuisine) {
      filterQuery.cuisineType = { $regex: cuisine, $options: 'i' };
    }

    if (difficulty) {
      filterQuery.difficulty = difficulty;
    }

    const recipes = await Recipe.find(filterQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('-userId'); // Don't expose user IDs

    const total = await Recipe.countDocuments(filterQuery);

    res.status(200).json({
      success: true,
      data: {
        recipes,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalRecipes: total,
          hasNext: pageNum < Math.ceil(total / limitNum),
          hasPrev: pageNum > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching public recipes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch public recipes'
    });
  }
};
