# Component Inventory & Design System

## Design Tokens

### Colors

```swift
// iOS (Swift)
enum AppColors {
    // Primary palette
    static let primary = Color(hex: "#4A90A4")      // Soft teal
    static let secondary = Color(hex: "#F4A261")    // Warm peach
    static let accent = Color(hex: "#D4AF37")       // Gold (premium)

    // Neutrals
    static let background = Color(hex: "#F9F9F9")   // Off-white
    static let surface = Color.white
    static let textPrimary = Color(hex: "#333333")  // Dark gray
    static let textSecondary = Color(hex: "#666666")
    static let textTertiary = Color(hex: "#999999")

    // Semantic
    static let success = Color(hex: "#6A994E")      // Muted green
    static let warning = Color(hex: "#E76F51")      // Soft amber
    static let error = Color(hex: "#C1666B")        // Muted red
    static let info = Color(hex: "#4A90A4")

    // Emotion colors (for mood tracking)
    static let joy = Color(hex: "#FFD93D")
    static let anger = Color(hex: "#E76F51")
    static let fear = Color(hex: "#9B72AA")
    static let sadness = Color(hex: "#6C8EBF")
    static let disgust = Color(hex: "#95B46A")
    static let surprise = Color(hex: "#F4A261")
    static let contentment = Color(hex: "#A8D8B9")
    static let anxiety = Color(hex: "#C1666B")
    static let gratitude = Color(hex: "#FFB5C5")
}
```

```typescript
// Web (TypeScript/Tailwind)
export const colors = {
  primary: {
    DEFAULT: '#4A90A4',
    light: '#6BA8BB',
    dark: '#3A7283',
  },
  secondary: {
    DEFAULT: '#F4A261',
    light: '#F7B685',
    dark: '#E68A42',
  },
  accent: {
    DEFAULT: '#D4AF37',
    light: '#E5C75F',
    dark: '#B89020',
  },
  neutral: {
    50: '#F9F9F9',
    100: '#F0F0F0',
    200: '#E0E0E0',
    300: '#CCCCCC',
    400: '#999999',
    500: '#666666',
    600: '#4D4D4D',
    700: '#333333',
    800: '#1A1A1A',
    900: '#0D0D0D',
  },
  success: '#6A994E',
  warning: '#E76F51',
  error: '#C1666B',
  info: '#4A90A4',
  emotions: {
    joy: '#FFD93D',
    anger: '#E76F51',
    fear: '#9B72AA',
    sadness: '#6C8EBF',
    disgust: '#95B46A',
    surprise: '#F4A261',
    contentment: '#A8D8B9',
    anxiety: '#C1666B',
    gratitude: '#FFB5C5',
  },
}
```

---

### Typography

```swift
// iOS (SwiftUI)
enum AppFonts {
    // Headings
    static let largeTitle = Font.system(size: 34, weight: .bold, design: .rounded)
    static let title1 = Font.system(size: 28, weight: .bold, design: .rounded)
    static let title2 = Font.system(size: 22, weight: .semibold, design: .rounded)
    static let title3 = Font.system(size: 20, weight: .semibold, design: .rounded)

    // Body
    static let body = Font.system(size: 17, weight: .regular, design: .default)
    static let bodyBold = Font.system(size: 17, weight: .semibold, design: .default)
    static let callout = Font.system(size: 16, weight: .regular, design: .default)

    // Small text
    static let footnote = Font.system(size: 13, weight: .regular, design: .default)
    static let caption = Font.system(size: 12, weight: .regular, design: .default)

    // Special
    static let number = Font.system(size: 48, weight: .bold, design: .rounded) // For mood scores
}
```

```css
/* Web (CSS/Tailwind) */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  /* Headings */
  --text-xl: 2.125rem;    /* 34px */
  --text-lg: 1.75rem;     /* 28px */
  --text-md: 1.375rem;    /* 22px */
  --text-base: 1.25rem;   /* 20px */

  /* Body */
  --text-body: 1.0625rem; /* 17px */
  --text-small: 1rem;     /* 16px */

  /* Small text */
  --text-xs: 0.8125rem;   /* 13px */
  --text-2xs: 0.75rem;    /* 12px */
}
```

---

### Spacing

```swift
// iOS
enum Spacing {
    static let xs: CGFloat = 4
    static let sm: CGFloat = 8
    static let md: CGFloat = 16
    static let lg: CGFloat = 24
    static let xl: CGFloat = 32
    static let xxl: CGFloat = 48
}
```

