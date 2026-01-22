# Vagus Nerve Reset - Complete Project Structure

## Directory Tree

```
VagusNerveReset/
│
├── README.md                           # Project overview
├── IMPLEMENTATION_SUMMARY.md          # Implementation guide & next steps
├── PROJECT_STRUCTURE.md               # This file
│
├── docs/                              # ✓ Complete Documentation
│   ├── PRD.md                        # Product Requirements Document
│   ├── SCREEN_MAP.md                 # Screen wireframes & user flows
│   └── COMPONENT_INVENTORY.md        # Design system & components
│
├── supabase/                          # ✓ Complete Backend
│   ├── schema.sql                    # Database schema with RLS policies
│   ├── config.toml                   # Supabase configuration
│   ├── .env.example                  # Environment variables template
│   └── functions/                    # Edge Functions
│       ├── README.md                 # Edge Functions documentation
│       └── verify-purchase/
│           └── index.ts              # Purchase verification function
│
├── ios/                               # ⚠️  iOS App (Foundation Complete)
│   ├── README.md                     # iOS setup guide
│   └── VagusNerveReset/
│       └── VagusNerveReset/
│           ├── App/
│           │   └── VagusNerveResetApp.swift  # ✓ App entry point
│           │
│           ├── Models/                        # ✓ Core models complete
│           │   ├── Practice.swift            # Practice definitions
│           │   ├── MoodRecord.swift          # Mood check-in model
│           │   ├── PracticeSession.swift     # Session tracking
│           │   ├── Glimmer.swift             # Glimmer model
│           │   ├── ActionItem.swift          # [TODO]
│           │   ├── WorryRecord.swift         # [TODO]
│           │   ├── User.swift                # [TODO]
│           │   └── Entitlement.swift         # [TODO]
│           │
│           ├── Views/
│           │   ├── Components/               # [TODO - See Component Inventory]
│           │   │   ├── Buttons/
│           │   │   ├── Cards/
│           │   │   ├── Forms/
│           │   │   └── Charts/
│           │   │
│           │   └── Screens/                  # [TODO - See Screen Map]
│           │       ├── Onboarding/
│           │       ├── Home/
│           │       ├── Practices/
│           │       ├── Glimmers/
│           │       ├── Insights/
│           │       ├── Settings/
│           │       └── Account/
│           │
│           ├── ViewModels/                   # [TODO]
│           │   ├── HomeViewModel.swift
│           │   ├── MoodRecordViewModel.swift
│           │   └── ...
│           │
│           ├── Services/                     # [TODO - Critical]
│           │   ├── LocalStorageManager.swift # SQLCipher encryption
│           │   ├── SyncEngine.swift          # Supabase sync
│           │   ├── PurchaseManager.swift     # StoreKit 2
│           │   ├── BiometricAuthManager.swift
│           │   ├── NotificationManager.swift
│           │   └── SupabaseClient.swift
│           │
│           ├── Utilities/                    # ✓ Complete
│           │   ├── AppColors.swift           # Color palette
│           │   ├── AppFonts.swift            # Typography
│           │   ├── Spacing.swift             # Layout constants
│           │   ├── Extensions/               # [TODO]
│           │   └── Helpers/                  # [TODO]
│           │
│           └── Resources/                    # [TODO]
│               ├── Assets.xcassets
│               ├── Audio/
│               └── Info.plist
│
└── web/                               # [TODO - Not Yet Started]
    ├── README.md                      # [TODO] Web setup guide
    ├── package.json
    ├── next.config.js
    ├── tailwind.config.ts
    ├── tsconfig.json
    │
    ├── app/                           # Next.js App Router
    │   ├── (auth)/                    # Auth pages
    │   │   ├── login/
    │   │   └── signup/
    │   ├── dashboard/                 # Main app
    │   ├── practices/
    │   ├── insights/
    │   ├── settings/
    │   └── layout.tsx
    │
    ├── components/                    # React components
    │   ├── ui/                        # Radix UI primitives
    │   └── ...
    │
    ├── lib/                           # Utilities
    │   ├── supabase.ts               # Supabase client
    │   └── utils.ts
    │
    └── public/                        # Static assets
```

---

## File Status Legend

- ✓ **Complete**: File implemented with full functionality
- ⚠️ **Foundation**: Directory structure and key files created, implementation needed
- [TODO]: Not yet created, needs implementation

