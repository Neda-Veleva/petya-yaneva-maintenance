-- Create contact configuration table
CREATE TABLE IF NOT EXISTS contact_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  address text NOT NULL,
  google_maps_link text,
  phone text NOT NULL,
  email text,
  working_hours jsonb NOT NULL DEFAULT '{}',
  social_links jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_contact_config_updated ON contact_config(updated_at);

-- Enable RLS
ALTER TABLE contact_config ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view contact config"
  ON contact_config
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can insert contact config"
  ON contact_config
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update contact config"
  ON contact_config
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete contact config"
  ON contact_config
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- Insert default config if none exists
INSERT INTO contact_config (address, phone, working_hours, social_links)
VALUES (
  'ул. Примерна 123, София 1000, България',
  '+359 888 123 456',
  '{
    "monday_friday": "09:00 - 19:00",
    "saturday": "10:00 - 18:00",
    "sunday": "Почивен ден"
  }'::jsonb,
  '[]'::jsonb
)
ON CONFLICT DO NOTHING;

