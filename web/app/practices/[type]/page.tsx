'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { getPracticesByType, getPracticeByTypeAndVariant } from '@/lib/practices'
import PracticeTimer from '@/components/PracticeTimer'
import { PracticeType } from '@/lib/types'

export default function PracticeTypePage() {
  const router = useRouter()
  const params = useParams()
  const type = params.type as PracticeType
  const [selectedPractice, setSelectedPractice] = useState<any>(null)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)

  const practices = getPracticesByType(type)

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return
    
    async function checkPremium() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { checkPremiumStatusClient } = await import('@/lib/premium-client')
        const status = await checkPremiumStatusClient(user.id)
        setIsPremium(status.isPremium)
      }
      setLoading(false)
    }
    checkPremium()
  }, [])

  const handleStartPractice = (practice: typeof practices[0]) => {
    if (practice.isPremium && !isPremium) {
      router.push('/premium')
      return
    }
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
          practice_type: type,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    )
  }

  const categoryNames: Record<PracticeType, string> = {
    mood_record: 'Daily Mood Record',
    containment: 'Containment Exercises',
    body_exercise: 'Body Exercises',
    regulating_resource: 'Regulating Resources',
    worry_record: 'Worry Record',
    emotion_recognition: 'Emotion Recognition',
    basic_needs_journal: 'Basic Needs Journal',
    hyperarousal_resource: 'Hyperarousal Resources',
    hypoarousal_resource: 'Hypoarousal Resources',
  }

  const categoryName = categoryNames[type] || 'Practice'

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden border-b border-gray-200 bg-surface sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">{categoryName}</h1>
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
          <h2 className="text-3xl font-bold text-foreground mb-2">{categoryName}</h2>
          <p className="text-text-secondary">
            Choose a practice to begin
          </p>
        </div>

        {practices.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-text-secondary">No practices available for this category.</p>
            <Link
              href="/practices"
              className="mt-4 inline-block text-primary hover:text-primary-dark font-semibold"
            >
              ← Back to Practices
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {practices.map((practice) => {
              const isLocked = practice.isPremium && !isPremium
              
              return (
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
                        {isLocked && (
                          <svg className="w-5 h-5 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
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
                    disabled={isLocked}
                    className={`w-full font-semibold py-3 px-4 rounded-xl transition-colors ${
                      isLocked
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-primary hover:bg-primary-dark text-white'
                    }`}
                  >
                    {isLocked ? 'Unlock with Premium' : 'Start Practice'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
