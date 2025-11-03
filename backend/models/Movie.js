import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1900, 'Year must be at least 1900'],
    max: [2030, 'Year cannot exceed 2030']
  },
  language: {
    type: String,
    required: [true, 'Language is required'],
    enum: ['uzbek', 'russian', 'english', 'german', 'spanish', 'italian', 'japanese', 'chinese', 'turkish', 'korean'],
    default: 'uzbek'
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [10, 'Rating cannot exceed 10'],
    default: 1
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['movies', 'series'],
    default: 'movies'
  },
  genres: [{
    type: String,
    enum: [
      'Drama', 'Komediya', 'Fantastika', 'Jangari', 
      'Romantik', 'Detektiv', 'Tarixiy', 'Oilaviy', 'Dokumental',
      'Qo\'rqinchli', 'Sarguzasht', 'Sport', 'Musiqiy', 'G\'ayritabiiy'
    ]
  }],
  quality: [{
    type: String,
    enum: ['360p', '480p', '720p', '1080p', '1440p', '4K']
  }],
  poster: {
    type: String,
    default: ''
  },
  posterUrl: {
    type: String,
    validate: {
      validator: function(v) {
        // Allow empty, HTTP/HTTPS URLs, data URIs (base64), or relative paths
        return !v || 
               /^https?:\/\/.+/.test(v) || 
               /^data:image\/.+;base64,.+/.test(v) ||
               /^\/.+/.test(v);
      },
      message: 'Poster URL must be a valid HTTP/HTTPS URL, data URI, or relative path'
    }
  },
  posterData: {
    type: Buffer,
    default: null
  },
  posterContentType: {
    type: String,
    default: 'image/jpeg'
  },
  videoLink: {
    type: String,
    required: [true, 'Video link is required'],
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Video link must be a valid HTTP/HTTPS URL'
    }
  },
  // Serial uchun qo'shimcha maydonlar - optional, faqat yozilgan bo'lsa saqlanadi
  totalEpisodes: {
    type: Number,
    min: [1, 'Total episodes must be at least 1'],
    required: false
  },
  currentEpisode: {
    type: Number,
    min: [1, 'Current episode must be at least 1'],
    required: false
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      // Remove Buffer data from JSON response (too large)
      delete ret.posterData;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Indexes for better query performance
// Text index removed - causes conflict with language field in MongoDB Atlas
// movieSchema.index({ title: 'text', description: 'text' });
movieSchema.index({ category: 1 });
movieSchema.index({ year: -1 });
movieSchema.index({ rating: -1 });
movieSchema.index({ genres: 1 });
movieSchema.index({ language: 1 });
// Text search can be done with regex instead

// Pre-save middleware - removed default values for totalEpisodes and currentEpisode
// Only save what's provided in the form

export default mongoose.model('Movie', movieSchema);

