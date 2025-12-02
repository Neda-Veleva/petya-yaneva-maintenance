/*
  # Fix Storage Policies for Media Bucket

  1. Changes
    - Ensure media bucket exists with correct configuration
    - Set up proper RLS policies for storage
    - Allow public read access
    - Allow authenticated admins to upload/manage files

  2. Security
    - Public can view all media
    - Only admins can upload, update, delete
*/

-- Ensure the bucket exists (if not created)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  52428800,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete media" ON storage.objects;

-- Allow anyone to view media files
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

-- Allow authenticated admins to upload
CREATE POLICY "Admins can upload media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'media' AND
  is_admin()
);

-- Allow authenticated admins to update
CREATE POLICY "Admins can update media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media' AND is_admin())
WITH CHECK (bucket_id = 'media' AND is_admin());

-- Allow authenticated admins to delete
CREATE POLICY "Admins can delete media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media' AND is_admin());