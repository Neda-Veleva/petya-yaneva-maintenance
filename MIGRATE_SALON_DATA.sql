/*
  # Migrate Salon Data from team_members to salon_info

  IMPORTANT: Run this SQL in your Supabase Dashboard SQL Editor

  This script will:
  1. Copy salon entries (type='salon') from team_members to salon_info
  2. Copy related certificates from team_member_certificates to salon_certificates
  3. Delete the old salon entries from team_members

  Make sure you have already run the SALON_MIGRATION.sql first!
*/

-- Step 1: Migrate salon data from team_members to salon_info
INSERT INTO salon_info (
  slug,
  title,
  title_gold,
  badge,
  description,
  bio,
  image_url,
  thumbnail_url,
  stat_value,
  stat_label,
  location,
  is_active,
  created_at,
  updated_at
)
SELECT
  slug,
  COALESCE(title, 'Салон') as title,
  title_gold,
  COALESCE(badge, 'Луксозна грижа за красота') as badge,
  COALESCE(description, 'Модерно пространство, създадено за вашата красота и комфорт') as description,
  COALESCE(bio, '<p>Добре дошли в нашия салон!</p>') as bio,
  image_url,
  thumbnail_url,
  stat_value,
  stat_label,
  location,
  is_active,
  created_at,
  now() as updated_at
FROM team_members
WHERE type = 'salon'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  title_gold = EXCLUDED.title_gold,
  badge = EXCLUDED.badge,
  description = EXCLUDED.description,
  bio = EXCLUDED.bio,
  image_url = EXCLUDED.image_url,
  thumbnail_url = EXCLUDED.thumbnail_url,
  stat_value = EXCLUDED.stat_value,
  stat_label = EXCLUDED.stat_label,
  location = EXCLUDED.location,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- Step 2: Migrate certificates from team_member_certificates to salon_certificates
-- First, we need to get the mapping between old team_member IDs and new salon IDs
INSERT INTO salon_certificates (
  salon_id,
  title,
  issuer,
  year,
  image_url,
  display_order,
  created_at
)
SELECT
  si.id as salon_id,
  tmc.title,
  tmc.issuer,
  tmc.year,
  tmc.image_url,
  tmc.display_order,
  tmc.created_at
FROM team_member_certificates tmc
JOIN team_members tm ON tm.id = tmc.team_member_id
JOIN salon_info si ON si.slug = tm.slug
WHERE tm.type = 'salon';

-- Step 3: Delete the old salon entries from team_members
-- This will cascade delete related certificates and gallery items
DELETE FROM team_members WHERE type = 'salon';

-- Verification: Check the migrated data
SELECT 'Migrated Salons:' as info, count(*) as count FROM salon_info;
SELECT 'Migrated Certificates:' as info, count(*) as count FROM salon_certificates;
SELECT 'Remaining team_members with type=salon:' as info, count(*) as count FROM team_members WHERE type = 'salon';
