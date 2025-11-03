import Movie from '../models/Movie.js';
import dotenv from 'dotenv';

dotenv.config();

// Get all movies
export const getAllMovies = async (req, res) => {
  try {
    const {
      category,
      q,
      page = 1,
      limit = 20,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build query - removed isActive filter
    const query = {};

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Search query
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const movies = await Movie.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(); // Use lean() for better performance

    // Remove posterData from each movie (too large for response)
    const cleanedMovies = movies.map(movie => {
      const movieObj = { ...movie };
      delete movieObj.posterData;
      return movieObj;
    });

    // Get total count
    const total = await Movie.countDocuments(query);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNext = parseInt(page) < totalPages;
    const hasPrev = parseInt(page) > 1;

    res.json({
      success: true,
      message: 'Movies retrieved successfully',
      data: cleanedMovies,
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
      error: error.message
    });
  }
};

// Get movie by ID
export const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findOne({ 
      _id: id
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
        error: 'Movie not found'
      });
    }

    // Views tracking removed - not in form

    // Exclude Buffer from response
    const movieObj = movie.toObject();
    delete movieObj.posterData;

    res.json({
      success: true,
      message: 'Movie retrieved successfully',
      data: movieObj
    });
  } catch (error) {
    console.error('Get movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve movie',
      error: error.message
    });
  }
};

