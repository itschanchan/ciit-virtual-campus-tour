# Styling Guide

Tailwind CSS is the primary styling system for the frontend. The design tokens
and the global base layer live in `apps/frontend/src/index.css`. Interface
styles belong in the JSX that renders the interface.

## Why Tailwind

- One global stylesheet keeps styling predictable and avoids component-level CSS
  files that drift from the markup.
- Theme tokens make the existing dark tour design reusable without repeating
  arbitrary values.
- Tailwind emits only the utilities used by the source, keeping the production
  payload focused.

The project deliberately does not import full Preflight. `index.css` imports the
theme and utilities layers and adds a small curated reset that preserves the tour
baseline. Do not re-enable Preflight without checking the Marzipano canvas,
buttons, images, and dialog layout.

## Global Stylesheet Boundaries

`apps/frontend/src/index.css` may contain only:

1. Tailwind layer imports and custom media variants.
2. `@theme` design tokens.
3. Element-level base rules such as `body`, `button`, headings, focus, and
   reduced-motion handling.

Do not add component selectors, BEM classes, or one-off stylesheets. If a style
is specific to a component, express it with utilities in that component's JSX.

## Design Tokens

Use semantic tokens instead of raw color values. The main namespaces are:

| Namespace | Examples | Use |
|-----------|----------|-----|
| Color | `bg-canvas`, `bg-surface`, `text-ink`, `text-muted`, `border-line` | Surfaces, text, borders |
| Accent | `bg-accent`, `text-accent`, `bg-accent-soft`, `text-accent-ink` | Primary actions, current state, eyebrow text |
| Feedback | `text-danger`, `border-danger/50`, `bg-focus`, `text-focus-ink` | Errors and focus rings |
| Radius | `rounded-panel`, `rounded-location`, `rounded-gallery-item` | Established component shapes |
| Shadow | `shadow-sidebar`, `shadow-narration`, `shadow-gallery` | Elevated overlays |
| Blur | `backdrop-blur-header`, `backdrop-blur-narration` | Translucent surfaces |
| Type | `font-sans`, `text-[0.82rem]`, `leading-[1.4]` | Preserving the existing type scale |

Prefer a token over an arbitrary value. Add a new token only when a value is
reused or expresses a durable design decision.

## Responsive Variants

Use the project's custom variants. They mirror the original CSS breakpoints and
are inclusive, so a viewport exactly at the breakpoint gets the compact layout.

| Variant | Applies at | Purpose |
|---------|------------|---------|
| `compact:` | `max-width: 1023px` | Collapse the sidebar into a fixed drawer |
| `narrow:` | `max-width: 700px` | Reposition instructions and narration for phones |
| `tiny:` | `max-width: 560px` | Compact toolbar, full-screen gallery, hide the brand name |

Example:

```jsx
<aside className="w-80 compact:fixed compact:inset-y-16 compact:left-0 compact:z-30" />
```

Validate changes at 1440x900, 1024x768, 700x800, 560x800, 375x667, 320x568, and a
landscape phone viewport. The minimum supported width is 320 CSS pixels.

## Dynamic Classes

Tailwind scans source text, so every class must appear as a complete literal:

```jsx
// Correct: both complete classes are visible to the scanner.
className={`rounded-location border ${current ? 'border-accent bg-accent-soft' : 'border-line'}`}

// Wrong: Tailwind cannot discover the constructed class name.
className={`border-${current ? 'accent' : 'line'}`}
```

Use complete conditional strings or data attributes with variants. Avoid
constructing class names from variables.

## Accessibility

- Keep the existing semantic elements, accessible names, `aria-current`,
  `aria-expanded`, `aria-controls`, live regions, and dialog focus behavior.
- Use `:focus-visible` through the base rule; do not remove outlines. Prefer
  `focus:` utilities only when the component needs a visual state change.
- The base layer sets a high-contrast focus ring and suppresses non-essential
  animation when `prefers-reduced-motion: reduce` is active.
- Check text against `bg-canvas`, `bg-surface`, and accent surfaces. Do not rely
  on color alone to communicate the current location or an error.
- Keep the tour usable without the backend; do not add remote font or style
  dependencies.
- Verify keyboard-only use, 200 percent zoom, forced-colors mode, and a
  backend-offline session before shipping a visual change.

## Adding a New UI Surface

1. Reuse an existing surface token and spacing pattern where possible.
2. Build the surface with utilities in JSX; do not create a CSS file.
3. Add a semantic token to `index.css` only if the design needs a reusable value.
4. Add complete class literals for every interactive or conditional state.
5. Check all viewports, focus order, reduced motion, and forced colors.
6. Run `npm run lint` and `npm run build`.
7. Check the production CSS size against the approved budget.
