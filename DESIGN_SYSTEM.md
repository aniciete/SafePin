# SafePin Design System

This document outlines the design system and style guide for the SafePin application. It serves as the single source of truth for all UI components, ensuring a consistent and cohesive user experience across the entire platform.

## 1. Colors

Colors are a fundamental part of our brand identity. The following color palette should be used consistently throughout the application.

| Color           | Hex       | CSS Variable              | Usage                               |
| --------------- | --------- | ------------------------- | ----------------------------------- |
| **Primary**     | `#6ab04c` | `--color-primary`         | Main brand color, buttons, links    |
| Primary Dark    | `#5a9a42` | `--color-primary-dark`    | Hover state for primary elements    |
| **Secondary**   | `#4285f4` | `--color-secondary`       | Secondary actions, highlights       |
| Secondary Dark  | `#357abd` | `--color-secondary-dark`  | Hover state for secondary elements  |
| **Accent**      | `#ff9800` | `--color-warning`         | Warnings, alerts, special notices   |
| Accent Dark     | `#f57c00` | `--color-warning-dark`    | Hover state for accent elements     |
| **Success**     | `#4CAF50` | `--color-success`         | Success messages, confirmations     |
| Success Dark    | `#45a049` | `--color-success-dark`    | Hover state for success elements    |
| **Text**        |           |                           |                                     |
| Text Primary    | `#333333` | `--color-text-primary`    | Main text, headings                 |
| Text Secondary  | `#555555` | `--color-text-secondary`  | Subheadings, secondary text         |
| Text Light      | `#666666` | `--color-text-light`      | Helper text, disabled text          |
| **Background**  |           |                           |                                     |
| Background      | `#f9f9f9` | `--color-background`      | Main background color for pages     |
| White           | `#ffffff` | `--color-white`           | Cards, modals, content backgrounds  |
| **Other**       |           |                           |                                     |
| Border          | `#dddddd` | `--color-border`          | Borders, dividers                   |
| Overlay         | `rgba(0,0,0,0.5)` | `--color-overlay` | Modal backgrounds, overlays         |

## 2. Typography

Consistent typography is key to a readable and professional-looking application. We use the 'Inter' font family for all text.

### Font Family

-   **Primary Font:** 'Inter', Arial, sans-serif
-   **CSS Variable:** `--font-family-primary`

### Font Sizes

| Size      | Rem    | Pixels | CSS Variable         | Usage                 |
| --------- | ------ | ------ | -------------------- | --------------------- |
| Base      | `1rem`   | 16px   | `--font-size-base`   | Body text, paragraphs |
| Small     | `0.875rem` | 14px   | `--font-size-small`  | Helper text, labels   |
| Large     | `1.125rem` | 18px   | `--font-size-large`  | Subheadings, `<h3>`   |
| XL        | `1.5rem`   | 24px   | `--font-size-xl`     | Section titles, `<h2>`|
| XXL       | `2rem`     | 32px   | `--font-size-xxl`    | Page titles, `<h1>`   |

### Font Weights

-   **Normal:** 400
-   **Medium:** 500
-   **Semi-Bold:** 600
-   **Bold:** 700

### Line Height

-   **Base:** 1.5
-   **CSS Variable:** `--line-height-base`

## 3. Buttons

Buttons are used to trigger actions and should be styled consistently to indicate their purpose and importance.

### Style Guide: Buttons

**Primary Button**

Used for the main call-to-action.

```html
<button class="btn btn-primary">Primary Action</button>
```

**Secondary Button**

Used for secondary actions.

```html
<button class="btn btn-secondary">Secondary Action</button>
```

**Tertiary/Link Button**

Used for less prominent actions.

```html
<button class="btn btn-tertiary">Tertiary Action</button>
```

**Button States**

| State     | Example                                |
| --------- | -------------------------------------- |
| **Hover** | Add a `darken()` effect to the background color. |
| **Disabled**| `opacity: 0.65; cursor: not-allowed;`  |

```html
<button class="btn btn-primary" disabled>Disabled</button>
```

## 4. Forms

Form elements should be easy to use and provide clear feedback to the user.

### Style Guide: Forms

**Text Input**

```html
<div style="display: flex; flex-direction: column; gap: 8px;">
  <label for="name">Name</label>
  <input type="text" id="name" placeholder="Enter your name" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
</div>
```

**Dropdown Menu**

```html
<div style="display: flex; flex-direction: column; gap: 8px;">
  <label for="role">Role</label>
  <select id="role" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
    <option>User</option>
    <option>Admin</option>
  </select>
</div>
```

## 5. Alerts

Alerts are used to communicate important messages to the user.

### Style Guide: Alerts

**Success Alert**

Used for confirmation messages.

```html
<div style="padding: 16px; background-color: #4CAF50; color: white; border-radius: 4px;">
  <strong>Success!</strong> Your report has been submitted.
</div>
```

**Warning Alert**

Used for non-critical warnings.

```html
<div style="padding: 16px; background-color: #ff9800; color: white; border-radius: 4px;">
  <strong>Warning!</strong> Please check the details before submitting.
</div>
```

**Error Alert**

Used for critical errors that require user action.

```html
<div style="padding: 16px; background-color: #f44336; color: white; border-radius: 4px;">
  <strong>Error!</strong> An unknown error occurred.
</div>
```

## 6. Layout

A consistent layout system helps to create a visually balanced and organized application.

### Spacing

We use a set of spacing variables to ensure consistent margins and padding throughout the application.

| Size | Rem      | Pixels | CSS Variable      |
| ---- | -------- | ------ | ----------------- |
| XS   | `0.25rem`  | 4px    | `--spacing-xs`    |
| SM   | `0.5rem`   | 8px    | `--spacing-sm`    |
| MD   | `1rem`     | 16px   | `--spacing-md`    |
| LG   | `1.5rem`   | 24px   | `--spacing-lg`    |
| XL   | `2rem`     | 32px   | `--spacing-xl`    |
| XXL  | `3rem`     | 48px   | `--spacing-xxl`   |

### Grid System

-   Our layout is based on a flexible grid system that adapts to different screen sizes.
-   The main container has a maximum width of `1200px`.
-   **CSS Variable:** `--container-max-width`

### Border Radius

| Size | Pixels | CSS Variable          | Usage               |
| ---- | ------ | --------------------- | ------------------- |
| SM   | 4px    | `--border-radius-sm`  | Buttons, inputs     |
| MD   | 8px    | `--border-radius-md`  | Cards, small containers |
| LG   | 12px   | `--border-radius-lg`  | Large containers, modals |
