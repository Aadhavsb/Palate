import mongoose from 'mongoose'

const RecipeSchema = new mongoose.Schema({
  recipeName: {
    type: String,
    required: true,
  },
  ingredients: [{
    type: String,
    required: true,
  }],
  instructions: [{
    type: String,
    required: true,
  }],
  cuisineType: {
    type: String,
    required: true,
  },
  tags: [String],
  imageUrl: {
    type: String,
    required: true,
  },
  cookingTime: String,
  servings: Number,
  difficulty: String,
  spiceLevel: {
    type: Number,
    min: 0,
    max: 10,
  },
  allergens: [String],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  originalInput: {
    type: String, // Store the original text or image description
  },
  inputType: {
    type: String,
    enum: ['text', 'image'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Index for efficient querying
RecipeSchema.index({ userId: 1, createdAt: -1 })
RecipeSchema.index({ cuisineType: 1 })
RecipeSchema.index({ tags: 1 })

export default mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema)
