-- =====================================================
-- PP TOUR TRAVEL - DATABASE SCHEMA FOR SUPABASE
-- =====================================================
-- Author: Generated for PP Tour Travel Admin System
-- Date: December 7, 2025
-- Description: Complete database schema for tour travel management
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USERS TABLE (Already exists - skipped)
-- =====================================================
-- Note: Tabel users sudah ada dari setup sebelumnya
-- Hanya menambahkan kolom phone_number jika belum ada
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='phone_number') THEN
        ALTER TABLE users ADD COLUMN phone_number TEXT;
    END IF;
END $$;

-- =====================================================
-- 2. ADMIN PROFILES TABLE
-- =====================================================
-- Menyimpan data profil admin yang ditampilkan di halaman pengaturan
CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nama TEXT NOT NULL,
  hak_akses TEXT DEFAULT 'Admin-1',
  negara TEXT DEFAULT 'Indonesia',
  kota TEXT,
  alamat TEXT,
  email TEXT,
  nomor_hp TEXT,
  bahasa TEXT DEFAULT 'id',
  zona_waktu TEXT DEFAULT 'GMT+7',
  foto_profil_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- =====================================================
-- 3. COMPANY SETTINGS TABLE
-- =====================================================
-- Menyimpan pengaturan perusahaan travel
CREATE TABLE IF NOT EXISTS company_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama_perusahaan TEXT NOT NULL DEFAULT 'PP Tour Travel',
  alamat_kantor TEXT,
  telepon_kantor TEXT,
  whatsapp_bisnis TEXT,
  email_bisnis TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 4. NOTIFICATION PREFERENCES TABLE
-- =====================================================
-- Menyimpan preferensi notifikasi admin
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email_enabled BOOLEAN DEFAULT true,
  booking_baru BOOLEAN DEFAULT true,
  pembayaran BOOLEAN DEFAULT true,
  laporan_mingguan BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- =====================================================
-- 5. TOUR PACKAGES TABLE
-- =====================================================
-- Menyimpan data paket tour (halaman Paket)
CREATE TABLE IF NOT EXISTS tour_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama_paket TEXT NOT NULL,
  deskripsi TEXT,
  lokasi TEXT NOT NULL,
  -- Durasi dalam format "X Hari Y Malam"
  durasi TEXT NOT NULL,
  -- Tipe paket: 'Premium' atau 'Ekonomis'
  tipe_paket TEXT NOT NULL CHECK (tipe_paket IN ('Premium', 'Ekonomis')),
  -- Harga dalam Rupiah
  harga DECIMAL(15, 2) NOT NULL,
  -- Minimal penumpang
  minimal_penumpang INTEGER DEFAULT 1,
  -- URL gambar paket
  gambar_url TEXT,
  -- URL brosur PDF
  brosur_url TEXT,
  -- Nama daerah/pulau
  nama_daerah TEXT,
  -- Status aktif
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 6. CUSTOMERS TABLE
-- =====================================================
-- Menyimpan data pelanggan/instansi yang memesan
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  nama_pelanggan TEXT NOT NULL,
  nama_perusahaan TEXT,
  email TEXT,
  nomor_telepon TEXT,
  alamat TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 7. BOOKINGS/ORDERS TABLE
-- =====================================================
-- Menyimpan data pemesanan (halaman Pemesanan)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- Kode booking unik (contoh: BAMH760)
  kode_booking TEXT UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  package_id UUID NOT NULL REFERENCES tour_packages(id) ON DELETE RESTRICT,
  -- Jumlah peserta
  jumlah_pax INTEGER NOT NULL DEFAULT 1,
  -- Tanggal keberangkatan yang dipilih
  tanggal_keberangkatan DATE,
  -- Status: 'pending', 'confirmed', 'cancelled', 'completed'
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  -- Catatan dari pelanggan
  catatan TEXT,
  -- Token booking (untuk konfirmasi)
  booking_token TEXT,
  -- Total biaya
  total_biaya DECIMAL(15, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 8. CANCELLATION REQUESTS TABLE
-- =====================================================
-- Menyimpan pengajuan pembatalan (halaman Pemesanan - tab Dibatalkan)
CREATE TABLE IF NOT EXISTS cancellation_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  -- Status pengajuan: 'pending', 'processing', 'approved', 'rejected'
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'approved', 'rejected')),
  -- Alasan pembatalan
  alasan TEXT,
  -- Catatan admin
  catatan_admin TEXT,
  -- Admin yang memproses
  processed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 9. PAYMENTS TABLE
