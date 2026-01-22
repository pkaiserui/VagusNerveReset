# Screen Map & User Flows: Vagus Nerve Reset App

## Information Architecture

```
Root
├── Onboarding (First Launch Only)
│   ├── Welcome
│   ├── Privacy Explainer
│   └── Set Daily Preferences
│
├── Main App (Tab Navigation)
│   ├── Tab 1: Home/Today
│   ├── Tab 2: Practices
│   ├── Tab 3: Glimmers
│   ├── Tab 4: Insights (Premium)
│   └── Tab 5: Settings
│
├── Practice Screens (Modal/Push)
│   ├── Daily Mood Record
│   ├── Containment Exercise
│   ├── Body Exercise
│   ├── Regulating Resource
│   ├── Worry Record (Premium)
│   ├── Emotion Recognition (Timer)
│   ├── Basic Needs Journal (Premium)
│   └── State-Based Resources
│
├── Account Screens
│   ├── Sign In / Sign Up
│   ├── Migration Wizard
│   └── Account Settings
│
└── Premium/Purchase
    ├── Paywall (Contextual)
    ├── Purchase Flow
    └── Restore Purchase
```

---

## Detailed Screen Specifications

### Onboarding Flow (First Launch)

#### Screen 1: Welcome
**Purpose**: Set expectations, communicate value prop

**Layout**:
```
┌─────────────────────────────┐
│                             │
│      [App Icon/Logo]        │
│                             │
│    Vagus Nerve Reset        │
│                             │
│   Your calm companion for   │
│   nervous system regulation │
│                             │
│  • No sign-in required      │
│  • Works fully offline      │
│  • Science-backed practices │
│                             │
│                             │
│     [Continue Button]       │
│                             │
└─────────────────────────────┘
```

**Interactions**:
- Tap "Continue" → Screen 2

---

#### Screen 2: Privacy Explainer
**Purpose**: Build trust, set privacy expectations

**Layout**:
```
┌─────────────────────────────┐
│    Your Data, Your Choice   │
│                             │
│  🔒 Fully Private           │
│  Your data stays on your    │
│  device unless you choose   │
│  to sync                    │
│                             │
│  🚫 Not Medical Advice      │
│  This is self-help, not     │
│  medical care. If in crisis,│
│  contact emergency services │
│                             │
│  ✅ Your Control            │
│  Export or delete anytime   │
│                             │
│     [I Understand]          │
│                             │
└─────────────────────────────┘
```

**Interactions**:
- Tap "I Understand" → Screen 3
- Show this screen only once (set flag in UserDefaults)

---

#### Screen 3: Set Daily Preferences
**Purpose**: Customize reminder times

**Layout**:
```
┌─────────────────────────────┐
│  When should we remind you? │
│                             │
│  Morning Body Practice      │
│  [Time Picker: 8:00 AM]     │
│                             │
│  Evening Mood Check         │
│  [Time Picker: 8:00 PM]     │
│                             │
│  💡 You can change these    │
│     anytime in Settings     │
│                             │
│  [Skip for Now]  [Set Times]│
│                             │
└─────────────────────────────┘
```

**Interactions**:
- Tap "Set Times" → Request notification permission → Home
- Tap "Skip for Now" → Home (no reminders)

---

### Main Navigation (Tab Bar)

**5 Tabs** (iOS: Bottom, Web: Sidebar on desktop, bottom on mobile)

| Icon | Label | Purpose |
|------|-------|---------|
| 🏠 | Today | Daily dashboard, quick access |
| 📋 | Practices | Browse all available practices |
| ✨ | Glimmers | View and add glimmers |
| 📊 | Insights | Trends, correlations (Premium) |
| ⚙️ | Settings | Account, preferences, export |

---

### Tab 1: Home/Today

**Purpose**: Central hub, show today's progress, quick state-based actions

