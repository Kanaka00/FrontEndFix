/*
  # Fix activities table schema

  1. Changes
    - Add missing date and time columns to activities table
    - Add duration column
    - Update existing table structure
*/

ALTER TABLE activities
ADD COLUMN IF NOT EXISTS activity_date date NOT NULL DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS activity_time time NOT NULL DEFAULT CURRENT_TIME,
ADD COLUMN IF NOT EXISTS duration integer NOT NULL DEFAULT 30;