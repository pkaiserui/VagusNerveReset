'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Glimmer } from '@/lib/types'

export default function GlimmersPage() {
  const router = useRouter()
  const [glimmers, setGlimmers] = useState<Glimmer[]>([])
  const [loading, setLoading] = useState(true)
  const [isPremium, setIsPremium] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newGlimmerText, setNewGlimmerText] = useState('')
  const [newGlimmerEmoji, setNewGlimmerEmoji] = useState('✨')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return
    
    const supabase = createClient()
    loadGlimmers(supabase)
    checkPremium(supabase)
  }, [])

  async function checkPremium(supabase: ReturnType<typeof createClient>) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        return
      }
      const { checkPremiumStatusClient } = await import('@/lib/premium-client')
      const status = await checkPremiumStatusClient(user.id)
      setIsPremium(status.isPremium)
    } catch (err) {
      console.error('Failed to check premium status:', err)
    }
  }

  async function loadGlimmers(supabase: ReturnType<typeof createClient>) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('glimmers')
        .select('*')
        .eq('user_id', user.id)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      setGlimmers(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddGlimmer(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!newGlimmerText.trim()) {
      setError('Please enter a glimmer')
      return
    }

    // Check free tier limit
    if (!isPremium && glimmers.length >= 1) {
      setError('Free tier allows 1 glimmer. Upgrade to Premium for unlimited glimmers.')
      return
    }

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { error } = await supabase
        .from('glimmers')
        .insert({
          user_id: user.id,
          text: newGlimmerText.trim(),
          emoji: newGlimmerEmoji,
          tags: [],
          is_pinned: false,
        })

      if (error) throw error

      setNewGlimmerText('')
      setNewGlimmerEmoji('✨')
      setShowAddForm(false)
      const supabaseReload = createClient()
      loadGlimmers(supabaseReload)
    } catch (err: any) {
      setError(err.message)
    }
  }

  async function handleTogglePin(id: string, currentPin: boolean) {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('glimmers')
        .update({ is_pinned: !currentPin })
        .eq('id', id)

      if (error) throw error
      loadGlimmers(supabase)
    } catch (err: any) {
      setError(err.message)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this glimmer?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('glimmers')
        .delete()
        .eq('id', id)

      if (error) throw error
      loadGlimmers(supabase)
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    )
  }

  const pinnedGlimmers = glimmers.filter(g => g.is_pinned)
  const unpinnedGlimmers = glimmers.filter(g => !g.is_pinned)

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden border-b border-gray-200 bg-surface sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">Glimmers</h1>
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

      <div className="max-w-4xl mx-auto px-4 py-6 lg:py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Your Glimmers</h2>
            <p className="text-text-secondary">
              Moments of safety, joy, and connection
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-xl transition-colors"
          >
            {showAddForm ? 'Cancel' : '+ Add Glimmer'}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-error/10 text-error">
            {error}
            {!isPremium && glimmers.length >= 1 && (
              <div className="mt-2">
                <Link href="/premium" className="underline font-semibold">
                  Upgrade to Premium for unlimited glimmers
                </Link>
              </div>
            )}
          </div>
        )}

        {showAddForm && (
          <form onSubmit={handleAddGlimmer} className="card p-6 mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Emoji (optional)
              </label>
              <input
                type="text"
                value={newGlimmerEmoji}
                onChange={(e) => setNewGlimmerEmoji(e.target.value)}
                maxLength={2}
                className="w-20 px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="✨"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                What's your glimmer?
              </label>
              <textarea
                value={newGlimmerText}
                onChange={(e) => setNewGlimmerText(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="e.g., Morning coffee aroma, Dog wagging tail, Sunset colors..."
              />
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false)
                  setNewGlimmerText('')
                  setError(null)
                }}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-300 text-foreground hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-xl transition-colors"
              >
                Save Glimmer
              </button>
            </div>
          </form>
        )}

        {pinnedGlimmers.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Pinned</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {pinnedGlimmers.map((glimmer) => (
                <div key={glimmer.id} className="card p-6 relative">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{glimmer.emoji || '✨'}</span>
                    <div className="flex-1">
                      <p className="text-foreground leading-relaxed">{glimmer.text}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleTogglePin(glimmer.id, true)}
                      className="text-sm text-primary hover:text-primary-dark font-medium"
                    >
                      Unpin
                    </button>
                    <button
                      onClick={() => handleDelete(glimmer.id)}
                      className="text-sm text-error hover:text-error/80 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {unpinnedGlimmers.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {pinnedGlimmers.length > 0 ? 'All Glimmers' : 'Your Glimmers'}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {unpinnedGlimmers.map((glimmer) => (
                <div key={glimmer.id} className="card p-6">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{glimmer.emoji || '✨'}</span>
                    <div className="flex-1">
                      <p className="text-foreground leading-relaxed">{glimmer.text}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleTogglePin(glimmer.id, false)}
                      className="text-sm text-primary hover:text-primary-dark font-medium"
                    >
                      Pin
                    </button>
                    <button
                      onClick={() => handleDelete(glimmer.id)}
                      className="text-sm text-error hover:text-error/80 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {glimmers.length === 0 && !showAddForm && (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-4">✨</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No glimmers yet
            </h3>
            <p className="text-text-secondary mb-6">
              Glimmers are moments of safety, joy, and connection. Start adding yours!
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-6 rounded-xl transition-colors"
            >
              Add Your First Glimmer
            </button>
          </div>
        )}
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
            className="flex flex-col items-center justify-center py-3 text-text-secondary"
          >
            <span className="text-2xl mb-1">📋</span>
            <span className="text-xs">Practices</span>
          </Link>
          <Link
            href="/glimmers"
            className="flex flex-col items-center justify-center py-3 text-primary"
          >
            <span className="text-2xl mb-1">✨</span>
            <span className="text-xs font-semibold">Glimmers</span>
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
