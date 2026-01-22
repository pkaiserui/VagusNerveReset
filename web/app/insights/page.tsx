'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

type TimeRange = '7d' | '30d' | '90d'

export default function InsightsPage() {
  const router = useRouter()
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<TimeRange>('30d')
  const [moodData, setMoodData] = useState<any[]>([])
  const [practiceData, setPracticeData] = useState<any[]>([])

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return
    
    async function loadData() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { checkPremiumStatusClient } = await import('@/lib/premium-client')
      const status = await checkPremiumStatusClient(user.id)
      setIsPremium(status.isPremium)

      if (status.isPremium) {
        // Calculate date range
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)

        // Fetch mood records
        const { data: moods } = await supabase
          .from('daily_mood_records')
          .select('*')
          .eq('user_id', user.id)
          .gte('recorded_at', startDate.toISOString())
          .order('recorded_at', { ascending: true })

        // Fetch practice sessions
        const { data: practices } = await supabase
          .from('practice_sessions')
          .select('*')
          .eq('user_id', user.id)
          .eq('completed', true)
          .gte('started_at', startDate.toISOString())

        setMoodData(moods || [])
        setPracticeData(practices || [])
      }

      setLoading(false)
    }
    loadData()
  }, [timeRange])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    )
  }

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full card p-8 text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Premium Feature</h2>
          <p className="text-text-secondary mb-6">
            Insights are available with Premium. Unlock data visualization and correlations with a one-time purchase.
          </p>
          <Link
            href="/premium"
            className="block w-full bg-accent hover:bg-accent-dark text-white font-semibold py-3 px-4 rounded-xl transition-colors"
          >
            Unlock Premium
          </Link>
          <Link href="/dashboard" className="block mt-4 text-text-secondary hover:text-foreground">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const avgMood = moodData.length > 0
    ? moodData.reduce((sum, m) => sum + m.mood_score, 0) / moodData.length
    : 0

  const practiceCounts = practiceData.reduce((acc, p) => {
    acc[p.practice_type] = (acc[p.practice_type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="min-h-screen bg-background">
      <header className="lg:hidden border-b border-gray-200 bg-surface sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">Insights</h1>
            <Link href="/dashboard" className="p-2 text-text-secondary hover:text-foreground">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 lg:py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Insights</h2>
            <p className="text-text-secondary">Your wellness patterns and trends</p>
          </div>
          <div className="flex gap-2">
            {(['7d', '30d', '90d'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Mood Trends</h3>
            {moodData.length > 0 ? (
              <div>
                <div className="text-3xl font-bold text-primary mb-2">
                  {avgMood.toFixed(1)}/10
                </div>
                <p className="text-sm text-text-secondary">
                  Average mood over {timeRange}
                </p>
                <p className="text-sm text-text-secondary mt-2">
                  {moodData.length} mood record{moodData.length !== 1 ? 's' : ''}
                </p>
                <div className="mt-4 text-xs text-text-tertiary">
                  📊 Chart visualization coming soon (Recharts integration needed)
                </div>
              </div>
            ) : (
              <p className="text-text-secondary">No mood data for this period</p>
            )}
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Practice Completion</h3>
            {Object.keys(practiceCounts).length > 0 ? (
              <div>
                <div className="text-3xl font-bold text-primary mb-2">
                  {practiceData.length}
                </div>
                <p className="text-sm text-text-secondary">
                  Practices completed over {timeRange}
                </p>
                <div className="mt-4 space-y-2">
                  {Object.entries(practiceCounts).map(([type, count]) => (
                    <div key={type} className="flex justify-between text-sm">
                      <span className="text-text-secondary capitalize">{type.replace('_', ' ')}</span>
                      <span className="font-semibold text-foreground">{count as number}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-xs text-text-tertiary">
                  📊 Heatmap calendar coming soon
                </div>
              </div>
            ) : (
              <p className="text-text-secondary">No practice data for this period</p>
            )}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Correlations</h3>
          <p className="text-text-secondary">
            Pattern analysis and correlations will be displayed here once you have more data.
          </p>
          <p className="text-xs text-text-tertiary mt-2">
            Note: These are patterns in your data, not clinical recommendations.
          </p>
        </div>

        <div className="mt-6">
          <Link
            href="/api/export?format=csv"
            className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-xl transition-colors"
          >
            Export Data (CSV)
          </Link>
        </div>
      </div>
    </div>
  )
}