---

## Completed Deliverables (Ready to Use)

### 1. Documentation ✓
All documentation is complete and ready for development team:
- **PRD**: 13,000+ words covering all features, user flows, and requirements
- **Screen Map**: Detailed wireframes for all 20+ screens
- **Component Inventory**: Complete design system with code examples

### 2. Backend (Supabase) ✓
Fully functional backend, ready to deploy:
- **Database Schema**: 9 tables with RLS, indexes, and helper functions
- **Edge Functions**: Purchase verification for iOS and Web
- **Configuration**: Local development and production setup guides

### 3. iOS Foundation ✓
Core architecture established:
- **App Entry Point**: Complete app lifecycle management
- **Design System**: Colors, fonts, spacing constants
- **Core Models**: Practice, MoodRecord, PracticeSession, Glimmer

---

## Work Remaining by Priority

### Priority 1: Critical Path for MVP (iOS)

#### Week 1: Core Infrastructure
1. **Complete Models** (2 days)
   - ActionItem.swift
   - WorryRecord.swift
   - User.swift
   - Entitlement.swift

2. **LocalStorageManager** (3-4 days)
   - SQLCipher integration
   - CRUD operations for all models
   - Encryption key management (Keychain)
   - Schema migrations

3. **SupabaseClient** (2 days)
   - Supabase Swift SDK integration
   - Auth wrapper methods
   - Database query helpers
   - Error handling

#### Week 2: Sync & Auth
4. **SyncEngine** (4-5 days)
   - Upload local changes to Supabase
   - Download remote changes
   - Conflict resolution (last-write-wins)
   - Background sync scheduling

5. **AuthViewModel** (2 days)
   - Sign-in/sign-up flows
   - Session management
   - Migration wizard logic

#### Week 3: Premium & Notifications
6. **PurchaseManager** (3-4 days)
   - StoreKit 2 integration
   - Purchase flow
   - Receipt verification with Edge Function
   - Restore purchases

7. **NotificationManager** (2 days)
   - Local notification scheduling
   - Permission requests
   - Deep linking from notifications

#### Week 4-5: UI Implementation
8. **Components** (5 days)
   - Buttons, Cards, Forms (from Component Inventory)
   - Chart components (Swift Charts)
   - Progress indicators

9. **Onboarding** (2 days)
   - WelcomeView, PrivacyExplainerView, DailyPreferencesView

10. **Main Screens** (6 days)
    - HomeView (2 days)
    - PracticesListView (1 day)
    - GlimmersView (1 day)
    - InsightsView (2 days)
    - SettingsView (1 day)

11. **Practice Screens** (4 days)
    - MoodRecordView (1 day)
    - ContainmentExerciseView (1 day)
    - WorryRecordView (1 day)
    - PracticeTimerView (1 day)

#### Week 6: Testing & Polish
12. **Testing** (5 days)
    - Unit tests for Services and ViewModels
    - UI tests for critical flows
    - TestFlight beta

13. **Polish** (3 days)
    - Animations
    - Accessibility audit
    - Bug fixes

---

### Priority 2: Web App (Parallel Development)

Can be developed in parallel by a separate developer:

#### Week 1: Setup
- Next.js project initialization
- Supabase client configuration
- Authentication pages
- Landing page

#### Week 2-3: Core Features
- Dashboard
- Practice pages
- Mood record form
- Glimmers page

#### Week 3-4: Premium & Insights
- Stripe Checkout integration
- Insights/charts page
- Settings & data export

#### Week 4-5: Testing & Deploy
- E2E tests
- Responsive design
- Vercel deployment

---

## Key Technical Milestones

### Milestone 1: Local-Only Mode (iOS)
**Target**: End of Week 3
- [ ] User can complete onboarding
- [ ] User can log daily mood (stored locally)
- [ ] User can complete practices (stored locally)
- [ ] User can add glimmers (max 1 in free tier)
- [ ] App works fully offline

### Milestone 2: Sync & Auth (iOS)
**Target**: End of Week 4
- [ ] User can sign in
- [ ] User can migrate local data to cloud
- [ ] User's data syncs automatically
- [ ] Conflict resolution works correctly

### Milestone 3: Premium & Monetization (iOS)
**Target**: End of Week 5
- [ ] User can purchase premium (sandbox)
- [ ] Entitlement verified and stored
- [ ] Premium features unlock
- [ ] Purchase syncs across devices

