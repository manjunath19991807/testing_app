CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS datasets (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  row_count INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE datasets ADD COLUMN IF NOT EXISTS storage_provider TEXT NOT NULL DEFAULT 'local';
ALTER TABLE datasets ADD COLUMN IF NOT EXISTS file_key TEXT;
ALTER TABLE datasets ADD COLUMN IF NOT EXISTS file_url TEXT;

CREATE TABLE IF NOT EXISTS dataset_columns (
  id UUID PRIMARY KEY,
  dataset_id UUID NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  inferred_type TEXT NOT NULL CHECK (inferred_type IN ('number', 'date', 'text'))
);

CREATE TABLE IF NOT EXISTS dashboard_charts (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  dataset_id UUID NOT NULL,
  title TEXT NOT NULL,
  chart_type TEXT NOT NULL CHECK (chart_type IN ('bar', 'line', 'pie')),
  x_axis TEXT NOT NULL,
  y_axis TEXT NOT NULL,
  aggregation TEXT NOT NULL CHECK (aggregation IN ('sum', 'count', 'average')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
