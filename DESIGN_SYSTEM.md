Of course. Here is a complete and professional DESIGN_SYSTEM.md file, created with your specifications and industry best practices in mind.

I have chosen a strong, trustworthy blue as the secondary color. Blue pairs exceptionally well with green and is often associated with security, intelligence, and calmness—making it a perfect fit for an application like SafePin. It provides a clear, accessible color for secondary actions without competing with the primary green.

SafePin Design System

This document outlines the design system and style guide for the SafePin application. It serves as the single source of truth for all UI components, ensuring a consistent and cohesive user experience across the entire platform.

1. Colors

Our color palette is designed to be clear, accessible, and aligned with our brand identity of safety and trust.

Color	Hex	CSS Variable	Usage
Primary	#4CAF50	--color-primary	Main brand color, buttons, links, success states
Primary Dark	#388E3C	--color-primary-dark	Hover state for primary elements
Secondary	#2196F3	--color-secondary	Secondary actions, informational icons, highlights
Secondary Dark	#1976D2	--color-secondary-dark	Hover state for secondary elements
Warning	#FFC107	--color-warning	Warnings, alerts, items needing attention
Warning Dark	#FFA000	--color-warning-dark	Hover state for warning elements
Error	#f44336	--color-error	Error messages, destructive actions (e.g., delete)
Error Dark	#D32F2F	--color-error-dark	Hover state for error elements
Text			
Text Primary	#212529	--color-text-primary	Main text, headings
Text Secondary	#495057	--color-text-secondary	Subheadings, secondary text
Text Light	#6C757D	--color-text-light	Helper text, disabled text, placeholders
Background			
Background	#f8f9fa	--color-background	Main background color for pages
White	#ffffff	--color-white	Cards, modals, content backgrounds
Other			
Border	#dee2e6	--color-border	Borders, dividers
Overlay	rgba(0, 0, 0, 0.5)	--color-overlay	Modal backgrounds, overlays
2. Typography

Consistent typography is key to a readable and professional-looking application. We use the 'Inter' font family for all text.

Font Family

Primary Font: 'Inter', system-ui, -apple-system, sans-serif

CSS Variable: --font-family-primary

Font Sizes
Size	Rem	Pixels	CSS Variable	Usage
Base	1rem	16px	--font-size-base	Body text, paragraphs
Small	0.875rem	14px	--font-size-small	Helper text, labels
Large	1.25rem	20px	--font-size-large	Subheadings, <h3>
XL	1.5rem	24px	--font-size-xl	Section titles, <h2>
XXL	2rem	32px	--font-size-xxl	Page titles, <h1>
Font Weights

Normal: 400

Medium: 500

Semi-Bold: 600

Bold: 700

Line Height

Base: 1.6

CSS Variable: --line-height-base

3. Buttons

Buttons trigger actions and should be styled consistently to indicate their purpose.

Style Guide: Buttons

Primary Button
Used for the main call-to-action.

Generated html
<button class="btn btn--primary">Primary Action</button>


Secondary Button
Used for important, but not primary, actions.

Generated html
<button class="btn btn--secondary">Secondary Action</button>
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Html
IGNORE_WHEN_COPYING_END

Tertiary/Link Button
Used for less prominent actions, like "Cancel".

Generated html
<button class="btn btn--tertiary">Tertiary Action</button>
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Html
IGNORE_WHEN_COPYING_END

Destructive Button
Used for actions that delete data, like "Delete Report".

Generated html
<button class="btn btn--error">Delete</button>
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Html
IGNORE_WHEN_COPYING_END
Button States
State	CSS
Hover	Apply the corresponding "dark" version of the color.
Disabled	opacity: 0.65; cursor: not-allowed;
4. Forms

Form elements should be easy to use and provide clear feedback.

Style Guide: Forms

Text Input

Generated html
<div style="display: flex; flex-direction: column; gap: 8px;">
  <label for="name">Name</label>
  <input type="text" id="name" placeholder="Enter your name" style="padding: 12px; border: 1px solid var(--color-border); border-radius: 8px;">
</div>
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Html
IGNORE_WHEN_COPYING_END

Dropdown Menu

Generated html
<div style="display: flex; flex-direction: column; gap: 8px;">
  <label for="role">Role</label>
  <select id="role" style="padding: 12px; border: 1px solid var(--color-border); border-radius: 8px;">
    <option>User</option>
    <option>Admin</option>
  </select>
</div>
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Html
IGNORE_WHEN_COPYING_END
5. Alerts

Alerts communicate important messages to the user.

Style Guide: Alerts

Success Alert

Generated html
<div style="padding: 16px; background-color: var(--color-primary); color: white; border-radius: 8px;">
  <strong>Success!</strong> Your report has been submitted.
</div>```

**Warning Alert**
```html
<div style="padding: 16px; background-color: var(--color-warning); color: var(--color-text-primary); border-radius: 8px;">
  <strong>Warning!</strong> Please check the details before submitting.
</div>
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Html
IGNORE_WHEN_COPYING_END

Error Alert

Generated html
<div style="padding: 16px; background-color: var(--color-error); color: white; border-radius: 8px;">
  <strong>Error!</strong> An unknown error occurred.
</div>
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Html
IGNORE_WHEN_COPYING_END
6. Layout

A consistent layout system creates a visually balanced and organized application.

Spacing (8-Point Grid)

We use an 8-point grid system. All margins, padding, and gaps should be in multiples of 8px.

Size	Rem	Pixels	CSS Variable
XS	0.5rem	8px	--spacing-xs
SM	1rem	16px	--spacing-sm
MD	1.5rem	24px	--spacing-md
LG	2rem	32px	--spacing-lg
XL	3rem	48px	--spacing-xl
Grid System

Our layout is based on a flexible grid system.

The main container has a maximum width of 1200px.

CSS Variable: --container-max-width

Border Radius
Size	Pixels	CSS Variable	Usage
SM	4px	--border-radius-sm	Small elements like tags
MD	8px	--border-radius-md	Buttons, inputs, cards
LG	12px	--border-radius-lg	Large containers, modals