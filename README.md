# Bakery Naichii

Proyek ini adalah implementasi lengkap website e-commerce modern untuk Naichii Bakery.

## Struktur

- `frontend/` - React + Vite + Tailwind CSS
- `backend/` - Node.js + Express + Prisma + PostgreSQL
- `backend/prisma/` - Prisma schema dan seed data

## Fitur utama

- Autentikasi JWT
- Dashboard admin
- Keranjang, wishlist, checkout
- Pencarian realtime dengan filter
- Manajemen produk, pesanan, pengguna, promo
- Notifikasi realtime dengan Socket.io
- Upload gambar produk ke Cloudinary
- SEO, sitemap, favicon, design responsive

## Instalasi

1. Kloning repositori ini
2. Buat file environment untuk frontend dan backend

### Backend

Masuk ke folder backend:

```bash
cd backend
```

Salin file lingkungan:

```bash
cp .env.example .env
```

Sesuaikan `DATABASE_URL`, `JWT_SECRET`, `CLOUDINARY_*`, dan `FRONTEND_URL`.

Install dependensi:

```bash
npm install
```

Generate Prisma client dan migrasi:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

Jalankan backend:

```bash
npm run dev
```

### Frontend

Masuk ke folder frontend:

```bash
cd ../frontend
```

Install dependensi:

```bash
npm install
```

Jalankan aplikasi:

```bash
npm run dev
```

## Deploy

- Frontend siap deploy ke Vercel
- Backend siap deploy ke Railway/Render

## Catatan

Gunakan database PostgreSQL atau MySQL dengan koneksi di environment.
