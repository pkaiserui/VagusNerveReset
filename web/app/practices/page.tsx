import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PRACTICES, PracticeType } from '@/lib/practices'
import { Practice } from '@/lib/types'
import { checkPremiumStatus } from '@/lib/premium'

async function getPremiumStatus() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const premiumStatus = await checkPremiumStatus(user.id)
  return premiumStatus.isPremium
}

function groupPracticesByType(practices: Practice[]) {
  const groups: Record<PracticeType, Practice[]> = {
    mood_record: [],
    containment: [],
    body_exercise: [],
    regulating_resource: [],
    worry_record: [],
    emotion_recognition: [],
    basic_needs_journal: [],
    hyperarousal_resource: [],
    hypoarousal_resource: [],
  }

  practices.forEach(practice => {
    if (groups[practice.type]) {
      groups[practice.type].push(practice)
    }
  })

  return groups
}

function getCategoryName(type: PracticeType): string {
  const names: Record<PracticeType, string> = {
    mood_record: 'Daily Practices',
    containment: 'Containment Exercises',
    body_exercise: 'Body Exercises',
    regulating_resource: 'Regulating Resources',
    worry_record: 'Cognitive Practices',
    emotion_recognition: 'Emotional Practices',
    basic_needs_journal: 'Reflection Practices',
    hyperarousal_resource: 'Quick Access - Activated',
    hypoarousal_resource: 'Quick Access - Shut Down',
  }
  return names[type] || type
}

export default async function PracticesPage() {
  const isPremium = await getPremiumStatus()
  const grouped = groupPracticesByType(PRACTICES)

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden border-b border-gray-200 bg-surface sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">Practices</h1>
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

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 border-r border-gray-200 bg-surface min-h-screen sticky top-0">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-foreground mb-8">Vagus Nerve Reset</h1>
            <nav className="space-y-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-gray-50 hover:text-foreground transition-colors"
              >
                <span>🏠</span>
                <span>Today</span>
              </Link>
              <Link
                href="/practices"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-semibold"
              >
                <span>📋</span>
                <span>Practices</span>
              </Link>
              <Link
                href="/glimmers"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-gray-50 hover:text-foreground transition-colors"
              >
                <span>✨</span>
                <span>Glimmers</span>
              </Link>
              {isPremium && (
                <Link
                  href="/insights"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-gray-50 hover:text-foreground transition-colors"
                >
                  <span>📊</span>
                  <span>Insights</span>
                </Link>
              )}
              <Link
                href="/settings"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-gray-50 hover:text-foreground transition-colors"
              >
                <span>⚙️</span>
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8 max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">All Practices</h2>
            <p className="text-text-secondary">Choose a practice to begin</p>
          </div>

          {Object.entries(grouped).map(([type, practices]) => {
            if (practices.length === 0) return null

            return (
              <div key={type} className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {getCategoryName(type as PracticeType)}
                </h3>
                <div className="space-y-3">
                  {practices.map((practice) => {
                    const isLocked = practice.isPremium && !isPremium
                    const href = isLocked ? '/premium' : `/practices/${practice.type}${practice.variant !== 'daily' ? `?variant=${practice.variant}` : ''}`

                    return (
                      <Link
                        key={practice.id}
                        href={href}
                        className="card p-6 card-hover block"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-semibold text-foreground">
                                {practice.name}
                              </h4>
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
                              {practice.durationMinutes} min
                            </p>
                          </div>
                          <svg className="w-5 h-5 text-text-tertiary ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-surface">
        <div className="grid grid-cols-5">
          <Link
            href="/dashboard"
            className="flex flex-col items-center justify-center py-3 text-text-secondary"
          >
            <span className="text-2xl mb-1">🏠</span>
            <span className="text-xs">Today</span>
          </Link>
          <Link
            href="/practices"
            className="flex flex-col items-center justify-center py-3 text-primary"
          >
            <span className="text-2xl mb-1">📋</span>
            <span className="text-xs font-semibold">Practices</span>
          </Link>
          <Link
            href="/glimmers"
            className="flex flex-col items-center justify-center py-3 text-text-secondary"
          >
            <span className="text-2xl mb-1">✨</span>
            <span className="text-xs">Glimmers</span>
          </Link>
          {isPremium ? (
            <Link
              href="/insights"
              className="flex flex-col items-center justify-center py-3 text-text-secondary"
            >
              <span className="text-2xl mb-1">📊</span>
              <span className="text-xs">Insights</span>
            </Link>
          ) : (
            <Link
              href="/premium"
              className="flex flex-col items-center justify-center py-3 text-text-secondary"
            >
              <span className="text-2xl mb-1">⭐</span>
              <span className="text-xs">Premium</span>
            </Link>
          )}
          <Link
            href="/settings"
            className="flex flex-col items-center justify-center py-3 text-text-secondary"
          >
            <span className="text-2xl mb-1">⚙️</span>
            <span className="text-xs">Settings</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
