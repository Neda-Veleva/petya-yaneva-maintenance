/*
  # Add slug field to promotions

  1. Changes
    - Add `slug` (text) - URL-friendly identifier for the promotion
    - Make it unique to ensure each promotion has a unique URL
    - Add index for faster lookups

  2. Notes
    - Existing promotions will have NULL slug initially
    - We'll update them with generated slugs separately
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'promotions' AND column_name = 'slug'
  ) THEN
    ALTER TABLE promotions ADD COLUMN slug text UNIQUE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_promotions_slug ON promotions(slug);
