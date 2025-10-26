import Movie from '../models/Movie.js';
import User from '../models/User.js';
import Analytics from '../models/Analytics.js';

// Get dashboard data
export const getDashboard = async (req, res) => {
  try {
    // Get basic stats
    const totalMovies = await Movie.countDocuments({ isActive: true });
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalViews = await Movie.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);
    
    // Get today's views from analytics
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayViews = await Analytics.countDocuments({
      eventType: 'view',
      timestamp: { $gte: today }
    });

    // Get online users (users who logged in within last 15 minutes)
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const onlineUsers = await User.countDocuments({
      lastLogin: { $gte: fifteenMinutesAgo },
      isActive: true
    });

    // Get new users today
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: today },
      isActive: true
    });

    // Get total logins
    const totalLogins = await User.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: '$loginCount' } } }
    ]);

    // Get average logins per user
    const avgLoginsPerUser = totalUsers > 0 ? Math.round((totalLogins[0]?.total || 0) / totalUsers) : 0;

    // Get recent activity
    const recentMovies = await Movie.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title category year rating views createdAt')
      .populate('createdBy', 'username');

    const recentUsers = await User.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('username email role createdAt lastLogin');

    // Get analytics data for charts
    const analyticsData = await Analytics.getDashboardAnalytics({ dateRange: 7 });

    res.json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: {
        stats: {
          totalMovies,
          totalUsers,
          totalViews: totalViews[0]?.total || 0,
          todayViews,
          onlineUsers,
          newUsersToday,
          totalLogins: totalLogins[0]?.total || 0,
          avgLoginsPerUser
        },
        recentMovies,
        recentUsers,
        analytics: analyticsData
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard data',
      errors: ['Internal server error']
    });
  }
};

// Get content for admin
export const getContent = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      status,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build query
    const query = {};
    if (category) query.category = category;
    if (status) query.status = status;

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const content = await Movie.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'username')
      .populate('lastModifiedBy', 'username');

    // Get total count
    const total = await Movie.countDocuments(query);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNext = parseInt(page) < totalPages;
    const hasPrev = parseInt(page) > 1;

    res.json({
      success: true,
      message: 'Content retrieved successfully',
      data: content,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: totalPages,
        hasNext,
        hasPrev
      }
    });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve content',
      errors: ['Internal server error']
    });
  }
};

// Update content status
export const updateContentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const movie = await Movie.findByIdAndUpdate(
      id,
      { 
        status,
        lastModifiedBy: req.user._id
      },
      { new: true }
    ).populate('createdBy', 'username')
     .populate('lastModifiedBy', 'username');

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Content not found',
        errors: ['Content not found']
      });
    }

    res.json({
      success: true,
      message: 'Content status updated successfully',
      data: movie
    });
  } catch (error) {
    console.error('Update content status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update content status',
      errors: ['Internal server error']
    });
  }
};

// Get analytics data
export const getAnalytics = async (req, res) => {
  try {
    const { dateRange = 7, eventType, contentType } = req.query;

    // Get analytics data
    const analyticsData = await Analytics.getDashboardAnalytics({ 
      dateRange: parseInt(dateRange),
      eventType,
      contentType
    });

    // Get popular content
    const popularContent = await Analytics.getPopularContent({ limit: 10 });

    // Get search analytics
    const searchAnalytics = await Analytics.getSearchAnalytics({ limit: 20 });

    res.json({
      success: true,
      message: 'Analytics data retrieved successfully',
      data: {
        analytics: analyticsData,
        popularContent,
        searchAnalytics
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve analytics data',
      errors: ['Internal server error']
    });
  }
};

// Get users for admin
export const getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      role,
      isActive,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build query
    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const users = await User.find(query)
      .select('-password -refreshTokens')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await User.countDocuments(query);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNext = parseInt(page) < totalPages;
    const hasPrev = parseInt(page) > 1;

    res.json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: totalPages,
        hasNext,
        hasPrev
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
      errors: ['Internal server error']
    });
  }
};

// Bulk update content status
export const bulkUpdateStatus = async (req, res) => {
  try {
    const { ids, status, type } = req.body;

    // Update multiple movies
    const result = await Movie.updateMany(
      { _id: { $in: ids } },
      { 
        status,
        lastModifiedBy: req.user._id
      }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} items updated successfully`,
      data: {
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount
      }
    });
  } catch (error) {
    console.error('Bulk update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update content status',
      errors: ['Internal server error']
    });
  }
};
