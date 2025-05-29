import express from 'express';
import {
  getUserStats,
  getUserProfile,
  updateUserPreferences,
  getDashboardData
} from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validationMiddleware';
import { body } from 'express-validator';

const router = express.Router();

// Validation rules
const preferencesValidation = [
  body('favoriteCategories')
    .optional()
    .isArray()
    .withMessage('Favorite categories must be an array'),
  body('allergens')
    .optional()
    .isArray()
    .withMessage('Allergens must be an array'),
  body('spiceLevel')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('Spice level must be between 0 and 10')
];

// All user routes are protected
router.use(protect);

// User routes
router.get('/profile', getUserProfile);
router.get('/stats', getUserStats);
router.get('/dashboard', getDashboardData);
router.put('/preferences', preferencesValidation, validateRequest, updateUserPreferences);

export default router;
