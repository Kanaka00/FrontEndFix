/*
  # Add video support to projects table

  1. Changes
    - Add `video_url` column to projects table
    - Make it optional (nullable)
    - No default value required
*/

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS video_url text;