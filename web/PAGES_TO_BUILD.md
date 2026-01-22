# Web App Pages - Build Checklist

## ✅ Completed Pages
- [x] `/` - Landing page (marketing)
- [x] `/login` - Sign in page
- [x] `/signup` - Sign up page
- [x] `/dashboard` - Home dashboard
- [x] `/auth/callback` - OAuth callback route

---

## 📋 Pages to Build

### Priority 1: Core Practice Pages (Week 1-2)

#### 1. Practices List Page
**Route**: `/practices`
**File**: `app/practices/page.tsx`
**Features**:
- List all available practices
- Show free vs. premium badges
- Filter by category (containment, body, regulating, etc.)
- Search functionality
- Link to individual practice pages

**Components needed**:
- `components/PracticeCard.tsx` - Practice list item
- `components/PracticeFilter.tsx` - Filter/sort controls

---

#### 2. Mood Record Page
**Route**: `/practices/mood-record`
**File**: `app/practices/mood-record/page.tsx`
**Features**:
- Mood score slider (1-10)
- Emotion picker (multi-select chips)
- Nervous system state selector (balanced/hyperarousal/hypoarousal/unknown)
- Body tags selector (tension, fatigue, energy, pain, restlessness, calm)
- Notes textarea (optional, max 500 chars)
- Save button → redirect to dashboard with success message

**Components needed**:
- `components/MoodSlider.tsx` - 1-10 slider with labels
- `components/EmotionPicker.tsx` - Multi-select emotion chips
- `components/StateSelector.tsx` - Radio buttons for nervous system state
- `components/BodyTagsSelector.tsx` - Multi-select body sensation tags

---

#### 3. Containment Exercise Page
**Route**: `/practices/containment`
**File**: `app/practices/containment/page.tsx`
**Features**:
- List of containment exercises:
  - Container visualization (Free) - 5 min guided audio
  - Box breathing (Premium) - 4-4-4-4, customizable
  - Body scan (Premium)
  - Progressive muscle relaxation (Premium)
- Exercise description and duration
- "Start" button → full-screen timer
- State before/after tracking
- Log completion

**Components needed**:
- `components/PracticeTimer.tsx` - Full-screen timer with audio cues
- `components/ExerciseCard.tsx` - Individual exercise option

---

#### 4. Body Exercise Page
**Route**: `/practices/body-exercise`
**File**: `app/practices/body-exercise/page.tsx`
**Features**:
- List of body exercises:
  - Bee breathing (Free) - 3 min
  - Arm swings (Premium) - 2 min with video demo
  - Butterfly hug (Premium)
  - Pendulation (Premium)
- Video/animated guide
- Timer
- Log completion

**Components needed**:
- `components/VideoPlayer.tsx` - Video guide player
- `components/PracticeTimer.tsx` - Reuse from containment

---

#### 5. Regulating Resource Page
**Route**: `/practices/regulating-resource`
**File**: `app/practices/regulating-resource/page.tsx`
**Features**:
- List of regulating resources (all Premium):
  - Proprioceptive input (weighted blanket, self-massage guide)
  - Cold exposure (cold shower protocol, ice on face)
  - Singing (suggested songs, karaoke timer)
  - Natural light (sunlight exposure timer, reminder)
  - Relaxing music (curated playlist links)
  - Hot shower/bath (guided relaxation timer)
- Resource guide/timer
- Rate helpfulness (optional)
- Log completion

**Components needed**:
- `components/ResourceGuide.tsx` - Resource-specific instructions
- `components/PracticeTimer.tsx` - Reuse timer component

---

#### 6. Hyperarousal Resources Page
**Route**: `/practices/hyperarousal-resource`
**File**: `app/practices/hyperarousal-resource/page.tsx`
**Features**:
- Quick-access tools for activated/anxious state:
  - Cold exposure (ice protocol)
  - Singing (specific grounding songs)
  - Intense proprioception (wall push, grip squeezes)
- Quick list → tap to start → log completion
- Premium gate if not premium

**Components needed**:
- `components/QuickResourceCard.tsx` - Quick action card
- `components/Paywall.tsx` - Premium upsell modal

---

#### 7. Hypoarousal Resources Page
**Route**: `/practices/hypoarousal-resource`
**File**: `app/practices/hypoarousal-resource/page.tsx`
**Features**:
- Quick-access tools for shut down/depressed state:
  - Natural light (get outside reminder)
  - Uplifting music
  - Hot shower ritual
  - Movement (gentle stretching prompts)
- Quick list → tap to start → log completion
- Premium gate if not premium

**Components needed**:
- `components/QuickResourceCard.tsx` - Reuse from hyperarousal
- `components/Paywall.tsx` - Reuse paywall

---

