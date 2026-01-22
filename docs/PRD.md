# Product Requirements Document: Vagus Nerve Reset Wellness App

## Executive Summary

A calm, modern wellness iOS app and web application helping users complete The Vagus Nerve Reset program. The app prioritizes privacy with offline-first architecture, optional cloud sync, and a one-time lifetime purchase model.

**Core Value Proposition**: Anonymous-first, privacy-respecting wellness companion that guides users through evidence-based vagus nerve regulation practices without requiring sign-in or subscription.

---

## Product Vision & Goals

### Vision
Empower individuals to regulate their nervous system through accessible, science-backed practices in a calm, distraction-free digital environment.

### Primary Goals
1. **Privacy-First**: Enable full functionality without account creation
2. **Cross-Platform Continuity**: Seamless sync for users who choose to connect devices
3. **Ethical Monetization**: One-time purchase, lifetime access (no subscriptions)
4. **Clinical Alignment**: Structure practices according to The Vagus Nerve Reset program
5. **Non-Medical Positioning**: Clear disclaimers that this is self-help, not medical care

---

## User Personas

### Primary: The Privacy-Conscious Self-Helper
- Values data ownership and offline functionality
- Skeptical of subscription models
- Willing to pay once for quality tools
- May eventually sync across devices but wants to try first

### Secondary: The Multi-Device Practitioner
- Uses both iPhone and desktop
- Wants seamless sync after establishing trust
- Appreciates data insights and trends
- May share device with family (needs privacy features like Face ID)

---

## Core User Modes

### Mode 1: Local-Only (Default)
**State**: Anonymous, no account required

**Capabilities**:
- All practices available
- Data stored locally with encryption
- Face ID/Touch ID app lock option
- Reminders via local notifications
- Streaks and trends from local data
- One-time purchase stored locally

**Limitations**:
- No cross-device sync
- Premium purchase valid only on this device (until user signs in)
- Data backup requires manual export

**UX Note**: Never force account creation. Prominently communicate "No sign-in required" during onboarding.

---

### Mode 2: Synced Mode (Optional)
**State**: Authenticated user with cloud backup

**Activation Flow**:
1. User taps "Sync Across Devices" or "Sign In"
2. Choose: Email/Password or Apple Sign-In
3. Migration wizard: "Import your local data to cloud?"
4. Confirm migration (one-way, secure transfer)
5. All future writes sync automatically

**Capabilities**:
- Everything in Local-Only mode
- Automatic cloud backup to Supabase
- Premium purchase unlocks on all signed-in devices
- Access from web app
- Conflict resolution (last-write-wins with timestamp)

**Migration Strategy**:
- Hash device fingerprint to prevent duplicate imports
- Show migration progress modal
- Maintain local data as primary source (offline-first)
- Enable "Sign Out" with option to "Keep Local Data"

---

## Monetization Model

### Free Tier
**Included**:
- Daily Mood Record (unlimited)
- Basic containment exercise
- Basic body exercise (bee breathing)
- One glimmer entry
- 7-day practice history
- Basic reminders

**Purpose**: Demonstrate value, establish trust, allow full evaluation

---

### Premium (One-Time Purchase)
**Price**: $29.99 USD (suggested; finalize based on market research)

**Unlocks**:
- All containment exercises
- All body exercises (arm swings, additional options)
- Unlimited glimmers
- All regulating resources (cold exposure, singing, natural light, hot shower/bath, relaxing music, proprioceptive input)
- Nourishing basic needs journal → action item generator
- Worry Record (unlimited)
- Emotion recognition timer (guided sessions)
- Full insights & correlations
- Unlimited history
- Data export (PDF/CSV)
- Future updates & practices

**Platform Behavior**:

| Scenario | iOS | Web |
|----------|-----|-----|
| Purchase while local-only | Stored locally; prompt to sign in for cross-device access | N/A (web requires account) |
| Purchase while signed in | Entitlement written to Supabase; instant unlock on web | Entitlement written to Supabase; instant unlock on iOS |
| Restore purchase | StoreKit restoration → verify → write to Supabase if signed in | Check Supabase entitlement table |

**Technical Flow**:
1. User initiates purchase (iOS: StoreKit, Web: Stripe/Paddle)
2. Transaction completes
3. If signed in: Call Supabase Edge Function to verify & write entitlement
4. If local-only: Store entitlement flag locally + prompt "Sign in to unlock on all devices"
5. Premium features immediately available

