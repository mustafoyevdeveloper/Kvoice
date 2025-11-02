import express from 'express';
import { body, validationResult } from 'express-validator';
import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
} from '../controllers/movieController.js';
import { uploadPoster } from '../middleware/upload.js';

const router = express.Router();

// Validation rules
const movieValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('year').isInt({ min: 1900, max: 2030 }).withMessage('Year must be between 1900 and 2030'),
  body('language').notEmpty().withMessage('Language is required'),
  body('rating').isFloat({ min: 1, max: 10 }).withMessage('Rating must be between 1 and 10'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isIn(['movies', 'series']).withMessage('Category must be movies or series'),
  body('genres').isArray({ min: 1 }).withMessage('At least one genre is required'),
  body('quality').isArray({ min: 1 }).withMessage('At least one quality is required'),
  body('videoLink').trim().notEmpty().withMessage('Video link is required')
];

const seriesValidation = [
  body('totalEpisodes').optional().isInt({ min: 1 }).withMessage('Total episodes must be at least 1'),
  body('currentEpisode').optional().isInt({ min: 1 }).withMessage('Current episode must be at least 1')
];

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Routes
router.get('/', getAllMovies);
router.get('/:id', getMovieById);
router.post('/', uploadPoster.single('poster'), movieValidation, handleValidationErrors, createMovie);
router.put('/:id', uploadPoster.single('poster'), movieValidation, seriesValidation, handleValidationErrors, updateMovie);
router.delete('/:id', deleteMovie);

export default router;

