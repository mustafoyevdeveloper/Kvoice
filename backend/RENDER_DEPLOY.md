# Render Backend Deployment Guide

## Render sozlamalari

### 1. Environment Settings
- **Build Command:** `npm install` (yoki bo'sh qoldirish mumkin)
- **Start Command:** `npm start`
- **Root Directory:** `backend` (agar loyiha root'ida bo'lsa)

### 2. Environment Variables (.env)

Render Dashboard'da quyidagi environment variable'larni qo'shing:

```env
NODE_ENV=production
PORT=10000

# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kvoice?retryWrites=true&w=majority

# CORS - Frontend URL'lar (vergul bilan ajratilgan)
CORS_ORIGIN=http://localhost:5173,http://localhost:8080,https://kvoice.vercel.app,https://www.kvoice.vercel.app

# API Base URL (optional)
API_BASE_URL=https://kvoice-studio-back-nows.onrender.com
FRONTEND_URL=https://kvoice.vercel.app
```

### 3. Render Service Type
- **Type:** Web Service
- **Runtime:** Node
- **Build Command:** `npm install` yoki bo'sh qoldirish
- **Start Command:** `npm start`

### 4. Auto-Deploy
- Branch: `main`
- Auto-deploy: Enabled

## Xatoliklarni tuzatish

### Build xatosi:
```
npm error Missing script: "build"
```

**Yechim:** 
- Build Command'ni `npm install` ga o'zgartiring
- Yoki `package.json`'da build script mavjudligini tekshiring

### Port xatosi:
```
EADDRINUSE: address already in use
```

**Yechim:** 
- Render avtomatik PORT o'zgaruvchisini beradi
- `.env` faylda `PORT=10000` qo'shing (Render standart porti)

### MongoDB connection xatosi:
```
MongooseError: Operation `movies.find()` buffering timed out
```

**Yechim:**
- MongoDB Atlas'da IP whitelist'ni tekshiring
- `0.0.0.0/0` qo'shing (barcha IP'lar uchun)
- Connection string to'g'ri ekanligini tekshiring

### CORS xatosi:
```
Access to fetch at '...' has been blocked by CORS policy
```

**Yechim:**
- Render environment variable'larida frontend URL'ni `CORS_ORIGIN` ga qo'shing
- Frontend'dan API URL to'g'ri ekanligini tekshiring

## Render Dashboard sozlamalari

### Environment Variables qo'shish:
1. Render Dashboard → Your Service → Environment
2. "Add Environment Variable" ni bosing
3. Key va Value ni kiriting
4. Save qiling

### Build Command:
- Agar `npm run build` xatosi bo'lsa, Build Command'ni `npm install` ga o'zgartiring
- Yoki bo'sh qoldiring (dependencies package.json'da bor)

### Health Check:
- Render avtomatik health check qiladi
- `/api/health` endpoint'i mavjud, u ishlaydi

## Deployment Checklist

- [ ] MongoDB Atlas'da database yaratilgan
- [ ] MongoDB Atlas'da IP whitelist'ga `0.0.0.0/0` qo'shilgan
- [ ] Environment variable'lar Render'da qo'shilgan
- [ ] CORS_ORIGIN'da frontend URL'lar bor
- [ ] Build Command to'g'ri sozlangan
- [ ] Start Command `npm start`
- [ ] Root Directory to'g'ri (backend yoki .)

## Test qilish

Deploy qilingandan keyin:

```bash
# Health check
curl https://your-backend-name.onrender.com/api/health

# Movies list
curl https://your-backend-name.onrender.com/api/movies
```

## Notes

- Render free tier'da service 15 daqiqa ishlamay qolsa, uyqu rejimiga o'tadi
- Birinchi so'rov sekin bo'lishi mumkin (cold start)
- Production'da `NODE_ENV=production` qo'ying
- MongoDB Atlas'da connection pool limit'ni tekshiring (free tier'da 500)