#### 8. Worry Record Page (Premium)
**Route**: `/practices/worry-record`
**File**: `app/practices/worry-record/page.tsx`
**Features**:
- "What are you worried about?" (free text)
- "How likely is this to happen?" (slider, 0-100%)
- "Evidence for?" (bullet points input)
- "Evidence against?" (bullet points input)
- "More balanced thought?" (free text)
- Save → show summary
- Premium gate

**Components needed**:
- `components/WorryForm.tsx` - Multi-step worry record form
- `components/LikelihoodSlider.tsx` - 0-100% slider
- `components/BulletPointsInput.tsx` - List input for evidence

---

#### 9. Emotion Recognition Page
**Route**: `/practices/emotion-recognition`
**File**: `app/practices/emotion-recognition/page.tsx`
**Features**:
- "What emotion are you feeling?" (select from list)
- "Where in your body?" (body map tap - simplified for web)
- "Let's sit with this for 90 seconds" → Timer with breathing cue
- "How intense is it now?" (before/after slider, 0-10)
- Log session

**Components needed**:
- `components/EmotionSelector.tsx` - Single emotion picker
- `components/BodyMap.tsx` - Interactive body map (or simplified list)
- `components/BreathingTimer.tsx` - 90-second timer with breathing visualization

---

#### 10. Basic Needs Journal Page (Premium)
**Route**: `/practices/basic-needs-journal`
**File**: `app/practices/basic-needs-journal/page.tsx`
**Features**:
- Guided prompts:
  - "Are you getting enough sleep?" (Y/N + details)
  - "Are you eating nourishing food?" (Y/N + details)
  - "Do you feel safe in your environment?" (Y/N + details)
  - "Are you connected to supportive people?" (Y/N + details)
  - "Do you have purpose/meaning?" (Y/N + details)
- For each "No" or "Sometimes": Auto-generate suggested action item
- User can edit or add custom action
- Save action items with due dates
- Premium gate

**Components needed**:
- `components/NeedsJournalForm.tsx` - Multi-step needs assessment
- `components/ActionItemGenerator.tsx` - Auto-generate action items
- `components/Paywall.tsx` - Reuse paywall

---

### Priority 2: Glimmers Page (Week 2)

#### 11. Glimmers List Page
**Route**: `/glimmers`
**File**: `app/glimmers/page.tsx`
**Features**:
- List of user's glimmers
- Add new glimmer form (modal or inline)
- Pin/unpin functionality
- Edit/delete glimmers
- Premium limit check (1 free, unlimited premium)
- Show paywall if at free limit and not premium

**Components needed**:
- `components/GlimmerCard.tsx` - Individual glimmer card
- `components/AddGlimmerForm.tsx` - Add/edit glimmer form
- `components/GlimmerList.tsx` - List with pin/unpin controls
- `components/Paywall.tsx` - Premium upsell when at limit

---

### Priority 3: Insights Page (Week 3)

#### 12. Insights Dashboard (Premium)
**Route**: `/insights`
**File**: `app/insights/page.tsx`
**Features**:
- Time range selector (7d, 30d, 90d)
- Mood Trends:
  - Line graph: Mood score over time
  - Most common emotions (word cloud or bar chart)
  - Most common nervous system state
- Practice Completion:
  - Heatmap calendar (GitHub-style)
  - Completion rate per practice type
  - Favorite practices (most logged)
- Correlations (lightweight, cautious):
  - "In your data, on days you complete a body exercise, your next-day mood averages 0.8 points higher"
  - Pattern displays with disclaimers
- Export options (PDF/CSV)
- Premium gate

**Components needed**:
- `components/MoodChart.tsx` - Line chart for mood trends
- `components/HeatmapCalendar.tsx` - Practice completion heatmap
- `components/EmotionWordCloud.tsx` - Word cloud or bar chart
- `components/CorrelationCard.tsx` - Display correlations
- `components/TimeRangeSelector.tsx` - 7d/30d/90d selector
- `components/ExportButton.tsx` - PDF/CSV export

---

### Priority 4: Settings & Account (Week 3-4)

#### 13. Settings Page
**Route**: `/settings`
**File**: `app/settings/page.tsx`
**Features**:
- Account Management:
  - Email display
  - Change password
  - Sign out button
- Preferences:
  - Reminder times (morning practice, evening mood)
  - Reminder enabled toggle
  - Hide streaks toggle
  - Notification permissions (browser notifications)
- Data Management:
  - Export data (PDF/CSV) button
  - Delete account button (with confirmation)
- Premium Status:
  - Show current premium status
  - Link to purchase if not premium
  - Restore purchase (if applicable)
- Privacy:
  - Link to Privacy Policy
  - Link to Terms of Service

