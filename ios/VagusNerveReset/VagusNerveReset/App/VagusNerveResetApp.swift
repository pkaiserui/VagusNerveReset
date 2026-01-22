// VagusNerveResetApp.swift
// App entry point

import SwiftUI

@main
struct VagusNerveResetApp: App {
    // MARK: - State Objects

    @StateObject private var localStorageManager = LocalStorageManager.shared
    @StateObject private var syncEngine = SyncEngine.shared
    @StateObject private var purchaseManager = PurchaseManager.shared
    @StateObject private var authViewModel = AuthViewModel.shared
    @StateObject private var notificationManager = NotificationManager.shared

    // MARK: - Scene Phase

    @Environment(\.scenePhase) private var scenePhase

    // MARK: - App State

    @AppStorage("hasCompletedOnboarding") private var hasCompletedOnboarding = false
    @AppStorage("isBiometricLockEnabled") private var isBiometricLockEnabled = false

    @State private var isAppLocked = false
    @State private var showingBiometricPrompt = false

    init() {
        // Initialize local storage on app launch
        LocalStorageManager.shared.initialize()

        // Configure appearance
        configureAppearance()
    }

    var body: some Scene {
        WindowGroup {
            ZStack {
                // Main content
                if hasCompletedOnboarding {
                    if isAppLocked {
                        BiometricLockView(isUnlocked: $isAppLocked)
                    } else {
                        MainTabView()
                            .environmentObject(localStorageManager)
                            .environmentObject(syncEngine)
                            .environmentObject(purchaseManager)
                            .environmentObject(authViewModel)
                            .environmentObject(notificationManager)
                    }
                } else {
                    OnboardingFlowView(hasCompletedOnboarding: $hasCompletedOnboarding)
                        .environmentObject(notificationManager)
                }
            }
            .onChange(of: scenePhase) { _, newPhase in
                handleScenePhaseChange(newPhase)
            }
            .onAppear {
                handleAppLaunch()
            }
        }
    }

    // MARK: - Scene Phase Handling

    private func handleScenePhaseChange(_ newPhase: ScenePhase) {
        switch newPhase {
        case .active:
            // App became active
            if isBiometricLockEnabled && !isAppLocked {
                // Lock app if returning from background
                isAppLocked = true
            }

            // Trigger sync if signed in
            if authViewModel.isSignedIn {
                Task {
                    await syncEngine.syncAllData()
                }
            }

        case .inactive:
            // App became inactive (e.g., control center opened)
            break

        case .background:
            // App entered background
            // Save any pending data
            localStorageManager.saveContext()

        @unknown default:
            break
        }
    }

    // MARK: - App Launch

    private func handleAppLaunch() {
        // Check if biometric lock should be shown
        if isBiometricLockEnabled {
            isAppLocked = true
        }

        // Initialize purchase manager (starts observing transactions)
        purchaseManager.startObserving()

        // Load user's entitlement status
        Task {
            await purchaseManager.loadEntitlementStatus()
        }

        // If signed in, trigger initial sync
        if authViewModel.isSignedIn {
            Task {
                await syncEngine.syncAllData()
            }
        }
    }

    // MARK: - Appearance Configuration

    private func configureAppearance() {
        // Customize navigation bar appearance
        let appearance = UINavigationBarAppearance()
        appearance.configureWithOpaqueBackground()
        appearance.backgroundColor = UIColor(AppColors.background)
        appearance.titleTextAttributes = [
            .foregroundColor: UIColor(AppColors.textPrimary),
            .font: UIFont.systemFont(ofSize: 17, weight: .semibold)
        ]
        appearance.largeTitleTextAttributes = [
            .foregroundColor: UIColor(AppColors.textPrimary),
            .font: UIFont.systemFont(ofSize: 34, weight: .bold)
        ]

        UINavigationBar.appearance().standardAppearance = appearance
        UINavigationBar.appearance().scrollEdgeAppearance = appearance

        // Customize tab bar appearance
        let tabBarAppearance = UITabBarAppearance()
        tabBarAppearance.configureWithOpaqueBackground()
        tabBarAppearance.backgroundColor = UIColor(AppColors.surface)

        UITabBar.appearance().standardAppearance = tabBarAppearance
        UITabBar.appearance().scrollEdgeAppearance = tabBarAppearance
    }
}

// MARK: - Biometric Lock View

struct BiometricLockView: View {
    @Binding var isUnlocked: Bool
    @StateObject private var biometricManager = BiometricAuthManager.shared

    var body: some View {
        ZStack {
            AppColors.background
                .ignoresSafeArea()

            VStack(spacing: 32) {
                Image(systemName: "lock.shield.fill")
                    .font(.system(size: 64))
                    .foregroundColor(AppColors.primary)

                Text("Vagus Nerve Reset")
                    .font(.largeTitle.bold())
                    .foregroundColor(AppColors.textPrimary)

                Text("Unlock to continue")
                    .font(.body)
                    .foregroundColor(AppColors.textSecondary)

                PrimaryButton(title: "Unlock") {
                    authenticateWithBiometrics()
                }
                .padding(.horizontal, 48)
            }
        }
        .onAppear {
            // Automatically prompt for biometric auth
            authenticateWithBiometrics()
        }
    }

    private func authenticateWithBiometrics() {
        Task {
            let success = await biometricManager.authenticate(reason: "Unlock Vagus Nerve Reset")
            if success {
                withAnimation {
                    isUnlocked = false
                }
            }
        }
    }
}

// MARK: - Main Tab View

struct MainTabView: View {
    @State private var selectedTab: Tab = .home

    enum Tab {
        case home, practices, glimmers, insights, settings
    }

    var body: some View {
        TabView(selection: $selectedTab) {
            HomeView()
                .tabItem {
                    Label("Today", systemImage: "house.fill")
                }
                .tag(Tab.home)

            PracticesListView()
                .tabItem {
                    Label("Practices", systemImage: "list.bullet")
                }
                .tag(Tab.practices)

            GlimmersView()
                .tabItem {
                    Label("Glimmers", systemImage: "sparkles")
                }
                .tag(Tab.glimmers)

            InsightsView()
                .tabItem {
                    Label("Insights", systemImage: "chart.line.uptrend.xyaxis")
                }
                .tag(Tab.insights)

            SettingsView()
                .tabItem {
                    Label("Settings", systemImage: "gearshape.fill")
                }
                .tag(Tab.settings)
        }
        .accentColor(AppColors.primary)
    }
}

// MARK: - Preview

#Preview("Main App") {
    MainTabView()
        .environmentObject(LocalStorageManager.shared)
        .environmentObject(SyncEngine.shared)
        .environmentObject(PurchaseManager.shared)
        .environmentObject(AuthViewModel.shared)
        .environmentObject(NotificationManager.shared)
}

#Preview("Biometric Lock") {
    BiometricLockView(isUnlocked: .constant(true))
}