-- =====================================================
-- Menyimpan data pembayaran (halaman Pembayaran)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  -- Jumlah pembayaran
  jumlah_pembayaran DECIMAL(15, 2) NOT NULL,
  -- Metode pembayaran: 'transfer_bank', 'e-wallet', 'cash', dll
  metode_pembayaran TEXT,
  -- Status: 'pending', 'verified', 'rejected'
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  -- URL bukti transfer
  bukti_pembayaran_url TEXT,
  -- Catatan verifikasi
  catatan_verifikasi TEXT,
  -- Admin yang memverifikasi
  verified_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 10. SCHEDULES TABLE
-- =====================================================
-- Menyimpan data penjadwalan (halaman Penjadwalan)
CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- Kode jadwal unik (contoh: PRE17B)
  kode_jadwal TEXT UNIQUE NOT NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  package_id UUID NOT NULL REFERENCES tour_packages(id) ON DELETE RESTRICT,
  -- Nama instansi
  nama_instansi TEXT,
  -- Tanggal keberangkatan
  tanggal_keberangkatan DATE NOT NULL,
  -- Waktu keberangkatan
  waktu_keberangkatan TIME,
  -- Status: 'aktif', 'tidak-aktif', 'selesai'
  status TEXT NOT NULL DEFAULT 'aktif' CHECK (status IN ('aktif', 'tidak-aktif', 'selesai')),
  -- Catatan jadwal
  catatan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 11. ACTIVE SESSIONS TABLE
-- =====================================================
-- Menyimpan sesi aktif untuk keamanan (halaman Pengaturan)
CREATE TABLE IF NOT EXISTS active_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  -- Nama perangkat
  device_name TEXT,
  -- Tipe perangkat: 'desktop', 'mobile', 'tablet'
  device_type TEXT,
  -- Browser yang digunakan
  browser TEXT,
  -- Lokasi login
  location TEXT,
  -- IP Address
  ip_address TEXT,
  -- Session token
  session_token TEXT,
  -- Waktu terakhir aktif
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  -- Apakah perangkat saat ini
  is_current BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 12. ACTIVITY LOGS TABLE
-- =====================================================
-- Menyimpan log aktivitas untuk audit
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  -- Jenis aksi: 'create', 'update', 'delete', 'login', 'logout', dll
  action TEXT NOT NULL,
  -- Tabel yang terkait
  table_name TEXT,
  -- ID record yang terkait
  record_id TEXT,
  -- Detail perubahan dalam JSON
  details JSONB,
  -- IP Address
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email_address);
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);

-- Tour packages indexes
CREATE INDEX IF NOT EXISTS idx_tour_packages_tipe ON tour_packages(tipe_paket);
CREATE INDEX IF NOT EXISTS idx_tour_packages_lokasi ON tour_packages(lokasi);
CREATE INDEX IF NOT EXISTS idx_tour_packages_is_active ON tour_packages(is_active);

-- Customers indexes
CREATE INDEX IF NOT EXISTS idx_customers_nama ON customers(nama_pelanggan);
CREATE INDEX IF NOT EXISTS idx_customers_perusahaan ON customers(nama_perusahaan);

-- Bookings indexes
CREATE INDEX IF NOT EXISTS idx_bookings_kode ON bookings(kode_booking);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_package ON bookings(package_id);
CREATE INDEX IF NOT EXISTS idx_bookings_tanggal ON bookings(tanggal_keberangkatan);

-- Payments indexes
CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Schedules indexes
CREATE INDEX IF NOT EXISTS idx_schedules_kode ON schedules(kode_jadwal);
CREATE INDEX IF NOT EXISTS idx_schedules_status ON schedules(status);
CREATE INDEX IF NOT EXISTS idx_schedules_tanggal ON schedules(tanggal_keberangkatan);

