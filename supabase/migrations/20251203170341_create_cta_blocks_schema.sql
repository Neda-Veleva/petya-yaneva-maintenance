/*
  # Create CTA Blocks Schema

  ## Overview
  This migration creates a table for managing reusable Call-to-Action (CTA) blocks
  that can be used across different pages of the website.

  ## New Tables

  ### `cta_blocks`
  Stores reusable CTA blocks with different layouts and styles
  - `id` (uuid, primary key)
  - `name` (text) - Internal name for identifying the block
  - `block_type` (text) - Type of CTA block layout
    - 'simple_cta': Icon, title, description, 1 button
    - 'dual_cta': Title, description, 2 buttons
    - 'stats_cta': Icon, title, description, 2 buttons, 4 stats
  - `content` (jsonb) - Block content structure:
    {
      "icon": "star|sparkles|heart|etc",
      "title": "Block title",
      "description": "Block description",
      "buttons": [
        {"text": "Button text", "url": "/path", "style": "primary|secondary"}
      ],
      "stats": [
        {"value": "500+", "label": "Доволни клиенти"}
      ]
    }
  - `is_active` (boolean) - Whether the block is active
  - `display_order` (int) - Order for sorting
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on cta_blocks table
  - Public read access for active blocks
  - Authenticated users can manage blocks

  ## Notes
  - Blocks can be reused across multiple pages
  - Content structure varies by block_type
  - All text fields are editable through admin
*/

-- Create cta_blocks table
CREATE TABLE IF NOT EXISTS cta_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  block_type text NOT NULL CHECK (block_type IN ('simple_cta', 'dual_cta', 'stats_cta')),
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE cta_blocks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active CTA blocks"
  ON cta_blocks FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all CTA blocks"
  ON cta_blocks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert CTA blocks"
  ON cta_blocks FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update CTA blocks"
  ON cta_blocks FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete CTA blocks"
  ON cta_blocks FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample CTA blocks based on the provided designs
INSERT INTO cta_blocks (name, block_type, content, display_order) VALUES
(
  'Станете част от семейството',
  'simple_cta',
  '{
    "icon": "star",
    "title": "Станете част от семейството ни",
    "description": "Присъединете се към стотиците доволни клиенти",
    "buttons": [
      {
        "text": "Запази час сега",
        "url": "/contact",
        "style": "primary"
      }
    ]
  }'::jsonb,
  1
),
(
  'Готови за промяна - прост',
  'dual_cta',
  '{
    "title": "Готови за промяна?",
    "description": "Запазете своя час днес и открийте магията на професионалната грижа",
    "buttons": [
      {
        "text": "Запази час сега",
        "url": "/contact",
        "style": "primary",
        "icon": "sparkles"
      },
      {
        "text": "Всички услуги",
        "url": "/services",
        "style": "secondary"
      }
    ]
  }'::jsonb,
  2
),
(
  'Готови за промяна - със статистики',
  'stats_cta',
  '{
    "icon": "sparkles",
    "title": "Готови за промяна?",
    "description": "Заповядайте в нашия салон и открийте света на перфектните мигли и вежди. Запазете час днес и се насладете на луксозна грижа с професионален подход.",
    "buttons": [
      {
        "text": "Запази час сега",
        "url": "/contact",
        "style": "primary",
        "icon": "arrow-right"
      },
      {
        "text": "Разгледай услугите",
        "url": "/services",
        "style": "secondary"
      }
    ],
    "stats": [
      {
        "value": "500+",
        "label": "Доволни клиенти"
      },
      {
        "value": "5+",
        "label": "Години опит"
      },
      {
        "value": "100%",
        "label": "Качествени продукти"
      },
      {
        "value": "24/7",
        "label": "Грижа за теб"
      }
    ]
  }'::jsonb,
  3
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_cta_blocks_active ON cta_blocks(is_active);
CREATE INDEX IF NOT EXISTS idx_cta_blocks_order ON cta_blocks(display_order);
CREATE INDEX IF NOT EXISTS idx_cta_blocks_type ON cta_blocks(block_type);
