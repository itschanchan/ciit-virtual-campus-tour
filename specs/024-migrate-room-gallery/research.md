# Research: Migrate Room Gallery to Floating Menu

**Feature**: `024-migrate-room-gallery`
**Date**: 2026-11-15

## Purpose

Resolve the implementation choices for consolidating the room gallery into `FloatingMenu.jsx` and moving its logic out of `Panorama.jsx`. The specification has no unresolved clarifications; this document records decisions and rejected alternatives for the migration.

## Findings Summary

- `apps/frontend/src/components/RoomGallery.jsx` holds all gallery logic: image sorting by `order`, active-index state, Escape/ArrowLeft/ArrowRight keydown handling, previous/next buttons, position counter, caption rendering, empty state, image-load-failure fallback, focus management on open/close, and the mobile-hide rule (`sidebarOpen && isCompactViewport()`).
- `apps/frontend/src/components/FloatingMenu.jsx` holds all narration logic: play/pause with a 600ms click guard, mute/unmute, audio-visualization CSS, transcript display, error/blocked states, keyboard shortcuts ("p", "m"), accessible names/labels, and the same mobile-hide rule.
- `apps/frontend/src/pages/Panorama.jsx` imports `RoomGallery`, resolves gallery images via `getFloorGalleryImages` / `catalog.json`, defines `closeGallery`, renders the "View gallery" trigger, and renders `<RoomGallery ... />`.
- Both components already share the identical `sidebarOpen && isCompactViewport()` hide rule, so consolidating them does not conflict on mobile behavior.
- Existing test coverage: `RoomGallery.test.jsx` (22 tests) and `FloatingMenu.test.jsx` (17 tests). Baseline: `npm --prefix apps/frontend run test` passes.

## Decision 1: Where the consolidated gallery logic lives

**Decision**: Move all gallery state and rendering into `FloatingMenu.jsx` and delete `RoomGallery.jsx`. `FloatingMenu.jsx` becomes the single surface hosting narration controls and the room gallery.

**Rationale**:
- The user request explicitly names `FloatingMenu.jsx` as the destination and requires `RoomGallery.jsx` to no longer exist (FR-001, FR-003).
- `FloatingMenu.jsx` is already the persistent on-screen control surface and already shares the mobile-hide rule with `RoomGallery.jsx`, so it is a natural host.
- Keeping a separate `RoomGallery.jsx` would leave the feature incomplete (the component must be removed).
- The gallery and narration concerns are independent within the component; each keeps its own state and effects to avoid cross-coupling.

**Alternatives considered**:
- *Keep `RoomGallery.jsx` as a thin wrapper delegating to `FloatingMenu.jsx`.* Rejected because FR-001/FR-003 require `RoomGallery.jsx` to no longer exist and Panorama must not reference it.
- *Create a new shared hook (e.g., `useGallery`) used by both components.* Rejected as unnecessary abstraction for a consolidation that deletes one component entirely; adds indirection without removing any component.

## Decision 2: How `Panorama.jsx` passes gallery data to `FloatingMenu.jsx`

**Decision**: `Panorama.jsx` keeps resolving the gallery images (floor lookup via `getFloorGalleryImages`, fallback to `currentLocation.gallery`) and passes them to `FloatingMenu.jsx` as an `images` prop, along with `open`, `onClose`, `sidebarOpen`, and `floorLabel`. `FloatingMenu.jsx` owns the gallery open/close state internally.

**Rationale**:
- Image resolution depends on `currentLocation` and `currentFloor`, which `Panorama.jsx` already computes; moving that logic into `FloatingMenu.jsx` would duplicate the location/floor context.
- The gallery open/close toggle (`galleryOpen` / `setGalleryOpen` from the tour context) is already available in `Panorama.jsx` and drives the "View gallery" trigger, so it stays there as the `open` prop.
- This keeps `FloatingMenu.jsx` a presentational controller for the gallery while `Panorama.jsx` remains the data/wiring layer, matching the existing MVC boundary (Constitution Principle II).

