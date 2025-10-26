import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  // Event tracking
  eventType: {
    type: String,
    required: [true, 'Event type is required'],
    enum: ['view', 'rating', 'search', 'share', 'download', 'like', 'comment', 'login', 'logout']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    default: null
  },
  contentType: {
    type: String,
    enum: ['movie', 'series', 'trailer', 'premiere'],
    default: 'movie'
  },
  // Event data
  data: {
    // For view events
    viewDuration: {
      type: Number,
      min: 0
    },
    progress: {
      type: Number,
      min: 0,
      max: 100
    },
    completed: {
      type: Boolean,
      default: false
    },
    // For search events
    searchQuery: {
      type: String,
      trim: true
    },
    searchResults: {
      type: Number,
      min: 0
    },
    // For rating events
    rating: {
      type: Number,
      min: 1,
      max: 10
    },
    // For share events
    platform: {
      type: String,
      enum: ['facebook', 'twitter', 'instagram', 'telegram', 'whatsapp', 'email', 'copy_link']
    },
    // For download events
    fileSize: {
      type: Number,
      min: 0
    },
    downloadSpeed: {
      type: Number,
      min: 0
    },
    // For general events
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  // Device and browser info
  device: {
    type: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet', 'tv', 'unknown'],
      default: 'unknown'
    },
    os: {
      type: String,
      trim: true
    },
    browser: {
      type: String,
      trim: true
    },
    version: {
      type: String,
      trim: true
    }
  },
  // Location data
  location: {
    country: {
      type: String,
      trim: true
    },
    region: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    ip: {
      type: String,
      trim: true
    }
  },
  // Referrer data
  referrer: {
    type: String,
    trim: true
  },
  referrerDomain: {
    type: String,
    trim: true
  },
  // Session data
  sessionId: {
    type: String,
    trim: true
  },
  // Timestamp
  timestamp: {
    type: Date,
    default: Date.now
  },
  // Additional metadata
  userAgent: {
    type: String,
    trim: true
  },
  language: {
    type: String,
    trim: true,
    default: 'uz'
  },
  timezone: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
analyticsSchema.index({ eventType: 1 });
analyticsSchema.index({ userId: 1 });
analyticsSchema.index({ contentId: 1 });
analyticsSchema.index({ contentType: 1 });
analyticsSchema.index({ timestamp: -1 });
analyticsSchema.index({ 'data.searchQuery': 'text' });
analyticsSchema.index({ 'location.country': 1 });
analyticsSchema.index({ 'device.type': 1 });
analyticsSchema.index({ sessionId: 1 });

// Compound indexes
analyticsSchema.index({ eventType: 1, timestamp: -1 });
analyticsSchema.index({ contentId: 1, eventType: 1 });
analyticsSchema.index({ userId: 1, eventType: 1 });
analyticsSchema.index({ 'location.country': 1, eventType: 1 });

// Static method to get view analytics
analyticsSchema.statics.getViewAnalytics = function(contentId, options = {}) {
  const match = { eventType: 'view' };
  if (contentId) match.contentId = contentId;
  
  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          contentId: '$contentId',
          date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }
        },
        totalViews: { $sum: 1 },
        uniqueUsers: { $addToSet: '$userId' },
        totalViewTime: { $sum: '$data.viewDuration' },
        avgViewDuration: { $avg: '$data.viewDuration' },
        completedViews: { $sum: { $cond: ['$data.completed', 1, 0] } }
      }
    },
    {
      $group: {
        _id: '$_id.contentId',
        dailyStats: {
          $push: {
            date: '$_id.date',
            views: '$totalViews',
            uniqueUsers: { $size: '$uniqueUsers' },
            totalViewTime: '$totalViewTime',
            avgViewDuration: '$avgViewDuration',
            completedViews: '$completedViews'
          }
        },
        totalViews: { $sum: '$totalViews' },
        totalUniqueUsers: { $sum: { $size: '$uniqueUsers' } },
        totalViewTime: { $sum: '$totalViewTime' },
        avgViewDuration: { $avg: '$avgViewDuration' },
        totalCompletedViews: { $sum: '$completedViews' }
      }
    }
  ]);
};

// Static method to get search analytics
analyticsSchema.statics.getSearchAnalytics = function(options = {}) {
  return this.aggregate([
    { $match: { eventType: 'search' } },
    {
      $group: {
        _id: '$data.searchQuery',
        count: { $sum: 1 },
        avgResults: { $avg: '$data.searchResults' },
        lastSearched: { $max: '$timestamp' }
      }
    },
    { $sort: { count: -1 } },
    { $limit: options.limit || 50 }
  ]);
};

// Static method to get user analytics
analyticsSchema.statics.getUserAnalytics = function(userId, options = {}) {
  const match = { userId: userId };
  if (options.eventType) match.eventType = options.eventType;
  
  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$eventType',
        count: { $sum: 1 },
        lastActivity: { $max: '$timestamp' }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

// Static method to get content analytics
analyticsSchema.statics.getContentAnalytics = function(contentId, options = {}) {
  const match = { contentId: contentId };
  if (options.eventType) match.eventType = options.eventType;
  
  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$eventType',
        count: { $sum: 1 },
        uniqueUsers: { $addToSet: '$userId' },
        lastActivity: { $max: '$timestamp' }
      }
    },
    {
      $project: {
        eventType: '$_id',
        count: 1,
        uniqueUsers: { $size: '$uniqueUsers' },
        lastActivity: 1
      }
    },
    { $sort: { count: -1 } }
  ]);
};

// Static method to get dashboard analytics
analyticsSchema.statics.getDashboardAnalytics = function(options = {}) {
  const dateRange = options.dateRange || 7; // Default to last 7 days
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - dateRange);
  
  return this.aggregate([
    {
      $match: {
        timestamp: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          eventType: '$eventType',
          date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }
        },
        count: { $sum: 1 },
        uniqueUsers: { $addToSet: '$userId' }
      }
    },
    {
      $group: {
        _id: '$_id.eventType',
        dailyStats: {
          $push: {
            date: '$_id.date',
            count: '$count',
            uniqueUsers: { $size: '$uniqueUsers' }
          }
        },
        totalCount: { $sum: '$count' },
        totalUniqueUsers: { $sum: { $size: '$uniqueUsers' } }
      }
    },
    { $sort: { totalCount: -1 } }
  ]);
};

// Static method to get popular content
analyticsSchema.statics.getPopularContent = function(options = {}) {
  const limit = options.limit || 10;
  
  return this.aggregate([
    { $match: { eventType: 'view', contentId: { $exists: true } } },
    {
      $group: {
        _id: '$contentId',
        views: { $sum: 1 },
        uniqueUsers: { $addToSet: '$userId' },
        avgViewDuration: { $avg: '$data.viewDuration' },
        lastViewed: { $max: '$timestamp' }
      }
    },
    {
      $lookup: {
        from: 'movies',
        localField: '_id',
        foreignField: '_id',
        as: 'content'
      }
    },
    { $unwind: '$content' },
    {
      $project: {
        contentId: '$_id',
        title: '$content.title',
        category: '$content.category',
        year: '$content.year',
        rating: '$content.rating',
        views: 1,
        uniqueUsers: { $size: '$uniqueUsers' },
        avgViewDuration: 1,
        lastViewed: 1
      }
    },
    { $sort: { views: -1 } },
    { $limit: limit }
  ]);
};

// Method to track event
analyticsSchema.statics.trackEvent = function(eventData) {
  const analytics = new this(eventData);
  return analytics.save();
};

export default mongoose.model('Analytics', analyticsSchema);
