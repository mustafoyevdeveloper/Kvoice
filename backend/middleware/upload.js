import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Poster upload configuration - store in memory as Buffer for MongoDB/R2
const posterStorage = multer.memoryStorage();

// Image upload filter - PNG, WebP, JPG only, max 500KB
const imageFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 1000 * 1024; // 500KB in bytes
  
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
    fileSize: 1000 * 1024 // 500KB maximum
  }
});

// Birlashtirilgan media upload (poster + video) - R2 uchun
const mediaStorage = multer.memoryStorage();

const mediaFilter = (req, file, cb) => {
  const imageMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const videoMimes = ['video/mp4', 'video/webm', 'video/x-matroska'];
  
  if (imageMimes.includes(file.mimetype)) {
    // Image limit
    const maxImageSize = 1000 * 1024;
    if (file.size && file.size > maxImageSize) {
      return cb(new Error('Rasm hajmi 1000KB dan katta bo\'lishi mumkin emas!'), false);
    }
    return cb(null, true);
  }
  
  if (videoMimes.includes(file.mimetype)) {
    // Video limit
    const maxVideoSize = 500 * 1024 * 1024; // 500MB
    if (file.size && file.size > maxVideoSize) {
      return cb(new Error('Video hajmi 500MB dan katta bo\'lishi mumkin emas!'), false);
    }
    return cb(null, true);
  }
  
  return cb(new Error('Faqat rasm (PNG, WebP, JPG) yoki video (MP4, WebM, MKV) fayllariga ruxsat etiladi!'), false);
};

export const uploadMedia = multer({
  storage: mediaStorage,
  fileFilter: mediaFilter
});

