# Настройка на gallery_type за team_member_gallery

## Проблем
Ако виждате грешка "Could not find the 'gallery_type' column of 'team_member_gallery' in the schema cache", това означава, че миграцията не е изпълнена в Supabase.

## Решение

### Стъпка 1: Отворете Supabase Dashboard
1. Отидете на вашия Supabase проект
2. Кликнете на "SQL Editor" в лявото меню

### Стъпка 2: Изпълнете миграцията
Копирайте и изпълнете целия SQL скрипт от файла:
`supabase/migrations/20251204000000_add_gallery_type_to_team_member_gallery.sql`

Или изпълнете следния SQL код:

```sql
-- Add gallery_type column to team_member_gallery
ALTER TABLE team_member_gallery 
ADD COLUMN IF NOT EXISTS gallery_type text DEFAULT 'work' CHECK (gallery_type IN ('main', 'work'));

-- Update existing records to 'work' (backward compatibility)
UPDATE team_member_gallery 
SET gallery_type = 'work' 
WHERE gallery_type IS NULL;

-- Create index for filtering
CREATE INDEX IF NOT EXISTS idx_team_member_gallery_type ON team_member_gallery(team_member_id, gallery_type);
```

### Стъпка 3: Проверка
След изпълнение на миграцията:
1. Обновете страницата в браузъра
2. Отидете на `/admin/team` и опитайте да редактирате член на екипа
3. Трябва да можете да добавяте главни снимки и снимки за "Моята работа" без грешки

## Бележки
- Миграцията добавя колоната `gallery_type` в таблицата `team_member_gallery`
- Стойностите могат да бъдат 'main' (за главни снимки) или 'work' (за "Моята работа")
- Съществуващите записи автоматично се маркират като 'work' за обратна съвместимост
- След изпълнение можете да разделяте главните снимки от снимките за "Моята работа"

