// Spacing.swift
// Consistent spacing values

import CoreGraphics

enum Spacing {
    static let xs: CGFloat = 4
    static let sm: CGFloat = 8
    static let md: CGFloat = 16
    static let lg: CGFloat = 24
    static let xl: CGFloat = 32
    static let xxl: CGFloat = 48
}

enum CornerRadius {
    static let small: CGFloat = 8
    static let medium: CGFloat = 12
    static let large: CGFloat = 16
    static let xlarge: CGFloat = 24
    static let pill: CGFloat = 999  // Full pill shape
}

enum IconSize {
    static let small: CGFloat = 16
    static let medium: CGFloat = 24
    static let large: CGFloat = 32
    static let xlarge: CGFloat = 48
}

enum TouchTarget {
    static let minimum: CGFloat = 44  // iOS Human Interface Guidelines minimum
}
