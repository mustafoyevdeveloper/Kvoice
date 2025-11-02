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

    // Build query
    const query = { isActive: true };

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
      _id: id, 
      isActive: true 
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
        error: 'Movie not found'
      });
    }

    // Increment views
    movie.views += 1;
    await movie.save();

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

    const movieData = {
      title: req.body.title,
      description: req.body.description,
      year: parseInt(req.body.year),
      language: req.body.language,
      rating: parseFloat(req.body.rating),
      category: req.body.category,
      genres: parseField(req.body.genres) || [],
      quality: parseField(req.body.quality) || [],
      videoLink: req.body.videoLink || req.body.videoUrl,
      poster: posterPath || req.body.posterUrl || req.body.poster,
      posterUrl: req.body.posterUrl || posterPath
    };

    // Add poster data to MongoDB if file was uploaded
    if (posterBuffer) {
      movieData.posterData = posterBuffer;
      movieData.posterContentType = posterContentType;
    }

    // Serial uchun totalEpisodes va currentEpisode ni tekshirish
    if (req.body.category === 'series') {
      movieData.totalEpisodes = req.body.totalEpisodes ? parseInt(req.body.totalEpisodes) : 1;
      movieData.currentEpisode = req.body.currentEpisode ? parseInt(req.body.currentEpisode) : 1;
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
    res.status(500).json({
      success: false,
      message: 'Failed to create movie',
      error: error.message
    });
  }
};

// Update movie
export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
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
      quality: parseField(req.body.quality),
      videoLink: req.body.videoLink || req.body.videoUrl
    };

    // Handle poster update
    if (posterBuffer) {
      // New file uploaded - save to MongoDB
      updateData.poster = posterPath;
      updateData.posterUrl = posterPath;
      updateData.posterData = posterBuffer;
      updateData.posterContentType = posterContentType;
    } else if (req.body.posterUrl) {
      // URL provided - clear Buffer and use URL
      updateData.poster = req.body.posterUrl;
      updateData.posterUrl = req.body.posterUrl;
      updateData.posterData = null;
      updateData.posterContentType = 'image/jpeg';
    }

    // Serial uchun totalEpisodes va currentEpisode ni tekshirish
    if (req.body.category === 'series') {
      updateData.totalEpisodes = req.body.totalEpisodes ? parseInt(req.body.totalEpisodes) : 1;
      updateData.currentEpisode = req.body.currentEpisode ? parseInt(req.body.currentEpisode) : 1;
    } else if (req.body.category === 'movies') {
      // Kino uchun bu maydonlar kerak emas
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
    res.status(500).json({
      success: false,
      message: 'Failed to update movie',
      error: error.message
    });
  }
};

// Delete movie
export const deleteMovie = async (req, res) => {
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

    // Files are stored in MongoDB, no file system cleanup needed
    await Movie.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Movie deleted successfully'
    });
  } catch (error) {
    console.error('Delete movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete movie',
      error: error.message
    });
  }
};

