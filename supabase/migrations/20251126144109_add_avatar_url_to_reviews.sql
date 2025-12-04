/*
  # Add avatar_url to service_reviews

  1. Changes
    - Add `avatar_url` column to `service_reviews` table
    - Column is optional (nullable) to support both avatar images and initials

  2. Notes
    - Existing reviews will have NULL avatar_url and will show initials
    - New reviews can optionally include avatar_url for profile pictures
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'service_reviews' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE service_reviews ADD COLUMN avatar_url text;
  END IF;
END $$;