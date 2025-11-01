import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  // Site basic information
  siteName: {
    type: String,
    required: [true, 'Site name is required'],
    trim: true,
    maxlength: [100, 'Site name cannot exceed 100 characters'],
    default: 'Kvoice'
  },
  siteDescription: {
    type: String,
    required: [true, 'Site description is required'],
    trim: true,
    maxlength: [500, 'Site description cannot exceed 500 characters'],
    default: 'Koreya kinolari va seriallarini O\'zbek tilida tomosha qiling'
  },
  siteIcon: {
    type: String,
    trim: true,
    default: '🎬'
  },
  siteLogo: {
    type: String,
    trim: true
  },
  siteFavicon: {
    type: String,
    trim: true
  },
  
  // Contact information
  contactEmail: {
    type: String,
    required: [true, 'Contact email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    default: 'contact@moviemedia.org'
  },
  contactPhone: {
    type: String,
    trim: true,
    default: '+998 90 123 45 67'
  },
  contactAddress: {
    type: String,
    trim: true,
    maxlength: [500, 'Address cannot exceed 500 characters']
  },
  
  // Social media links
  socialMedia: {
    facebook: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'Facebook URL must be a valid HTTP/HTTPS URL'
      },
      default: 'https://facebook.com/moviemedia'
    },
    instagram: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'Instagram URL must be a valid HTTP/HTTPS URL'
      },
      default: 'https://instagram.com/moviemedia'
    },
    telegram: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'Telegram URL must be a valid HTTP/HTTPS URL'
      },
      default: 'https://t.me/moviemedia'
    },
    youtube: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'YouTube URL must be a valid HTTP/HTTPS URL'
      },
      default: 'https://youtube.com/moviemedia'
    },
    twitter: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'Twitter URL must be a valid HTTP/HTTPS URL'
      }
    },
    tiktok: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'TikTok URL must be a valid HTTP/HTTPS URL'
      }
    }
  },
  
  // Section names (for navigation)
  sectionNames: {
    premieres: {
      type: String,
      trim: true,
      default: 'Premyeralar'
    },
    movies: {
      type: String,
      trim: true,
      default: 'Kinolar'
    },
    series: {
      type: String,
      trim: true,
      default: 'Seriallar'
    },
    trailers: {
      type: String,
      trim: true,
      default: 'Treylerlar'
    },
    new: {
      type: String,
      trim: true,
      default: 'Yangi'
    }
  },
  
  // Section titles (for display)
  sectionTitles: {
    premieres: {
      type: String,
      trim: true,
      default: 'PREMYERALAR'
    },
    movies: {
      type: String,
      trim: true,
      default: 'KINOLAR'
    },
    series: {
      type: String,
      trim: true,
      default: 'SERIALLAR'
    },
    trailers: {
      type: String,
      trim: true,
      default: 'TREYLERLAR'
    },
    new: {
      type: String,
      trim: true,
      default: 'YANGI KINOLAR'
    }
  },
  
  // Section descriptions
  sectionDescriptions: {
    premieres: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
      default: 'Issiq\'ida tomosha qilib oling! Hammasi bizda!'
    },
    movies: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
      default: 'Eng mashhur Koreya kinolari to\'plami'
    },
    series: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
      default: 'Mashhur K-dramalar va Koreya seriallari'
    },
    trailers: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
      default: 'Eng so\'nggi Koreya kinolar treylerlari'
    },
    new: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
      default: 'Yangi qo\'shilgan Koreya kinolari va seriallari'
    }
  },
  
  // Hero section
  heroTitle: {
    type: String,
    trim: true,
    maxlength: [100, 'Hero title cannot exceed 100 characters'],
    default: 'Koreya kinolari va seriallari'
  },
  heroSubtitle: {
    type: String,
    trim: true,
    maxlength: [200, 'Hero subtitle cannot exceed 200 characters'],
    default: 'Eng mashhur K-dramalar va Koreya filmlarini O\'zbek tilida tomosha qiling'
  },
  heroBackgroundImage: {
    type: String,
    trim: true
  },
  
  // About page
  aboutTitle: {
    type: String,
    trim: true,
    maxlength: [100, 'About title cannot exceed 100 characters'],
    default: 'Biz haqimizda'
  },
  aboutDescription: {
    type: String,
    trim: true,
    maxlength: [2000, 'About description cannot exceed 2000 characters'],
    default: 'Kvoice - Koreya kinolari va seriallari olamiga xush kelibsiz! Bizning platformamizda eng mashhur K-dramalar, Koreya filmlari va seriallarini O\'zbek tilida tomosha qiling. HD va 4K sifatda barcha kontentlar mavjud.'
  },
  aboutImage: {
    type: String,
    trim: true
  },
  
  // Privacy policy
  privacyTitle: {
    type: String,
    trim: true,
    maxlength: [100, 'Privacy title cannot exceed 100 characters'],
    default: 'Maxfiylik siyosati'
  },
  privacyDescription: {
    type: String,
    trim: true,
    maxlength: [2000, 'Privacy description cannot exceed 2000 characters'],
    default: 'Sizning shaxsiy ma\'lumotlaringiz biz uchun muhim'
  },
  privacyContent: {
    type: String,
    trim: true
  },
  
  // Terms of service
  termsTitle: {
    type: String,
    trim: true,
    maxlength: [100, 'Terms title cannot exceed 100 characters'],
    default: 'Foydalanish shartlari'
  },
  termsDescription: {
    type: String,
    trim: true,
    maxlength: [2000, 'Terms description cannot exceed 2000 characters'],
    default: 'Saytdan foydalanish shartlari va qoidalari'
  },
  termsContent: {
    type: String,
    trim: true
  },
  
  // Technical settings
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  maintenanceMessage: {
    type: String,
    trim: true,
    maxlength: [500, 'Maintenance message cannot exceed 500 characters'],
    default: 'Sayt texnik ishlar tufayli vaqtincha ishlamaydi'
  },
  
  // SEO settings
  seoTitle: {
    type: String,
    trim: true,
    maxlength: [60, 'SEO title cannot exceed 60 characters']
  },
  seoDescription: {
    type: String,
    trim: true,
    maxlength: [160, 'SEO description cannot exceed 160 characters']
  },
  seoKeywords: [{
    type: String,
    trim: true
  }],
  
  // Analytics settings
  googleAnalyticsId: {
    type: String,
    trim: true
  },
  googleTagManagerId: {
    type: String,
    trim: true
  },
  facebookPixelId: {
    type: String,
    trim: true
  },
  
  // Content settings
  itemsPerPage: {
    type: Number,
    min: 1,
    max: 100,
    default: 20
  },
  featuredContentLimit: {
    type: Number,
    min: 1,
    max: 50,
    default: 10
  },
  newContentDays: {
    type: Number,
    min: 1,
    max: 365,
    default: 7
  },
  
  // Upload settings
  maxFileSize: {
    type: Number,
    min: 1000000, // 1MB
    max: 1000000000, // 1GB
    default: 500000000 // 500MB
  },
  allowedVideoFormats: [{
    type: String,
    trim: true
  }],
  allowedImageFormats: [{
    type: String,
    trim: true
  }],
  
  // Security settings
  maxLoginAttempts: {
    type: Number,
    min: 3,
    max: 10,
    default: 5
  },
  lockoutDuration: {
    type: Number,
    min: 300, // 5 minutes
    max: 3600, // 1 hour
    default: 900 // 15 minutes
  },
  
  // Notification settings
  emailNotifications: {
    type: Boolean,
    default: true
  },
  pushNotifications: {
    type: Boolean,
    default: true
  },
  
  // Theme settings
  theme: {
    primaryColor: {
      type: String,
      trim: true,
      default: '#3b82f6'
    },
    secondaryColor: {
      type: String,
      trim: true,
      default: '#1e40af'
    },
    accentColor: {
      type: String,
      trim: true,
      default: '#f59e0b'
    }
  },
  
  // Language settings
  defaultLanguage: {
    type: String,
    enum: ['uz', 'ru', 'en'],
    default: 'uz'
  },
  supportedLanguages: [{
    type: String,
    enum: ['uz', 'ru', 'en']
  }],
  
  // Cache settings
  cacheEnabled: {
    type: Boolean,
    default: true
  },
  cacheDuration: {
    type: Number,
    min: 60, // 1 minute
    max: 86400, // 24 hours
    default: 3600 // 1 hour
  },
  
  // API settings
  apiRateLimit: {
    type: Number,
    min: 10,
    max: 1000,
    default: 100
  },
  apiRateLimitWindow: {
    type: Number,
    min: 60, // 1 minute
    max: 3600, // 1 hour
    default: 900 // 15 minutes
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Ensure only one settings document exists
settingsSchema.index({}, { unique: true });

// Static method to get settings
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  
  if (!settings) {
    // Create default settings if none exist
    settings = new this();
    await settings.save();
  }
  
  return settings;
};

// Static method to update settings
settingsSchema.statics.updateSettings = async function(updateData) {
  let settings = await this.findOne();
  
  if (!settings) {
    settings = new this(updateData);
  } else {
    Object.assign(settings, updateData);
  }
  
  return await settings.save();
};

// Static method to reset settings to default
settingsSchema.statics.resetSettings = async function() {
  await this.deleteMany();
  const settings = new this();
  return await settings.save();
};

// Method to get section settings
settingsSchema.methods.getSectionSettings = function(section) {
  return {
    name: this.sectionNames[section],
    title: this.sectionTitles[section],
    description: this.sectionDescriptions[section]
  };
};

// Method to update section settings
settingsSchema.methods.updateSectionSettings = function(section, data) {
  if (data.name) this.sectionNames[section] = data.name;
  if (data.title) this.sectionTitles[section] = data.title;
  if (data.description) this.sectionDescriptions[section] = data.description;
  
  return this.save();
};

export default mongoose.model('Settings', settingsSchema);
