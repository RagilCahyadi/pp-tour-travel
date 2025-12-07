# Setup Supabase untuk PP Tour Travel

## Langkah-langkah Setup

### 1. Persiapan Environment Variables

1. Copy file `.env.local.example` menjadi `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Buka [Supabase Dashboard](https://app.supabase.com) dan pilih project Anda

3. Pergi ke **Settings** → **API**

4. Copy nilai-nilai berikut ke file `.env.local`:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Setup Database

1. Buka **SQL Editor** di Supabase Dashboard

2. Jalankan file `database/schema.sql`:
   - Copy seluruh isi file
   - Paste di SQL Editor
   - Klik **Run**

3. (Opsional) Jalankan file `database/users.sql` untuk insert dummy data:
   - Copy seluruh isi file
   - Paste di SQL Editor
   - Klik **Run**

### 3. Verifikasi Setup

1. Buka halaman **Table Editor** di Supabase Dashboard

2. Pastikan tabel-tabel berikut sudah ada:
   - ✅ users
   - ✅ admin_profiles
   - ✅ company_settings
   - ✅ notification_preferences
   - ✅ tour_packages
   - ✅ customers
   - ✅ bookings
   - ✅ cancellation_requests
   - ✅ payments
   - ✅ schedules
   - ✅ active_sessions
   - ✅ activity_logs

3. Cek apakah views sudah dibuat:
   - dashboard_stats
   - payment_status_summary
   - popular_packages_month
   - recent_bookings
   - upcoming_departures

### 4. Disable RLS untuk Development (PENTING!)

**Masalah:** Data ada di Supabase tapi tidak muncul di aplikasi (fetched: 0 records)

**Solusi:** Disable Row Level Security untuk development

1. Buka **SQL Editor** di Supabase Dashboard
2. Jalankan file `database/disable-rls-for-dev.sql`:
   ```sql
   -- Copy paste dan run SQL ini:
   ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
   ALTER TABLE customers DISABLE ROW LEVEL SECURITY;
   ALTER TABLE tour_packages DISABLE ROW LEVEL SECURITY;
   ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
   ALTER TABLE schedules DISABLE ROW LEVEL SECURITY;
   ```

3. Verifikasi RLS sudah disabled:
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public' 
     AND tablename IN ('bookings', 'customers', 'tour_packages');
   ```
   Result harus menunjukkan `rowsecurity = false`

⚠️ **WARNING:** Jangan gunakan ini di production! Untuk production, buat RLS policies yang proper.

### 5. Jalankan Aplikasi

```bash
npm run dev
```

Buka [http://localhost:3000/admin/pemesanan](http://localhost:3000/admin/pemesanan)

Sekarang data harus muncul! 🎉

### 6. Troubleshooting

#### Data tidak muncul?

1. **Cek Console Browser** (F12):
   - Lihat apakah ada error "Fetching bookings from Supabase..."
   - Lihat jumlah records: "Bookings fetched: X records"

2. **Cek Environment Variables**:
   ```bash
   # Pastikan .env.local ada dan terisi
   cat .env.local
   ```

3. **Cek Supabase Connection**:
   - Buka **SQL Editor** di Supabase
   - Jalankan: `SELECT COUNT(*) FROM bookings;`
   - Pastikan ada data

4. **Cek RLS (Row Level Security)** - INI PALING SERING JADI MASALAH:
   
   **Gejala:** Console log menunjukkan "Bookings fetched: 0 records" padahal data ada di Supabase
   
   **Solusi:**
   - Buka **SQL Editor** di Supabase
   - Jalankan `database/disable-rls-for-dev.sql`
   - Atau manual disable RLS:
     ```sql
     ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
     ALTER TABLE customers DISABLE ROW LEVEL SECURITY;
     ALTER TABLE tour_packages DISABLE ROW LEVEL SECURITY;
     ```
   - Refresh halaman admin/pemesanan
   - Data harus langsung muncul!

#### Error: "relation does not exist"?

Jalankan ulang schema:
```sql
-- Di SQL Editor Supabase
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
-- Lalu jalankan ulang database/schema.sql
```

#### Error: "Invalid API key"?

- Pastikan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` sudah benar
- Restart development server setelah mengubah .env.local:
  ```bash
  # Stop server (Ctrl+C)
  npm run dev
  ```

## Struktur Data

### Bookings Table
```sql
bookings (
  id UUID PRIMARY KEY,
  kode_booking TEXT UNIQUE,
  customer_id UUID → customers(id),
  package_id UUID → tour_packages(id),
  jumlah_pax INTEGER,
  tanggal_keberangkatan DATE,
  status TEXT ('pending', 'confirmed', 'cancelled', 'completed'),
  catatan TEXT,
  total_biaya DECIMAL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Customers Table
```sql
customers (
  id UUID PRIMARY KEY,
  nama_pelanggan TEXT,
  nama_perusahaan TEXT,
  email TEXT,
  nomor_telepon TEXT,
  alamat TEXT
)
```

### Tour Packages Table
```sql
tour_packages (
  id UUID PRIMARY KEY,
  nama_paket TEXT,
  deskripsi TEXT,
  lokasi TEXT,
  durasi TEXT,
  tipe_paket TEXT ('Premium', 'Ekonomis'),
  harga DECIMAL,
  gambar_url TEXT
)
```

## Testing

### Menambah Data Test

```sql
-- Insert customer
INSERT INTO customers (nama_pelanggan, nama_perusahaan, email, nomor_telepon)
VALUES ('John Doe', 'PT Test', 'john@test.com', '081234567890');

-- Insert tour package
INSERT INTO tour_packages (nama_paket, lokasi, durasi, tipe_paket, harga)
VALUES ('Paket Bali Premium', 'Bali', '5 Hari 4 Malam', 'Premium', 8500000);

-- Insert booking
INSERT INTO bookings (
  kode_booking, 
  customer_id, 
  package_id, 
  jumlah_pax, 
  status, 
  total_biaya
)
SELECT 
  'TEST001',
  (SELECT id FROM customers WHERE email = 'john@test.com'),
  (SELECT id FROM tour_packages WHERE nama_paket = 'Paket Bali Premium'),
  4,
  'pending',
  34000000;
```

## Dokumentasi API

Lihat dokumentasi lengkap di `docs/SUPABASE_INTEGRATION.md`