-- Activity logs indexes
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for each table (only create if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
        CREATE TRIGGER update_users_updated_at
            BEFORE UPDATE ON users
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_admin_profiles_updated_at') THEN
        CREATE TRIGGER update_admin_profiles_updated_at
            BEFORE UPDATE ON admin_profiles
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_company_settings_updated_at') THEN
        CREATE TRIGGER update_company_settings_updated_at
            BEFORE UPDATE ON company_settings
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_notification_preferences_updated_at') THEN
        CREATE TRIGGER update_notification_preferences_updated_at
            BEFORE UPDATE ON notification_preferences
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_tour_packages_updated_at') THEN
        CREATE TRIGGER update_tour_packages_updated_at
            BEFORE UPDATE ON tour_packages
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_customers_updated_at') THEN
        CREATE TRIGGER update_customers_updated_at
            BEFORE UPDATE ON customers
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_bookings_updated_at') THEN
        CREATE TRIGGER update_bookings_updated_at
            BEFORE UPDATE ON bookings
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_cancellation_requests_updated_at') THEN
        CREATE TRIGGER update_cancellation_requests_updated_at
            BEFORE UPDATE ON cancellation_requests
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_payments_updated_at') THEN
        CREATE TRIGGER update_payments_updated_at
            BEFORE UPDATE ON payments
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_schedules_updated_at') THEN
        CREATE TRIGGER update_schedules_updated_at
            BEFORE UPDATE ON schedules
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- =====================================================
-- FUNCTION TO GENERATE BOOKING CODE
-- =====================================================
CREATE OR REPLACE FUNCTION generate_booking_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    -- Generate 4 huruf + 3 angka
    FOR i IN 1..4 LOOP
        result := result || substr(chars, floor(random() * 26 + 1)::int, 1);
    END LOOP;
    FOR i IN 1..3 LOOP
        result := result || floor(random() * 10)::text;
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCTION TO GENERATE SCHEDULE CODE
-- =====================================================
CREATE OR REPLACE FUNCTION generate_schedule_code(package_name TEXT, departure_date DATE)
RETURNS TEXT AS $$
DECLARE
    prefix TEXT;
    day_num TEXT;
    suffix TEXT;
BEGIN
    -- Ambil 3 huruf pertama dari nama paket
    prefix := upper(substr(regexp_replace(package_name, '[^a-zA-Z]', '', 'g'), 1, 3));
    -- Ambil tanggal
    day_num := lpad(extract(day from departure_date)::text, 2, '0');
    -- Generate suffix random
    suffix := chr(floor(random() * 26 + 65)::int);
    
    RETURN prefix || day_num || suffix;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
-- Policy: Admin can do everything (only create if not exists)
DO $$ 
BEGIN
    -- Users policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'admin_full_access') THEN
        CREATE POLICY admin_full_access ON users FOR ALL TO authenticated
        USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid()::text AND u.is_admin = true));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'user_view_own') THEN
        CREATE POLICY user_view_own ON users FOR SELECT TO authenticated USING (id = auth.uid()::text);
    END IF;

    -- Admin profiles
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'admin_profiles' AND policyname = 'admin_full_access') THEN
        CREATE POLICY admin_full_access ON admin_profiles FOR ALL TO authenticated
        USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid()::text AND u.is_admin = true));
    END IF;

    -- Company settings
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'company_settings' AND policyname = 'admin_full_access') THEN
        CREATE POLICY admin_full_access ON company_settings FOR ALL TO authenticated
        USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid()::text AND u.is_admin = true));
    END IF;

    -- Notification preferences
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notification_preferences' AND policyname = 'admin_full_access') THEN
        CREATE POLICY admin_full_access ON notification_preferences FOR ALL TO authenticated
        USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid()::text AND u.is_admin = true));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notification_preferences' AND policyname = 'user_view_own') THEN
        CREATE POLICY user_view_own ON notification_preferences FOR SELECT TO authenticated USING (user_id = auth.uid()::text);
    END IF;

    -- Tour packages
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tour_packages' AND policyname = 'admin_full_access') THEN
        CREATE POLICY admin_full_access ON tour_packages FOR ALL TO authenticated
        USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid()::text AND u.is_admin = true));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tour_packages' AND policyname = 'public_view_packages') THEN
        CREATE POLICY public_view_packages ON tour_packages FOR SELECT TO anon USING (is_active = true);
    END IF;

    -- Customers
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'customers' AND policyname = 'admin_full_access') THEN
        CREATE POLICY admin_full_access ON customers FOR ALL TO authenticated
        USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid()::text AND u.is_admin = true));
    END IF;

    -- Bookings
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bookings' AND policyname = 'admin_full_access') THEN
        CREATE POLICY admin_full_access ON bookings FOR ALL TO authenticated
        USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid()::text AND u.is_admin = true));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bookings' AND policyname = 'customer_view_own_bookings') THEN
        CREATE POLICY customer_view_own_bookings ON bookings FOR SELECT TO authenticated
        USING (EXISTS (SELECT 1 FROM customers c WHERE c.id = bookings.customer_id AND c.user_id = auth.uid()::text));
    END IF;

    -- Cancellation requests
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'cancellation_requests' AND policyname = 'admin_full_access') THEN
        CREATE POLICY admin_full_access ON cancellation_requests FOR ALL TO authenticated
        USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid()::text AND u.is_admin = true));
    END IF;

    -- Payments
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payments' AND policyname = 'admin_full_access') THEN
        CREATE POLICY admin_full_access ON payments FOR ALL TO authenticated
        USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid()::text AND u.is_admin = true));
    END IF;

    -- Schedules
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'schedules' AND policyname = 'admin_full_access') THEN
        CREATE POLICY admin_full_access ON schedules FOR ALL TO authenticated
        USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid()::text AND u.is_admin = true));
    END IF;

    -- Active sessions
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'active_sessions' AND policyname = 'admin_full_access') THEN
        CREATE POLICY admin_full_access ON active_sessions FOR ALL TO authenticated
        USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid()::text AND u.is_admin = true));
    END IF;

    -- Activity logs
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'activity_logs' AND policyname = 'admin_full_access') THEN
        CREATE POLICY admin_full_access ON activity_logs FOR ALL TO authenticated
        USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid()::text AND u.is_admin = true));
    END IF;
