# URL Configuration Checklist

## ✅ Frontend URL Konfiguratsiyasi

### Development (Local)
**File:** `frontend/env`
- ✅ `VITE_API_URL=http://localhost:3000/api`
- ✅ `VITE_API_BASE_URL=http://localhost:3000`
- ✅ `VITE_BACKEND_URL=http://localhost:3000`
- ✅ `VITE_APP_URL=http://localhost:8080`
- ✅ `VITE_FRONTEND_URL=http://localhost:8080`

### Production (Deployed)
**File:** `frontend/env.production`
- ✅ `VITE_API_URL=https://kvoice-studio-back-nows.onrender.com/api`
- ✅ `VITE_API_BASE_URL=https://kvoice-studio-back-nows.onrender.com`
- ✅ `VITE_BACKEND_URL=https://kvoice-studio-back-nows.onrender.com`
- ✅ `VITE_APP_URL=https://kvoice.vercel.app`
- ✅ `VITE_FRONTEND_URL=https://kvoice.vercel.app`

### Frontend Kodida Ishlatilgan Joylar

1. **`frontend/src/services/api.js`**
   - ✅ Environment variable'lardan avtomatik olinadi
   - ✅ Priority: `VITE_API_URL` > `VITE_BACKEND_URL` > `VITE_API_BASE_URL` > `localhost`

2. **`frontend/src/store/movies.tsx`** (line 38)
   - ✅ Poster URL uchun: `VITE_API_BASE_URL` yoki `VITE_BACKEND_URL` yoki `VITE_API_URL` yoki `localhost`

3. **`frontend/src/components/AdminPanel.tsx`**
   - ✅ Line 429: `generateContentUrl` - `VITE_APP_URL` yoki `VITE_FRONTEND_URL` yoki `localhost:8080`
   - ✅ Line 546: `handleOpenEditDialog` - Poster URL uchun environment variable'lar
   - ✅ Line 1204: Movie list poster URL - environment variable'lar

---

## ✅ Backend URL Konfiguratsiyasi

### Development (Local)
**File:** `backend/env.example`
- ✅ `CORS_ORIGIN=http://localhost:5173,http://localhost:8080`
- ✅ `API_BASE_URL=http://localhost:3000`
- ✅ `FRONTEND_URL=http://localhost:8080`

### Production (Render)
**Environment Variables in Render Dashboard:**
- ✅ `CORS_ORIGIN=http://localhost:5173,http://localhost:8080,https://kvoice.vercel.app,https://www.kvoice.vercel.app`
- ✅ `API_BASE_URL=https://kvoice-studio-back-nows.onrender.com`
- ✅ `FRONTEND_URL=https://kvoice.vercel.app`

### Backend Kodida Ishlatilgan Joylar

1. **`backend/server.js`** (line 39-41)
   - ✅ `CORS_ORIGIN` environment variable'dan olinadi
   - ✅ Development va production URL'lar qo'llab-quvvatlanadi

---

## 📋 Vercel Environment Variables

Vercel Dashboard → Settings → Environment Variables:

```env
# Production
VITE_API_URL=https://kvoice-studio-back-nows.onrender.com/api
VITE_API_BASE_URL=https://kvoice-studio-back-nows.onrender.com
VITE_BACKEND_URL=https://kvoice-studio-back-nows.onrender.com
VITE_APP_URL=https://kvoice.vercel.app
VITE_FRONTEND_URL=https://kvoice.vercel.app
```

---

## 📋 Render Environment Variables

Render Dashboard → Environment:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://...
CORS_ORIGIN=http://localhost:5173,http://localhost:8080,https://kvoice.vercel.app,https://www.kvoice.vercel.app
API_BASE_URL=https://kvoice-studio-back-nows.onrender.com
FRONTEND_URL=https://kvoice.vercel.app
```

---

## ✅ Barcha Joylar To'g'ri Ulangan

### Frontend:
- ✅ API service (`api.js`) - Environment variable'lar
- ✅ Movies store - Poster URL uchun
- ✅ Admin Panel - Content URL va Poster URL uchun

### Backend:
- ✅ CORS configuration - Environment variable'dan
- ✅ Server configuration - Environment variable'lar

### Environment Files:
- ✅ `frontend/env` - Local development
- ✅ `frontend/env.production` - Production
- ✅ `backend/env.example` - Example configuration

---

## 🧪 Test Qilish

### Local Development:
```bash
# Frontend
cd frontend
npm run dev
# Browser console'da: 🔗 API Base URL: http://localhost:3000/api

# Backend
cd backend
npm start
# CORS localhost URL'larni qo'llab-quvvatlaydi
```

### Production:
1. Vercel deploy qiling - Frontend production URL'larga ulanadi
2. Render'da backend ishlayapti - CORS production URL'larga ruxsat beradi
3. Browser console'da: `🔗 API Base URL: https://kvoice-studio-back-nows.onrender.com/api`

---

## 📝 Notes

- Barcha hardcoded URL'lar environment variable'larga o'zgartirilgan
- Local development uchun fallback `localhost` ishlatiladi
- Production'da environment variable'lar to'g'ri sozlangani kerak
- Vercel va Render dashboard'larida environment variable'larni qo'shishni unutmang!

