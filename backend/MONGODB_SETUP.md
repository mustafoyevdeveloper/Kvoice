# MongoDB Setup Guide

## Muammo: MongoDB Connection Timeout

MongoDB server ishlamayapti yoki ulanishi mumkin emas.

## Yechim 1: MongoDB Atlas (Tavsiya etiladi)

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) hisob yarating
2. Yangi cluster yarating (FREE tier mavjud)
3. Database Access → User yarating (username va password)
4. Network Access → IP Address qo'shing (0.0.0.0/0 - barcha IP'larga ruxsat)
5. Connect → "Connect your application" → Connection string oling

### `.env` faylini yangilang:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kvoice?retryWrites=true&w=majority
```

**Muhim:** `username`, `password`, va `cluster` ni o'zingiznikiga o'zgartiring!

## Yechim 2: Lokal MongoDB

### Windows:

1. [MongoDB Community Server](https://www.mongodb.com/try/download/community) yuklab oling
2. O'rnating
3. MongoDB'ni service sifatida ishga tushiring:

```bash
# MongoDB service'ni ishga tushirish
net start MongoDB
```

Yoki MongoDB'ni manual ishga tushirish:
```bash
mongod --dbpath="C:\data\db"
```

### `.env` fayl:

```env
MONGODB_URI=mongodb://localhost:27017/kvoice
```

## Yechim 3: Docker (Tekshirish uchun)

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Tekshirish

MongoDB ulanganini tekshirish:

```bash
# Terminal'da:
curl http://localhost:3000/api/health
```

Agar "MongoDB connected successfully" xabari ko'rinsa, ulanish muvaffaqiyatli.

## Xatoliklar

### "Operation buffering timed out"
- MongoDB server ishlamayapti
- MONGODB_URI noto'g'ri
- Firewall/Network muammosi

### "MongoDB connection error"
- Username/password noto'g'ri (Atlas)
- Network Access'da IP qo'shilmagan (Atlas)
- MongoDB service ishlamayapti (lokal)

