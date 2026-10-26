# Data Model: Tailwind CSS Integration

**Feature**: Tailwind CSS integration for the CIIT Virtual Campus Tour
**Date**: 2026-10-26
**Plan**: [plan.md](./plan.md)

This feature has no persistent data, database schema, API payload, or state-machine changes. The "model" is the finite set of design values, UI surfaces, and styling conventions that the migration must preserve.

## 1. Design Values

These tokens replace the CSS custom properties currently declared in `src/index.css`. Values are the approved baseline and MUST NOT be changed by this feature.

### Colors

| Token | Value | Previous name | Intended use |
|-------|-------|---------------|--------------|
| `--color-canvas` | `#020617` | `--bg` | Page and panorama background |
| `--color-surface` | `#0f172a` | `--surface` | Header, sidebar, gallery, cards |
| `--color-surface-strong` | `#1e293b` | `--surface-strong` | Raised cards and gallery items |
| `--color-surface-soft` | `rgb(15 23 42 / 0.88)` | `--surface-soft` | Backdrop-blurred panels |
| `--color-ink` | `#e2e8f0` | `--text` | Primary text |
| `--color-muted` | `#94a3b8` | `--muted` | Secondary text and captions |
| `--color-line` | `#334155` | `--border` | Borders and dividers |
| `--color-accent` | `#38bdf8` | `--accent` | Primary accent |
| `--color-accent-strong` | `#0ea5e9` | `--accent-strong` | Reserved for accent emphasis |
| `--color-accent-ink` | `#082f49` | `--accent-ink` | Text on accent backgrounds |
| `--color-danger` | `#fca5a5` | `--danger` | Error text |
| `--color-focus` | `#fbbf24` | `--focus` | Focus outline and skip link |
| `--color-accent-hover` | `#7dd3fc` | Inline `#7dd3fc` | Primary button hover |
| `--color-accent-soft` | `rgb(56 189 248 / 0.16)` | Inline values | Current-location highlight |
| `--color-accent-notice` | `rgb(56 189 248 / 0.1)` | Inline values | Narration notice background |
| `--color-selected-ink` | `#bae6fd` | Inline `#bae6fd` | Current-location description and narration notice text |
| `--color-instruction` | `#cbd5e1` | Inline `#cbd5e1` | Panorama instruction text |
| `--color-focus-ink` | `#111827` | Inline `#111827` | Skip-link text |

Alpha composites currently written as `rgba(...)` values MAY be expressed with Tailwind opacity modifiers on the semantic color tokens.

### Typography

| Token | Value | Source |
|-------|-------|--------|
| `--font-sans` | `'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif` | Existing `:root` font stack |
| Body color | `--color-ink` | Existing body rule |
| Heading line height | `1.15` | Existing heading rule |
| Eyebrow | `0.72rem`, weight 800, letter spacing `0.16em`, uppercase | Existing `.eyebrow` |
| Brand mark | `0.8rem`, weight 900, letter spacing `0.12em` | Existing `.brand-mark` |
| Fluid headings | `clamp(1.4rem, 3vw, 2rem)` and `clamp(2rem, 6vw, 4rem)` | Existing gallery and fatal-error headings |

### Spacing, radius, shadows, and blur

| Token or value | Value | Use |
|----------------|-------|-----|
| Base spacing unit | `0.25rem` | Tailwind default scale |
| `--radius-mark` | `0.35rem` | Brand mark |
| `--radius-instruction` | `0.65rem` | Panorama instruction |
| `--radius-location` | `0.8rem` | Location button |
| `--radius-gallery-item` | `0.9rem` | Gallery item and empty state |
| `--radius-panel` | `1rem` | Panorama status and narration |
| `--radius-gallery-panel` | `1.25rem` | Gallery dialog |
| Full radius | `9999px` | Buttons and pills |
| Sidebar shadow | `1.5rem 0 4rem rgb(0 0 0 / 0.35)` | Compact sidebar |
| Narration shadow | `0 1rem 3rem rgb(0 0 0 / 0.32)` | Narration panel |
| Gallery shadow | `0 2rem 5rem rgb(0 0 0 / 0.45)` | Gallery dialog |
| Header blur | `18px` | Header backdrop |
| Narration blur | `14px` | Narration backdrop |
| Gallery backdrop blur | `8px` | Gallery overlay |

### Breakpoints

| Variant | Media query | Existing behavior |
|---------|-------------|-------------------|
| `compact:` | `max-width: 63.9375rem` (1023px) | Sidebar and backdrop become fixed below the 1024px desktop layout |
| `narrow:` | `max-width: 43.75rem` (700px) | Panorama instructions move to the bottom; narration spans the bottom edge |
| `tiny:` | `max-width: 35rem` (560px) | Brand name hides; toolbar compacts; gallery becomes full-screen |

The variants are defined with `@custom-variant` and use inclusive `max-width`
queries so a viewport exactly at 700px or 560px receives the compact layout.
Mobile-first utilities are preferred for new behavior; use the existing custom
variants when preserving the original max-width behavior.

## 2. UI Surface Inventory

Each surface below must be migrated to utilities without changing its accessible name, role, state attributes, focus order, or behavior.

