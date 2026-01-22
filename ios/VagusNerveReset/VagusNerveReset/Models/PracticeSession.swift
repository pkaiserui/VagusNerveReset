// PracticeSession.swift
// Completed practice session model

import Foundation

struct PracticeSession: Identifiable, Codable {
    let id: UUID
    let userId: String?  // nil if local-only
    var startedAt: Date
    var completedAt: Date?
    var createdAt: Date
    var updatedAt: Date

    // Practice details
    var practiceType: PracticeType
    var variant: String  // e.g., "bee_breathing", "box_breathing"
    var durationSeconds: Int?  // Actual duration (may differ from planned)

    // State tracking
    var stateBefore: NervousSystemState?
    var stateAfter: NervousSystemState?

    // Additional data
    var notes: String?
    var metadata: [String: String]?  // Flexible field for practice-specific data

    // Completion
    var completed: Bool
    var helpfulnessRating: Int?  // 1-5 stars

    // Sync metadata
    var deviceId: String?
    var syncedAt: Date?

    init(
        id: UUID = UUID(),
        userId: String? = nil,
        startedAt: Date = Date(),
        completedAt: Date? = nil,
        createdAt: Date = Date(),
        updatedAt: Date = Date(),
        practiceType: PracticeType,
        variant: String,
        durationSeconds: Int? = nil,
        stateBefore: NervousSystemState? = nil,
        stateAfter: NervousSystemState? = nil,
        notes: String? = nil,
        metadata: [String: String]? = nil,
        completed: Bool = false,
        helpfulnessRating: Int? = nil,
        deviceId: String? = nil,
        syncedAt: Date? = nil
    ) {
        self.id = id
        self.userId = userId
        self.startedAt = startedAt
        self.completedAt = completedAt
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.practiceType = practiceType
        self.variant = variant
        self.durationSeconds = durationSeconds
        self.stateBefore = stateBefore
        self.stateAfter = stateAfter
        self.notes = notes
        self.metadata = metadata
        self.completed = completed
        self.helpfulnessRating = helpfulnessRating
        self.deviceId = deviceId
        self.syncedAt = syncedAt
    }

    // MARK: - Computed Properties

    var durationFormatted: String {
        guard let duration = durationSeconds else { return "N/A" }
        let minutes = duration / 60
        let seconds = duration % 60
        return "\(minutes):\(String(format: "%02d", seconds))"
    }

    var isSynced: Bool {
        syncedAt != nil && updatedAt <= (syncedAt ?? Date.distantPast)
    }

    var practice: Practice? {
        Practice.allPractices.first {
            $0.type == practiceType && $0.variant == variant
        }
    }

    // MARK: - State Change

    var hadPositiveStateChange: Bool? {
        guard let before = stateBefore, let after = stateAfter else { return nil }

        // Define state hierarchy: balanced > hypoarousal > hyperarousal
        let stateRank: [NervousSystemState: Int] = [
            .balanced: 3,
            .hypoarousal: 2,
            .hyperarousal: 1,
            .unknown: 0
        ]

        let beforeRank = stateRank[before] ?? 0
        let afterRank = stateRank[after] ?? 0

        return afterRank > beforeRank
    }

    // MARK: - Sample Data

    static var sample: PracticeSession {
        PracticeSession(
            practiceType: .containment,
            variant: "container_visualization",
            durationSeconds: 300,
            stateBefore: .hyperarousal,
            stateAfter: .balanced,
            completed: true,
            helpfulnessRating: 5
        )
    }
}

// MARK: - Practice Session Statistics

extension Array where Element == PracticeSession {
    /// Total practice time in seconds
    func totalDuration() -> Int {
        compactMap { $0.durationSeconds }.reduce(0, +)
    }

    /// Total practice time formatted
    func totalDurationFormatted() -> String {
        let total = totalDuration()
        let hours = total / 3600
        let minutes = (total % 3600) / 60

        if hours > 0 {
            return "\(hours)h \(minutes)m"
        } else {
            return "\(minutes)m"
        }
    }

    /// Count completed sessions
    func completedCount() -> Int {
        filter { $0.completed }.count
    }

    /// Average helpfulness rating
    func averageHelpfulness() -> Double? {
        let ratings = compactMap { $0.helpfulnessRating }
        guard !ratings.isEmpty else { return nil }
        return Double(ratings.reduce(0, +)) / Double(ratings.count)
    }

    /// Sessions by practice type
    func sessions(ofType type: PracticeType) -> [PracticeSession] {
        filter { $0.practiceType == type }
    }

    /// Sessions in date range
    func sessions(from startDate: Date, to endDate: Date) -> [PracticeSession] {
        filter { $0.startedAt >= startDate && $0.startedAt <= endDate }
    }

    /// Sessions grouped by date
    func groupedByDate() -> [Date: [PracticeSession]] {
        Dictionary(grouping: self) { session in
            Calendar.current.startOfDay(for: session.startedAt)
        }
    }

    /// Most practiced variants
    func mostPracticedVariants(limit: Int = 5) -> [(String, Int)] {
        var variantCounts: [String: Int] = [:]

        for session in self where session.completed {
            variantCounts[session.variant, default: 0] += 1
        }

        return variantCounts
            .sorted { $0.value > $1.value }
            .prefix(limit)
            .map { ($0.key, $0.value) }
    }
}
