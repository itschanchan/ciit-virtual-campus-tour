# Quickstart: Validate the Responsive ViewGallery Modal

**Feature**: `026-make-viewgallery-responsive`
**Date**: 2026-11-15

## Purpose

Runnable validation scenarios that prove the ViewGallery modal inside `FloatingMenu.jsx` fits desktop, tablet, and mobile viewports without scrolling. This is a validation/run guide; implementation details belong in `tasks.md`.

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

### Scenario 1 — Gallery fits on a mobile viewport without scrolling

1. Open the tour at a mobile viewport (about 320–480 CSS pixels).
2. Select a location that has gallery images and activate the "View gallery" trigger.
3. Confirm the gallery modal opens and shows the first image with its caption.
4. Confirm the image, caption, position counter, previous/next arrows, and close button are all visible without any vertical or horizontal scrolling.
5. Navigate through all images with previous/next and confirm each image and its caption continue to fit without scrolling.
6. Close via the close button, backdrop click, and `Escape`; confirm the modal dismisses each time.

### Scenario 2 — Gallery fits on a tablet viewport without scrolling

1. Open the tour at a tablet viewport (about 768 CSS pixels).
2. Open the gallery and confirm image, caption, counter, arrows, and close button all fit without scrolling.
3. Navigate through images and confirm no scrolling is triggered.

### Scenario 3 — Gallery fits on a desktop viewport without scrolling

1. Open the tour at a desktop viewport (about 1024+ CSS pixels).
2. Open the gallery and confirm all content fits within the viewport without scrolling.
3. Navigate through images and confirm no scrolling is triggered.

### Scenario 4 — Orientation change with the gallery open

1. Open the gallery on a mobile viewport in portrait and confirm all content fits without scrolling.
2. Rotate to landscape and confirm the content still fits without scrolling.
3. Rotate back to portrait and confirm the content still fits without scrolling.

### Scenario 5 — Long caption on a narrow viewport

1. Select a location whose active image has a long caption.
2. Open the gallery on a mobile viewport and confirm the full caption is visible without scrolling.

### Scenario 6 — Single image (no arrows) fits without scrolling

1. Select a location with exactly one gallery image.
2. Open the gallery on a mobile viewport and confirm the image, caption, counter, and close button fit without scrolling and no previous/next arrows show.

### Scenario 7 — Empty gallery state fits without scrolling

1. Select a location with no gallery images.
2. Open the gallery on a mobile viewport and confirm the empty-state message fits without scrolling.

### Scenario 8 — Narration controls continue to work alongside the gallery

1. With the floating menu visible, activate play and confirm narration starts.
2. Activate mute/unmute and open the transcript; confirm all narration controls still work with the responsive gallery open.

## References

- Feature specification: [spec.md](./spec.md)
- Data model: [data-model.md](./data-model.md)
- UI contract: [contracts/ui-contract.md](./contracts/ui-contract.md)
- Implementation plan: [plan.md](./plan.md)
