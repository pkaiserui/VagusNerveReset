# Vagus Nerve Reset - Wellness App

A calm, modern iOS and web application helping users complete nervous system regulation practices through The Vagus Nerve Reset program.

**Privacy-first • Offline-capable • One-time purchase • No subscriptions**

---

## 🎯 Project Overview

This repository contains complete product specifications, backend architecture, and iOS app foundation for building a comprehensive wellness application.

### Core Features

- **Daily Mood Tracking**: Record mood, emotions, and nervous system state
- **10 Evidence-Based Practices**: Containment exercises, body exercises, regulating resources
- **Glimmers Collection**: Track moments of safety, joy, and connection
- **Insights & Analytics**: Visualize trends and correlations in your data
- **Privacy-Focused**: Works fully offline, optional cloud sync
- **Ethical Monetization**: One-time lifetime purchase, no subscriptions

### User Modes

1. **Local-Only Mode** (default): No sign-in required, data stays on device
2. **Synced Mode** (optional): Cloud backup and multi-device sync via Supabase

---

## 📊 Project Status

### ✅ Complete
- ✓ **Product Requirements Document** (13,000+ words)
- ✓ **Screen Map & User Flows** (20+ screens with detailed wireframes)
- ✓ **Component Inventory** (Complete design system)
- ✓ **Supabase Backend** (Database schema, RLS policies, Edge Functions)
- ✓ **iOS Foundation** (App structure, core models, design system)

### 🚧 In Progress
- iOS UI implementation (components, screens, ViewModels)
- iOS services (LocalStorageManager, SyncEngine, PurchaseManager)

### 📋 Planned
- Web app (Next.js + React)
- App Store submission
- Beta testing

**Estimated Timeline**: 8-10 weeks for MVP (iOS + Web)

---

## 📁 Repository Structure

```
├── docs/                           # Complete product documentation
│   ├── PRD.md                      # Product Requirements Document
│   ├── SCREEN_MAP.md               # Screen wireframes & user flows
│   └── COMPONENT_INVENTORY.md     # Design system & components
│
├── supabase/                       # Backend (PostgreSQL + Edge Functions)
│   ├── schema.sql                  # Database schema with RLS
│   └── functions/                  # Edge Functions (purchase verification)
│
├── ios/                            # iOS app (SwiftUI)
│   └── VagusNerveReset/
│       ├── App/                    # App entry point
│       ├── Models/                 # Data models
│       ├── Views/                  # SwiftUI views
│       ├── ViewModels/             # Business logic
│       ├── Services/               # Data layer, sync, purchases
│       └── Utilities/              # Colors, fonts, helpers
│
├── web/                            # Web app (Next.js) [TODO]
│
├── IMPLEMENTATION_SUMMARY.md       # Development guide & next steps
└── PROJECT_STRUCTURE.md            # Complete file structure
```

---

## 🚀 Quick Start

### For Product Managers / Designers

1. **Read the PRD**: [`docs/PRD.md`](docs/PRD.md)
   - Product vision, user personas, all features
   - Monetization strategy, privacy requirements

2. **Review Screen Map**: [`docs/SCREEN_MAP.md`](docs/SCREEN_MAP.md)
   - Wireframes for every screen
   - User flow diagrams

3. **Explore Design System**: [`docs/COMPONENT_INVENTORY.md`](docs/COMPONENT_INVENTORY.md)
   - Color palette, typography, spacing
   - All UI components with code examples

### For Developers

1. **Read Implementation Summary**: [`IMPLEMENTATION_SUMMARY.md`](IMPLEMENTATION_SUMMARY.md)
   - Week-by-week development plan
   - Technical milestones
   - Risk mitigation

2. **Review Project Structure**: [`PROJECT_STRUCTURE.md`](PROJECT_STRUCTURE.md)
   - Complete directory tree
   - File status (complete vs. TODO)
   - Dependencies & prerequisites

3. **Set Up Backend**: [`supabase/README.md`](supabase/functions/README.md)
   - Create Supabase project
   - Run `schema.sql` to create tables
   - Deploy Edge Functions

4. **Start iOS Development**: [`ios/README.md`](ios/README.md)
   - Xcode setup
   - Install dependencies (SQLCipher, Supabase Swift)
   - Begin implementing core services

