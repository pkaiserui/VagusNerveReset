'use client'

import Link from 'next/link'
import { PremiumStatus } from '@/lib/premium'

interface PremiumClientProps {
  isPremium: boolean
  premiumStatus: PremiumStatus
}

export default function PremiumClient({ isPremium, premiumStatus }: PremiumClientProps) {
  if (isPremium && !premiumStatus.isTrial) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full card p-8 text-center">
          <div className="text-5xl mb-4">⭐</div>
          <h2 className="text-2xl font-bold text-foreground mb-4">You're Premium!</h2>
          <p className="text-text-secondary mb-6">
            Thank you for your support. You have access to all features.
          </p>
          <Link
            href="/dashboard"
            className="block w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-xl transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">⭐</div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Unlock Premium</h1>
          <p className="text-xl text-text-secondary">
            One-time purchase. Lifetime access.
          </p>
        </div>

        {premiumStatus.isTrial && (
          <div className="card p-6 mb-6 bg-info/10 border border-info/20">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🎁</span>
              <div>
                <h3 className="font-semibold text-foreground">Free Trial Active</h3>
                <p className="text-sm text-text-secondary">
                  {premiumStatus.trialDaysRemaining} day{premiumStatus.trialDaysRemaining !== 1 ? 's' : ''} remaining
                </p>
              </div>
            </div>
            <p className="text-sm text-text-secondary mt-3">
              Enjoying Premium? Purchase now to keep access after your trial ends.
            </p>
          </div>
        )}

        <div className="card p-8 mb-8">
          <div className="text-center mb-8">
            <div className="text-5xl font-bold text-foreground mb-2">$29.99</div>
            <p className="text-text-secondary">One-time payment</p>
            {premiumStatus.isTrial && (
              <p className="text-sm text-success mt-2">
                Your trial ends in {premiumStatus.trialDaysRemaining} day{premiumStatus.trialDaysRemaining !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-success mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-foreground">All Containment Exercises</h3>
                <p className="text-sm text-text-secondary">Box breathing, body scan, progressive muscle relaxation</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-success mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-foreground">All Body Exercises</h3>
                <p className="text-sm text-text-secondary">Arm swings, butterfly hug, pendulation</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-success mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-foreground">Unlimited Glimmers</h3>
                <p className="text-sm text-text-secondary">Add as many glimmers as you want</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-success mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-foreground">All Regulating Resources</h3>
                <p className="text-sm text-text-secondary">Cold exposure, singing, natural light, and more</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-success mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-foreground">Worry Record & Basic Needs Journal</h3>
                <p className="text-sm text-text-secondary">Cognitive restructuring and reflection tools</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-success mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-foreground">Full Insights & Correlations</h3>
                <p className="text-sm text-text-secondary">Mood trends, practice heatmaps, and pattern analysis</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-success mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-foreground">Data Export</h3>
                <p className="text-sm text-text-secondary">Export your data as PDF or CSV</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              // TODO: Integrate Stripe Checkout
              alert('Stripe integration coming soon!')
            }}
            className="w-full bg-accent hover:bg-accent-dark text-white font-semibold py-4 px-6 rounded-xl text-lg transition-colors"
          >
            Purchase Premium - $29.99
          </button>

          <p className="text-center text-sm text-text-secondary mt-4">
            One-time payment. No subscriptions. Lifetime access.
          </p>
        </div>

        <div className="text-center">
          <Link href="/dashboard" className="text-text-secondary hover:text-foreground">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
