/*
  # Create Service Reviews Schema

  1. New Tables
    - `service_reviews`
      - `id` (uuid, primary key)
      - `service_id` (uuid, references services) - Service this review is for
      - `client_name` (text) - Name of the client
      - `rating` (integer) - Rating from 1-5
      - `review_text` (text) - Review content
      - `review_date` (date) - Date of the review
      - `is_featured` (boolean, default false) - Featured review flag
      - `order_position` (integer, default 0) - For ordering in display
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on service_reviews table
    - Add policies for public read access
    - Authenticated users can manage reviews

  3. Indexes
    - Index on service_id for filtering
    - Index on order_position for sorting

  4. Notes
    - Reviews are linked to specific services
    - Rating is 1-5 stars
    - Can be featured for highlighting
    - Order position for manual sorting
*/

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