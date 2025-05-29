import mongoose, { Document, Schema } from 'mongoose';
import { Recipe as RecipeType } from '../types';

interface RecipeDocument extends Omit<RecipeType, '_id'>, Document {}

const recipeSchema = new Schema<RecipeDocument>({
  recipeName: {
    type: String,
    required: [true, 'Recipe name is required'],
    trim: true,
    maxlength: [100, 'Recipe name cannot exceed 100 characters']
  },
  ingredients: [{
    type: String,
    required: [true, 'Ingredients are required'],
    trim: true
  }],
  instructions: [{
    type: String,
    required: [true, 'Instructions are required'],
    trim: true
  }],
  cuisineType: {
    type: String,
    required: [true, 'Cuisine type is required'],
    trim: true,
    maxlength: [50, 'Cuisine type cannot exceed 50 characters']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  cookingTime: {
    type: String,
    trim: true
  },
  servings: {
    type: Number,
    min: [1, 'Servings must be at least 1'],
    max: [20, 'Servings cannot exceed 20']
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  spiceLevel: {
    type: Number,
    required: [true, 'Spice level is required'],
    min: [0, 'Spice level must be between 0 and 10'],
    max: [10, 'Spice level must be between 0 and 10']
  },
  allergens: [{
    type: String,
    trim: true
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow anonymous recipe generation
  },
  originalInput: {
    type: String,
    required: [true, 'Original input is required'],
    trim: true
  },
  inputType: {
    type: String,
    enum: ['text', 'image'],
    required: [true, 'Input type is required']
  },
  nutritionalInfo: {
    calories: {
      type: Number,
      min: 0
    },
    protein: {
      type: Number,
      min: 0
    },
    carbs: {
      type: Number,
      min: 0
    },
    fat: {
      type: Number,
      min: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
recipeSchema.index({ userId: 1, createdAt: -1 });
recipeSchema.index({ cuisineType: 1 });
recipeSchema.index({ tags: 1 });
recipeSchema.index({ spiceLevel: 1 });
recipeSchema.index({ difficulty: 1 });
recipeSchema.index({ createdAt: -1 });

// Text search index
recipeSchema.index({
  recipeName: 'text',
  ingredients: 'text',
  cuisineType: 'text',
  tags: 'text'
});

// Virtual for recipe rating (if you add ratings later)
recipeSchema.virtual('rating', {
  ref: 'Rating',
  localField: '_id',
  foreignField: 'recipeId'
});

export default mongoose.model<RecipeDocument>('Recipe', recipeSchema);
