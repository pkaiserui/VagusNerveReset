// MoodRecord.swift
// Daily mood check-in model

import Foundation

// MARK: - Nervous System State

enum NervousSystemState: String, Codable, CaseIterable {
    case balanced = "balanced"
    case hyperarousal = "hyperarousal"
    case hypoarousal = "hypoarousal"
    case unknown = "unknown"

    var displayName: String {
        switch self {
        case .balanced: return "Balanced"
        case .hyperarousal: return "Hyperarousal (Activated)"
        case .hypoarousal: return "Hypoarousal (Shut Down)"
        case .unknown: return "Not Sure"
        }
    }

    var icon: String {
        switch self {
        case .balanced: return "figure.stand"
        case .hyperarousal: return "bolt.fill"
        case .hypoarousal: return "moon.fill"
        case .unknown: return "questionmark.circle"
        }
    }

    var description: String {
        switch self {
        case .balanced:
            return "Calm, present, and regulated"
        case .hyperarousal:
            return "Anxious, activated, fight-or-flight"
        case .hypoarousal:
            return "Shut down, numb, dissociated"
        case .unknown:
            return "Unsure of current state"
        }
    }
}

// MARK: - Emotions

enum Emotion: String, Codable, CaseIterable {
    case joy, anger, fear, sadness, disgust, surprise
    case contentment, frustration, anxiety, gratitude

    var displayName: String {
        rawValue.capitalized
    }

    var emoji: String {
        switch self {
        case .joy: return "😊"
        case .anger: return "😠"
        case .fear: return "😨"
        case .sadness: return "😢"
        case .disgust: return "🤢"
        case .surprise: return "😲"
        case .contentment: return "😌"
        case .frustration: return "😤"
        case .anxiety: return "😰"
        case .gratitude: return "🙏"
        }
    }
}

// MARK: - Body Tags

enum BodyTag: String, Codable, CaseIterable {
    case tension, fatigue, energy, pain, restlessness, calm
    case heaviness, lightness, warmth, coldness

    var displayName: String {
        rawValue.capitalized
    }
}

// MARK: - Mood Record Model

struct MoodRecord: Identifiable, Codable {
    let id: UUID
    let userId: String?  // nil if local-only
    var recordedAt: Date
    var createdAt: Date
    var updatedAt: Date

    // Mood data
    var moodScore: Int  // 1-10
    var emotions: [Emotion]
    var state: NervousSystemState?
    var bodyTags: [BodyTag]
    var notes: String?

    // Sync metadata
    var deviceId: String?
    var syncedAt: Date?

    init(
        id: UUID = UUID(),
        userId: String? = nil,
        recordedAt: Date = Date(),
        createdAt: Date = Date(),
        updatedAt: Date = Date(),
        moodScore: Int,
        emotions: [Emotion] = [],
        state: NervousSystemState? = nil,
        bodyTags: [BodyTag] = [],
        notes: String? = nil,
        deviceId: String? = nil,
        syncedAt: Date? = nil
    ) {
        self.id = id
        self.userId = userId
        self.recordedAt = recordedAt
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.moodScore = moodScore
        self.emotions = emotions
        self.state = state
        self.bodyTags = bodyTags
        self.notes = notes
        self.deviceId = deviceId
        self.syncedAt = syncedAt
    }

    // MARK: - Computed Properties

    var moodEmoji: String {
        switch moodScore {
        case 1...2: return "😢"
        case 3...4: return "😕"
        case 5...6: return "😐"
        case 7...8: return "🙂"
        case 9...10: return "😊"
        default: return "😐"
        }
    }

    var isSynced: Bool {
        syncedAt != nil && updatedAt <= (syncedAt ?? Date.distantPast)
    }

    // MARK: - Validation

    func isValid() -> Bool {
        return moodScore >= 1 && moodScore <= 10
    }

    // MARK: - Sample Data

    static var sample: MoodRecord {
        MoodRecord(
            moodScore: 7,
            emotions: [.joy, .gratitude],
            state: .balanced,
            bodyTags: [.calm, .energy],
            notes: "Had a good day with plenty of sunlight and exercise."
        )
    }

    static var sampleLow: MoodRecord {
        MoodRecord(
            moodScore: 3,
            emotions: [.sadness, .anxiety],
            state: .hypoarousal,
            bodyTags: [.fatigue, .heaviness],
            notes: "Felt very tired and unmotivated today."
        )
    }

    static var sampleHigh: MoodRecord {
        MoodRecord(
            moodScore: 9,
            emotions: [.joy, .contentment],
            state: .balanced,
            bodyTags: [.calm, .lightness],
            notes: "Great day! Morning walk and quality time with loved ones."
        )
    }
}

// MARK: - Mood Statistics

extension Array where Element == MoodRecord {
    /// Calculate average mood score
    func averageMoodScore() -> Double? {
        guard !isEmpty else { return nil }
        let sum = reduce(0) { $0 + $1.moodScore }
        return Double(sum) / Double(count)
    }

    /// Most common emotions
    func mostCommonEmotions(limit: Int = 5) -> [(Emotion, Int)] {
        var emotionCounts: [Emotion: Int] = [:]

        for record in self {
            for emotion in record.emotions {
                emotionCounts[emotion, default: 0] += 1
            }
        }

        return emotionCounts
            .sorted { $0.value > $1.value }
            .prefix(limit)
            .map { ($0.key, $0.value) }
    }

    /// Most common nervous system state
    func mostCommonState() -> NervousSystemState? {
        var stateCounts: [NervousSystemState: Int] = [:]

        for record in self {
            if let state = record.state {
                stateCounts[state, default: 0] += 1
            }
        }

        return stateCounts.max(by: { $0.value < $1.value })?.key
    }

    /// Filter records by date range
    func records(from startDate: Date, to endDate: Date) -> [MoodRecord] {
        filter { $0.recordedAt >= startDate && $0.recordedAt <= endDate }
    }

    /// Group records by date (for calendar/heatmap display)
    func groupedByDate() -> [Date: [MoodRecord]] {
        Dictionary(grouping: self) { record in
            Calendar.current.startOfDay(for: record.recordedAt)
        }
    }
}
