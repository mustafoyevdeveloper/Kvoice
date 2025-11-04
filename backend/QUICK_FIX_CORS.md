# 🔴 CRITICAL: "Failed to fetch" Xatolikni Tez Tuzatish

## Muammo
```
Failed to fetch
URL: https://kvoice-studio-back-nows.onrender.com/api/movies
```

Bu xatolik quyidagilardan birini anglatadi:
1. ❌ Backend Render'da ishlamayapti
2. ❌ CORS muammosi (frontend URL backend'da ruxsat etilmagan)
3. ❌ Backend uyqu rejimida (free tier timeout)

---

## ✅ YECHIM - Render Dashboard'da

### 1. Backend Ishlamayaptimi? Tekshiring:

Render Dashboard → Your Service → **Logs**

Quyidagilarni ko'rish kerak:
```
🚀 Movie Media Backend API Server running on port 10000
✅ MongoDB connected successfully
```

Agar yo'q bo'lsa:
- **Manual Deploy** → **Deploy latest commit**

### 2. CORS Environment Variable Qo'shing:

Render Dashboard → Your Service → **Environment** → **Add Environment Variable**

```env
CORS_ORIGIN=http://localhost:5173,http://localhost:8080,https://kvoice.vercel.app,https://www.kvoice.vercel.app
```

**⚠️ MUHIM:** URL'lar vergul bilan ajratilgan, probel yo'q!

### 3. Service Restart:

Environment variable qo'shgandan keyin:
- **Manual Deploy** → **Deploy latest commit**

---

## 🧪 TEST QILISH

### Browser Console'da:

```javascript
// Backend ishlayaptimi?
fetch('https://kvoice-studio-back-nows.onrender.com/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

**Natija:**
- ✅ `{success: true, ...}` - Backend ishlayapti
- ❌ `Failed to fetch` - Backend ishlamayapti yoki CORS

### Network Tab'da:

1. F12 → Network
2. Reload
3. `/api/movies` so'rovini toping
4. **Status:**
   - ✅ `200 OK` - Ishlayapti
   - ❌ `CORS error` - CORS muammosi
   - ❌ `Failed` - Backend ishlamayapti

---

## 📋 CHECKLIST

### Render:
- [ ] Backend service ishlayapti (Logs'da ko'rinadi)
- [ ] `CORS_ORIGIN` environment variable qo'shilgan
- [ ] `https://kvoice.vercel.app` CORS_ORIGIN'da mavjud
- [ ] Service restart qilingan

### Vercel:
- [ ] `VITE_API_URL` environment variable qo'shilgan
- [ ] Production scope tanlangan
- [ ] Redeploy qilingan

---

## ⚡ TEZ YECHIM (Agar Backend Ishlamasa):

Render free tier'da service 15 daqiqa ishlamay qolsa, **uyqu rejimiga** o'tadi.

**Yechim:**
1. Render Dashboard → Service → **Manual Deploy**
2. Yoki birinchi so'rov sekin bo'lishi mumkin (cold start)

---

## 🔍 AGAR HALI HAM ISHLAMASA:

1. **Render Log'larni** tekshiring - CORS xatoliklari ko'rsatiladimi?
2. **Network Tab'da** so'rovni ko'ring - CORS error bormi?
3. **Browser Console'da** API URL to'g'ri ko'rsatiladimi?

**CORS xatolik ko'rsatilsa:**
- Render'da `CORS_ORIGIN` to'g'ri qo'shilganini tekshiring
- Service restart qiling

