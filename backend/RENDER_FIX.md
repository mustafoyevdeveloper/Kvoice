# Render Deployment Xatosi - ERR_MODULE_NOT_FOUND

## Muammo
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'express' imported from /opt/render/project/src/backend/server.js
```

Bu xatolik Render'da `npm install` bajarilmagani yoki `node_modules` o'rnatilmaganini ko'rsatadi.

## ✅ Yechim

### Render Dashboard'da quyidagilarni tekshiring va sozlang:

1. **Service → Settings** ga kiring

2. **Build Command:**
   ```
   npm install
   ```
   ⚠️ **Muhim:** Bu bo'sh bo'lmasligi kerak! Render dependencies'ni o'rnatish uchun buni ishlatadi.

3. **Start Command:**
   ```
   npm start
   ```

4. **Root Directory:**
   ```
   backend
   ```
   ⚠️ **Muhim:** Agar loyiha root'ida `backend` folder bor bo'lsa, bu **mutlaqo** `backend` bo'lishi kerak!
   
   Tekshirish:
   - GitHub repo'da: `backend/package.json` mavjudmi?
   - Agar ha, Root Directory: `backend`
   - Agar yo'q, Root Directory: `.` (yoki bo'sh)

5. **Node Version:**
   ```
   18.x (yoki 20.x)
   ```
   Render avtomatik aniqlaydi, lekin `package.json`'da `"node": ">=18.0.0"` bor

## 🔍 Tekshirish

### Root Directory tekshirish:
Agar Root Directory noto'g'ri bo'lsa, Render:
- ❌ `package.json` topa olmaydi
- ❌ `npm install` ishlamaydi
- ❌ `node_modules` o'rnatilmaydi
- ❌ Dependencies topilmaydi

### To'g'ri struktura:
```
repository-root/
  ├── backend/
  │   ├── package.json  ← Render buni topishi kerak
  │   ├── server.js
  │   └── ...
  └── frontend/
      └── ...
```

Render `backend/package.json` ni topishi kerak, shuning uchun Root Directory = `backend`

## 📋 Step-by-Step Render Settings

1. **Render Dashboard** → Your Service → **Settings**

2. **Build & Deploy** bo'limida:

   ```
   Build Command: npm install
   Start Command: npm start
   ```

3. **Environment** bo'limida (o'ng tomonda):
   
   ```
   Root Directory: backend
   ```

4. **Save Changes** tugmasini bosing

5. **Manual Deploy** → **Deploy latest commit**

## ✅ To'g'ri Sozlamalar:

```
Build Command: npm install
Start Command: npm start  
Root Directory: backend
Node Version: Auto-detect (yoki 18.x)
```

## 🔄 Qayta Deploy

Sozlamalarni o'zgartirgandan keyin:

1. **Manual Deploy** → **Deploy latest commit** ni bosing
2. Yoki yangi commit push qiling (agar auto-deploy yoqilgan bo'lsa)

## 🧪 Test

Deploy qilingandan keyin log'larda quyidagilarni ko'rasiz:

```
==> Cloning from https://github.com/...
==> Checking out commit ...
==> Running build command 'npm install'...
added 123 packages in 5s
==> Build successful 🎉
==> Deploying...
==> Running 'npm start'
🔄 Connecting to MongoDB...
✅ MongoDB connected successfully
🚀 Kvoice Backend API Server running on port 10000
```

Agar `added 123 packages` ko'rsatmasa, `npm install` ishlamagan!

## ⚠️ Qo'shimcha Eslatmalar

- **Build Command** bo'sh qoldirilmasligi kerak
- **Root Directory** to'g'ri folder'ni ko'rsatishi kerak
- Agar xatolik davom etsa, **Clear build cache** qiling

