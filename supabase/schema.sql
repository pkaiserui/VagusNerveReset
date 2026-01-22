-- Vagus Nerve Reset App - Supabase Database Schema
-- PostgreSQL 15+ with Row-Level Security (RLS)
-- Last Updated: 2026-01-22

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- CUSTOM TYPES
-- ============================================================================

CREATE TYPE nervous_system_state AS ENUM (
    'balanced',
    'hyperarousal',
    'hypoarousal',
    'unknown'
);

CREATE TYPE practice_type AS ENUM (
    'mood_record',
    'containment',
    'body_exercise',
    'regulating_resource',
    'worry_record',
    'emotion_recognition',
    'basic_needs_journal',
    'hyperarousal_resource',
    'hypoarousal_resource'
);

CREATE TYPE entitlement_status AS ENUM (
    'active',
    'expired',
    'refunded',
    'cancelled'
);

CREATE TYPE platform_type AS ENUM (
    'ios',
    'web',
    'android'
);

-- ============================================================================
-- TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- profiles: User settings and preferences
-- ----------------------------------------------------------------------------
CREATE TABLE profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Preferences (stored as JSONB for flexibility)
    preferences JSONB NOT NULL DEFAULT '{
        "reminder_times": {
            "morning_practice": "08:00",
            "evening_mood": "20:00"
        },
        "reminder_enabled": true,
        "hide_streaks": false,
        "face_id_enabled": false,
        "notification_permissions": false
    }'::JSONB,

    -- Metadata
    timezone TEXT,
    last_sync_at TIMESTAMPTZ
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);

-- Trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- daily_mood_records: Daily mood check-ins
-- ----------------------------------------------------------------------------
CREATE TABLE daily_mood_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- When the mood was recorded (may differ from created_at if offline)
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Mood data
    mood_score INTEGER NOT NULL CHECK (mood_score >= 1 AND mood_score <= 10),
    emotions TEXT[] NOT NULL DEFAULT '{}',  -- e.g., ['joy', 'gratitude', 'anxiety']
    state nervous_system_state,
    body_tags TEXT[] DEFAULT '{}',  -- e.g., ['tension', 'fatigue', 'calm']
    notes TEXT,

    -- Sync metadata
    device_id TEXT,  -- Hash of device for conflict resolution
    synced_at TIMESTAMPTZ
);

CREATE INDEX idx_mood_records_user_id ON daily_mood_records(user_id);
CREATE INDEX idx_mood_records_recorded_at ON daily_mood_records(recorded_at DESC);
CREATE INDEX idx_mood_records_user_recorded ON daily_mood_records(user_id, recorded_at DESC);

-- Unique constraint: one mood record per user per day
-- Convert to UTC timestamp first, then cast to DATE (immutable)
CREATE UNIQUE INDEX one_mood_per_day ON daily_mood_records(user_id, ((recorded_at AT TIME ZONE 'UTC')::DATE));

CREATE TRIGGER update_mood_records_updated_at
    BEFORE UPDATE ON daily_mood_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- practice_sessions: All completed practice sessions
-- ----------------------------------------------------------------------------
CREATE TABLE practice_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Session timing
    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,  -- NULL if ended early or in progress
    duration_sec INTEGER,  -- Actual duration (may be less than planned)

    -- Practice details
    practice_type practice_type NOT NULL,
    variant TEXT,  -- e.g., 'bee_breathing', 'box_breathing', 'cold_exposure'

    -- State tracking
    state_before nervous_system_state,
    state_after nervous_system_state,

    -- Additional data
    notes TEXT,
    metadata JSONB DEFAULT '{}'::JSONB,  -- Flexible field for practice-specific data

    -- Completion
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    helpfulness_rating INTEGER CHECK (helpfulness_rating >= 1 AND helpfulness_rating <= 5),

    -- Sync metadata
    device_id TEXT,
    synced_at TIMESTAMPTZ
);