**Layout** (Scrollable):
```
┌─────────────────────────────────┐
│  Good Evening, [User] 🌙         │ ← Greeting based on time
│                                 │
│  ┌─────────────────────────┐   │
│  │ Today's Progress        │   │
│  │ ●●○○ 2/4 complete       │   │ ← Progress ring/bar
│  └─────────────────────────┘   │
│                                 │
│  Daily Practices                │
│  ┌─────────────────────────┐   │
│  │ ✅ Body Exercise        │   │ ← Completed (checkmark)
│  │    Bee Breathing • 8:05 AM │ │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ [ ] Containment         │   │ ← Not done (tap to start)
│  │    Tap to choose        │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ [ ] Regulating Resource │   │
│  │    Tap to choose        │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ [ ] Mood Record         │   │
│  │    Due at 8:00 PM       │   │
│  └─────────────────────────┘   │
│                                 │
│  Quick Access                   │
│  ┌───────┐ ┌───────┐           │
│  │ 🔥 I  │ │ 🌊 I  │           │
│  │ feel  │ │ feel  │           │
│  │ activ.│ │ shut  │           │
│  │       │ │ down  │           │
│  └───────┘ └───────┘           │
│                                 │
│  Today's Glimmer ✨             │
│  ┌─────────────────────────┐   │
│  │ "Morning coffee aroma"  │   │ ← Random glimmer
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

**Interactions**:
- Tap incomplete practice card → Navigate to practice detail
- Tap "I feel activated" → Show hyperarousal resources list
- Tap "I feel shut down" → Show hypoarousal resources list
- Tap glimmer card → Navigate to Glimmers tab
- Pull-to-refresh to update (if synced mode)

**Dynamic Behavior**:
- Greeting changes: Morning/Afternoon/Evening
- Progress updates in real-time as practices completed
- Glimmer rotates daily (random from user's list)

---

### Tab 2: Practices

**Purpose**: Browse and start any practice (not just today's)

**Layout** (Scrollable, Grouped List):
```
┌─────────────────────────────────┐
│  All Practices                  │
│  [Search bar]                   │
│                                 │
│  DAILY ROUTINE                  │
│  ┌─────────────────────────┐   │
│  │ Mood Record             │   │
│  │ Track your daily state  │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ Containment Exercises   │   │
│  │ 4 techniques            │   │ ← Shows count
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ Body Exercises          │   │
│  │ 3 techniques  🔒 2 Premium │
│  └─────────────────────────┘   │
│                                 │
│  AS NEEDED                      │
│  ┌─────────────────────────┐   │
│  │ Worry Record       🔒   │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ Emotion Recognition     │   │
│  └─────────────────────────┘   │
│                                 │
│  JOURNALING                     │
│  ┌─────────────────────────┐   │
│  │ Basic Needs Journal 🔒  │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ Glimmers Map            │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

**Interactions**:
- Tap any practice → Navigate to detail screen (or show paywall if locked)
- Tap search → Filter practices by name
- 🔒 icon indicates premium-only

---

### Tab 3: Glimmers

**Purpose**: View, add, and manage glimmers

**Layout**:
```
┌─────────────────────────────────┐
│  Your Glimmers ✨               │
│                                 │
│  [+ Add New Glimmer]            │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Morning coffee aroma ☕ │   │ ← Card with emoji
│  │ [⭐ Pinned]             │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ Dog wagging tail 🐕     │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ Sunset colors 🌅        │   │
│  └─────────────────────────┘   │
│                                 │
│  💡 Glimmers are moments of    │
│     safety, joy, and connection│
│                                 │
│  Free: 1 glimmer               │
│  Premium: Unlimited            │
│                                 │
└─────────────────────────────────┘
```

**Interactions**:
- Tap "+ Add New Glimmer" → Show modal with text input
- Long-press card → Options: Pin, Edit, Delete
- If free user tries to add 2nd glimmer → Show premium paywall

---

### Tab 4: Insights (Premium)

**Purpose**: Visualize trends, correlations, and patterns

**Layout** (Scrollable):
```
┌─────────────────────────────────┐
│  Insights 📊                    │
│                                 │
│  🔒 Premium Feature             │
│  [Unlock Premium]               │ ← If not premium
│                                 │
│  OR (if premium):               │
│                                 │
│  Time Range: [7d] 30d 90d      │
│                                 │
│  Mood Trend                     │
│  ┌─────────────────────────┐   │
│  │     [Line Chart]        │   │
│  │   📈 +0.5 avg this week │   │
│  └─────────────────────────┘   │
│                                 │
│  Practice Completion            │
│  ┌─────────────────────────┐   │
│  │   [Heatmap Calendar]    │   │
│  │   🔥 12-day streak      │   │
│  └─────────────────────────┘   │
│                                 │
│  Patterns in Your Data          │
│  ┌─────────────────────────┐   │
│  │ On days you complete a  │   │
│  │ body exercise, your     │   │
│  │ next-day mood averages  │   │
│  │ 0.8 points higher       │   │
│  └─────────────────────────┘   │
│                                 │
│  [Export Data]                  │
│                                 │
└─────────────────────────────────┘
```

