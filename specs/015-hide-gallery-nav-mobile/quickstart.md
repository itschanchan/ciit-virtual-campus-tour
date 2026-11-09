# Quickstart: Hide Gallery and Floating Nav When Sidebar Opens on Mobile — Validation Guide

**Feature**: `015-hide-gallery-nav-mobile` | **Date**: 2026-11-09

## Purpose

Document runnable validation scenarios that prove the gallery and floating nav hide/show behavior works end-to-end when the sidebar toggles on mobile versus desktop.

## Prerequisites

- Node.js LTS (via nvm)
- Repository dependencies installed: `npm install` and `npm run setup` at workspace root
- Frontend dev server running: `npm run dev` (or `cd apps/frontend && npm run dev`)

## Validation Scenarios

### Scenario 1: Room gallery hidden when sidebar opens on mobile

**Prerequisites**: Dev server running; browser dev tools open to device toolbar; a location with gallery images available

**Steps**:
1. Open the tour on a narrow mobile viewport (e.g., 375×667px).
2. Open the room gallery for the current location (tap "View gallery").
3. Confirm the gallery overlay is visible.
4. Tap the sidebar toggle to expand the sidebar.
5. Confirm the room gallery is no longer visible.
6. Confirm the "View gallery" button is no longer visible.
7. Confirm only the sidebar content is visible through the tinted background.

**Expected outcome**: On mobile, opening the sidebar hides the room gallery and gallery button (FR-001, FR-002, SC-001, SC-002, SC-006).

### Scenario 2: Floating nav hidden when sidebar opens on mobile

**Prerequisites**: Dev server running; mobile viewport

**Steps**:
1. Open the tour on a narrow mobile viewport (e.g., 375×667px).
2. Confirm the floating navigation bar is visible at the bottom center.
3. Tap the sidebar toggle to expand the sidebar.
4. Confirm the floating navigation bar is no longer visible.
5. Confirm only the sidebar content is visible through the tinted background.

**Expected outcome**: On mobile, opening the sidebar hides the floating navigation bar (FR-003, SC-003, SC-006).

### Scenario 2b: Gallery button hidden when sidebar opens on mobile

**Prerequisites**: Dev server running; mobile viewport

**Steps**:
1. Open the tour on a narrow mobile viewport (e.g., 375×667px).
2. Confirm the "View gallery" button is visible near the top-right of the panorama.
3. Tap the sidebar toggle to expand the sidebar.
4. Confirm the "View gallery" button is no longer visible.
5. Confirm only the sidebar content is visible through the tinted background.

**Expected outcome**: On mobile, opening the sidebar hides the gallery button (FR-002, SC-002, SC-006).

### Scenario 3: Gallery, gallery button, and floating nav reappear when sidebar closes on mobile

**Prerequisites**: Dev server running; mobile viewport

**Steps**:
1. With the sidebar open on mobile (gallery, gallery button, and floating nav hidden per Scenarios 1, 2b, 2), tap the sidebar toggle or the close button to collapse the sidebar.
2. Confirm the room gallery reappears (if it was open before).
3. Confirm the "View gallery" button reappears.
4. Confirm the floating navigation bar reappears.

**Expected outcome**: Closing the sidebar on mobile restores all surfaces (FR-004, SC-004).

### Scenario 4: Gallery, gallery button, and floating nav remain visible on desktop when sidebar opens

**Prerequisites**: Dev server running; desktop viewport (e.g., 1280×720)

**Steps**:
1. Open the tour on a desktop viewport.
2. Open the room gallery for the current location.
3. Confirm the gallery overlay, gallery button, and floating navigation bar are visible.
4. Tap the sidebar toggle to expand the sidebar.
5. Confirm the room gallery remains visible.
6. Confirm the gallery button remains visible.
7. Confirm the floating navigation bar remains visible.

**Expected outcome**: On desktop, opening the sidebar does not hide any surface (FR-005, SC-005).

### Scenario 5: Rapid open/close toggling on mobile

**Prerequisites**: Dev server running; mobile viewport

**Steps**:
1. Open the tour on a narrow mobile viewport.
2. Rapidly toggle the sidebar open and closed 3–4 times.
3. Confirm the gallery, gallery button, and floating nav visibility toggles consistently with each sidebar state change (hidden when open, visible when closed).
4. Confirm no surface gets stuck hidden after the sidebar is closed.

**Expected outcome**: Visibility toggles reliably without flickering or getting stuck (edge case: rapid toggling).

### Scenario 6: Keyboard Escape closes sidebar and restores surfaces on mobile

**Prerequisites**: Dev server running; mobile viewport

**Steps**:
1. Open the tour on a narrow mobile viewport.
2. Expand the sidebar (gallery, gallery button, and floating nav hidden).
3. Press the Escape key.
4. Confirm the sidebar closes.
5. Confirm the gallery, gallery button, and floating nav reappear.

**Expected outcome**: Keyboard-driven sidebar close restores all surfaces (edge case: keyboard navigation).

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

# Lint frontend
npm run lint
```

## Expected Outcomes Summary

| SC ID | Criterion | Validation Scenario |
|-------|-----------|---------------------|
| SC-001 | 100% of sidebar open actions on mobile hide the room gallery | Scenario 1 |
| SC-002 | 100% of sidebar open actions on mobile hide the gallery button | Scenario 2b |
| SC-003 | 100% of sidebar open actions on mobile hide the floating nav | Scenario 2 |
| SC-004 | 100% of sidebar close actions on mobile restore all surfaces | Scenario 3 |
| SC-005 | On desktop, 100% of sidebar open actions leave all surfaces visible | Scenario 4 |
| SC-006 | No gallery/gallery button/floating nav content visible through sidebar tint on mobile | Scenarios 1, 2b, 2 |
| FR-001 | Mobile sidebar open → gallery hidden | Scenario 1 |
| FR-002 | Mobile sidebar open → gallery button hidden | Scenario 2b |
| FR-003 | Mobile sidebar open → floating nav hidden | Scenario 2 |
| FR-004 | Mobile sidebar close → all reappear | Scenario 3 |
| FR-005 | Desktop sidebar open → all remain visible | Scenario 4 |
| FR-006 | No gallery/gallery button/floating nav visible through tinted background while sidebar open on mobile | Scenarios 1, 2b, 2 |

## References

- Feature specification: `specs/015-hide-gallery-nav-mobile/spec.md`
- Implementation plan: `specs/015-hide-gallery-nav-mobile/plan.md`
- Research decisions: `specs/015-hide-gallery-nav-mobile/research.md`
- Data model: `specs/015-hide-gallery-nav-mobile/data-model.md`
- Tailwind custom variants: `apps/frontend/src/index.css` (compact, narrow, tiny)
- Viewport utility: `apps/frontend/src/lib/viewport.js` (`isCompactViewport()`)
