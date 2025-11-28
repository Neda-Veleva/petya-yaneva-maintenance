/*
  # Create Admin Users Schema

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `full_name` (text)
      - `role` (text) - 'super_admin' or 'admin'
      - `is_active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `admin_users` table
    - Add policies for authenticated admin users only
    - Admins can read their own data
    - Only super_admins can manage other admins

  3. Important Notes
    - This table links to Supabase auth.users
    - Admin access is controlled via this table
    - Initial admin must be created manually after migration
*/

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read own data"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Super admins can read all admins"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'super_admin'
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "Super admins can create admins"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'super_admin'
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "Super admins can update admins"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'super_admin'
      AND admin_users.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'super_admin'
      AND admin_users.is_active = true
    )
  );

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
    AND admin_users.is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies for all tables to allow admin access

-- Service Categories
DROP POLICY IF EXISTS "Anyone can view service categories" ON service_categories;
CREATE POLICY "Anyone can view service categories"
  ON service_categories
  FOR SELECT
  TO public
  USING (true);

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
DROP POLICY IF EXISTS "Anyone can view services" ON services;
CREATE POLICY "Anyone can view services"
  ON services
  FOR SELECT
  TO public
  USING (true);

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
DROP POLICY IF EXISTS "Anyone can view service reviews" ON service_reviews;
CREATE POLICY "Anyone can view service reviews"
  ON service_reviews
  FOR SELECT
  TO public
  USING (true);

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
DROP POLICY IF EXISTS "Anyone can view published blog posts" ON blog_posts;
CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts
  FOR SELECT
  TO public
  USING (is_published = true);

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
DROP POLICY IF EXISTS "Anyone can view active promotions" ON promotions;
CREATE POLICY "Anyone can view active promotions"
  ON promotions
  FOR SELECT
  TO public
  USING (is_active = true);

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
DROP POLICY IF EXISTS "Anyone can view active team members" ON team_members;
CREATE POLICY "Anyone can view active team members"
  ON team_members
  FOR SELECT
  TO public
  USING (is_active = true);

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
DROP POLICY IF EXISTS "Anyone can view team member certificates" ON team_member_certificates;
CREATE POLICY "Anyone can view team member certificates"
  ON team_member_certificates
  FOR SELECT
  TO public
  USING (true);

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
DROP POLICY IF EXISTS "Anyone can view team member gallery" ON team_member_gallery;
CREATE POLICY "Anyone can view team member gallery"
  ON team_member_gallery
  FOR SELECT
  TO public
  USING (true);

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
DROP POLICY IF EXISTS "Anyone can view active top services" ON top_services;
CREATE POLICY "Anyone can view active top services"
  ON top_services
  FOR SELECT
  TO public
  USING (is_active = true);

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