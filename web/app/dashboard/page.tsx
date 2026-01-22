import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { checkPremiumStatus } from '@/lib/premium'

async function getDashboardData() {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get today's date range
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Fetch today's mood records
  const { data: moodRecords } = await supabase
    .from('daily_mood_records')
    .select('*')
    .eq('user_id', user.id)
    .gte('recorded_at', today.toISOString())
    .lt('recorded_at', tomorrow.toISOString())

  // Fetch today's practice sessions
  // Use started_at for date filtering since completed_at can be NULL
  const { data: practiceSessions } = await supabase
    .from('practice_sessions')
    .select('*')
    .eq('user_id', user.id)
    .eq('completed', true)
    .gte('started_at', today.toISOString())
    .lt('started_at', tomorrow.toISOString())

  // Fetch a random glimmer
  const { data: glimmers } = await supabase
    .from('glimmers')
    .select('*')
    .eq('user_id', user.id)
    .limit(1)
    .order('created_at', { ascending: false })

  // Check premium status (includes 14-day trial)
  const premiumStatus = await checkPremiumStatus(user.id)
  const isPremium = premiumStatus.isPremium

  return {
    user,
    moodRecords: moodRecords || [],
    practiceSessions: practiceSessions || [],
    todayGlimmer: glimmers?.[0] || null,
    isPremium,
    premiumStatus,
  }
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return { text: 'Good Morning', emoji: '☀️' }
  if (hour < 17) return { text: 'Good Afternoon', emoji: '🌤️' }
  return { text: 'Good Evening', emoji: '🌙' }
}

