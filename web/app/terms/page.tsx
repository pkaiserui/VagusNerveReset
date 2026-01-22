import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/" className="text-primary hover:text-primary-dark mb-8 inline-block">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none space-y-6 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p className="text-text-secondary leading-relaxed">
              By using Vagus Nerve Reset, you agree to these Terms of Service. 
              If you do not agree, please do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Medical Disclaimer</h2>
            <p className="text-text-secondary leading-relaxed">
              <strong>Important:</strong> Vagus Nerve Reset is a self-help wellness app, not a medical device or treatment. 
              This app is not intended to diagnose, treat, cure, or prevent any medical condition.
            </p>
            <p className="text-text-secondary leading-relaxed mt-4">
              The practices and information provided are for educational and self-help purposes only. 
              They are not a substitute for professional medical advice, diagnosis, or treatment.
            </p>
            <p className="text-text-secondary leading-relaxed mt-4">
              If you are experiencing a medical emergency or mental health crisis, please contact:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4 mt-2">
              <li>Emergency services (911 in the US)</li>
              <li>Your healthcare provider</li>
              <li>Crisis hotline (988 in the US)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Premium Purchase</h2>
            <p className="text-text-secondary leading-relaxed">
              Premium is a one-time purchase that provides lifetime access to all features. 
              All sales are final. Refunds may be available within 30 days of purchase if you are unsatisfied.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">User Responsibilities</h2>
            <p className="text-text-secondary leading-relaxed">
              You are responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
              <li>Maintaining the security of your account</li>
              <li>Using the app in accordance with these terms</li>
              <li>Not sharing your account with others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
            <p className="text-text-secondary leading-relaxed">
              Vagus Nerve Reset is provided "as is" without warranties of any kind. 
              We are not liable for any damages arising from your use of the app.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
            <p className="text-text-secondary leading-relaxed">
              We may update these terms from time to time. Continued use of the app after changes 
              constitutes acceptance of the new terms.
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
