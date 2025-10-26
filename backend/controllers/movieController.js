import Movie from '../models/Movie.js';
import Analytics from '../models/Analytics.js';

// Get all movies with filtering and pagination
export const getAllMovies = async (req, res) => {
  try {
    const {
      q,
      category,
      year,
      language,
      genre,
      rating,
      page = 1,
      limit = 20,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build query
    const query = { isActive: true, status: 'published' };

    // Search query
    if (q) {
      query.$text = { $search: q };
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Year filter
    if (year) {
      query.year = parseInt(year);
    }

    // Language filter
    if (language) {
      query.language = language;
    }

    // Genre filter
    if (genre) {
      query.genres = { $in: [genre] };
    }

    // Rating filter
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;

    // If searching, add text score to sort
    if (q) {
      sortObj.score = { $meta: 'textScore' };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const movies = await Movie.find(query)
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

    // Track search if query provided
    if (q && req.user) {
      try {
        await Analytics.trackEvent({
          eventType: 'search',
          userId: req.user._id,
          data: {
            searchQuery: q,
            searchResults: movies.length
          },
          device: {
            type: req.headers['user-agent']?.includes('Mobile') ? 'mobile' : 'desktop',
            userAgent: req.headers['user-agent']
          },
          location: {
            ip: req.ip
          }
        });
      } catch (analyticsError) {
        console.error('Analytics tracking error:', analyticsError);
      }
    }

    res.json({
      success: true,
      message: 'Movies retrieved successfully',
      data: movies,
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
    console.error('Get movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve movies',
      errors: ['Internal server error']
    });
  }
};

// Get movie by ID
export const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findOne({ 
      _id: id, 
      isActive: true, 
      status: 'published' 
    })
    .populate('createdBy', 'username')
    .populate('lastModifiedBy', 'username')
    .populate('similarContentIds', 'title poster year rating category');

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
        errors: ['Movie not found']
      });
    }

    // Increment views
    await movie.incrementViews();

    // Track view event
    if (req.user) {
      try {
        await Analytics.trackEvent({
          eventType: 'view',
          userId: req.user._id,
          contentId: movie._id,
          contentType: movie.category,
          data: {
            viewDuration: 0, // Will be updated by frontend
            progress: 0,
            completed: false
          },
          device: {
            type: req.headers['user-agent']?.includes('Mobile') ? 'mobile' : 'desktop',
            userAgent: req.headers['user-agent']
          },
          location: {
            ip: req.ip
          }
        });
      } catch (analyticsError) {
        console.error('Analytics tracking error:', analyticsError);
      }
    }

    res.json({
      success: true,
      message: 'Movie retrieved successfully',
      data: movie
    });
  } catch (error) {
    console.error('Get movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve movie',
      errors: ['Internal server error']
    });
  }
};

// Create movie
export const createMovie = async (req, res) => {
  try {
    const movieData = {
      ...req.body,
      createdBy: req.user._id,
      lastModifiedBy: req.user._id
    };

    const movie = new Movie(movieData);
    await movie.save();

    // Populate created by
    await movie.populate('createdBy', 'username');

    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      data: movie
    });
  } catch (error) {
    console.error('Create movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create movie',
      errors: ['Internal server error']
    });
  }
};

// Update movie
export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      lastModifiedBy: req.user._id
    };

    const movie = await Movie.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('createdBy', 'username')
    .populate('lastModifiedBy', 'username');

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
        errors: ['Movie not found']
      });
    }

    res.json({
      success: true,
      message: 'Movie updated successfully',
      data: movie
    });
  } catch (error) {
    console.error('Update movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update movie',
      errors: ['Internal server error']
    });
  }
};

// Delete movie
export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findByIdAndDelete(id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
        errors: ['Movie not found']
      });
    }

    res.json({
      success: true,
      message: 'Movie deleted successfully'
    });
  } catch (error) {
    console.error('Delete movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete movie',
      errors: ['Internal server error']
    });
  }
};

