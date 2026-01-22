'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { NervousSystemState } from '@/lib/types'

const EMOTIONS = [
  { id: 'joy', label: 'Joy', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'anger', label: 'Anger', color: 'bg-red-100 text-red-800' },
  { id: 'fear', label: 'Fear', color: 'bg-purple-100 text-purple-800' },
  { id: 'sadness', label: 'Sadness', color: 'bg-blue-100 text-blue-800' },
  { id: 'disgust', label: 'Disgust', color: 'bg-green-100 text-green-800' },
  { id: 'surprise', label: 'Surprise', color: 'bg-orange-100 text-orange-800' },
  { id: 'contentment', label: 'Contentment', color: 'bg-teal-100 text-teal-800' },
  { id: 'frustration', label: 'Frustration', color: 'bg-amber-100 text-amber-800' },
  { id: 'anxiety', label: 'Anxiety', color: 'bg-pink-100 text-pink-800' },
  { id: 'gratitude', label: 'Gratitude', color: 'bg-emerald-100 text-emerald-800' },
]

const BODY_TAGS = [
  { id: 'tension', label: 'Tension' },
  { id: 'fatigue', label: 'Fatigue' },
  { id: 'energy', label: 'Energy' },
  { id: 'pain', label: 'Pain' },
  { id: 'restlessness', label: 'Restlessness' },
  { id: 'calm', label: 'Calm' },
]

const STATES: { value: NervousSystemState; label: string }[] = [
  { value: 'balanced', label: 'Balanced' },
  { value: 'hyperarousal', label: 'Hyperarousal (Activated)' },
  { value: 'hypoarousal', label: 'Hypoarousal (Shut Down)' },
  { value: 'unknown', label: 'Unknown' },
]

export default function MoodRecordPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [moodScore, setMoodScore] = useState(5)
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([])
  const [selectedState, setSelectedState] = useState<NervousSystemState>('unknown')
  const [selectedBodyTags, setSelectedBodyTags] = useState<string[]>([])
  const [notes, setNotes] = useState('')

  const toggleEmotion = (emotionId: string) => {
    setSelectedEmotions(prev =>
      prev.includes(emotionId)
        ? prev.filter(id => id !== emotionId)
        : [...prev, emotionId]
    )
  }

  const toggleBodyTag = (tagId: string) => {
    setSelectedBodyTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { error: insertError } = await supabase
        .from('daily_mood_records')
        .insert({
          user_id: user.id,
          recorded_at: new Date().toISOString(),
          mood_score: moodScore,
          emotions: selectedEmotions,
          state: selectedState,
          body_tags: selectedBodyTags,
          notes: notes.trim() || null,
        })

      if (insertError) throw insertError

      router.push('/dashboard?mood=saved')
    } catch (err: any) {
      setError(err.message || 'Failed to save mood record')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden border-b border-gray-200 bg-surface sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">Mood Record</h1>
            <Link
              href="/dashboard"
              className="p-2 text-text-secondary hover:text-foreground"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 lg:py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">How was your day?</h2>
          <p className="text-text-secondary">Take a moment to reflect on your day</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Mood Score */}
          <div>
            <label className="block text-lg font-semibold text-foreground mb-4">
              Overall mood (1-10)
            </label>
            <div className="space-y-4">
              <input
                type="range"
                min="1"
                max="10"
                value={moodScore}
                onChange={(e) => setMoodScore(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between items-center">
                <span className="text-4xl font-bold text-primary">{moodScore}</span>
                <div className="flex gap-2 text-sm text-text-secondary">
                  <span>1</span>
                  <span className="flex-1"></span>
                  <span>10</span>
                </div>
              </div>
            </div>
          </div>

          {/* Emotions */}
          <div>
            <label className="block text-lg font-semibold text-foreground mb-4">
              What emotions did you feel? (select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {EMOTIONS.map((emotion) => (
                <button
                  key={emotion.id}
                  type="button"
                  onClick={() => toggleEmotion(emotion.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedEmotions.includes(emotion.id)
                      ? `${emotion.color} ring-2 ring-offset-2 ring-primary`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {emotion.label}
                </button>
              ))}
            </div>
          </div>

          {/* Nervous System State */}
          <div>
            <label className="block text-lg font-semibold text-foreground mb-4">
              What was your nervous system state?
            </label>
            <div className="space-y-2">
              {STATES.map((state) => (
                <label
                  key={state.value}
                  className="flex items-center p-4 rounded-xl border-2 cursor-pointer transition-colors hover:bg-gray-50"
                  style={{
                    borderColor: selectedState === state.value ? 'var(--primary)' : 'transparent',
                    backgroundColor: selectedState === state.value ? 'var(--primary)' + '10' : 'transparent',
                  }}
                >
                  <input
                    type="radio"
                    name="state"
                    value={state.value}
                    checked={selectedState === state.value}
                    onChange={(e) => setSelectedState(e.target.value as NervousSystemState)}
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-foreground">{state.label}</span>
                  </div>
                  {selectedState === state.value && (
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Body Tags */}
          <div>
            <label className="block text-lg font-semibold text-foreground mb-4">
              Body sensations (optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {BODY_TAGS.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleBodyTag(tag.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedBodyTags.includes(tag.id)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-lg font-semibold text-foreground mb-4">
              Any notes? (optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Add any thoughts or observations..."
            />
            <p className="mt-2 text-sm text-text-secondary text-right">
              {notes.length}/500
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-error/10 text-error">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-foreground font-semibold text-center hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Mood Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
