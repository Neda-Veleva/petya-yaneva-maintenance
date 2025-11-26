/*
  # Create Promotions Schema

  1. New Tables
    - `promotions`
      - `id` (uuid, primary key)
      - `service_name` (text) - Name of the service being promoted
      - `old_price` (text) - Original price display
      - `new_price` (text) - Promotional price display
      - `description` (text) - Promotion description/terms
      - `image_url` (text) - Hero image for the promotion
      - `is_active` (boolean) - Whether promotion is currently active
      - `order_position` (integer) - Display order
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `promotions` table
    - Add policy for public read access (promotions are public content)
*/

CREATE TABLE IF NOT EXISTS promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name text NOT NULL,
  old_price text NOT NULL,
  new_price text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  is_active boolean DEFAULT true,
  order_position integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active promotions"
  ON promotions FOR SELECT
  TO public
  USING (is_active = true);

CREATE INDEX IF NOT EXISTS idx_promotions_active_order ON promotions(is_active, order_position);
