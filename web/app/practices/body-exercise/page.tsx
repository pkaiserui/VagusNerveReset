'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { getPracticesByType } from '@/lib/practices'
import PracticeTimer from '@/components/PracticeTimer'

const BODY_EXERCISES = getPracticesByType('body_exercise')

export default function BodyExercisePage() {
  const router = useRouter()
  const [selectedPractice, setSelectedPractice] = useState<typeof BODY_EXERCISES[0] | null>(null)
  const [isTimerActive, setIsTimerActive] = useState(false)

  const handleStartPractice = (practice: typeof BODY_EXERCISES[0]) => {
    setSelectedPractice(practice)
    setIsTimerActive(true)
  }

  const handleComplete = async (
    duration: number,
    stateBefore?: string,
    stateAfter?: string
  ) => {
    if (!selectedPractice) return

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { error } = await supabase
        .from('practice_sessions')
        .insert({
          user_id: user.id,
          started_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
          duration_sec: duration,
          practice_type: 'body_exercise',
          variant: selectedPractice.variant,
          state_before: stateBefore as any,
          state_after: stateAfter as any,
          completed: true,
        })

      if (error) throw error

      router.push('/dashboard?practice=completed')
    } catch (err) {
      console.error('Failed to save practice:', err)
      alert('Failed to save practice. Please try again.')
    }
  }

  const handleCancel = () => {
    setIsTimerActive(false)
    setSelectedPractice(null)
  }

  if (isTimerActive && selectedPractice) {
    return (
      <PracticeTimer
        durationSeconds={selectedPractice.durationMinutes * 60}
        onComplete={handleComplete}
        onCancel={handleCancel}
        practiceName={selectedPractice.name}
        showStateTracking={true}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden border-b border-gray-200 bg-surface sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">Body Exercises</h1>
            <Link
              href="/practices"
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
          <h2 className="text-3xl font-bold text-foreground mb-2">Body Exercises</h2>
          <p className="text-text-secondary">
            Physical practices to activate your vagus nerve
          </p>
        </div>

        <div className="space-y-4">
          {BODY_EXERCISES.map((practice) => (
            <div key={practice.id} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-foreground">
                      {practice.name}
                    </h3>
                    {practice.isPremium && (
                      <span className="px-2 py-1 text-xs font-semibold bg-accent/10 text-accent rounded-full">
                        Premium
                      </span>
                    )}
                  </div>
                  <p className="text-text-secondary mb-2">{practice.description}</p>
                  <p className="text-sm text-text-tertiary">
                    Duration: {practice.durationMinutes} minutes
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleStartPractice(practice)}
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-xl transition-colors"
              >
                Start Practice
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
