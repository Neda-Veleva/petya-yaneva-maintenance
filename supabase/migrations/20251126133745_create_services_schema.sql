/*
  # Create Services Schema

  1. New Tables
    - `services`
      - `id` (uuid, primary key)
      - `category_id` (uuid, references service_categories) - Category this service belongs to
      - `slug` (text, unique) - URL-friendly identifier
      - `name` (text) - Service name
      - `short_description` (text) - Brief description for cards/listings
      - `full_description` (text) - Detailed description for service page
      - `duration` (text) - Duration (e.g., "1 ч. 30 мин.")
      - `price` (text) - Price or price range
      - `image_url` (text) - Main image for the service
      - `gallery_images` (text[]) - Array of additional images
      - `benefits` (text[]) - Array of service benefits
      - `process_steps` (text[]) - Array of process steps
      - `aftercare_tips` (text[]) - Array of aftercare tips
      - `is_featured` (boolean, default false) - Featured service flag
      - `order_position` (integer, default 0) - For ordering in listings
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on services table
    - Add policies for public read access
    - Authenticated users can manage services

  3. Indexes
    - Index on category_id for filtering
    - Index on slug for lookups
    - Index on order_position for sorting

  4. Notes
    - This schema supports rich service detail pages
    - Gallery images for showcasing work
    - Benefits to highlight service advantages
    - Process steps to explain the procedure
    - Aftercare tips to help clients maintain results
*/

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