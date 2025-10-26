import express from 'express';
import { query, body } from 'express-validator';
import { 
  getDashboard,
  getContent,
  updateContentStatus,
  getAnalytics,
  getUsers,
  bulkUpdateStatus
} from '../controllers/adminController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Validation rules
const getContentValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('category')
    .optional()
    .isIn(['movies', 'series', 'trailers', 'premieres', 'new'])
    .withMessage('Invalid category'),
  query('status')
    .optional()
    .isIn(['draft', 'published', 'archived', 'pending'])
    .withMessage('Invalid status'),
  query('sort')
    .optional()
    .isIn(['title', 'year', 'rating', 'views', 'createdAt', 'updatedAt'])
    .withMessage('Invalid sort field'),
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be asc or desc')
];

const updateContentStatusValidation = [
  body('status')
    .isIn(['draft', 'published', 'archived', 'pending'])
    .withMessage('Invalid status')
];

const bulkUpdateStatusValidation = [
  body('ids')
    .isArray({ min: 1 })
    .withMessage('IDs must be an array with at least one item'),
  body('ids.*')
    .isMongoId()
    .withMessage('Each ID must be a valid MongoDB ObjectId'),
  body('status')
    .isIn(['draft', 'published', 'archived', 'pending'])
    .withMessage('Invalid status'),
  body('type')
    .optional()
    .isIn(['movie', 'series', 'trailer', 'premiere'])
    .withMessage('Invalid content type')
];

const getAnalyticsValidation = [
  query('dateRange')
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage('Date range must be between 1 and 365 days'),
  query('eventType')
    .optional()
    .isIn(['view', 'rating', 'search', 'share', 'download', 'like', 'comment', 'login', 'logout'])
    .withMessage('Invalid event type'),
  query('contentType')
    .optional()
    .isIn(['movie', 'series', 'trailer', 'premiere'])
    .withMessage('Invalid content type')
];

const getUsersValidation = [
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

// Routes
router.get('/dashboard', authenticate, requireAdmin, getDashboard);
router.get('/content', authenticate, requireAdmin, getContentValidation, handleValidationErrors, getContent);
router.put('/content/:id/status', authenticate, requireAdmin, updateContentStatusValidation, handleValidationErrors, updateContentStatus);
router.get('/analytics', authenticate, requireAdmin, getAnalyticsValidation, handleValidationErrors, getAnalytics);
router.get('/users', authenticate, requireAdmin, getUsersValidation, handleValidationErrors, getUsers);
router.put('/content/bulk-status', authenticate, requireAdmin, bulkUpdateStatusValidation, handleValidationErrors, bulkUpdateStatus);

export default router;