| Surface | Source | States | Required layout characteristics |
|---------|--------|--------|--------------------------------|
| App shell | `Layout.jsx` utilities | Loading, ready, error | Full-height grid; header row plus flexible body; no page scroll |
| Header | `Layout.jsx` utilities | Sidebar open/closed | 4rem minimum height; blurred dark background; brand and current location |
| Skip link | `index.css`, `Layout.jsx` | Hidden, focused | Off-screen until focused; high-contrast focus treatment |
| Sidebar | `Sidebar.jsx` utilities | Open, closed, empty, current location, unavailable location | 20rem desktop rail; fixed compact drawer below 1024px; scrollable |
| Location list | `Sidebar.jsx` utilities | Default, hover, current, disabled | Full-width grid buttons; accent border and background for current; disabled cursor and opacity |
| Panorama viewer | `PanoramaViewer.jsx` utilities | Loading, ready, unavailable, keyboard-focused | Absolute-fill container; `touch-action: none`; overlays do not block the canvas |
| Panorama status | `PanoramaViewer.jsx` utilities | Loading, error | Centered panel; error uses danger color; spinner animation |
| Panorama instructions | `PanoramaViewer.jsx` utilities | Desktop, narrow | Top-left desktop; bottom-centered below 700px; pointer-events none |
| Toolbar | `Layout.jsx` utilities | Gallery closed/open | Top-right overlay; compact on small screens |
| Narration player | `NarrationPlayer.jsx` utilities | Idle, loading, playing, paused, ended, blocked, error, transcript open/closed | Bottom-centered panel; full-width bottom sheet below 700px; transcript scroll area |
| Gallery | `RoomGallery.jsx` utilities | Closed, open, empty | Fixed backdrop; centered dialog; auto-fit image grid; full-screen below 560px |
| Buttons | component utilities | Default, hover, focus, disabled | Rounded pills; icon, primary, and secondary variants; visible focus |
| Loading and error states | `Layout.jsx` utilities | Loading, error | Centered content; spinner; retry action; readable message |
| Fatal error | `ErrorBoundary.jsx` utilities | Error | Full-height centered content; brand eyebrow; reload action |

## 3. Styling Conventions

### 3.1 Utility-first ownership

- Layout, spacing, color, typography, borders, radii, shadows, and responsive behavior belong in utility classes on the JSX elements.
- `src/index.css` owns only: Tailwind theme and utility imports, the curated base reset, the body background and typography, the focus-visible rule, the reduced-motion rule, and unavoidable third-party or canvas-specific selectors.
- No new component stylesheet may be added. After migration, no `.css` file remains under `src/components`, and `src/App.css` is deleted.

### 3.2 Static class visibility

- Use complete class names. Correct: `open ? 'block' : 'hidden'` and `aria-[current=true]:border-accent`.
- Do not build class names from fragments. Incorrect: `` `bg-${tone}-500` ``.
- If a state needs a variant, prefer the existing `aria-*` attribute. Add a `data-*` attribute only when no accessible attribute describes the state.

### 3.3 Token discipline

- Use semantic token utilities such as `bg-canvas`, `text-muted`, `border-line`, `text-accent`, and `bg-accent`.
- Arbitrary values are allowed only for one-off values already present in this model, such as the gallery grid minimum or a specific shadow. They must not replace a reusable token.
- Do not introduce Tailwind's default palette colors for brand or surface styling.

### 3.4 Responsive discipline

- Build the smallest viewport first, then add desktop enhancements.
- Preserve the 1024, 700, and 560 pixel thresholds. Do not substitute the default 640 or 768 pixel breakpoints for existing behavior.
- Test 320x568, 375x667, 560x800, 700x800, 1024x768, and 1440x900 in portrait and landscape where applicable.

### 3.5 Accessibility discipline

- Preserve every existing `aria-label`, `aria-labelledby`, `aria-live`, `aria-current`, `aria-expanded`, `aria-hidden`, `role`, `tabIndex`, and focus-management effect.
- Maintain WCAG 2.1 AA contrast for text and controls against their backgrounds.
- Keep a visible focus indicator on every interactive element.
- Keep the reduced-motion rule.
- Ensure 200 percent zoom and forced-colors mode do not hide or overlap content.

### 3.6 Marzipano discipline

- The panorama container must remain absolutely positioned and fill the viewer area.
- The base reset must not set a conflicting width, height, overflow, border, or display value on the canvas or its container.
- The instruction overlay must remain `pointer-events: none`.
- The viewer's keyboard handling and `touch-action: none` must remain intact.
- Verify a loaded panorama after migration, not only the loading state.

## 4. Validation Rules

| Rule | Check |
|------|-------|
| Visual baseline | Every surface matches the approved pre-change appearance at all documented viewports, excluding approved improvements |
| No unstyled flash | Three throttled-load runs show styled content from the first meaningful paint |
| Focus | Every interactive element is reachable and shows a visible focus indicator |
| Accessible names | Existing accessible names and roles are unchanged |
| Contrast | Text and controls meet readable contrast on their surfaces |
| Responsive | No horizontal overflow at 320px; all controls reachable in portrait and landscape |
| Zoom | 200 percent zoom preserves content and controls |
| Reduced motion | Animation and transitions are effectively removed when requested |
| Forced colors | Content and controls remain distinguishable in forced-colors mode |
| Panorama | Canvas fills its area, receives drag/touch, and remains interactive after the panorama loads |
| CSS output | Production build contains no unused surface selectors and no component CSS chunks |
| CSS budget | Compressed production CSS is within the approved budget; SC-009 revision required before claiming the original 10 percent cap |
| Backend independence | The frontend remains fully styled with the backend stopped |
| No secrets | No `.env`, credential, token, or backend configuration change is introduced |

## 5. State and Data Boundaries

- No new state is introduced. Existing tour state (`contentStatus`, `currentLocation`, `sidebarOpen`, `galleryOpen`, `narrationStatus`) remains unchanged.
- No API, Mongoose model, controller, route, or service is modified.
- No tour content in `catalog.json` or media under `public/panoramas/` is modified.
- The only persistent repository data changes are the dependency manifest/lockfile and documentation.


