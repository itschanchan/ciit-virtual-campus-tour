# Quickstart: Validate the Responsive Floor Directory Modal with Zoom

**Feature**: `027-maps-modal-zoom`
**Date**: 2026-11-15

## Purpose

Runnable validation scenarios that prove the floor directory modal added to the maps button fits desktop, tablet, and mobile viewports without scrolling and supports scroll-to-zoom on desktop and pinch-to-zoom on touch screens. This is a validation/run guide; implementation details belong in `tasks.md`.

## Prerequisites

- Node.js LTS (via nvm) and npm installed.
- Repository dependencies installed at the workspace root (`npm install`).
- `MONGODB_URI`, `MONGODB_NAME`, and a non-empty `JWT_SECRET` are present in `apps/backend/.env` (backend only; not required for frontend validation).

## Setup Commands

```bash
# From the repo root
npm install
```

## Run Commands

```bash
# Frontend unit tests
npm --prefix apps/frontend run test

# Frontend lint
npm --prefix apps/frontend run lint

# Frontend build
npm --prefix apps/frontend run build
```

## Expected Outcomes

| Validation | Expected result |
|:---|:---|
| All frontend tests pass | `npm --prefix apps/frontend run test` exits 0 |
| Frontend lint passes | `npm --prefix apps/frontend run lint` exits 0 |
| Frontend build passes | `npm --prefix apps/frontend run build` exits 0 |

## Manual Validation Scenarios

Run the frontend dev server (`npm --prefix apps/frontend run dev`) and open the tour in a browser. Use browser device emulation for viewport sizes.

### Scenario 1 — Floor directory modal opens on mobile and fits without scrolling

1. Open the tour at a mobile viewport (about 320–480 CSS pixels).
2. Activate the Map button in the floating menu.
3. Confirm the floor directory modal opens and shows the directory image with its alt text.
4. Confirm the image and close button are all visible without any vertical or horizontal scrolling.
5. Close via the close button, backdrop click, and `Escape`; confirm the modal dismisses each time and focus returns to the Map button.

### Scenario 2 — Floor directory modal fits on tablet and desktop without scrolling

1. Open the tour at a tablet viewport (about 768 CSS pixels), then a desktop viewport (about 1024+ CSS pixels).
2. Open the modal and confirm the image and close button fit without scrolling at each size.
3. Close the modal via the close button and confirm focus returns to the Map button.

### Scenario 3 — Scroll-to-zoom on desktop

1. Open the tour at a desktop viewport.
2. Open the floor directory modal and confirm the image starts at fit-to-viewport.
3. Scroll the wheel upward over the image; confirm the image zooms in and the page behind does not scroll.
4. Scroll the wheel downward; confirm the image zooms back out toward fit-to-viewport.
5. Confirm the zoom level is clamped (cannot zoom out below fit, cannot zoom beyond a readable maximum).
6. Close and reopen the modal; confirm the zoom resets to fit-to-viewport.

### Scenario 4 — Pinch-to-zoom on touch screens

1. Open the tour at a mobile or tablet viewport with touch emulation enabled.
2. Open the floor directory modal.
3. Perform a two-finger pinch-spread; confirm the image zooms in and the page does not scroll.
4. Perform a two-finger pinch-in; confirm the image zooms out toward fit-to-viewport.
5. Confirm the zoom level is clamped at both min and max.

### Scenario 5 — Orientation change with the modal open

1. Open the modal on a mobile viewport in portrait and confirm all content fits without scrolling.
2. Rotate to landscape and confirm the content still fits without scrolling.
3. Rotate back to portrait and confirm the content still fits without scrolling.
4. Confirm the zoom level remains within the clamped range after rotation.

### Scenario 6 — Close button reachable at all zoom levels

1. Open the modal on a mobile viewport.
2. Zoom in to the maximum level.
3. Confirm the close button is still visible and reachable without scrolling.
4. Close the modal and confirm focus returns to the Map button.

### Scenario 7 — Image load failure fallback

1. Simulate the directory image failing to load (e.g., block the asset or use offline mode).
2. Open the modal; confirm an "Image unavailable" fallback is shown and the modal still closes correctly.

### Scenario 8 — Narration and gallery controls continue to work alongside the modal

1. With the floating menu visible, activate narration play/pause and mute/unmute; confirm they still work.
2. Open the gallery and confirm it still works independently of the floor directory modal.
3. Open the floor directory modal and confirm the gallery and narration are not disturbed.

## References

- Feature specification: [spec.md](./spec.md)
- Implementation plan: [plan.md](./plan.md)
- Research decisions: [research.md](./research.md)
- Data model: [data-model.md](./data-model.md)
- UI contract: [contracts/ui-contract.md](./contracts/ui-contract.md)
