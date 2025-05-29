import express from 'express';
import { register, login, getMe, updateProfile, deleteAccount } from '@/controllers/authController';
import { protect } from '@/middleware/authMiddleware';
import { validateRequest } from '@/middleware/validationMiddleware';
import { body } from 'express-validator';

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL'),
  body('preferences.favoriteCategories')
    .optional()
    .isArray()
    .withMessage('Favorite categories must be an array'),
  body('preferences.allergens')
    .optional()
    .isArray()
    .withMessage('Allergens must be an array'),
  body('preferences.spiceLevel')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('Spice level must be between 0 and 10')
];

// Public routes
router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfileValidation, validateRequest, updateProfile);
router.delete('/account', protect, deleteAccount);

export default router;
