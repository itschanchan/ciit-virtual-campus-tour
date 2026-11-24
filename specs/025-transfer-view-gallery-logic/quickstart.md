# Quickstart: Validate Transfer View Gallery Logic to Floating Menu

**Feature**: `025-transfer-view-gallery-logic`

## Purpose

Runnable validation scenarios that prove the View Gallery button in `FloatingMenu.jsx` opens and closes the room gallery through defined props, and that `Panorama.jsx` no longer manages gallery state. This is a validation/run guide; implementation details belong in `tasks.md` and the implementation phase.

## Prerequisites

- Repository cloned at `F:\web-projects\ciit-virtual-campus-tour`.
- Dependencies installed: `npm install` at root and `npm run setup` run (per `AGENTS.md`).
- Backend `.env` configured (`MONGODB_URI`, `MONGODB_NAME`, non-empty `JWT_SECRET`) if running the full dev server (not required for frontend-only validation).
- Current branch: `025-transfer-view-gallery-logic` (set by the Spec Kit flow).

## Setup Commands

```bash
# From repo root
npm install
npm run setup
# Copy backend environment if running backend
Copy-Item apps/backend/.env.example apps/backend/.env
# Fill in MONGODB_URI, MONGODB_NAME, and a non-empty JWT_SECRET in apps/backend/.env
```

## Test / Run Commands

```bash
# Frontend tests (Vitest)
npm --prefix apps/frontend run test

# Frontend lint
npm run lint

# Frontend build
npm run build

# Run both applications (dev)
npm run dev
```

## Validation Scenarios

Run these manually after implementation, using `quickstart.md` as the checklist. Each scenario lists prerequisites, steps, and expected outcome.

### Scenario 1 — View Gallery button opens the gallery

**Prerequisites**: A location with gallery images is displayed in the tour.

**Steps**:
1. Locate the View Gallery button in the floating menu (icon-only camera icon, inline in the single controls row).
2. Press the button.

**Expected outcome**: The room gallery overlay opens, showing that location's images with captions. The button's `aria-expanded` is `true`.

### Scenario 2 — View Gallery button closes the gallery

**Prerequisites**: The gallery is open.

**Steps**:
1. Press the gallery close control (× button), click the backdrop, or press Escape.

**Expected outcome**: The gallery overlay closes. Focus returns appropriately. The View Gallery button's `aria-expanded` is `false`.

### Scenario 3 — View Gallery button wiring has no undefined references

**Prerequisites**: Browser developer tools open.

**Steps**:
1. Press the View Gallery button.
2. Check the browser console.

**Expected outcome**: No errors related to undefined `galleryOpen` or `toggleGallery`. The button invokes the defined `onOpen` prop.

### Scenario 4 — Panorama no longer manages gallery state

**Prerequisites**: Source inspection.

**Steps**:
1. Open `apps/frontend/src/pages/Panorama.jsx`.

**Expected outcome**: `Panorama.jsx` does not destructure `galleryOpen` or `toggleGallery` from `useTour()`.

### Scenario 5 — Gallery works on mobile with sidebar open

**Prerequisites**: Narrow mobile viewport (~320px) with the sidebar open.

**Steps**:
1. Open the gallery.

**Expected outcome**: The floating menu (gallery + narration) hides; the sidebar remains the sole focus. This reuses the existing `sidebarOpen && isCompactViewport()` rule.

### Scenario 6 — Narration controls still work alongside the gallery

**Prerequisites**: Gallery open or closed.

**Steps**:
1. Press narration play/pause, mute, transcript, and map controls.

**Expected outcome**: All narration controls operate correctly with visible focus states and accessible names (keyboard shortcuts `p`, `m` retained).

### Scenario 7 — All buttons display in a single horizontal row

**Prerequisites**: Tour loaded at desktop, tablet (~768px), and mobile (~320px) viewports.

**Steps**:
1. Observe the floating menu controls row.
2. Confirm play/pause, mute, transcript, map, and View Gallery buttons all sit in one horizontal `flex` row.
3. Confirm the View Gallery button uses the `PhotoCameraIcon` icon with no visible text.
4. Confirm no button uses absolute positioning that would place it off-row.

**Expected outcome**: All buttons display in a single horizontal row at every viewport; the View Gallery button is icon-only and aligned with the narration controls.

## Expected Outcomes (Definition of Done)

- All frontend tests pass: `npm --prefix apps/frontend run test`.
- Frontend lint passes: `npm run lint`.
- Frontend build passes: `npm run build`.
- No test or source references undefined `galleryOpen`/`toggleGallery` in `FloatingMenu.jsx`.
- `Panorama.jsx` no longer destructures `galleryOpen`/`toggleGallery`.
- Manual scenarios 1–7 pass at desktop, tablet, and mobile viewports; all buttons (play/pause, mute, transcript, map, View Gallery) display in a single horizontal row.

## References

- Feature spec: [spec.md](./spec.md)
- UI contract: [contracts/ui-contract.md](./contracts/ui-contract.md)
- Data model: [data-model.md](./data-model.md)
- Research decisions: [research.md](./research.md)
