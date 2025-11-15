import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Poster upload configuration - store in memory as Buffer for MongoDB
// Files are stored directly in MongoDB, no file system needed
const posterStorage = multer.memoryStorage();

// Image upload filter - PNG, WebP, JPG only, max 500KB
const imageFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 500 * 1024; // 500KB in bytes
  
  if (!allowedMimes.includes(file.mimetype)) {
    return cb(new Error('Faqat PNG, WebP yoki JPG formatidagi rasmlar ruxsat etiladi!'), false);
  }
  
  // File size will be checked by multer limits, but we can add extra validation
  if (file.size && file.size > maxSize) {
    return cb(new Error('Rasm hajmi 1000KB dan katta bo\'lishi mumkin emas!'), false);
  }
  
  cb(null, true);
};

// Poster upload middleware - max 500KB, PNG/WebP/JPG only
export const uploadPoster = multer({
  storage: posterStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 500 * 1024 // 500KB maximum
  }
});

