# InstaCard Auth Backend (Express + Prisma + PostgreSQL)

Backend autentikasi `register` dan `login` menggunakan ExpressJS, Prisma, dan PostgreSQL.

## 1. Setup

1. Copy `.env.example` jadi `.env`
2. Pastikan `DATABASE_URL` dan `JWT_SECRET` sudah benar
3. Jalankan:

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Server jalan di `http://localhost:5000` (default).

## 2. Endpoint

### `POST /api/auth/register`

Body:

```json
{
  "name": "Budi",
  "email": "budi@mail.com",
  "password": "123456"
}
```

### `POST /api/auth/login`

Body:

```json
{
  "email": "budi@mail.com",
  "password": "123456"
}
```

Response sukses (register/login):

```json
{
  "success": true,
  "message": "Login berhasil.",
  "data": {
    "user": {
      "id": 1,
      "name": "Budi",
      "email": "budi@mail.com",
      "createdAt": "2026-04-21T13:00:00.000Z"
    },
    "token": "JWT_TOKEN"
  }
}
```

## 3. Contoh Integrasi Frontend

```js
const response = await fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "budi@mail.com",
    password: "123456",
  }),
});

const result = await response.json();

if (result.success) {
  localStorage.setItem("token", result.data.token);
}
```
