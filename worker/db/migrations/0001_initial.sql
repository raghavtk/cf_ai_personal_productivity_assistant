CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT CHECK (priority IN ('high','medium','low')),
  status TEXT CHECK (status IN ('pending','in_progress','completed','cancelled')) DEFAULT 'pending',
  category TEXT,
  subcategory TEXT,
  due_date TEXT,
  estimated_duration INTEGER,
  actual_duration INTEGER,
  note TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

CREATE TABLE IF NOT EXISTS schedule_entries (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL,
  scheduled_date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_schedule_date ON schedule_entries(scheduled_date);

CREATE TABLE IF NOT EXISTS analytics_aggregates (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  total_completed INTEGER DEFAULT 0,
  total_created INTEGER DEFAULT 0,
  avg_completion_time INTEGER,
  most_productive_hour INTEGER,
  aggregated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_requests (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL, -- e.g., parse-task, suggest-priority, estimate-duration, categorize-task, suggest-schedule
  input_ref TEXT,
  status TEXT CHECK (status IN ('success','error')) DEFAULT 'success',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  duration_ms INTEGER,
  error_message TEXT
);
