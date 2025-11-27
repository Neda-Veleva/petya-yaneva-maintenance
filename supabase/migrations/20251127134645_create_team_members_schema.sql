/*
  # Create team members schema

  1. New Tables
    - `team_members`
      - `id` (uuid, primary key)
      - `slug` (text, unique) - URL-friendly identifier (e.g., 'petya-yaneva', 'salon-livon')
      - `type` (text) - 'person' or 'salon'
      - `first_name` (text, nullable) - For people only
      - `last_name` (text, nullable) - For people only
      - `title` (text, nullable) - For salon only
      - `title_gold` (text, nullable) - For salon only
      - `badge` (text) - Professional title or designation
      - `description` (text) - Short description
      - `bio` (text) - Full biography/detailed information
      - `image_url` (text) - Main profile/salon image
      - `stat_value` (text) - Stat display value
      - `stat_label` (text) - Stat label
      - `location` (text, nullable) - For salon only
      - `is_active` (boolean) - Whether to display on the site
      - `display_order` (integer) - Order in which to display
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `team_member_certificates`
      - `id` (uuid, primary key)
      - `team_member_id` (uuid, foreign key)
      - `title` (text) - Certificate name
      - `issuer` (text) - Issuing organization
      - `year` (text) - Year obtained
      - `image_url` (text) - Certificate image
      - `display_order` (integer)
      - `created_at` (timestamptz)

    - `team_member_gallery`
      - `id` (uuid, primary key)
      - `team_member_id` (uuid, foreign key)
      - `image_url` (text) - Gallery image
      - `caption` (text, nullable) - Image caption
      - `display_order` (integer)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
*/

CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('person', 'salon')),
  first_name text,
  last_name text,
  title text,
  title_gold text,
  badge text NOT NULL,
  description text NOT NULL,
  bio text NOT NULL,
  image_url text NOT NULL,
  stat_value text NOT NULL,
  stat_label text NOT NULL,
  location text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS team_member_certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_member_id uuid NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  title text NOT NULL,
  issuer text NOT NULL,
  year text NOT NULL,
  image_url text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS team_member_gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_member_id uuid NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_member_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_member_gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active team members"
  ON team_members FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view team member certificates"
  ON team_member_certificates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.id = team_member_certificates.team_member_id
      AND team_members.is_active = true
    )
  );

CREATE POLICY "Anyone can view team member gallery"
  ON team_member_gallery FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.id = team_member_gallery.team_member_id
      AND team_members.is_active = true
    )
  );

CREATE INDEX IF NOT EXISTS idx_team_members_slug ON team_members(slug);
CREATE INDEX IF NOT EXISTS idx_team_members_type ON team_members(type);
CREATE INDEX IF NOT EXISTS idx_team_members_active ON team_members(is_active);
CREATE INDEX IF NOT EXISTS idx_team_member_certificates_member ON team_member_certificates(team_member_id);
CREATE INDEX IF NOT EXISTS idx_team_member_gallery_member ON team_member_gallery(team_member_id);
