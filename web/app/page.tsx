import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-foreground">
                Vagus Nerve Reset
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm text-text-secondary hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-xl transition-colors text-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 py-20 sm:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6 leading-tight">
            Regulate Your Nervous System
            <br />
            <span className="text-primary">With Calm, Evidence-Based Practices</span>
          </h1>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
            A privacy-first wellness companion that guides you through The Vagus Nerve Reset program. 
            Works fully offline. No subscription required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/signup"
              className="bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-8 rounded-xl transition-colors text-lg w-full sm:w-auto"
            >
              Start Your Journey
            </Link>
            <Link
              href="/login"
              className="bg-surface border border-gray-300 hover:bg-gray-50 text-foreground font-semibold py-4 px-8 rounded-xl transition-colors text-lg w-full sm:w-auto"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 bg-surface">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Why Choose Vagus Nerve Reset?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Privacy First */}
            <div className="card p-6 animate-fadeIn">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Privacy-First
              </h3>
              <p className="text-text-secondary">
                Works fully offline. Sign in is optional. Your data stays yours, 
                stored locally with encryption. No tracking, no subscriptions.
              </p>
            </div>

            {/* One-Time Purchase */}
            <div className="card p-6 animate-fadeIn">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                One-Time Purchase
              </h3>
              <p className="text-text-secondary">
                Pay once, own forever. No recurring fees, no subscriptions. 
                Lifetime access to all practices and features.
              </p>
            </div>

            {/* Evidence-Based */}
            <div className="card p-6 animate-fadeIn">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-success"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Evidence-Based Practices
              </h3>
              <p className="text-text-secondary">
                Structured according to The Vagus Nerve Reset program. 
                Science-backed exercises for nervous system regulation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Practices Preview */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-foreground text-center mb-4">
            Daily Practices for Nervous System Health
          </h2>
          <p className="text-center text-text-secondary mb-12 max-w-2xl mx-auto">
            Build a sustainable routine with guided exercises designed to regulate your vagus nerve
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-6 card-hover">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Daily Mood Record
              </h3>
              <p className="text-text-secondary mb-4">
                Track your daily emotional state, nervous system regulation, and body sensations 
                to build awareness and identify patterns.
              </p>
              <span className="text-xs text-success font-medium">Free</span>
            </div>

            <div className="card p-6 card-hover">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Containment Exercises
              </h3>
              <p className="text-text-secondary mb-4">
                Guided practices including container visualization, box breathing, 
                body scans, and progressive muscle relaxation.
              </p>
              <span className="text-xs text-accent font-medium">Premium</span>
            </div>

            <div className="card p-6 card-hover">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Body Exercises
              </h3>
              <p className="text-text-secondary mb-4">
                Physical practices like bee breathing, arm swings, butterfly hug, 
                and pendulation to activate your vagus nerve.
              </p>
              <span className="text-xs text-accent font-medium">Premium</span>
            </div>

            <div className="card p-6 card-hover">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Regulating Resources
              </h3>
              <p className="text-text-secondary mb-4">
                Quick-access tools for hyperarousal and hypoarousal states: 
                cold exposure, singing, natural light, and more.
              </p>
              <span className="text-xs text-accent font-medium">Premium</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-primary/5">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Begin?
          </h2>
          <p className="text-lg text-text-secondary mb-8">
            Start your journey to better nervous system regulation. 
            No sign-in required to get started.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-8 rounded-xl transition-colors text-lg"
          >
            Create Your Account
          </Link>
          <p className="mt-4 text-sm text-text-secondary">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:text-primary-dark font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-surface px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-text-secondary">
              © {new Date().getFullYear()} Vagus Nerve Reset. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-text-secondary hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-text-secondary hover:text-foreground">
                Terms of Service
              </Link>
            </div>
          </div>
          <div className="mt-4 text-center text-xs text-text-tertiary">
            <p>
              This is self-help, not medical care. Not a substitute for therapy or medical treatment.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
