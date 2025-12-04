/*
  # Fix Admin RLS Infinite Recursion (v2)

  1. Problem
    - The is_admin() function queries admin_users table
    - admin_users table has RLS policies that call is_admin()
    - This creates infinite recursion

  2. Solution
    - Drop existing admin_users RLS policies
    - Create simpler policies that use auth.uid() directly
    - Recreate is_admin() function with CASCADE

  3. Security
    - Admins can only read their own data via auth.uid()
    - Function bypasses RLS with SECURITY DEFINER
*/

-- Drop existing problematic policies on admin_users
DROP POLICY IF EXISTS "Admins can read own data" ON admin_users;
DROP POLICY IF EXISTS "Super admins can read all admins" ON admin_users;
DROP POLICY IF EXISTS "Super admins can create admins" ON admin_users;
DROP POLICY IF EXISTS "Super admins can update admins" ON admin_users;

-- Recreate admin_users policies without using is_admin()
CREATE POLICY "Authenticated users can read own admin data"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Super admins can read all admin data"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users ad
      WHERE ad.id = auth.uid()
      AND ad.role = 'super_admin'
      AND ad.is_active = true
    )
  );

CREATE POLICY "Super admins can insert admin users"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users ad
      WHERE ad.id = auth.uid()
      AND ad.role = 'super_admin'
      AND ad.is_active = true
    )
  );

CREATE POLICY "Super admins can update admin users"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users ad
      WHERE ad.id = auth.uid()
      AND ad.role = 'super_admin'
      AND ad.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users ad
      WHERE ad.id = auth.uid()
      AND ad.role = 'super_admin'
      AND ad.is_active = true
    )
  );

-- Recreate is_admin function with CASCADE
DROP FUNCTION IF EXISTS is_admin() CASCADE;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
    AND admin_users.is_active = true
  );
$$;

-- Recreate all policies that depend on is_admin()

-- Service Categories
CREATE POLICY "Admins can insert service categories"
  ON service_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update service categories"
  ON service_categories
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete service categories"
  ON service_categories
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- Services
CREATE POLICY "Admins can insert services"
  ON services
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update services"
  ON services
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete services"
  ON services
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- Service Reviews
CREATE POLICY "Admins can insert service reviews"
  ON service_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update service reviews"
  ON service_reviews
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete service reviews"
  ON service_reviews
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- Blog Posts
CREATE POLICY "Admins can view all blog posts"
  ON blog_posts
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert blog posts"
  ON blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update blog posts"
  ON blog_posts
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete blog posts"
  ON blog_posts
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- Promotions
CREATE POLICY "Admins can view all promotions"
  ON promotions
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert promotions"
  ON promotions
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update promotions"
  ON promotions
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete promotions"
  ON promotions
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- Team Members
CREATE POLICY "Admins can view all team members"
  ON team_members
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert team members"
  ON team_members
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update team members"
  ON team_members
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete team members"
  ON team_members
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- Team Member Certificates
CREATE POLICY "Admins can insert team member certificates"
  ON team_member_certificates
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update team member certificates"
  ON team_member_certificates
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete team member certificates"
  ON team_member_certificates
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- Team Member Gallery
CREATE POLICY "Admins can insert team member gallery"
  ON team_member_gallery
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update team member gallery"
  ON team_member_gallery
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete team member gallery"
  ON team_member_gallery
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- Top Services
CREATE POLICY "Admins can view all top services"
  ON top_services
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert top services"
  ON top_services
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update top services"
  ON top_services
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete top services"
  ON top_services
  FOR DELETE
  TO authenticated
  USING (is_admin());