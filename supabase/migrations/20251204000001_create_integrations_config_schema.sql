/*
  # Create integrations configuration schema

  1. New Tables
    - `integrations_config`
      - `id` (uuid, primary key)
      - `instagram_username` (text, nullable) - Instagram username
      - `instagram_access_token` (text, nullable) - Instagram access token (encrypted/hidden)
      - `instagram_enabled` (boolean, default false) - Whether to fetch Instagram images
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on integrations_config table
    - Only admins can view and manage integrations
*/

CREATE TABLE IF NOT EXISTS integrations_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instagram_username text,
  instagram_access_token text,
  instagram_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE integrations_config ENABLE ROW LEVEL SECURITY;

-- Only admins can view integrations config
CREATE POLICY "Admins can view integrations config"
  ON integrations_config
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Only admins can insert integrations config
CREATE POLICY "Admins can insert integrations config"
  ON integrations_config
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Only admins can update integrations config
CREATE POLICY "Admins can update integrations config"
  ON integrations_config
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Only admins can delete integrations config
CREATE POLICY "Admins can delete integrations config"
  ON integrations_config
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- Create index
CREATE INDEX IF NOT EXISTS idx_integrations_config_updated ON integrations_config(updated_at);

-- Insert default config if none exists
INSERT INTO integrations_config (instagram_username, instagram_enabled)
VALUES (NULL, false)
ON CONFLICT DO NOTHING;

