# Vercel Frontend Deployment Guide

## Environment Variables

Vercel Dashboard'da quyidagi environment variable'larni qo'shing:

### Production Environment Variables

Vercel Dashboard → Your Project → Settings → Environment Variables

Quyidagilarni qo'shing:

```env
VITE_API_URL=https://kvoice-studio-back-nows.onrender.com/api
VITE_API_BASE_URL=https://kvoice-studio-back-nows.onrender.com
VITE_BACKEND_URL=https://kvoice-studio-back-nows.onrender.com

VITE_APP_URL=https://kvoice.vercel.app
VITE_FRONTEND_URL=https://kvoice.vercel.app
```

### Preview & Development (optional)

Agar preview branch'larda ham local backend ishlatmoqchi bo'lsangiz:

```env
VITE_API_URL=http://localhost:3000/api
```

**Eslatma:** Preview branch'lar localhost'ga ulana olmaydi - faqat production deployed backend ishlaydi.

## Vercel Deployment Settings

1. **Framework Preset:** Vite
2. **Root Directory:** `frontend` (agar loyiha root'ida bo'lsa)
3. **Build Command:** `npm run build`
4. **Output Directory:** `dist`
5. **Install Command:** `npm install`

## Environment Variable Scope

- **Production:** Production deploy'lar uchun
- **Preview:** Preview/PR deploy'lar uchun (optional)
- **Development:** Local development uchun (ishlatilmaydi, chunki local .env ishlatadi)

## Automatic Detection

Frontend kodida API URL avtomatik aniqlanadi:

1. `VITE_API_URL` bo'lsa, uni ishlatadi
2. `VITE_BACKEND_URL` bo'lsa, `/api` qo'shib ishlatadi
3. `VITE_API_BASE_URL` bo'lsa, `/api` qo'shib ishlatadi
4. Aks holda `http://localhost:3000/api` (development uchun)

Production'da `VITE_API_URL` ni to'g'ri sozlash kifoya.

## Test qilish

Deploy qilingandan keyin:

1. Vercel URL'ni oching: https://kvoice.vercel.app
2. Browser Console'ni oching (F12)
3. Network tab'da API so'rovlarini tekshiring
4. Console'da API URL ko'rsatiladi: `🔗 API Base URL: https://kvoice-studio-back-nows.onrender.com/api`

## Xatoliklarni tuzatish

### API so'rovlar ishlamayapti

**Yechim:**
- Vercel Dashboard'da environment variable'larni tekshiring
- Deploy'ni rebuild qiling (Settings → Deployments → Redeploy)

### CORS xatosi

**Yechim:**
- Backend'dagi CORS_ORIGIN'ga `https://kvoice.vercel.app` qo'shilganini tekshiring
- Backend'ni restart qiling

### API URL noto'g'ri

**Yechim:**
- Browser Console'da `🔗 API Base URL` ni tekshiring
- Vercel environment variable'larni tekshiring
- Build log'larni ko'ring

