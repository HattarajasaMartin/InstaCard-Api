# InstaCard API Backend

Backend untuk aplikasi InstaCard (Linktree clone) menggunakan ExpressJS, Prisma, dan PostgreSQL.

## Tech Stack

- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- JWT Authentication
- bcryptjs
- qrcode

## 1. Setup

1. Copy `.env.example` jadi `.env`
2. Isi variabel berikut di `.env`:

\```env
PORT=5000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
DATABASE_URL=postgresql://user:password@localhost:5432/instacard_db?schema=public
BASE_URL=http://localhost:5000
\```

3. Jalankan:

\```bash
npm install
npx prisma migrate dev
npx prisma generate
npm run dev
\```

Server jalan di `http://localhost:5000`

---

## 2. Endpoints

### Auth

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/auth/register` | Register user baru |
| POST | `/api/auth/login` | Login, return JWT token |

#### `POST /api/auth/register`
```json
{
  "username": "wowok",
  "name": "Wowok",
  "email": "wowok@gmail.com",
  "password": "admin1234"
}
```

#### `POST /api/auth/login`
```json
{
  "email": "wowok@gmail.com",
  "password": "admin1234"
}
```

Response sukses:
```json
{
  "success": true,
  "message": "Login berhasil.",
  "data": {
    "user": {
      "id": 1,
      "username": "wowok",
      "name": "Wowok",
      "email": "wowok@gmail.com",
      "createdAt": "2026-05-09T13:00:00.000Z"
    },
    "token": "JWT_TOKEN"
  }
}
```

---

### Profile

> Semua endpoint profile butuh header `Authorization: Bearer <token>`

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/profiles/me` | Ambil profil user |
| PATCH | `/api/profiles/me` | Update profil user |
| PUT | `/api/profiles/theme` | Update theme profil |

#### `PATCH /api/profiles/me`
```json
{
  "name": "Wowok",
  "bio": "Full Stack Developer",
  "avatar": "https://example.com/avatar.jpg",
  "headline": "Building cool things"
}
```

#### `PUT /api/profiles/theme`
```json
{
  "bgType": "gradient",
  "bgGradientStart": "#6366f1",
  "bgGradientEnd": "#a855f7",
  "textColor": "#ffffff",
  "buttonColor": "#ffffff"
}
```

---

### Links

> Semua endpoint links butuh header `Authorization: Bearer <token>`

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/links` | Ambil semua link milik user |
| POST | `/api/links` | Buat link baru |
| PUT | `/api/links/:id` | Update link |
| DELETE | `/api/links/:id` | Hapus link |
| PATCH | `/api/links/reorder` | Reorder posisi link |

#### `POST /api/links`
```json
{
  "title": "GitHub saya",
  "url": "https://github.com/wowok",
  "icon": "github"
}
```

---

### QR Code

> Butuh header `Authorization: Bearer <token>`

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/qr/profile` | QR Code halaman profil publik |
| GET | `/api/qr/links/:id` | QR Code untuk link tertentu |

Query params (opsional):
- `format` = `base64` (default) atau `svg`
- `width` = ukuran px (default: 300)
- `dark` = warna hex gelap (default: #000000)
- `light` = warna hex terang (default: #ffffff)
- `raw=true` = return SVG langsung sebagai image (khusus format svg)

---

### Analitik

> Butuh header `Authorization: Bearer <token>`

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/analytics/summary` | Total klik semua link |
| GET | `/api/analytics/links/:id` | Detail klik per link |

Response summary:
```json
{
  "success": true,
  "data": {
    "totalClicks": 42,
    "totalLinks": 5,
    "links": [
      {
        "id": "clxxxxxx",
        "title": "GitHub saya",
        "url": "https://github.com/wowok",
        "totalClicks": 20,
        "lastClickedAt": "2026-05-09T10:00:00.000Z"
      }
    ]
  }
}
```

---

### Halaman Publik

> Tidak butuh autentikasi

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/u/:username` | Halaman publik profil + links |
| GET | `/u/:username/links/:id` | Detail link publik |
| POST | `/u/:username/links/:id/click` | Record klik link |

---

## 3. Contoh Integrasi Frontend

```js
// Login
const response = await fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "wowok@gmail.com",
    password: "admin1234",
  }),
});
const result = await response.json();
if (result.success) {
  localStorage.setItem("token", result.data.token);
}

// Request dengan auth
const token = localStorage.getItem("token");
const profile = await fetch("http://localhost:5000/api/profiles/me", {
  headers: { Authorization: `Bearer ${token}` },
});

// Record klik link
await fetch("http://localhost:5000/u/wowok/links/clxxxxxx/click", {
  method: "POST",
});
```

---

## 4. Format Response

### Sukses
```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

### Error
```json
{
  "success": false,
  "message": "..."
}
```