**Interactions**:
- Tap time range buttons → Re-render charts
- Tap "Export Data" → Show export options (PDF, CSV)
- If not premium → Tap "Unlock Premium" → Paywall

**Data Requirements**:
- Need minimum 7 days of data to show trends
- Correlations require 30+ days (show placeholder otherwise)

---

### Tab 5: Settings

**Purpose**: Account, preferences, privacy controls

**Layout** (Grouped List):
```
┌─────────────────────────────────┐
│  Settings ⚙️                    │
│                                 │
│  ACCOUNT                        │
│  ┌─────────────────────────┐   │
│  │ Local Only Mode         │   │ ← If not signed in
│  │ [Sign In to Sync]       │   │
│  └─────────────────────────┘   │
│  OR:                            │
│  ┌─────────────────────────┐   │
│  │ user@example.com        │   │ ← If signed in
│  │ [Manage Account]        │   │
│  └─────────────────────────┘   │
│                                 │
│  PREMIUM                        │
│  ┌─────────────────────────┐   │
│  │ Status: Active ✓        │   │
│  │ [Restore Purchase]      │   │
│  └─────────────────────────┘   │
│                                 │
│  PREFERENCES                    │
│  ┌─────────────────────────┐   │
│  │ Reminder Times          │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ Hide Streaks     [Toggle]│  │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ Face ID Lock     [Toggle]│  │
│  └─────────────────────────┘   │
│                                 │
│  DATA & PRIVACY                 │
│  ┌─────────────────────────┐   │
│  │ Export My Data          │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ Delete All Data         │   │
│  └─────────────────────────┘   │
│                                 │
│  ABOUT                          │
│  ┌─────────────────────────┐   │
│  │ Privacy Policy          │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ Terms of Service        │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ App Version 1.0.0       │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

**Interactions**:
- Tap "Sign In to Sync" → Navigate to Sign In/Sign Up screen
- Tap "Manage Account" → Show account details (email, sign-out)
- Tap "Restore Purchase" → Trigger StoreKit restore
- Tap "Export My Data" → Generate PDF or CSV
- Tap "Delete All Data" → Confirmation alert → Delete

---

## Practice Detail Screens

### Daily Mood Record Screen

**Layout**:
```
┌─────────────────────────────────┐
│  [< Back]    Mood Record        │
│                                 │
│  How was your day overall?      │
│                                 │
│  😢 ————————————————— 😊        │
│     1  2  3  4  5  6  7  8  9  10
│         [Slider at 7]           │
│                                 │
│  What emotions did you feel?    │
│  [Multi-select chips]           │
│  [Joy] [Anger] [Fear] [Sadness] │
│  [Anxiety] [Gratitude] +more    │
│                                 │
│  Your nervous system state?     │
│  [Radio buttons]                │
│  ○ Balanced                     │
│  ○ Hyperarousal (activated)     │
│  ○ Hypoarousal (shut down)      │
│  ○ Not sure                     │
│                                 │
│  Body sensations? (optional)    │
│  [Tags: Tension, Fatigue, ...]  │
│                                 │
│  Any notes? (optional)          │
│  [Text field, 500 char max]     │
│                                 │
│         [Save Mood Record]      │
│                                 │
└─────────────────────────────────┘
```

**Interactions**:
- Move slider → Update score
- Tap emotion chip → Toggle selection (multi-select)
- Tap radio button → Select state
- Tap "Save Mood Record" → Validate → Save → Show success toast → Navigate back to Home

**Validation**:
- Must select at least mood score (1-10)
- Emotions, state, body tags, notes are optional

---

### Containment Exercise Screen (Example: Container Visualization)

**Layout** (Practice Selection):
```
┌─────────────────────────────────┐
│  [< Back]  Containment Exercise │
│                                 │
│  Choose today's practice:       │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Container Visualization │   │ ← Free
│  │ 5 min • Guided audio    │   │
│  │ [Start Practice]        │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Box Breathing      🔒   │   │ ← Premium
│  │ 4 min • Customizable    │   │
│  │ [Unlock Premium]        │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Body Scan          🔒   │   │
│  │ 8 min • Progressive     │   │
│  │ [Unlock Premium]        │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

