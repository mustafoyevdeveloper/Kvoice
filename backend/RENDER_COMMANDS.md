# Render Backend Deployment - Barcha Command'lar va Sozlamalar

## 📋 Render Dashboard Sozlamalari

### Service Settings → Build & Deploy

**Root Directory:**
```
backend
```

**Build Command:**
```
npm install
```

**Start Command:**
```
npm start
```

**Node Version:**
```
18.x
```
(yoki `Auto-detect` - Render avtomatik aniqlaydi)

---

## 📋 Render Dashboard Environment Variables

### Environment → Add Environment Variable

Quyidagi environment variable'larni qo'shing:

#### 1. Server Configuration:
```env
NODE_ENV=production
PORT=10000
```

#### 2. MongoDB Connection:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kvoice?retryWrites=true&w=majority
```

**⚠️ MUHIM:** `username` va `password` o'rniga MongoDB Atlas'dagi haqiqiy qiymatlarni kiriting!

#### 3. CORS Configuration:
```env
CORS_ORIGIN=http://localhost:5173,http://localhost:8080,https://kvoice.vercel.app,https://www.kvoice.vercel.app
```

**⚠️ MUHIM:** 
- URL'lar vergul bilan ajratilgan
- Probel yo'q bo'lishi kerak
- `https://kvoice.vercel.app` mutlaqo bo'lishi kerak!

#### 4. Optional (Ishlatish shart emas):
```env
API_BASE_URL=https://kvoice-studio-back-nows.onrender.com
FRONTEND_URL=https://kvoice.vercel.app
DEBUG_CORS=false
```

---

## 📝 Step-by-Step Render Dashboard'da

### 1. New Web Service yaratish:

1. **Render Dashboard** → **New** → **Web Service**
2. **Connect** → GitHub repo'ni tanlang
3. **Service Settings:**

   - **Name:** `kvoice-backend` (yoki istagan nom)
   - **Region:** `Singapore` (yoki yaqin)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

4. **Advanced** → **Environment Variables** → Quyidagilarni qo'shing (yuqoridagi ro'yxatdan)

5. **Create Web Service**

---

## 🔧 Mavjud Service'ni O'zgartirish

### Build & Deploy sozlamalarini o'zgartirish:

1. **Render Dashboard** → Your Service → **Settings**
2. **Build & Deploy** bo'limida:

   ```
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```

3. **Save Changes**

### Environment Variables qo'shish/o'zgartirish:

1. **Render Dashboard** → Your Service → **Environment**
2. **Add Environment Variable** tugmasini bosing
3. **Key** va **Value** ni kiriting
4. **Save Changes**
5. **Manual Deploy** → **Deploy latest commit**

---

## 📋 Barcha Environment Variables Ro'yxati

Quyidagilarni Render Dashboard'da qo'shing:

| Key | Value | Muhimmi? |
|-----|-------|----------|
| `NODE_ENV` | `production` | ✅ Ha |
| `PORT` | `10000` | ✅ Ha (yoki Render avtomatik beradi) |
| `MONGODB_URI` | `mongodb+srv://...` | ✅ Ha |
| `CORS_ORIGIN` | `http://localhost:5173,http://localhost:8080,https://kvoice.vercel.app,https://www.kvoice.vercel.app` | ✅ Ha |
| `API_BASE_URL` | `https://kvoice-studio-back-nows.onrender.com` | ❌ Optional |
| `FRONTEND_URL` | `https://kvoice.vercel.app` | ❌ Optional |

---

## 🚀 Deploy Command'lari

### Manual Deploy:
Render Dashboard → Your Service → **Manual Deploy** → **Deploy latest commit**

### Auto Deploy:
- Git push qilinganda avtomatik deploy bo'ladi
- Settings → Auto-Deploy → **Enabled**

---

## 🔍 Tekshirish Command'lari

### 1. Backend Health Check (Browser Console):
```javascript
fetch('https://kvoice-studio-back-nows.onrender.com/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

### 2. Backend Movies API Test:
```javascript
fetch('https://kvoice-studio-back-nows.onrender.com/api/movies?limit=5')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

### 3. CORS Test (Browser Console):
```javascript
fetch('https://kvoice-studio-back-nows.onrender.com/api/health', {
  headers: {
    'Origin': 'https://kvoice.vercel.app'
  }
})
  .then(r => {
    console.log('Status:', r.status);
    console.log('Headers:', r.headers.get('access-control-allow-origin'));
    return r.json();
  })
  .then(console.log)
  .catch(console.error);
```

---

## 📋 Render Log'larda Ko'rish Kerak

Deploy muvaffaqiyatli bo'lsa, log'larda quyidagilarni ko'rasiz:

```
==> Cloning from https://github.com/...
==> Checking out commit ...
==> Requesting Node.js version >=18.0.0
==> Using Node.js version 25.1.0
==> Running build command 'npm install'...
added 123 packages in 5s
==> Build successful 🎉
==> Deploying...
==> Running 'npm start'
🔄 Connecting to MongoDB...
✅ MongoDB connected successfully
📊 Database: kvoice
🌐 CORS Configuration: {
  allowedOrigins: [
    'http://localhost:5173',
    'http://localhost:8080',
    'https://kvoice.vercel.app',
    'https://www.kvoice.vercel.app'
  ],
  allowAllOrigins: false,
  nodeEnv: 'production'
}
🚀 Movie Media Backend API Server running on port 10000
📡 Environment: production
🌐 MongoDB: Connected to database "kvoice"
```

---

## ❌ Xatoliklar va Yechimlar

### Xatolik: `ERR_MODULE_NOT_FOUND`
**Sabab:** Root Directory noto'g'ri yoki Build Command ishlamayapti
**Yechim:** 
- Root Directory: `backend`
- Build Command: `npm install`

### Xatolik: `Failed to fetch` (Frontend'dan)
**Sabab:** CORS muammosi yoki backend ishlamayapti
**Yechim:**
- Render'da `CORS_ORIGIN` to'g'ri sozlanganini tekshiring
- Backend log'larni tekshiring - ishlayaptimi?

### Xatolik: MongoDB connection timeout
**Sabab:** MongoDB Atlas'da IP whitelist
**Yechim:**
- MongoDB Atlas → Network Access → `0.0.0.0/0` qo'shing

---

## ✅ To'liq Render Configuration Checklist

- [ ] **Root Directory:** `backend`
- [ ] **Build Command:** `npm install`
- [ ] **Start Command:** `npm start`
- [ ] **NODE_ENV:** `production`
- [ ] **MONGODB_URI:** To'g'ri connection string
- [ ] **CORS_ORIGIN:** Frontend URL'lari qo'shilgan
- [ ] **Service deployed:** Muvaffaqiyatli
- [ ] **Health check:** `/api/health` ishlayapti

---

## 📝 Copy-Paste Ready Environment Variables

Render Dashboard'da quyidagilarni copy-paste qiling:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kvoice?retryWrites=true&w=majority
CORS_ORIGIN=http://localhost:5173,http://localhost:8080,https://kvoice.vercel.app,https://www.kvoice.vercel.app
API_BASE_URL=https://kvoice-studio-back-nows.onrender.com
FRONTEND_URL=https://kvoice.vercel.app
```

**⚠️ Eslatma:** `MONGODB_URI` da `username`, `password`, va `cluster` o'rniga haqiqiy qiymatlarni kiriting!