// Create movie
export const createMovie = async (req, res) => {
  try {
    let posterPath = null;
    let posterBuffer = null;
    let posterContentType = 'image/jpeg';

    // Handle file upload - store in MongoDB as Buffer
    // Validation: max 500KB, PNG/WebP/JPG only
    if (req.file) {
      const maxSize = 500 * 1024; // 500KB
      const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      
      if (req.file.size > maxSize) {
        return res.status(400).json({
          success: false,
          message: 'Rasm hajmi 500KB dan katta bo\'lishi mumkin emas!',
          error: 'File size exceeds 500KB limit'
        });
      }
      
      if (!allowedMimes.includes(req.file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: 'Faqat PNG, WebP yoki JPG formatidagi rasmlar ruxsat etiladi!',
          error: 'Invalid file format'
        });
      }
      
      posterBuffer = req.file.buffer;
      posterContentType = req.file.mimetype;
      // Path will be updated with actual movie ID after creation
      posterPath = `/api/movies/temp/poster`;
    }

    // Parse JSON fields if they are strings
    const parseField = (field) => {
      if (typeof field === 'string') {
        try {
          return JSON.parse(field);
        } catch {
          return field;
        }
      }
      return field;
    };

    // Handle poster URL - if it's base64 or data URI, store in poster field, not posterUrl
    let posterUrl = req.body.posterUrl || posterPath;
    let poster = posterPath || req.body.poster || '';
    
    // If posterUrl is base64/data URI, use it as poster instead
    if (req.body.posterUrl && /^data:image\/.+;base64,.+/.test(req.body.posterUrl)) {
      poster = req.body.posterUrl;
      posterUrl = posterPath || ''; // Use path if file uploaded, otherwise empty
    } else if (req.body.posterUrl && /^https?:\/\/.+/.test(req.body.posterUrl)) {
      // Valid HTTP/HTTPS URL - use for both
      poster = req.body.posterUrl;
      posterUrl = req.body.posterUrl;
    } else if (req.body.posterUrl && /^\/.+/.test(req.body.posterUrl)) {
      // Relative path
      poster = req.body.posterUrl;
      posterUrl = req.body.posterUrl;
    }

    // Sort quality array in ascending order (360p, 480p, 720p, 1080p, 1440p, 4K)
    const qualityArray = parseField(req.body.quality) || [];
    const qualityOrder = ['360p', '480p', '720p', '1080p', '1440p', '4K'];
    const sortedQuality = qualityArray.sort((a, b) => {
      const indexA = qualityOrder.indexOf(a);
      const indexB = qualityOrder.indexOf(b);
      // If quality not in order list, put at end
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    const movieData = {
      title: req.body.title,
      description: req.body.description,
      year: parseInt(req.body.year),
      language: req.body.language,
      rating: parseFloat(req.body.rating),
      category: req.body.category,
      genres: parseField(req.body.genres) || [],
      quality: sortedQuality,
      videoLink: req.body.videoLink || req.body.videoUrl,
      poster: poster,
      ...(posterUrl ? { posterUrl: posterUrl } : {})
    };

    // Add poster data to MongoDB if file was uploaded
    if (posterBuffer) {
      movieData.posterData = posterBuffer;
      movieData.posterContentType = posterContentType;
    }

    // Serial uchun totalEpisodes va currentEpisode - faqat yozilgan bo'lsa qo'shish
    if (req.body.category === 'series') {
      if (req.body.totalEpisodes) {
        movieData.totalEpisodes = parseInt(req.body.totalEpisodes);
      }
      if (req.body.currentEpisode) {
        movieData.currentEpisode = parseInt(req.body.currentEpisode);
      }
    }

    const movie = new Movie(movieData);
    await movie.save();

    // Update poster path with actual movie ID if file was uploaded
    if (posterBuffer && movie._id) {
      movie.poster = `/api/movies/${movie._id}/poster`;
      movie.posterUrl = `/api/movies/${movie._id}/poster`;
      await movie.save();
    }

    // Exclude Buffer from response
    const movieObj = movie.toObject();
    delete movieObj.posterData;

    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      data: movieObj
    });
  } catch (error) {
    console.error('Create movie error:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      reqBody: {
        title: req.body?.title,
        category: req.body?.category,
        genres: req.body?.genres,
        quality: req.body?.quality
      }
    });
    res.status(500).json({
      success: false,
      message: 'Failed to create movie',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Update movie
export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID
    if (!id || id === 'undefined' || id === 'null') {
      return res.status(400).json({
        success: false,
        message: 'Movie ID is required',
        error: 'Invalid movie ID'
      });
    }
    let posterPath = null;
    let posterBuffer = null;
    let posterContentType = 'image/jpeg';

    // Handle file upload - store in MongoDB as Buffer
    // Validation: max 500KB, PNG/WebP/JPG only
    if (req.file) {
      const maxSize = 500 * 1024; // 500KB
      const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      
      if (req.file.size > maxSize) {
        return res.status(400).json({
          success: false,
          message: 'Rasm hajmi 500KB dan katta bo\'lishi mumkin emas!',
          error: 'File size exceeds 500KB limit'
        });
      }
      
      if (!allowedMimes.includes(req.file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: 'Faqat PNG, WebP yoki JPG formatidagi rasmlar ruxsat etiladi!',
          error: 'Invalid file format'
        });
      }
      
      posterBuffer = req.file.buffer;
      posterContentType = req.file.mimetype;
      posterPath = `/api/movies/${id}/poster`;
    }

    // Parse JSON fields if they are strings
    const parseField = (field) => {
      if (typeof field === 'string') {
        try {
          return JSON.parse(field);
        } catch {
          return field;
        }
      }
      return field;
    };

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      year: req.body.year ? parseInt(req.body.year) : undefined,
      language: req.body.language,
      rating: req.body.rating ? parseFloat(req.body.rating) : undefined,
      category: req.body.category,
      genres: parseField(req.body.genres),
      quality: (() => {
        // Sort quality array in ascending order (360p, 480p, 720p, 1080p, 1440p, 4K)
        const qualityArray = parseField(req.body.quality) || [];
        const qualityOrder = ['360p', '480p', '720p', '1080p', '1440p', '4K'];
        return qualityArray.sort((a, b) => {
          const indexA = qualityOrder.indexOf(a);
          const indexB = qualityOrder.indexOf(b);
          // If quality not in order list, put at end
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        });
      })(),
      videoLink: req.body.videoLink || req.body.videoUrl
    };

    // Handle poster update - similar to createMovie
    if (posterBuffer) {
      // New file uploaded - save to MongoDB
      updateData.poster = posterPath;
      updateData.posterUrl = posterPath;
      updateData.posterData = posterBuffer;
      updateData.posterContentType = posterContentType;
    } else if (req.body.posterUrl) {
      // Handle poster URL - if it's base64/data URI, store in poster field, not posterUrl
      if (/^data:image\/.+;base64,.+/.test(req.body.posterUrl)) {
        // Base64 data URI - store in poster, not posterUrl
        updateData.poster = req.body.posterUrl;
        updateData.posterUrl = posterPath || ''; // Use path if available, otherwise empty
        updateData.posterData = null;
        updateData.posterContentType = 'image/jpeg';
      } else if (/^https?:\/\/.+/.test(req.body.posterUrl)) {
        // Valid HTTP/HTTPS URL - use for both
        updateData.poster = req.body.posterUrl;
        updateData.posterUrl = req.body.posterUrl;
        updateData.posterData = null;
        updateData.posterContentType = 'image/jpeg';
      } else if (/^\/.+/.test(req.body.posterUrl)) {
        // Relative path
        updateData.poster = req.body.posterUrl;
        updateData.posterUrl = req.body.posterUrl;
        updateData.posterData = null;
        updateData.posterContentType = 'image/jpeg';
      } else {
        // Fallback - use as poster
        updateData.poster = req.body.posterUrl;
        updateData.posterData = null;
        updateData.posterContentType = 'image/jpeg';
      }
    } else if (req.body.poster) {
      // Fallback to poster field
      updateData.poster = req.body.poster;
      if (req.body.poster && /^https?:\/\/.+/.test(req.body.poster)) {
        updateData.posterUrl = req.body.poster;
      }
      updateData.posterData = null;
    }

    // Serial uchun totalEpisodes va currentEpisode - faqat yozilgan bo'lsa qo'shish
    if (req.body.category === 'series') {
      if (req.body.totalEpisodes) {
        updateData.totalEpisodes = parseInt(req.body.totalEpisodes);
      }
      if (req.body.currentEpisode) {
        updateData.currentEpisode = parseInt(req.body.currentEpisode);
      }
    } else if (req.body.category === 'movies') {
      // Kino uchun bu maydonlar kerak emas - undefined qilib o'chirish
      updateData.totalEpisodes = undefined;
      updateData.currentEpisode = undefined;
    }

    // Remove undefined fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const movie = await Movie.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
        error: 'Movie not found'
      });
    }

    // Exclude Buffer from response
    const movieObj = movie.toObject();
    delete movieObj.posterData;

    res.json({
      success: true,
      message: 'Movie updated successfully',
      data: movieObj
    });
  } catch (error) {
    console.error('Update movie error:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      reqBody: {
        title: req.body?.title,
        category: req.body?.category,
        genres: req.body?.genres,
        quality: req.body?.quality,
        posterUrl: req.body?.posterUrl ? (req.body.posterUrl.substring(0, 50) + '...') : undefined
      }
    });
    res.status(500).json({
      success: false,
      message: 'Failed to update movie',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get movie poster
export const getMoviePoster = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
        error: 'Movie not found'
      });
    }

    // If poster is stored as Buffer in MongoDB
    if (movie.posterData && Buffer.isBuffer(movie.posterData)) {
      const contentType = movie.posterContentType || 'image/jpeg';
      res.set('Content-Type', contentType);
      res.set('Content-Length', movie.posterData.length);
      res.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
      return res.send(movie.posterData);
    }

    // If poster is a URL, redirect to it
    if (movie.posterUrl && movie.posterUrl.startsWith('http')) {
      return res.redirect(movie.posterUrl);
    }

    // If poster is a path but no Buffer, return 404
    return res.status(404).json({
      success: false,
      message: 'Poster not found',
      error: 'Poster not found'
    });
  } catch (error) {
    console.error('Get poster error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve poster',
      error: error.message
    });
  }
};

// Delete movie
export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Movie ID is required',
        error: 'Movie ID is required'
      });
    }

    // Check if ID is a valid MongoDB ObjectId format (24 hex characters)
    if (!id || id.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid movie ID format',
        error: 'Invalid movie ID format'
      });
    }

    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
        error: 'Movie not found'
      });
    }

    // Files are stored in MongoDB, no file system cleanup needed
    await Movie.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Movie deleted successfully'
    });
  } catch (error) {
    console.error('Delete movie error:', error);
    // Handle CastError for invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid movie ID',
        error: 'Invalid movie ID format'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to delete movie',
      error: error.message
    });
  }
};