**Layout** (During Practice - Full Screen):
```
┌─────────────────────────────────┐
│  [X Close]                      │
│                                 │
│                                 │
│                                 │
│      Container Visualization    │
│                                 │
│        [Breathing Circle]       │ ← Animated
│        Expanding/contracting    │
│                                 │
│                                 │
│            3:42                 │ ← Timer
│           remaining             │
│                                 │
│                                 │
│       [Pause] [End Early]       │
│                                 │
└─────────────────────────────────┘
```

**Post-Practice**:
```
┌─────────────────────────────────┐
│  Practice Complete! ✓           │
│                                 │
│  How do you feel now?           │
│                                 │
│  ○ Balanced                     │
│  ○ Hyperarousal                 │
│  ○ Hypoarousal                  │
│  ○ Not sure                     │
│                                 │
│  [Skip]        [Save & Finish]  │
│                                 │
└─────────────────────────────────┘
```

**Interactions**:
- Tap "Start Practice" → Enter fullscreen mode → Begin audio/timer
- Tap "Pause" → Pause timer and audio
- Tap "End Early" → Confirm → Save partial session
- Tap "Close" (X) → Confirm → Discard session
- After completion → Prompt for post-practice state → Save → Navigate back

---

### Worry Record Screen (Premium)

**Layout** (Form):
```
┌─────────────────────────────────┐
│  [< Back]    Worry Record  🔒   │
│                                 │
│  What are you worried about?    │
│  [Text area]                    │
│                                 │
│  How likely is this? (0-100%)   │
│  [Slider: 0 ——— 50 ——— 100]     │
│                                 │
│  Evidence FOR this worry:       │
│  • [Text input]                 │
│  • [Text input]                 │
│  [+ Add another]                │
│                                 │
│  Evidence AGAINST this worry:   │
│  • [Text input]                 │
│  • [Text input]                 │
│  [+ Add another]                │
│                                 │
│  More balanced thought:         │
│  [Text area]                    │
│                                 │
│         [Save Worry Record]     │
│                                 │
└─────────────────────────────────┘
```

**Interactions**:
- Tap "+ Add another" → Add new bullet input
- Tap "Save Worry Record" → Validate → Save → Show success → Navigate back
- If not premium → Show paywall instead of form

---

### Basic Needs Journal Screen (Premium)

**Layout** (Multi-step wizard):
```
┌─────────────────────────────────┐
│  [< Back]  Basic Needs Journal  │
│  Step 1 of 5                    │
│                                 │
│  Are you getting enough sleep?  │
│                                 │
│  ○ Yes, mostly                  │
│  ○ Sometimes                    │
│  ○ No, not really               │
│                                 │
│  Tell me more (optional):       │
│  [Text area]                    │
│                                 │
│           [Next]                │
│                                 │
└─────────────────────────────────┘
```

**After all steps** → Summary screen:
```
┌─────────────────────────────────┐
│  Suggested Action Items         │
│                                 │
│  Based on your responses:       │
│                                 │
│  ☐ Set a bedtime alarm for 10pm│
│    Due: Daily                   │
│    [Edit] [Delete]              │
│                                 │
│  ☐ Plan 3 nourishing meals      │
│    Due: Tomorrow                │
│    [Edit] [Delete]              │
│                                 │
│  [+ Add Custom Action]          │
│                                 │
│      [Save Action Items]        │
│                                 │
└─────────────────────────────────┘
```

**Interactions**:
- Tap "Next" → Advance to next question
- After all questions → Generate action items based on "Sometimes" or "No" answers
- User can edit, delete, or add custom actions
- Tap "Save Action Items" → Save to database → Set reminders → Navigate to Home

---

### State-Based Resource Lists

