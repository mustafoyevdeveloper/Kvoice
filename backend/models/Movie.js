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
    default: 0
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
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Poster URL must be a valid HTTP/HTTPS URL'
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
  // Serial uchun qo'shimcha maydonlar
  totalEpisodes: {
    type: Number,
    min: [1, 'Total episodes must be at least 1'],
    default: null
  },
  currentEpisode: {
    type: Number,
    min: [1, 'Current episode must be at least 1'],
    default: null
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
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
movieSchema.index({ title: 'text', description: 'text' });
movieSchema.index({ category: 1 });
movieSchema.index({ year: -1 });
movieSchema.index({ rating: -1 });
movieSchema.index({ views: -1 });
movieSchema.index({ isActive: 1 });
movieSchema.index({ genres: 1 });
movieSchema.index({ language: 1 });

// Pre-save middleware
movieSchema.pre('save', function(next) {
  // Serial uchun default qiymatlar
  if (this.category === 'series') {
    if (!this.totalEpisodes) {
      this.totalEpisodes = 1;
    }
    if (!this.currentEpisode) {
      this.currentEpisode = 1;
    }
  }
  
  next();
});

export default mongoose.model('Movie', movieSchema);

