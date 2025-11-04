# Environment Configuration Guide

## Backend Environment Variables

### Development (.env)
```bash
# Backend development environment
cp backend/env backend/.env
```
  d
### Production (.env.production)
```bash
# Backend production environment
cp backend/env.production backend/.env
```

## Frontend Environment Variables

### Development (.env)
```bash
# Frontend development environment
cp frontend/env frontend/.env
```

### Production (.env.production)
```bash
# Frontend production environment
cp frontend/env.production frontend/.env
```

## Environment Variables Explanation

### Backend (.env)

#### Server Configuration
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment mode (development/production)

#### Database
- `MONGODB_URI` - MongoDB connection string
- `MONGODB_TEST_URI` - Test database connection

#### JWT Security
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - Access token expiration time
- `JWT_REFRESH_SECRET` - Secret for refresh tokens
- `JWT_REFRESH_EXPIRE` - Refresh token expiration time

#### File Upload
- `UPLOAD_PATH` - Directory for uploaded files
- `MAX_FILE_SIZE` - Maximum file size in bytes
- `ALLOWED_VIDEO_TYPES` - Allowed video MIME types
- `ALLOWED_IMAGE_TYPES` - Allowed image MIME types

#### CORS & Security
- `CORS_ORIGIN` - Allowed origins for CORS
- `RATE_LIMIT_WINDOW_MS` - Rate limiting window
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window

#### Admin Account
- `ADMIN_EMAIL` - Default admin email
- `ADMIN_PASSWORD` - Default admin password
- `ADMIN_USERNAME` - Default admin username

### Frontend (.env)

#### API Configuration
- `VITE_API_URL` - Backend API URL
- `VITE_API_BASE_URL` - Base API URL
- `VITE_WS_URL` - WebSocket URL

#### App Configuration
- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Application version
- `VITE_APP_DESCRIPTION` - App description
- `VITE_APP_URL` - Application URL

#### Features
- `VITE_ENABLE_ANALYTICS` - Enable analytics tracking
- `VITE_ENABLE_PWA` - Enable Progressive Web App
- `VITE_ENABLE_OFFLINE_MODE` - Enable offline functionality
- `VITE_ENABLE_NOTIFICATIONS` - Enable notifications

#### UI Configuration
- `VITE_DEFAULT_THEME` - Default theme (dark/light)
- `VITE_ITEMS_PER_PAGE` - Items per page
- `VITE_FEATURED_LIMIT` - Featured content limit
- `VITE_NEW_CONTENT_DAYS` - Days to consider content as new

#### Language
- `VITE_DEFAULT_LANGUAGE` - Default language (uz/ru/en)
- `VITE_SUPPORTED_LANGUAGES` - Supported languages

#### Social Media
- `VITE_FACEBOOK_URL` - Facebook page URL
- `VITE_INSTAGRAM_URL` - Instagram page URL
- `VITE_TELEGRAM_URL` - Telegram channel URL
- `VITE_YOUTUBE_URL` - YouTube channel URL

#### Contact Information
- `VITE_CONTACT_EMAIL` - Contact email
- `VITE_CONTACT_PHONE` - Contact phone
- `VITE_CONTACT_ADDRESS` - Contact address

#### Site Content (Uzbek)
- `VITE_SECTION_PREMIERES` - Premieres section name
- `VITE_SECTION_MOVIES` - Movies section name
- `VITE_SECTION_SERIES` - Series section name
- `VITE_SECTION_TRAILERS` - Trailers section name
- `VITE_SECTION_NEW` - New content section name

#### SEO
- `VITE_SEO_TITLE` - SEO title
- `VITE_SEO_DESCRIPTION` - SEO description
- `VITE_SEO_KEYWORDS` - SEO keywords

## Quick Setup

### 1. Backend Setup
```bash
cd backend
cp env .env
# Edit .env with your configuration
npm install
npm run init-db
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
cp env .env
# Edit .env with your configuration
npm install
npm run dev
```

## Production Deployment

### 1. Backend Production
```bash
cd backend
cp env.production .env
# Edit .env with production values
npm install --production
npm start
```

### 2. Frontend Production
```bash
cd frontend
cp env.production .env
# Edit .env with production values
npm install
npm run build
```

## Security Notes

### Important Security Settings

1. **Change Default Passwords**
   - Change `ADMIN_PASSWORD` in production
   - Use strong, unique passwords

2. **JWT Secrets**
   - Use strong, unique JWT secrets
   - Different secrets for development and production

3. **CORS Configuration**
   - Set proper CORS origins for production
   - Don't use wildcard (*) in production

4. **Database Security**
   - Use authentication for MongoDB
   - Use connection strings with credentials

5. **File Upload Security**
   - Set appropriate file size limits
   - Validate file types
   - Scan uploaded files for malware

## Environment-Specific Settings

### Development
- Debug mode enabled
- Hot reload enabled
- Detailed logging
- Mock data available
- Relaxed security settings

### Production
- Debug mode disabled
- Optimized performance
- Minimal logging
- Strict security settings
- CDN integration
- Analytics enabled

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Check file name (.env not env)
   - Restart the application
   - Check for typos in variable names

2. **CORS Errors**
   - Update CORS_ORIGIN in backend
   - Check frontend URL matches CORS settings

3. **Database Connection Issues**
   - Verify MONGODB_URI
   - Check MongoDB is running
   - Verify network connectivity

4. **File Upload Issues**
   - Check upload directory permissions
   - Verify file size limits
   - Check file type restrictions

## Environment Validation

### Backend Validation
```bash
cd backend
node -e "require('dotenv').config(); console.log('Backend env loaded:', process.env.PORT)"
```

### Frontend Validation
```bash
cd frontend
node -e "console.log('Frontend env loaded:', process.env.VITE_API_URL)"
```

## Best Practices

1. **Never commit .env files to version control**
2. **Use different secrets for different environments**
3. **Regularly rotate secrets and passwords**
4. **Monitor environment variable usage**
5. **Document all environment variables**
6. **Use environment-specific configurations**
7. **Validate environment variables on startup**
8. **Use secure defaults**
9. **Encrypt sensitive data**
10. **Regular security audits**