---

## Practice Inventory

### Daily Practices (Structured Routine)

#### 1. Daily Mood Record
**Frequency**: Once per day (evening recommended)

**Flow**:
1. "How was your day overall?" (1-10 scale with emotion picker)
2. "What emotions did you feel?" (multi-select: joy, anger, fear, sadness, disgust, surprise, contentment, frustration, anxiety, gratitude)
3. "What was your nervous system state?" (choices: balanced, hyperarousal, hypoarousal, unknown)
4. "Body sensations?" (optional tags: tension, fatigue, energy, pain, restlessness, calm)
5. "Any notes?" (optional free text, max 500 chars)
6. Save → Show completion confirmation (never force Insights)

**UI/UX**:
- Soft, pastel emotion color coding
- Large touch targets for accessibility
- Auto-save draft if user navigates away
- Optional: Gentle prompt at user's chosen evening time

---

#### 2. Containment Exercise
**Frequency**: Choose one daily

**Options**:
- **Free**: Container visualization (guided audio, 5 min)
- **Premium**: Box breathing (4-4-4-4, customizable), Body scan, Progressive muscle relaxation

**Flow**:
1. User selects exercise from list
2. Brief description + duration shown
3. "Start" button → Full-screen immersive timer
4. Gentle audio cues or visual guide
5. Completion → log to `practice_sessions` table
6. Option to add "State before" and "State after" (hyperarousal/hypoarousal/balanced)

**UI/UX**:
- Minimal, focused interface during practice
- Option to exit early (still logs partial session)
- Haptic feedback for transitions (iOS)

---

#### 3. Body Exercise
**Frequency**: Choose one daily

**Options**:
- **Free**: Bee breathing (bhramari pranayama, 3 min)
- **Premium**: Arm swings (video demo, 2 min), Butterfly hug, Pendulation

**Flow**:
1. Select exercise
2. Video or animated guide plays
3. Timer runs
4. Log session on completion

---

#### 4. Regulating Resource
**Frequency**: Choose one daily

**Premium-only options**:
- Proprioceptive input (weighted blanket, self-massage guide)
- Cold exposure (cold shower protocol, ice on face)
- Singing (suggested songs, karaoke timer)
- Natural light (sunlight exposure timer, reminder for morning light)
- Relaxing music (curated playlist links or in-app ambient soundscapes)
- Hot shower/bath (guided relaxation timer)

**Flow**:
1. Pick resource based on current state (app can suggest, but user decides)
2. Follow guide or timer
3. Log completion
4. Optional: Rate helpfulness (used for personalized suggestions)

---

### One-Off / Revisited Practices

#### 5. Nourishing Basic Needs Journal (Premium)
**Purpose**: Identify unmet needs → convert to action items

**Flow**:
1. Guided prompts:
   - "Are you getting enough sleep?" (Y/N + details)
   - "Are you eating nourishing food?" (Y/N + details)
   - "Do you feel safe in your environment?" (Y/N + details)
   - "Are you connected to supportive people?" (Y/N + details)
   - "Do you have purpose/meaning?" (Y/N + details)
2. For each "No" or "Sometimes":
   - Auto-generate suggested action item
   - User can edit or add custom action
3. Action items saved to `action_items` table with due dates
4. Reminders trigger for due items

**UI/UX**:
- Warm, supportive tone in prompts
- Not a test; framed as self-reflection
- Can revisit and update monthly

---

#### 6. Mapping Your Nervous System (Free, core feature)
**Purpose**: Identify "glimmers" (moments of safety/joy)

**Flow**:
1. "What are your glimmers?" → Free-form text entry or list
2. Examples shown: "Morning coffee aroma," "Dog wagging tail," "Sunset colors"
3. Saved to `glimmers` table
4. Displayed in random rotation on home screen
5. Can pin favorites
6. Can revisit and add new glimmers anytime

**UI/UX**:
- Visually delightful (cards, soft animations)
- Make glimmers easily accessible during distress

---

### On-Demand / As-Needed Practices

#### 7. Worry Record (Premium)
**Purpose**: Cognitive restructuring for anxious thoughts

