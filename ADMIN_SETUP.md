# Admin Panel Setup Instructions

## Creating the First Admin User

After deploying the application, you need to create the first admin user manually:

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

Replace:
- `USER_UUID_HERE` with the UUID from Step 1
- `admin@example.com` with the admin email
- `Admin Name` with the admin's full name

### Step 3: Login

1. Go to `/login` on your website
2. Enter the admin email and password
3. You should be redirected to `/admin`

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
