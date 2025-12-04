/*
  # Create Media Library Schema

  1. New Tables
    - `media_library`
      - `id` (uuid, primary key)
      - `type` (text) - 'image' or 'video'
      - `title` (text) - Name/title of the media
      - `url` (text) - Full URL to the media (storage path for images, external URL for videos)
      - `thumbnail_url` (text) - Thumbnail image URL
      - `file_name` (text) - Original file name (for images)
      - `file_size` (bigint) - File size in bytes (for images)
      - `mime_type` (text) - MIME type (for images)
      - `width` (int) - Image/video width
      - `height` (int) - Image/video height
      - `alt_text` (text) - Alternative text for accessibility
      - `metadata` (jsonb) - Additional metadata
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `media_library` table
    - Public can read all media
    - Admins can manage all media

  3. Indexes
    - Index on type for filtering
    - Index on created_at for sorting
*/

CREATE TABLE IF NOT EXISTS media_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('image', 'video')),
  title text NOT NULL,
  url text NOT NULL,
  thumbnail_url text DEFAULT '',
  file_name text DEFAULT '',
  file_size bigint DEFAULT 0,
  mime_type text DEFAULT '',
  width int DEFAULT 0,
  height int DEFAULT 0,
  alt_text text DEFAULT '',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;

-- Public can read all media
CREATE POLICY "Anyone can view media"
  ON media_library
  FOR SELECT
  USING (true);

-- Admins can view all media
CREATE POLICY "Admins can view all media"
  ON media_library
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admins can insert media
CREATE POLICY "Admins can insert media"
  ON media_library
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Admins can update media
CREATE POLICY "Admins can update media"
  ON media_library
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admins can delete media
CREATE POLICY "Admins can delete media"
  ON media_library
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_media_library_type ON media_library(type);
CREATE INDEX IF NOT EXISTS idx_media_library_created_at ON media_library(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_media_library_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER media_library_updated_at
  BEFORE UPDATE ON media_library
  FOR EACH ROW
  EXECUTE FUNCTION update_media_library_updated_at();