**Hyperarousal Resources** (shown when user taps "I feel activated"):
```
┌─────────────────────────────────┐
│  [< Back]  Hyperarousal         │
│            Resources            │
│                                 │
│  Quick tools to calm activation:│
│                                 │
│  ┌─────────────────────────┐   │
│  │ Cold Exposure      🔒   │   │
│  │ Ice on face • 2 min     │   │
│  │ [Start]                 │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Singing            🔒   │   │
│  │ Humming or songs • 5 min│   │
│  │ [Start]                 │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Wall Push          🔒   │   │
│  │ Proprioceptive • 3 min  │   │
│  │ [Start]                 │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

**Hypoarousal Resources** (shown when user taps "I feel shut down"):
```
┌─────────────────────────────────┐
│  [< Back]  Hypoarousal          │
│            Resources            │
│                                 │
│  Quick tools to increase energy:│
│                                 │
│  ┌─────────────────────────┐   │
│  │ Natural Light      🔒   │   │
│  │ Get outside • 10 min    │   │
│  │ [Start Timer]           │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Uplifting Music    🔒   │   │
│  │ Energizing playlist     │   │
│  │ [Start]                 │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Gentle Movement    🔒   │   │
│  │ Stretching • 5 min      │   │
│  │ [Start]                 │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

---

## Account Flow Screens

### Sign In / Sign Up Screen

**Layout**:
```
┌─────────────────────────────────┐
│  [< Back]    Sign In            │
│                                 │
│  Sync your data across devices  │
│                                 │
│  Email:                         │
│  [Email input]                  │
│                                 │
│  Password:                      │
│  [Password input]               │
│                                 │
│      [Sign In]                  │
│                                 │
│  Don't have an account?         │
│  [Create Account]               │
│                                 │
│  ─────── OR ───────             │
│                                 │
│  [Sign in with Apple]           │
│                                 │
│  [Forgot Password?]             │
│                                 │
└─────────────────────────────────┘
```

**Interactions**:
- Tap "Sign In" → Validate → Call Supabase Auth → On success: Show migration wizard
- Tap "Create Account" → Navigate to sign-up form (similar layout)
- Tap "Sign in with Apple" → Trigger Apple Sign-In flow → On success: Migration wizard

---

### Migration Wizard Screen

**Layout** (Step 1):
```
┌─────────────────────────────────┐
│  Import Your Local Data         │
│                                 │
│  You have local data on this    │
│  device. Would you like to      │
│  upload it to the cloud?        │
│                                 │
│  📊 12 mood records             │
│  🧘 18 practice sessions        │
│  ✨ 3 glimmers                  │
│                                 │
│  This is a one-way transfer.    │
│  Your local data will remain    │
│  on this device as a backup.    │
│                                 │
│  [Skip]    [Import to Cloud]    │
│                                 │
└─────────────────────────────────┘
```

**Layout** (Step 2 - Progress):
```
┌─────────────────────────────────┐
│  Importing Data...              │
│                                 │
│  [Progress bar: 47%]            │
│                                 │
│  Uploading mood records...      │
│                                 │
└─────────────────────────────────┘
```

**Layout** (Step 3 - Complete):
```
┌─────────────────────────────────┐
│  All Set! ✓                     │
│                                 │
│  Your data is now synced to     │
│  the cloud. Future changes      │
│  will sync automatically.       │
│                                 │
│  💡 You can now sign in on      │
│     other devices to access     │
│     your data.                  │
│                                 │
│           [Done]                │
│                                 │
└─────────────────────────────────┘
```

**Interactions**:
- Tap "Import to Cloud" → Hash device fingerprint → Upload all local records → Show progress
- Tap "Skip" → Still sign in, but don't migrate data (start fresh in cloud)
- Tap "Done" → Navigate to Home (now in synced mode)

---

## Premium/Purchase Flow

### Paywall Screen (Contextual)

**Layout**:
```
┌─────────────────────────────────┐
│  [X Close]                      │
│                                 │
│   Unlock Full Nervous System    │
│        Regulation Toolkit       │
│                                 │
│  ✓ All containment exercises    │
│  ✓ All body exercises           │
│  ✓ Unlimited glimmers           │
│  ✓ Worry Record                 │
│  ✓ Basic Needs Journal          │
│  ✓ Insights & correlations      │
│  ✓ Unlimited history            │
│  ✓ Data export                  │
│  ✓ All future updates           │
│                                 │
│    One-time purchase, forever   │
│                                 │
│      💎 $29.99 USD              │
│                                 │
│    [Purchase Lifetime Access]   │
│                                 │
│    [Restore Purchase]           │
│                                 │
│  💡 Sign in to unlock premium   │
│     on all your devices         │
│                                 │
└─────────────────────────────────┘
```

**Interactions**:
- Tap "Purchase Lifetime Access" → Trigger StoreKit purchase flow
- On purchase success:
  - If signed in: Call Edge Function to write entitlement → Unlock features → Close paywall
  - If local-only: Store entitlement locally → Unlock features → Show "Sign in to sync premium" prompt
