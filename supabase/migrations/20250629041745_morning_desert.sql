/*
  # Initial Schema for Yhteys Platform

  1. New Tables
    - `startups`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `description` (text)
      - `industry` (text)
      - `location` (text)
      - `website` (text)
      - `contact_email` (text)
      - `contact_phone` (text)
      - `team_members` (jsonb)
      - `projects` (jsonb)
      - `tags` (text[])
      - `funding_stage` (text)
      - `team_size` (integer)
      - `founded_year` (integer)
      - `rating` (decimal)
      - `profile_views` (integer)
      - `projects_submitted` (integer)
      - `completed_projects` (integer)
      - `average_rating` (decimal)
      - `total_ratings` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `enterprises`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `company_name` (text)
      - `contact_person` (text)
      - `email` (text)
      - `industry` (text)
      - `company_size` (text)
      - `location` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `project_requests`
      - `id` (uuid, primary key)
      - `enterprise_id` (uuid, references enterprises)
      - `startup_id` (uuid, references startups)
      - `title` (text)
      - `description` (text)
      - `budget` (text)
      - `timeline` (text)
      - `requirements` (text[])
      - `status` (text)
      - `message` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `ai_recommendations`
      - `id` (uuid, primary key)
      - `enterprise_id` (uuid, references enterprises)
      - `project_description` (text)
      - `recommendations` (jsonb)
      - `analysis_data` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for cross-table access (enterprises can view startups, etc.)
*/

-- Create startups table
CREATE TABLE IF NOT EXISTS startups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  industry text,
  location text,
  website text,
  contact_email text NOT NULL,
  contact_phone text,
  team_members jsonb DEFAULT '[]'::jsonb,
  projects jsonb DEFAULT '[]'::jsonb,
  tags text[] DEFAULT ARRAY[]::text[],
  funding_stage text,
  team_size integer DEFAULT 1,
  founded_year integer,
  rating decimal DEFAULT 0,
  profile_views integer DEFAULT 0,
  projects_submitted integer DEFAULT 0,
  completed_projects integer DEFAULT 0,
  average_rating decimal DEFAULT 0,
  total_ratings integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create enterprises table
CREATE TABLE IF NOT EXISTS enterprises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  contact_person text NOT NULL,
  email text NOT NULL,
  industry text,
  company_size text,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create project_requests table
CREATE TABLE IF NOT EXISTS project_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enterprise_id uuid REFERENCES enterprises(id) ON DELETE CASCADE,
  startup_id uuid REFERENCES startups(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  budget text,
  timeline text,
  requirements text[] DEFAULT ARRAY[]::text[],
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ai_recommendations table
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enterprise_id uuid REFERENCES enterprises(id) ON DELETE CASCADE,
  project_description text NOT NULL,
  recommendations jsonb DEFAULT '[]'::jsonb,
  analysis_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprises ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;

-- Policies for startups table
CREATE POLICY "Users can read all startup profiles"
  ON startups
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own startup profile"
  ON startups
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for enterprises table
CREATE POLICY "Users can read all enterprise profiles"
  ON enterprises
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own enterprise profile"
  ON enterprises
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for project_requests table
CREATE POLICY "Enterprises can manage their project requests"
  ON project_requests
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM enterprises 
      WHERE enterprises.id = project_requests.enterprise_id 
      AND enterprises.user_id = auth.uid()
    )
  );

CREATE POLICY "Startups can view and respond to their project requests"
  ON project_requests
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM startups 
      WHERE startups.id = project_requests.startup_id 
      AND startups.user_id = auth.uid()
    )
  );

-- Policies for ai_recommendations table
CREATE POLICY "Enterprises can manage their AI recommendations"
  ON ai_recommendations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM enterprises 
      WHERE enterprises.id = ai_recommendations.enterprise_id 
      AND enterprises.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_startups_user_id ON startups(user_id);
CREATE INDEX IF NOT EXISTS idx_startups_industry ON startups(industry);
CREATE INDEX IF NOT EXISTS idx_startups_location ON startups(location);
CREATE INDEX IF NOT EXISTS idx_startups_tags ON startups USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_enterprises_user_id ON enterprises(user_id);
CREATE INDEX IF NOT EXISTS idx_project_requests_enterprise_id ON project_requests(enterprise_id);
CREATE INDEX IF NOT EXISTS idx_project_requests_startup_id ON project_requests(startup_id);
CREATE INDEX IF NOT EXISTS idx_project_requests_status ON project_requests(status);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_enterprise_id ON ai_recommendations(enterprise_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_startups_updated_at 
  BEFORE UPDATE ON startups 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enterprises_updated_at 
  BEFORE UPDATE ON enterprises 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_requests_updated_at 
  BEFORE UPDATE ON project_requests 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();