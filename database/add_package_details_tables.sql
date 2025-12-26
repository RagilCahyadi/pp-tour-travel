-- =====================================================
-- MIGRATION: ADD TOUR PACKAGE DETAILS TABLES
-- =====================================================
-- Description: Adds tables for destinations, gallery, and facilities
-- Linked to: tour_packages table

-- 1. PACKAGE DESTINATIONS
CREATE TABLE IF NOT EXISTS package_destinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID NOT NULL REFERENCES tour_packages(id) ON DELETE CASCADE,
  nama_destinasi TEXT NOT NULL,
  urutan INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. PACKAGE GALLERY
CREATE TABLE IF NOT EXISTS package_gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID NOT NULL REFERENCES tour_packages(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  urutan INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. PACKAGE FACILITIES
CREATE TABLE IF NOT EXISTS package_facilities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID NOT NULL REFERENCES tour_packages(id) ON DELETE CASCADE,
  nama_fasilitas TEXT NOT NULL,
  -- Icon name from Lucide React (e.g., 'Bus', 'Hotel', 'Utensils')
  icon_name TEXT NOT NULL, 
  urutan INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_package_destinations_pkg ON package_destinations(package_id);
CREATE INDEX IF NOT EXISTS idx_package_gallery_pkg ON package_gallery(package_id);
CREATE INDEX IF NOT EXISTS idx_package_facilities_pkg ON package_facilities(package_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE package_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_facilities ENABLE ROW LEVEL SECURITY;

-- Policies for package_destinations
CREATE POLICY "Public view destinations for active packages" ON package_destinations
  FOR SELECT TO anon
  USING (EXISTS (
    SELECT 1 FROM tour_packages tp 
    WHERE tp.id = package_destinations.package_id AND tp.is_active = true
  ));

CREATE POLICY "Admin full access destinations" ON package_destinations
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid()::text AND u.is_admin = true));

-- Policies for package_gallery
CREATE POLICY "Public view gallery for active packages" ON package_gallery
  FOR SELECT TO anon
  USING (EXISTS (
    SELECT 1 FROM tour_packages tp 
    WHERE tp.id = package_gallery.package_id AND tp.is_active = true
  ));

CREATE POLICY "Admin full access gallery" ON package_gallery
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid()::text AND u.is_admin = true));

-- Policies for package_facilities
CREATE POLICY "Public view facilities for active packages" ON package_facilities
  FOR SELECT TO anon
  USING (EXISTS (
    SELECT 1 FROM tour_packages tp 
    WHERE tp.id = package_facilities.package_id AND tp.is_active = true
  ));

CREATE POLICY "Admin full access facilities" ON package_facilities
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid()::text AND u.is_admin = true));

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Verify function exists (from schema.sql)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    END IF;
END $$;

-- Triggers
DROP TRIGGER IF EXISTS update_package_destinations_updated_at ON package_destinations;
CREATE TRIGGER update_package_destinations_updated_at
    BEFORE UPDATE ON package_destinations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_package_gallery_updated_at ON package_gallery;
CREATE TRIGGER update_package_gallery_updated_at
    BEFORE UPDATE ON package_gallery
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_package_facilities_updated_at ON package_facilities;
CREATE TRIGGER update_package_facilities_updated_at
    BEFORE UPDATE ON package_facilities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