### For Stakeholders

**What's Been Built**:
- Complete product specification (PRD)
- Full backend architecture (Supabase)
- iOS app foundation (models, design system)
- All documentation for developers

**What's Next**:
- 6 weeks: iOS app development (UI, services, testing)
- 5 weeks: Web app development (can be parallel)
- 2 weeks: Beta testing and App Store submission

**Budget Estimate**:
- iOS Developer: 6-7 weeks
- Web Developer: 4-5 weeks
- Designer (part-time): 2-3 weeks
- QA Engineer (part-time): 1-2 weeks

---

## 🏗️ Architecture

### Offline-First Design

```
Local SQLite (encrypted) → Source of Truth
                ↓
          SyncEngine (optional)
                ↓
          Supabase Cloud (backup)
```

- App works fully offline by default
- Cloud sync is optional (requires sign-in)
- Conflict resolution: Last-write-wins (timestamp-based)

### Tech Stack

**iOS**:
- SwiftUI (iOS 16+)
- SQLCipher (encrypted local storage)
- Supabase Swift (cloud sync)
- StoreKit 2 (in-app purchases)
- Swift Charts (data visualization)

**Web**:
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS + Radix UI
- Supabase (auth, database)
- Stripe (payments)
- Recharts (data visualization)

**Backend**:
- Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- Row-Level Security (RLS) for data isolation
- Deno Edge Functions for purchase verification

---

## 🎨 Design Principles

1. **Calm by Default**: No red badges, no urgency, no FOMO
2. **Privacy-Respecting**: No sign-in required, data stays local
3. **Accessible**: WCAG AA compliance, VoiceOver support
4. **Fast**: <2s load time, 60fps animations
5. **Transparent**: Clear about data collection and usage

### Color Palette

