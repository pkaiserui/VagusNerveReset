import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/" className="text-primary hover:text-primary-dark mb-8 inline-block">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none space-y-6 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Data, Your Choice</h2>
            <p className="text-text-secondary leading-relaxed">
              Vagus Nerve Reset is designed with privacy as a core principle. We believe you should have full control over your wellness data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Collection</h2>
            <p className="text-text-secondary leading-relaxed">
              We collect only the data necessary to provide the service:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
              <li>Account information (email address, if you choose to sign in)</li>
              <li>Mood records and practice session data</li>
              <li>Glimmers and notes you create</li>
              <li>App preferences and settings</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Storage</h2>
            <p className="text-text-secondary leading-relaxed">
              Your data is stored securely using Supabase, a privacy-focused backend service. 
              All data is encrypted in transit and at rest. If you choose not to sign in, 
              your data remains on your device only.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Usage</h2>
            <p className="text-text-secondary leading-relaxed">
              We use your data solely to provide the wellness app features. We do not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
              <li>Sell your data to third parties</li>
              <li>Use your data for advertising</li>
              <li>Share your data without your explicit consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p className="text-text-secondary leading-relaxed">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
              <li>Access all your data</li>
              <li>Export your data (PDF or CSV)</li>
              <li>Delete your account and all associated data</li>
              <li>Opt out of optional features</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">GDPR & CCPA Compliance</h2>
            <p className="text-text-secondary leading-relaxed">
              We comply with GDPR (General Data Protection Regulation) and CCPA (California Consumer Privacy Act) requirements. 
              If you have questions or requests regarding your data, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact</h2>
            <p className="text-text-secondary leading-relaxed">
              For privacy-related questions, please contact us through the app settings or email.
            </p>
          </section>

          <section>
            <p className="text-sm text-text-tertiary italic">
              Last updated: January 2026
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
