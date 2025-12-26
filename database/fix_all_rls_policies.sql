-- =====================================================
-- FIX: Enforce Admin Access for Package Hierarchy
-- =====================================================

-- 1. Package Gallery
DROP POLICY IF EXISTS "Admin full access gallery" ON package_gallery;
DROP POLICY IF EXISTS "Authenticated users can manage gallery" ON package_gallery;
DROP POLICY IF EXISTS "Public view gallery for active packages" ON package_gallery; -- Re-creating to be sure

CREATE POLICY "Admin users can manage gallery" ON package_gallery
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid()::text AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid()::text AND is_admin = true
    )
  );

CREATE POLICY "Public view gallery for active packages" ON package_gallery
  FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tour_packages tp
      WHERE tp.id = package_gallery.package_id AND tp.is_active = true
    )
  );

-- 2. Package Destinations
DROP POLICY IF EXISTS "Admin full access destinations" ON package_destinations;
DROP POLICY IF EXISTS "Authenticated users can manage destinations" ON package_destinations;
DROP POLICY IF EXISTS "Public view destinations for active packages" ON package_destinations;

CREATE POLICY "Admin users can manage destinations" ON package_destinations
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid()::text AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid()::text AND is_admin = true
    )
  );

CREATE POLICY "Public view destinations for active packages" ON package_destinations
  FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tour_packages tp
      WHERE tp.id = package_destinations.package_id AND tp.is_active = true
    )
  );

-- 3. Package Facilities
DROP POLICY IF EXISTS "Admin full access facilities" ON package_facilities;
DROP POLICY IF EXISTS "Authenticated users can manage facilities" ON package_facilities;
DROP POLICY IF EXISTS "Public view facilities for active packages" ON package_facilities;

CREATE POLICY "Admin users can manage facilities" ON package_facilities
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid()::text AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid()::text AND is_admin = true
    )
  );

CREATE POLICY "Public view facilities for active packages" ON package_facilities
  FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tour_packages tp
      WHERE tp.id = package_facilities.package_id AND tp.is_active = true
    )
  );
