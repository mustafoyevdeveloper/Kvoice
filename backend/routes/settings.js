import express from 'express';
import { body, query } from 'express-validator';
import { 
  getSettings, 
  updateSettings, 
  resetSettings,
  getSection,
  updateSection
} from '../controllers/settingsController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Validation rules
const updateSettingsValidation = [
  body('siteName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Site name cannot exceed 100 characters'),
  body('siteDescription')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Site description cannot exceed 500 characters'),
  body('siteIcon')
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage('Site icon cannot exceed 10 characters'),
  body('contactEmail')
    .optional()
    .isEmail()
    .withMessage('Contact email must be a valid email'),
  body('contactPhone')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Contact phone cannot exceed 20 characters'),
  body('socialMedia.facebook')
    .optional()
    .isURL()
    .withMessage('Facebook URL must be a valid URL'),
  body('socialMedia.instagram')
    .optional()
    .isURL()
    .withMessage('Instagram URL must be a valid URL'),
  body('socialMedia.telegram')
    .optional()
    .isURL()
    .withMessage('Telegram URL must be a valid URL'),
  body('socialMedia.youtube')
    .optional()
    .isURL()
    .withMessage('YouTube URL must be a valid URL'),
  body('socialMedia.twitter')
    .optional()
    .isURL()
    .withMessage('Twitter URL must be a valid URL'),
  body('socialMedia.tiktok')
    .optional()
    .isURL()
    .withMessage('TikTok URL must be a valid URL'),
  body('sectionNames.premieres')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Premieres section name cannot exceed 50 characters'),
  body('sectionNames.movies')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Movies section name cannot exceed 50 characters'),
  body('sectionNames.series')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Series section name cannot exceed 50 characters'),
  body('sectionNames.trailers')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Trailers section name cannot exceed 50 characters'),
  body('sectionNames.new')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('New section name cannot exceed 50 characters'),
  body('sectionTitles.premieres')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Premieres section title cannot exceed 100 characters'),
  body('sectionTitles.movies')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Movies section title cannot exceed 100 characters'),
  body('sectionTitles.series')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Series section title cannot exceed 100 characters'),
  body('sectionTitles.trailers')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Trailers section title cannot exceed 100 characters'),
  body('sectionTitles.new')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('New section title cannot exceed 100 characters'),
  body('sectionDescriptions.premieres')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Premieres section description cannot exceed 200 characters'),
  body('sectionDescriptions.movies')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Movies section description cannot exceed 200 characters'),
  body('sectionDescriptions.series')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Series section description cannot exceed 200 characters'),
  body('sectionDescriptions.trailers')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Trailers section description cannot exceed 200 characters'),
  body('sectionDescriptions.new')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('New section description cannot exceed 200 characters'),
  body('heroTitle')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Hero title cannot exceed 100 characters'),
  body('heroSubtitle')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Hero subtitle cannot exceed 200 characters'),
  body('aboutTitle')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('About title cannot exceed 100 characters'),
  body('aboutDescription')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('About description cannot exceed 2000 characters'),
  body('privacyTitle')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Privacy title cannot exceed 100 characters'),
  body('privacyDescription')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Privacy description cannot exceed 2000 characters'),
  body('termsTitle')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Terms title cannot exceed 100 characters'),
  body('termsDescription')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Terms description cannot exceed 2000 characters'),
  body('maintenanceMode')
    .optional()
    .isBoolean()
    .withMessage('Maintenance mode must be a boolean'),
  body('maintenanceMessage')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Maintenance message cannot exceed 500 characters'),
  body('seoTitle')
    .optional()
    .trim()
    .isLength({ max: 60 })
    .withMessage('SEO title cannot exceed 60 characters'),
  body('seoDescription')
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage('SEO description cannot exceed 160 characters'),
  body('itemsPerPage')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Items per page must be between 1 and 100'),
  body('featuredContentLimit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Featured content limit must be between 1 and 50'),
  body('newContentDays')
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage('New content days must be between 1 and 365'),
  body('maxFileSize')
    .optional()
    .isInt({ min: 1000000, max: 1000000000 })
    .withMessage('Max file size must be between 1MB and 1GB'),
  body('maxLoginAttempts')
    .optional()
    .isInt({ min: 3, max: 10 })
    .withMessage('Max login attempts must be between 3 and 10'),
  body('lockoutDuration')
    .optional()
    .isInt({ min: 300, max: 3600 })
    .withMessage('Lockout duration must be between 5 minutes and 1 hour'),
  body('emailNotifications')
    .optional()
    .isBoolean()
    .withMessage('Email notifications must be a boolean'),
  body('pushNotifications')
    .optional()
    .isBoolean()
    .withMessage('Push notifications must be a boolean'),
  body('defaultLanguage')
    .optional()
    .isIn(['uz', 'ru', 'en'])
    .withMessage('Invalid default language'),
  body('supportedLanguages')
    .optional()
    .isArray()
    .withMessage('Supported languages must be an array'),
  body('supportedLanguages.*')
    .optional()
    .isIn(['uz', 'ru', 'en'])
    .withMessage('Invalid supported language'),
  body('cacheEnabled')
    .optional()
    .isBoolean()
    .withMessage('Cache enabled must be a boolean'),
  body('cacheDuration')
    .optional()
    .isInt({ min: 60, max: 86400 })
    .withMessage('Cache duration must be between 1 minute and 24 hours'),
  body('apiRateLimit')
    .optional()
    .isInt({ min: 10, max: 1000 })
    .withMessage('API rate limit must be between 10 and 1000'),
  body('apiRateLimitWindow')
    .optional()
    .isInt({ min: 60, max: 3600 })
    .withMessage('API rate limit window must be between 1 minute and 1 hour')
];

const getSectionValidation = [
  query('section')
    .isIn(['basic', 'contact', 'social', 'sections', 'hero', 'about', 'privacy', 'terms', 'technical', 'seo', 'content', 'security', 'notifications', 'theme', 'language', 'cache', 'api'])
    .withMessage('Invalid section name')
];

const updateSectionValidation = [
  body('section')
    .isIn(['basic', 'contact', 'social', 'sections', 'hero', 'about', 'privacy', 'terms', 'technical', 'seo', 'content', 'security', 'notifications', 'theme', 'language', 'cache', 'api'])
    .withMessage('Invalid section name')
];

// Routes
router.get('/', getSettings);
router.put('/', authenticate, requireAdmin, updateSettingsValidation, handleValidationErrors, updateSettings);
router.post('/reset', authenticate, requireAdmin, resetSettings);
router.get('/section/:section', getSectionValidation, handleValidationErrors, getSection);
router.put('/section/:section', authenticate, requireAdmin, updateSectionValidation, handleValidationErrors, updateSection);

export default router;
