/*
  # Add author_name column to blog_posts

  1. Changes
    - Add `author_name` column to `blog_posts` table (nullable text field)
    - This column will store the display name of the blog post author
  
  2. Notes
    - The column is nullable to avoid breaking existing records
    - The existing `author` column remains unchanged
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'author_name'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN author_name text;
  END IF;
END $$;