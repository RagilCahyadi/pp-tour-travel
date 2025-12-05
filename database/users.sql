CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email_address TEXT,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_sign_in_at TIMESTAMP WITH TIME ZONE,
  banned_at TIMESTAMP WITH TIME ZONE,
  is_admin BOOLEAN DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows admins to do everything
CREATE POLICY admin_all ON users
  TO authenticated
  USING (is_admin = true OR auth.uid()::text = id)
  WITH CHECK (is_admin = true OR auth.uid()::text = id);

-- Create a policy that allows users to read their own data
CREATE POLICY user_read_own ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id);

-- Indexes for faster lookups
CREATE INDEX idx_users_email ON users(email_address);
CREATE INDEX idx_users_username ON users(username);

-- updated_at auto-update trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();