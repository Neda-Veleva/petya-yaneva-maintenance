/*
  # Fix Blog Posts RLS Policy

  1. Changes
    - Drop existing public read policy
    - Create new policy that allows both anonymous (anon) and authenticated users to read published posts
    
  2. Security
    - Maintains restriction to only published posts
    - Allows public read access without authentication
*/

DROP POLICY IF EXISTS "Anyone can view published blog posts" ON blog_posts;

CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts FOR SELECT
  TO anon, authenticated
  USING (is_published = true);
