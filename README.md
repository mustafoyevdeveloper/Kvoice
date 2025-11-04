# MoviMedia - O'zbek Kino Platformasi

MoviMedia - bu O'zbek tilida eng yangi va mashhur kinolar, seriallar, premyeralar va treylerlarni tomosha qilish uchun yaratilgan zamonaviy video platformasi.

## 🎬 Xususiyatlar

### 👤 Foydalanuvchi Xususiyatlari
- **Keng Kontent Turi**: Kinolar, Seriallar, Premyeralar, Treylerlar
- **Zamonaviy Video Player**: To'liq funksional video pleyer
- **Sifat Tanlash**: 360p dan 4K gacha turli sifatlar
- **Qidiruv va Filtrlash**: Tez va qulay qidiruv tizimi
- **Responsive Dizayn**: Barcha qurilmalarda mukammal ishlaydi
- **O'xshash Kontent**: Avtomatik tavsiya tizimi

### 🔧 Admin Panel Xususiyatlari
- **Kontent Boshqaruvi**: Yangi kontent qo'shish, tahrirlash, o'chirish
- **Fayl Yuklash**: Video va poster fayllarini yuklash
- **YouTube Integratsiyasi**: YouTube linklarini qo'shish
- **Avtomatik Ma'lumotlar**: ID, ko'rishlar, davomiylik avtomatik generatsiya
- **Foydalanuvchi Boshqaruvi**: Foydalanuvchilar ro'yxati va statistikasi
- **Analitika**: Ko'rishlar statistikasi va grafiklar
- **Sayt Sozlamalari**: Barcha matn va sozlamalarni o'zgartirish

## 🚀 Texnologiyalar

### Frontend
- **React 18** - Zamonaviy UI kutubxonasi
- **TypeScript** - Type-safe dasturlash
- **Vite** - Tez development va build
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Zamonaviy UI komponentlar
- **React Router DOM** - Client-side routing
- **TanStack Query** - Data fetching va caching
- **Zustand** - Global state management

### UI/UX
- **Responsive Design** - Barcha qurilmalar uchun
- **Dark Mode** - Zamonaviy ko'rinish
- **Smooth Animations** - Yumshoq animatsiyalar
- **Touch Gestures** - Mobil qurilmalar uchun
- **Accessibility** - Barcha foydalanuvchilar uchun

## 📦 O'rnatish

### Talablar
- Node.js 18+ 
- npm yoki yarn

### Qadamlar

1. **Repository'ni klonlang:**
```bash
git clone https://github.com/yourusername/moviemedia.git
cd moviemedia
```

2. **Frontend dependencies'ni o'rnating:**
```bash
cd frontend
npm install
```

3. **Development server'ni ishga tushiring:**
```bash
npm run dev
```

4. **Brauzerda oching:**
```
http://localhost:5173
```

## 🎯 Foydalanish

### Foydalanuvchi Uchun
1. **Bosh sahifa** - Eng yangi va mashhur kontentlar
2. **Kategoriyalar** - Kinolar, Seriallar, Premyeralar, Treylerlar
3. **Qidiruv** - Kerakli kontentni topish
4. **Tomosha qilish** - Video pleyer orqali tomosha qilish

### Admin Uchun
1. **Admin panelga kirish** - `/admin` sahifasiga o'ting
2. **Parol** - `admin123` (default)
3. **Kontent qo'shish** - Yangi kinolar, seriallar qo'shing
4. **Sozlamalar** - Sayt matnlarini o'zgartiring

## 🎮 Admin Panel Qo'llanmasi

### Kontent Qo'shish
1. **Kino Bo'limi** - Kontent qo'shish tugmasini bosing
2. **Ma'lumotlarni to'ldiring:**
   - Nomi, Tavsifi, Yili, Tili, Reytingi
   - Video fayl yoki YouTube link
   - Poster rasm yoki URL
   - Janr va Sifat tanlash
   - O'xshash kinolar ID'lari

3. **Saqlash** - "Saqlash" tugmasini bosing

### Sozlamalar
- **Sayt Ma'lumotlari**: Nomi, tavsifi, ikonkasi
- **Aloqa**: Email, telefon, ijtimoiy tarmoqlar
- **Bo'limlar**: Har bir bo'lim uchun matnlar
- **Hero Sahifa**: Asosiy sahifa matnlari

## 📱 Responsive Dizayn

- **Mobile First** - Mobil qurilmalar uchun optimallashtirilgan
- **Tablet Support** - Planshetlar uchun moslashtirilgan
- **Desktop** - Katta ekranlar uchun to'liq funksionallik

## 🎨 Dizayn Tizimi

### Ranglar
- **Primary**: Asosiy rang
- **Secondary**: Ikkinchi darajali rang
- **Accent**: Ta'kidlovchi rang
- **Background**: Fon ranglari
- **Foreground**: Matn ranglari

### Tipografiya
- **Font Family**: Inter, system fonts
- **Font Sizes**: Responsive font o'lchamlari
- **Font Weights**: 400, 500, 600, 700

## 🔧 Development

### Scripts
```bash
# Development server
npm run dev

# Build production
npm run build

# Preview build
npm run preview

# Lint code
npm run lint
```

### Struktura
```
frontend/
├── src/
│   ├── components/     # UI komponentlar
│   ├── pages/         # Sahifalar
│   ├── hooks/         # Custom hooks
│   ├── lib/           # Utility funksiyalar
│   ├── store/         # State management
│   └── assets/        # Rasm va fayllar
├── public/            # Static fayllar
└── dist/              # Build natijasi
```

## 🚀 Deployment

### Vercel (Tavsiya etiladi)
1. **Vercel'ga ulang:**
```bash
npm install -g vercel
vercel
```

2. **Environment variables:**
```
VITE_API_URL=your_api_url
```

### Boshqa Platformalar
- **Netlify** - Static hosting
- **GitHub Pages** - Free hosting
- **Firebase Hosting** - Google hosting

## 🤝 Hissa Qo'shish

1. **Fork** qiling
2. **Feature branch** yarating (`git checkout -b feature/AmazingFeature`)
3. **Commit** qiling (`git commit -m 'Add some AmazingFeature'`)
4. **Push** qiling (`git push origin feature/AmazingFeature`)
5. **Pull Request** yarating

## 📄 Litsenziya

Bu loyiha MIT litsenziyasi ostida tarqatilmoqda. Batafsil ma'lumot uchun `LICENSE` faylini ko'ring.

## 📞 Aloqa

- **Email**: info@moviemedia.uz
- **Telegram**: @moviemedia_uz
- **Website**: https://moviemedia.uz

## 🙏 Minnatdorchilik

- **React Team** - Ajoyib UI kutubxonasi
- **Vite Team** - Tez build tool
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Zamonaviy komponentlar
- **Lucide Icons** - Chiroyli ikonkalar

_________________________________________________________________________

**MoviMedia** - O'zbek kinolarining eng yaxshi platformasi! 🎬✨# MovieMeda
# MovieMedia
