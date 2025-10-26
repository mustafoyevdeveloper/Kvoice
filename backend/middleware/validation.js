import { validationResult } from 'express-validator';

// Validation result handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  
  next();
};

// Custom validation functions
export const isValidObjectId = (value) => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(value);
};

export const isValidEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password) => {
  // At least 6 characters, contains at least one letter and one number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
  return passwordRegex.test(password);
};

export const isValidUsername = (username) => {
  // 3-30 characters, alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  return usernameRegex.test(username);
};

export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidYear = (year) => {
  const currentYear = new Date().getFullYear();
  return year >= 1900 && year <= currentYear + 5;
};

export const isValidRating = (rating) => {
  return rating >= 0 && rating <= 10;
};

export const isValidLanguage = (language) => {
  const validLanguages = [
    'uzbek', 'russian', 'english', 'german', 'spanish', 
    'italian', 'japanese', 'chinese', 'turkish', 'korean'
  ];
  return validLanguages.includes(language);
};

export const isValidCategory = (category) => {
  const validCategories = ['movies', 'series', 'trailers', 'premieres', 'new'];
  return validCategories.includes(category);
};

export const isValidGenre = (genre) => {
  const validGenres = [
    'Drama', 'Komediya', 'Fantastika', 'Triller', 'Jangari', 
    'Romantik', 'Detektiv', 'Tarixiy', 'Oilaviy', 'Dokumental',
    'Qo\'rqinchli', 'Sarguzasht', 'Sport', 'Musiqiy', 'G\'ayritabiiy'
  ];
  return validGenres.includes(genre);
};

export const isValidQuality = (quality) => {
  const validQualities = ['360p', '480p', '720p', '1080p', '1440p', '4K'];
  return validQualities.includes(quality);
};

export const isValidRole = (role) => {
  const validRoles = ['user', 'moderator', 'admin'];
  return validRoles.includes(role);
};

export const isValidStatus = (status) => {
  const validStatuses = ['draft', 'published', 'archived', 'pending'];
  return validStatuses.includes(status);
};

export const isValidAgeRating = (ageRating) => {
  const validAgeRatings = ['G', 'PG', 'PG-13', 'R', 'NC-17'];
  return validAgeRatings.includes(ageRating);
};

export const isValidGender = (gender) => {
  const validGenders = ['male', 'female', 'other', 'prefer-not-to-say'];
  return validGenders.includes(gender);
};

export const isValidProfileVisibility = (visibility) => {
  const validVisibilities = ['public', 'friends', 'private'];
  return validVisibilities.includes(visibility);
};

export const isValidEventType = (eventType) => {
  const validEventTypes = ['view', 'rating', 'search', 'share', 'download', 'like', 'comment', 'login', 'logout'];
  return validEventTypes.includes(eventType);
};

export const isValidContentType = (contentType) => {
  const validContentTypes = ['movie', 'series', 'trailer', 'premiere'];
  return validContentTypes.includes(contentType);
};

export const isValidDeviceType = (deviceType) => {
  const validDeviceTypes = ['desktop', 'mobile', 'tablet', 'tv', 'unknown'];
  return validDeviceTypes.includes(deviceType);
};

export const isValidPlatform = (platform) => {
  const validPlatforms = ['facebook', 'twitter', 'instagram', 'telegram', 'whatsapp', 'email', 'copy_link'];
  return validPlatforms.includes(platform);
};
