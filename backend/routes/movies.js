import express from 'express';
import { body, validationResult } from 'express-validator';
import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getMoviePoster
} from '../controllers/movieController.js';
import { uploadPoster } from '../middleware/upload.js';

const router = express.Router();

// Validation rules
const movieValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('year').custom((value) => {
    const year = typeof value === 'string' ? parseInt(value) : value;
    if (isNaN(year) || year < 1900 || year > 2030) {
      throw new Error('Year must be between 1900 and 2030');
    }
    return true;
  }),
  body('language')
    .notEmpty().withMessage('Language is required')
    .isIn(['uzbek','russian','english','german','spanish','italian','japanese','chinese','turkish','korean'])
    .withMessage('Language must be one of: uzbek, russian, english, german, spanish, italian, japanese, chinese, turkish, korean'),
  body('rating').custom((value) => {
    const rating = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(rating) || rating < 1 || rating > 10) {
      throw new Error('Rating must be between 1 and 10');
    }
    return true;
  }),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isIn(['movies', 'series']).withMessage('Category must be movies or series'),
  body('genres').custom((value) => {
    // Allow empty arrays temporarily, but warn
    if (!value || (Array.isArray(value) && value.length === 0)) {
      throw new Error('At least one genre is required');
    }
    return true;
  }),
  body('quality').custom((value) => {
    // Allow empty arrays temporarily, but warn
    if (!value || (Array.isArray(value) && value.length === 0)) {
      throw new Error('At least one quality is required');
    }
    return true;
  }),
  body('videoLink').trim().notEmpty().withMessage('Video link is required')
];

const seriesValidation = [
  body('totalEpisodes').optional().isInt({ min: 1 }).withMessage('Total episodes must be at least 1'),
  body('currentEpisode').optional().isInt({ min: 1 }).withMessage('Current episode must be at least 1')
];

// Pre-process FormData fields before validation
const preProcessFormData = (req, res, next) => {
  try {
    // Handle videoQuality -> quality mapping (frontend sends both)
    if (req.body.videoQuality) {
      // If both exist, prefer quality, otherwise use videoQuality
      if (!req.body.quality) {
        req.body.quality = req.body.videoQuality;
      }
    }
    
    // Parse JSON fields if they are strings (from FormData)
    // Ensure genres is always an array
    if (req.body.genres) {
      if (typeof req.body.genres === 'string') {
        try {
          req.body.genres = JSON.parse(req.body.genres);
        } catch (e) {
          // If parsing fails, try splitting by comma
          req.body.genres = req.body.genres.split(',').map(g => g.trim()).filter(g => g);
        }
      }
      // Ensure it's an array
      if (!Array.isArray(req.body.genres)) {
        req.body.genres = [];
      }
    } else {
      // If genres is missing, set to empty array (validation will catch it)
      req.body.genres = [];
    }
    
    // Ensure quality is always an array
    if (req.body.quality) {
      if (typeof req.body.quality === 'string') {
        try {
          req.body.quality = JSON.parse(req.body.quality);
        } catch (e) {
          // If parsing fails, try splitting by comma
          req.body.quality = req.body.quality.split(',').map(q => q.trim()).filter(q => q);
        }
      }
      // Ensure it's an array
      if (!Array.isArray(req.body.quality)) {
        req.body.quality = [];
      }
    } else {
      // If quality is missing, set to empty array (validation will catch it)
      req.body.quality = [];
    }
    
    // Convert string numbers to actual numbers
    if (req.body.year) {
      if (typeof req.body.year === 'string') {
        const parsed = parseInt(req.body.year, 10);
        req.body.year = isNaN(parsed) ? req.body.year : parsed;
      }
    }
    
    if (req.body.rating) {
      if (typeof req.body.rating === 'string') {
        const parsed = parseFloat(req.body.rating);
        req.body.rating = isNaN(parsed) ? req.body.rating : parsed;
      }
    }
    
    if (req.body.totalEpisodes) {
      if (typeof req.body.totalEpisodes === 'string') {
        const parsed = parseInt(req.body.totalEpisodes, 10);
        req.body.totalEpisodes = isNaN(parsed) ? undefined : parsed;
      }
    }
    
    if (req.body.currentEpisode) {
      if (typeof req.body.currentEpisode === 'string') {
        const parsed = parseInt(req.body.currentEpisode, 10);
        req.body.currentEpisode = isNaN(parsed) ? undefined : parsed;
      }
    }
    
    next();
  } catch (error) {
    console.error('Error in preProcessFormData:', error);
    next(error);
  }
};

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('Validation errors:', errors.array());
    console.error('Request body:', {
      title: req.body.title,
      category: req.body.category,
      genres: req.body.genres,
      quality: req.body.quality,
      videoQuality: req.body.videoQuality
    });
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path || err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// Routes
router.get('/', getAllMovies);
router.get('/:id/poster', getMoviePoster); // Poster endpoint - should be before /:id route
router.get('/:id', getMovieById);
router.post('/', uploadPoster.single('poster'), preProcessFormData, movieValidation, handleValidationErrors, createMovie);
router.put('/:id', uploadPoster.single('poster'), preProcessFormData, movieValidation, seriesValidation, handleValidationErrors, updateMovie);
router.delete('/:id', deleteMovie);

export default router;

