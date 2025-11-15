import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import movieRoutes from './routes/movies.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB before starting server
let serverStarted = false;

const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();
    
    if (!serverStarted) {
      app.listen(PORT, () => {
        console.log(`🚀 Kvoice Backend API Server running on port ${PORT}`);
        console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
        if (process.env.MONGODB_URI) {
          const dbName = process.env.MONGODB_URI.split('/').pop()?.split('?')[0] || 'kvoice';
          console.log(`🌐 MongoDB: Connected to database "${dbName}"`);
        }
        serverStarted = true;
      });
    }
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Middleware - CORS Configuration
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082', 'https://kvoice.vercel.app', 'https://www.kvoice.vercel.app'];

// Development mode - allow all origins for testing
const allowAllOrigins = process.env.NODE_ENV !== 'production' && process.env.ALLOW_ALL_ORIGINS === 'true';

// Log CORS configuration for debugging
console.log('🌐 CORS Configuration:', {
  allowedOrigins: allowedOrigins,
  allowAllOrigins: allowAllOrigins,
  nodeEnv: process.env.NODE_ENV
});

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      callback(null, true);
      return;
    }
    
    // In development, optionally allow all origins
    if (allowAllOrigins) {
      callback(null, true);
      return;
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}. Allowed origins: ${allowedOrigins.join(', ')}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// JSON body parser - allow empty body for GET/DELETE requests
app.use(express.json({ 
  limit: '50mb',
  strict: false // Don't throw error on empty body
}));

// URL encoded parser
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/movies', movieRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Kvoice API Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// JSON parsing error handler (must be before general error handler)
app.use((err, req, res, next) => {
  // Handle JSON parsing errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    // Check if this is a method that doesn't require body (GET, DELETE, etc.)
    const noBodyMethods = ['GET', 'DELETE', 'HEAD', 'OPTIONS'];
    if (noBodyMethods.includes(req.method)) {
      // For methods that don't need body, set empty object and continue
      req.body = {};
      return next();
    }
    
    // For methods that need body (POST, PUT, PATCH), check if body is empty
    const bodyStr = err.body?.toString() || '';
    if (!bodyStr || bodyStr.trim().length === 0 || bodyStr === '\r\n' || bodyStr === '\n') {
      // Empty body - set empty object and continue
      req.body = {};
      return next();
    }
    
    // Otherwise return error for invalid JSON
    console.warn('JSON parsing error:', err.message, 'Body:', bodyStr.substring(0, 100));
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON format',
      error: 'Please provide valid JSON data'
    });
  }
  next(err);
});

// General error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  if (process.env.NODE_ENV === 'development') {
    console.error('Error stack:', err.stack);
  }
  res.status(err.status || 500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server after MongoDB connection
startServer();