### Milestone 4: MVP Complete (iOS)
**Target**: End of Week 6
- [ ] All core features implemented
- [ ] Beta testing complete
- [ ] Ready for App Store submission

### Milestone 5: Web App MVP
**Target**: End of Week 5 (parallel)
- [ ] User can sign in on web
- [ ] User can log mood and complete practices
- [ ] User can view insights
- [ ] User can purchase premium (Stripe)

---

## Dependencies & Prerequisites

### Before Starting Development

#### Accounts & Services
- [ ] Apple Developer Account ($99/year)
- [ ] Supabase Account (free tier OK for dev)
- [ ] Stripe Account (for web payments)
- [ ] TestFlight beta tester group

#### Development Tools
- [ ] Xcode 15+ (for iOS)
- [ ] Node.js 18+ (for web)
- [ ] Supabase CLI (`npm install -g supabase`)
- [ ] Git & GitHub repository

#### API Keys & Secrets
- [ ] Supabase project URL + anon key
- [ ] Supabase service role key
- [ ] Apple App Store Connect shared secret
- [ ] Stripe secret key
- [ ] Apple Sign-In credentials (optional)

#### Design Assets
- [ ] App icon (1024x1024)
- [ ] Practice audio files (or placeholders)
- [ ] App Store screenshots (6.7", 6.5", 5.5" displays)

---

## Recommended Development Workflow

### Daily Workflow
1. Pull latest changes from `main` branch
2. Create feature branch (`feature/mood-record-view`)
3. Implement feature (follow Component Inventory specs)
4. Write unit tests
5. Test on device/simulator
6. Create pull request
7. Code review
8. Merge to `main`

### Weekly Milestones
- **Monday**: Plan week's tasks
- **Wednesday**: Mid-week check-in (demo progress)
- **Friday**: Week review + TestFlight build (if applicable)

### Testing Strategy
- **Unit Tests**: Write as you go (ViewModels, Services)
- **UI Tests**: Add for critical flows (onboarding, purchase)
- **Manual Testing**: Daily on device
- **Beta Testing**: Start Week 5 (20-50 testers)

---

## Risk Mitigation

### Technical Risks
| Risk | Mitigation |
|------|------------|
| SQLCipher integration issues | Start early (Week 1), have fallback (unencrypted for MVP) |
| StoreKit sandbox flakiness | Test with real devices, not simulators |
| Sync conflicts causing data loss | Extensive testing of SyncEngine, add logging |
| Supabase downtime | Offline-first architecture minimizes impact |

### Schedule Risks
| Risk | Mitigation |
|------|------------|
| Underestimated iOS complexity | Buffer time in Week 6 for overflow |
| Designer unavailable | Use placeholders, polish later |
| Apple App Store review delay | Submit 2 weeks before planned launch |

### Business Risks
| Risk | Mitigation |
|------|------------|
| Low free-to-paid conversion | A/B test paywall messaging, adjust free tier |
| Negative reviews on "too simple" | Market as "calm, focused" not "feature-rich" |
| Competition from Calm, Headspace | Differentiate on privacy, one-time purchase |

---

## Success Metrics (Post-Launch)

### Week 1 Post-Launch
- [ ] 100+ downloads
- [ ] <2% crash rate
- [ ] 4.0+ star rating

### Month 1 Post-Launch
- [ ] 1,000+ downloads
- [ ] 15%+ free-to-paid conversion
- [ ] 50%+ D7 retention

### Month 3 Post-Launch
- [ ] 5,000+ downloads
- [ ] $5,000+ revenue (167 premium purchases)
- [ ] Positive App Store reviews mentioning privacy

---

## Contact & Support

**Questions about this project?**
- Review documentation in `docs/` folder
- Check `IMPLEMENTATION_SUMMARY.md` for next steps
- Refer to `ios/README.md` for iOS-specific setup

**Technical decisions made:**
- All documented in PRD and this file
- Rationale provided for major choices

**Ready to start?**
1. Read `IMPLEMENTATION_SUMMARY.md`
2. Set up Supabase project (run `schema.sql`)
3. Begin iOS development (Week 1 tasks)

---

**Last Updated**: 2026-01-22
**Project Status**: Foundation Complete, Ready for Development
**Estimated Completion**: 8-10 weeks for MVP
