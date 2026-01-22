'use client'

import { useState, useEffect, useRef } from 'react'
import { NervousSystemState } from '@/lib/types'

interface PracticeTimerProps {
  durationSeconds: number
  onComplete: (duration: number, stateBefore?: NervousSystemState, stateAfter?: NervousSystemState) => void
  onCancel: () => void
  practiceName: string
  showStateTracking?: boolean
}

const STATES: { value: NervousSystemState; label: string }[] = [
  { value: 'balanced', label: 'Balanced' },
  { value: 'hyperarousal', label: 'Hyperarousal' },
  { value: 'hypoarousal', label: 'Hypoarousal' },
  { value: 'unknown', label: 'Unknown' },
]

export default function PracticeTimer({
  durationSeconds,
  onComplete,
  onCancel,
  practiceName,
  showStateTracking = true,
}: PracticeTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(durationSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [stateBefore, setStateBefore] = useState<NervousSystemState>('unknown')
  const [stateAfter, setStateAfter] = useState<NervousSystemState>('unknown')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false)
            setIsComplete(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeRemaining])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleStart = () => {
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleComplete = () => {
    const actualDuration = durationSeconds - timeRemaining
    onComplete(actualDuration, stateBefore, stateAfter)
  }

  const progress = ((durationSeconds - timeRemaining) / durationSeconds) * 100

  if (isComplete && showStateTracking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full card p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Practice Complete! 🎉
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                How did you feel before?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STATES.map((state) => (
                  <button
                    key={state.value}
                    type="button"
                    onClick={() => setStateBefore(state.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      stateBefore === state.value
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {state.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                How do you feel now?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STATES.map((state) => (
                  <button
                    key={state.value}
                    type="button"
                    onClick={() => setStateAfter(state.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      stateAfter === state.value
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {state.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleComplete}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              Save Practice
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">{practiceName}</h2>
        
        {/* Circular Progress */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          <svg className="transform -rotate-90 w-64 h-64">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 120}`}
              strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
              className="text-primary transition-all duration-1000"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div>
              <div className="text-5xl font-bold text-foreground mb-2">
                {formatTime(timeRemaining)}
              </div>
              <div className="text-sm text-text-secondary">
                {isRunning ? 'In progress...' : isComplete ? 'Complete!' : 'Ready to start'}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 justify-center">
          {!isRunning && !isComplete && (
            <button
              onClick={handleStart}
              className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-xl transition-colors"
            >
              Start
            </button>
          )}
          {isRunning && (
            <button
              onClick={handlePause}
              className="bg-secondary hover:bg-secondary-dark text-white font-semibold py-3 px-8 rounded-xl transition-colors"
            >
              Pause
            </button>
          )}
          <button
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-8 rounded-xl transition-colors"
          >
            Exit
          </button>
        </div>

        {isComplete && !showStateTracking && (
          <button
            onClick={handleComplete}
            className="mt-4 w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-xl transition-colors"
          >
            Save Practice
          </button>
        )}
      </div>
    </div>
  )
}
