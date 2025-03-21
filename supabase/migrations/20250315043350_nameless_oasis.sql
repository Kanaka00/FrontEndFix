/*
  # Create projects table and security policies

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, required)
      - `category` (text, required)
      - `image_url` (text, required)
      - `demo_url` (text, required)
      - `code_url` (text, required)
      - `created_at` (timestamp with timezone, default: now())
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on projects table
    - Add policies for:
      - Select: Allow anyone to read projects
      - Insert: Only authenticated users can create projects
      - Update: Users can only update their own projects
      - Delete: Users can only delete their own projects
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  image_url text NOT NULL,
  demo_url text NOT NULL,
  code_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL DEFAULT auth.uid()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view projects"
  ON projects
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);