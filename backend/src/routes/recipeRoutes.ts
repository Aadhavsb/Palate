import express from 'express';
import multer from 'multer';
import {
  generateRecipeFromInput,
  getUserRecipes,
  getRecipeById,
  searchRecipes,
  deleteRecipe,
  getPublicRecipes
} from '../controllers/recipeController';
import { protect, optional } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validationMiddleware';
import { body, param, query } from 'express-validator';

const router = express.Router();

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Validation rules
const generateRecipeValidation = [
  body('allergens')
    .optional()
    .isArray()
    .withMessage('Allergens must be an array'),
  body('spiceLevel')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('Spice level must be between 0 and 10'),
  body('text')
    .optional()
    .trim()
    .isLength({ min: 3, max: 500 })
    .withMessage('Text description must be between 3 and 500 characters')
];

const recipeIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid recipe ID')
];

const searchValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('spiceLevel')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('Spice level must be between 0 and 10')
];

// Public routes
router.get('/public', searchValidation, validateRequest, getPublicRecipes);
router.get('/search', optional, searchValidation, validateRequest, searchRecipes);
router.get('/:id', optional, recipeIdValidation, validateRequest, getRecipeById);

// Protected routes
router.post('/generate', 
  optional, 
  upload.single('image'), 
  generateRecipeValidation, 
  validateRequest, 
  generateRecipeFromInput
);

router.get('/', protect, searchValidation, validateRequest, getUserRecipes);
router.delete('/:id', protect, recipeIdValidation, validateRequest, deleteRecipe);

export default router;
