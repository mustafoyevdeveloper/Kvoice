import express from 'express';
import { body } from 'express-validator';
import { 
  register, 
  login, 
  logout, 
  getMe, 
  refreshToken, 
  updateProfile, 
  changePassword,
  createAdmin
} from '../controllers/authController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Validation rules
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
    .withMessage('Password must contain at least one letter and one number'),
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
  body('preferences.language')
    .optional()
    .isIn(['uzbek', 'russian', 'english', 'german', 'spanish', 'italian', 'japanese', 'chinese', 'turkish', 'korean'])
    .withMessage('Invalid language preference')
];

const loginValidation = [
  body('identifier')
    .notEmpty()
    .withMessage('Email or username is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const updateProfileValidation = [
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
    .withMessage('Show favorites must be a boolean')
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
    .withMessage('New password must contain at least one letter and one number'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    })
];

const createAdminValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
    .withMessage('Password must contain at least one letter and one number'),
  body('role')
    .optional()
    .isIn(['admin', 'moderator'])
    .withMessage('Invalid role')
];

// Routes
router.post('/register', registerValidation, handleValidationErrors, register);
router.post('/login', loginValidation, handleValidationErrors, login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);
router.post('/refresh', refreshToken);
router.put('/profile', authenticate, updateProfileValidation, handleValidationErrors, updateProfile);
router.put('/change-password', authenticate, changePasswordValidation, handleValidationErrors, changePassword);
router.post('/create-admin', authenticate, createAdminValidation, handleValidationErrors, createAdmin);

export default router;
