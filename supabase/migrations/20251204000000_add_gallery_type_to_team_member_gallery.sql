/*
  # Add gallery_type to team_member_gallery

  1. Changes
    - Add `gallery_type` column to `team_member_gallery` table
    - Values: 'main' for main images, 'work' for work portfolio images
    - Default to 'work' for backward compatibility
*/

ALTER TABLE team_member_gallery 
ADD COLUMN IF NOT EXISTS gallery_type text DEFAULT 'work' CHECK (gallery_type IN ('main', 'work'));

-- Update existing records to 'work' (backward compatibility)
UPDATE team_member_gallery 
SET gallery_type = 'work' 
WHERE gallery_type IS NULL;

-- Create index for filtering
CREATE INDEX IF NOT EXISTS idx_team_member_gallery_type ON team_member_gallery(team_member_id, gallery_type);

