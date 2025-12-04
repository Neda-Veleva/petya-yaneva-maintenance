/*
  # Create Top Services Schema

  1. New Tables
    - `service_categories`
      - `id` (uuid, primary key)
      - `name` (text) - Category name (e.g., "Маникюр", "Педикюр")
      - `slug` (text, unique) - URL-friendly identifier
      - `title` (text) - Page title for the category
      - `description` (text) - Brief description/subtitle for intro slide
      - `image_url` (text) - Background image for intro slide
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `top_services`
      - `id` (uuid, primary key)
      - `category_id` (uuid, nullable) - NULL means it's for home page
      - `name` (text) - Service name
      - `description` (text) - Brief description
      - `price` (text, nullable) - Price or price range
      - `image_url` (text) - Background image for the slide
      - `cta_text` (text, default 'Запази час') - Call-to-action button text
      - `order_position` (integer, default 0) - For ordering slides
      - `is_active` (boolean, default true) - To enable/disable services
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access (authenticated users can manage)
    
  3. Indexes
    - Index on category_id for top_services
    - Index on slug for service_categories
    - Index on order_position for top_services
*/

CREATE TABLE IF NOT EXISTS service_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS top_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES service_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price text,
  image_url text NOT NULL,
  cta_text text DEFAULT 'Запази час',
  order_position integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_top_services_category ON top_services(category_id);
CREATE INDEX IF NOT EXISTS idx_top_services_order ON top_services(order_position);
CREATE INDEX IF NOT EXISTS idx_service_categories_slug ON service_categories(slug);

ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE top_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view service categories"
  ON service_categories FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert service categories"
  ON service_categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update service categories"
  ON service_categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete service categories"
  ON service_categories FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view active top services"
  ON top_services FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can insert top services"
  ON top_services FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update top services"
  ON top_services FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete top services"
  ON top_services FOR DELETE
  TO authenticated
  USING (true);