```javascript
// Web (Tailwind config)
module.exports = {
  theme: {
    spacing: {
      'xs': '4px',
      'sm': '8px',
      'md': '16px',
      'lg': '24px',
      'xl': '32px',
      'xxl': '48px',
    }
  }
}
```

---

### Border Radius

```swift
// iOS
enum CornerRadius {
    static let small: CGFloat = 8
    static let medium: CGFloat = 12
    static let large: CGFloat = 16
    static let xlarge: CGFloat = 24
    static let pill: CGFloat = 999  // Full pill shape
}
```

---

### Shadows

```swift
// iOS
enum Shadows {
    static let small = Color.black.opacity(0.05)
    static let medium = Color.black.opacity(0.1)
    static let large = Color.black.opacity(0.15)
}
```

---

## Atomic Components

### 1. Buttons

#### Primary Button

**Usage**: Main CTAs (e.g., "Save Mood Record", "Start Practice")

**Specs**:
- Height: 56pt (iOS) / 56px (Web)
- Corner radius: 12pt
- Background: `AppColors.primary`
- Text: White, bold, 17pt
- Hover: Slightly darker background (web)
- Disabled: 40% opacity

```swift
// iOS SwiftUI
struct PrimaryButton: View {
    let title: String
    let action: () -> Void
    var isLoading: Bool = false
    var isDisabled: Bool = false

    var body: some View {
        Button(action: action) {
            HStack(spacing: 8) {
                if isLoading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: .white))
                }
                Text(title)
                    .font(.body.bold())
            }
            .frame(maxWidth: .infinity)
            .frame(height: 56)
            .background(AppColors.primary)
            .foregroundColor(.white)
            .cornerRadius(12)
            .opacity(isDisabled ? 0.4 : 1.0)
        }
        .disabled(isDisabled || isLoading)
    }
}
```

```tsx
// Web React
interface PrimaryButtonProps {
  title: string;
  onClick: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onClick,
  isLoading = false,
  isDisabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled || isLoading}
      className="w-full h-14 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
    >
      {isLoading && <Spinner className="w-5 h-5" />}
      {title}
    </button>
  );
};
```

---

#### Secondary Button

**Usage**: Less prominent actions (e.g., "Skip", "Cancel")

**Specs**:
- Height: 56pt
- Corner radius: 12pt
- Background: `AppColors.surface` with border
- Border: 1pt, `AppColors.primary`
- Text: `AppColors.primary`, bold, 17pt

```swift
// iOS SwiftUI
struct SecondaryButton: View {
    let title: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.body.bold())
                .frame(maxWidth: .infinity)
                .frame(height: 56)
                .background(AppColors.surface)
                .foregroundColor(AppColors.primary)
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(AppColors.primary, lineWidth: 1)
                )
        }
    }
}
```

---

#### Text Button

**Usage**: Tertiary actions (e.g., "Not Now", "Learn More")

**Specs**:
- No background or border
- Text: `AppColors.primary`, bold, 17pt
- Underline on hover (web)

```swift
// iOS SwiftUI
struct TextButton: View {
    let title: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.body.bold())
                .foregroundColor(AppColors.primary)
        }
    }
}
```

---

#### Icon Button

**Usage**: Close buttons, action buttons with icons

**Specs**:
- Size: 44x44pt (minimum touch target)
- Icon size: 24pt
- Background: Optional (transparent or subtle gray)
- Corner radius: 22pt (circular)

```swift
// iOS SwiftUI
struct IconButton: View {
    let icon: String  // SF Symbol name
    let action: () -> Void
    var backgroundColor: Color = .clear

    var body: some View {
        Button(action: action) {
            Image(systemName: icon)
                .font(.system(size: 24))
                .foregroundColor(AppColors.textPrimary)
                .frame(width: 44, height: 44)
                .background(backgroundColor)
                .clipShape(Circle())
        }
    }
}
```

---

### 2. Cards

#### Standard Card

**Usage**: Practice cards, glimmer cards, action item cards

**Specs**:
- Padding: 16pt
- Corner radius: 16pt
- Background: White
- Shadow: Small (`Color.black.opacity(0.05)`, offset (0, 2), radius 8)
- Border: Optional, 1pt gray for emphasis

