# Kvoice Backend API

A comprehensive backend API for the Kvoice streaming platform built with Node.js, Express, and MongoDB.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Movie Management**: CRUD operations for movies, series, trailers, and premieres
- **User Management**: User profiles, watch history, favorites, and watchlist
- **Admin Panel**: Complete admin dashboard with analytics and content management
- **File Upload**: Video and image upload with optimization
- **Analytics**: Comprehensive tracking and analytics system
- **Settings**: Dynamic site configuration management
- **Search**: Full-text search with filtering and pagination
- **Rate Limiting**: API rate limiting and security measures

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer with Sharp for image optimization
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Morgan

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=3001
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/movimedia
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   JWT_REFRESH_SECRET=your-refresh-secret-key-here
   JWT_REFRESH_EXPIRE=30d
   UPLOAD_PATH=./uploads
   MAX_FILE_SIZE=500000000
   CORS_ORIGIN=http://localhost:5173,http://localhost:3000
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /me` - Get current user
- `POST /refresh` - Refresh token
- `PUT /profile` - Update profile
- `PUT /change-password` - Change password
- `POST /create-admin` - Create admin user

### Movies (`/api/movies`)
- `GET /` - Get all movies with filtering
- `GET /search` - Search movies
- `GET /featured` - Get featured movies
- `GET /new` - Get new movies
- `GET /premieres` - Get premiere movies
- `GET /category/:category` - Get movies by category
- `GET /:id` - Get movie by ID
- `GET /:id/video` - Get video URL
- `POST /` - Create movie (Admin/Moderator)
- `PUT /:id` - Update movie (Admin/Moderator)
- `DELETE /:id` - Delete movie (Admin/Moderator)
- `POST /:id/like` - Like/rate movie

### Users (`/api/users`)
- `GET /` - Get all users (Admin)
- `GET /:id` - Get user by ID
- `PUT /:id` - Update user
- `DELETE /:id` - Delete user (Admin)
- `GET /:id/watch-history` - Get user watch history
- `GET /:id/favorites` - Get user favorites
- `POST /favorites/:movieId` - Add to favorites
- `DELETE /favorites/:movieId` - Remove from favorites
- `POST /watchlist/:movieId` - Add to watchlist
- `DELETE /watchlist/:movieId` - Remove from watchlist

### Admin (`/api/admin`)
- `GET /dashboard` - Get dashboard data
- `GET /content` - Get content for management
- `PUT /content/:id/status` - Update content status
- `GET /analytics` - Get analytics data
- `GET /users` - Get users for management
- `PUT /content/bulk-status` - Bulk update content status

### Upload (`/api/upload`)
- `POST /video` - Upload video file
- `POST /poster` - Upload poster image
- `POST /images` - Upload multiple images
- `DELETE /:filename` - Delete file
- `GET /stats` - Get upload statistics

### Analytics (`/api/analytics`)
- `POST /view` - Track view event
- `POST /rating` - Track rating event
- `POST /search` - Track search event
- `POST /share` - Track share event
- `GET /user` - Get user analytics
- `GET /content/:contentId` - Get content analytics

### Settings (`/api/settings`)
- `GET /` - Get all settings
- `PUT /` - Update settings (Admin)
- `POST /reset` - Reset to default (Admin)
- `GET /section/:section` - Get specific section
- `PUT /section/:section` - Update specific section (Admin)

## Database Models

### User
- Authentication and profile information
- Preferences and privacy settings
- Watch history, favorites, and watchlist
- Role-based access control

### Movie
- Movie/series/trailer content
- Video and poster URLs
- Ratings and analytics
- SEO and metadata

### Analytics
- Event tracking (views, ratings, searches, shares)
- User behavior analytics
- Content performance metrics

### Settings
- Site configuration
- Section names and descriptions
- Social media links
- Technical settings

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Access Token**: Short-lived token for API access
2. **Refresh Token**: Long-lived token for refreshing access tokens

### Roles
- **User**: Basic access to content
- **Moderator**: Content management capabilities
- **Admin**: Full system access

## File Upload

- **Videos**: MP4, AVI, MOV, WMV formats
- **Images**: JPEG, PNG, WebP, GIF formats
- **Optimization**: Automatic image resizing and compression
- **Storage**: Local file system with organized directories

## Security Features

- **Rate Limiting**: Prevents API abuse
- **CORS**: Cross-origin resource sharing configuration
- **Helmet**: Security headers
- **Input Validation**: Comprehensive request validation
- **Password Hashing**: bcrypt for secure password storage
- **JWT Security**: Secure token generation and validation

## Error Handling

The API provides consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

## Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

### Environment Variables
See `env.example` for all available configuration options.

## Deployment

1. Set up MongoDB database
2. Configure environment variables
3. Install dependencies: `npm install`
4. Start the server: `npm start`

## API Documentation

For detailed API documentation, refer to the individual route files and controllers.

## License

MIT License - see LICENSE file for details.
