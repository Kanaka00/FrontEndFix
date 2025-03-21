/*
  # Create mails table for contact form integration

  1. New Tables
    - `mails`
      - `id` (uuid, primary key)
      - `subject` (text, required)
      - `from` (text, required)
      - `to` (text, required)
      - `content` (text, required)
      - `status` (text, required)
      - `category` (text, required)
      - `created_at` (timestamp with timezone)
      - `updated_at` (timestamp with timezone)

  2. Security
    - Enable RLS
    - Add policies for:
      - Select: Only authenticated users can read mails
      - Insert: Anyone can create mails (for contact form)
      - Update: Only authenticated users can update mails
      - Delete: Only authenticated users can delete mails
*/

CREATE TABLE mails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  "from" text NOT NULL,
  "to" text NOT NULL,
  content text NOT NULL,
  status text NOT NULL DEFAULT 'sent',
  category text NOT NULL DEFAULT 'inbox',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE mails ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Authenticated users can read mails"
  ON mails
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create mails"
  ON mails
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update mails"
  ON mails
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete mails"
  ON mails
  FOR DELETE
  TO authenticated
  USING (true);