```swift
// iOS SwiftUI
struct CardView<Content: View>: View {
    let content: Content
    var hasBorder: Bool = false

    init(hasBorder: Bool = false, @ViewBuilder content: () -> Content) {
        self.hasBorder = hasBorder
        self.content = content()
    }

    var body: some View {
        content
            .padding(16)
            .background(Color.white)
            .cornerRadius(16)
            .shadow(color: Shadows.small, radius: 8, x: 0, y: 2)
            .overlay(
                hasBorder ?
                RoundedRectangle(cornerRadius: 16)
                    .stroke(Color.gray.opacity(0.2), lineWidth: 1)
                : nil
            )
    }
}

// Usage
CardView {
    VStack(alignment: .leading, spacing: 8) {
        Text("Bee Breathing")
            .font(.title3)
        Text("3 min • Calming")
            .font(.footnote)
            .foregroundColor(AppColors.textSecondary)
    }
}
```

---

#### Practice Card (with status)

**Usage**: Daily practice checklist on Home tab

**Specs**:
- Includes checkmark icon (or empty circle) on left
- Practice name, duration, last completed time
- Tap target: entire card

```swift
// iOS SwiftUI
struct PracticeCard: View {
    let practice: Practice
    let isCompleted: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 16) {
                Image(systemName: isCompleted ? "checkmark.circle.fill" : "circle")
                    .font(.system(size: 28))
                    .foregroundColor(isCompleted ? AppColors.success : AppColors.textTertiary)

                VStack(alignment: .leading, spacing: 4) {
                    Text(practice.name)
                        .font(.body.bold())
                        .foregroundColor(AppColors.textPrimary)

                    if isCompleted, let completedAt = practice.lastCompletedAt {
                        Text("Completed at \(completedAt.formatted(date: .omitted, time: .shortened))")
                            .font(.footnote)
                            .foregroundColor(AppColors.textSecondary)
                    } else {
                        Text(practice.subtitle)
                            .font(.footnote)
                            .foregroundColor(AppColors.textSecondary)
                    }
                }

                Spacer()

                Image(systemName: "chevron.right")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(AppColors.textTertiary)
            }
            .padding(16)
            .background(Color.white)
            .cornerRadius(16)
            .shadow(color: Shadows.small, radius: 8, x: 0, y: 2)
        }
        .buttonStyle(PlainButtonStyle())
    }
}
```

---

### 3. Form Inputs

#### Text Field

**Usage**: Email, password, notes

**Specs**:
- Height: 56pt
- Padding: 16pt horizontal
- Corner radius: 12pt
- Background: `AppColors.surface`
- Border: 1pt gray, changes to primary on focus
- Placeholder: `AppColors.textTertiary`

```swift
// iOS SwiftUI
struct StyledTextField: View {
    let placeholder: String
    @Binding var text: String
    var isSecure: Bool = false

    @FocusState private var isFocused: Bool

    var body: some View {
        Group {
            if isSecure {
                SecureField(placeholder, text: $text)
            } else {
                TextField(placeholder, text: $text)
            }
        }
        .padding(16)
        .frame(height: 56)
        .background(AppColors.surface)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(isFocused ? AppColors.primary : Color.gray.opacity(0.3), lineWidth: 1)
        )
        .focused($isFocused)
    }
}
```

---

#### Text Area (Multiline)

**Usage**: Mood notes, worry record, journal entries

**Specs**:
- Min height: 120pt
- Padding: 16pt
- Corner radius: 12pt
- Background: `AppColors.surface`
- Border: 1pt gray
- Character count displayed below (optional)

```swift
// iOS SwiftUI
struct StyledTextEditor: View {
    @Binding var text: String
    let placeholder: String
    var maxCharacters: Int? = nil

    var body: some View {
        VStack(alignment: .trailing, spacing: 4) {
            ZStack(alignment: .topLeading) {
                TextEditor(text: $text)
                    .padding(12)
                    .frame(minHeight: 120)

                if text.isEmpty {
                    Text(placeholder)
                        .foregroundColor(AppColors.textTertiary)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 20)
                        .allowsHitTesting(false)
                }
            }
            .background(AppColors.surface)
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(Color.gray.opacity(0.3), lineWidth: 1)
            )

            if let maxChars = maxCharacters {
                Text("\(text.count)/\(maxChars)")
                    .font(.caption)
                    .foregroundColor(text.count > maxChars ? AppColors.error : AppColors.textSecondary)
            }
        }
    }
}
```

---

