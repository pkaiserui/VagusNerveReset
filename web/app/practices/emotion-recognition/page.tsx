'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import PracticeTimer from '@/components/PracticeTimer'

const EMOTIONS = [
  'Joy', 'Anger', 'Fear', 'Sadness', 'Disgust', 'Surprise',
  'Contentment', 'Frustration', 'Anxiety', 'Gratitude', 'Shame', 'Guilt'
]

const BODY_LOCATIONS = [
  'Head', 'Neck', 'Chest', 'Stomach', 'Back', 'Arms', 'Legs', 'Whole body'
]

export default function EmotionRecognitionPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(1)
  const [selectedEmotion, setSelectedEmotion] = useState('')
  const [bodyLocation, setBodyLocation] = useState('')
  const [intensityBefore, setIntensityBefore] = useState(5)
  const [intensityAfter, setIntensityAfter] = useState(5)
  const [isTimerActive, setIsTimerActive] = useState(false)

  const handleStartTimer = () => {
    if (!selectedEmotion || !bodyLocation) {
      alert('Please select an emotion and body location')
      return
    }
    setIsTimerActive(true)
  }

  const handleTimerComplete = async (duration: number) => {
    try {
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
          practice_type: 'emotion_recognition',
          variant: 'sit_with_emotion',
          completed: true,
          metadata: {
            emotion: selectedEmotion,
            body_location: bodyLocation,
            intensity_before: intensityBefore,
            intensity_after: intensityAfter,
          },
        })

      if (error) throw error

      router.push('/dashboard?practice=completed')
    } catch (err) {
      console.error('Failed to save practice:', err)
      alert('Failed to save practice. Please try again.')
    }
  }

  if (isTimerActive) {
    return (
      <PracticeTimer
        durationSeconds={90}
        onComplete={handleTimerComplete}
        onCancel={() => setIsTimerActive(false)}
        practiceName="Sit with Emotion"
        showStateTracking={false}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="lg:hidden border-b border-gray-200 bg-surface sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">Emotion Recognition</h1>
            <Link href="/practices" className="p-2 text-text-secondary hover:text-foreground">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 lg:py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Recognize & Sit with Emotions</h2>
          <p className="text-text-secondary">Emotional tolerance practice</p>
        </div>

        <div className="space-y-6">
          {/* Step 1: Select Emotion */}
          <div>
            <label className="block text-lg font-semibold text-foreground mb-4">
              What emotion are you feeling?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {EMOTIONS.map((emotion) => (
                <button
                  key={emotion}
                  type="button"
                  onClick={() => setSelectedEmotion(emotion)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    selectedEmotion === emotion
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {emotion}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Body Location */}
          <div>
            <label className="block text-lg font-semibold text-foreground mb-4">
              Where in your body do you feel it?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {BODY_LOCATIONS.map((location) => (
                <button
                  key={location}
                  type="button"
                  onClick={() => setBodyLocation(location)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    bodyLocation === location
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {location}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Intensity Before */}
          <div>
            <label className="block text-lg font-semibold text-foreground mb-4">
              How intense is it right now? (0-10)
            </label>
            <div className="space-y-4">
              <input
                type="range"
                min="0"
                max="10"
                value={intensityBefore}
                onChange={(e) => setIntensityBefore(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between items-center">
                <span className="text-3xl font-bold text-primary">{intensityBefore}</span>
                <div className="flex gap-2 text-sm text-text-secondary">
                  <span>0</span>
                  <span className="flex-1"></span>
                  <span>10</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6 bg-info/10 border border-info/20">
            <p className="text-foreground mb-2">
              <strong>Next:</strong> We'll sit with this emotion for 90 seconds. 
              This practice helps build emotional tolerance.
            </p>
          </div>

          <button
            onClick={handleStartTimer}
            disabled={!selectedEmotion || !bodyLocation}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start 90-Second Practice
          </button>
        </div>
      </div>
    </div>
  )
}
