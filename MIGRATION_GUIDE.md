# Ръководство за Миграция на Салона от Team Members към Отделна Таблица

## Общ Преглед

Салонът (Hair & Beauty Livon) е прехвърлен от `team_members` таблицата към нова отделна `salon_info` таблица. Тази миграция разделя салонната информация от информацията за членовете на екипа.

## Стъпки за Миграция

### 1. Създаване на Новата Структура

Първо, изпълнете SQL файла за създаване на новата структура за салона:

```bash
Изпълнете SQL в Supabase Dashboard:
- Отворете Supabase Dashboard
- Отидете в SQL Editor
- Копирайте съдържанието на файла SALON_MIGRATION.sql
- Изпълнете го
```

Този скрипт създава:
- Таблица `salon_info` - основна информация за салона
- Таблица `salon_certificates` - сертификати на салона
- RLS политики за двете таблици
- Примерна информация за салон

### 2. Миграция на Съществуващи Данни

След създаването на структурата, мигрирайте данните от `team_members`:

```bash
Изпълнете SQL в Supabase Dashboard:
- Отворете SQL Editor
- Копирайте съдържанието на файла MIGRATE_SALON_DATA.sql
- Изпълнете го
```

Този скрипт:
1. Копира салонните записи от `team_members` (type='salon') в `salon_info`
2. Копира сертификатите от `team_member_certificates` в `salon_certificates`
3. Изтрива старите салонни записи от `team_members`

### 3. Проверка на Данните

След миграцията, проверете дали данните са успешно прехвърлени:

```sql
-- Проверка на салона
SELECT * FROM salon_info;

-- Проверка на сертификатите
SELECT * FROM salon_certificates;

-- Уверете се, че няма salon записи в team_members
SELECT * FROM team_members WHERE type = 'salon';
```

## Промени в Приложението

### Нови Страници и Компоненти

1. **Admin Панел:**
   - `/admin/salon` - управление на салона
   - `/admin/salon/new` - създаване на нов салон
   - `/admin/salon/edit/:id` - редактиране на салон

2. **Frontend:**
   - `/salon/:slug` - публична страница на салона
   - Team страницата вече показва само хората от екипа
   - Салонът се показва в отделна секция "За Салона" на Team страницата
   - Салонът се добавя като последен слайд в херо slider-а на началната страница

### Промени в Съществуващи Компоненти

1. **TeamMemberForm:**
   - Премахната опция за тип 'salon'
   - Премахнати полета: title, title_gold, location
   - Винаги създава/редактира само хора (type='person')

2. **TeamManager:**
   - Филтрира само членове с type='person'
   - Премахнати референции към салонни полета

3. **TeamPage:**
   - Показва отделна секция за салона
   - Зарежда салон от `salon_info` таблицата

4. **Home Page:**
   - Hero slider включва салона като последен слайд
   - Зарежда салонна информация от `salon_info`

## Разлики Между Екип и Салон

### Екип (Team Members)
- Име и фамилия (first_name, last_name)
- Badge/професионално звание
- Био (rich text)
- Главна снимка
- Галерия с два типа: "main" и "work"
- Сертификати
- Статистика (stat_value, stat_label)

### Салон (Salon Info)
- Заглавие (title) и златно заглавие (title_gold)
- Badge
- Описание и био (rich text)
- Главна снимка и thumbnail
- Само сертификати (БЕЗ галерия)
- Статистика (stat_value, stat_label)
- Локация

## База Данни

### Нови Таблици

#### salon_info
```sql
- id (uuid, primary key)
- slug (text, unique)
- title (text)
- title_gold (text, nullable)
- badge (text)
- description (text)
- bio (text, rich content)
- image_url (text)
- thumbnail_url (text, nullable)
- stat_value (text)
- stat_label (text)
- location (text, nullable)
- is_active (boolean)
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### salon_certificates
```sql
- id (uuid, primary key)
- salon_id (uuid, foreign key)
- title (text)
- issuer (text)
- year (text)
- image_url (text)
- display_order (integer)
- created_at (timestamptz)
```

### Промени в team_members
Таблицата `team_members` вече трябва да съдържа САМО записи с `type='person'`. Всички записи със `type='salon'` са премахнати.

## Важни Забележки

1. **Преди миграцията:** Направете backup на базата данни
2. **След миграцията:** Старите salon записи в `team_members` ще бъдат изтрити автоматично
3. **RLS политики:** И двете нови таблици имат правилно конфигурирани RLS политики
4. **Навигация:** Добавете линк към салона в главното меню чрез Header Config Manager

## Потенциални Проблеми

1. **Ако миграцията не успее:**
   - Проверете дали SALON_MIGRATION.sql е изпълнен първо
   - Проверете за дублирани slugs
   - Проверете RLS политиките

2. **Ако салонът не се показва:**
   - Уверете се, че `is_active = true` в `salon_info`
   - Проверете дали има правилен slug
   - Проверете network requests за грешки

## Тестване

След миграцията, тествайте:
1. Салонната страница: `/salon/salon-livon`
2. Team страницата: `/team` - трябва да показва салон в отделна секция
3. Началната страница - hero slider трябва да включва салон като последен слайд
4. Admin панел:
   - `/admin/salon` - управление на салона
   - `/admin/team` - трябва да показва само хора

## Контакт

При проблеми или въпроси, проверете файловете:
- `SALON_MIGRATION.sql` - създаване на структурата
- `MIGRATE_SALON_DATA.sql` - миграция на данните