#### Slider

**Usage**: Mood score (1-10), worry likelihood (0-100%)

**Specs**:
- Track height: 4pt
- Thumb size: 28pt diameter
- Active color: `AppColors.primary`
- Inactive color: Gray
- Labels at start and end

```swift
// iOS SwiftUI
struct StyledSlider: View {
    @Binding var value: Double
    let range: ClosedRange<Double>
    let step: Double
    let startLabel: String
    let endLabel: String

    var body: some View {
        VStack(spacing: 8) {
            Slider(value: $value, in: range, step: step)
                .accentColor(AppColors.primary)

            HStack {
                Text(startLabel)
                    .font(.footnote)
                    .foregroundColor(AppColors.textSecondary)
                Spacer()
                Text(endLabel)
                    .font(.footnote)
                    .foregroundColor(AppColors.textSecondary)
            }
        }
    }
}

// Usage
StyledSlider(
    value: $moodScore,
    range: 1...10,
    step: 1,
    startLabel: "😢 1",
    endLabel: "10 😊"
)
```

---

#### Chip Selector (Multi-select)

**Usage**: Emotion picker, body sensation tags

**Specs**:
- Height: 40pt
- Padding: 12pt horizontal
- Corner radius: 20pt (pill shape)
- Background: Unselected = `AppColors.surface`, Selected = `AppColors.primary`
- Text: Unselected = `AppColors.textPrimary`, Selected = White
- Wrap into multiple rows using FlowLayout

```swift
// iOS SwiftUI
struct Chip: View {
    let label: String
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(label)
                .font(.callout.bold())
                .padding(.horizontal, 16)
                .padding(.vertical, 10)
                .background(isSelected ? AppColors.primary : AppColors.surface)
                .foregroundColor(isSelected ? .white : AppColors.textPrimary)
                .cornerRadius(20)
                .overlay(
                    RoundedRectangle(cornerRadius: 20)
                        .stroke(isSelected ? Color.clear : Color.gray.opacity(0.3), lineWidth: 1)
                )
        }
    }
}

// Multi-select chip group
struct ChipGroup: View {
    let options: [String]
    @Binding var selectedOptions: Set<String>

    var body: some View {
        FlowLayout(spacing: 8) {
            ForEach(options, id: \.self) { option in
                Chip(
                    label: option,
                    isSelected: selectedOptions.contains(option),
                    action: {
                        if selectedOptions.contains(option) {
                            selectedOptions.remove(option)
                        } else {
                            selectedOptions.insert(option)
                        }
                    }
                )
            }
        }
    }
}
```

---

### 4. Lists & Sections

#### Section Header

**Usage**: Group headers in lists (e.g., "DAILY ROUTINE", "AS NEEDED")

**Specs**:
- Text: `AppColors.textSecondary`, 13pt, bold, uppercase
- Padding: 8pt top, 4pt bottom

```swift
// iOS SwiftUI
struct SectionHeader: View {
    let title: String

    var body: some View {
        Text(title.uppercased())
            .font(.footnote.bold())
            .foregroundColor(AppColors.textSecondary)
            .padding(.top, 8)
            .padding(.bottom, 4)
    }
}
```

---

#### List Row (Navigational)

**Usage**: Settings rows, practice list rows

**Specs**:
- Height: 56pt minimum
- Padding: 16pt horizontal
- Background: White
- Divider: 1pt gray between rows
- Chevron on right

```swift
// iOS SwiftUI
struct NavigationRow: View {
    let icon: String?  // Optional SF Symbol
    let title: String
    let subtitle: String?
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 12) {
                if let icon = icon {
                    Image(systemName: icon)
                        .font(.system(size: 20))
                        .foregroundColor(AppColors.primary)
                        .frame(width: 28, height: 28)
                }

                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.body)
                        .foregroundColor(AppColors.textPrimary)

                    if let subtitle = subtitle {
                        Text(subtitle)
                            .font(.footnote)
                            .foregroundColor(AppColors.textSecondary)
                    }
                }

                Spacer()

                Image(systemName: "chevron.right")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(AppColors.textTertiary)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .frame(minHeight: 56)
            .background(Color.white)
        }
        .buttonStyle(PlainButtonStyle())
    }
}
```

---

### 5. Modals & Overlays

#### Bottom Sheet (iOS)

**Usage**: Paywall, action sheets, pickers