// Search movies
export const searchMovies = async (req, res) => {
  try {
    const {
      q,
      category,
      year,
      language,
      genre,
      rating,
      page = 1,
      limit = 20,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
        errors: ['Search query is required']
      });
    }

    // Build query
    const query = { 
      $text: { $search: q },
      isActive: true, 
      status: 'published' 
    };

    // Additional filters
    if (category) query.category = category;
    if (year) query.year = parseInt(year);
    if (language) query.language = language;
    if (genre) query.genres = { $in: [genre] };
    if (rating) query.rating = { $gte: parseFloat(rating) };

    // Build sort object
    const sortObj = { score: { $meta: 'textScore' } };
    if (sort !== 'score') {
      sortObj[sort] = order === 'asc' ? 1 : -1;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const movies = await Movie.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'username');

    // Get total count
    const total = await Movie.countDocuments(query);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNext = parseInt(page) < totalPages;
    const hasPrev = parseInt(page) > 1;

    // Track search event
    if (req.user) {
      try {
        await Analytics.trackEvent({
          eventType: 'search',
          userId: req.user._id,
          data: {
            searchQuery: q,
            searchResults: movies.length
          },
          device: {
            type: req.headers['user-agent']?.includes('Mobile') ? 'mobile' : 'desktop',
            userAgent: req.headers['user-agent']
          },
          location: {
            ip: req.ip
          }
        });
      } catch (analyticsError) {
        console.error('Analytics tracking error:', analyticsError);
      }
    }

    res.json({
      success: true,
      message: 'Search completed successfully',
      data: movies,
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
    console.error('Search movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed',
      errors: ['Internal server error']
    });
  }
};

// Like movie (rate)
export const likeMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const userId = req.user._id;

    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
        errors: ['Movie not found']
      });
    }

    // Add or update rating
    if (rating) {
      await movie.addRating(userId, rating);
    }

    // Track rating event
    try {
      await Analytics.trackEvent({
        eventType: 'rating',
        userId: userId,
        contentId: movie._id,
        contentType: movie.category,
        data: {
          rating: rating
        },
        device: {
          type: req.headers['user-agent']?.includes('Mobile') ? 'mobile' : 'desktop',
          userAgent: req.headers['user-agent']
        },
        location: {
          ip: req.ip
        }
      });
    } catch (analyticsError) {
      console.error('Analytics tracking error:', analyticsError);
    }

    res.json({
      success: true,
      message: 'Movie rated successfully',
      data: {
        movie: movie,
        userRating: rating
      }
    });
  } catch (error) {
    console.error('Like movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to rate movie',
      errors: ['Internal server error']
    });
  }
};

// Get video URL
export const getVideoUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { quality } = req.query;

    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
        errors: ['Movie not found']
      });
    }

    // Return video URL (in real implementation, this would handle different qualities)
    const videoUrl = movie.videoUrl || movie.videoFile;
    if (!videoUrl) {
      return res.status(404).json({
        success: false,
        message: 'Video not available',
        errors: ['Video not available']
      });
    }

    res.json({
      success: true,
      message: 'Video URL retrieved successfully',
      data: {
        videoUrl,
        quality: quality || movie.videoQuality[0],
        availableQualities: movie.videoQuality
      }
    });
  } catch (error) {
    console.error('Get video URL error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get video URL',
      errors: ['Internal server error']
    });
  }
};

// Get movies by category
export const getMoviesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const query = { 
      category, 
      isActive: true, 
      status: 'published' 
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const movies = await Movie.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'username');

    const total = await Movie.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNext = parseInt(page) < totalPages;
    const hasPrev = parseInt(page) > 1;

    res.json({
      success: true,
      message: 'Movies retrieved successfully',
      data: movies,
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
    console.error('Get movies by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve movies',
      errors: ['Internal server error']
    });
  }
};

// Get featured movies
export const getFeaturedMovies = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const movies = await Movie.findFeatured()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('createdBy', 'username');

    res.json({
      success: true,
      message: 'Featured movies retrieved successfully',
      data: movies
    });
  } catch (error) {
    console.error('Get featured movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve featured movies',
      errors: ['Internal server error']
    });
  }
};

// Get new movies
export const getNewMovies = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const movies = await Movie.findNew()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('createdBy', 'username');

    res.json({
      success: true,
      message: 'New movies retrieved successfully',
      data: movies
    });
  } catch (error) {
    console.error('Get new movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve new movies',
      errors: ['Internal server error']
    });
  }
};

// Get premiere movies
export const getPremiereMovies = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const movies = await Movie.findPremieres()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('createdBy', 'username');

    res.json({
      success: true,
      message: 'Premiere movies retrieved successfully',
      data: movies
    });
  } catch (error) {
    console.error('Get premiere movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve premiere movies',
      errors: ['Internal server error']
    });
  }
};
