import { Response } from 'express';
import multer from 'multer';
import Recipe from '../models/Recipe';
import { generateRecipe, analyzeImage } from '../services/openaiService';
import { searchRecipeImage } from '../services/imageService';
import { ApiResponse, AuthRequest, RecipeRequest, PaginationQuery, RecipeFilters } from '../types';

// Generate recipe from text or image
export const generateRecipeFromInput = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { text, allergens = [], spiceLevel = 5 } = req.body;
    const image = req.file;

    let description = '';
    let inputType: 'text' | 'image' = 'text';

    // Process input based on type
    if (image) {
      inputType = 'image';
      description = await analyzeImage(image.buffer);
    } else if (text) {
      description = text.trim();
    } else {
      return res.status(400).json({
        success: false,
        error: 'Either text description or image is required'
      });
    }

    // Generate recipe using OpenAI
    const generatedRecipe = await generateRecipe({
      description,
      allergens,
      spiceLevel,
    });

    // Search for a matching image
    const imageUrl = await searchRecipeImage(
      generatedRecipe.recipeName,
      generatedRecipe.cuisineType
    );

    // Create the complete recipe object
    const recipeData = {
      ...generatedRecipe,
      imageUrl,
      spiceLevel,
      allergens,
      originalInput: description,
      inputType,
      userId: req.user?.id || undefined
    };

    // Save to database
    const recipe = new Recipe(recipeData);
    await recipe.save();    res.status(201).json({
      success: true,
      message: 'Recipe generated successfully',
      data: { recipe: { ...recipeData, _id: recipe._id } }
    });
  } catch (error) {
    console.error('Error generating recipe:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate recipe'
    });
  }
};

// Get user's recipe history
export const getUserRecipes = async (req: AuthRequest, res: Response<ApiResponse>) => {
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
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch recipes'
    });
  }
};

// Get recipe by ID
export const getRecipeById = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        error: 'Recipe not found'
      });
    }

    // Check if user owns the recipe (if authentication is provided)
    if (req.user && recipe.userId && recipe.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this recipe'
      });
    }

    res.status(200).json({
      success: true,
      data: { recipe }
    });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch recipe'
    });
  }
};

// Search recipes
export const searchRecipes = async (req: AuthRequest, res: Response<ApiResponse>) => {
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
    return res.status(500).json({
      success: false,
      error: 'Failed to search recipes'
    });
  }
};

// Delete recipe
export const deleteRecipe = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        error: 'Recipe not found'
      });
    }

    // Check if user owns the recipe
    if (recipe.userId && recipe.userId.toString() !== req.user!.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this recipe'
      });
    }

    await Recipe.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Recipe deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete recipe'
    });
  }
};

// Get public recipes (for discovery)
export const getPublicRecipes = async (req: AuthRequest, res: Response<ApiResponse>) => {
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
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch public recipes'
    });
  }
};
