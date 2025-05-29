import express from 'express';

import multer from 'multer';
import { generateRecipeFromInput, getUserRecipes, deleteRecipe } from '../controllers/recipeController';
import { protect, optional } from '../middleware/authMiddleware';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req: express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Generate recipe route
router.post('/generate', upload.single('image'), optional, generateRecipeFromInput);

// Get user recipes
router.get('/', protect, getUserRecipes);

// Delete recipe
router.delete('/:id', protect, deleteRecipe);

export default router;
