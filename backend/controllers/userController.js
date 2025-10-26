import User from '../models/User.js';
import Movie from '../models/Movie.js';

// Get all users (admin only)
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

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password -refreshTokens');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        errors: ['User not found']
      });
    }

    res.json({
      success: true,
      message: 'User retrieved successfully',
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user',
      errors: ['Internal server error']
    });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove sensitive fields that shouldn't be updated directly
    delete updateData.password;
    delete updateData.email;
    delete updateData.refreshTokens;

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -refreshTokens');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        errors: ['User not found']
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      errors: ['Internal server error']
    });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (req.user._id.toString() === id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account',
        errors: ['Cannot delete own account']
      });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        errors: ['User not found']
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      errors: ['Internal server error']
    });
  }
};

// Get user watch history
export const getUserWatchHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20, sort = 'watchedAt', order = 'desc' } = req.query;

    const user = await User.findById(id).populate({
      path: 'watchHistory.contentId',
      select: 'title poster year rating category videoDuration'
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        errors: ['User not found']
      });
    }

    // Sort watch history
    let watchHistory = user.watchHistory;
    watchHistory.sort((a, b) => {
      const aValue = a[sort];
      const bValue = b[sort];
      
      if (order === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Paginate
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedHistory = watchHistory.slice(skip, skip + parseInt(limit));

    // Calculate pagination info
    const total = watchHistory.length;
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNext = parseInt(page) < totalPages;
    const hasPrev = parseInt(page) > 1;

    res.json({
      success: true,
      message: 'Watch history retrieved successfully',
      data: paginatedHistory,
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
    console.error('Get watch history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve watch history',
      errors: ['Internal server error']
    });
  }
};

// Get user favorites
export const getUserFavorites = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20, sort = 'createdAt', order = 'desc' } = req.query;

    const user = await User.findById(id).populate({
      path: 'favorites',
      select: 'title poster year rating category genres videoDuration'
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        errors: ['User not found']
      });
    }

    // Sort favorites
    let favorites = user.favorites;
    favorites.sort((a, b) => {
      const aValue = a[sort];
      const bValue = b[sort];
      
      if (order === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Paginate
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedFavorites = favorites.slice(skip, skip + parseInt(limit));

    // Calculate pagination info
    const total = favorites.length;
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNext = parseInt(page) < totalPages;
    const hasPrev = parseInt(page) > 1;

    res.json({
      success: true,
      message: 'Favorites retrieved successfully',
      data: paginatedFavorites,
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
    console.error('Get favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve favorites',
      errors: ['Internal server error']
    });
  }
};

// Add to favorites
export const addToFavorites = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user._id;

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
        errors: ['Movie not found']
      });
    }

    // Add to favorites
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: movieId } },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Added to favorites successfully',
      data: { movieId }
    });
  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add to favorites',
      errors: ['Internal server error']
    });
  }
};

// Remove from favorites
export const removeFromFavorites = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user._id;

    // Remove from favorites
    await User.findByIdAndUpdate(
      userId,
      { $pull: { favorites: movieId } }
    );

    res.json({
      success: true,
      message: 'Removed from favorites successfully',
      data: { movieId }
    });
  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove from favorites',
      errors: ['Internal server error']
    });
  }
};

// Add to watchlist
export const addToWatchlist = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user._id;

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
        errors: ['Movie not found']
      });
    }

    // Add to watchlist
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { watchlist: movieId } },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Added to watchlist successfully',
      data: { movieId }
    });
  } catch (error) {
    console.error('Add to watchlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add to watchlist',
      errors: ['Internal server error']
    });
  }
};

// Remove from watchlist
export const removeFromWatchlist = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user._id;

    // Remove from watchlist
    await User.findByIdAndUpdate(
      userId,
      { $pull: { watchlist: movieId } }
    );

    res.json({
      success: true,
      message: 'Removed from watchlist successfully',
      data: { movieId }
    });
  } catch (error) {
    console.error('Remove from watchlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove from watchlist',
      errors: ['Internal server error']
    });
  }
};
