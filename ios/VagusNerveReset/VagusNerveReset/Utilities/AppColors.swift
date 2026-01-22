// AppColors.swift
// Color palette for the app

import SwiftUI

enum AppColors {
    // MARK: - Primary Palette

    static let primary = Color(hex: "#4A90A4")          // Soft teal
    static let primaryLight = Color(hex: "#6BA8BB")
    static let primaryDark = Color(hex: "#3A7283")

    static let secondary = Color(hex: "#F4A261")        // Warm peach
    static let secondaryLight = Color(hex: "#F7B685")
    static let secondaryDark = Color(hex: "#E68A42")

    static let accent = Color(hex: "#D4AF37")           // Gold (premium)
    static let accentLight = Color(hex: "#E5C75F")
    static let accentDark = Color(hex: "#B89020")

    // MARK: - Neutrals

    static let background = Color(hex: "#F9F9F9")       // Off-white
    static let surface = Color.white
    static let surfaceElevated = Color(hex: "#FFFFFF")

    static let textPrimary = Color(hex: "#333333")      // Dark gray
    static let textSecondary = Color(hex: "#666666")
    static let textTertiary = Color(hex: "#999999")

    static let border = Color(hex: "#E0E0E0")
    static let divider = Color(hex: "#F0F0F0")

    // MARK: - Semantic Colors

    static let success = Color(hex: "#6A994E")          // Muted green
    static let warning = Color(hex: "#E76F51")          // Soft amber
    static let error = Color(hex: "#C1666B")            // Muted red
    static let info = Color(hex: "#4A90A4")

    // MARK: - Emotion Colors (for mood tracking)

    static let emotionJoy = Color(hex: "#FFD93D")
    static let emotionAnger = Color(hex: "#E76F51")
    static let emotionFear = Color(hex: "#9B72AA")
    static let emotionSadness = Color(hex: "#6C8EBF")
    static let emotionDisgust = Color(hex: "#95B46A")
    static let emotionSurprise = Color(hex: "#F4A261")
    static let emotionContentment = Color(hex: "#A8D8B9")
    static let emotionAnxiety = Color(hex: "#C1666B")
    static let emotionGratitude = Color(hex: "#FFB5C5")

    // MARK: - Shadows

    static let shadowSmall = Color.black.opacity(0.05)
    static let shadowMedium = Color.black.opacity(0.1)
    static let shadowLarge = Color.black.opacity(0.15)

    // MARK: - Helper Function

    static func emotionColor(for emotion: String) -> Color {
        switch emotion.lowercased() {
        case "joy": return emotionJoy
        case "anger": return emotionAnger
        case "fear": return emotionFear
        case "sadness": return emotionSadness
        case "disgust": return emotionDisgust
        case "surprise": return emotionSurprise
        case "contentment": return emotionContentment
        case "anxiety": return emotionAnxiety
        case "gratitude": return emotionGratitude
        default: return textSecondary
        }
    }
}

// MARK: - Color Extension (Hex Support)

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)

        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (1, 1, 1, 0)
        }

        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue:  Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}