CREATE INDEX idx_practice_sessions_user_id ON practice_sessions(user_id);
CREATE INDEX idx_practice_sessions_started_at ON practice_sessions(started_at DESC);
CREATE INDEX idx_practice_sessions_user_started ON practice_sessions(user_id, started_at DESC);
CREATE INDEX idx_practice_sessions_practice_type ON practice_sessions(practice_type);
CREATE INDEX idx_practice_sessions_completed ON practice_sessions(completed);

CREATE TRIGGER update_practice_sessions_updated_at
    BEFORE UPDATE ON practice_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- action_items: Tasks from basic needs journal
-- ----------------------------------------------------------------------------
CREATE TABLE action_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Task details
    title TEXT NOT NULL,
    description TEXT,
    source TEXT,  -- e.g., 'basic_needs_journal', 'manual'

    -- Scheduling
    due_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,

    -- Recurrence (optional, for future enhancement)
    recurrence_rule TEXT,  -- e.g., 'daily', 'weekly'

    -- Metadata
    metadata JSONB DEFAULT '{}'::JSONB,

    -- Sync
    device_id TEXT,
    synced_at TIMESTAMPTZ
);

CREATE INDEX idx_action_items_user_id ON action_items(user_id);
CREATE INDEX idx_action_items_due_at ON action_items(due_at);
CREATE INDEX idx_action_items_completed ON action_items(completed_at);
CREATE INDEX idx_action_items_user_due ON action_items(user_id, due_at) WHERE completed_at IS NULL;

CREATE TRIGGER update_action_items_updated_at
    BEFORE UPDATE ON action_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- glimmers: User's glimmers (moments of safety, joy, connection)
-- ----------------------------------------------------------------------------
CREATE TABLE glimmers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Glimmer content
    text TEXT NOT NULL,
    emoji TEXT,  -- Optional emoji (single character or emoji code)
    tags TEXT[] DEFAULT '{}',

    -- Organization
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    position INTEGER,  -- For manual ordering

    -- Metadata
    metadata JSONB DEFAULT '{}'::JSONB,

    -- Sync
    device_id TEXT,
    synced_at TIMESTAMPTZ
);

CREATE INDEX idx_glimmers_user_id ON glimmers(user_id);
CREATE INDEX idx_glimmers_pinned ON glimmers(is_pinned, position);
CREATE INDEX idx_glimmers_user_pinned ON glimmers(user_id, is_pinned, position);

CREATE TRIGGER update_glimmers_updated_at
    BEFORE UPDATE ON glimmers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- worry_records: Worry logs with cognitive restructuring (Premium)
-- ----------------------------------------------------------------------------
CREATE TABLE worry_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Worry content
    worry_text TEXT NOT NULL,
    likelihood_percent INTEGER CHECK (likelihood_percent >= 0 AND likelihood_percent <= 100),

    -- Evidence
    evidence_for TEXT[] DEFAULT '{}',
    evidence_against TEXT[] DEFAULT '{}',
    balanced_thought TEXT,

    -- Follow-up
    reviewed_at TIMESTAMPTZ,  -- When user checked back on this worry
    outcome_text TEXT,  -- What actually happened

    -- Metadata
    metadata JSONB DEFAULT '{}'::JSONB,

    -- Sync
    device_id TEXT,
    synced_at TIMESTAMPTZ
);

CREATE INDEX idx_worry_records_user_id ON worry_records(user_id);
CREATE INDEX idx_worry_records_created_at ON worry_records(created_at DESC);
CREATE INDEX idx_worry_records_reviewed ON worry_records(reviewed_at) WHERE reviewed_at IS NOT NULL;

CREATE TRIGGER update_worry_records_updated_at
    BEFORE UPDATE ON worry_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- entitlements: Premium purchase records
-- ----------------------------------------------------------------------------
CREATE TABLE entitlements (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,  -- e.g., 'com.vagusnervereset.premium.lifetime'
    status entitlement_status NOT NULL DEFAULT 'active',
    acquired_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,  -- NULL for lifetime purchases
    platform platform_type NOT NULL,
    source_txn_id TEXT NOT NULL,  -- Apple transaction ID, Stripe payment intent, etc.
    receipt_data TEXT,  -- Base64 receipt or verification token

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Metadata
    metadata JSONB DEFAULT '{}'::JSONB,

    PRIMARY KEY (user_id, product_id)
);

