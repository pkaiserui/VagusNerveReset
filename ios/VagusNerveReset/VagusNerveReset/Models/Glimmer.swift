// Glimmer.swift
// Glimmer (moments of safety, joy, connection) model

import Foundation

struct Glimmer: Identifiable, Codable {
    let id: UUID
    let userId: String?  // nil if local-only
    var createdAt: Date
    var updatedAt: Date

    // Glimmer content
    var text: String
    var emoji: String?
    var tags: [String]

    // Organization
    var isPinned: Bool
    var position: Int?  // For manual ordering

    // Metadata
    var metadata: [String: String]?

    // Sync
    var deviceId: String?
    var syncedAt: Date?

    init(
        id: UUID = UUID(),
        userId: String? = nil,
        createdAt: Date = Date(),
        updatedAt: Date = Date(),
        text: String,
        emoji: String? = nil,
        tags: [String] = [],
        isPinned: Bool = false,
        position: Int? = nil,
        metadata: [String: String]? = nil,
        deviceId: String? = nil,
        syncedAt: Date? = nil
    ) {
        self.id = id
        self.userId = userId
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.text = text
        self.emoji = emoji
        self.tags = tags
        self.isPinned = isPinned
        self.position = position
        self.metadata = metadata
        self.deviceId = deviceId
        self.syncedAt = syncedAt
    }

    // MARK: - Computed Properties

    var displayText: String {
        if let emoji = emoji {
            return "\(emoji) \(text)"
        }
        return text
    }

    var isSynced: Bool {
        syncedAt != nil && updatedAt <= (syncedAt ?? Date.distantPast)
    }

    // MARK: - Sample Data

    static var samples: [Glimmer] {
        [
            Glimmer(text: "Morning coffee aroma", emoji: "☕️", isPinned: true, position: 1),
            Glimmer(text: "Dog wagging tail", emoji: "🐕", isPinned: true, position: 2),
            Glimmer(text: "Sunset colors", emoji: "🌅", isPinned: false),
            Glimmer(text: "Soft blanket", emoji: "🛋️", isPinned: false),
            Glimmer(text: "Friend's laughter", emoji: "😄", isPinned: false),
            Glimmer(text: "Fresh air after rain", emoji: "🌧️", isPinned: false),
            Glimmer(text: "First bite of favorite food", emoji: "🍕", isPinned: false),
            Glimmer(text: "Child's smile", emoji: "👶", isPinned: false),
        ]
    }

    static var sample: Glimmer {
        Glimmer(text: "Morning coffee aroma", emoji: "☕️", isPinned: true)
    }
}

// MARK: - Glimmer Collection Extensions

extension Array where Element == Glimmer {
    /// Get pinned glimmers, sorted by position
    func pinnedGlimmers() -> [Glimmer] {
        filter { $0.isPinned }
            .sorted { ($0.position ?? Int.max) < ($1.position ?? Int.max) }
    }

    /// Get unpinned glimmers
    func unpinnedGlimmers() -> [Glimmer] {
        filter { !$0.isPinned }
            .sorted { $0.createdAt > $1.createdAt }
    }

    /// Get a random glimmer (for "glimmer of the day")
    func randomGlimmer() -> Glimmer? {
        randomElement()
    }

    /// Filter by tag
    func glimmers(withTag tag: String) -> [Glimmer] {
        filter { $0.tags.contains(tag) }
    }

    /// All unique tags
    func allTags() -> [String] {
        Set(flatMap { $0.tags }).sorted()
    }
}
