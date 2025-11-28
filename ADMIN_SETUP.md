# Admin Panel Setup Instructions

## Test Admin User

A test admin user has been created for you:

**Email:** admin@livon.bg
**Password:** admin123

### Login

1. Go to `/login` on your website
2. Enter the credentials above
3. You will be redirected to `/admin`

## Creating Additional Admin Users

You can create additional admin users using the `create-admin` Edge Function:

```bash
curl -X POST "YOUR_SUPABASE_URL/functions/v1/create-admin" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"email":"newadmin@example.com","password":"yourpassword","full_name":"Admin Name","role":"super_admin"}'
```

Or manually through Supabase:

### Step 1: Create a Supabase Auth User

1. Go to your Supabase Dashboard
2. Navigate to Authentication > Users
3. Click "Add user" and create a new user with email and password
4. Note the user's UUID (id)

### Step 2: Add the User to admin_users Table

Run this SQL query in the Supabase SQL Editor:

```sql
INSERT INTO admin_users (id, email, full_name, role, is_active)
VALUES (
  'USER_UUID_HERE',
  'admin@example.com',
  'Admin Name',
  'super_admin',
  true
);
```

## Admin Panel Features

The admin panel allows you to:

- **Services**: Create, edit, delete, and manage services
- **Categories**: Manage service categories
- **Top Services**: Feature services on the homepage
- **Blog**: Write and publish blog posts
- **Promotions**: Create promotional offers
- **Team**: Manage team members and their profiles
- **Reviews**: Moderate and manage customer reviews

## Security Notes

- Only users in the `admin_users` table can access the admin panel
- The `is_admin()` function checks if the current user is an active admin
- All database operations are protected by Row Level Security (RLS) policies
- Super admins can create and manage other admin users
