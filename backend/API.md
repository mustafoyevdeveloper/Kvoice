# Movie Media Backend API Documentation

Bu hujjat Movie Media backend API'sining barcha endpoint'larini va ularning qo'llanilishini tushuntiradi.

## Base URL

```
http://localhost:3000/api
```

Production:
```
https://your-domain.com/api
```

## Authentication

Hozircha API authentication yo'q. Keyinroq qo'shilishi mumkin.

---

## Health Check

### GET /api/health

Serverning holatini tekshiradi.

**Response:**
```json
{
  "success": true,
  "message": "Movie Media API Server is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

## Movies API

### GET /api/movies

Barcha kinolar va seriallarni olish.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|-------|----------|---------|-------------|
| `category` | string | No | - | Filtr (`movies` yoki `series`). `all` bo'lsa barchasi |
| `q` | string | No | - | Qidiruv so'rovi (title yoki description bo'yicha) |
| `page` | number | No | 1 | Sahifa raqami |
| `limit` | number | No | 20 | Har sahifadagi elementlar soni |
| `sort` | string | No | `createdAt` | Tartiblash maydoni |
| `order` | string | No | `desc` | Tartib (`asc` yoki `desc`) |

**Example Request:**
```bash
GET /api/movies?category=movies&page=1&limit=10&sort=year&order=desc
GET /api/movies?q=thor&category=all
GET /api/movies?category=series&page=2
```

**Response:**
```json
{
  "success": true,
  "message": "Movies retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Tor: Qorong'u olam",
      "description": "Kino tavsifi...",
      "year": 2013,
      "language": "english",
      "rating": 7.5,
      "category": "movies",
      "genres": ["Fantastika", "Jangari"],
      "quality": ["360p", "480p", "720p", "1080p"],
      "poster": "https://example.com/poster.jpg",
      "posterUrl": "https://example.com/poster.jpg",
      "videoLink": "https://t.me/example",
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### GET /api/movies/:id

Bitta kino yoki serial ma'lumotlarini ID bo'yicha olish.

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|-------|----------|-------------|
| `id` | string | Yes | Movie/Series MongoDB ID |

**Example Request:**
```bash
GET /api/movies/507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "success": true,
  "message": "Movie retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Tor: Qorong'u olam",
    "description": "Kino tavsifi...",
    "year": 2013,
    "language": "english",
    "rating": 7.5,
    "category": "movies",
    "genres": ["Fantastika", "Jangari"],
    "quality": ["360p", "480p", "720p", "1080p"],
    "poster": "https://example.com/poster.jpg",
    "posterUrl": "https://example.com/poster.jpg",
    "videoLink": "https://t.me/example",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Movie not found",
  "error": "Movie not found"
}
```

---

### GET /api/movies/:id/poster

Kino yoki serial poster rasmini olish (MongoDB'dan Buffer sifatida saqlangan).

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|-------|----------|-------------|
| `id` | string | Yes | Movie/Series MongoDB ID |

**Example Request:**
```bash
GET /api/movies/507f1f77bcf86cd799439011/poster
```

**Response:**
- Content-Type: Image (JPEG, PNG, WebP)
- Binary data (rasm fayli)

**Error Response (404):**
```json
{
  "success": false,
  "message": "Poster not found",
  "error": "Poster not found"
}
```

---

### POST /api/movies

Yangi kino yoki serial qo'shish.

**Content-Type:** `multipart/form-data` (poster rasm fayli uchun) yoki `application/json`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Kino/Serial nomi (max 200 chars) |
| `description` | string | Yes | Tavsif (max 2000 chars) |
| `year` | number | Yes | Yil (1900-2030) |
| `language` | string | Yes | Til (enum: uzbek, russian, english, german, spanish, italian, japanese, chinese, turkish, korean) |
| `rating` | number | Yes | Reyting (1-10) |
| `category` | string | Yes | Kategoriya (`movies` yoki `series`) |
| `genres` | array | Yes | Janrlar ro'yxati (enum: Drama, Komediya, Fantastika, Jangari, Romantik, Detektiv, Tarixiy, Oilaviy, Dokumental, Qo'rqinchli, Sarguzasht, Sport, Musiqiy, G'ayritabiiy) |
| `quality` | array | Yes | Video sifatlar (enum: 360p, 480p, 720p, 1080p, 1440p, 4K). Automatik tarzda o'sib borish tartibida tartiblanadi. |
| `videoLink` | string | Yes | Video havolasi (HTTP/HTTPS URL, odatda Telegram link) |
| `poster` | file | No | Poster rasm fayli (max 500KB, PNG/WebP/JPG) |
| `posterUrl` | string | No | Poster URL (HTTP/HTTPS URL, base64 data URI yoki relative path). Agar `poster` fayli yuborilsa, `posterUrl` e'tiborsiz qoldiriladi. |
| `totalEpisodes` | number | No | Serial uchun jami epizodlar soni (faqat `category=series` bo'lganda) |
| `currentEpisode` | number | No | Serial uchun hozirgi epizod raqami (faqat `category=series` bo'lganda) |

**FormData Example (JavaScript):**
```javascript
const formData = new FormData();
formData.append('title', 'Tor: Qorong\'u olam');
formData.append('description', 'Kino tavsifi...');
formData.append('year', '2013');
formData.append('language', 'english');
formData.append('rating', '7.5');
formData.append('category', 'movies');
formData.append('genres', JSON.stringify(['Fantastika', 'Jangari']));
formData.append('quality', JSON.stringify(['360p', '480p', '720p', '1080p']));
formData.append('videoLink', 'https://t.me/example');
formData.append('poster', fileInput.files[0]); // Optional file
// yoki
formData.append('posterUrl', 'https://example.com/poster.jpg');
```

**JSON Example:**
```json
{
  "title": "Tor: Qorong'u olam",
  "description": "Kino tavsifi...",
  "year": 2013,
  "language": "english",
  "rating": 7.5,
  "category": "movies",
  "genres": ["Fantastika", "Jangari"],
  "quality": ["360p", "480p", "720p", "1080p"],
  "videoLink": "https://t.me/example",
  "posterUrl": "https://example.com/poster.jpg"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Movie created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Tor: Qorong'u olam",
    "description": "Kino tavsifi...",
    "year": 2013,
    "language": "english",
    "rating": 7.5,
    "category": "movies",
    "genres": ["Fantastika", "Jangari"],
    "quality": ["360p", "480p", "720p", "1080p"],
    "poster": "https://example.com/poster.jpg",
    "posterUrl": "https://example.com/poster.jpg",
    "videoLink": "https://t.me/example",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Validation Error Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title is required",
      "value": ""
    },
    {
      "field": "year",
      "message": "Year must be between 1900 and 2030",
      "value": 1800
    }
  ]
}
```

**File Size Error Response (400):**
```json
{
  "success": false,
  "message": "Rasm hajmi 1000KB dan katta bo'lishi mumkin emas!",
  "error": "File size exceeds 1000KB limit"
}
```

**File Format Error Response (400):**
```json
{
  "success": false,
  "message": "Faqat PNG, WebP yoki JPG formatidagi rasmlar ruxsat etiladi!",
  "error": "Invalid file format"
}
```

---

### PUT /api/movies/:id

Mavjud kino yoki serialni yangilash.

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|-------|----------|-------------|
| `id` | string | Yes | Movie/Series MongoDB ID |

**Content-Type:** `multipart/form-data` (poster rasm fayli uchun) yoki `application/json`

**Request Body:**

Barcha maydonlar POST bilan bir xil, lekin barchasi optional (faqat yangilash kerak bo'lgan maydonlar yuboriladi).

**FormData Example:**
```javascript
const formData = new FormData();
formData.append('title', 'Tor: Qorong\'u olam (Updated)');
formData.append('rating', '8.0');
formData.append('poster', fileInput.files[0]); // Optional new poster
```

**JSON Example:**
```json
{
  "title": "Tor: Qorong'u olam (Updated)",
  "rating": 8.0,
  "posterUrl": "https://example.com/new-poster.jpg"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Movie updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Tor: Qorong'u olam (Updated)",
    "description": "Kino tavsifi...",
    "year": 2013,
    "language": "english",
    "rating": 8.0,
    "category": "movies",
    "genres": ["Fantastika", "Jangari"],
    "quality": ["360p", "480p", "720p", "1080p"],
    "poster": "https://example.com/new-poster.jpg",
    "posterUrl": "https://example.com/new-poster.jpg",
    "videoLink": "https://t.me/example",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T13:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Movie not found",
  "error": "Movie not found"
}
```

---

### DELETE /api/movies/:id

Kino yoki serialni o'chirish.

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|-------|----------|-------------|
| `id` | string | Yes | Movie/Series MongoDB ID |

**Example Request:**
```bash
DELETE /api/movies/507f1f77bcf86cd799439011
```

**Response (200):**
```json
{
  "success": true,
  "message": "Movie deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Movie not found",
  "error": "Movie not found"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid movie ID",
  "error": "Cast to ObjectId failed for value ..."
}
```

---

## Data Models

### Movie/Series Schema

```javascript
{
  _id: ObjectId,              // MongoDB ID
  title: String,              // Kino/Serial nomi (required, max 200 chars)
  description: String,        // Tavsif (required, max 2000 chars)
  year: Number,              // Yil (required, 1900-2030)
  language: String,          // Til (required, enum)
  rating: Number,            // Reyting (required, 1-10)
  category: String,          // Kategoriya (required: 'movies' | 'series')
  genres: [String],          // Janrlar (required, array of enum)
  quality: [String],         // Video sifatlar (required, array of enum, auto-sorted)
  poster: String,            // Poster (base64, URL yoki relative path)
  posterUrl: String,         // Poster URL (HTTP/HTTPS URL yoki relative path)
  posterData: Buffer,        // Poster rasm Buffer (MongoDB'da saqlanadi, response'da chiqarilmaydi)
  posterContentType: String, // Poster content type (default: 'image/jpeg')
  videoLink: String,         // Video havolasi (required, HTTP/HTTPS URL)
  totalEpisodes: Number,     // Serial uchun jami epizodlar (optional, faqat series)
  currentEpisode: Number,    // Serial uchun hozirgi epizod (optional, faqat series)
  createdAt: Date,          // Yaratilgan vaqt
  updatedAt: Date           // Yangilangan vaqt
}
```

### Enums

#### Language
```
'uzbek', 'russian', 'english', 'german', 'spanish', 
'italian', 'japanese', 'chinese', 'turkish', 'korean'
```

#### Category
```
'movies', 'series'
```

#### Genres
```
'Drama', 'Komediya', 'Fantastika', 'Jangari', 'Romantik', 
'Detektiv', 'Tarixiy', 'Oilaviy', 'Dokumental', 'Qo'rqinchli', 
'Sarguzasht', 'Sport', 'Musiqiy', 'G'ayritabiiy'
```

#### Quality
```
'360p', '480p', '720p', '1080p', '1440p', '4K'
```
**Eslatma:** Quality array har doim o'sib borish tartibida tartiblanadi (360p → 480p → 720p → 1080p → 1440p → 4K).

---

## Validation Rules

### POST /api/movies va PUT /api/movies

1. **title**: Majburiy, bo'sh bo'lishi mumkin emas, max 200 belgi
2. **description**: Majburiy, bo'sh bo'lishi mumkin emas, max 2000 belgi
3. **year**: Majburiy, 1900-2030 orasida
4. **language**: Majburiy, enum qiymatlardan biri
5. **rating**: Majburiy, 1-10 orasida
6. **category**: Majburiy, `movies` yoki `series`
7. **genres**: Majburiy, kamida 1 ta janr
8. **quality**: Majburiy, kamida 1 ta sifat
9. **videoLink**: Majburiy, HTTP/HTTPS URL formatida
10. **poster**: Optional, max 500KB, faqat PNG/WebP/JPG
11. **posterUrl**: Optional, HTTP/HTTPS URL, base64 data URI yoki relative path
12. **totalEpisodes**: Optional, faqat `category=series` bo'lganda, min 1
13. **currentEpisode**: Optional, faqat `category=series` bo'lganda, min 1

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error message",
  "errors": [  // Validation errors uchun
    {
      "field": "fieldName",
      "message": "Error message",
      "value": "invalidValue"
    }
  ]
}
```

### HTTP Status Codes

- `200 OK` - Muvaffaqiyatli so'rov
- `201 Created` - Yangi resurs yaratildi
- `400 Bad Request` - Validation yoki format xatosi
- `404 Not Found` - Resurs topilmadi
- `500 Internal Server Error` - Server ichki xatosi

---

## Example cURL Requests

### Get All Movies
```bash
curl -X GET "http://localhost:3000/api/movies?page=1&limit=10"
```

### Get Movie by ID
```bash
curl -X GET "http://localhost:3000/api/movies/507f1f77bcf86cd799439011"
```

### Create Movie (JSON)
```bash
curl -X POST "http://localhost:3000/api/movies" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tor: Qorong'\''u olam",
    "description": "Kino tavsifi...",
    "year": 2013,
    "language": "english",
    "rating": 7.5,
    "category": "movies",
    "genres": ["Fantastika", "Jangari"],
    "quality": ["360p", "480p", "720p", "1080p"],
    "videoLink": "https://t.me/example",
    "posterUrl": "https://example.com/poster.jpg"
  }'
```

### Create Movie (FormData with file)
```bash
curl -X POST "http://localhost:3000/api/movies" \
  -F "title=Tor: Qorong'u olam" \
  -F "description=Kino tavsifi..." \
  -F "year=2013" \
  -F "language=english" \
  -F "rating=7.5" \
  -F "category=movies" \
  -F "genres=[\"Fantastika\", \"Jangari\"]" \
  -F "quality=[\"360p\", \"480p\", \"720p\", \"1080p\"]" \
  -F "videoLink=https://t.me/example" \
  -F "poster=@/path/to/poster.jpg"
```

### Update Movie
```bash
curl -X PUT "http://localhost:3000/api/movies/507f1f77bcf86cd799439011" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tor: Qorong'\''u olam (Updated)",
    "rating": 8.0
  }'
```

### Delete Movie
```bash
curl -X DELETE "http://localhost:3000/api/movies/507f1f77bcf86cd799439011"
```

---

## Notes

1. **Quality Sorting**: Quality array har doim avtomatik tarzda o'sib borish tartibida tartiblanadi, qanday tartibda yuborilsa ham.

2. **Poster Handling**: 
   - Agar `poster` fayli yuborilsa, u MongoDB'da Buffer sifatida saqlanadi
   - Agar `posterUrl` yuborilsa, u saqlanadi (HTTP/HTTPS URL, base64 data URI yoki relative path)
   - Agar ikkalasi ham yuborilsa, fayl ustunlik qiladi

3. **Series Fields**: `totalEpisodes` va `currentEpisode` faqat `category=series` bo'lganda ishlatiladi va optional.

4. **Pagination**: GET /api/movies endpoint'i pagination qo'llab-quvvatlaydi. `page` va `limit` parametrlaridan foydalaning.

5. **Search**: `q` parametri orqali title va description bo'yicha qidiruv amalga oshiriladi (case-insensitive regex).

6. **Sorting**: `sort` va `order` parametrlari orqali ma'lumotlar turli maydonlar bo'yicha tartiblanishi mumkin.

---

## Support

Agar savol yoki muammo bo'lsa, loyiha maintainer'iga murojaat qiling.

