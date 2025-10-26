import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const router = express.Router();
import { 
  uploadVideo, 
  uploadPoster, 
  uploadImages, 
  deleteFile, 
  getStats 
} from '../controllers/uploadController.js';
import { authenticate, requireContentManagement } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = path.join(__dirname, '../uploads');
    
    // Create subdirectories based on file type
    if (file.fieldname === 'video') {
      uploadPath = path.join(uploadPath, 'videos');
    } else if (file.fieldname === 'poster' || file.fieldname === 'images') {
      uploadPath = path.join(uploadPath, 'images');
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedVideoTypes = process.env.ALLOWED_VIDEO_TYPES?.split(',') || ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'];
  const allowedImageTypes = process.env.ALLOWED_IMAGE_TYPES?.split(',') || ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  
  if (file.fieldname === 'video') {
    if (allowedVideoTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid video file type'), false);
    }
  } else if (file.fieldname === 'poster' || file.fieldname === 'images') {
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image file type'), false);
    }
  } else {
    cb(new Error('Invalid field name'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 500 * 1024 * 1024, // 500MB default
    files: 10 // Maximum 10 files per request
  }
});

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large',
        errors: ['File size exceeds maximum allowed size']
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files',
        errors: ['Number of files exceeds maximum allowed']
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field',
        errors: ['Unexpected file field']
      });
    }
  }
  
  if (error.message === 'Invalid video file type') {
    return res.status(400).json({
      success: false,
      message: 'Invalid video file type',
      errors: ['Only video files are allowed for video uploads']
    });
  }
  
  if (error.message === 'Invalid image file type') {
    return res.status(400).json({
      success: false,
      message: 'Invalid image file type',
      errors: ['Only image files are allowed for image uploads']
    });
  }
  
  if (error.message === 'Invalid field name') {
    return res.status(400).json({
      success: false,
      message: 'Invalid field name',
      errors: ['Invalid file field name']
    });
  }
  
  next(error);
};

// Routes
router.post('/video', authenticate, requireContentManagement, upload.single('video'), handleMulterError, uploadVideo);
router.post('/poster', authenticate, requireContentManagement, upload.single('poster'), handleMulterError, uploadPoster);
router.post('/images', authenticate, requireContentManagement, upload.array('images', 10), handleMulterError, uploadImages);
router.delete('/:filename', authenticate, requireContentManagement, deleteFile);
router.get('/stats', authenticate, requireContentManagement, getStats);

export default router;
