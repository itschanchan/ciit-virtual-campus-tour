# UI Contract: Tailwind CSS Integration

**Feature**: Tailwind CSS integration for the CIIT Virtual Campus Tour
**Date**: 2026-10-26
**Plan**: [../plan.md](../plan.md) | **Data model**: [../data-model.md](../data-model.md)

This contract defines the observable styling, responsive, accessibility, and build behavior that the implementation must preserve. It is not an API contract; the backend and tour-content schema are out of scope.

## 1. Build and Dependency Contract

| Requirement | Contract |
|-------------|----------|
| Tailwind package | `apps/frontend/package.json` declares `tailwindcss` 4.3.3 in `devDependencies` |
| Vite integration | `apps/frontend/package.json` declares `@tailwindcss/vite` 4.3.3 in `devDependencies`; `vite.config.js` registers the plugin |
| Stylesheet entry | `src/index.css` imports Tailwind's theme and utilities layers and defines the approved `@theme` tokens |
| Configuration | No `tailwind.config.js` is required; tokens and theme values live in `src/index.css` |
| Component CSS | No `.css` file remains under `src/components`; `src/App.css` is deleted |
| Global CSS boundary | `src/index.css` contains only Tailwind imports, tokens, base reset, global focus/reduced-motion rules, and unavoidable third-party or canvas-specific selectors |
| Production output | The build emits a single global CSS asset for the app; no component CSS chunk remains |
| Documentation | `docs/tech_stack.md` records both packages; `docs/styling.md` documents the conventions |
| Backend independence | No backend file, environment value, API, or database configuration changes |

## 2. Token Contract

All styling must use the semantic tokens defined in [../data-model.md](../data-model.md). The following names are part of the contract and must remain stable for contributors:

- Colors: `canvas`, `surface`, `surface-strong`, `surface-soft`, `ink`, `muted`, `line`, `accent`, `accent-strong`, `accent-ink`, `danger`, `focus`, `accent-hover`, `accent-soft`
- Typography: `font-sans`
- Breakpoints: `lg` (64rem), `narrow` (43.75rem), `tiny` (35rem)

A contributor may add a token only when a new reusable design value cannot be expressed with an existing token. One-off values already listed in the data model may use arbitrary utilities.

## 3. Surface Contract

Each surface must retain its current accessible name, role, state attributes, focus order, and behavior.

### 3.1 App shell and header

- The shell fills the dynamic viewport height, with a header row and a flexible body, and does not scroll as a whole.
- The header remains at least 4rem tall, uses a dark translucent background with an 18px backdrop blur, and separates its content from the tour with a 1px line.
- The current-location text remains a polite live region and truncates rather than wrapping.
- The header brand and menu button remain visible; the brand name hides below the `tiny` breakpoint.
- The skip link remains the first focusable element and becomes visible when focused.

### 3.2 Sidebar

- Above `lg`, the open sidebar is a 20rem-wide rail with a vertical scrollbar when needed. The closed sidebar is not displayed.
- Below `lg`, the sidebar is a fixed drawer below the header, at most 86vw wide, with the existing shadow. The backdrop is displayed while the drawer is open.
- Each location button remains a full-width button with the location name and description. The current location uses an accent border and accent-tinted background. Unavailable locations remain disabled with the explanatory text and disabled appearance.
- Accessible labels, `aria-current`, `aria-hidden`, and focus behavior remain unchanged.

### 3.3 Panorama viewer

- The viewer fills the tour body and hides overflow. The Marzipano container remains absolutely positioned to all edges.
- The viewer keeps `touch-action: none` and remains draggable with mouse and touch.
- The canvas and its container must not be clipped, resized, or covered by global reset rules.
- The loading and error panels remain centered, bounded to `min(28rem, calc(100% - 2rem))`, and use the established surface, border, radius, and error color.
- The instructions overlay remains `pointer-events: none`, top-left on desktop, and bottom-centered below `narrow`.

### 3.4 Toolbar and buttons

- The gallery trigger remains in the top-right overlay and compacts below `tiny`.
- Icon buttons remain 2.5rem square with a circular border. Primary and secondary buttons remain rounded pills with a minimum height of 2.5rem, visible hover states, and visible focus.
- Disabled buttons keep the not-allowed cursor and reduced opacity.
- The eyebrow label remains uppercase, accent-colored, 0.72rem, weight 800, with 0.16em tracking.

### 3.5 Narration player

- The narration panel remains bottom-centered, bounded to `min(48rem, calc(100% - 2rem))`, with the established translucent surface, border, radius, shadow, and 14px blur.
- Below `narrow`, the player spans the bottom edge, removes its side and bottom borders, and uses a top-rounded rectangle.
- The duration hides below `narrow`.
- The transcript remains a bounded scroll area with a top divider. Blocked and error notices remain visible and use the established accent or danger treatment.
- Accessible labels for play, pause, resume, replay, transcript, and status live regions remain unchanged.