- Tap "Restore Purchase" → Trigger StoreKit restore → Validate → Unlock if valid
- Tap "X Close" → Dismiss paywall (user can continue with free tier)

---

## User Flows (Step-by-Step)

### Flow 1: First-Time User (Local-Only Mode)

1. Launch app → Onboarding Screen 1 (Welcome)
2. Tap "Continue" → Onboarding Screen 2 (Privacy)
3. Tap "I Understand" → Onboarding Screen 3 (Set Times)
4. Set times → Request notification permission → Home
5. Home shows 0/4 practices complete
6. Tap "Mood Record" → Fill out mood form → Save
7. Home updates to 1/4 complete
8. Continue using app (all data local, encrypted)

**Decision Point**: User may stay in local-only mode indefinitely

---

### Flow 2: User Decides to Sync

1. From Home or Settings → Tap "Sign In to Sync"
2. Navigate to Sign In/Sign Up screen
3. Enter email/password OR tap "Sign in with Apple"
4. Authenticate with Supabase
5. Migration Wizard appears → "Import local data to cloud?"
6. Tap "Import to Cloud" → Show progress → Complete
7. Now in synced mode (all future writes sync automatically)

---

### Flow 3: User Purchases Premium (While Signed In)

1. Tap locked feature (e.g., "Worry Record")
2. Paywall appears
3. Tap "Purchase Lifetime Access"
4. StoreKit purchase flow → User authorizes with Face ID
5. Transaction completes
6. App calls Supabase Edge Function with receipt
7. Edge Function validates receipt → Writes to `entitlements` table
8. App receives success → Unlocks all premium features
9. Paywall dismisses → User can now access Worry Record

**Cross-Device Behavior**: User signs in on web → Supabase checks `entitlements` table → Premium unlocked

---

### Flow 4: User Purchases Premium (Local-Only Mode)

1. Tap locked feature
2. Paywall appears
3. Tap "Purchase Lifetime Access"
4. StoreKit purchase flow → Complete
5. App stores entitlement flag locally (Keychain)
6. Unlocks premium features on this device
7. Paywall dismisses → Show prompt: "Sign in to unlock premium on all devices"
8. User can tap "Not Now" (stay local) or "Sign In" (migrate + sync entitlement)

**If User Signs In Later**:
- During sign-in, app detects local premium entitlement
- Prompts: "We found a premium purchase on this device. Upload to cloud?"
- If yes → Call Edge Function with StoreKit receipt → Write to Supabase
- Now premium works on all signed-in devices

---

### Flow 5: Daily Practice Routine

**Morning (8:00 AM)**:
1. Notification: "Morning body practice reminder"
2. Tap notification → Opens app to Practices tab
3. Tap "Body Exercises" → Select "Bee Breathing"
4. Complete 3-minute practice
5. Log completion → Home updates to 1/4 complete

**Evening (8:00 PM)**:
1. Notification: "Evening mood check-in"
2. Tap notification → Opens app to Mood Record screen
3. Fill out mood, emotions, state
4. Save → Home updates to 4/4 complete
5. See completion animation (confetti or gentle pulse)
6. Streak increments to Day 13 🔥

---

### Flow 6: State-Based Resource Access

**User feels anxious (hyperaroused)**:
1. Open app to Home
2. Tap "I feel activated" button
3. Navigate to Hyperarousal Resources list
4. Tap "Cold Exposure" (premium)
5. If not premium → Paywall
6. If premium → Instructions screen: "Place ice pack on face for 2 minutes"
7. Start timer → Timer runs with gentle audio cue
8. Complete → Log session → Ask "How do you feel now?"
9. Save state → Navigate back to Home

---

### Flow 7: Insights & Trends (Premium)

1. Navigate to Insights tab
2. If not premium → Show paywall
3. If premium → Load charts:
   - Mood trend line chart (last 30 days)
   - Practice heatmap
   - Correlation card: "Body exercises → higher next-day mood"
4. Tap "Export Data" → Choose PDF or CSV
5. Generate export → Save to Files (iOS) or download (Web)
6. User can share with therapist or keep for records

---

## Web-Specific Differences

### Landing Page (`/`)
**Purpose**: Marketing, explain app, drive sign-ups

