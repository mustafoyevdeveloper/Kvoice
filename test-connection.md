# Frontend va Backend Bog'lanish Tekshiruvi

## ✅ Tuzatilgan Muammolar:

1. **Backend Controller'da poster URL yangilash** - `createMovie` da poster path `movie._id` bilan yangilanadi
2. **Response'dan posterData olib tashlash** - Barcha response'larda `posterData` (Buffer) olib tashlandi
3. **CORS sozlamalari** - Ikkala port (5173 va 8080) qo'llab-quvvatlanadi
4. **Frontend API Service** - To'liq ishlayapti

## 🔗 Bog'lanishlar:

### Frontend → Backend:
- ✅ `GET /api/movies` - Barcha kinolarni olish
- ✅ `GET /api/movies/:id` - Bitta kinoni olish
- ✅ `POST /api/movies` - Yangi kino qo'shish (FormData bilan)
- ✅ `PUT /api/movies/:id` - Kinoni yangilash (FormData bilan)
- ✅ `DELETE /api/movies/:id` - Kinoni o'chirish

### API Endpoint'lar:
1. **Frontend Store (`admin.js`)** → `apiService.movies.*`
2. **Frontend Store (`movies.tsx`)** → `apiService.movies.getAll()`
3. **AdminPanel Component** → `useAdminStore()` → `apiService`
4. **Backend Routes** → `movieController.*`
5. **Backend Controller** → MongoDB via Mongoose

## 📋 Tekshirish:

### 1. Backend ishga tushirish:
```bash
cd backend
npm start
# yoki
npm run dev
```

### 2. Frontend ishga tushirish:
```bash
cd frontend
npm run dev
```

### 3. API Test:
```bash
# Health check
curl http://localhost:3000/api/health

# Barcha kinolarni olish
curl http://localhost:3000/api/movies

# Yangi kino qo'shish (Postman yoki curl bilan test qilish)
```

## ⚠️ Eslatmalar:

1. **MongoDB** - `.env` faylida `MONGODB_URI` mavjud bo'lishi kerak
2. **CORS** - Frontend `http://localhost:8080` yoki `http://localhost:5173` da ishlashi kerak
3. **FormData** - Poster yuklashda FormData ishlatiladi
4. **Poster Storage** - Rasmlar MongoDB'da Buffer sifatida saqlanadi

## 🔍 Qo'shimcha tekshirish:

- [ ] Backend server ishlayaptimi?
- [ ] MongoDB ulanganmi?
- [ ] Frontend API URL to'g'rimi? (`VITE_API_URL=http://localhost:3000/api`)
- [ ] CORS muammolari bormi?
- [ ] Poster yuklash ishlayaptimi?
- [ ] CRUD operatsiyalar ishlayaptimi?

