import express from 'express';
import { body, query } from 'express-validator';
import { 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  getUserWatchHistory,
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
  addToWatchlist,
  removeFromWatchlist
} from '../controllers/userController.js';
import { authenticate, requireAdmin, requireOwnershipOrAdmin } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Validation rules
const updateUserValidation = [
  body('profile.firstName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),
  body('profile.lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),
  body('profile.bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  body('profile.dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Invalid date of birth format'),
  body('profile.gender')
    .optional()
    .isIn(['male', 'female', 'other', 'prefer-not-to-say'])
    .withMessage('Invalid gender'),
  body('profile.country')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Country name cannot exceed 100 characters'),
  body('preferences.language')
    .optional()
    .isIn(['uzbek', 'russian', 'english', 'german', 'spanish', 'italian', 'japanese', 'chinese', 'turkish', 'korean'])
    .withMessage('Invalid language preference'),
  body('preferences.notifications.email')
    .optional()
    .isBoolean()
    .withMessage('Email notifications must be a boolean'),
  body('preferences.notifications.push')
    .optional()
    .isBoolean()
    .withMessage('Push notifications must be a boolean'),
  body('preferences.notifications.marketing')
    .optional()
    .isBoolean()
    .withMessage('Marketing notifications must be a boolean'),
  body('preferences.privacy.profileVisibility')
    .optional()
    .isIn(['public', 'friends', 'private'])
    .withMessage('Invalid profile visibility setting'),
  body('preferences.privacy.showWatchHistory')
    .optional()
    .isBoolean()
    .withMessage('Show watch history must be a boolean'),
  body('preferences.privacy.showFavorites')
    .optional()
    .isBoolean()
    .withMessage('Show favorites must be a boolean'),
  body('role')
    .optional()
    .isIn(['user', 'moderator', 'admin'])
    .withMessage('Invalid role'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

const getUserValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('role')
    .optional()
    .isIn(['user', 'moderator', 'admin'])
    .withMessage('Invalid role'),
  query('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  query('sort')
    .optional()
    .isIn(['username', 'email', 'createdAt', 'lastLogin', 'loginCount'])
    .withMessage('Invalid sort field'),
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be asc or desc')
];

const watchHistoryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sort')
    .optional()
    .isIn(['watchedAt', 'progress', 'completed'])
    .withMessage('Invalid sort field'),
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be asc or desc')
];

const favoritesValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sort')
    .optional()
    .isIn(['title', 'year', 'rating', 'createdAt'])
    .withMessage('Invalid sort field'),
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be asc or desc')
];

// Routes
router.get('/', authenticate, requireAdmin, getUserValidation, handleValidationErrors, getUsers);
router.get('/:id', authenticate, requireOwnershipOrAdmin('id'), getUserById);
router.put('/:id', authenticate, requireOwnershipOrAdmin('id'), updateUserValidation, handleValidationErrors, updateUser);
router.delete('/:id', authenticate, requireAdmin, deleteUser);
router.get('/:id/watch-history', authenticate, requireOwnershipOrAdmin('id'), watchHistoryValidation, handleValidationErrors, getUserWatchHistory);
router.get('/:id/favorites', authenticate, requireOwnershipOrAdmin('id'), favoritesValidation, handleValidationErrors, getUserFavorites);
router.post('/favorites/:movieId', authenticate, addToFavorites);
router.delete('/favorites/:movieId', authenticate, removeFromFavorites);
router.post('/watchlist/:movieId', authenticate, addToWatchlist);
router.delete('/watchlist/:movieId', authenticate, removeFromWatchlist);

export default router;
