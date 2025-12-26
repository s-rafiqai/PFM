-- Priority Focus Manager Database Schema

-- Managers table
CREATE TABLE IF NOT EXISTS managers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Team Members table
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    manager_id UUID NOT NULL REFERENCES managers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Priorities table
CREATE TABLE IF NOT EXISTS priorities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_team_members_manager_id ON team_members(manager_id);
CREATE INDEX IF NOT EXISTS idx_team_members_display_order ON team_members(display_order);
CREATE INDEX IF NOT EXISTS idx_priorities_team_member_id ON priorities(team_member_id);
CREATE INDEX IF NOT EXISTS idx_priorities_display_order ON priorities(display_order);
CREATE INDEX IF NOT EXISTS idx_priorities_status ON priorities(status);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_managers_updated_at BEFORE UPDATE ON managers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_priorities_updated_at BEFORE UPDATE ON priorities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
