# 🚨 QUICK FIX: Data Tidak Muncul dari Supabase

## Problem
Console log menunjukkan: `Bookings fetched: 0 records`
Tapi di Supabase Table Editor ada data.

## Root Cause
**Row Level Security (RLS)** memblokir akses data.

## Solution (2 Menit)

### Step 1: Buka Supabase SQL Editor
https://app.supabase.com → Your Project → SQL Editor

### Step 2: Copy-Paste SQL Ini
```sql
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE tour_packages DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE schedules DISABLE ROW LEVEL SECURITY;
```

### Step 3: Click "Run"

### Step 4: Refresh Browser
Ctrl+Shift+R atau Cmd+Shift+R

## ✅ Done!
Data sekarang harus muncul di halaman admin/pemesanan.

---

## Untuk Production
Jangan lupa enable RLS kembali dan buat policies:
```bash
# Jalankan file ini di production:
database/enable-rls-for-production.sql
```