### 3.6 Gallery

- The gallery renders only when open. The backdrop covers the viewport, centers the dialog, and closes on backdrop click.
- The dialog remains bounded to `min(68rem, 100%)`, scrolls vertically, and uses the established border, radius, surface, and shadow.
- Below `tiny`, the dialog fills the viewport and removes its radius.
- The image grid uses an auto-fit layout with a minimum of `min(16rem, 100%)`, 16:10 images, object-cover, and captions.
- Focus moves to the close button when opened and returns to the trigger when closed. Escape closes the dialog.

### 3.7 Loading, error, and fatal-error states

- Loading states remain centered, use the spinner animation, and expose a polite status.
- Error states remain centered, expose an alert, show a readable message, and offer a retry action.
- The fatal error boundary remains full-height, left-aligned on a centered content block, with the bracket-style heading scale, muted body text, and reload action.
- The spinner animation must stop effectively when reduced motion is requested.

## 4. Responsive Contract

| Viewport | Required behavior |
|----------|-------------------|
| 1440x900 | Open sidebar rail, full header, top-right gallery trigger, bottom-centered narration |
| 1024x768 | Same layout as desktop at the `lg` threshold; no drawer/backdrop unless the sidebar is closed |
| 700x800 | Sidebar drawer below header; panorama instructions bottom-centered; narration edge-to-edge |
| 560x800 | Brand name hidden; compact toolbar; gallery full-screen |
| 375x667 | All mobile behavior; no horizontal overflow; all controls reachable |
| 320x568 | Minimum supported width; long location names truncate; no horizontal overflow |
| Landscape phone | Header and drawer remain usable; controls do not collide; panorama remains interactive |

## 5. Accessibility Contract

- All interactive controls remain keyboard reachable in a logical order.
- Every interactive control shows the global 3px `focus` outline with 3px offset, or an equally visible treatment.
- The skip link remains the first focus target and moves into view when focused.
- All existing accessible names, roles, live-region behavior, and ARIA state remain unchanged.
- Text contrast meets WCAG 2.1 AA against its surface.
- Reduced-motion preference suppresses non-essential animation and transitions.
- 200 percent zoom preserves content and controls without overlap or clipping.
- Forced-colors mode keeps content and controls distinguishable.
- The gallery keeps its focus trap behavior, Escape handling, and focus return.

## 6. Visual Baseline Contract

- The approved pre-change interface is the baseline. The migration may not introduce an unapproved redesign.
- Surface colors, typography, spacing, radii, shadows, and breakpoints must match the data model.
- Intentional improvements are allowed only with reviewer approval and must not change behavior or accessibility.
- No surface may flash unstyled. Styles must be present at the first meaningful paint in development and production.
- The backend being unavailable must not affect styling; the tour is a static frontend experience.

## 7. Verification Contract

| Check | Command or method | Pass condition |
|-------|-------------------|----------------|
| Lint | `npm run lint` | Zero errors |
| Build | `npm run build` | Successful build; CSS asset emitted |
| Tests | `npm run test` | Passes when approved Vitest tooling is installed; otherwise the pre-existing blocker is recorded |
| Content assets | `npm run verify:content` | Passes |
| Ignore policy | `npm run verify:ignore` | Passes |
| Dynamic class purge | Inspect `dist/assets/*.css` | Every conditional and state class used by the UI is present |
| Stale CSS | Search `src` for `.css` imports | Only `src/index.css` remains; no component stylesheet import |
| CSS budget | Gzip the production CSS with Node `zlib` | Within the approved budget; SC-009 revision required before claiming the original 10 percent cap |
| Desktop visual | 1440x900 and 1024x768 comparison | Matches baseline |
| Mobile visual | 700x800, 560x800, 375x667, 320x568 comparison | Matches baseline; no horizontal overflow |
| Keyboard | Tab through all controls, Escape overlays, arrow keys on panorama | All controls reachable; focus visible; behavior unchanged |
| Reduced motion | Emulate `prefers-reduced-motion: reduce` | Non-essential animation and transitions suppressed |
| Zoom | Browser zoom 200 percent | No clipping or unreachable controls |
| Forced colors | Emulate forced-colors mode | Content and controls distinguishable |
| Backend offline | Stop the backend and load the frontend | Tour remains styled and usable |
| Panorama | Load a panorama and drag/swipe | Canvas fills area and remains interactive |

## 8. Out of Scope

- Backend, API, database, authentication, and environment changes.
- New tour content or media.
- A light theme, theme toggle, or high-contrast theme selector.
- A visual redesign or new component behavior.
- New dependencies beyond the two approved Tailwind packages.
- Installing deferred test tooling without a separate approval decision.
