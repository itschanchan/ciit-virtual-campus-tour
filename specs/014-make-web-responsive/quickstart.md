# Quickstart: Make Web Responsive Validation Guide

**Feature**: `014-make-web-responsive` | **Date**: 2026-11-09

## Purpose

Document runnable validation scenarios that prove the responsive feature works end-to-end across mobile, tablet, and desktop viewports.

## Prerequisites

- Node.js LTS (via nvm)
- Repository dependencies installed: `npm install` and `npm run setup` at workspace root
- Frontend dev server running: `npm run dev` (or `cd apps/frontend && npm run dev`)

## Validation Scenarios

### Scenario 1: Sidebar covers the header strip on narrow phones (portrait and landscape)

**Prerequisites**: Dev server running; browser dev tools open to device toolbar

**Steps**:
1. Open the tour in a narrow mobile viewport (e.g., iPhone SE, 375×667px portrait).
2. Tap the sidebar toggle to expand the sidebar.
3. Confirm the sidebar starts flush at the very top of the screen — no transparent header strip is visible above it — with a full-width, fully opaque background.
4. Confirm the current floor/location name (e.g., "Glitch Tower Lobby") is displayed at the top left of the sidebar.
5. Rotate to a still-narrow landscape size (e.g., 667×375px); confirm the sidebar still covers the full header strip.
6. Collapse the sidebar; confirm it closes cleanly.

**Expected outcome**: On narrow phone widths the sidebar is a full-width, fully opaque overlay flush with the top edge in both orientations, with no header strip above it (FR-001a).

### Scenario 1b: Sidebar keeps the desktop panel width on tablet and wide landscape phones

**Prerequisites**: Dev server running; browser dev tools open to device toolbar

**Steps**:
1. Set the viewport to a tablet width (e.g., 800×1024px) or a wide phone in landscape (e.g., 844×390px).
2. Expand the sidebar.
3. Confirm the sidebar starts flush at the top of the screen and uses the desktop panel width (about 320px) — it covers only the header logo area.
4. Confirm the header location name remains visible to the right of the panel.
5. Confirm the area outside the panel is not darkened — the page beneath stays at its normal brightness.
6. Tap the dimmed-free area outside the panel; confirm the sidebar closes.
7. Select a floor; confirm the sidebar closes and the panorama switches.
8. Resize between 700px and 1023px; confirm the panel width stays stable, no transparent strip appears above it, and no backdrop tint appears at any width in that range.

**Expected outcome**: At tablet and wide landscape-mobile widths the sidebar is a desktop-width panel flush with the top edge, covering only the logo area with the location name visible to its right (FR-001b), and the backdrop causes no dimming while still closing the sidebar on tap (FR-001c).

### Scenario 2: Sidebar floor buttons visible and tappable on mobile

**Prerequisites**: Dev server running; mobile viewport

**Steps**:
1. Expand the sidebar on a mobile viewport.
2. Confirm all floor buttons are visible without horizontal scrolling.
3. Tap a floor button; confirm the sidebar closes and the panorama viewer switches to that floor.
4. On tablet and wide landscape-mobile widths, tap outside the panel; confirm the sidebar closes and the page is not darkened by the backdrop. On full-screen narrow phone widths, use a floor selection or the Escape key.

**Expected outcome**: All floor buttons visible and tappable; the sidebar closes on floor selection (and on backdrop tap wherever the panel does not fill the screen).

### Scenario 3: Header readable on mobile, tablet, desktop

**Prerequisites**: Dev server running

**Steps**:
1. Open the tour on a mobile viewport; confirm the current location name truncates gracefully instead of overflowing.
2. Resize to tablet; confirm logo and location text remain aligned.
3. Resize to desktop; confirm logo and location text display side by side without crowding.

**Expected outcome**: No text overflow or crowding at any viewport size.

### Scenario 4: Panorama viewer fits within screen bounds

**Prerequisites**: Dev server running; mobile viewport

**Steps**:
1. Open the panorama viewer on a mobile viewport.
2. Confirm no view controls or scene list are positioned off-screen.
3. Open the scene list; confirm it slides in from the side without pushing content off-screen.
4. Rotate to landscape; confirm controls remain within visible area.

**Expected outcome**: Viewer and all controls fit within screen bounds in both orientations.

### Scenario 5: Error boundary usable on mobile

**Prerequisites**: Dev server running; mobile viewport

**Steps**:
1. Trigger the error boundary (e.g., navigate to a location with missing panorama data).
2. Confirm the heading and message fit within screen width without horizontal scrolling.
3. Tap the "Reload the tour" button; confirm it is large enough to tap accurately.

**Expected outcome**: Error screen fully visible and tappable on mobile.

### Scenario 6: Floating menu tests pass on mobile viewport

**Prerequisites**: Dev server running; test environment

**Steps**:
1. Run `cd apps/frontend && npx vitest run src/tests/FloatingMenu.test.jsx`.
2. Confirm all tests pass, including the new mobile viewport tests.

**Expected outcome**: All 18 FloatingMenu tests pass, including responsive viewport coverage.

## Commands

```bash
# Install dependencies (workspace root)
npm install
npm run setup

# Run frontend dev server
cd apps/frontend
npm run dev

# Run all frontend tests
npx vitest run

# Run specific test file
npx vitest run src/tests/Sidebar.test.jsx
npx vitest run src/tests/FloatingMenu.test.jsx

# Lint frontend
npm run lint
```

## Expected Outcomes Summary

| SC ID | Criterion | Validation Command |
|-------|-----------|-------------------|
| SC-001 | No horizontal overflow on 320px mobile | Scenario 1–4 visual inspection |
| SC-002 | Minimum tappable button size on mobile | Scenario 1, 2, 5 visual inspection |
| SC-003 | Readable text without horizontal scroll | Scenario 3 visual inspection |
| SC-004 | Sidebar opens/closes via toggle on mobile | Scenario 1, 2 steps |
| SC-005 | Floating menu tests pass on all viewports | `npx vitest run src/tests/FloatingMenu.test.jsx` |
| SC-006 | Tablet sidebar adds no dimming and tap-outside still closes | Scenario 1b steps 5–6 visual inspection |
| FR-001a | Narrow phones: full-width opaque sidebar flush at top, covering the header strip | Scenario 1 visual inspection |
| FR-001b | Tablet/landscape: desktop-width panel flush at top, covering only the logo area | Scenario 1b visual inspection |
| FR-001c | Tablet/landscape: transparent backdrop, tap-outside still closes | Scenario 1b steps 5–6, Scenario 2 step 4 |

## References

- Feature specification: `specs/014-make-web-responsive/spec.md`
- Implementation plan: `specs/014-make-web-responsive/plan.md`
- Research decisions: `specs/014-make-web-responsive/research.md`
- Data model: `specs/014-make-web-responsive/data-model.md`
- Tailwind custom variants: `apps/frontend/src/index.css` (compact, narrow, tiny)