**Layout**:
- Hero: "Regulate Your Nervous System with Science-Backed Practices"
- Features list (same as app)
- Pricing: "One-time $29.99 for lifetime access"
- CTA: "Get Started" → `/login`
- Footer: Privacy Policy, Terms, Contact

---

### Dashboard (`/dashboard`)
**Purpose**: Same as iOS Home tab

**Layout** (Desktop):
- Sidebar navigation (left)
- Main content area (center): Today's practices, progress
- Right sidebar: Glimmer of the day, quick actions

**Responsive** (Mobile):
- Bottom tab bar (same as iOS)
- Hamburger menu for settings

---

### Practice Pages (`/practices/[type]`)
**Examples**:
- `/practices/mood-record`
- `/practices/containment`
- `/practices/worry-record`

**Layout**: Similar to iOS, but optimized for larger screens (more horizontal space)

---

### Purchase Flow (Web)
**Integration**: Stripe Checkout or Paddle

**Flow**:
1. User clicks "Unlock Premium"
2. Redirect to Stripe hosted checkout
3. Complete payment
4. Stripe webhook calls Supabase Edge Function → Write entitlement
5. Redirect back to `/dashboard?premium=success`
6. App detects new entitlement → Unlock features

---

## Design System Notes

### Color Palette (Calm, Neutral)
- **Primary**: Soft teal (#4A90A4) - calming, trustworthy
- **Secondary**: Warm peach (#F4A261) - gentle energy
- **Background**: Off-white (#F9F9F9) - easy on eyes
- **Text**: Dark gray (#333333) - readable, not harsh black
- **Success**: Muted green (#6A994E)
- **Warning**: Soft amber (#E76F51)
- **Premium**: Gold accent (#D4AF37)

### Typography
- **Headings**: SF Pro Rounded (iOS), Inter (Web) - friendly, modern
- **Body**: SF Pro Text (iOS), Inter (Web) - readable
- **Sizes**: Large (accessibility-first), minimum 16px body text

### Spacing
- **Base unit**: 8px
- **Generous padding**: Cards have 16-24px padding (avoid cramped feeling)
- **Ample whitespace**: Reduce cognitive load

### Animations
- **Subtle, calming**: No jarring transitions
- **Duration**: 200-300ms for most transitions
- **Easing**: Ease-in-out for smooth feel
- **Haptics** (iOS): Light feedback on button taps, medium on completions

### Iconography
- **Style**: Rounded, friendly (SF Symbols on iOS, Lucide on Web)
- **Size**: 24px minimum for tap targets
- **Color**: Match text color or use primary

### Components
- **Buttons**: Rounded corners (12px radius), high contrast
- **Cards**: Soft shadows, rounded corners (16px radius)
- **Inputs**: Clear labels, large touch targets (44x44pt minimum)
- **Toggles**: iOS-style switches (clear on/off states)

---

## Accessibility Requirements

### Vision
- Support Dynamic Type (iOS) up to XXXL
- Color contrast: WCAG AA minimum (4.5:1 for body text)
- VoiceOver labels on all interactive elements
- Screen reader announcements for state changes (e.g., "Mood saved")

### Motor
- Minimum 44x44pt touch targets (iOS Human Interface Guidelines)
- Avoid gestures that require precision (e.g., no tiny tap areas)
- Support Voice Control (iOS)

### Cognitive
- Simple, linear flows (avoid complex navigation)
- Clear, jargon-free language
- Option to hide streaks (reduce pressure)
- No time-pressure mechanics (no countdown timers for decisions)

---

## Open Questions for Design Review

1. **Glimmers on Home**: Show one random glimmer or rotate through 3?
2. **Paywall trigger**: Show after 3 locked feature taps, or immediately on first tap?
3. **Streak display**: Always visible on Home, or only in Insights?
4. **Web app pricing**: Same $29.99, or different model for web-only users?
5. **Migration wizard**: Auto-import on sign-in, or require explicit consent?

---

## Next Steps

1. **Wireframe Prototype**: Create clickable Figma prototype for user testing
2. **Component Library**: Build reusable SwiftUI/React components
3. **User Testing**: Test onboarding flow with 5-10 users (validate "no sign-in required" messaging)
4. **Visual Design**: Apply color palette, typography, create high-fidelity mockups

---

**Document Version**: 1.0
**Last Updated**: 2026-01-22
**Status**: Draft for Design Review
