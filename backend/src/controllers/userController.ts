import { Response } from 'express';
import Recipe from '@/models/Recipe';
import User from '@/models/User';
import { ApiResponse, AuthRequest, UserStats } from '@/types';

// Get user statistics
export const getUserStats = async (req: AuthRequest, res: Response<ApiResponse<UserStats>>) => {
  try {
    const userId = req.user!.id;

    // Get user's recipes for analysis
    const recipes = await Recipe.find({ userId }).sort({ createdAt: -1 });

    // Calculate statistics
    const totalRecipes = recipes.length;
    
    // Top cuisines
    const cuisineCounts: { [key: string]: number } = {};
    recipes.forEach(recipe => {
      cuisineCounts[recipe.cuisineType] = (cuisineCounts[recipe.cuisineType] || 0) + 1;
    });

    // Favorite ingredients (top 10 most used)
    const ingredientCounts: { [key: string]: number } = {};
    recipes.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        const normalized = ingredient.toLowerCase().trim();
        ingredientCounts[normalized] = (ingredientCounts[normalized] || 0) + 1;
      });
    });

    const favoriteIngredients = Object.entries(ingredientCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([ingredient]) => ingredient);

    // Average spice level
    const totalSpiceLevel = recipes.reduce((sum, recipe) => sum + recipe.spiceLevel, 0);
    const averageSpiceLevel = totalRecipes > 0 ? totalSpiceLevel / totalRecipes : 0;

    // Recent recipes (last 10)
    const recentRecipes = recipes.slice(0, 10);

    // Recipes over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentData: { [key: string]: number } = {};
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      recentData[dateStr] = 0;
    }
    
    recipes
      .filter(recipe => recipe.createdAt && recipe.createdAt >= thirtyDaysAgo)
      .forEach(recipe => {
        const dateStr = recipe.createdAt!.toISOString().split('T')[0];
        if (recentData[dateStr] !== undefined) {
          recentData[dateStr]++;
        }
      });

    const recipesOverTime = Object.entries(recentData).map(([date, count]) => ({
      date,
      count
    }));

    const stats: UserStats = {
      totalRecipes,
      topCuisines: cuisineCounts,
      recentRecipes,
      recipesOverTime,
      favoriteIngredients,
      averageSpiceLevel: Math.round(averageSpiceLevel * 10) / 10
    };

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user statistics'
    });
  }
};

// Get user profile with additional info
export const getUserProfile = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const userId = req.user!.id;

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get recipe count
    const recipeCount = await Recipe.countDocuments({ userId });

    // Get recent activity (last 5 recipes)
    const recentRecipes = await Recipe.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('recipeName cuisineType createdAt');

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          preferences: user.preferences,
          createdAt: user.createdAt
        },
        stats: {
          recipeCount,
          recentRecipes
        }
      }
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user profile'
    });
  }
};

// Update user preferences
export const updateUserPreferences = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const userId = req.user!.id;
    const { favoriteCategories, allergens, spiceLevel } = req.body;

    const updateData: any = {};
    
    if (favoriteCategories !== undefined) {
      updateData['preferences.favoriteCategories'] = favoriteCategories;
    }
    
    if (allergens !== undefined) {
      updateData['preferences.allergens'] = allergens;
    }
    
    if (spiceLevel !== undefined) {
      if (spiceLevel < 0 || spiceLevel > 10) {
        return res.status(400).json({
          success: false,
          error: 'Spice level must be between 0 and 10'
        });
      }
      updateData['preferences.spiceLevel'] = spiceLevel;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        preferences: user.preferences
      }
    });

  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update preferences'
    });
  }
};

// Get dashboard data (combines stats and recent activity)
export const getDashboardData = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const userId = req.user!.id;

    // Get user info
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get all user recipes
    const recipes = await Recipe.find({ userId }).sort({ createdAt: -1 });

    // Calculate quick stats
    const totalRecipes = recipes.length;
    const recentRecipes = recipes.slice(0, 5);
    
    // Calculate cuisine distribution
    const cuisineCounts: { [key: string]: number } = {};
    recipes.forEach(recipe => {
      cuisineCounts[recipe.cuisineType] = (cuisineCounts[recipe.cuisineType] || 0) + 1;
    });

    // Get top 5 cuisines
    const topCuisines = Object.entries(cuisineCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .reduce((obj, [cuisine, count]) => {
        obj[cuisine] = count;
        return obj;
      }, {} as { [key: string]: number });

    // Weekly activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const weeklyActivity = recipes.filter(recipe => 
      recipe.createdAt && recipe.createdAt >= sevenDaysAgo
    ).length;

    // Monthly activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const monthlyActivity = recipes.filter(recipe => 
      recipe.createdAt && recipe.createdAt >= thirtyDaysAgo
    ).length;

    res.status(200).json({
      success: true,
      data: {
        user: {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          preferences: user.preferences
        },
        stats: {
          totalRecipes,
          weeklyActivity,
          monthlyActivity,
          topCuisines
        },
        recentRecipes
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data'
    });
  }
};