CREATE INDEX idx_entitlements_user_id ON entitlements(user_id);
CREATE INDEX idx_entitlements_status ON entitlements(status);
CREATE INDEX idx_entitlements_platform ON entitlements(platform);
CREATE INDEX idx_entitlements_source_txn ON entitlements(source_txn_id);

CREATE TRIGGER update_entitlements_updated_at
    BEFORE UPDATE ON entitlements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- device_migrations: Track local→cloud data migrations
-- ----------------------------------------------------------------------------
CREATE TABLE device_migrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    device_fingerprint_hash TEXT NOT NULL,  -- SHA-256 hash of device ID
    migrated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Migration stats
    records_migrated JSONB NOT NULL DEFAULT '{
        "mood_records": 0,
        "practice_sessions": 0,
        "glimmers": 0,
        "action_items": 0,
        "worry_records": 0
    }'::JSONB,

    -- Prevent duplicate migrations from same device
    CONSTRAINT unique_device_migration UNIQUE (user_id, device_fingerprint_hash)
);

CREATE INDEX idx_device_migrations_user_id ON device_migrations(user_id);
CREATE INDEX idx_device_migrations_device_hash ON device_migrations(device_fingerprint_hash);

-- ----------------------------------------------------------------------------
-- basic_needs_assessments: Periodic basic needs check-ins (Premium)
-- ----------------------------------------------------------------------------
CREATE TABLE basic_needs_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Assessment responses (JSONB for flexibility)
    responses JSONB NOT NULL DEFAULT '{
        "sleep": {"adequate": false, "details": ""},
        "nutrition": {"adequate": false, "details": ""},
        "safety": {"adequate": false, "details": ""},
        "connection": {"adequate": false, "details": ""},
        "purpose": {"adequate": false, "details": ""}
    }'::JSONB,

    -- Generated action items (references to action_items table)
    generated_action_item_ids UUID[],

    -- Sync
    device_id TEXT,
    synced_at TIMESTAMPTZ
);

CREATE INDEX idx_basic_needs_user_id ON basic_needs_assessments(user_id);
CREATE INDEX idx_basic_needs_created_at ON basic_needs_assessments(created_at DESC);

CREATE TRIGGER update_basic_needs_updated_at
    BEFORE UPDATE ON basic_needs_assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_mood_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE glimmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE worry_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_migrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE basic_needs_assessments ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- RLS Policies: profiles
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile"
    ON profiles FOR DELETE
    USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- RLS Policies: daily_mood_records
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view own mood records"
    ON daily_mood_records FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood records"
    ON daily_mood_records FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mood records"
    ON daily_mood_records FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own mood records"
    ON daily_mood_records FOR DELETE
    USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- RLS Policies: practice_sessions
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view own practice sessions"
    ON practice_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own practice sessions"
    ON practice_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own practice sessions"
    ON practice_sessions FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own practice sessions"
    ON practice_sessions FOR DELETE
    USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- RLS Policies: action_items
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view own action items"
    ON action_items FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own action items"
    ON action_items FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own action items"
    ON action_items FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own action items"
    ON action_items FOR DELETE
    USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- RLS Policies: glimmers
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view own glimmers"
    ON glimmers FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own glimmers"
    ON glimmers FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own glimmers"
    ON glimmers FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own glimmers"
    ON glimmers FOR DELETE
    USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- RLS Policies: worry_records
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view own worry records"
    ON worry_records FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own worry records"
    ON worry_records FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own worry records"
    ON worry_records FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own worry records"
    ON worry_records FOR DELETE
    USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- RLS Policies: entitlements
-- ----------------------------------------------------------------------------
-- Users can read their own entitlements
CREATE POLICY "Users can view own entitlements"
    ON entitlements FOR SELECT
    USING (auth.uid() = user_id);

