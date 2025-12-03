# Настройка на Contact Config

## Проблем
Ако виждате грешка "Could not find the table 'public.contact_config'", това означава, че миграцията не е изпълнена в Supabase.

## Решение

### Стъпка 1: Отворете Supabase Dashboard
1. Отидете на вашия Supabase проект
2. Кликнете на "SQL Editor" в лявото меню

### Стъпка 2: Изпълнете миграцията
Копирайте и изпълнете целия SQL скрипт от файла:
`supabase/migrations/20251202120000_create_contact_config_schema.sql`

Или изпълнете следния SQL код:

```sql
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
DROP POLICY IF EXISTS "Anyone can view contact config" ON contact_config;
CREATE POLICY "Anyone can view contact config"
  ON contact_config
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Admins can insert contact config" ON contact_config;
CREATE POLICY "Admins can insert contact config"
  ON contact_config
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can update contact config" ON contact_config;
CREATE POLICY "Admins can update contact config"
  ON contact_config
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can delete contact config" ON contact_config;
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
```

### Стъпка 3: Проверка
След изпълнение на миграцията:
1. Обновете страницата в браузъра
2. Отидете на `/admin/contact-config`
3. Трябва да видите формата за конфигурация на контакти

## Бележки
- Миграцията създава таблицата `contact_config` с необходимите полета
- Добавя RLS политики за сигурност
- Създава начална конфигурация с примерни данни
- След изпълнение можете да редактирате конфигурацията от администрацията

