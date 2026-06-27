-- D1 Schema for AI Video Tool Radar

CREATE TABLE IF NOT EXISTS tools (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  official_url TEXT,
  category TEXT,
  primary_use_case TEXT,

  free_access_type TEXT,
  free_limit TEXT,
  watermark TEXT,
  audio_support TEXT,

  max_duration INTEGER,

  quality_score INTEGER CHECK(quality_score IS NULL OR (quality_score >= 1 AND quality_score <= 5)),
  speed_score INTEGER CHECK(speed_score IS NULL OR (speed_score >= 1 AND speed_score <= 5)),
  ease_score INTEGER CHECK(ease_score IS NULL OR (ease_score >= 1 AND ease_score <= 5)),

  description_en TEXT,
  description_zh TEXT,

  last_verified TEXT,
  source_url TEXT,

  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Admin credentials table
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category);
CREATE INDEX IF NOT EXISTS idx_tools_free_access ON tools(free_access_type);
CREATE INDEX IF NOT EXISTS idx_tools_watermark ON tools(watermark);
CREATE INDEX IF NOT EXISTS idx_tools_audio ON tools(audio_support);
