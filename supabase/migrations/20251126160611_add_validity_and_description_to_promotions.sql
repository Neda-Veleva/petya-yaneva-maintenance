/*
  # Add Validity Dates and Extended Description to Promotions

  1. Changes
    - Add `valid_from` (date) - Start date of promotion validity
    - Add `valid_until` (date) - End date of promotion validity
    - Add `long_description` (text) - Extended description with more details about the promotion
    - Add `terms` (text) - Terms and conditions for the promotion

  2. Notes
    - Existing promotions will have NULL values for new fields
    - Future promotions should populate these fields
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'promotions' AND column_name = 'valid_from'
  ) THEN
    ALTER TABLE promotions ADD COLUMN valid_from date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'promotions' AND column_name = 'valid_until'
  ) THEN
    ALTER TABLE promotions ADD COLUMN valid_until date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'promotions' AND column_name = 'long_description'
  ) THEN
    ALTER TABLE promotions ADD COLUMN long_description text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'promotions' AND column_name = 'terms'
  ) THEN
    ALTER TABLE promotions ADD COLUMN terms text;
  END IF;
END $$;
