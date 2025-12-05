# Настройка на Интеграции

## Проблем
Ако виждате грешка "Грешка при зареждане на конфигурацията", това означава, че миграцията не е изпълнена в Supabase.

## Решение

### Стъпка 1: Отворете Supabase Dashboard
1. Отидете на вашия Supabase проект
2. Кликнете на "SQL Editor" в лявото меню

### Стъпка 2: Изпълнете миграцията
Копирайте и изпълнете целия SQL скрипт от файла:
`supabase/migrations/20251204000001_create_integrations_config_schema.sql`

Или изпълнете следния SQL код:

```sql
-- Create integrations configuration table
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
DROP POLICY IF EXISTS "Admins can view integrations config" ON integrations_config;
CREATE POLICY "Admins can view integrations config"
  ON integrations_config
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Only admins can insert integrations config
DROP POLICY IF EXISTS "Admins can insert integrations config" ON integrations_config;
CREATE POLICY "Admins can insert integrations config"
  ON integrations_config
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Only admins can update integrations config
DROP POLICY IF EXISTS "Admins can update integrations config" ON integrations_config;
CREATE POLICY "Admins can update integrations config"
  ON integrations_config
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Only admins can delete integrations config
DROP POLICY IF EXISTS "Admins can delete integrations config" ON integrations_config;
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
```

### Стъпка 3: Проверка
След изпълнение на миграцията:
1. Обновете страницата в браузъра
2. Отидете на `/admin/integrations`
3. Трябва да видите формата за конфигурация на интеграции

## Бележки
- Миграцията създава таблицата `integrations_config` с необходимите полета
- Добавя RLS политики за сигурност (само админи могат да управляват интеграциите)
- Създава начална конфигурация с празни стойности
- След изпълнение можете да конфигурирате Instagram интеграцията от администрацията

