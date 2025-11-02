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
    min: [0, 'Rating must be at least 0'],
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
  videoUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Video URL must be a valid HTTP/HTTPS URL'
    }
  },
  videoQuality: [{
    type: String,
    enum: ['360p', '480p', '720p', '1080p', '1440p', '4K'],
    default: []
  }],
  poster: {
    type: String,
    required: [true, 'Poster is required']
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
  cast: [{
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    image: String
  }],
  director: [{
    type: String,
    trim: true
  }],
  writer: [{
    type: String,
    trim: true
  }],
  producer: [{
    type: String,
    trim: true
  }],
  country: [{
    type: String,
    trim: true
  }],
  releaseDate: {
    type: Date,
    default: Date.now
  },
  ageRating: {
    type: String,
    enum: ['G', 'PG', 'PG-13', 'R', 'NC-17'],
    default: 'PG-13'
  },
  tags: [{
    type: String,
    trim: true
  }],
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  likes: {
    type: Number,
    default: 0,
    min: 0
  },
  dislikes: {
    type: Number,
    default: 0,
    min: 0
  },
  isNew: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived', 'pending'],
    default: 'published'
  },
  url: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'URL must be a valid HTTP/HTTPS URL'
    }
  },
  // SEO fields
  seoTitle: {
    type: String,
    maxlength: [60, 'SEO title cannot exceed 60 characters']
  },
  seoDescription: {
    type: String,
    maxlength: [160, 'SEO description cannot exceed 160 characters']
  },
  seoKeywords: [{
    type: String,
    trim: true
  }],
  // Metadata
  fileSize: {
    type: Number,
    min: 0
  },
  duration: {
    type: String,
    default: null
  },
  quality: [{
    type: String,
    enum: ['360p', '480p', '720p', '1080p', '1440p', '4K']
  }],
  // Analytics
  watchTime: {
    type: Number,
    default: 0,
    min: 0
  },
  completionRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  // User interactions
  userRatings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 10,
      required: true
    },
    ratedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    comment: {
      type: String,
      required: true,
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isApproved: {
      type: Boolean,
      default: true
    }
  }],
  // Admin fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for average rating
movieSchema.virtual('averageRating').get(function() {
  if (this.userRatings.length === 0) return 0;
  const sum = this.userRatings.reduce((acc, rating) => acc + rating.rating, 0);
  return Math.round((sum / this.userRatings.length) * 10) / 10;
});

// Virtual for total ratings count
movieSchema.virtual('ratingsCount').get(function() {
  return this.userRatings.length;
});

// Virtual for slug
movieSchema.virtual('slug').get(function() {
  return this.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
});

// Indexes for better query performance
movieSchema.index({ title: 'text', description: 'text' });
movieSchema.index({ category: 1 });
movieSchema.index({ year: -1 });
movieSchema.index({ rating: -1 });
movieSchema.index({ views: -1 });
movieSchema.index({ isActive: 1 });
movieSchema.index({ isNewContent: 1 });
movieSchema.index({ isPremiere: 1 });
movieSchema.index({ status: 1 });
movieSchema.index({ createdAt: -1 });
movieSchema.index({ genres: 1 });
movieSchema.index({ language: 1 });

// Pre-save middleware
movieSchema.pre('save', function(next) {
  // Set SEO title if not provided
  if (!this.seoTitle) {
    this.seoTitle = this.title;
  }
  
  // Set SEO description if not provided
  if (!this.seoDescription) {
    this.seoDescription = this.description.substring(0, 160);
  }
  
  // Set SEO keywords from genres if not provided
  if (!this.seoKeywords || this.seoKeywords.length === 0) {
    this.seoKeywords = this.genres;
  }
  
  // Serial uchun default qiymatlar
  if (this.category === 'series') {
    if (!this.totalEpisodes) {
      this.totalEpisodes = 1;
    }
    if (!this.currentEpisode) {
      this.currentEpisode = 1;
    }
  }
  
  // Video linkni videoUrl ga ham qo'shish (backward compatibility)
  if (this.videoLink && !this.videoUrl) {
    this.videoUrl = this.videoLink;
  }
  
  next();
});

// Static method to find by category
movieSchema.statics.findByCategory = function(category, options = {}) {
  const query = { category, isActive: true, status: 'published' };
  return this.find(query, null, options);
};

// Static method to find featured content
movieSchema.statics.findFeatured = function(options = {}) {
  const query = { isFeatured: true, isActive: true, status: 'published' };
  return this.find(query, null, options);
};


// Static method to search content
movieSchema.statics.search = function(searchTerm, options = {}) {
  const query = {
    $text: { $search: searchTerm },
    isActive: true,
    status: 'published'
  };
  return this.find(query, { score: { $meta: 'textScore' } }, options);
};

// Method to increment views
movieSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to add rating
movieSchema.methods.addRating = function(userId, rating) {
  // Remove existing rating from this user
  this.userRatings = this.userRatings.filter(r => !r.user.equals(userId));
  
  // Add new rating
  this.userRatings.push({
    user: userId,
    rating: rating
  });
  
  // Update average rating
  this.rating = this.averageRating;
  
  return this.save();
};

// Method to add comment
movieSchema.methods.addComment = function(userId, comment) {
  this.comments.push({
    user: userId,
    comment: comment
  });
  return this.save();
};

export default mongoose.model('Movie', movieSchema);
