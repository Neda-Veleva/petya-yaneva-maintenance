/*
  # Create Salon Info Schema

  IMPORTANT: This SQL needs to be executed in your Supabase database.
  You can run it via the Supabase Dashboard SQL Editor.

  ## Overview
  This migration creates tables for managing salon information separately from team members.
  The salon will have its own page and will be shown in the home page hero slider as the last slide.

  ## New Tables
  - salon_info: Main salon information
  - salon_certificates: Salon certificates and achievements
*/

CREATE TABLE IF NOT EXISTS salon_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  title_gold text,
  badge text NOT NULL,
  description text NOT NULL,
  bio text NOT NULL,
  image_url text NOT NULL,
  thumbnail_url text,
  stat_value text NOT NULL,
  stat_label text NOT NULL,
  location text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS salon_certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id uuid NOT NULL REFERENCES salon_info(id) ON DELETE CASCADE,
  title text NOT NULL,
  issuer text NOT NULL,
  year text NOT NULL,
  image_url text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE salon_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE salon_certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active salon"
  ON salon_info FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all salon entries"
  ON salon_info FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert salon"
  ON salon_info FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update salon"
  ON salon_info FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete salon"
  ON salon_info FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view salon certificates"
  ON salon_certificates FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM salon_info
      WHERE salon_info.id = salon_certificates.salon_id
      AND salon_info.is_active = true
    )
  );

CREATE POLICY "Authenticated users can view all certificates"
  ON salon_certificates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert certificates"
  ON salon_certificates FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update certificates"
  ON salon_certificates FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete certificates"
  ON salon_certificates FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_salon_info_slug ON salon_info(slug);
CREATE INDEX IF NOT EXISTS idx_salon_info_active ON salon_info(is_active);
CREATE INDEX IF NOT EXISTS idx_salon_certificates_salon ON salon_certificates(salon_id);

INSERT INTO salon_info (slug, title, title_gold, badge, description, bio, image_url, stat_value, stat_label, location) VALUES
(
  'salon-livon',
  'Салон',
  'LIVON',
  'Луксозна грижа за красота',
  'Модерно пространство, създадено за вашата красота и комфорт',
  '<p>Добре дошли в салон LIVON - място, където мечтите за перфектни мигли и вежди стават реалност. Нашият салон е създаден с мисъл за вашия комфорт и релаксация, предлагайки модерна атмосфера и професионално обслужване.</p>',
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  '100%',
  'Качествени продукти',
  'София, България'
);
