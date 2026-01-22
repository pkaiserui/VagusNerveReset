'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Profile } from '@/lib/types'
import { PremiumStatus } from '@/lib/premium'

interface SettingsClientProps {
  user: { id: string; email?: string }
  profile: Profile | null
  isPremium: boolean
  premiumStatus: PremiumStatus
}

export default function SettingsClient({ user, profile, isPremium, premiumStatus }: SettingsClientProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    if (!confirm('This will delete all your data. Are you absolutely sure?')) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Delete user will cascade to all related tables
      const { error } = await supabase.auth.admin.deleteUser(user.id)
      if (error) throw error

      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Failed to delete account')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="lg:hidden border-b border-gray-200 bg-surface sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">Settings</h1>
            <Link href="/dashboard" className="p-2 text-text-secondary hover:text-foreground">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 lg:py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Settings</h2>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-error/10 text-error">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Account Section */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Account</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Email
                </label>
                <p className="text-foreground">{user.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                disabled={loading}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-xl transition-colors disabled:opacity-50"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Premium Section */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Premium</h3>
            <div className="space-y-4">
              {isPremium ? (
                <div>
                  {premiumStatus.isTrial ? (
                    <>
                      <p className="text-foreground mb-2">🎁 Free Trial Active</p>
                      <p className="text-sm text-text-secondary mb-3">
                        {premiumStatus.trialDaysRemaining} day{premiumStatus.trialDaysRemaining !== 1 ? 's' : ''} remaining in your trial
                      </p>
                      <Link
                        href="/premium"
                        className="block w-full bg-accent hover:bg-accent-dark text-white font-semibold py-2 px-4 rounded-xl text-center transition-colors"
                      >
                        Purchase Premium
                      </Link>
                    </>
                  ) : (
                    <>
                      <p className="text-foreground mb-2">✅ You have Premium access</p>
                      <p className="text-sm text-text-secondary">
                        All features unlocked. Thank you for your support!
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-foreground mb-4">Unlock all features with Premium</p>
                  <Link
                    href="/premium"
                    className="block w-full bg-accent hover:bg-accent-dark text-white font-semibold py-2 px-4 rounded-xl text-center transition-colors"
                  >
                    Upgrade to Premium
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Data Management */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Data Management</h3>
            <div className="space-y-4">
              <button
                onClick={() => router.push('/api/export?format=csv')}
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-xl transition-colors"
              >
                Export Data (CSV)
              </button>
              <button
                onClick={() => router.push('/api/export?format=pdf')}
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-xl transition-colors"
              >
                Export Data (PDF)
              </button>
            </div>
          </div>

          {/* Privacy */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Privacy</h3>
            <div className="space-y-2">
              <Link href="/privacy" className="block text-primary hover:text-primary-dark">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-primary hover:text-primary-dark">
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card p-6 border-2 border-error/20">
            <h3 className="text-lg font-semibold text-error mb-4">Danger Zone</h3>
            <button
              onClick={handleDeleteAccount}
              disabled={loading}
              className="w-full bg-error hover:bg-error/90 text-white font-semibold py-2 px-4 rounded-xl transition-colors disabled:opacity-50"
            >
              Delete Account
            </button>
            <p className="text-sm text-text-secondary mt-2">
              This will permanently delete your account and all associated data.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
