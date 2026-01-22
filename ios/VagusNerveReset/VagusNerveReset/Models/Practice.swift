// Practice.swift
// Practice definitions and types

import Foundation

// MARK: - Practice Type Enum

enum PracticeType: String, Codable, CaseIterable {
    case moodRecord = "mood_record"
    case containment = "containment"
    case bodyExercise = "body_exercise"
    case regulatingResource = "regulating_resource"
    case worryRecord = "worry_record"
    case emotionRecognition = "emotion_recognition"
    case basicNeedsJournal = "basic_needs_journal"
    case hyperarousalResource = "hyperarousal_resource"
    case hypoarousalResource = "hypoarousal_resource"

    var displayName: String {
        switch self {
        case .moodRecord: return "Mood Record"
        case .containment: return "Containment Exercise"
        case .bodyExercise: return "Body Exercise"
        case .regulatingResource: return "Regulating Resource"
        case .worryRecord: return "Worry Record"
        case .emotionRecognition: return "Emotion Recognition"
        case .basicNeedsJournal: return "Basic Needs Journal"
        case .hyperarousalResource: return "Hyperarousal Resource"
        case .hypoarousalResource: return "Hypoarousal Resource"
        }
    }

    var icon: String {
        switch self {
        case .moodRecord: return "face.smiling"
        case .containment: return "square.stack.3d.up"
        case .bodyExercise: return "figure.walk"
        case .regulatingResource: return "leaf"
        case .worryRecord: return "doc.text"
        case .emotionRecognition: return "heart"
        case .basicNeedsJournal: return "list.bullet.clipboard"
        case .hyperarousalResource: return "bolt"
        case .hypoarousalResource: return "moon"
        }
    }

    var requiresPremium: Bool {
        switch self {
        case .moodRecord, .emotionRecognition:
            return false
        case .containment, .bodyExercise, .regulatingResource,
             .worryRecord, .basicNeedsJournal,
             .hyperarousalResource, .hypoarousalResource:
            return true  // Most practices are premium (can be adjusted per variant)
        }
    }
}

// MARK: - Practice Model

struct Practice: Identifiable, Codable {
    let id: String
    let type: PracticeType
    let variant: String  // e.g., "bee_breathing", "box_breathing"
    let name: String
    let description: String
    let durationMinutes: Int
    let instructions: String?
    let audioAssetURL: URL?
    let isPremium: Bool

    var durationFormatted: String {
        if durationMinutes < 60 {
            return "\(durationMinutes) min"
        } else {
            let hours = durationMinutes / 60
            let minutes = durationMinutes % 60
            if minutes == 0 {
                return "\(hours) hr"
            } else {
                return "\(hours) hr \(minutes) min"
            }
        }
    }

    // MARK: - Sample Practices