**Specs**:
- Corner radius: 16pt top corners only
- Background: White
- Handle: 36pt wide, 5pt tall, gray, centered at top
- Padding: 24pt horizontal, 16pt vertical

```swift
// iOS SwiftUI
struct BottomSheet<Content: View>: View {
    @Binding var isPresented: Bool
    let content: Content

    init(isPresented: Binding<Bool>, @ViewBuilder content: () -> Content) {
        self._isPresented = isPresented
        self.content = content()
    }

    var body: some View {
        ZStack(alignment: .bottom) {
            if isPresented {
                Color.black.opacity(0.4)
                    .ignoresSafeArea()
                    .onTapGesture {
                        isPresented = false
                    }

                VStack(spacing: 0) {
                    // Handle
                    RoundedRectangle(cornerRadius: 2.5)
                        .fill(Color.gray.opacity(0.4))
                        .frame(width: 36, height: 5)
                        .padding(.top, 8)

                    // Content
                    content
                        .padding(.horizontal, 24)
                        .padding(.vertical, 16)
                }
                .background(Color.white)
                .cornerRadius(16, corners: [.topLeft, .topRight])
                .transition(.move(edge: .bottom))
            }
        }
        .animation(.spring(response: 0.3), value: isPresented)
    }
}
```

---

#### Alert/Confirmation Dialog

**Usage**: Confirmations for destructive actions (e.g., "Delete all data?")

**Specs**: Use native `Alert` on iOS, custom modal on web

```swift
// iOS SwiftUI (native)
.alert("Delete All Data?", isPresented: $showDeleteAlert) {
    Button("Cancel", role: .cancel) { }
    Button("Delete", role: .destructive) {
        // Delete action
    }
} message: {
    Text("This cannot be undone. Your local data will be permanently deleted.")
}
```

---

### 6. Progress Indicators

#### Progress Ring

**Usage**: Today's progress on Home tab (e.g., "2/4 complete")

**Specs**:
- Diameter: 80pt
- Line width: 8pt
- Background: Light gray
- Foreground: `AppColors.primary`
- Center text: "{completed}/{total}"

```swift
// iOS SwiftUI
struct ProgressRing: View {
    let completed: Int
    let total: Int

    var progress: Double {
        guard total > 0 else { return 0 }
        return Double(completed) / Double(total)
    }

    var body: some View {
        ZStack {
            Circle()
                .stroke(Color.gray.opacity(0.2), lineWidth: 8)

            Circle()
                .trim(from: 0, to: CGFloat(progress))
                .stroke(AppColors.primary, style: StrokeStyle(lineWidth: 8, lineCap: .round))
                .rotationEffect(.degrees(-90))
                .animation(.easeInOut, value: progress)

            VStack(spacing: 4) {
                Text("\(completed)/\(total)")
                    .font(.title2.bold())
                    .foregroundColor(AppColors.textPrimary)
                Text("complete")
                    .font(.caption)
                    .foregroundColor(AppColors.textSecondary)
            }
        }
        .frame(width: 80, height: 80)
    }
}
```

---

#### Streak Badge

**Usage**: Show consecutive days in Home tab or Insights

**Specs**:
- Icon: 🔥 or fire SF Symbol
- Text: "{days} day streak"
- Color: Orange/red gradient

```swift
// iOS SwiftUI
struct StreakBadge: View {
    let days: Int

    var body: some View {
        HStack(spacing: 6) {
            Image(systemName: "flame.fill")
                .foregroundColor(.orange)
            Text("\(days) day streak")
                .font(.footnote.bold())
                .foregroundColor(AppColors.textPrimary)
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 6)
        .background(
            Capsule()
                .fill(Color.orange.opacity(0.1))
        )
    }
}
```

---

#### Loading Spinner

**Usage**: Loading states for async operations

**Specs**: Use native `ProgressView` on iOS, custom spinner on web

```swift
// iOS SwiftUI
struct LoadingView: View {
    let message: String?

    var body: some View {
        VStack(spacing: 16) {
            ProgressView()
                .progressViewStyle(CircularProgressViewStyle(tint: AppColors.primary))

            if let message = message {
                Text(message)
                    .font(.callout)
                    .foregroundColor(AppColors.textSecondary)
            }
        }
    }
}
```

---

### 7. Charts (Insights)

#### Line Chart (Mood Trend)

**Usage**: Show mood score over time (7d, 30d, 90d)

**Library**: Swift Charts (iOS 16+), Recharts (Web)

