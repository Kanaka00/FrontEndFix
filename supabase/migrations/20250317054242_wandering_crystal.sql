/*
  # Initial Schema Setup for Portfolio System

  1. New Tables
    - Projects, Activities, and Reminders tables with proper relationships
    - Storage buckets for media files
    - Comprehensive security policies
*/

-- Create storage buckets
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES 
    ('project-media', 'project-media', true),
    ('activity-media', 'activity-media', true),
    ('profile-media', 'profile-media', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Drop existing tables if they exist to ensure clean setup
DROP TABLE IF EXISTS reminders;
DROP TABLE IF EXISTS activities;
DROP TABLE IF EXISTS projects;

-- Create projects table
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  features text[] DEFAULT '{}',
  category text NOT NULL,
  status text NOT NULL DEFAULT 'in-progress',
  technologies text[] DEFAULT '{}',
  image_url text,
  video_url text,
  demo_url text,
  code_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create activities table
CREATE TABLE activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create reminders table
CREATE TABLE reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  due_date timestamptz NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for projects" ON projects;
DROP POLICY IF EXISTS "Users can create their own projects" ON projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON projects;

DROP POLICY IF EXISTS "Users can view their own activities" ON activities;
DROP POLICY IF EXISTS "Users can create their own activities" ON activities;
DROP POLICY IF EXISTS "Users can update their own activities" ON activities;
DROP POLICY IF EXISTS "Users can delete their own activities" ON activities;

DROP POLICY IF EXISTS "Users can view their own reminders" ON reminders;
DROP POLICY IF EXISTS "Users can create their own reminders" ON reminders;
DROP POLICY IF EXISTS "Users can update their own reminders" ON reminders;
DROP POLICY IF EXISTS "Users can delete their own reminders" ON reminders;

-- Create fresh policies
-- Projects Policies
CREATE POLICY "Public read access for projects"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Activities Policies
CREATE POLICY "Users can view their own activities"
  ON activities FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activities"
  ON activities FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activities"
  ON activities FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activities"
  ON activities FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Reminders Policies
CREATE POLICY "Users can view their own reminders"
  ON reminders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reminders"
  ON reminders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders"
  ON reminders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminders"
  ON reminders FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Storage Policies
DROP POLICY IF EXISTS "Public read access for project media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload project media" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their project media" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their project media" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for activity media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload activity media" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for profile media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload profile media" ON storage.objects;

CREATE POLICY "Public read access for project media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-media');

CREATE POLICY "Authenticated users can upload project media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'project-media');

CREATE POLICY "Users can update their project media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'project-media');

CREATE POLICY "Users can delete their project media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'project-media');

CREATE POLICY "Public read access for activity media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'activity-media');

CREATE POLICY "Authenticated users can upload activity media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'activity-media');

CREATE POLICY "Public read access for profile media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-media');

CREATE POLICY "Authenticated users can upload profile media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'profile-media');