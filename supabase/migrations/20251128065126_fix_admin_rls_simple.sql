/*
  # Fix Admin RLS - Simple Approach

  1. Problem
    - Any policy that queries admin_users within admin_users RLS creates recursion
    - Even checking for super_admin role causes this

  2. Solution
    - Keep ONLY the simple policy: users can read their own admin data
    - Remove all policies that query admin_users from within admin_users
    - Super admin management will need to be done via service role or SQL

  3. Security
    - Authenticated users can only read their own admin record
    - This is sufficient for login and session management
    - Admin operations on other tables work via is_admin() which uses SECURITY DEFINER
*/

-- Drop ALL existing policies on admin_users
DROP POLICY IF EXISTS "Authenticated users can read own admin data" ON admin_users;
DROP POLICY IF EXISTS "Super admins can read all admin data" ON admin_users;
DROP POLICY IF EXISTS "Super admins can insert admin users" ON admin_users;
DROP POLICY IF EXISTS "Super admins can update admin users" ON admin_users;

-- Create ONE simple policy: users can read their own data
CREATE POLICY "Users can read own admin record"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- No INSERT, UPDATE, DELETE policies
-- These operations will be done via service role (Edge Functions) or direct SQL