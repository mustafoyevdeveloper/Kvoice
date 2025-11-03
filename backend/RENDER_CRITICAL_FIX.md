# 🔴 CRITICAL: Render Deployment ERR_MODULE_NOT_FOUND

## Muammo
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'express'
Path: /opt/render/project/src/backend/server.js
```

**Path'ni ko'ring:** `/opt/render/project/src/backend/server.js`

Bu shuni anglatadiki:
- Render `src/backend` strukturasini kutmoqda
- Lekin `node_modules` topilmayapti
- Bu Build Command ishlamagani yoki Root Directory noto'g'ri sozlanganligini ko'rsatadi

## ✅ YECHIM - Render Dashboard'da Quyidagilarni O'zgartiring:

### 1. Root Directory (ENG MUHIM!)

Render Dashboard → Service → Settings → Environment → **Root Directory**

**Ikkita variant:**

#### Variant A: Agar repo struktura:
```
repository-root/
  └── backend/
      ├── package.json
      └── server.js
```

**Root Directory:** `backend` (faqat `backend`, boshqa narsa yo'q!)

#### Variant B: Agar repo struktura:
```
repository-root/
  ├── backend/
  │   └── package.json
  └── src/  (yoki boshqa folder)
```

**Root Directory:** `backend` (hali ham `backend`!)

### 2. Build Command

Render Dashboard → Service → Settings → Build & Deploy → **Build Command**

**Ikkita variant:**

#### Variant 1: Root Directory = `backend` bo'lsa:
```
npm install
```

#### Variant 2: Root Directory = `.` (bo'sh) bo'lsa:
```
cd backend && npm install
```

**⚠️ ENG YAXSHI VARIANT:** Root Directory = `backend`, Build Command = `npm install`

### 3. Start Command

```
npm start
```

---

## 📋 STEP-BY-STEP RENDER DASHBOARD'DA:

1. **Render Dashboard** → Your Service → **Settings**

2. **Build & Deploy** bo'limida:
   - **Root Directory:** `backend` (faqat bu so'z, boshqa narsa yo'q!)
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

3. **Save Changes** tugmasini bosing

4. **Manual Deploy** → **Deploy latest commit**

---

## 🔍 TEKSHIRISH:

### Log'larda quyidagilarni ko'rish kerak:

**✅ TO'G'RI:**
```
==> Running build command 'npm install'...
added 123 packages in 5s
==> Build successful 🎉
```

**❌ NOTO'G'RI (xatolik):**
```
==> Build successful 🎉
==> Running 'npm start'
Error [ERR_MODULE_NOT_FOUND]
```
(Hech qanday "added packages" yo'q - bu `npm install` ishlamagan!)

---

## 🛠️ QAYTA TEKSHIRISH:

### 1. GitHub Repo'da:
- `backend/package.json` mavjudmi? ✅
- `backend/server.js` mavjudmi? ✅

### 2. Render Dashboard'da:
- Root Directory = `backend` (to'g'ri) ✅
- Build Command = `npm install` (to'g'ri) ✅
- Start Command = `npm start` (to'g'ri) ✅

### 3. Deploy Log'larida:
- "Running build command 'npm install'" ko'rinadimi? ✅
- "added X packages" ko'rinadimi? ✅

---

## ⚠️ AGAR HALI HAM ISHLAMASA:

### Variant 1: Build Command'ni o'zgartiring:
```
npm ci --legacy-peer-deps
```

### Variant 2: Clear Build Cache:
Render Dashboard → Settings → **Clear build cache**

### Variant 3: Environment Variable qo'shing:
```
NPM_CONFIG_LEGACY_PEER_DEPS=true
```

---

## ✅ TO'G'RI SOZLAMALAR SUMMARIESI:

```
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

**⚠️ ENG MUHIM:** Root Directory `backend` bo'lishi kerak!

