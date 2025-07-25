# Microinteraction & Animation Polish for SafePin v1.1

This document summarizes the implementation of microinteractions and animations for the SafePin application, as per the v1.1 specification.

## Core Principles

- **Feedback:** Animations immediately acknowledge user actions.
- **Clarity:** Motion guides the user's eye and clarifies relationships between elements.
- **Consistency:** Animation styles (timing, easing) are consistent throughout the application.
- **Performance:** Animations are lightweight and performant, primarily using CSS transforms.
- **Accessibility:** All animations respect the `prefers-reduced-motion` accessibility setting.

## Component-Level Implementation

### 1. Buttons (`<Button>` Component)

- **Interaction:** On hover.
- **Animation:** The button subtly lifts and grows.
- **Implementation:**
  - On `mouseEnter`, the button's scale animates to `1.03`.
  - On `mouseLeave`, the button's scale animates back to `1.0`.
  - The transition uses a `fast` duration (150ms) and an `ease-in-out` curve.

### 2. Multi-Step Form (`ReportForm.jsx`)

- **Interaction:** Clicking "Next" or "Back".
- **Animation:** The form steps slide in and out horizontally.
- **Implementation:**
  - When navigating forward, the current step slides out to the left, and the new step slides in from the right.
  - The reverse animation occurs when navigating backward.

### 3. Dashboard Stat Cards (`GlobalSystemOverview.jsx`)

- **Interaction:** On page load.
- **Animation:** The cards stagger-fade into view.
- **Implementation:**
  - Each card animates from `opacity: 0` and `y: 20` to `opacity: 1` and `y: 0`.
  - A stagger delay of `50ms` is applied between each card's animation.

### 4. Table Rows (`UserList.jsx`, `ReportModeration.jsx`)

- **Interaction:** On page load or when data changes.
- **Animation:** Each row in the table stagger-fades into view.
- **Implementation:**
  - Each row animates from `opacity: 0` and `y: 10` to `opacity: 1` and `y: 0`.
  - A stagger delay of `20ms` is applied between each row's animation.

### 5. Authority Dashboard: Report Feed & Map Interaction

- **Interaction:** Hovering over a `ReportFeedItem`.
- **Animation:** The corresponding `MapMarker` and the `ReportFeedItem` itself react.
- **Implementation:**
  - `ReportFeedItem`: On hover, the background color changes to a lighter shade, and the item scales to `1.02`.
  - `MapMarker`: When a report item is hovered, the corresponding map pin scales to `1.1`, and all other pins' opacity is reduced to `0.3`.

### 6. Modal Dialogs (`ReportQuickView.jsx`, `Dialog` component)

- **Interaction:** Opening and closing the modal.
- **Animation:** The modal has a gentle "pop and fade" effect.
- **Implementation:**
  - The overlay fades in.
  - The modal content animates from `opacity: 0` and `scale: 0.95` to `opacity: 1` and `scale: 1.0`.
  - The exit animation is the reverse.