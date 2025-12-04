/*
  # Create Page Types Schema

  1. New Tables
    - `page_types`
      - `id` (uuid, primary key)
      - `name` (text, unique) - Name of page type (e.g., "Home", "Gallery", "Contact")
      - `slug` (text, unique) - URL-friendly identifier
      - `description` (text) - Description of what this page type is for
      - `template` (text) - Template identifier for rendering
      - `is_active` (boolean) - Whether this page type is currently active
      - `metadata` (jsonb) - Flexible metadata for custom fields
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `page_types` table
    - Public can read active page types
    - Admins can manage all page types

  3. Indexes
    - Index on slug for fast lookups
*/

CREATE TABLE IF NOT EXISTS page_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  template text DEFAULT 'default',
  is_active boolean DEFAULT true,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE page_types ENABLE ROW LEVEL SECURITY;

-- Public can read active page types
CREATE POLICY "Anyone can view active page types"
  ON page_types
  FOR SELECT
  USING (is_active = true);

-- Admins can view all page types
CREATE POLICY "Admins can view all page types"
  ON page_types
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admins can insert page types
CREATE POLICY "Admins can insert page types"
  ON page_types
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Admins can update page types
CREATE POLICY "Admins can update page types"
  ON page_types
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admins can delete page types
CREATE POLICY "Admins can delete page types"
  ON page_types
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- Create index on slug
CREATE INDEX IF NOT EXISTS idx_page_types_slug ON page_types(slug);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_page_types_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER page_types_updated_at
  BEFORE UPDATE ON page_types
  FOR EACH ROW
  EXECUTE FUNCTION update_page_types_updated_at();

-- Insert some default page types
INSERT INTO page_types (name, slug, description, template, is_active) VALUES
  ('Home Page', 'home', 'Main landing page with hero, services overview, and call-to-action', 'home', true),
  ('Gallery', 'gallery', 'Image gallery showcasing work and projects', 'gallery', true),
  ('Services', 'services', 'List of all available services', 'services-list', true),
  ('Service Category', 'service-category', 'Services filtered by category', 'service-category', true),
  ('Service Detail', 'service-detail', 'Detailed view of a single service', 'service-detail', true),
  ('Promotions', 'promotions', 'Current promotional offers and discounts', 'promotions', true),
  ('Blog List', 'blog-list', 'List of all blog posts', 'blog-list', true),
  ('Blog Post', 'blog-post', 'Individual blog post detail page', 'blog-post', true),
  ('Team Member', 'team-member', 'Individual team member profile page', 'team-member', true),
  ('Contact', 'contact', 'Contact form and information', 'contact', false),
  ('About', 'about', 'About the business and team', 'about', false)
ON CONFLICT (slug) DO NOTHING;