**Flow**:
1. "What are you worried about?" (free text)
2. "How likely is this to happen?" (slider, 0-100%)
3. "Evidence for?" (bullet points)
4. "Evidence against?" (bullet points)
5. "More balanced thought?" (free text)
6. Save → Show summary
7. Can review past worries (often realizes worries didn't materialize)

**UI/UX**:
- Non-judgmental language
- Optional: Set reminder to check back on worry outcome
- Archive old worries after 30 days (with notification)

---

#### 8. Recognize & Sit with Emotions (Free)
**Purpose**: Emotional tolerance practice

**Flow**:
1. "What emotion are you feeling?" (select)
2. "Where in your body?" (body map tap)
3. "Let's sit with this for 90 seconds" → Timer with breathing cue
4. "How intense is it now?" (before/after slider, 0-10)
5. Log session

**UI/UX**:
- Calm timer visualization (ripple effect, breathing circle)
- Option to extend timer
- Validates difficulty of practice

---

#### 9. Hyperarousal Resources (Premium)
**Quick-access tools when activated/anxious**:
- Cold exposure (ice protocol)
- Singing (specific grounding songs)
- Intense proprioception (wall push, grip squeezes)

**Flow**:
- Accessible from "I feel activated" button on home screen
- Quick list → Tap to start → Log completion

---

#### 10. Hypoarousal Resources (Premium)
**Quick-access tools when shut down/depressed**:
- Natural light (get outside reminder)
- Uplifting music
- Hot shower ritual
- Movement (gentle stretching prompts)

**Flow**:
- Accessible from "I feel shut down" button on home screen
- Quick list → Tap to start → Log completion

---

## Scheduling & Reminders

### User Preferences
**Configurable per practice**:
- Preferred time (e.g., "Daily Mood Record at 8:00 PM")
- Days of week (e.g., "Body exercise Monday/Wednesday/Friday")
- Reminder lead time (e.g., "Remind me 15 min before")

### Reminder Tone
- **Gentle, never pushy**: "Your evening mood check-in is ready" (not "You missed your mood check!")
- **Respects user autonomy**: "No pressure, just a gentle reminder"
- **Streak-aware**: If user has 5+ day streak, slightly different tone: "Keep the momentum going?"

### Streak System
**Mechanics**:
- Track consecutive days of completing daily practices
- Separate streaks per practice category (mood, containment, body, resource)
- "Overall wellness streak" = all daily items completed

**UI**:
- Small flame icon with number
- Option to hide streaks entirely (Settings: "Hide streaks for less pressure")
- Never shame for broken streaks
- Celebrate milestones (7, 14, 30, 60, 90 days) with gentle animation

---

## Insights (Opt-In, Premium)

### Entry Point
**Location**: Dedicated "Insights" tab in main navigation

**Never auto-open after mood logging** (to preserve calm, immediate experience)

### Insights Types

#### 1. Mood Trends
- Line graph: Mood score over time (7d, 30d, 90d views)
- Most common emotions (word cloud or bar chart)
- Most common nervous system state

#### 2. Practice Completion
- Heatmap calendar (GitHub-style)
- Completion rate per practice type
- Favorite practices (most logged)

#### 3. Correlations (Lightweight, Cautious)
**Approach**: Show patterns, not causation

**Examples**:
- "In your data, on days you complete a body exercise, your next-day mood averages 0.8 points higher"
- "You tend to report hyperarousal more on weekdays"
- "Cold exposure sessions correlate with 'calm' body sensations"

**UI Language**:
- "In your data..." (emphasizes personal patterns)
- "Tends to" / "Often associated with" (avoids claiming causation)
- Disclaimer: "These are patterns in your data, not clinical recommendations"

#### 4. Exports
- PDF summary (last 30 days)
- CSV export (all data, machine-readable)
- "Share with therapist" feature (generates anonymized summary)

---

## Privacy & Data Governance

### Disclaimers (Shown Once During Onboarding)
**Screen 1**: "This is self-help, not medical care"
- Not a substitute for therapy or medical treatment
- Not FDA-approved
- If in crisis, contact emergency services

**Screen 2**: "Your data, your choice"
- Works fully offline
- Sign in optional
- Delete anytime

### Data Handling
**Local Storage (iOS)**:
- SQLite encrypted with user's device key
- Backed by Keychain for sensitive flags (premium status)
- Face ID locks app, not just data

**Cloud Storage (Supabase)**:
- End-to-end encryption for notes/free-text (client-side encrypt before upload)
- RLS policies enforce user can only access own data
- Minimal PII: email (if signed in), timestamps, practice logs
- No third-party analytics by default (user can opt-in to anonymized usage stats)

### Data Deletion
**User-Initiated**:
- "Delete My Account" in Settings
- Confirms: "This will delete all cloud data. Local data will remain until you uninstall the app."
- Executes: Delete user row in Supabase (cascades to all related tables)

**Regulatory Compliance**:
- GDPR-compliant (export, deletion)
- CCPA-compliant
- No selling of data (stated in Privacy Policy)

---

## Platform-Specific Requirements

### iOS App (SwiftUI)

#### Architecture Patterns
- **MVVM** with Combine for reactive data flow
- **Repository pattern** for data layer (abstracts local vs. remote)
- **Offline-first**: Local SQLite is source of truth; sync is replication

#### Key Components
1. **LocalStorageManager**
   - SQLCipher for encryption
   - CRUD operations on local SQLite
   - Migration logic (schema versioning)

2. **SyncEngine**
   - Background sync with Supabase
   - Conflict resolution: Last-write-wins (timestamp-based)
   - Exponential backoff on failures
   - Sync only when signed in + online

3. **PurchaseManager**
   - StoreKit 2 integration
   - Transaction verification
   - Entitlement persistence (Keychain + Supabase)
   - Restore purchases flow

4. **BiometricAuthManager**
   - Face ID / Touch ID lock
   - Unlock required on app launch (if enabled)

5. **NotificationManager**
   - Local notifications for reminders
   - Request permission on first reminder setup
   - Handle notification taps (deep link to practice)

#### Screens (Minimum Viable)
1. **Onboarding** (3 screens: Welcome, Privacy, Set Daily Time)
2. **Home/Dashboard** (Today's practices, Glimmers, Quick access)
3. **Practice Detail** (Each practice type)
4. **History** (Calendar view + list)
5. **Insights** (Charts, correlations)
6. **Settings** (Account, Reminders, Privacy, Export, Premium)
7. **Paywall** (Premium upsell, triggered contextually)

---

### Web App (Next.js)

#### Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Auth**: Supabase Auth (email + optional OAuth)
- **UI**: Tailwind CSS + Radix UI (accessible, headless components)
- **State**: React Context or Zustand (lightweight)
- **Charts**: Recharts or Chart.js
- **Forms**: React Hook Form + Zod validation

#### Pages/Routes
1. `/` - Landing page (marketing)
2. `/login` - Sign in / Sign up
3. `/dashboard` - Home (like iOS home screen)
4. `/practices/[type]` - Individual practice pages
5. `/insights` - Trends and correlations
6. `/settings` - Account, export, delete
7. `/premium` - Purchase page (integrate Stripe or Paddle)

#### Responsive Design
- Mobile-first (many users may use web on tablet in bed)
- Desktop: Sidebar navigation, expanded charts

#### Web-Specific Features
- **No offline mode** (requires account)
- **Browser notifications** (if user opts in)
- **Export from browser** (direct download, no email)

---

## Supabase Backend Architecture

### Auth Strategy
- **Anonymous Mode**: No Supabase interaction (iOS/web handles locally)
- **Synced Mode**: Supabase Auth with email or Apple provider
- **Account Linking**: New user created on first sync; local data migrated

### Database Schema (PostgreSQL)

```sql
-- See separate schema.sql file for full implementation
```

**Key Tables** (summarized here, detailed in deliverable):
1. `profiles` - User settings, preferences
2. `daily_mood_records` - Mood logs
3. `practice_sessions` - All practice completions
4. `action_items` - Tasks from basic needs journal
5. `glimmers` - User's glimmers list
6. `entitlements` - Premium purchase records
7. `device_migrations` - Track local→cloud migrations

### Row-Level Security (RLS)
**All tables**:
```sql
CREATE POLICY "Users can only access own data"
ON table_name
FOR ALL
USING (auth.uid() = user_id);
```

**Special case: `entitlements` table**:
- Readable by user
- Writable only by Edge Function (service role)

### Edge Functions

#### Function 1: `verify-purchase`
**Purpose**: Verify StoreKit receipt and create entitlement

**Endpoint**: `POST /functions/v1/verify-purchase`

**Input**:
```json
{
  "platform": "ios",
  "transactionId": "...",
  "receipt": "base64-encoded-receipt"
}
```

**Process**:
1. Validate JWT from request (user must be signed in)
2. Call Apple's verifyReceipt API
3. Check transaction is valid and matches product ID
4. Insert into `entitlements` table
5. Return success

**Security**:
- Use service role key (bypasses RLS)
- Rate-limit to prevent abuse
- Idempotent (duplicate calls safe)

#### Function 2: `generate-insights` (Optional)
**Purpose**: Pre-compute correlations for heavy data

**Trigger**: Scheduled (daily) or on-demand

**Process**:
1. For each user, aggregate mood + practice data
2. Calculate correlations
3. Store in `insights` table (not implemented in MVP; compute on-demand instead)

### Storage Buckets
1. `audio-guides` - Public (practice audio files)
2. `user-exports` - Private (per-user exported PDFs)

---

## Technical Deliverables Summary

### Documentation
- [x] This PRD
- [ ] Screen map with user flows
- [ ] Wireframes (low-fidelity)
- [ ] Component inventory (design system)

### Backend
- [ ] `schema.sql` (Supabase database schema + RLS)
- [ ] Edge Functions (verify-purchase, etc.)
- [ ] Seed data (sample practices, glimmers)

### iOS
- [ ] Xcode project structure
- [ ] LocalStorageManager (SQLite + encryption)
- [ ] SyncEngine (Supabase integration)
- [ ] PurchaseManager (StoreKit)
- [ ] Core screens (SwiftUI)
- [ ] Unit tests (data layer)

### Web
- [ ] Next.js project setup
- [ ] Supabase client configuration
- [ ] Authentication flows
- [ ] Dashboard + practice pages
- [ ] Insights page with charts
- [ ] Payment integration (Stripe/Paddle)

### QA & Launch
- [ ] Privacy policy & Terms of Service
- [ ] App Store submission materials
- [ ] Beta testing plan (TestFlight)
- [ ] Web hosting (Vercel/Netlify)
- [ ] Monitoring (Sentry, LogRocket)

---

## Success Metrics (Post-Launch)

### Engagement
- DAU / MAU ratio
- Average practices per user per week
- Streak retention (% of users with 7+ day streak)

### Monetization
- Free-to-paid conversion rate
- Time to purchase (days after install)
- Signed-in vs. local-only premium purchasers

### Retention
- D1, D7, D30 retention
- Churn analysis (practice frequency before churn)

### Qualitative
- App Store reviews (target 4.5+ stars)
- Support ticket volume
- User-reported outcomes (optional survey)

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Users never sign in (can't attribute premium) | Lost revenue on device switches | Prompt "Sign in to protect your purchase" after payment |
| StoreKit receipt validation fails | Angry customers | Graceful fallback; allow local override for 48h while we fix |
| Supabase downtime | Synced users locked out | Offline-first means app still works; show "Sync paused" banner |
| Correlation insights misinterpreted as medical advice | Liability | Strong disclaimers; avoid causal language; "correlation ≠ causation" |
| Users feel pressured by streaks | Abandonment | Prominent "Hide streaks" option; gentle tone in copy |

---

## Roadmap (Post-MVP)

### Phase 2 (3-6 months post-launch)
- Community glimmers (opt-in sharing, moderated)
- Therapist portal (for users to grant read access)
- Apple Health integration (sleep data → insights)
- More guided practices (video-based)

### Phase 3 (6-12 months)
- Android app
- Wearable integration (Apple Watch complications)
- Group challenges (for couples/friends)
- Multi-language support

---

## Appendix: Design Principles

1. **Calm by Default**: No red badges, no urgency, no FOMO
2. **Accessible**: WCAG AA compliance, VoiceOver support, large text
3. **Fast**: <2s load time, 60fps animations
4. **Transparent**: Clear about what data is collected and why
5. **Trustworthy**: No dark patterns, honest premium value prop

---

## Open Questions (For Product Review)

1. Should free tier include Worry Record (limited to 3/month) to showcase premium?
2. Ideal onboarding length: 3 screens or 5 screens?
3. Web app premium purchase: Stripe vs. Paddle vs. LemonSqueezy?
4. Should we support family sharing for iOS premium purchase?
5. Correlation insights: Require minimum data points (e.g., 30 days) before showing?

---

**Document Version**: 1.0
**Last Updated**: 2026-01-22
**Owner**: Product + Engineering Team
**Status**: Draft for Review
