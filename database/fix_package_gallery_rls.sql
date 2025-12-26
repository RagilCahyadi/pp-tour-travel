-- =====================================================
-- FIX: Update RLS Policies for Package Gallery
-- =====================================================
-- Description: Simplify RLS policies to allow authenticated users
-- to manage gallery images without strict admin check

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Admin full access gallery" ON package_gallery;

-- Create new simplified policy for authenticated users
-- This allows any authenticated user to manage gallery images
CREATE POLICY "Authenticated users can manage gallery" ON package_gallery
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Keep the public read policy as-is
-- (already exists: "Public view gallery for active packages")
