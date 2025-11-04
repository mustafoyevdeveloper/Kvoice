# Environment Variables - Barcha Linklar va API URL'lar

## 📋 Frontend Environment Variables (`frontend/env`)

### API Configuration
```env
VITE_API_URL=http://localhost:3000/api          # To'liq API URL
VITE_API_BASE_URL=http://localhost:3000          # API base URL (API'siz)
VITE_BACKEND_URL=http://localhost:3000           # Backend server URL
```

### App Configuration
```env
VITE_APP_URL=http://localhost:8080               # Frontend URL
VITE_FRONTEND_URL=http://localhost:8080          # Frontend URL (alternativ)
VITE_APP_NAME=Movie Media
```

### Contact & Social Media
```env
VITE_CONTACT_EMAIL=contact@moviemedia.org
VITE_CONTACT_PHONE=+998 90 123 45 67
VITE_FACEBOOK_URL=https://facebook.com/moviemedia
VITE_INSTAGRAM_URL=https://instagram.com/moviemedia
VITE_TELEGRAM_URL=https://t.me/moviemedia
VITE_YOUTUBE_URL=https://youtube.com/moviemedia
```

## 📋 Backend Environment Variables (`backend/.env`)

### Server Configuration
```env
PORT=3000
NODE_ENV=development
API_BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:8080
```

### MongoDB Configuration
```env
MONGODB_URI=mongodb://localhost:27017/kvoice
```

### CORS Configuration
```env
CORS_ORIGIN=http://localhost:5173,http://localhost:8080
```

## 🔗 Bog'lanish Diagrammasi

```
Frontend (http://localhost:8080)
  ├─ VITE_API_URL → Backend (http://localhost:3000/api)
  ├─ VITE_BACKEND_URL → Backend (http://localhost:3000)
  └─ VITE_APP_URL → Frontend o'zi

Backend (http://localhost:3000)
  ├─ CORS_ORIGIN → Frontend URL'larni qabul qiladi
  ├─ FRONTEND_URL → Frontend URL'ni biladi
  └─ MONGODB_URI → MongoDB'ga ulanadi
```

## 📝 Production uchun o'zgartirish

### Frontend (`frontend/env.production`)
```env
VITE_API_URL=https://api.yourdomain.com/api
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_BACKEND_URL=https://api.yourdomain.com
VITE_APP_URL=https://yourdomain.com
VITE_FRONTEND_URL=https://yourdomain.com
```

### Backend (`backend/.env`)
```env
PORT=3000
NODE_ENV=production
API_BASE_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com
CORS_ORIGIN=https://yourdomain.com
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/kvoice
```

## ✅ Tekshirish

Barcha hardcoded URL'lar env fayldan o'qiladi:
- ✅ `frontend/src/services/api.js` - VITE_API_URL
- ✅ `frontend/src/store/movies.tsx` - VITE_API_BASE_URL
- ✅ `frontend/src/components/AdminPanel.tsx` - Barcha social media va contact URL'lar
- ✅ `backend/server.js` - CORS_ORIGIN, FRONTEND_URL
- ✅ `backend/controllers/movieController.js` - Poster pathlar dinamik

