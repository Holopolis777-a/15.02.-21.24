/*
  # Ticket System Implementation

  1. New Tables
    - `tickets`
      - Core ticket information
      - Status tracking
      - Priority management
      - Category assignment
    - `ticket_comments`
      - Comment thread functionality
      - Internal notes support
    - `ticket_attachments`
      - File attachment storage
      - Secure file metadata

  2. Security
    - Enable RLS on all tables
    - Role-based access control
    - Strict visibility rules
    - Data isolation per user/role

  3. Changes
    - Add ticket management capabilities
    - Support file attachments
    - Enable comment threading
*/

-- Create ticket status enum
CREATE TYPE ticket_status AS ENUM (
  'open',
  'in_progress',
  'waiting',
  'closed'
);

-- Create ticket priority enum
CREATE TYPE ticket_priority AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

-- Create ticket category enum
CREATE TYPE ticket_category AS ENUM (
  'technical',
  'billing',
  'vehicle',
  'account',
  'other'
);

-- Tickets Table
CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title varchar(100) NOT NULL,
  description text NOT NULL,
  status ticket_status NOT NULL DEFAULT 'open',
  priority ticket_priority NOT NULL,
  category ticket_category NOT NULL,
  created_by uuid REFERENCES auth.users(id) NOT NULL,
  assigned_to uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ticket Comments Table
CREATE TABLE IF NOT EXISTS ticket_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid REFERENCES tickets(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  is_internal boolean DEFAULT false,
  created_by uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Ticket Attachments Table
CREATE TABLE IF NOT EXISTS ticket_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid REFERENCES tickets(id) ON DELETE CASCADE NOT NULL,
  comment_id uuid REFERENCES ticket_comments(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_size integer NOT NULL,
  mime_type text NOT NULL,
  file_url text NOT NULL,
  created_by uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_attachments ENABLE ROW LEVEL SECURITY;

-- Tickets Policies
CREATE POLICY "Users can view their own tickets"
  ON tickets
  FOR SELECT
  USING (
    auth.uid() = created_by OR
    auth.uid() = assigned_to OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'admin'
    )
  );

CREATE POLICY "Users can create tickets"
  ON tickets
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Only admins can update tickets"
  ON tickets
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'admin'
    )
  );

-- Comments Policies
CREATE POLICY "Users can view comments on their tickets"
  ON ticket_comments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tickets
      WHERE tickets.id = ticket_id
      AND (
        tickets.created_by = auth.uid() OR
        tickets.assigned_to = auth.uid() OR
        EXISTS (
          SELECT 1 FROM auth.users
          WHERE auth.users.id = auth.uid()
          AND auth.users.role = 'admin'
        )
      )
    )
  );

CREATE POLICY "Users can add comments to their tickets"
  ON ticket_comments
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tickets
      WHERE tickets.id = ticket_id
      AND (
        tickets.created_by = auth.uid() OR
        tickets.assigned_to = auth.uid() OR
        EXISTS (
          SELECT 1 FROM auth.users
          WHERE auth.users.id = auth.uid()
          AND auth.users.role = 'admin'
        )
      )
    )
  );

-- Attachments Policies
CREATE POLICY "Users can view attachments on their tickets"
  ON ticket_attachments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tickets
      WHERE tickets.id = ticket_id
      AND (
        tickets.created_by = auth.uid() OR
        tickets.assigned_to = auth.uid() OR
        EXISTS (
          SELECT 1 FROM auth.users
          WHERE auth.users.id = auth.uid()
          AND auth.users.role = 'admin'
        )
      )
    )
  );

CREATE POLICY "Users can add attachments to their tickets"
  ON ticket_attachments
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tickets
      WHERE tickets.id = ticket_id
      AND (
        tickets.created_by = auth.uid() OR
        tickets.assigned_to = auth.uid() OR
        EXISTS (
          SELECT 1 FROM auth.users
          WHERE auth.users.id = auth.uid()
          AND auth.users.role = 'admin'
        )
      )
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_tickets_created_by ON tickets(created_by);
CREATE INDEX idx_tickets_assigned_to ON tickets(assigned_to);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_ticket_comments_ticket_id ON ticket_comments(ticket_id);
CREATE INDEX idx_ticket_attachments_ticket_id ON ticket_attachments(ticket_id);
CREATE INDEX idx_ticket_attachments_comment_id ON ticket_attachments(comment_id);

-- Create function to update ticket updated_at
CREATE OR REPLACE FUNCTION update_ticket_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_ticket_timestamp
  BEFORE UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_ticket_updated_at();