import Link from 'next/link'

export default function PremiumSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full card p-8 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Welcome to Premium!</h2>
        <p className="text-text-secondary mb-6">
          Thank you for your purchase. You now have access to all features.
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
