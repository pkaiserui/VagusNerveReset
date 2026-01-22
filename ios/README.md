# Vagus Nerve Reset - iOS App

SwiftUI-based iOS application for nervous system regulation practices.

## Requirements

- iOS 16.0+
- Xcode 15.0+
- Swift 5.9+

## Architecture

### MVVM Pattern
- **Models**: Data structures (Practice, MoodRecord, Glimmer, etc.)
- **Views**: SwiftUI views (screens, components)
- **ViewModels**: Business logic, state management (using Combine)
- **Services**: Data layer, network, storage

### Key Services

#### LocalStorageManager
- SQLCipher-encrypted local database
- Offline-first data storage
- Schema migrations

#### SyncEngine
- Automatic background sync with Supabase
- Conflict resolution (last-write-wins)
- Exponential backoff on failures

#### PurchaseManager
- StoreKit 2 integration
- Purchase flow + restoration
- Entitlement sync to Supabase

#### BiometricAuthManager
- Face ID / Touch ID app lock
- Secure enclave integration

## Directory Structure

```
VagusNerveReset/
├── App/
│   ├── VagusNerveResetApp.swift       # App entry point
│   └── AppDelegate.swift               # AppDelegate (if needed)
│
├── Models/
│   ├── Practice.swift                  # Practice definitions
│   ├── MoodRecord.swift                # Mood check-in model
│   ├── PracticeSession.swift          # Completed practice session
│   ├── Glimmer.swift                   # Glimmer model
│   ├── ActionItem.swift                # Task/action item model
│   ├── WorryRecord.swift               # Worry log model
│   ├── User.swift                      # User profile model
│   └── Entitlement.swift               # Premium entitlement model
│
├── Views/
│   ├── Components/
│   │   ├── Buttons/
│   │   │   ├── PrimaryButton.swift
│   │   │   ├── SecondaryButton.swift
│   │   │   └── IconButton.swift
│   │   ├── Cards/
│   │   │   ├── CardView.swift
│   │   │   ├── PracticeCard.swift
│   │   │   └── GlimmerCard.swift
│   │   ├── Forms/
│   │   │   ├── StyledTextField.swift
│   │   │   ├── StyledTextEditor.swift
│   │   │   ├── StyledSlider.swift
│   │   │   └── ChipSelector.swift
│   │   └── Charts/
│   │       ├── MoodLineChart.swift
│   │       └── HeatmapCalendar.swift
│   │
│   └── Screens/
│       ├── Onboarding/
│       │   ├── WelcomeView.swift
│       │   ├── PrivacyExplainerView.swift
│       │   └── DailyPreferencesView.swift
│       ├── Home/
│       │   └── HomeView.swift
│       ├── Practices/
│       │   ├── PracticesListView.swift
│       │   ├── MoodRecordView.swift
│       │   ├── ContainmentExerciseView.swift
│       │   ├── BodyExerciseView.swift
│       │   ├── WorryRecordView.swift
│       │   └── PracticeTimerView.swift
│       ├── Glimmers/
│       │   └── GlimmersView.swift
│       ├── Insights/
│       │   └── InsightsView.swift
│       ├── Settings/
│       │   ├── SettingsView.swift
│       │   └── AccountManagementView.swift
│       └── Account/
│           ├── SignInView.swift
│           └── MigrationWizardView.swift
│
├── ViewModels/
│   ├── HomeViewModel.swift
│   ├── MoodRecordViewModel.swift
│   ├── PracticesViewModel.swift
│   ├── GlimmersViewModel.swift
│   ├── InsightsViewModel.swift
│   ├── SettingsViewModel.swift
│   └── AuthViewModel.swift
│
├── Services/
│   ├── LocalStorageManager.swift       # SQLite + encryption
│   ├── SyncEngine.swift                # Supabase sync
│   ├── PurchaseManager.swift           # StoreKit 2
│   ├── BiometricAuthManager.swift      # Face ID / Touch ID
│   ├── NotificationManager.swift       # Local notifications
│   ├── SupabaseClient.swift            # Supabase API client
│   └── AnalyticsManager.swift          # Optional: Analytics
│
├── Utilities/
│   ├── AppColors.swift                 # Color palette
│   ├── AppFonts.swift                  # Typography
│   ├── Spacing.swift                   # Spacing constants
│   ├── Extensions/
│   │   ├── View+Extensions.swift
│   │   ├── Date+Extensions.swift
│   │   └── String+Extensions.swift
│   └── Helpers/
│       ├── DeviceFingerprint.swift     # Device ID hashing
│       └── KeychainManager.swift       # Keychain access
│
└── Resources/
    ├── Assets.xcassets                 # Images, colors
    ├── Audio/                          # Practice audio files
    └── Info.plist
```

