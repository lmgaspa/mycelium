CREATE TABLE IF NOT EXISTS auth_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(320) NOT NULL,
  display_name VARCHAR(120) NOT NULL,
  password_hash VARCHAR(255),
  google_subject VARCHAR(255),
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  locale VARCHAR(2) NOT NULL DEFAULT 'pt' CHECK (locale IN ('pt', 'en', 'es')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT auth_users_login_method CHECK (password_hash IS NOT NULL OR google_subject IS NOT NULL)
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_auth_users_email_lower ON auth_users (lower(email));
CREATE UNIQUE INDEX IF NOT EXISTS uq_auth_users_google_subject ON auth_users (google_subject) WHERE google_subject IS NOT NULL;

CREATE TABLE IF NOT EXISTS auth_sessions (
  token_hash CHAR(64) PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id ON auth_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_expires_at ON auth_sessions(expires_at);

CREATE TABLE IF NOT EXISTS auth_action_tokens (
  token_hash CHAR(64) PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  purpose VARCHAR(32) NOT NULL CHECK (purpose IN ('confirm-email', 'reset-password', 'change-email')),
  new_email VARCHAR(320),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_auth_action_tokens_user_purpose ON auth_action_tokens(user_id, purpose);
CREATE INDEX IF NOT EXISTS idx_auth_action_tokens_expires_at ON auth_action_tokens(expires_at);
