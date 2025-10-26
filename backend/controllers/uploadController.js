import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Upload video
export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No video file provided',
        errors: ['Video file is required']
      });
    }

    const file = req.file;
    const fileUrl = `/uploads/videos/${file.filename}`;

    res.json({
      success: true,
      message: 'Video uploaded successfully',
      data: {
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        url: fileUrl
      }
    });
  } catch (error) {
    console.error('Upload video error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload video',
      errors: ['Internal server error']
    });
  }
};

// Upload poster
export const uploadPoster = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No poster file provided',
        errors: ['Poster file is required']
      });
    }

    const file = req.file;
    
    // Process image with sharp for optimization
    const processedFilename = `processed-${file.filename}`;
    const processedPath = path.join(file.destination, processedFilename);
    
    await sharp(file.path)
      .resize(400, 600, { fit: 'cover' })
      .jpeg({ quality: 85 })
      .toFile(processedPath);

    // Remove original file
    fs.unlinkSync(file.path);

    const fileUrl = `/uploads/images/${processedFilename}`;

    res.json({
      success: true,
      message: 'Poster uploaded successfully',
      data: {
        filename: processedFilename,
        originalName: file.originalname,
        size: file.size,
        mimetype: 'image/jpeg',
        url: fileUrl
      }
    });
  } catch (error) {
    console.error('Upload poster error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload poster',
      errors: ['Internal server error']
    });
  }
};

// Upload multiple images
export const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided',
        errors: ['Image files are required']
      });
    }

    const files = req.files;
    const processedFiles = [];

    for (const file of files) {
      // Process image with sharp for optimization
      const processedFilename = `processed-${file.filename}`;
      const processedPath = path.join(file.destination, processedFilename);
      
      await sharp(file.path)
        .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toFile(processedPath);

      // Remove original file
      fs.unlinkSync(file.path);

      processedFiles.push({
        filename: processedFilename,
        originalName: file.originalname,
        size: file.size,
        mimetype: 'image/jpeg',
        url: `/uploads/images/${processedFilename}`
      });
    }

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      data: processedFiles
    });
  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      errors: ['Internal server error']
    });
  }
};

// Delete file
export const deleteFile = async (req, res) => {
  try {
    const { filename } = req.params;
    const { type = 'image' } = req.query;

    let filePath;
    if (type === 'video') {
      filePath = path.join(__dirname, '../uploads/videos', filename);
    } else {
      filePath = path.join(__dirname, '../uploads/images', filename);
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
        errors: ['File not found']
      });
    }

    // Delete file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: 'File deleted successfully',
      data: { filename }
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file',
      errors: ['Internal server error']
    });
  }
};

// Get upload stats
export const getStats = async (req, res) => {
  try {
    const videosDir = path.join(__dirname, '../uploads/videos');
    const imagesDir = path.join(__dirname, '../uploads/images');

    // Get video stats
    let videoStats = { count: 0, totalSize: 0 };
    if (fs.existsSync(videosDir)) {
      const videoFiles = fs.readdirSync(videosDir);
      videoStats.count = videoFiles.length;
      videoStats.totalSize = videoFiles.reduce((total, file) => {
        const filePath = path.join(videosDir, file);
        const stats = fs.statSync(filePath);
        return total + stats.size;
      }, 0);
    }

    // Get image stats
    let imageStats = { count: 0, totalSize: 0 };
    if (fs.existsSync(imagesDir)) {
      const imageFiles = fs.readdirSync(imagesDir);
      imageStats.count = imageFiles.length;
      imageStats.totalSize = imageFiles.reduce((total, file) => {
        const filePath = path.join(imagesDir, file);
        const stats = fs.statSync(filePath);
        return total + stats.size;
      }, 0);
    }

    const totalFiles = videoStats.count + imageStats.count;
    const totalSize = videoStats.totalSize + imageStats.totalSize;

    res.json({
      success: true,
      message: 'Upload stats retrieved successfully',
      data: {
        totalFiles,
        totalSize,
        videoStats,
        imageStats,
        averageFileSize: totalFiles > 0 ? Math.round(totalSize / totalFiles) : 0
      }
    });
  } catch (error) {
    console.error('Get upload stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get upload stats',
      errors: ['Internal server error']
    });
  }
};
