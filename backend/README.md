# Kvoice Backend API

Koreya kinolari va seriallari uchun backend API serveri.

## O'rnatish

1. Paketlarni o'rnating:
```bash
npm install
```

2. `.env` faylini yarating (`.env.example` dan nusxa oling):
```bash
cp .env.example .env
```

3. `.env` faylida MongoDB URL'ni sozlang:
```env
MONGODB_URI=mongodb://localhost:27017/kvoice
```

**MongoDB Atlas uchun:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kvoice?retryWrites=true&w=majority
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