## Setup Instructions

### 1. Clone and Open Project
```bash
cd ios
open VagusNerveReset.xcodeproj
```

### 2. Install Dependencies

#### Swift Package Manager (recommended)
Add the following packages in Xcode:
- **Supabase Swift**: `https://github.com/supabase-community/supabase-swift`
- **SQLCipher**: Use CocoaPods or manual integration

#### CocoaPods (for SQLCipher)
```bash
cd ios
pod install
open VagusNerveReset.xcworkspace
```

`Podfile`:
```ruby
platform :ios, '16.0'
use_frameworks!

target 'VagusNerveReset' do
  pod 'SQLCipher', '~> 4.5'
end
```

### 3. Configure Supabase
Create `Config.swift`:
```swift
enum Config {
    static let supabaseURL = "https://your-project-ref.supabase.co"
    static let supabaseAnonKey = "your-anon-key-here"
}
```

### 4. Configure StoreKit
1. Add your in-app purchase product ID in App Store Connect
2. Create `Products.storekit` file in Xcode for local testing
3. Add product ID: `com.vagusnervereset.premium.lifetime`

### 5. Configure Capabilities
In Xcode, enable:
- **App Groups**: `group.com.vagusnervereset` (for shared data)
- **Keychain Sharing**: For secure storage
- **Background Modes**: Background fetch, remote notifications (for sync)
- **Push Notifications**: For reminders
- **Sign in with Apple**: For Apple authentication

---

## Key Implementation Details

### Offline-First Architecture

The app works fully offline by default. Local SQLite is the source of truth.

**Data Flow**:
1. User creates/updates data → Write to local SQLite immediately
2. If signed in + online → SyncEngine uploads to Supabase
3. On app launch (if signed in) → SyncEngine downloads remote changes

**Conflict Resolution**:
- Last-write-wins based on `updated_at` timestamp
- Device ID hash prevents duplicate migrations

### Encryption

**Local Data**:
- SQLite encrypted with SQLCipher
- Encryption key stored in Keychain (backed by Secure Enclave)

**Sensitive Fields (in Supabase)**:
- Notes, free-text fields encrypted client-side before upload
- Use CryptoKit to generate user-specific encryption key
- Key derived from user password (never stored on server)

### Premium Entitlement Flow

**Purchase (Local-Only)**:
1. User purchases → StoreKit transaction completes
2. Store entitlement flag in Keychain
3. Unlock features locally
4. Prompt: "Sign in to unlock on all devices"

**Purchase (Signed In)**:
1. User purchases → StoreKit transaction completes
2. Call Supabase Edge Function with receipt
3. Edge Function verifies → writes to `entitlements` table
4. App queries Supabase → unlocks features

**Restore Purchase**:
1. User taps "Restore Purchase"
2. StoreKit returns transactions
3. If signed in: Call Edge Function to sync entitlement
4. If local-only: Store entitlement in Keychain

### Sync Engine Details

**Sync Triggers**:
- App launch (foreground)
- After local write (debounced, 5-second delay)
- Background fetch (every 15 minutes if enabled)

**Sync Process**:
```
1. Fetch remote changes since last_sync_at
2. For each remote record:
   - If local record missing → Insert
   - If local record older (updated_at < remote) → Update local
   - If local record newer → Skip (local wins)
3. Upload local records created/updated since last_sync_at
4. Update last_sync_at timestamp
```