```swift
// iOS SwiftUI with Swift Charts
import Charts

struct MoodLineChart: View {
    let data: [MoodDataPoint]

    var body: some View {
        Chart(data) { point in
            LineMark(
                x: .value("Date", point.date),
                y: .value("Mood", point.score)
            )
            .foregroundStyle(AppColors.primary)
            .interpolationMethod(.catmullRom)

            PointMark(
                x: .value("Date", point.date),
                y: .value("Mood", point.score)
            )
            .foregroundStyle(AppColors.primary)
        }
        .chartYScale(domain: 1...10)
        .frame(height: 200)
    }
}

struct MoodDataPoint: Identifiable {
    let id = UUID()
    let date: Date
    let score: Double
}
```

---

#### Heatmap Calendar (Practice Completion)

**Usage**: GitHub-style heatmap showing daily completions

**Specs**:
- Cells: 12pt x 12pt
- Colors: White (none) → Light primary → Dark primary (more completions)
- Months labeled at top

```swift
// iOS SwiftUI (custom implementation)
struct HeatmapCalendar: View {
    let completionData: [Date: Int]  // Date -> # of completions

    var body: some View {
        // Custom grid layout
        // (Simplified; full implementation would use LazyVGrid)
        VStack {
            Text("Last 90 Days")
                .font(.headline)

            // Grid of colored cells
            // Each cell represents a day
            // Color intensity = completion count
        }
    }
}
```

---

### 8. Empty States

#### Empty List

**Usage**: No glimmers, no mood records yet

**Specs**:
- Icon: Large, light gray SF Symbol (e.g., "doc.text" for no records)
- Message: "No {items} yet"
- Subtext: "Tap + to add your first one"
- CTA button (optional)

```swift
// iOS SwiftUI
struct EmptyStateView: View {
    let icon: String
    let message: String
    let subtext: String?
    var actionTitle: String?
    var action: (() -> Void)?

    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: icon)
                .font(.system(size: 64))
                .foregroundColor(AppColors.textTertiary)

            Text(message)
                .font(.title3.bold())
                .foregroundColor(AppColors.textPrimary)

            if let subtext = subtext {
                Text(subtext)
                    .font(.callout)
                    .foregroundColor(AppColors.textSecondary)
                    .multilineTextAlignment(.center)
            }

            if let actionTitle = actionTitle, let action = action {
                PrimaryButton(title: actionTitle, action: action)
                    .frame(maxWidth: 200)
            }
        }
        .padding(32)
    }
}
```

---

### 9. Toasts & Notifications

#### Success Toast

**Usage**: Confirmation messages (e.g., "Mood saved!", "Practice completed!")

**Specs**:
- Duration: 2 seconds
- Position: Top or bottom (context-dependent)
- Background: `AppColors.success` with 90% opacity
- Text: White, bold
- Icon: Checkmark

```swift
// iOS SwiftUI
struct ToastView: View {
    let message: String
    let type: ToastType

    enum ToastType {
        case success, error, info

        var color: Color {
            switch self {
            case .success: return AppColors.success
            case .error: return AppColors.error
            case .info: return AppColors.info
            }
        }

        var icon: String {
            switch self {
            case .success: return "checkmark.circle.fill"
            case .error: return "xmark.circle.fill"
            case .info: return "info.circle.fill"
            }
        }
    }

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: type.icon)
                .font(.system(size: 20))
            Text(message)
                .font(.callout.bold())
        }
        .foregroundColor(.white)
        .padding(.horizontal, 20)
        .padding(.vertical, 12)
        .background(
            Capsule()
                .fill(type.color.opacity(0.9))
        )
        .shadow(color: Shadows.medium, radius: 8, x: 0, y: 2)
    }
}

// Usage with modifier
struct ToastModifier: ViewModifier {
    @Binding var toast: Toast?

    func body(content: Content) -> some View {
        ZStack {
            content

            if let toast = toast {
                VStack {
                    ToastView(message: toast.message, type: toast.type)
                        .transition(.move(edge: .top).combined(with: .opacity))
                    Spacer()
                }
                .padding(.top, 50)
                .onAppear {
                    DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                        withAnimation {
                            self.toast = nil
                        }
                    }
                }
            }
        }
        .animation(.spring(), value: toast)
    }
}

struct Toast: Equatable {
    let message: String
    let type: ToastView.ToastType
}
```

---

