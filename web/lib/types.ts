// Database types matching Supabase schema
export type NervousSystemState = 'balanced' | 'hyperarousal' | 'hypoarousal' | 'unknown'

export type PracticeType =
  | 'mood_record'
  | 'containment'
  | 'body_exercise'
  | 'regulating_resource'
  | 'worry_record'
  | 'emotion_recognition'
  | 'basic_needs_journal'
  | 'hyperarousal_resource'
  | 'hypoarousal_resource'

export type EntitlementStatus = 'active' | 'expired' | 'refunded' | 'cancelled'

export type Platform = 'ios' | 'web' | 'android'

export interface Profile {
  user_id: string
  created_at: string
  updated_at: string
  preferences: {
    reminder_times?: {
      morning_practice?: string
      evening_mood?: string
    }
    reminder_enabled?: boolean
    hide_streaks?: boolean
    face_id_enabled?: boolean
    notification_permissions?: boolean
  }
  timezone?: string
  last_sync_at?: string
}

export interface MoodRecord {
  id: string
  user_id: string
  created_at: string
  updated_at: string
  recorded_at: string
  mood_score: number
  emotions: string[]
  state?: NervousSystemState
  body_tags: string[]
  notes?: string
  device_id?: string
  synced_at?: string
}

export interface PracticeSession {
  id: string
  user_id: string
  created_at: string
  updated_at: string
  started_at: string
  completed_at?: string
  duration_sec?: number
  practice_type: PracticeType
  variant: string
  state_before?: NervousSystemState
  state_after?: NervousSystemState
  notes?: string
  metadata?: Record<string, unknown>
  completed: boolean
  helpfulness_rating?: number
  device_id?: string
  synced_at?: string
}

export interface Glimmer {
  id: string
  user_id: string
  created_at: string
  updated_at: string
  text: string
  emoji?: string
  tags: string[]
  is_pinned: boolean
  position?: number
  metadata?: Record<string, unknown>
  device_id?: string
  synced_at?: string
}

export interface ActionItem {
  id: string
  user_id: string
  created_at: string
  updated_at: string
  title: string
  description?: string
  source?: string
  due_at?: string
  completed_at?: string
  recurrence_rule?: string
  metadata?: Record<string, unknown>
  device_id?: string
  synced_at?: string
}

export interface WorryRecord {
  id: string
  user_id: string
  created_at: string
  updated_at: string
  worry_text: string
  likelihood_percent?: number
  evidence_for: string[]
  evidence_against: string[]
  balanced_thought?: string
  reviewed_at?: string
  outcome_text?: string
  metadata?: Record<string, unknown>
  device_id?: string
  synced_at?: string
}

export interface Entitlement {
  user_id: string
  product_id: string
  status: EntitlementStatus
  acquired_at: string
  expires_at?: string
  platform: Platform
  source_txn_id: string
  receipt_data?: string
  created_at: string
  updated_at: string
  metadata?: Record<string, unknown>
}

// Practice definitions (static, not from database)
export interface Practice {
  id: string
  type: PracticeType
  variant: string
  name: string
  description: string
  durationMinutes: number
  instructions?: string
  isPremium: boolean
}

// Component props types
export interface DashboardStats {
  moodRecordsToday: number
  practicesCompletedToday: number
  currentStreak: number
  actionItemsDue: number
}
