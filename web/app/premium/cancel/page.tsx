import Link from 'next/link'

export default function PremiumCancelPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full card p-8 text-center">
        <div className="text-5xl mb-4">😔</div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Payment Cancelled</h2>
        <p className="text-text-secondary mb-6">
          Your payment was cancelled. No charges were made.
        </p>
        <div className="space-y-3">
          <Link
            href="/premium"
            className="block w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-xl transition-colors"
          >
            Try Again
          </Link>
          <Link
            href="/dashboard"
            className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
