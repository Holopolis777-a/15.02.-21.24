/*
  # Add News Management Schema

  1. New Tables
    - `news_posts`: Main table for news entries
    - `news_categories`: Categories for organizing news
    - `news_permissions`: Role-based access control
    - `news_media`: Media attachments for news posts

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access
    - Add policies for media management

  3. Indexes
    - Add performance optimizing indexes
*/

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- News Posts Table
CREATE TABLE IF NOT EXISTS news_posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title varchar(100) NOT NULL,
  content text NOT NULL,
  image_url text,
  price decimal(10,2),
  external_url text,
  published_at timestamptz,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id),
  target_groups text[] NOT NULL DEFAULT '{}',
  views integer DEFAULT 0,
  interactions integer DEFAULT 0,
  category_id uuid REFERENCES news_categories(id)
);

-- News Categories Table
CREATE TABLE IF NOT EXISTS news_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- News Permissions Table
CREATE TABLE IF NOT EXISTS news_permissions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id text NOT NULL,
  can_create boolean DEFAULT false,
  can_edit boolean DEFAULT false,
  can_delete boolean DEFAULT false,
  can_publish boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(role_id)
);

-- News Media Table
CREATE TABLE IF NOT EXISTS news_media (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  news_id uuid REFERENCES news_posts(id) ON DELETE CASCADE,
  url text NOT NULL,
  type text NOT NULL CHECK (type IN ('image', 'document')),
  size integer NOT NULL,
  mime_type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id)
);

-- Enable Row Level Security
ALTER TABLE news_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_media ENABLE ROW LEVEL SECURITY;

-- Create policies for news_posts
CREATE POLICY "Anyone can read published news"
  ON news_posts
  FOR SELECT
  USING (
    is_active = true OR 
    auth.uid() IN (
      SELECT id FROM users WHERE role IN ('admin', 'content_manager')
    )
  );

CREATE POLICY "Content managers can create news"
  ON news_posts
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM users WHERE role IN ('admin', 'content_manager')
    )
  );

CREATE POLICY "Content managers can update their own news"
  ON news_posts
  FOR UPDATE
  USING (
    auth.uid() = created_by OR
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

CREATE POLICY "Only admins can delete news"
  ON news_posts
  FOR DELETE
  USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

-- Create policies for news_categories
CREATE POLICY "Anyone can read categories"
  ON news_categories
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage categories"
  ON news_categories
  FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

-- Create policies for news_permissions
CREATE POLICY "Only admins can manage permissions"
  ON news_permissions
  FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

-- Create policies for news_media
CREATE POLICY "Anyone can view media"
  ON news_media
  FOR SELECT
  USING (true);

CREATE POLICY "Content managers can upload media"
  ON news_media
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM users WHERE role IN ('admin', 'content_manager')
    )
  );

CREATE POLICY "Only admins can delete media"
  ON news_media
  FOR DELETE
  USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

-- Create indexes for better performance
CREATE INDEX idx_news_posts_published_at ON news_posts(published_at);
CREATE INDEX idx_news_posts_category_id ON news_posts(category_id);
CREATE INDEX idx_news_posts_created_by ON news_posts(created_by);
CREATE INDEX idx_news_posts_is_active ON news_posts(is_active);
CREATE INDEX idx_news_media_news_id ON news_media(news_id);
CREATE INDEX idx_news_media_type ON news_media(type);

-- Insert default permissions
INSERT INTO news_permissions (role_id, can_create, can_edit, can_delete, can_publish)
VALUES
  ('admin', true, true, true, true),
  ('content_manager', true, true, false, true),
  ('broker', false, false, false, false),
  ('employer', false, false, false, false),
  ('employee_normal', false, false, false, false),
  ('employee_salary', false, false, false, false),
  ('customer', false, false, false, false);

-- Insert default categories
INSERT INTO news_categories (name, slug, description)
VALUES
  ('Allgemein', 'allgemein', 'Allgemeine Neuigkeiten'),
  ('Produkte', 'produkte', 'Produktneuheiten und Updates'),
  ('Unternehmen', 'unternehmen', 'Unternehmensnachrichten'),
  ('Events', 'events', 'Veranstaltungen und Termine');