### 10. Premium Lock Badge

#### Lock Icon Overlay

**Usage**: Indicate premium-only features

**Specs**:
- Icon: 🔒 or lock SF Symbol
- Color: `AppColors.accent` (gold)
- Size: 20pt
- Position: Top-right of card or next to title

```swift
// iOS SwiftUI
struct PremiumBadge: View {
    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: "lock.fill")
                .font(.system(size: 12))
            Text("Premium")
                .font(.caption.bold())
        }
        .foregroundColor(AppColors.accent)
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .background(
            Capsule()
                .fill(AppColors.accent.opacity(0.1))
        )
    }
}
```

---

## Composite Components

### 1. Practice Timer Screen

**Usage**: Full-screen timer during practice (e.g., containment exercise)

**Composition**:
- Background: Gradient or solid calm color
- Centered breathing circle (animated)
- Timer countdown text
- Pause and End buttons at bottom

```swift
// iOS SwiftUI
struct PracticeTimerView: View {
    @StateObject var timerManager: PracticeTimerManager
    let practice: Practice
    let onComplete: () -> Void

    var body: some View {
        ZStack {
            // Background gradient
            LinearGradient(
                colors: [AppColors.primary.opacity(0.3), AppColors.primary.opacity(0.1)],
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()

            VStack(spacing: 40) {
                Spacer()

                // Practice name
                Text(practice.name)
                    .font(.title2.bold())
                    .foregroundColor(AppColors.textPrimary)

                // Breathing circle (animated)
                BreathingCircle(isBreathingIn: $timerManager.isBreathingIn)

                // Timer
                Text(timerManager.remainingTime.formatted())
                    .font(AppFonts.number)
                    .foregroundColor(AppColors.textPrimary)

                Text("remaining")
                    .font(.callout)
                    .foregroundColor(AppColors.textSecondary)

                Spacer()

                // Controls
                HStack(spacing: 20) {
                    SecondaryButton(title: timerManager.isPaused ? "Resume" : "Pause") {
                        timerManager.togglePause()
                    }
                    .frame(maxWidth: .infinity)

                    SecondaryButton(title: "End Early") {
                        timerManager.endEarly()
                        onComplete()
                    }
                    .frame(maxWidth: .infinity)
                }
                .padding(.horizontal, 24)
                .padding(.bottom, 32)
            }
        }
        .navigationBarHidden(true)
    }
}

struct BreathingCircle: View {
    @Binding var isBreathingIn: Bool

    var body: some View {
        Circle()
            .fill(AppColors.primary.opacity(0.3))
            .frame(width: isBreathingIn ? 180 : 120, height: isBreathingIn ? 180 : 120)
            .animation(.easeInOut(duration: 4).repeatForever(autoreverses: true), value: isBreathingIn)
            .onAppear {
                isBreathingIn = true
            }
    }
}
```

---

### 2. Glimmer Card

**Usage**: Display a single glimmer with actions

**Composition**:
- Card with emoji (if provided) and text
- Pin icon (if pinned)
- Long-press menu: Pin/Unpin, Edit, Delete

```swift
// iOS SwiftUI
struct GlimmerCard: View {
    let glimmer: Glimmer
    let onPin: () -> Void
    let onEdit: () -> Void
    let onDelete: () -> Void

    var body: some View {
        HStack(spacing: 12) {
            if let emoji = glimmer.emoji {
                Text(emoji)
                    .font(.system(size: 32))
            }

            Text(glimmer.text)
                .font(.body)
                .foregroundColor(AppColors.textPrimary)

            Spacer()

            if glimmer.isPinned {
                Image(systemName: "pin.fill")
                    .font(.system(size: 16))
                    .foregroundColor(AppColors.accent)
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: Shadows.small, radius: 8, x: 0, y: 2)
        .contextMenu {
            Button(action: onPin) {
                Label(glimmer.isPinned ? "Unpin" : "Pin", systemImage: "pin")
            }
            Button(action: onEdit) {
                Label("Edit", systemImage: "pencil")
            }
            Button(role: .destructive, action: onDelete) {
                Label("Delete", systemImage: "trash")
            }
        }
    }
}
```

---

### 3. Paywall Screen

**Usage**: Premium upsell modal

**Composition**:
- Close button (top-right)
- Heading
- Feature list (checkmarks)
- Price
- Purchase button
- Restore purchase link
- Sign-in prompt (if local-only)

