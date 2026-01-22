'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function WorryRecordPage() {
  const router = useRouter()
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)
  const [worryText, setWorryText] = useState('')
  const [likelihood, setLikelihood] = useState(50)
  const [evidenceFor, setEvidenceFor] = useState<string[]>([''])
  const [evidenceAgainst, setEvidenceAgainst] = useState<string[]>([''])
  const [balancedThought, setBalancedThought] = useState('')
  const [saving, setSaving] = useState(false)

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

  const addEvidenceItem = (list: string[], setList: (items: string[]) => void) => {
    setList([...list, ''])
  }

  const updateEvidenceItem = (
    list: string[],
    setList: (items: string[]) => void,
    index: number,
    value: string
  ) => {
    const newList = [...list]
    newList[index] = value
    setList(newList)
  }

  const removeEvidenceItem = (
    list: string[],
    setList: (items: string[]) => void,
    index: number
  ) => {
    setList(list.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { error } = await supabase
        .from('worry_records')
        .insert({
          user_id: user.id,
          worry_text: worryText.trim(),
          likelihood_percent: likelihood,
          evidence_for: evidenceFor.filter(e => e.trim()),
          evidence_against: evidenceAgainst.filter(e => e.trim()),
          balanced_thought: balancedThought.trim() || null,
        })

      if (error) throw error

      router.push('/dashboard?worry=saved')
    } catch (err: any) {
      alert('Failed to save worry record: ' + err.message)
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
            Worry Record is available with Premium. Unlock cognitive restructuring tools with a one-time purchase.
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
            <h1 className="text-xl font-bold text-foreground">Worry Record</h1>
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
          <h2 className="text-3xl font-bold text-foreground mb-2">Worry Record</h2>
          <p className="text-text-secondary">Cognitive restructuring for anxious thoughts</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-lg font-semibold text-foreground mb-4">
              What are you worried about?
            </label>
            <textarea
              value={worryText}
              onChange={(e) => setWorryText(e.target.value)}
              rows={4}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Describe your worry..."
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-foreground mb-4">
              How likely is this to happen? ({likelihood}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={likelihood}
              onChange={(e) => setLikelihood(Number(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-sm text-text-secondary mt-2">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          <div>
            <label className="block text-lg font-semibold text-foreground mb-4">
              Evidence for this worry
            </label>
            {evidenceFor.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateEvidenceItem(evidenceFor, setEvidenceFor, index, e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Evidence..."
                />
                {evidenceFor.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEvidenceItem(evidenceFor, setEvidenceFor, index)}
                    className="px-3 text-error hover:text-error/80"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addEvidenceItem(evidenceFor, setEvidenceFor)}
              className="text-sm text-primary hover:text-primary-dark font-medium"
            >
              + Add evidence
            </button>
          </div>

          <div>
            <label className="block text-lg font-semibold text-foreground mb-4">
              Evidence against this worry
            </label>
            {evidenceAgainst.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateEvidenceItem(evidenceAgainst, setEvidenceAgainst, index, e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Evidence..."
                />
                {evidenceAgainst.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEvidenceItem(evidenceAgainst, setEvidenceAgainst, index)}
                    className="px-3 text-error hover:text-error/80"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addEvidenceItem(evidenceAgainst, setEvidenceAgainst)}
              className="text-sm text-primary hover:text-primary-dark font-medium"
            >
              + Add evidence
            </button>
          </div>

          <div>
            <label className="block text-lg font-semibold text-foreground mb-4">
              More balanced thought
            </label>
            <textarea
              value={balancedThought}
              onChange={(e) => setBalancedThought(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="What's a more balanced way to think about this?"
            />
          </div>

          <div className="flex gap-4">
            <Link
              href="/practices"
              className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-foreground font-semibold text-center hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving || !worryText.trim()}
              className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Worry Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
