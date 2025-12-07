-- Storage Policies for Development
-- Run these in Supabase SQL Editor to allow image uploads

-- First, ensure the bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('tour-packages', 'tour-packages', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policy 1: Allow anyone to upload images (for development)
CREATE POLICY "Allow public uploads for development"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'tour-packages'
);

-- Policy 2: Allow anyone to read images
CREATE POLICY "Allow public access to tour package images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'tour-packages');

-- Policy 3: Allow anyone to delete images (for development)
CREATE POLICY "Allow public deletes for development"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'tour-packages');

-- Policy 4: Allow anyone to update images (for development)
CREATE POLICY "Allow public updates for development"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'tour-packages')
WITH CHECK (bucket_id = 'tour-packages');