-- Only service role can insert/update entitlements (via Edge Functions)
-- No user-facing INSERT/UPDATE policies

-- Users cannot delete entitlements (handled by support/admin)

-- ----------------------------------------------------------------------------
-- RLS Policies: device_migrations
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view own device migrations"
    ON device_migrations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own device migrations"
    ON device_migrations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- No update or delete (migrations are immutable records)

-- ----------------------------------------------------------------------------
-- RLS Policies: basic_needs_assessments
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view own basic needs assessments"
    ON basic_needs_assessments FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own basic needs assessments"
    ON basic_needs_assessments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own basic needs assessments"
    ON basic_needs_assessments FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own basic needs assessments"
    ON basic_needs_assessments FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Function: Check if user has active premium entitlement
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION has_premium_entitlement(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM entitlements
        WHERE user_id = p_user_id
          AND status = 'active'
          AND (expires_at IS NULL OR expires_at > NOW())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- Function: Get current streak for a practice type
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_practice_streak(
    p_user_id UUID,
    p_practice_type practice_type
)
RETURNS INTEGER AS $$
DECLARE
    v_streak INTEGER := 0;
    v_current_date DATE := CURRENT_DATE;
    v_has_completion BOOLEAN;
BEGIN
    LOOP
        -- Check if there's a completion on v_current_date
        SELECT EXISTS (
            SELECT 1
            FROM practice_sessions
            WHERE user_id = p_user_id
              AND practice_type = p_practice_type
              AND completed = TRUE
              AND DATE(started_at) = v_current_date
        ) INTO v_has_completion;

        IF NOT v_has_completion THEN
            -- Streak broken
            EXIT;
        END IF;

        v_streak := v_streak + 1;
        v_current_date := v_current_date - INTERVAL '1 day';
    END LOOP;

    RETURN v_streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- Function: Get mood trend (average mood score over date range)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_mood_trend(
    p_user_id UUID,
    p_start_date TIMESTAMPTZ,
    p_end_date TIMESTAMPTZ
)
RETURNS TABLE(
    date DATE,
    avg_mood NUMERIC,
    record_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        DATE(recorded_at) AS date,
        ROUND(AVG(mood_score)::NUMERIC, 1) AS avg_mood,
        COUNT(*)::INTEGER AS record_count
    FROM daily_mood_records
    WHERE user_id = p_user_id
      AND recorded_at BETWEEN p_start_date AND p_end_date
    GROUP BY DATE(recorded_at)
    ORDER BY DATE(recorded_at);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- Function: Calculate practice completion rate
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_completion_rate(
    p_user_id UUID,
    p_practice_type practice_type,
    p_start_date TIMESTAMPTZ,
    p_end_date TIMESTAMPTZ
)
RETURNS NUMERIC AS $$
DECLARE
    v_total_days INTEGER;
    v_days_with_completion INTEGER;
    v_rate NUMERIC;
BEGIN
    -- Calculate total days in range
    v_total_days := (p_end_date::DATE - p_start_date::DATE) + 1;

    -- Count days with at least one completion
    SELECT COUNT(DISTINCT DATE(started_at))
    INTO v_days_with_completion
    FROM practice_sessions
    WHERE user_id = p_user_id
      AND practice_type = p_practice_type
      AND completed = TRUE
      AND started_at BETWEEN p_start_date AND p_end_date;

    -- Calculate rate (0-100%)
    IF v_total_days > 0 THEN
        v_rate := ROUND((v_days_with_completion::NUMERIC / v_total_days::NUMERIC) * 100, 1);
    ELSE
        v_rate := 0;
    END IF;

    RETURN v_rate;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SEED DATA (Optional: Example practices, categories)
-- ============================================================================

-- Note: Practice definitions are stored in app code, not database
-- This schema only stores user-generated data (sessions, moods, etc.)

-- ============================================================================
-- STORAGE BUCKETS (for Supabase Storage)
-- ============================================================================

-- These are created via Supabase CLI or Dashboard, not SQL
-- Documented here for reference:

-- audio-guides (public bucket)
--   - Practice audio files (guided meditations, breathing exercises)
--   - Public read access
--   - Only admins can upload

-- user-exports (private bucket)
--   - User-generated PDF/CSV exports
--   - RLS: Users can only access their own exports
--   - Auto-delete after 7 days (via storage policies)

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Additional composite indexes for common queries

-- Mood records: Recent moods with filtering
CREATE INDEX idx_mood_recent_with_state ON daily_mood_records(user_id, recorded_at DESC, state)
    WHERE state IS NOT NULL;

-- Practice sessions: Recent sessions by type
CREATE INDEX idx_practice_recent_by_type ON practice_sessions(user_id, practice_type, started_at DESC)
    WHERE completed = TRUE;

-- Action items: Upcoming incomplete tasks
CREATE INDEX idx_action_upcoming ON action_items(user_id, due_at ASC)
    WHERE completed_at IS NULL AND due_at IS NOT NULL;

-- Glimmers: Pinned glimmers for quick access
CREATE INDEX idx_glimmers_pinned_first ON glimmers(user_id, is_pinned DESC, position ASC);

-- ============================================================================
-- VIEWS (Optional: Pre-computed queries)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- View: User dashboard summary (today's progress)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW user_dashboard_summary AS
SELECT
    user_id,
    CURRENT_DATE AS summary_date,
    (SELECT COUNT(*)
     FROM daily_mood_records
     WHERE user_id = p.user_id
       AND DATE(recorded_at) = CURRENT_DATE) AS mood_records_today,
    (SELECT COUNT(*)
     FROM practice_sessions
     WHERE user_id = p.user_id
       AND DATE(started_at) = CURRENT_DATE
       AND completed = TRUE) AS practices_completed_today,
    (SELECT COUNT(*)
     FROM action_items
     WHERE user_id = p.user_id
       AND DATE(due_at) = CURRENT_DATE
       AND completed_at IS NULL) AS action_items_due_today
FROM profiles p;

-- Note: Views inherit RLS from underlying tables

-- ============================================================================
-- COMMENTS (Documentation)
-- ============================================================================

COMMENT ON TABLE profiles IS 'User profiles with preferences and settings';
COMMENT ON TABLE daily_mood_records IS 'Daily mood check-ins with emotions and nervous system state';
COMMENT ON TABLE practice_sessions IS 'Completed practice sessions (containment, body exercises, resources)';
COMMENT ON TABLE action_items IS 'User tasks generated from basic needs journal or created manually';
COMMENT ON TABLE glimmers IS 'User''s glimmers (moments of safety, joy, connection)';
COMMENT ON TABLE worry_records IS 'Worry logs with cognitive restructuring (Premium feature)';
COMMENT ON TABLE entitlements IS 'Premium purchase records (managed by Edge Functions)';
COMMENT ON TABLE device_migrations IS 'Tracks local-to-cloud data migrations to prevent duplicates';
COMMENT ON TABLE basic_needs_assessments IS 'Periodic basic needs check-ins (Premium feature)';

COMMENT ON FUNCTION has_premium_entitlement IS 'Check if user has an active premium entitlement';
COMMENT ON FUNCTION get_practice_streak IS 'Calculate current consecutive-day streak for a practice type';
COMMENT ON FUNCTION get_mood_trend IS 'Get daily average mood scores over a date range';
COMMENT ON FUNCTION get_completion_rate IS 'Calculate percentage of days with practice completions';

-- ============================================================================
-- MIGRATIONS & VERSIONING
-- ============================================================================

-- Track schema version for future migrations
CREATE TABLE IF NOT EXISTS schema_migrations (
    version TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    description TEXT
);

INSERT INTO schema_migrations (version, description)
VALUES ('1.0.0', 'Initial schema: users, moods, practices, glimmers, entitlements, migrations');

-- ============================================================================
-- CLEANUP & MAINTENANCE
-- ============================================================================

-- Future: Add scheduled jobs for:
-- - Archiving old records (> 2 years)
-- - Cleaning up expired entitlements
-- - Deleting orphaned exports from Storage

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
