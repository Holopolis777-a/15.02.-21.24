/*
  # Create FAQ table and security policies

  1. New Tables
    - `faqs`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `content` (text, required)
      - `targets` (text[], required) - Array of target user roles
      - `priority` (integer, required) - 1-10 where 1 is highest
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `created_by` (uuid, references users)

  2. Security
    - Enable RLS
    - Policies for read/write access
*/

-- Create FAQ table
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  targets text[] NOT NULL,
  priority integer NOT NULL CHECK (priority BETWEEN 1 AND 10),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id)
);

-- Enable RLS
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read active FAQs"
  ON faqs
  FOR SELECT
  USING (
    is_active = true OR 
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Only admins can insert FAQs"
  ON faqs
  FOR INSERT
  WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Only admins can update FAQs"
  ON faqs
  FOR UPDATE
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Create indexes
CREATE INDEX idx_faqs_priority ON faqs(priority);
CREATE INDEX idx_faqs_is_active ON faqs(is_active);
CREATE INDEX idx_faqs_created_at ON faqs(created_at);