- **Primary**: Soft Teal (#4A90A4) - calming, trustworthy
- **Secondary**: Warm Peach (#F4A261) - gentle energy
- **Accent**: Gold (#D4AF37) - premium features
- **Background**: Off-white (#F9F9F9) - easy on eyes

---

## 💰 Monetization

### Free Tier
- Daily Mood Record
- Basic containment exercise (container visualization)
- Basic body exercise (bee breathing)
- 1 glimmer
- 7-day practice history

### Premium (One-Time Purchase: $29.99)
- All containment exercises (box breathing, body scan, etc.)
- All body exercises (arm swings, butterfly hug, etc.)
- Unlimited glimmers
- Worry Record (unlimited)
- Basic Needs Journal
- Full insights & correlations
- Unlimited history
- Data export (PDF/CSV)
- All future updates

**No subscriptions. Pay once, own forever.**

---

## 🔒 Privacy & Security

### Data Handling

**Local Storage (iOS)**:
- SQLCipher encryption (AES-256)
- Encryption key stored in Keychain (Secure Enclave)
- Face ID/Touch ID app lock (optional)

**Cloud Storage (Supabase)**:
- Row-Level Security (RLS) - users can only access own data
- Client-side encryption for sensitive fields
- Optional: User can export or delete all data

### Compliance

- GDPR-compliant (export, deletion)
- CCPA-compliant
- No selling of data (stated in Privacy Policy)
- Clear disclaimers: "This is self-help, not medical care"

---

## 📖 Documentation

### For Product Team
- [`docs/PRD.md`](docs/PRD.md) - Product Requirements Document
- [`docs/SCREEN_MAP.md`](docs/SCREEN_MAP.md) - Screen wireframes & user flows
- [`docs/COMPONENT_INVENTORY.md`](docs/COMPONENT_INVENTORY.md) - Design system

### For Developers
- [`IMPLEMENTATION_SUMMARY.md`](IMPLEMENTATION_SUMMARY.md) - Development guide
- [`PROJECT_STRUCTURE.md`](PROJECT_STRUCTURE.md) - File structure & status
- [`ios/README.md`](ios/README.md) - iOS setup guide
- [`supabase/functions/README.md`](supabase/functions/README.md) - Backend guide

---

## 🧪 Testing Strategy

### Unit Tests
- Services (LocalStorageManager, SyncEngine, PurchaseManager)
- ViewModels (state management, business logic)

### UI Tests
- Onboarding flow
- Mood record flow
- Premium purchase flow
- Sign-in and data migration

### Beta Testing (TestFlight)
- Target: 50-100 beta testers
- Duration: 2 weeks before public launch
- Focus: Data sync reliability, purchase flow, user feedback

---

## 📅 Development Timeline

### iOS Development (6-7 weeks)

**Week 1-2**: Core Infrastructure
- Complete all models
- LocalStorageManager (SQLCipher)
- SupabaseClient wrapper
- SyncEngine foundations

**Week 3**: Authentication & Premium
- AuthViewModel (sign-in, sign-up, migration)
- PurchaseManager (StoreKit 2)
- NotificationManager

**Week 4-5**: UI Implementation
- All components (buttons, cards, forms, charts)
- Onboarding screens
- Main screens (Home, Practices, Glimmers, Insights, Settings)
- Practice detail screens

**Week 6-7**: Testing & Polish
- Unit tests
- UI tests
- Beta testing on TestFlight
- Bug fixes and polish

### Web Development (4-5 weeks, can be parallel)

**Week 1**: Setup & Auth
- Next.js project
- Supabase client
- Auth pages

**Week 2-3**: Core Features
- Dashboard
- Practice pages
- Mood logging
- Glimmers

**Week 4**: Premium & Insights
- Stripe Checkout
- Insights/charts
- Settings & export

**Week 5**: Testing & Deploy
- E2E tests
- Responsive design
- Vercel deployment

---

## 🚢 Deployment

### Supabase (Backend)

1. Create production Supabase project
2. Run `schema.sql` to create database
3. Deploy Edge Functions: `supabase functions deploy`
4. Set environment secrets:
   - `APPLE_SHARED_SECRET`
   - `STRIPE_SECRET_KEY`

### iOS (App Store)

1. Create App Store Connect app
2. Set up in-app purchase product ID
3. Prepare App Store listing (screenshots, description)
4. Submit for review
5. Launch 🎉

### Web (Vercel)

1. Deploy to Vercel: `vercel deploy`
2. Configure custom domain
3. Set environment variables
4. Enable Vercel Analytics

---

## 📊 Success Metrics

### Technical
- <2% crash rate
- <2s app launch time
- 99.9% data sync success rate

### Product
- 4.5+ star App Store rating
- 20%+ free-to-paid conversion
- 50%+ D7 retention

### Business
- 5,000+ downloads in Month 1
- $5,000+ revenue in Month 1
- Positive reviews mentioning privacy and calm UX

---

## 🤝 Contributing

This is a commercial project, but contributions are welcome:

1. Review open issues
2. Follow Swift and TypeScript style guides
3. Write tests for new features
4. Submit pull request with clear description

---

## 📄 License

**Proprietary** - All rights reserved.

Code and documentation in this repository are confidential and proprietary. Not licensed for public use or distribution.

---

## 🙏 Acknowledgments

Built with:
- [Supabase](https://supabase.com/) - Backend infrastructure
- [SwiftUI](https://developer.apple.com/xcode/swiftui/) - iOS UI framework
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Stripe](https://stripe.com/) - Payment processing

Inspired by:
- The Vagus Nerve Reset program
- Calm, Headspace (mindfulness apps)
- Things 3 (design simplicity)
- Streaks (habit tracking)

---

## 📞 Contact

**Project Lead**: [Your Name]
**Email**: [your.email@example.com]
**Repository**: https://github.com/yourusername/vagus-nerve-reset

---

## 🗺️ Roadmap

### Phase 1: MVP (Current)
- iOS app with offline-first architecture
- Web app with basic features
- One-time premium purchase

### Phase 2: Enhancements (3-6 months post-launch)
- Apple Watch app
- Widgets (Today's progress, Glimmer of the day)
- Siri Shortcuts
- Community glimmers (opt-in sharing)

### Phase 3: Advanced Features (6-12 months)
- Android app
- Therapist portal (for users to grant read access)
- Apple Health integration
- Multi-language support

---

**Last Updated**: 2026-01-22
**Status**: Foundation Complete, Ready for Development
**Version**: 1.0.0 (MVP in progress)
