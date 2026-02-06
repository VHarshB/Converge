-- ============ EVENTS TABLE ============
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  location TEXT,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'live', 'ended')),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_status ON events(status);

-- ============ ATTENDEES TABLE ============
CREATE TABLE IF NOT EXISTS attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  ref_code TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  role TEXT CHECK (role IN ('student', 'speaker', 'organizer', 'guest')),
  checked_in_at TIMESTAMP NOT NULL DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(event_id, ref_code),
  UNIQUE(event_id, email)
);

CREATE INDEX idx_attendees_event_id ON attendees(event_id);
CREATE INDEX idx_attendees_ref_code ON attendees(ref_code);
CREATE INDEX idx_attendees_email ON attendees(email);

-- ============ CONVERSATION LOGS TABLE ============
CREATE TABLE IF NOT EXISTS conversation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  from_attendee_id UUID NOT NULL REFERENCES attendees(id) ON DELETE CASCADE,
  to_ref_code TEXT NOT NULL,
  to_attendee_id UUID REFERENCES attendees(id) ON DELETE SET NULL,
  topics TEXT[] DEFAULT '{}',
  note TEXT,
  round_label TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT false,
  deleted_reason TEXT,
  CHECK (length(note) <= 180)
);

CREATE INDEX idx_conversation_logs_event_id ON conversation_logs(event_id);
CREATE INDEX idx_conversation_logs_from_attendee_id ON conversation_logs(from_attendee_id);
CREATE INDEX idx_conversation_logs_to_attendee_id ON conversation_logs(to_attendee_id);
CREATE INDEX idx_conversation_logs_created_at ON conversation_logs(created_at);

-- ============ ADMIN USERS TABLE ============
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============ AUDIT ACTIONS TABLE ============
CREATE TABLE IF NOT EXISTS audit_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_actions_event_id ON audit_actions(event_id);
CREATE INDEX idx_audit_actions_admin_user_id ON audit_actions(admin_user_id);
CREATE INDEX idx_audit_actions_created_at ON audit_actions(created_at);

-- ============ LEADERBOARD SNAPSHOT TABLE ============
CREATE TABLE IF NOT EXISTS leaderboard_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  snapshot_data JSONB NOT NULL,
  is_locked BOOLEAN DEFAULT false,
  locked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_leaderboard_snapshots_event_id ON leaderboard_snapshots(event_id);
CREATE INDEX idx_leaderboard_snapshots_locked_at ON leaderboard_snapshots(locked_at);
