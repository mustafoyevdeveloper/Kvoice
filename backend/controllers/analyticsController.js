import Analytics from '../models/Analytics.js';

// Track view event
export const trackView = async (req, res) => {
  try {
    const { contentId, contentType, viewDuration, progress, completed } = req.body;
    const userId = req.user?._id;

    const analyticsData = {
      eventType: 'view',
      userId,
      contentId,
      contentType,
      data: {
        viewDuration: viewDuration || 0,
        progress: progress || 0,
        completed: completed || false
      },
      device: {
        type: req.headers['user-agent']?.includes('Mobile') ? 'mobile' : 'desktop',
        userAgent: req.headers['user-agent']
      },
      location: {
        ip: req.ip
      }
    };

    await Analytics.trackEvent(analyticsData);

    res.json({
      success: true,
      message: 'View tracked successfully'
    });
  } catch (error) {
    console.error('Track view error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track view',
      errors: ['Internal server error']
    });
  }
};

// Track rating event
export const trackRating = async (req, res) => {
  try {
    const { contentId, contentType, rating } = req.body;
    const userId = req.user._id;

    const analyticsData = {
      eventType: 'rating',
      userId,
      contentId,
      contentType,
      data: {
        rating
      },
      device: {
        type: req.headers['user-agent']?.includes('Mobile') ? 'mobile' : 'desktop',
        userAgent: req.headers['user-agent']
      },
      location: {
        ip: req.ip
      }
    };

    await Analytics.trackEvent(analyticsData);

    res.json({
      success: true,
      message: 'Rating tracked successfully'
    });
  } catch (error) {
    console.error('Track rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track rating',
      errors: ['Internal server error']
    });
  }
};

// Track search event
export const trackSearch = async (req, res) => {
  try {
    const { searchQuery, searchResults } = req.body;
    const userId = req.user?._id;

    const analyticsData = {
      eventType: 'search',
      userId,
      data: {
        searchQuery,
        searchResults: searchResults || 0
      },
      device: {
        type: req.headers['user-agent']?.includes('Mobile') ? 'mobile' : 'desktop',
        userAgent: req.headers['user-agent']
      },
      location: {
        ip: req.ip
      }
    };

    await Analytics.trackEvent(analyticsData);

    res.json({
      success: true,
      message: 'Search tracked successfully'
    });
  } catch (error) {
    console.error('Track search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track search',
      errors: ['Internal server error']
    });
  }
};

// Track share event
export const trackShare = async (req, res) => {
  try {
    const { contentId, contentType, platform } = req.body;
    const userId = req.user?._id;

    const analyticsData = {
      eventType: 'share',
      userId,
      contentId,
      contentType,
      data: {
        platform
      },
      device: {
        type: req.headers['user-agent']?.includes('Mobile') ? 'mobile' : 'desktop',
        userAgent: req.headers['user-agent']
      },
      location: {
        ip: req.ip
      }
    };

    await Analytics.trackEvent(analyticsData);

    res.json({
      success: true,
      message: 'Share tracked successfully'
    });
  } catch (error) {
    console.error('Track share error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track share',
      errors: ['Internal server error']
    });
  }
};

// Get user analytics
export const getUserAnalytics = async (req, res) => {
  try {
    const { dateRange = 30, eventType } = req.query;
    const userId = req.user._id;

    const analytics = await Analytics.getUserAnalytics(userId, {
      dateRange: parseInt(dateRange),
      eventType
    });

    res.json({
      success: true,
      message: 'User analytics retrieved successfully',
      data: analytics
    });
  } catch (error) {
    console.error('Get user analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user analytics',
      errors: ['Internal server error']
    });
  }
};

// Get content analytics
export const getContentAnalytics = async (req, res) => {
  try {
    const { contentId } = req.params;
    const { dateRange = 30, eventType } = req.query;

    const analytics = await Analytics.getContentAnalytics(contentId, {
      dateRange: parseInt(dateRange),
      eventType
    });

    res.json({
      success: true,
      message: 'Content analytics retrieved successfully',
      data: analytics
    });
  } catch (error) {
    console.error('Get content analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve content analytics',
      errors: ['Internal server error']
    });
  }
};
