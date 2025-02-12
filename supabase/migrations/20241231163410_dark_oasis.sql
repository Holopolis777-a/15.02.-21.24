/*
  # Initial Schema Setup for FahrzeugManager Pro

  1. Tables
    - users
    - companies
    - brokers
    - vehicles (regular, company, salary)
    - vehicle_requests
    - support_tickets

  2. Security
    - Enable RLS on all tables
    - Add policies for each role
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id uuid UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'employer', 'broker', 'employee_normal', 'employee_salary', 'customer')),
  first_name text NOT NULL,
  last_name text NOT NULL,
  company_id uuid,
  broker_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Companies Table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  address text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Brokers Table
CREATE TABLE IF NOT EXISTS brokers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  commission_rate decimal NOT NULL,
  contact_email text NOT NULL,
  contact_phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  type text NOT NULL CHECK (type IN ('regular', 'company', 'salary')),
  brand text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  price decimal NOT NULL,
  status text NOT NULL CHECK (status IN ('available', 'pending', 'taken')),
  image_url text,
  mileage integer NOT NULL,
  fuel text NOT NULL,
  transmission text NOT NULL,
  power integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Vehicle Requests Table
CREATE TABLE IF NOT EXISTS vehicle_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id uuid REFERENCES vehicles(id),
  user_id uuid REFERENCES users(id),
  status text NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  request_type text NOT NULL CHECK (request_type IN ('inquiry', 'reservation', 'salary_conversion')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Support Tickets Table
CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id),
  title text NOT NULL,
  description text NOT NULL,
  status text NOT NULL CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority text NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE brokers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can view their own data"
  ON users
  FOR SELECT
  USING (auth.uid() = auth_id);

-- Companies policies
CREATE POLICY "Employers and admins can view company data"
  ON companies
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND (users.role = 'admin' OR users.role = 'employer')
    )
  );

-- Vehicles policies
CREATE POLICY "Everyone can view available vehicles"
  ON vehicles
  FOR SELECT
  USING (status = 'available');

-- Vehicle requests policies
CREATE POLICY "Users can view their own requests"
  ON vehicle_requests
  FOR SELECT
  USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Support tickets policies
CREATE POLICY "Users can view their own tickets"
  ON support_tickets
  FOR SELECT
  USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON users(auth_id);
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_broker_id ON users(broker_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_type ON vehicles(type);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicle_requests_status ON vehicle_requests(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);