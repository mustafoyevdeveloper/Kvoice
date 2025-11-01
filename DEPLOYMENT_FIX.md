# Vercel Deployment - Rasm Muammosini Hal Qilish

## Muammo
Vercel'ga deploy qilinganda rasm ko'rinmayapti.

## Hal qilish usullari

### 1. Static Fayllar Joylashishi
Vite `public` folder'dagi fayllarni avtomatik `dist` ga copy qiladi:
- `frontend/public/favicon.png` → `dist/favicon.png`
- `frontend/public/_redirects` → `dist/_redirects`

### 2. Vercel Konfiguratsiyasi
`frontend/vercel.json` faylini to'g'ri sozlang:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

### 3. Build Jarayonini Tekshirish
Vercel dashboard'da "Build Logs" tugmasini bosing va quyidagilarni tekshiring:
- `favicon.png` fayli build qilinganmi?
- `dist` folder'da fayllar mavjudmi?
- Xatoliklar bormi?

### 4. Logo Fallback
Agar logo yuklanmasa, avtomatik "K" harfi ko'rsatiladi.

### 5. Cache Tozalash
Vercel'da:
1. Settings → Deployment Protection → Clear build cache
2. Yoki yangi deployment yarating

### 6. Manual Tekshirish
Browser DevTools'da:
1. Network tab'ni oching
2. `/favicon.png` so'rovini tekshiring
3. 404 yoki 200 status kodini ko'ring

### 7. Fayl Yo'llari
Quyidagi yo'llar to'g'ri bo'lishi kerak:
- Logo: `/favicon.png` (public folder'dan)
- Assets: `/assets/...` (src/assets'dan build qilingan)

## Qo'shimcha Tavsiyalar

1. **Favicon o'lchami**: 32x32px yoki 64x64px bo'lishi kerak
2. **Fayl formati**: PNG yoki SVG
3. **Build'dan keyin**: `dist` folder'ni lokal tekshiring

## Test Qilish
```bash
cd frontend
npm run build
npm run preview
```

Lokalda `http://localhost:4173/favicon.png` ishlashi kerak.

