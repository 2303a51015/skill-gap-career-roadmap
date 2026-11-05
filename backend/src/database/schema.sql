-- SQLite Database Schema for Skill Gap Career Roadmap System

CREATE TABLE IF NOT EXISTS analyses (
  id TEXT PRIMARY KEY,
  target_role TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  daily_hours REAL NOT NULL,
  duration_weeks INTEGER NOT NULL,
  learning_style TEXT NOT NULL,
  match_score REAL NOT NULL,
  score_explanation TEXT NOT NULL, -- JSON: { method, weights, componentScores, details }
  matching_skills TEXT NOT NULL,   -- JSON array of skill items
  partial_skills TEXT NOT NULL,    -- JSON array of partial skill items
  missing_skills TEXT NOT NULL,    -- JSON array of missing skill items
  additional_skills TEXT NOT NULL, -- JSON array of additional skills found in resume
  qualification_gaps TEXT NOT NULL,-- JSON array of qualification gaps
  experience_gaps TEXT NOT NULL,   -- JSON array of experience gaps
  strengths TEXT NOT NULL,         -- JSON array of strength bullet points
  resume_improvements TEXT NOT NULL, -- JSON array of actionable suggestions
  limitations TEXT NOT NULL,       -- JSON array of assessment limitations
  extracted_resume_preview TEXT,   -- First 300 characters for quick reference/preview
  job_description_snippet TEXT,    -- First 300 characters of target JD
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS milestones (
  id TEXT PRIMARY KEY,
  analysis_id TEXT NOT NULL,
  milestone_index INTEGER NOT NULL,
  week_range TEXT NOT NULL,
  skill TEXT NOT NULL,
  category TEXT NOT NULL,
  why_it_matters TEXT NOT NULL,
  priority TEXT NOT NULL, -- 'High' | 'Medium' | 'Low'
  estimated_hours REAL NOT NULL,
  learning_objectives TEXT NOT NULL, -- JSON array
  resources TEXT NOT NULL,           -- JSON array: [{ title, type, url, description }]
  practical_project TEXT NOT NULL,   -- JSON object: { title, description, deliverables }
  completion_criteria TEXT NOT NULL, -- JSON array
  status TEXT NOT NULL DEFAULT 'not_started', -- 'not_started' | 'in_progress' | 'completed'
  completed_at TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (analysis_id) REFERENCES analyses(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_milestones_analysis_id ON milestones(analysis_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at DESC);