export default async function DashboardPage() {
  const data = await getDashboardData()
  const greeting = getGreeting()

  // Calculate today's progress
  const dailyPractices = [
    { type: 'mood_record', name: 'Mood Record', completed: data.moodRecords.length > 0 },
    { type: 'body_exercise', name: 'Body Exercise', completed: data.practiceSessions.some(s => s.practice_type === 'body_exercise') },
    { type: 'containment', name: 'Containment', completed: data.practiceSessions.some(s => s.practice_type === 'containment') },
    { type: 'regulating_resource', name: 'Regulating Resource', completed: data.practiceSessions.some(s => s.practice_type === 'regulating_resource') },
  ]

  const completedCount = dailyPractices.filter(p => p.completed).length
  const totalCount = dailyPractices.length

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden border-b border-gray-200 bg-surface sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">Vagus Nerve Reset</h1>
            <Link
              href="/settings"
              className="p-2 text-text-secondary hover:text-foreground"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-semibold"
              >
                <span>🏠</span>
                <span>Today</span>
              </Link>
              <Link
                href="/practices"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-gray-50 hover:text-foreground transition-colors"
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
              {data.isPremium && (
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
          {/* Greeting */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {greeting.text}, {data.user.email?.split('@')[0]} {greeting.emoji}
            </h2>
            <p className="text-text-secondary">Here's your progress today</p>
          </div>

          {/* Today's Progress */}
          <div className="card p-6 mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Today's Progress</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <div className="flex gap-2 mb-2">
                  {dailyPractices.map((practice, index) => (
                    <div
                      key={practice.type}
                      className={`flex-1 h-2 rounded-full ${
                        practice.completed ? 'bg-success' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-text-secondary">
                  {completedCount} of {totalCount} complete
                </p>
              </div>
            </div>
          </div>

          {/* Daily Practices */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Daily Practices</h3>
            <div className="space-y-3">
              {dailyPractices.map((practice) => (
                <Link
                  key={practice.type}
                  href={`/practices/${practice.type}`}
                  className="card p-4 card-hover block"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {practice.completed ? (
                        <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                      )}
                      <div>
                        <p className="font-medium text-foreground">{practice.name}</p>
                        {practice.completed ? (
                          <p className="text-sm text-text-secondary">Completed</p>
                        ) : (
                          <p className="text-sm text-text-secondary">Tap to start</p>
                        )}
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Access */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Access</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/practices/hyperarousal_resource"
                className="card p-6 text-center card-hover"
              >
                <div className="text-4xl mb-2">🔥</div>
                <p className="font-semibold text-foreground">I feel activated</p>
                <p className="text-sm text-text-secondary mt-1">Hyperarousal resources</p>
              </Link>
              <Link
                href="/practices/hypoarousal_resource"
                className="card p-6 text-center card-hover"
              >
                <div className="text-4xl mb-2">🌊</div>
                <p className="font-semibold text-foreground">I feel shut down</p>
                <p className="text-sm text-text-secondary mt-1">Hypoarousal resources</p>
              </Link>
            </div>
          </div>
        </main>

        {/* Desktop Right Sidebar */}
        <aside className="hidden xl:block w-80 border-l border-gray-200 bg-surface min-h-screen sticky top-0">
          <div className="p-6">
            {/* Today's Glimmer */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Today's Glimmer ✨</h3>
              {data.todayGlimmer ? (
                <div className="card p-6">
                  <p className="text-foreground text-lg leading-relaxed">
                    {data.todayGlimmer.emoji && <span className="mr-2">{data.todayGlimmer.emoji}</span>}
                    {data.todayGlimmer.text}
                  </p>
                </div>
              ) : (
                <div className="card p-6 text-center">
                  <p className="text-text-secondary mb-4">No glimmers yet</p>
                  <Link
                    href="/glimmers"
                    className="text-primary hover:text-primary-dark font-semibold"
                  >
                    Add your first glimmer →
                  </Link>
                </div>
              )}
            </div>

            {/* Premium CTA (if not premium) */}
            {!data.isPremium && (
              <div className="card p-6 bg-accent/10 border border-accent/20">
                <div className="text-3xl mb-3">⭐</div>
                <h4 className="font-semibold text-foreground mb-2">Unlock Premium</h4>
                <p className="text-sm text-text-secondary mb-4">
                  Get access to all practices, unlimited glimmers, and insights
                </p>
                <Link
                  href="/premium"
                  className="block w-full bg-accent hover:bg-accent-dark text-white font-semibold py-2 px-4 rounded-xl text-center transition-colors"
                >
                  Learn More
                </Link>
              </div>
            )}
            {/* Trial Status (if on trial) */}
            {data.isPremium && data.premiumStatus.isTrial && (
              <div className="card p-6 bg-info/10 border border-info/20">
                <div className="text-2xl mb-2">🎁</div>
                <h4 className="font-semibold text-foreground mb-2">Free Trial Active</h4>
                <p className="text-sm text-text-secondary mb-2">
                  {data.premiumStatus.trialDaysRemaining} day{data.premiumStatus.trialDaysRemaining !== 1 ? 's' : ''} remaining
                </p>
                <p className="text-xs text-text-tertiary">
                  Enjoying Premium? Purchase to keep access after your trial ends.
                </p>
                <Link
                  href="/premium"
                  className="block mt-3 w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-xl text-center transition-colors text-sm"
                >
                  Purchase Premium
                </Link>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-surface">
        <div className="grid grid-cols-5">
          <Link
            href="/dashboard"
            className="flex flex-col items-center justify-center py-3 text-primary"
          >
            <span className="text-2xl mb-1">🏠</span>
            <span className="text-xs font-semibold">Today</span>
          </Link>
          <Link
            href="/practices"
            className="flex flex-col items-center justify-center py-3 text-text-secondary"
          >
            <span className="text-2xl mb-1">📋</span>
            <span className="text-xs">Practices</span>
          </Link>
          <Link
            href="/glimmers"
            className="flex flex-col items-center justify-center py-3 text-text-secondary"
          >
            <span className="text-2xl mb-1">✨</span>
            <span className="text-xs">Glimmers</span>
          </Link>
          {data.isPremium ? (
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

      {/* Mobile Glimmer Section */}
      <div className="lg:hidden px-4 pb-24 mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Today's Glimmer ✨</h3>
        {data.todayGlimmer ? (
          <div className="card p-6">
            <p className="text-foreground text-lg leading-relaxed">
              {data.todayGlimmer.emoji && <span className="mr-2">{data.todayGlimmer.emoji}</span>}
              {data.todayGlimmer.text}
            </p>
          </div>
        ) : (
          <div className="card p-6 text-center">
            <p className="text-text-secondary mb-4">No glimmers yet</p>
            <Link
              href="/glimmers"
              className="text-primary hover:text-primary-dark font-semibold"
            >
              Add your first glimmer →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