    static let allPractices: [Practice] = [
        // Mood Record (Free)
        Practice(
            id: "mood-record",
            type: .moodRecord,
            variant: "standard",
            name: "Daily Mood Record",
            description: "Track your daily mood, emotions, and nervous system state",
            durationMinutes: 3,
            instructions: nil,
            audioAssetURL: nil,
            isPremium: false
        ),

        // Containment Exercises
        Practice(
            id: "containment-visualization",
            type: .containment,
            variant: "container_visualization",
            name: "Container Visualization",
            description: "Guided visualization to contain distressing thoughts",
            durationMinutes: 5,
            instructions: "Find a comfortable seated position. Close your eyes and imagine a container...",
            audioAssetURL: URL(string: "https://example.com/audio/container.mp3"),
            isPremium: false  // Free version
        ),
        Practice(
            id: "containment-box-breathing",
            type: .containment,
            variant: "box_breathing",
            name: "Box Breathing",
            description: "4-4-4-4 breathing pattern for calm focus",
            durationMinutes: 4,
            instructions: "Breathe in for 4 counts, hold for 4, breathe out for 4, hold for 4. Repeat.",
            audioAssetURL: nil,
            isPremium: true  // Premium
        ),
        Practice(
            id: "containment-body-scan",
            type: .containment,
            variant: "body_scan",
            name: "Body Scan",
            description: "Progressive body relaxation from head to toe",
            durationMinutes: 8,
            instructions: "Bring awareness to each part of your body, releasing tension...",
            audioAssetURL: URL(string: "https://example.com/audio/body-scan.mp3"),
            isPremium: true
        ),

        // Body Exercises
        Practice(
            id: "body-bee-breathing",
            type: .bodyExercise,
            variant: "bee_breathing",
            name: "Bee Breathing",
            description: "Bhramari pranayama - humming breath for vagus nerve activation",
            durationMinutes: 3,
            instructions: "Inhale deeply, then exhale while making a humming sound like a bee.",
            audioAssetURL: nil,
            isPremium: false  // Free version
        ),
        Practice(
            id: "body-arm-swings",
            type: .bodyExercise,
            variant: "arm_swings",
            name: "Arm Swings",
            description: "Bilateral movement to integrate nervous system",
            durationMinutes: 2,
            instructions: "Stand and swing arms side to side, crossing the midline of your body.",
            audioAssetURL: nil,
            isPremium: true
        ),
        Practice(
            id: "body-butterfly-hug",
            type: .bodyExercise,
            variant: "butterfly_hug",
            name: "Butterfly Hug",
            description: "Self-soothing bilateral stimulation",
            durationMinutes: 2,
            instructions: "Cross arms and tap alternating shoulders gently.",
            audioAssetURL: nil,
            isPremium: true
        ),

        // Regulating Resources
        Practice(
            id: "resource-cold-exposure",
            type: .regulatingResource,
            variant: "cold_exposure",
            name: "Cold Exposure",
            description: "Ice on face or cold shower to activate vagus nerve",
            durationMinutes: 2,
            instructions: "Place ice pack on face or splash cold water for 30-60 seconds.",
            audioAssetURL: nil,
            isPremium: true
        ),
        Practice(
            id: "resource-singing",
            type: .regulatingResource,
            variant: "singing",
            name: "Singing",
            description: "Vocal activation for vagal tone",
            durationMinutes: 5,
            instructions: "Sing, hum, or chant. Focus on vibrations in your chest and throat.",
            audioAssetURL: nil,
            isPremium: true
        ),
        Practice(
            id: "resource-natural-light",
            type: .regulatingResource,
            variant: "natural_light",
            name: "Natural Light Exposure",
            description: "Morning sunlight for circadian regulation",
            durationMinutes: 10,
            instructions: "Get outside within 30 minutes of waking. No sunglasses.",
            audioAssetURL: nil,
            isPremium: true
        ),
        Practice(
            id: "resource-hot-shower",
            type: .regulatingResource,
            variant: "hot_shower",
            name: "Hot Shower/Bath",
            description: "Warmth for relaxation and comfort",
            durationMinutes: 15,
            instructions: "Take a warm shower or bath. Focus on the sensation of warmth.",
            audioAssetURL: nil,
            isPremium: true
        ),

        // Emotion Recognition (Free)
        Practice(
            id: "emotion-recognition",
            type: .emotionRecognition,
            variant: "standard",
            name: "Recognize & Sit with Emotions",
            description: "90-second practice to increase emotional tolerance",
            durationMinutes: 2,
            instructions: "Identify the emotion, locate it in your body, and sit with it for 90 seconds.",
            audioAssetURL: nil,
            isPremium: false
        ),

        // Worry Record (Premium)
        Practice(
            id: "worry-record",
            type: .worryRecord,
            variant: "standard",
            name: "Worry Record",
            description: "Cognitive restructuring for anxious thoughts",
            durationMinutes: 10,
            instructions: "Write down your worry, evidence for/against, and a balanced thought.",
            audioAssetURL: nil,
            isPremium: true
        ),

        // Basic Needs Journal (Premium)
        Practice(
            id: "basic-needs-journal",
            type: .basicNeedsJournal,
            variant: "standard",
            name: "Basic Needs Journal",
            description: "Assess and address foundational needs",
            durationMinutes: 15,
            instructions: "Reflect on sleep, nutrition, safety, connection, and purpose.",
            audioAssetURL: nil,
            isPremium: true
        ),
    ]

    static func practicesByType(_ type: PracticeType) -> [Practice] {
        allPractices.filter { $0.type == type }
    }

    static func freePractices() -> [Practice] {
        allPractices.filter { !$0.isPremium }
    }

    static func premiumPractices() -> [Practice] {
        allPractices.filter { $0.isPremium }
    }
}
