# Backend Deployment Guide - Local Backend with Deployed Frontend

Agar frontend deployed bo'lsa va backend localda ishlayotgan bo'lsa, quyidagi qadamlarni bajaring:

## 1. CORS Sozlamalari

Backend'dagi `.env` faylida deployed frontend URL'ini qo'shing:

```env
# Backend .env fayli
CORS_ORIGIN=http://localhost:5173,http://localhost:8080,https://your-frontend-domain.com,https://www.your-frontend-domain.com

# Yoki development uchun barcha origin'larni ruxsat berish
NODE_ENV=development
ALLOW_ALL_ORIGINS=true
```

**Muhim:** Production'da `ALLOW_ALL_ORIGINS=true` ishlatmang!

## 2. Frontend Environment Variables

Frontend deploy qilingan platformada (Vercel, Netlify, va h.k.) quyidagi environment variable'larni qo'shing:

### Vercel uchun:
1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Quyidagilarni qo'shing:

```
VITE_API_URL=https://your-backend-domain.com/api
```
yoki
```
VITE_BACKEND_URL=https://your-backend-domain.com
```

### Netlify uchun:
1. Netlify Dashboard → Site settings → Environment variables
2. Quyidagilarni qo'shing (Production, Branch deploys, Deploy previews uchun):

```
VITE_API_URL=https://your-backend-domain.com/api
```

### Development (Local Backend) uchun:
Agar backend localda ishlasa, lekin frontend deployed bo'lsa, ikki variant bor:

#### Variant A: Ngrok Tunnel (Tavsiya etiladi)
1. [Ngrok](https://ngrok.com/) o'rnating
2. Backend'ni localda ishga tushiring (port 3000)
3. Ngrok tunnel yarating:
   ```bash
   ngrok http 3000
   ```
4. Ngrok bergan URL'ni oling (masalan: `https://abc123.ngrok.io`)
5. Frontend deploy platformasida environment variable qo'shing:
   ```
   VITE_API_URL=https://abc123.ngrok.io/api
   ```
6. Backend `.env` fayliga CORS qo'shing:
   ```env
   CORS_ORIGIN=https://your-frontend-domain.com,https://abc123.ngrok.io
   ```

#### Variant B: Cloudflare Tunnel yoki Localtunnel
- Cloudflare Tunnel: [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- Localtunnel: `npx localtunnel --port 3000`

## 3. Backend Environment Variables

Backend'dagi `.env` fayli:

```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# CORS - Frontend URL'lar (vergul bilan ajratilgan)
CORS_ORIGIN=http://localhost:5173,http://localhost:8080,https://your-frontend-domain.com

# Development uchun (faqat testing uchun!)
ALLOW_ALL_ORIGINS=true
```

## 4. Frontend API Configuration

Frontend'dagi environment variable'lar:

```env
# Production (deployed frontend, local backend uchun ngrok URL)
VITE_API_URL=https://abc123.ngrok.io/api

# Yoki agar backend ham deployed bo'lsa
VITE_API_URL=https://api.your-domain.com/api
```

## 5. Testing

1. Backend'ni ishga tushiring:
   ```bash
   cd backend
   npm start
   ```

2. Frontend'dan API'ga so'rov yuborishni tekshiring:
   ```javascript
   // Browser Console'da
   fetch('http://localhost:3000/api/health')
     .then(r => r.json())
     .then(console.log)
   ```

3. Network tab'da so'rovlarni ko'ring - CORS xatoliklarini tekshiring

## 6. Xatoliklarni Tuzatish

### CORS Xatosi:
```
Access to fetch at 'http://localhost:3000/api/movies' from origin 'https://your-frontend.com' has been blocked by CORS policy
```

**Yechim:**
- Backend `.env` faylida frontend URL'ni `CORS_ORIGIN` ga qo'shing
- Backend'ni qayta ishga tushiring

### Network Error:
```
Failed to fetch
```

**Yechimlar:**
- Localhost'ga deployed frontend'dan ulana olmaydi - Ngrok yoki boshqa tunnel ishlating
- Backend ishlamayapti - tekshiring
- Firewall port 3000 ni bloklagan - portni oching

### API URL Not Found:
```
404 Not Found
```

**Yechim:**
- Frontend environment variable'lar to'g'ri sozlanganini tekshiring
- Build qilgandan keyin environment variable'lar qo'shildimi tekshiring (Vercel/Netlify'da rebuild kerak)

## 7. Production Recommendations

1. **Backend ham deploy qiling** - Local backend faqat development uchun
2. **HTTPS ishlating** - Production'da faqat HTTPS
3. **CORS'ni cheklang** - Faqat trusted domain'larni ruxsat bering
4. **Environment variable'larni himoya qiling** - `.env` fayllarni Git'ga commit qilmang

## 8. Quick Setup Script

```bash
# 1. Backend'ni ishga tushiring
cd backend
npm start

# 2. Yangi terminal'da Ngrok ishga tushiring
ngrok http 3000

# 3. Ngrok URL'ni qo'shing
# Backend .env:
echo "CORS_ORIGIN=https://your-frontend.com,https://abc123.ngrok.io" >> .env

# 4. Frontend deploy platformasida:
# VITE_API_URL=https://abc123.ngrok.io/api

# 5. Backend'ni qayta ishga tushiring
```

## Notes

- Ngrok free tier'da session timeout bo'ladi - har safar yangi URL beradi
- Production'da backend'ni ham deploy qilish kerak (Railway, Render, Heroku, va h.k.)
- Local backend faqat development/testing uchun