**Components needed**:
- `components/SettingsSection.tsx` - Section wrapper
- `components/ReminderSettings.tsx` - Time pickers for reminders
- `components/ExportButton.tsx` - Reuse from insights
- `components/DeleteAccountModal.tsx` - Confirmation modal
- `components/PasswordChangeForm.tsx` - Change password form

---

### Priority 5: Premium & Purchase (Week 3)

#### 14. Premium Purchase Page
**Route**: `/premium`
**File**: `app/premium/page.tsx`
**Features**:
- Premium features list:
  - All containment exercises
  - All body exercises
  - Unlimited glimmers
  - All regulating resources
  - Basic needs journal
  - Worry Record
  - Full insights & correlations
  - Unlimited history
  - Data export
- Pricing: $29.99 one-time purchase
- "Purchase Premium" button → Stripe Checkout
- Testimonials/social proof (optional)
- FAQ section

**Components needed**:
- `components/PremiumFeaturesList.tsx` - Feature list
- `components/PurchaseButton.tsx` - Stripe Checkout trigger
- `components/Paywall.tsx` - Reusable paywall component

---

#### 15. Purchase Success Page
**Route**: `/premium/success`
**File**: `app/premium/success/page.tsx`
**Features**:
- Success confirmation
- "Welcome to Premium!" message
- Link back to dashboard
- Show newly unlocked features

---

#### 16. Purchase Cancel Page
**Route**: `/premium/cancel`
**File**: `app/premium/cancel/page.tsx`
**Features**:
- Payment cancelled message
- Option to try again
- Link back to premium page

---

### Priority 6: API Routes (Week 3-4)

#### 17. Stripe Checkout API
**Route**: `/api/create-checkout-session`
**File**: `app/api/create-checkout-session/route.ts`
**Features**:
- Create Stripe Checkout session
- Set success/cancel URLs
- Return session ID to frontend

---

#### 18. Stripe Webhook Handler
**Route**: `/api/webhooks/stripe`
**File**: `app/api/webhooks/stripe/route.ts`
**Features**:
- Verify Stripe webhook signature
- Handle payment success
- Call Supabase Edge Function to verify purchase
- Write entitlement to database

---

#### 19. Data Export API
**Route**: `/api/export`
**File**: `app/api/export/route.ts`
**Features**:
- Generate PDF or CSV export
- Include all user data (mood records, practices, glimmers, etc.)
- Return download file
- Support PDF and CSV formats

---

### Priority 7: Legal Pages (Week 4)

#### 20. Privacy Policy Page
**Route**: `/privacy`
**File**: `app/privacy/page.tsx`
**Features**:
- Privacy policy content
- GDPR/CCPA compliance information
- Data handling practices
- Contact information

---

#### 21. Terms of Service Page
**Route**: `/terms`
**File**: `app/terms/page.tsx`
**Features**:
- Terms of service content
- User agreements
- Disclaimers (self-help, not medical care)
- Refund policy

---

## 📊 Summary

### By Priority
- **Priority 1 (Core)**: 10 practice pages
- **Priority 2**: 1 glimmers page
- **Priority 3**: 1 insights page
- **Priority 4**: 1 settings page
- **Priority 5**: 3 premium/purchase pages
- **Priority 6**: 3 API routes
- **Priority 7**: 2 legal pages

### Total Pages to Build
- **21 pages/routes** total
- **10 practice pages** (most complex)
- **3 API routes** (backend integration)
- **8 other pages** (features, settings, legal)

### Estimated Complexity
- **Simple** (1-2 hours): Legal pages, success/cancel pages
- **Medium** (3-5 hours): Glimmers, Settings, Premium page
- **Complex** (6-10 hours): Practice pages, Insights, API routes

### Dependencies
- Stripe account and API keys
- Chart library (Recharts or Chart.js)
- PDF generation library
- Form validation (React Hook Form + Zod)

---

## 🎯 Recommended Build Order

### Week 1
1. Practices list page (`/practices`)
2. Mood record page (`/practices/mood-record`)
3. Containment exercise page (`/practices/containment`)
4. Body exercise page (`/practices/body-exercise`)

### Week 2
5. Regulating resource page (`/practices/regulating-resource`)
6. Hyperarousal/hypoarousal resource pages
7. Glimmers page (`/glimmers`)
8. Emotion recognition page (`/practices/emotion-recognition`)

### Week 3
9. Worry record page (`/practices/worry-record`)
10. Basic needs journal page (`/practices/basic-needs-journal`)
11. Insights page (`/insights`)
12. Premium purchase page (`/premium`)
13. Stripe integration (API routes)

### Week 4
14. Settings page (`/settings`)
15. Data export API
16. Legal pages (Privacy, Terms)
17. Polish and testing

---

**Last Updated**: 2026-01-22
**Status**: Ready for Development
