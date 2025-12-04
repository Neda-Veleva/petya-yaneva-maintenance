/*
  # Create Page Blocks Schema

  1. New Tables
    - `page_blocks`
      - `id` (uuid, primary key)
      - `page_type_id` (uuid, foreign key to page_types)
      - `block_type` (text) - Type of block (hero, services, gallery, etc.)
      - `block_key` (text) - Unique identifier for the block within a page
      - `title` (text) - Block title
      - `content` (jsonb) - Flexible content storage
      - `display_order` (int) - Order in which blocks appear
      - `is_visible` (boolean) - Whether block is visible
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `page_blocks` table
    - Public can read visible blocks
    - Admins can manage all blocks

  3. Indexes
    - Index on page_type_id for fast lookups
    - Index on block_key for unique lookups
*/

CREATE TABLE IF NOT EXISTS page_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type_id uuid REFERENCES page_types(id) ON DELETE CASCADE,
  block_type text NOT NULL,
  block_key text NOT NULL,
  title text DEFAULT '',
  content jsonb DEFAULT '{}',
  display_order int DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(page_type_id, block_key)
);

-- Enable RLS
ALTER TABLE page_blocks ENABLE ROW LEVEL SECURITY;

-- Public can read visible blocks
CREATE POLICY "Anyone can view visible blocks"
  ON page_blocks
  FOR SELECT
  USING (is_visible = true);

-- Admins can view all blocks
CREATE POLICY "Admins can view all blocks"
  ON page_blocks
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admins can insert blocks
CREATE POLICY "Admins can insert blocks"
  ON page_blocks
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Admins can update blocks
CREATE POLICY "Admins can update blocks"
  ON page_blocks
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admins can delete blocks
CREATE POLICY "Admins can delete blocks"
  ON page_blocks
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_page_blocks_page_type ON page_blocks(page_type_id);
CREATE INDEX IF NOT EXISTS idx_page_blocks_key ON page_blocks(page_type_id, block_key);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_page_blocks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER page_blocks_updated_at
  BEFORE UPDATE ON page_blocks
  FOR EACH ROW
  EXECUTE FUNCTION update_page_blocks_updated_at();

-- Insert default blocks for Home Page
DO $$
DECLARE
  home_page_id uuid;
BEGIN
  -- Get the home page type ID
  SELECT id INTO home_page_id FROM page_types WHERE slug = 'home' LIMIT 1;
  
  IF home_page_id IS NOT NULL THEN
    -- Insert default home page blocks
    INSERT INTO page_blocks (page_type_id, block_type, block_key, title, content, display_order, is_visible) VALUES
      (home_page_id, 'intro-hero', 'intro-hero', 'Въвеждащ Херо', '{"title": "Lashes by Petya Yaneva", "description": "Открийте света на луксозната грижа за мигли", "image_url": "https://images.unsplash.com/photo-1548902378-2ec44c906391?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleWUlMjBtYWtldXAlMjBsYXNoZXN8ZW58MXx8fHwxNzYzMTM0MTAwfDA&ixlib=rb-4.1.0&q=80&w=1080"}', 1, true),
      (home_page_id, 'hero', 'main-hero', 'Главен Херо', '{"title": "Перфектни Мигли", "subtitle": "Професионално удължаване и сгъстяване", "description": "Открийте красотата на естествените, но впечатляващи мигли", "button_text": "Резервирай час", "button_link": "#contact"}', 2, true),
      (home_page_id, 'services', 'services', 'Услуги', '{"title": "Нашите Услуги", "description": "Професионални процедури за перфектни мигли"}', 3, true),
      (home_page_id, 'price-list', 'price-list', 'Ценоразпис', '{"title": "Цени", "description": "Прозрачни и конкурентни цени"}', 4, true),
      (home_page_id, 'reviews', 'reviews', 'Отзиви', '{"title": "Какво казват клиентите", "description": "Реални отзиви от доволни клиенти"}', 5, true),
      (home_page_id, 'gallery', 'gallery', 'Галерия', '{"title": "Нашата работа", "description": "Вижте резултатите от нашите процедури"}', 6, true),
      (home_page_id, 'blog', 'blog', 'Блог', '{"title": "Последни статии", "description": "Съвети и новини за грижата за мигли"}', 7, true),
      (home_page_id, 'contact', 'contact', 'Контакти', '{"title": "Свържете се с нас", "description": "Резервирайте час или задайте въпрос"}', 8, true),
      (home_page_id, 'brands', 'brands', 'Брандове', '{"title": "Работим с най-добрите", "description": "Използваме само качествени продукти"}', 9, true),
      (home_page_id, 'cta', 'call-to-action', 'Call to Action', '{"title": "Готови ли сте за промяна?", "description": "Запишете се сега и получете специална оферта", "button_text": "Резервирай час", "button_link": "#contact"}', 10, true)
    ON CONFLICT (page_type_id, block_key) DO NOTHING;
  END IF;
END $$;