**Conflict Example**:
- Local mood record updated at 10:00 AM
- Remote mood record updated at 10:05 AM
- Remote wins (newer timestamp)

---

## Testing

### Unit Tests
```bash
# Run tests in Xcode
Cmd + U

# Or via command line
xcodebuild test -scheme VagusNerveReset -destination 'platform=iOS Simulator,name=iPhone 15'
```

Test coverage:
- LocalStorageManager (CRUD operations)
- SyncEngine (conflict resolution)
- PurchaseManager (mock StoreKit transactions)
- ViewModels (state management)

### UI Tests
- Onboarding flow
- Practice completion
- Premium purchase flow
- Sign-in and migration

### TestFlight Beta
1. Archive app in Xcode
2. Upload to App Store Connect
3. Create beta test group
4. Distribute to testers

---

## Build & Release

### Development Build
```bash
xcodebuild -scheme VagusNerveReset -configuration Debug -destination 'platform=iOS Simulator,name=iPhone 15' build
```

### Production Build
1. Increment build number
2. Archive in Xcode (Product → Archive)
3. Validate archive
4. Distribute to App Store

### Environment Configs
Use Xcode build configurations:
- **Debug**: Sandbox StoreKit, Supabase dev project
- **Release**: Production StoreKit, Supabase prod project

`Config.swift`:
```swift
enum Config {
    #if DEBUG
    static let supabaseURL = "https://dev-project.supabase.co"
    static let storeKitEnvironment = "sandbox"
    #else
    static let supabaseURL = "https://prod-project.supabase.co"
    static let storeKitEnvironment = "production"
    #endif
}
```

---

## Troubleshooting

### SQLCipher Issues
- Ensure SQLCipher pod is installed correctly
- Check encryption key is stored/retrieved from Keychain

### StoreKit Sandbox Issues
- Use sandbox Apple ID (not production Apple ID)
- Clear purchase history: Settings → App Store → Sandbox Account → Clear Purchase History

### Supabase Connection Issues
- Check network connectivity
- Verify `supabaseURL` and `supabaseAnonKey` are correct
- Check Supabase project is running (not paused)

### Sync Conflicts
- Check `updated_at` timestamps in local vs. remote records
- View logs: Print statements in SyncEngine
- Use Supabase dashboard to inspect remote data

---

## Performance Optimization

### Lazy Loading
- Load practice history on-demand (paginate)
- Limit insights queries to last 90 days

### Caching
- Cache Supabase auth session (avoid repeated network calls)
- Cache premium entitlement status (check once per session)

### Background Sync
- Use WorkManager (or similar) for background sync
- Limit sync frequency to avoid battery drain

---

## Accessibility

- All interactive elements have accessibility labels
- VoiceOver support for all screens
- Dynamic Type support (text scales with system settings)
- Color contrast meets WCAG AA standards
- Haptic feedback for important actions

---

## Privacy & Security

### Data Collection
- Minimal PII (email if signed in, practice timestamps)
- No third-party analytics by default
- User can opt-in to anonymized analytics

### Data Deletion
- User can delete account from Settings
- Deletes all Supabase data (cascading delete)
- Local data remains until app uninstalled

### App Transport Security
- All network requests over HTTPS
- Certificate pinning for Supabase (optional, advanced)

---

## Future Enhancements

1. **Apple Watch App**: Quick access to breathing exercises, mood logging
2. **Widgets**: Today's progress, glimmer of the day
3. **Siri Shortcuts**: "Log my mood", "Start breathing exercise"
4. **HealthKit Integration**: Export practice data to Health app
5. **iCloud Backup**: Optional iCloud backup (alternative to Supabase sync)

---

## Support

For questions or issues:
- GitHub Issues: https://github.com/yourusername/vagus-nerve-reset/issues
- Email: support@vagusnervereset.com

---

**Last Updated**: 2026-01-22
**Version**: 1.0.0 (MVP)
