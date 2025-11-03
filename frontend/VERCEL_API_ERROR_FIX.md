# Vercel Deployment - "Failed to fetch" Xatolikni Tuzatish

## Muammo
```
API Error: TypeError: Failed to fetch
```

Bu xatolik quyidagilardan birini anglatadi:
1. ❌ Vercel'da environment variable'lar qo'shilmagan/noto'g'ri
2. ❌ Backend ishlamayapti
3. ❌ CORS muammosi
4. ❌ API URL noto'g'ri

---

## ✅ YECHIM 1: Vercel Environment Variables

### Vercel Dashboard'da qo'shing:

1. **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. Quyidagilarni qo'shing (Production scope uchun):

```env
VITE_API_URL=https://kvoice-studio-back-nows.onrender.com/api
VITE_API_BASE_URL=https://kvoice-studio-back-nows.onrender.com
VITE_BACKEND_URL=https://kvoice-studio-back-nows.onrender.com
```

3. **Save** tugmasini bosing

4. **Redeploy** qiling:
   - **Deployments** → Latest deployment → **Redeploy**

---

## ✅ YECHIM 2: Backend CORS Tekshirish

### Render Dashboard'da:

1. **Render Dashboard** → Your Service → **Environment**

2. Quyidagi variable mavjudligini tekshiring:

```env
CORS_ORIGIN=http://localhost:5173,http://localhost:8080,https://kvoice.vercel.app,https://www.kvoice.vercel.app
```

3. Agar yo'q bo'lsa, qo'shing va **Restart** qiling

---

## ✅ YECHIM 3: Backend Ishlamayaptimi?

### Render Log'larni tekshiring:

1. **Render Dashboard** → Your Service → **Logs**

2. Quyidagilarni ko'rish kerak:
```
🚀 Kvoice Backend API Server running on port 10000
✅ MongoDB connected successfully
```

3. Agar xatolik ko'rsatilsa, uni tuzating

---

## 🔍 DEBUG QILISH

### Browser Console'da tekshiring:

1. **Vercel'dan deployed saytni** oching
2. **F12** → **Console** tab'ni oching
3. Quyidagilarni ko'rasiz:

```
🔗 API Base URL: https://kvoice-studio-back-nows.onrender.com/api
🔍 Environment Variables: {...}
🌐 Fetching URL: https://kvoice-studio-back-nows.onrender.com/api/movies
```

### Agar "localhost" ko'rsatilsa:

❌ **Muammo:** Environment variable'lar Vercel'da qo'shilmagan!

**Yechim:** Vercel Dashboard'da environment variable'larni qo'shing va redeploy qiling.

### Network Tab'da tekshiring:

1. **F12** → **Network** tab
2. **Reload** tugmasini bosing
3. `/api/movies` so'rovini toping
4. **Status** ni ko'ring:
   - ✅ **200 OK** - Backend ishlayapti
   - ❌ **CORS error** - CORS muammosi
   - ❌ **Failed (net::ERR_)** - Backend ishlamayapti yoki URL noto'g'ri

---

## 📋 Checklist

### Vercel:
- [ ] `VITE_API_URL` environment variable qo'shilgan
- [ ] Production scope tanlangan
- [ ] Redeploy qilingan

### Render:
- [ ] Backend ishlayapti (log'larda ko'rinadi)
- [ ] `CORS_ORIGIN` to'g'ri sozlangan
- [ ] Frontend URL (`https://kvoice.vercel.app`) CORS'da mavjud

### Test:
- [ ] Browser console'da API URL to'g'ri ko'rsatiladi
- [ ] Network tab'da so'rov yuborilayapti
- [ ] Backend'ga ulanish mavjud

---

## 🧪 Backend Health Check

Browser console'da quyidagini yozing:

```javascript
fetch('https://kvoice-studio-back-nows.onrender.com/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

**Natija:**
- ✅ `{success: true, message: "Kvoice API Server is running"}` - Backend ishlayapti
- ❌ `Failed to fetch` - Backend ishlamayapti yoki CORS muammosi

---

## ⚠️ AGAR HALI HAM ISHLAMASA:

### 1. Vercel Build Log'larni tekshiring:
- Environment variable'lar build paytida ko'rsatiladimi?
- `VITE_API_URL` build'da mavjudmi?

### 2. Clear Cache:
- Vercel: Settings → Clear build cache
- Browser: Hard refresh (Ctrl+Shift+R)

### 3. Manual Test:
```bash
# Terminal'da
curl https://kvoice-studio-back-nows.onrender.com/api/health
```

Agar bu ishlasa, lekin Vercel'dan ishlamasa - environment variable muammosi!

