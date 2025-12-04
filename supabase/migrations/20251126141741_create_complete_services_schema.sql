/*
  # Complete Services Database Schema

  1. New Tables
    - `service_categories`
      - `id` (uuid, primary key)
      - `slug` (text, unique) - URL-friendly identifier
      - `name` (text) - Category name in Bulgarian
      - `title` (text) - Display title
      - `description` (text) - Category description
      - `image_url` (text) - Hero image for category
      - `order_position` (integer) - For ordering
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `services`
      - `id` (uuid, primary key)
      - `category_id` (uuid, references service_categories)
      - `slug` (text, unique) - URL-friendly identifier
      - `name` (text) - Service name
      - `short_description` (text) - Brief description
      - `full_description` (text) - Detailed description for service page
      - `duration` (text) - Duration (e.g., "1 ч. 30 мин.")
      - `price` (text) - Price or price range
      - `image_url` (text) - Main image
      - `gallery_images` (text[]) - Additional images
      - `benefits` (text[]) - Service benefits
      - `process_steps` (text[]) - Process steps
      - `aftercare_tips` (text[]) - Aftercare tips
      - `is_featured` (boolean) - Featured flag
      - `order_position` (integer) - For ordering
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `service_reviews`
      - `id` (uuid, primary key)
      - `service_id` (uuid, references services)
      - `client_name` (text) - Client name
      - `rating` (integer) - Rating 1-5
      - `review_text` (text) - Review content
      - `review_date` (date) - Review date
      - `is_featured` (boolean) - Featured flag
      - `order_position` (integer) - For ordering
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public read access for all
    - Authenticated users can manage content

  3. Indexes
    - Indexes on foreign keys
    - Indexes on slugs for lookups
    - Indexes on order_position for sorting
*/

-- Service Categories Table
CREATE TABLE IF NOT EXISTS service_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  order_position integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_service_categories_slug ON service_categories(slug);
CREATE INDEX IF NOT EXISTS idx_service_categories_order ON service_categories(order_position);

ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;

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

-- Services Table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES service_categories(id) ON DELETE CASCADE NOT NULL,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  short_description text NOT NULL,
  full_description text,
  duration text NOT NULL,
  price text NOT NULL,
  image_url text NOT NULL,
  gallery_images text[] DEFAULT '{}',
  benefits text[] DEFAULT '{}',
  process_steps text[] DEFAULT '{}',
  aftercare_tips text[] DEFAULT '{}',
  is_featured boolean DEFAULT false,
  order_position integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_services_category ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_order ON services(order_position);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view services"
  ON services FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert services"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update services"
  ON services FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete services"
  ON services FOR DELETE
  TO authenticated
  USING (true);

-- Service Reviews Table
CREATE TABLE IF NOT EXISTS service_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  client_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text NOT NULL,
  review_date date DEFAULT CURRENT_DATE,
  is_featured boolean DEFAULT false,
  order_position integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_service_reviews_service ON service_reviews(service_id);
CREATE INDEX IF NOT EXISTS idx_service_reviews_order ON service_reviews(order_position);

ALTER TABLE service_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view service reviews"
  ON service_reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert reviews"
  ON service_reviews FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update reviews"
  ON service_reviews FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete reviews"
  ON service_reviews FOR DELETE
  TO authenticated
  USING (true);