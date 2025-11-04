# Movie Media Backend API

Koreya kinolari va seriallari uchun backend API serveri.

## O'rnatish

1. Paketlarni o'rnating:
```bash
npm install
```

2. `.env` faylini yarating:
```bash
# Backend papkasida .env.example dan nusxa oling
cp env.example .env
```

yoki manual `.env` fayl yarating va quyidagi o'zgaruvchilarni qo'shing:

3. `.env` faylida quyidagi o'zgaruvchilarni sozlang:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/kvoice

# CORS Configuration (frontend URL'lar)
CORS_ORIGIN=http://localhost:5173,http://localhost:8080

# API Base URL
API_BASE_URL=http://localhost:3000

# Frontend URL
FRONTEND_URL=http://localhost:8080
```

**MongoDB Atlas uchun:**
```env
mongodb+srv://MovieMedia:kvoice@moviemedia.r8slcfd.mongodb.net/?appName=MovieMedia
```

**Lokal MongoDB uchun:**
```env
MONGODB_URI=mongodb://localhost:27017/kvoice
```

4. MongoDB'ni ishga tushiring (lokal MongoDB ishlatilsa).

5. Serverni ishga tushiring:
```bash
npm start
```

yoki development rejimida:
```bash
npm run dev
```

## API Endpoints

### Movies
- `GET /api/movies` - Barcha kinolar/seriallar
- `GET /api/movies/:id` - Kino/Serial ma'lumotlari
- `POST /api/movies` - Yangi kino/serial qo'shish
- `PUT /api/movies/:id` - Kino/Serial tahrirlash
- `DELETE /api/movies/:id` - Kino/Serial o'chirish

## Environment Variables

Barcha o'zgaruvchilar `.env` faylida saqlanadi.

### Kerakli Environment Variables:

| O'zgaruvchi | Tavsif | Default | Majburiy |
|------------|--------|---------|----------|
| `PORT` | Server port | `3000` | ❌ |
| `NODE_ENV` | Environment (development/production) | `development` | ❌ |
| `MONGODB_URI` | MongoDB connection string | - | ✅ |
| `CORS_ORIGIN` | Frontend URL'lar (vergul bilan ajratilgan) | `http://localhost:5173,http://localhost:8080` | ❌ |
| `API_BASE_URL` | API base URL | `http://localhost:3000` | ❌ |
| `FRONTEND_URL` | Frontend URL | `http://localhost:8080` | ❌ |

### Production uchun:
```env
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/kvoice
CORS_ORIGIN=https://yourdomain.com
API_BASE_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

## Frontend va Backend Bog'lanish

Barcha API linklari va URL'lar environment variable'lardan o'qiladi:

- **Frontend**: `VITE_API_URL`, `VITE_BACKEND_URL`, `VITE_API_BASE_URL`
- **Backend**: `CORS_ORIGIN`, `FRONTEND_URL`, `API_BASE_URL`

Batafsil ma'lumot uchun `ENV_VARIABLES.md` faylini ko'ring.
