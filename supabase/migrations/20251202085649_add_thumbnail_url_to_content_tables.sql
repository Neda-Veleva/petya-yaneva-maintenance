/*
  # Add thumbnail_url to content tables

  1. Changes
    - Add `thumbnail_url` column to `services` table
    - Add `thumbnail_url` column to `blog_posts` table
    - Add `thumbnail_url` column to `promotions` table
    - Add `thumbnail_url` column to `top_services` table
    - Add `thumbnail_url` column to `service_categories` table
    - Add `thumbnail_url` column to `team_members` table

  2. Notes
    - All thumbnail_url fields are nullable and default to empty string
    - Thumbnails will be used in admin cards and frontend listings
    - When thumbnail_url is empty, the main image_url will be used as fallback
*/

-- Add thumbnail_url to services
ALTER TABLE services ADD COLUMN IF NOT EXISTS thumbnail_url text DEFAULT '';

-- Add thumbnail_url to blog_posts
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS thumbnail_url text DEFAULT '';

-- Add thumbnail_url to promotions
ALTER TABLE promotions ADD COLUMN IF NOT EXISTS thumbnail_url text DEFAULT '';

-- Add thumbnail_url to top_services
ALTER TABLE top_services ADD COLUMN IF NOT EXISTS thumbnail_url text DEFAULT '';

-- Add thumbnail_url to service_categories
ALTER TABLE service_categories ADD COLUMN IF NOT EXISTS thumbnail_url text DEFAULT '';

-- Add thumbnail_url to team_members
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS thumbnail_url text DEFAULT '';