**Alternatives considered**:
- *Move image resolution entirely into `FloatingMenu.jsx`.* Rejected because `FloatingMenu.jsx` does not have access to `currentLocation`/`currentFloor` without new context plumbing, which would expand scope.
- *Keep gallery state in the tour context and share it between `Panorama.jsx` and `FloatingMenu.jsx`.* Rejected as unnecessary context expansion for a single-consumer feature.

## Decision 3: Whether to delete or retain `RoomGallery.jsx`

**Decision**: Delete `apps/frontend/src/components/RoomGallery.jsx` entirely, remove its import from `Panorama.jsx`, and remove `RoomGallery.test.jsx` (folding its coverage into `FloatingMenu.test.jsx`).

**Rationale**:
- FR-001 and SC-006 require zero references to `RoomGallery.jsx` to remain. Retaining it as a deprecated alias or re-export would violate the explicit "no longer exist" requirement.
- Folding tests into `FloatingMenu.test.jsx` preserves all gallery behavior coverage (navigation, wrap-around, arrow keys, counter, close behaviors, focus restoration, image-load fallback) under the consolidated component.

**Alternatives considered**:
- *Retain `RoomGallery.jsx` unused but present.* Rejected because SC-006 requires zero references and the spec requires the component to no longer exist.
- *Re-export gallery from `FloatingMenu.jsx` as `RoomGallery` for backwards compatibility.* Rejected because no external consumer imports `RoomGallery` other than `Panorama.jsx`, which is being updated; a re-export would leave a dangling reference.

## Decision 4: Focus management and mobile-hide behavior

**Decision**: Carry over the existing `RoomGallery.jsx` focus logic unchanged into `FloatingMenu.jsx` (previous focus reference, close-button autofocus on open, Escape/backdrop/close-button close, focus return to trigger or `tour-main` fallback). Keep the single shared `sidebarOpen && isCompactViewport()` mobile-hide rule.

**Rationale**:
- The focus management is already tested and correct in `RoomGallery.test.jsx`; moving it unchanged minimizes regression risk (FR-006).
- Both components already hide when `sidebarOpen && isCompactViewport()`; consolidating into one rule in `FloatingMenu.jsx` keeps mobile behavior consistent (FR-010).

**Alternatives considered**:
- *Redesign focus management to use a focus-trap library.* Rejected as a new dependency (FR-011) and unnecessary scope; the existing manual focus management is sufficient and tested.
- *Apply the mobile-hide rule separately to gallery and narration sections.* Rejected because both sections must hide together when the sidebar is open; a single rule on the component root is simpler and consistent with the existing behavior.

## Decision 5: Test strategy

**Decision**: Extend `FloatingMenu.test.jsx` to cover the consolidated gallery behaviors (open/close, image navigation via previous/next and ArrowLeft/ArrowRight, wrap-around, position counter, captions, empty state, image-load fallback, close via button/backdrop/Escape, focus restoration, mobile hide). Remove `RoomGallery.test.jsx`. Keep all existing narration tests passing.

**Rationale**:
- This keeps all 22 gallery behavior tests under the consolidated component, preserving coverage of FR-005, FR-006, FR-008, FR-009, FR-010.
- It satisfies FR-012 (existing tests continue to pass; consolidated behavior covered by automated tests).
- No new test infrastructure is needed; Vitest + Testing Library + jsdom are already configured.

**Alternatives considered**:
- *Keep `RoomGallery.test.jsx` and add a separate `FloatingMenu.test.jsx` gallery suite.* Rejected because `RoomGallery.jsx` is being deleted; its tests would reference a nonexistent component.
- *Only add integration tests through `Panorama.jsx`.* Rejected because component-level gallery tests provide faster, more targeted coverage of navigation and focus behavior.

## Known Pre-existing Issue

`npm run verify:content` may fail due to a missing content schema (`specs/001-campus-tour-foundation/contracts/content-schema.json`) unrelated to this feature. Verification for this feature relies on the frontend test suite, lint, build, and manual checks; the blocker is pre-existing and not in scope.
