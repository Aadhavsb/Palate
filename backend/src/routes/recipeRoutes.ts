import express from 'express';
import multer from 'multer';
import { generateRecipeFromText, generateRecipeFromImage } from '../services/recipeService';
import { searchRecipeImage } from '../services/imageService';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

router.post('/generate', upload.single('image'), async (req, res) => {
  try {
    const { text, allergens, spiceLevel } = req.body;
    const image = req.file;

    // Validate input
    if (!text && !image) {
      return res.status(400).json({
        success: false,
        error: 'Either text description or image is required'
      });
    }

    // Parse allergens
    let parsedAllergens: string[] = [];
    if (allergens) {
      try {
        parsedAllergens = JSON.parse(allergens);
      } catch (error) {
        console.warn('Failed to parse allergens:', error);
      }
    }

    // Parse spice level
    const parsedSpiceLevel = spiceLevel ? parseInt(spiceLevel, 10) : 5;

    let recipe;

    if (text) {
      // Generate recipe from text
      recipe = await generateRecipeFromText(text, parsedAllergens, parsedSpiceLevel);
    } else if (image) {
      // Generate recipe from image
      recipe = await generateRecipeFromImage(image.buffer, parsedAllergens, parsedSpiceLevel);
    }

    if (!recipe) {
      throw new Error('Failed to generate recipe');
    }

    // Add image to recipe if not present
    if (!recipe.image) {
      try {
        recipe.image = await searchRecipeImage(recipe.name, recipe.cuisine || '');
      } catch (imageError) {
        console.warn('Failed to fetch recipe image:', imageError);
        recipe.image = `https://via.placeholder.com/800x600/1f2937/f97316?text=${encodeURIComponent(recipe.name)}`;
      }
    }

    res.json({
      success: true,
      data: { recipe }
    });

  } catch (error) {
    console.error('Recipe generation error:', error);
    
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          error: 'File size too large. Maximum size is 10MB.'
        });
      }
    }

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate recipe'
    });
  }
});

export default router;