END $$;

-- Enable RLS on all new tables
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cancellation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- VIEWS FOR DASHBOARD STATISTICS
-- =====================================================

-- View: Dashboard statistics
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT
    (SELECT COUNT(*) FROM bookings WHERE date_trunc('month', created_at) = date_trunc('month', CURRENT_DATE)) as booking_bulan_ini,
    (SELECT COALESCE(SUM(total_biaya), 0) FROM bookings WHERE date_trunc('month', created_at) = date_trunc('month', CURRENT_DATE) AND status = 'confirmed') as pendapatan_bulan_ini,
    (SELECT COUNT(*) FROM payments WHERE status = 'pending') as menunggu_verifikasi,
    (SELECT COUNT(*) FROM schedules WHERE tanggal_keberangkatan BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days' AND status = 'aktif') as keberangkatan_minggu_ini;

-- View: Payment status summary
CREATE OR REPLACE VIEW payment_status_summary AS
SELECT
    (SELECT COUNT(*) FROM payments WHERE status = 'verified') as sudah_dibayar,
    (SELECT COUNT(*) FROM payments WHERE status = 'pending') as menunggu_verifikasi;

-- View: Popular packages this month
CREATE OR REPLACE VIEW popular_packages_month AS
SELECT 
    tp.nama_paket,
    tp.lokasi,
    COUNT(b.id) as total_booking
FROM tour_packages tp
LEFT JOIN bookings b ON tp.id = b.package_id 
    AND date_trunc('month', b.created_at) = date_trunc('month', CURRENT_DATE)
GROUP BY tp.id, tp.nama_paket, tp.lokasi
ORDER BY total_booking DESC
LIMIT 5;

-- View: Recent bookings
CREATE OR REPLACE VIEW recent_bookings AS
SELECT 
    b.id,
    b.kode_booking,
    c.nama_pelanggan,
    tp.nama_paket,
    b.jumlah_pax,
    b.status,
    b.created_at
FROM bookings b
JOIN customers c ON b.customer_id = c.id
JOIN tour_packages tp ON b.package_id = tp.id
ORDER BY b.created_at DESC
LIMIT 10;

-- View: Upcoming departures
CREATE OR REPLACE VIEW upcoming_departures AS
SELECT 
    s.id,
    s.kode_jadwal,
    tp.nama_paket,
    s.tanggal_keberangkatan,
    s.waktu_keberangkatan,
    s.nama_instansi,
    b.jumlah_pax
FROM schedules s
JOIN tour_packages tp ON s.package_id = tp.id
LEFT JOIN bookings b ON s.booking_id = b.id
WHERE s.tanggal_keberangkatan >= CURRENT_DATE
    AND s.status = 'aktif'
ORDER BY s.tanggal_keberangkatan, s.waktu_keberangkatan
LIMIT 10;

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Insert sample company settings
INSERT INTO company_settings (nama_perusahaan, alamat_kantor, telepon_kantor, whatsapp_bisnis, email_bisnis)
VALUES (
    'PP Tour Travel',
    'Jl. Raya Kebomas No. 123, Gresik, Jawa Timur',
    '031-1234567',
    '6281234567890',
    'info@pptourtravel.com'
) ON CONFLICT DO NOTHING;

-- Insert sample tour packages
INSERT INTO tour_packages (nama_paket, lokasi, durasi, tipe_paket, harga, minimal_penumpang, nama_daerah, gambar_url) VALUES
('Paket Bali Premium', 'Bali, Indonesia', '4 Hari 2 Malam', 'Premium', 1450000, 50, 'Pulau Bali', '/images/bali-premium.jpg'),
('Paket Bali Ekonomis', 'Bali, Indonesia', '3 Hari 1 Malam', 'Ekonomis', 1000000, 30, 'Pulau Bali', '/images/bali-ekonomis.jpg'),
('Paket Yogyakarta Premium', 'Yogyakarta, Indonesia', '2 Hari 1 Malam', 'Premium', 750000, 40, 'Yogyakarta', '/images/yogyakarta-premium.jpg'),
('Paket Yogyakarta Ekonomis', 'Yogyakarta, Indonesia', '2 Hari 1 Malam', 'Ekonomis', 690000, 25, 'Yogyakarta', '/images/yogyakarta-ekonomis.jpg'),
('Paket Bandung Ekonomis', 'Bandung, Indonesia', '3 Hari 1 Malam', 'Ekonomis', 990000, 35, 'Jawa Barat', '/images/bandung-ekonomis.jpg'),
('Paket Lombok Premium', 'Lombok, Indonesia', '4 Hari 3 Malam', 'Premium', 1200000, 30, 'Nusa Tenggara Barat', '/images/lombok-premium.jpg')
ON CONFLICT DO NOTHING;

-- Insert sample customers
INSERT INTO customers (nama_pelanggan, nama_perusahaan, nomor_telepon, email) VALUES
('Ahmad Ridho Saputra', 'SMA Negeri 1 Gresik', '081234567890', 'ridho@smangresik.sch.id'),
('Siti Nurhaliza', 'SMK Muhammadiyah 2 Surabaya', '082345678901', 'siti@smkmuh2sby.sch.id'),
('Budi Santoso', 'Universitas Airlangga', '083456789012', 'budi@unair.ac.id'),
('Dewi Lestari', 'PT Maju Jaya', '084567890123', 'dewi@majujaya.com'),
('Eko Prasetyo', 'SMAN 3 Surabaya', '085678901234', 'eko@sman3sby.sch.id'),
('Fitri Handayani', 'Universitas Brawijaya', '086789012345', 'fitri@ub.ac.id'),
('Gilang Ramadhan', 'SMK Telkom Malang', '087890123456', 'gilang@smktelkom-mlg.sch.id'),
('Hana Pertiwi', 'SMP Islam Al-Azhar', '088901234567', 'hana@alazhar.sch.id'),
('Indra Gunawan', 'Karang Taruna Gresik', '089012345678', 'indra@ktgresik.org'),
('Jasmine Putri', 'Komunitas Traveler Surabaya', '081123456789', 'jasmine@travelsby.com')
ON CONFLICT DO NOTHING;

-- Insert sample bookings
INSERT INTO bookings (kode_booking, customer_id, package_id, jumlah_pax, total_biaya, tanggal_keberangkatan, status) 
SELECT 
    'BK' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(ROW_NUMBER() OVER ()::TEXT, 4, '0'),
    c.id,
    tp.id,
    jumlah,
    tp.harga * jumlah,
    tanggal,
    status_book
FROM (VALUES
    (1, 1, 45, '2025-01-15'::date, 'confirmed'),
    (2, 2, 28, '2025-01-20'::date, 'pending'),
    (3, 3, 50, '2025-02-10'::date, 'pending'),
    (4, 4, 35, '2025-02-15'::date, 'confirmed'),
    (5, 5, 30, '2025-03-05'::date, 'confirmed'),
    (6, 6, 40, '2025-03-20'::date, 'confirmed'),
    (1, 7, 32, '2025-04-10'::date, 'pending'),
    (2, 8, 55, '2025-04-25'::date, 'pending'),
    (3, 9, 38, '2025-05-15'::date, 'confirmed'),
    (4, 10, 42, '2025-05-30'::date, 'pending')
) AS data(pkg_idx, cust_id, jumlah, tanggal, status_book)
CROSS JOIN LATERAL (SELECT id, harga FROM tour_packages ORDER BY id LIMIT 1 OFFSET (data.pkg_idx - 1)) tp
CROSS JOIN LATERAL (SELECT id FROM customers ORDER BY id LIMIT 1 OFFSET (data.cust_id - 1)) c
ON CONFLICT DO NOTHING;

-- Insert sample payments
INSERT INTO payments (booking_id, jumlah_pembayaran, metode_pembayaran, status, bukti_pembayaran_url)
SELECT 
    b.id,
    CASE 
        WHEN b.status = 'confirmed' THEN b.total_biaya
        ELSE b.total_biaya * 0.3
    END,
    CASE (ROW_NUMBER() OVER () % 3)
        WHEN 0 THEN 'transfer_bank'
        WHEN 1 THEN 'e-wallet'
        ELSE 'cash'
    END,
    CASE 
        WHEN b.status = 'confirmed' THEN 'verified'
        ELSE 'pending'
    END,
    CASE 
        WHEN b.status = 'confirmed' THEN 'https://example.com/bukti/transfer_' || b.kode_booking || '.jpg'
        ELSE NULL
    END
FROM bookings b
ON CONFLICT DO NOTHING;

-- Insert sample schedules
INSERT INTO schedules (kode_jadwal, package_id, booking_id, tanggal_keberangkatan, waktu_keberangkatan, nama_instansi, status)
SELECT 
    'SCH' || TO_CHAR(b.tanggal_keberangkatan, 'YYYYMMDD') || LPAD(ROW_NUMBER() OVER ()::TEXT, 3, '0'),
    b.package_id,
    b.id,
    b.tanggal_keberangkatan,
    CASE (ROW_NUMBER() OVER () % 3)
        WHEN 0 THEN '06:00:00'::TIME
        WHEN 1 THEN '08:00:00'::TIME
        ELSE '10:00:00'::TIME
    END,
    c.nama_perusahaan,
    CASE 
        WHEN b.status = 'confirmed' THEN 'aktif'
        ELSE 'tidak-aktif'
    END
FROM bookings b
JOIN customers c ON b.customer_id = c.id
WHERE b.status IN ('confirmed', 'pending')
ON CONFLICT DO NOTHING;

-- Insert sample cancellation requests
INSERT INTO cancellation_requests (booking_id, alasan, status)
SELECT 
    b.id,
    'Perubahan jadwal mendadak dari instansi',
    'pending'
FROM bookings b
WHERE b.status = 'pending'
LIMIT 2
ON CONFLICT DO NOTHING;

-- Insert sample activity logs (for audit trail)
INSERT INTO activity_logs (user_id, action, table_name, record_id, details)
SELECT 
    u.id,
    'CREATE',
    'bookings',
    b.id::TEXT,
    jsonb_build_object(
        'kode_booking', b.kode_booking,
        'customer_name', c.nama_pelanggan,
        'package_name', tp.nama_paket,
        'total_biaya', b.total_biaya
    )
FROM bookings b
JOIN customers c ON b.customer_id = c.id
JOIN tour_packages tp ON b.package_id = tp.id
CROSS JOIN LATERAL (SELECT id FROM users LIMIT 1) u
ON CONFLICT DO NOTHING;
