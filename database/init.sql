-- ──────────────────────────────────────────────────────────────────
-- Insurance Claims Portal – Database Schema
-- ──────────────────────────────────────────────────────────────────

-- Enums
CREATE TYPE user_role AS ENUM ('admin', 'adjuster', 'viewer');
CREATE TYPE claim_status AS ENUM ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'closed');
CREATE TYPE claim_type AS ENUM ('auto', 'home', 'health', 'life', 'liability');

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  role          user_role NOT NULL DEFAULT 'viewer',
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Claims table
CREATE TABLE IF NOT EXISTS claims (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_number    VARCHAR(20) NOT NULL UNIQUE,
  title           VARCHAR(255) NOT NULL,
  description     TEXT,
  type            claim_type NOT NULL,
  status          claim_status NOT NULL DEFAULT 'draft',
  amount_claimed  NUMERIC(12, 2) NOT NULL,
  amount_approved NUMERIC(12, 2),
  policy_number   VARCHAR(50) NOT NULL,
  claimant_name   VARCHAR(200) NOT NULL,
  claimant_email  VARCHAR(255) NOT NULL,
  claimant_phone  VARCHAR(30),
  incident_date   DATE NOT NULL,
  submitted_by    UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_to     UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_claims_status ON claims(status);
CREATE INDEX idx_claims_submitted_by ON claims(submitted_by);
CREATE INDEX idx_claims_assigned_to ON claims(assigned_to);
CREATE INDEX idx_claims_created_at ON claims(created_at DESC);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_claims_updated_at
  BEFORE UPDATE ON claims
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
