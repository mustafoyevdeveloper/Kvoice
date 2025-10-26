# MovieMedia Backend Deployment Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Setup Environment**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Initialize Database**
   ```bash
   npm run init-db
   ```

4. **Start Server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## Environment Configuration

### Required Variables
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/movimedia
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here
```

### Optional Variables
```env
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
MAX_FILE_SIZE=500000000
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-secure-password
```

## Database Setup

The backend uses MongoDB. Make sure MongoDB is running:

```bash
# Start MongoDB (if installed locally)
mongod

# Or use MongoDB Atlas for cloud database
```

## Default Admin Account

After running `npm run init-db`, you'll have a default admin account:
- **Username**: admin
- **Email**: admin@moviemedia.org
- **Password**: admin123456

**Important**: Change the default password immediately after first login!

## API Testing

Test the API endpoints:

```bash
# Health check
curl http://localhost:3001/health

# Get all movies
curl http://localhost:3001/api/movies

# Login (get token)
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"admin","password":"admin123456"}'
```

## Production Deployment

### Using PM2
```bash
npm install -g pm2
pm2 start server.js --name "movimedia-api"
pm2 startup
pm2 save
```

### Using Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use strong JWT secrets
- Configure proper CORS origins
- Set up MongoDB with authentication
- Use environment-specific file upload paths

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secrets
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Use HTTPS in production
- [ ] Regular security updates
- [ ] Database access restrictions
- [ ] File upload size limits

## Monitoring

- Monitor server logs
- Set up health checks
- Monitor database performance
- Track API usage and errors
- Set up alerts for critical issues

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MongoDB is running
   - Verify MONGODB_URI is correct
   - Check network connectivity

2. **JWT Errors**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure proper token format

3. **File Upload Issues**
   - Check upload directory permissions
   - Verify file size limits
   - Check file type restrictions

4. **CORS Errors**
   - Update CORS_ORIGIN in .env
   - Check frontend URL matches CORS settings

### Logs
```bash
# View PM2 logs
pm2 logs movimedia-api

# View specific log
pm2 logs movimedia-api --lines 100
```

## Support

For issues and questions:
1. Check the logs for error messages
2. Verify environment configuration
3. Test API endpoints individually
4. Check database connectivity
5. Review security settings
