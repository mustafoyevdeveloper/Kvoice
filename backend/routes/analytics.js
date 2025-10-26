import express from 'express';
import { body, query } from 'express-validator';
import { 
  trackView, 
  trackRating, 
  trackSearch, 
  trackShare,
  getUserAnalytics,
  getContentAnalytics
} from '../controllers/analyticsController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Validation rules
const trackViewValidation = [
  body('contentId')
    .isMongoId()
    .withMessage('Content ID must be a valid MongoDB ObjectId'),
  body('contentType')
    .isIn(['movie', 'series', 'trailer', 'premiere'])
    .withMessage('Invalid content type'),
  body('viewDuration')
    .optional()
    .isNumeric()
    .withMessage('View duration must be a number'),
  body('progress')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Progress must be between 0 and 100'),
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean')
];

const trackRatingValidation = [
  body('contentId')
    .isMongoId()
    .withMessage('Content ID must be a valid MongoDB ObjectId'),
  body('contentType')
    .isIn(['movie', 'series', 'trailer', 'premiere'])
    .withMessage('Invalid content type'),
  body('rating')
    .isInt({ min: 1, max: 10 })
    .withMessage('Rating must be between 1 and 10')
];

const trackSearchValidation = [
  body('searchQuery')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  body('searchResults')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Search results must be a non-negative integer')
];

const trackShareValidation = [
  body('contentId')
    .isMongoId()
    .withMessage('Content ID must be a valid MongoDB ObjectId'),
  body('contentType')
    .isIn(['movie', 'series', 'trailer', 'premiere'])
    .withMessage('Invalid content type'),
  body('platform')
    .isIn(['facebook', 'twitter', 'instagram', 'telegram', 'whatsapp', 'email', 'copy_link'])
    .withMessage('Invalid platform')
];

const getUserAnalyticsValidation = [
  query('dateRange')
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage('Date range must be between 1 and 365 days'),
  query('eventType')
    .optional()
    .isIn(['view', 'rating', 'search', 'share', 'download', 'like', 'comment', 'login', 'logout'])
    .withMessage('Invalid event type')
];

const getContentAnalyticsValidation = [
  query('dateRange')
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage('Date range must be between 1 and 365 days'),
  query('eventType')
    .optional()
    .isIn(['view', 'rating', 'search', 'share', 'download', 'like', 'comment'])
    .withMessage('Invalid event type')
];

// Routes
router.post('/view', optionalAuth, trackViewValidation, handleValidationErrors, trackView);
router.post('/rating', authenticate, trackRatingValidation, handleValidationErrors, trackRating);
router.post('/search', optionalAuth, trackSearchValidation, handleValidationErrors, trackSearch);
router.post('/share', optionalAuth, trackShareValidation, handleValidationErrors, trackShare);
router.get('/user', authenticate, getUserAnalyticsValidation, handleValidationErrors, getUserAnalytics);
router.get('/content/:contentId', optionalAuth, getContentAnalyticsValidation, handleValidationErrors, getContentAnalytics);

export default router;
