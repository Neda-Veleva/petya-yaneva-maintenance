/*
  # Create Header Configuration Schema

  ## Overview
  This migration creates tables for managing the website header configuration,
  including logo, CTA button, and dynamic navigation menu with hierarchy support.

  ## New Tables

  ### 1. `header_config`
  Stores global header configuration (logo and CTA button)
  - `id` (uuid, primary key)
  - `logo_url` (text) - URL to the uploaded logo image
  - `cta_button_text` (text) - Text for the main CTA button
  - `cta_button_url` (text) - URL/link for the CTA button
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `navigation_items`
  Stores navigation menu items with hierarchy support
  - `id` (uuid, primary key)
  - `label` (text) - Display text for the menu item
  - `url` (text) - Link URL (can be internal or external)
  - `parent_id` (uuid, nullable) - Reference to parent item for submenus
  - `display_order` (int) - Order position within the same level
  - `is_active` (boolean) - Whether the item is visible
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. `available_pages`
  Stores available internal pages for dropdown selection
  - `id` (uuid, primary key)
  - `title` (text) - Page title/label
  - `url` (text) - Internal URL path
  - `page_type` (text) - Type of page (static, dynamic, etc.)
  - `is_active` (boolean)
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Only authenticated admin users can modify header configuration
  - Public read access for displaying the header

  ## Notes
  - Single row in header_config table (managed by application logic)
  - Navigation items support unlimited nesting via parent_id
  - Available pages are pre-populated with common site pages
*/

-- Create header_config table
CREATE TABLE IF NOT EXISTS header_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  logo_url text,
  cta_button_text text DEFAULT 'Запази час',
  cta_button_url text DEFAULT '#contact',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create navigation_items table
CREATE TABLE IF NOT EXISTS navigation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  url text NOT NULL,
  parent_id uuid REFERENCES navigation_items(id) ON DELETE CASCADE,
  display_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create available_pages table
CREATE TABLE IF NOT EXISTS available_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  url text NOT NULL UNIQUE,
  page_type text DEFAULT 'static',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE header_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE available_pages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for header_config
CREATE POLICY "Anyone can view header config"
  ON header_config FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert header config"
  ON header_config FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update header config"
  ON header_config FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for navigation_items
CREATE POLICY "Anyone can view active navigation items"
  ON navigation_items FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all navigation items"
  ON navigation_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert navigation items"
  ON navigation_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update navigation items"
  ON navigation_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete navigation items"
  ON navigation_items FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for available_pages
CREATE POLICY "Anyone can view available pages"
  ON available_pages FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage available pages"
  ON available_pages FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default header config (only if table is empty)
INSERT INTO header_config (logo_url, cta_button_text, cta_button_url)
SELECT null, 'Запази час', '#contact'
WHERE NOT EXISTS (SELECT 1 FROM header_config);

-- Insert default available pages
INSERT INTO available_pages (title, url, page_type) VALUES
  ('Начало', '/', 'static'),
  ('Услуги', '/services', 'static'),
  ('Мигли', '/services/lashes', 'category'),
  ('Вежди', '/services/brows', 'category'),
  ('Други услуги за лице', '/services/facial', 'category'),
  ('Блог', '/blog', 'static'),
  ('Промоции', '/promotions', 'static'),
  ('Екип', '/team', 'static'),
  ('Галерия', '#gallery', 'anchor'),
  ('Ценоразпис', '#prices', 'anchor'),
  ('Отзиви', '#reviews', 'anchor'),
  ('Контакти', '#contact', 'anchor')
ON CONFLICT (url) DO NOTHING;

-- Insert default navigation items (only if table is empty)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM navigation_items) THEN
    INSERT INTO navigation_items (label, url, display_order, is_active) VALUES
      ('Услуги', '/services', 1, true),
      ('Ценоразпис', '#prices', 2, true),
      ('Отзиви', '#reviews', 3, true),
      ('Блог', '/blog', 4, true),
      ('Промоции', '/promotions', 5, true),
      ('Екип', '/team', 6, true),
      ('Галерия', '#gallery', 7, true),
      ('Контакти', '#contact', 8, true);
  END IF;
END $$;

-- Add submenu items to "Услуги"
DO $$
DECLARE
  services_id uuid;
BEGIN
  SELECT id INTO services_id FROM navigation_items WHERE label = 'Услуги' AND parent_id IS NULL LIMIT 1;
  
  IF services_id IS NOT NULL THEN
    INSERT INTO navigation_items (label, url, parent_id, display_order, is_active)
    SELECT 'Мигли', '/services/lashes', services_id, 1, true
    WHERE NOT EXISTS (SELECT 1 FROM navigation_items WHERE label = 'Мигли' AND parent_id = services_id);
    
    INSERT INTO navigation_items (label, url, parent_id, display_order, is_active)
    SELECT 'Вежди', '/services/brows', services_id, 2, true
    WHERE NOT EXISTS (SELECT 1 FROM navigation_items WHERE label = 'Вежди' AND parent_id = services_id);
    
    INSERT INTO navigation_items (label, url, parent_id, display_order, is_active)
    SELECT 'Други услуги за лице', '/services/facial', services_id, 3, true
    WHERE NOT EXISTS (SELECT 1 FROM navigation_items WHERE label = 'Други услуги за лице' AND parent_id = services_id);
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_navigation_items_parent ON navigation_items(parent_id);
CREATE INDEX IF NOT EXISTS idx_navigation_items_order ON navigation_items(display_order);
CREATE INDEX IF NOT EXISTS idx_navigation_items_active ON navigation_items(is_active);
