import express from 'express';
import { body, query } from 'express-validator';
import { 
  getAllMovies, 
  getMovieById, 
  createMovie, 
  updateMovie, 
  deleteMovie,
  searchMovies,
  likeMovie,
  getVideoUrl,
  getMoviesByCategory,
  getFeaturedMovies,
  getNewMovies,
  getPremiereMovies
} from '../controllers/movieController.js';
import { authenticate, optionalAuth, requireContentManagement } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Validation rules
const createMovieValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('year')
    .isInt({ min: 1900, max: 2030 })
    .withMessage('Year must be between 1900 and 2030'),
  body('language')
    .optional()
    .isIn(['uzbek', 'russian', 'english', 'german', 'spanish', 'italian', 'japanese', 'chinese', 'turkish', 'korean'])
    .withMessage('Invalid language'),
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Rating must be between 0 and 10'),
  body('category')
    .isIn(['movies', 'series', 'trailers', 'premieres', 'new'])
    .withMessage('Invalid category'),
  body('genres')
    .optional()
    .isArray()
    .withMessage('Genres must be an array'),
  body('videoUrl')
    .optional()
    .isURL()
    .withMessage('Video URL must be a valid URL'),
  body('poster')
    .notEmpty()
    .withMessage('Poster is required'),
  body('posterUrl')
    .optional()
    .isURL()
    .withMessage('Poster URL must be a valid URL'),
  body('trailerUrl')
    .optional()
    .isURL()
    .withMessage('Trailer URL must be a valid URL'),
  body('videoQuality')
    .optional()
    .isArray()
    .withMessage('Video quality must be an array'),
  body('isNewContent')
    .optional()
    .isBoolean()
    .withMessage('isNewContent must be a boolean'),
  body('isPremiere')
    .optional()
    .isBoolean()
    .withMessage('isPremiere must be a boolean')
];

const updateMovieValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('year')
    .optional()
    .isInt({ min: 1900, max: 2030 })
    .withMessage('Year must be between 1900 and 2030'),
  body('language')
    .optional()
    .isIn(['uzbek', 'russian', 'english', 'german', 'spanish', 'italian', 'japanese', 'chinese', 'turkish', 'korean'])
    .withMessage('Invalid language'),
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Rating must be between 0 and 10'),
  body('category')
    .optional()
    .isIn(['movies', 'series', 'trailers', 'premieres', 'new'])
    .withMessage('Invalid category'),
  body('genres')
    .optional()
    .isArray()
    .withMessage('Genres must be an array'),
  body('videoUrl')
    .optional()
    .isURL()
    .withMessage('Video URL must be a valid URL'),
  body('posterUrl')
    .optional()
    .isURL()
    .withMessage('Poster URL must be a valid URL'),
  body('trailerUrl')
    .optional()
    .isURL()
    .withMessage('Trailer URL must be a valid URL'),
  body('videoQuality')
    .optional()
    .isArray()
    .withMessage('Video quality must be an array'),
  body('isNewContent')
    .optional()
    .isBoolean()
    .withMessage('isNewContent must be a boolean'),
  body('isPremiere')
    .optional()
    .isBoolean()
    .withMessage('isPremiere must be a boolean')
];

const searchValidation = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  query('category')
    .optional()
    .isIn(['movies', 'series', 'trailers', 'premieres', 'new'])
    .withMessage('Invalid category'),
  query('year')
    .optional()
    .isInt({ min: 1900, max: 2030 })
    .withMessage('Year must be between 1900 and 2030'),
  query('language')
    .optional()
    .isIn(['uzbek', 'russian', 'english', 'german', 'spanish', 'italian', 'japanese', 'chinese', 'turkish', 'korean'])
    .withMessage('Invalid language'),
  query('genre')
    .optional()
    .isIn(['Drama', 'Komediya', 'Fantastika', 'Triller', 'Jangari', 'Romantik', 'Detektiv', 'Tarixiy', 'Oilaviy', 'Dokumental', 'Qo\'rqinchli', 'Sarguzasht', 'Sport', 'Musiqiy', 'G\'ayritabiiy'])
    .withMessage('Invalid genre'),
  query('rating')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Rating must be between 0 and 10'),
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
    .isIn(['title', 'year', 'rating', 'views', 'createdAt'])
    .withMessage('Invalid sort field'),
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be asc or desc')
];

const likeValidation = [
  body('rating')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Rating must be between 1 and 10')
];

// Routes
router.get('/', searchValidation, handleValidationErrors, getAllMovies);
router.get('/search', searchValidation, handleValidationErrors, searchMovies);
router.get('/featured', getFeaturedMovies);
router.get('/new', getNewMovies);
router.get('/premieres', getPremiereMovies);
router.get('/category/:category', getMoviesByCategory);
router.get('/:id', getMovieById);
router.get('/:id/video', getVideoUrl);
router.post('/', authenticate, requireContentManagement, createMovieValidation, handleValidationErrors, createMovie);
router.put('/:id', authenticate, requireContentManagement, updateMovieValidation, handleValidationErrors, updateMovie);
router.delete('/:id', authenticate, requireContentManagement, deleteMovie);
router.post('/:id/like', authenticate, likeValidation, handleValidationErrors, likeMovie);

export default router;
