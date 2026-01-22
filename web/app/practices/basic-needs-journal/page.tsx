'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const NEEDS = [
  { id: 'sleep', question: 'Are you getting enough sleep?', actionTemplate: 'Improve sleep routine' },
  { id: 'food', question: 'Are you eating nourishing food?', actionTemplate: 'Plan nourishing meals' },
  { id: 'safety', question: 'Do you feel safe in your environment?', actionTemplate: 'Address safety concerns' },
  { id: 'connection', question: 'Are you connected to supportive people?', actionTemplate: 'Reach out to supportive people' },
  { id: 'purpose', question: 'Do you have purpose/meaning?', actionTemplate: 'Explore purpose and meaning' },
]

export default function BasicNeedsJournalPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)
  const [needs, setNeeds] = useState<Record<string, { answer: string; details: string }>>({})
  const [actionItems, setActionItems] = useState<Array<{ title: string; dueDate: string }>>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function checkPremium() {
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

  const handleNeedChange = (needId: string, answer: string, details: string) => {
    setNeeds(prev => ({
      ...prev,
      [needId]: { answer, details },
    }))

    // Auto-generate action item for "No" or "Sometimes"
    if (answer === 'no' || answer === 'sometimes') {
      const need = NEEDS.find(n => n.id === needId)
      if (need) {
        setActionItems(prev => {
          const exists = prev.find(item => item.title.includes(need.actionTemplate))
          if (!exists) {
            return [...prev, {
              title: need.actionTemplate,
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            }]
          }
          return prev
        })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Save action items
      for (const item of actionItems) {
        await supabase
          .from('action_items')
          .insert({
            user_id: user.id,
            title: item.title,
            due_at: item.dueDate,
            source: 'basic_needs_journal',
          })
      }

      router.push('/dashboard?needs=saved')
    } catch (err: any) {
      alert('Failed to save: ' + err.message)
      setSaving(false)
    }
  }

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
            Basic Needs Journal is available with Premium. Unlock reflection tools with a one-time purchase.
          </p>
          <Link
            href="/premium"
            className="block w-full bg-accent hover:bg-accent-dark text-white font-semibold py-3 px-4 rounded-xl transition-colors"
          >
            Unlock Premium
          </Link>
          <Link href="/practices" className="block mt-4 text-text-secondary hover:text-foreground">
            ← Back to Practices
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="lg:hidden border-b border-gray-200 bg-surface sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">Basic Needs Journal</h1>
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
          <h2 className="text-3xl font-bold text-foreground mb-2">Basic Needs Journal</h2>
          <p className="text-text-secondary">Identify unmet needs and generate action items</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {NEEDS.map((need) => {
            const needData = needs[need.id] || { answer: '', details: '' }
            return (
              <div key={need.id} className="card p-6">
                <label className="block text-lg font-semibold text-foreground mb-4">
                  {need.question}
                </label>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    {['yes', 'no', 'sometimes'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleNeedChange(need.id, option, needData.details)}
                        className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${
                          needData.answer === option
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  {(needData.answer === 'no' || needData.answer === 'sometimes') && (
                    <textarea
                      value={needData.details}
                      onChange={(e) => handleNeedChange(need.id, needData.answer, e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      placeholder="Add details..."
                    />
                  )}
                </div>
              </div>
            )
          })}

          {actionItems.length > 0 && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Suggested Action Items</h3>
              <div className="space-y-3">
                {actionItems.map((item, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const newItems = [...actionItems]
                        newItems[index].title = e.target.value
                        setActionItems(newItems)
                      }}
                      className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="date"
                      value={item.dueDate}
                      onChange={(e) => {
                        const newItems = [...actionItems]
                        newItems[index].dueDate = e.target.value
                        setActionItems(newItems)
                      }}
                      className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setActionItems(actionItems.filter((_, i) => i !== index))}
                      className="px-3 text-error hover:text-error/80"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Link
              href="/practices"
              className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-foreground font-semibold text-center hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save & Create Action Items'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
