-- =====================================================
-- CREATE ADMIN PROFILES TABLE
-- =====================================================
-- Run this SQL in Supabase SQL Editor

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create admin_profiles table
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

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_profiles_user_id ON admin_profiles(user_id);

-- Enable RLS
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow authenticated users to read their own profile
CREATE POLICY "Users can view own profile"
  ON admin_profiles FOR SELECT
  USING (auth.uid()::text = user_id);

-- Allow authenticated users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON admin_profiles FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Allow authenticated users to update their own profile
CREATE POLICY "Users can update own profile"
  ON admin_profiles FOR UPDATE
  USING (auth.uid()::text = user_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_admin_profiles_updated_at BEFORE UPDATE ON admin_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
