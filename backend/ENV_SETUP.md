# Backend .env Fayl Sozlash

## `.env` fayl yaratish

Backend papkasida `.env` fayl yarating va quyidagi o'zgaruvchilarni qo'shing:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
# Lokal MongoDB uchun:
MONGODB_URI=mongodb://localhost:27017/kvoice

# MongoDB Atlas uchun:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kvoice?retryWrites=true&w=majority

# CORS Configuration (Frontend URL'lar - vergul bilan ajratilgan)
CORS_ORIGIN=http://localhost:5173,http://localhost:8080

# API Base URL
API_BASE_URL=http://localhost:3000

# Frontend URL
FRONTEND_URL=http://localhost:8080
```

## Production uchun

```env
PORT=3000
NODE_ENV=production

# MongoDB Atlas (production)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kvoice?retryWrites=true&w=majority

# Production frontend URL
CORS_ORIGIN=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
API_BASE_URL=https://api.yourdomain.com
```

## Tekshirish

`.env` fayl yaratilgandan keyin, serverni ishga tushiring:
```bash
npm start
```

Agar xatolik bo'lsa, `.env` faylda `MONGODB_URI` mavjudligini tekshiring.

