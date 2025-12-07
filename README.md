# PP Tour Travel

Aplikasi manajemen tour travel dengan fitur admin panel untuk mengelola paket tour, pemesanan, pembayaran, dan penjadwalan.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **Language**: TypeScript

## Getting Started

### 1. Clone dan Install Dependencies

```bash
git clone https://github.com/RagilCahyadi/pp-tour-travel.git
cd pp-tour-travel
npm install
```

### 2. Setup Environment Variables

Copy file `.env.example` ke `.env.local` dan isi dengan konfigurasi yang sesuai:

```bash
cp .env.example .env.local
```

### 3. Setup Supabase Database

1. Buat project baru di [Supabase](https://supabase.com)
2. Copy URL dan API keys ke `.env.local`
3. Jalankan SQL schema di Supabase SQL Editor:
   - Buka file `database/schema.sql`
   - Copy seluruh isi file
   - Paste dan jalankan di Supabase SQL Editor

### 4. Setup Clerk Authentication

1. Buat project di [Clerk](https://clerk.com)
2. Copy Publishable Key dan Secret Key ke `.env.local`
3. Setup webhook untuk sinkronisasi user (lihat `app/api/webhooks/route.ts`)

### 5. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Database Schema

Database menggunakan Supabase (PostgreSQL) dengan tabel-tabel berikut:

| Tabel | Deskripsi |
|-------|-----------|
| `users` | Data user dari Clerk OAuth |
| `admin_profiles` | Profil admin (nama, alamat, dll) |
| `company_settings` | Pengaturan perusahaan travel |
| `notification_preferences` | Preferensi notifikasi admin |
| `tour_packages` | Paket tour yang tersedia |
| `customers` | Data pelanggan/instansi |
| `bookings` | Data pemesanan |
| `cancellation_requests` | Pengajuan pembatalan |
| `payments` | Data pembayaran |
| `schedules` | Jadwal keberangkatan |
| `active_sessions` | Sesi login aktif |
| `activity_logs` | Log aktivitas untuk audit |

### Entity Relationship Diagram

```
users
  ├── admin_profiles (1:1)
  ├── notification_preferences (1:1)
  ├── active_sessions (1:N)
  └── activity_logs (1:N)

customers
  ├── user_id → users (N:1)
  └── bookings (1:N)

tour_packages
  ├── bookings (1:N)
  └── schedules (1:N)

bookings
  ├── customer_id → customers (N:1)
  ├── package_id → tour_packages (N:1)
  ├── payments (1:N)
  ├── schedules (1:N)
  └── cancellation_requests (1:1)
```

## Fitur Admin Panel

### Dashboard (`/admin/dashboard`)
- Overview statistik booking dan pendapatan
- Grafik trend booking
- Status pembayaran
- Paket tour terpopuler
- Booking terbaru
- Keberangkatan terdekat

### Kelola Paket Tour (`/admin/paket`)
- CRUD paket tour
- Filter berdasarkan tipe (Premium/Ekonomis)
- Upload gambar dan brosur

### Kelola Pemesanan (`/admin/pemesanan`)
- List semua pemesanan
- Filter: Semua, Dikonfirmasi, Pending, Dibatalkan
- Kelola status pemesanan
- Kelola pengajuan pembatalan

### Verifikasi Pembayaran (`/admin/pembayaran`)
- List semua pembayaran
- Filter: Semua, Sudah Dibayar, Menunggu Verifikasi
- Verifikasi pembayaran dengan catatan

### Penjadwalan (`/admin/penjadwalan`)
- CRUD jadwal keberangkatan
- Export ke PDF
- Filter dan search

### Pengaturan (`/admin/pengaturan`)
- Profil admin
- Keamanan & sesi aktif
- Pengaturan perusahaan
- Preferensi notifikasi

## File Structure

```
├── app/
│   ├── admin/           # Admin pages
│   ├── api/             # API routes
│   ├── login/           # Auth pages
│   └── sign-up/
├── components/          # React components
├── database/
│   ├── schema.sql       # Database schema
│   └── users.sql        # Legacy users table
├── lib/
│   ├── database.types.ts # TypeScript types
│   ├── supabase.ts      # Supabase client
│   └── utils.ts
└── public/
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
