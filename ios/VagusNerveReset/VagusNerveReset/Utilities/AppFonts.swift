// AppFonts.swift
// Typography definitions

import SwiftUI

enum AppFonts {
    // MARK: - Headings (Rounded)

    static let largeTitle = Font.system(size: 34, weight: .bold, design: .rounded)
    static let title1 = Font.system(size: 28, weight: .bold, design: .rounded)
    static let title2 = Font.system(size: 22, weight: .semibold, design: .rounded)
    static let title3 = Font.system(size: 20, weight: .semibold, design: .rounded)

    // MARK: - Body (Default)

    static let body = Font.system(size: 17, weight: .regular, design: .default)
    static let bodyBold = Font.system(size: 17, weight: .semibold, design: .default)
    static let callout = Font.system(size: 16, weight: .regular, design: .default)
    static let calloutBold = Font.system(size: 16, weight: .semibold, design: .default)

    // MARK: - Small Text

    static let footnote = Font.system(size: 13, weight: .regular, design: .default)
    static let footnoteBold = Font.system(size: 13, weight: .semibold, design: .default)
    static let caption = Font.system(size: 12, weight: .regular, design: .default)
    static let caption2 = Font.system(size: 11, weight: .regular, design: .default)

    // MARK: - Special

    static let numberLarge = Font.system(size: 48, weight: .bold, design: .rounded)  // For mood scores
    static let timerDisplay = Font.system(size: 64, weight: .bold, design: .rounded) // For practice timers
}

// MARK: - Font Extension (Custom Weights)

extension Font {
    static func rounded(size: CGFloat, weight: Font.Weight = .regular) -> Font {
        return Font.system(size: size, weight: weight, design: .rounded)
    }
}