(See Screen Map for full layout; component would wrap existing atomic components)

---

## Animations & Transitions

### Page Transitions
- **iOS**: Native `NavigationLink` push animation (slide from right)
- **Web**: Fade in (200ms) for route changes

### Modal Presentations
- **iOS**: Bottom sheet slides up, background fades in
- **Web**: Modal fades in with scale (0.95 → 1.0)

### Button States
- **Press**: Scale down to 0.95 (100ms)
- **Release**: Scale back to 1.0 (100ms)

### List Item Interactions
- **Tap**: Flash background color (light gray, 200ms)

### Completion Animations
- **Checkmark**: Scale up from 0 to 1.2, then down to 1.0 (300ms total)
- **Confetti** (optional): Small particles animate up and fade out (1s)

---

## Accessibility

### VoiceOver Labels (iOS)
- All buttons: Descriptive labels (e.g., "Save mood record")
- Slider: "Mood score slider, currently {value} out of 10"
- Chips: "Joy, selected" or "Anger, not selected"
- Cards: "Bee breathing practice, completed at 8:05 AM"

### Color Contrast
- All text meets WCAG AA: 4.5:1 minimum for body text
- Interactive elements: 3:1 minimum

### Dynamic Type (iOS)
- All text scales with user's system font size
- Layouts reflow gracefully up to XXXL size

### Keyboard Navigation (Web)
- All interactive elements focusable
- Focus indicators: 2pt blue outline
- Logical tab order

---

## Reusable Layouts

### FlowLayout (Chip Wrapping)

```swift
// iOS SwiftUI
struct FlowLayout: Layout {
    var spacing: CGFloat = 8

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        // Custom layout logic for wrapping chips
        // (Simplified; full implementation available in community libraries)
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        // Place subviews in rows, wrapping as needed
    }
}
```

---

## Icon Usage

### SF Symbols (iOS)
- `house.fill` - Home tab
- `list.bullet` - Practices tab
- `sparkles` - Glimmers tab
- `chart.line.uptrend.xyaxis` - Insights tab
- `gearshape` - Settings tab
- `checkmark.circle.fill` - Completed practice
- `lock.fill` - Premium locked
- `flame.fill` - Streak
- `heart.fill` - Glimmer
- `timer` - Practice timer
- `calendar` - History/schedule

### Lucide Icons (Web)
- `Home` - Home tab
- `List` - Practices tab
- `Sparkles` - Glimmers tab
- `TrendingUp` - Insights tab
- `Settings` - Settings tab
- `CheckCircle2` - Completed practice
- `Lock` - Premium locked
- `Flame` - Streak
- `Heart` - Glimmer
- `Timer` - Practice timer
- `Calendar` - History/schedule

---

## File Structure

### iOS (SwiftUI)
```
VagusNerveReset/
├── App/
│   └── VagusNerveResetApp.swift
├── Models/
│   ├── Practice.swift
│   ├── MoodRecord.swift
│   ├── Glimmer.swift
│   └── ...
├── Views/
│   ├── Components/
│   │   ├── Buttons/
│   │   │   ├── PrimaryButton.swift
│   │   │   ├── SecondaryButton.swift
│   │   │   └── ...
│   │   ├── Cards/
│   │   │   ├── CardView.swift
│   │   │   ├── PracticeCard.swift
│   │   │   └── ...
│   │   ├── Forms/
│   │   │   ├── StyledTextField.swift
│   │   │   ├── StyledSlider.swift
│   │   │   └── ...
│   │   └── ...
│   ├── Screens/
│   │   ├── Home/
│   │   ├── Practices/
│   │   ├── Glimmers/
│   │   ├── Insights/
│   │   └── Settings/
│   └── ...
├── ViewModels/
├── Services/
│   ├── LocalStorageManager.swift
│   ├── SyncEngine.swift
│   ├── PurchaseManager.swift
│   └── ...
└── Resources/
    ├── Assets.xcassets
    └── ...
```

### Web (Next.js)
```
web/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/
│   ├── practices/
│   ├── insights/
│   └── settings/
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── practice-card.tsx
│   ├── glimmer-card.tsx
│   └── ...
├── lib/
│   ├── supabase.ts
│   ├── utils.ts
│   └── ...
├── types/
│   └── database.types.ts
└── public/
```

---

**Document Version**: 1.0
**Last Updated**: 2026-01-22
**Status**: Ready for Implementation
