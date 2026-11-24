# Quickstart: Validate the Migrated Floating Menu

**Feature**: `024-migrate-room-gallery`
**Date**: 2026-11-15

## Purpose

Runnable validation scenarios that prove the room gallery has been consolidated into `FloatingMenu.jsx` and that `RoomGallery.jsx` no longer exists. This is a validation/run guide; implementation details belong in `tasks.md`.

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
| No `RoomGallery.jsx` reference remains | `grep -r "RoomGallery" apps/frontend` returns nothing |
| `FloatingMenu.jsx` exists | `apps/frontend/src/components/FloatingMenu.jsx` is present |
| `Panorama.jsx` no longer imports `RoomGallery` | `grep "RoomGallery" apps/frontend/src/pages/Panorama.jsx` returns nothing |

## Manual Validation Scenarios

Run the frontend dev server (`npm --prefix apps/frontend run dev`) and open the tour in a browser.

### Scenario 1 — Open and browse the room gallery from the floating menu

1. Open the tour and select a location that has gallery images.
2. Activate the "View gallery" trigger.
3. Confirm the floating menu gallery modal opens and shows the first image with its caption.
4. Confirm the position counter shows `1 / N`.
5. Activate the "Next image" button (or right arrow) repeatedly and confirm each image displays and the counter advances.
6. Confirm navigation wraps from the last image back to the first.
7. Activate the "Previous image" button (or left arrow) and confirm backward navigation wraps from the first image to the last.
8. Close the gallery via the close button, then via the backdrop, then via `Escape`; confirm the modal dismisses each time and focus returns appropriately.

### Scenario 2 — Narration controls continue to work alongside the gallery

1. With the floating menu visible, activate play and confirm narration starts and the button indicates pause.
2. Activate mute and confirm narration continues without audio; activate unmute and confirm audio returns.
3. Open the transcript and confirm the narration text displays.
4. Confirm the audio visualization shows while narration is playing.

### Scenario 3 — Keyboard operability

1. Tab to each floating menu control and confirm a visible focus state and an accessible name.
2. With the play button focused, press `p` and confirm narration toggles play/pause.
3. With the mute button focused, press `m` and confirm mute toggles.
4. With the gallery open, press `ArrowRight` and `ArrowLeft` and confirm image navigation.

### Scenario 4 — Mobile behavior

1. Open the tour at a narrow mobile viewport (about 320–480 CSS pixels).
2. Open the sidebar and confirm the floating menu (gallery and narration) does not render while the sidebar is open.
3. Close the sidebar and confirm the floating menu reappears and is usable.

### Scenario 5 — Edge cases

1. Select a location with no gallery images and open the gallery; confirm the empty-state message shows.
2. Change location while the gallery is open; confirm the gallery closes and remounts with the new location's images.
3. Open the gallery on a narrow mobile viewport with the sidebar open; confirm the gallery stays hidden.

## References

- Feature specification: [spec.md](./spec.md)
- Data model: [data-model.md](./data-model.md)
- UI contract: [contracts/ui-contract.md](./contracts/ui-contract.md)
- Implementation plan: [plan.md](./plan.md)
