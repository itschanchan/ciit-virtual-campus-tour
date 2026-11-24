# Implementation Plan: Migrate Room Gallery to Floating Menu

**Branch**: `024-migrate-room-gallery` | **Date**: 2026-11-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/024-migrate-room-gallery/spec.md`

## Summary

Consolidate the room gallery into `FloatingMenu.jsx` so one on-screen surface hosts both narration playback controls and room-image browsing. Move the gallery open/close state, image selection, and floor-image lookup logic out of `Panorama.jsx` into `FloatingMenu.jsx`, then remove `RoomGallery.jsx` entirely. `Panorama.jsx` no longer imports or renders `RoomGallery`; it renders `FloatingMenu` with the gallery data and control callbacks instead. All existing gallery behaviors (Escape/backdrop close, arrow-key wrap-around navigation, position indicator, focus return) and all narration controls (play/pause, mute, transcript, map) are preserved. The change is frontend-only, introduces no runtime dependency, and works on desktop and mobile viewports.

## Technical Context

**Language/Version**: JavaScript with ES Modules and JSX. React `^19.2.8` (installed 19.3.0) and Vite `^8.3.0` (installed 8.3.5). No TypeScript in the frontend.

**Primary Dependencies**: React, React DOM, Tailwind CSS 4, existing MUI packages (`@mui/icons-material`, `@mui/material`), and Marzipano. This feature introduces no new package and changes none of the existing dependency set.

**Storage**: Static tour content in `apps/frontend/src/lib/catalog.json`. Per-floor image assets are lazy-loaded via `import.meta.glob` under `apps/frontend/src/assets/gallery/` through `apps/frontend/src/lib/floorGallery.js`. No database or API involvement.

**Testing**: Vitest 5 with Testing Library and jsdom. Configuration is `apps/frontend/vitest.config.js`; setup is `apps/frontend/src/tests/setup.js`. Baseline verified during planning: 8 test files pass, including `RoomGallery.test.jsx` and `FloatingMenu.test.jsx`.

**Target Platform**: Modern desktop, tablet, and mobile browsers supported by the Vite application, from 320 CSS pixels through desktop widths.

**Project Type**: Web application with separate `apps/frontend` and `apps/backend`. This feature is frontend-only.

**Performance Goals**: No new loading budget. Consolidating existing component logic does not add assets or change how gallery images (one at a time) or narration audio are loaded.

**Constraints**: No backend changes, no new runtime dependencies, no catalog or schema changes, no second Gallery experience, and no change to panorama, sidebar, location-selection, or narration behavior beyond the consolidation. Mobile support is required per Constitution Principle V.

**Scale/Scope**: Three frontend source files change (`Panorama.jsx`, `FloatingMenu.jsx`, `RoomGallery.jsx` removed), plus their two test files updated. The gallery serves all accessible tour locations with their existing floor-image data.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Evidence |
|:---|:---|:---|:---|
| I. MERN Stack Alignment | React + Vite + JavaScript ES Modules; Vitest testing; no alternative stack | PASS | Changes stay within the React frontend; Vitest remains the test framework; no backend, model, service, or route change |
| II. MVC Separation and Application Boundaries | Frontend owns UI, galleries, narration controls, and static assets; no backend involvement | PASS | All changes are under `apps/frontend/src/components/` and `apps/frontend/src/pages/`; no backend change |
| III. Test-First Quality Gate | Tests written and observed failing before implementation; gallery/narration behavior covered | PASS | `RoomGallery.test.jsx` and `FloatingMenu.test.jsx` already cover the consolidated behaviors; the plan updates these tests before implementation and keeps them passing |
| IV. Security, Secrets, and Configuration Discipline | No secrets or environment changes | PASS | No credentials, `.env` files, or configuration changes |
| V. Responsive, Accessible Immersive Experience | Works on desktop and mobile; accessible controls; meaningful alternative text; keyboard operable; lazy/deferred media | PASS | Existing accessible names, visible focus, keyboard shortcuts ("p", "m"), and mobile hide behavior are retained; gallery and narration content keep alt text and captions |
| Technology & Dependency Constraints | Approved stack only; new dependencies need approval | PASS | No dependency is added or changed |
| Development Workflow & Quality Gates | Specification, plan, tasks, implementation; tests and lint pass | PASS | This plan continues the Spec Kit sequence; automated tests, lint, and build remain required |

No constitution violation requires a complexity exception. No complexity tracking entries are needed.

## Project Structure

### Documentation (this feature)

```text
specs/024-migrate-room-gallery/
├── plan.md              # This file
├── research.md          # Phase 0 decisions and alternatives
├── data-model.md        # Gallery session state and control surface contract
├── quickstart.md        # End-to-end validation guide
├── contracts/
│   └── ui-contract.md   # Floating menu public surface, aria labels, keyboard shortcuts
├── checklists/
│   └── requirements.md  # Specification quality checklist
├── spec.md              # Feature specification
└── tasks.md             # Created later by /speckit.tasks
```

### Source Code (repository root)

```text
apps/frontend/
├── src/
│   ├── components/
│   │   ├── FloatingMenu.jsx   # Updated: hosts narration controls + room gallery
│   │   └── RoomGallery.jsx    # Removed: gallery logic merged into FloatingMenu.jsx
│   ├── pages/
│   │   └── Panorama.jsx       # Updated: no longer imports/ renders RoomGallery
│   ├── lib/
│   │   ├── catalog.json       # Unchanged: location gallery data source
│   │   └── floorGallery.js    # Unchanged: per-floor image lookup
│   └── tests/
│       ├── FloatingMenu.test.jsx   # Updated: adds gallery behavior coverage
│       └── RoomGallery.test.jsx    # Removed (or folded into FloatingMenu.test.jsx)
├── public/
│   └── panoramas/             # Unchanged: narration audio assets
```

**Structure Decision**: Retain the existing web-application layout. Gallery content stays in `catalog.json` and per-floor assets under `assets/gallery/`, matching the project's documented content and asset conventions. The consolidation lives in `FloatingMenu.jsx`; `RoomGallery.jsx` is deleted; `Panorama.jsx` is simplified to delegate gallery rendering to `FloatingMenu`. No new component, hook, service, or state container is introduced.

## Current Implementation Findings

- `Panorama.jsx` (lines 11-24) imports `RoomGallery` and destructures `galleryOpen`, `setGalleryOpen`, `currentLocation`, etc. from the tour context.
- `Panorama.jsx` (lines 27-34) resolves `floorGalleryImages` via `getFloorGalleryImages(currentFloor, currentLocation?.name)` and falls back to `currentLocation.gallery`.
- `Panorama.jsx` (lines 35-37) defines `closeGallery` as `setGalleryOpen(false)`.
- `Panorama.jsx` (lines 154-165) renders the "View gallery" trigger button wired to `toggleGallery`, gated on `contentStatus === "ready"` and not `(sidebarOpen && isCompactViewport())`.
- `Panorama.jsx` (lines 171-178) renders `<RoomGallery images={galleryImages} open={galleryOpen} onClose={closeGallery} sidebarOpen={sidebarOpen} floorLabel={currentFloor ?? ""} />`.
- `RoomGallery.jsx` holds all gallery logic: image sorting by `order`, active-index state, Escape/ArrowLeft/ArrowRight keydown handling, previous/next buttons, position counter, caption rendering, empty state, image load-failure fallback, focus management on open/close, and mobile-hide when `sidebarOpen && isCompactViewport()`.
- `FloatingMenu.jsx` holds all narration logic: play/pause with a 600ms click guard, mute/unmute with the same guard, audio visualization CSS, transcript display, error/blocked states, keyboard shortcuts ("p", "m"), accessible names/labels, and mobile-hide when `sidebarOpen && isCompactViewport()`.
- Both components already share the identical `sidebarOpen && isCompactViewport()` hide rule, so consolidating them does not conflict on mobile behavior.
- Existing test coverage: `RoomGallery.test.jsx` (22 tests) covers dialog rendering, navigation, wrap-around, arrow keys, single-image hiding, empty state, ordering, close behaviors, focus restoration, and image-load fallback. `FloatingMenu.test.jsx` (17 tests) covers narration controls, visualization, transcript, accessible names, keyboard shortcuts, and mobile viewport behavior.

## Proposed Changes

### 1. Consolidate gallery state and rendering into `FloatingMenu.jsx`

Add gallery props and state to `FloatingMenu.jsx`:
- `images` (array of `{src, alt, caption, order}`), `open` (gallery open/close), `onClose` (gallery close), `sidebarOpen`, `floorLabel`.
- Internal `currentIndex` state, sorted-images memo, active image, image count, previous/next handlers, Escape/arrow-key keydown effect, focus management, and the mobile-hide rule (all moved from `RoomGallery.jsx`).
- Render the existing gallery modal UI (backdrop, dialog section, image, previous/next buttons, caption, position counter, close button, empty state) inside `FloatingMenu.jsx`, alongside the existing narration controls.

### 2. Simplify `Panorama.jsx`

- Remove the `RoomGallery` import.
- Remove `floorGalleryImages` / `galleryImages` resolution (or keep it if needed to pass images to `FloatingMenu`; the cleanest option is to pass the resolved gallery images as a prop).
- Remove `closeGallery` callback definition.
- Replace the `<RoomGallery ... />` render with `<FloatingMenu ... images={galleryImages} open={galleryOpen} onClose={closeGallery} sidebarOpen={sidebarOpen} floorLabel={currentFloor ?? ""} ... />`, passing the existing narration props unchanged.
- Keep the existing "View gallery" trigger button unchanged.

### 3. Remove `RoomGallery.jsx`

- Delete `apps/frontend/src/components/RoomGallery.jsx`.
- Remove its import from `Panorama.jsx`.
- Remove/replace `RoomGallery.test.jsx`: fold its gallery-behavior coverage into `FloatingMenu.test.jsx` so no test references the deleted component.

### 4. Tests

- `FloatingMenu.test.jsx`: extend existing narration tests with gallery tests (dialog open/close, image navigation with previous/next and arrow keys, wrap-around, position counter, caption, empty state, image-load fallback, focus restoration, close button/backdrop/Escape, mobile hide). These verify FR-005, FR-006, FR-008, FR-009, FR-010.
- Keep all existing `FloatingMenu.test.jsx` narration tests passing (FR-007, FR-008).
- Existing `Panorama` behavior (trigger button, context wiring) remains covered by `Layout.test.jsx` and `TourContext.test.jsx`.

### 5. Files to modify

| File | Change | Reason |
|:---|:---|:---|
| `apps/frontend/src/components/FloatingMenu.jsx` | Update | Add gallery state, rendering, and handlers merged from RoomGallery |
| `apps/frontend/src/components/RoomGallery.jsx` | Remove | Gallery logic consolidated into FloatingMenu; FR-001/FR-003 |
| `apps/frontend/src/pages/Panorama.jsx` | Update | Stop importing/rendering RoomGallery; delegate to FloatingMenu |
| `apps/frontend/src/tests/FloatingMenu.test.jsx` | Update | Add consolidated gallery + narration behavior coverage |
| `apps/frontend/src/tests/RoomGallery.test.jsx` | Remove | Component deleted; coverage folded into FloatingMenu test |
| `apps/backend/**` | No change | Frontend-only feature |

## Testing Strategy

### Automated

```bash
npm --prefix apps/frontend run test
npm run lint
npm run build
```

Expected results:
- All existing test files keep passing, including the narration tests in `FloatingMenu.test.jsx`.
- New/updated `FloatingMenu.test.jsx` gallery tests cover open/close, navigation, wrap-around, arrow keys, counter, captions, empty state, focus restoration, and image-load fallback.
- No test imports or references `RoomGallery` after the change.
- Lint and build succeed.

### Manual

Use `quickstart.md` for the full matrix. At minimum:
- Open the gallery from the floating menu on a location with images and confirm room images with captions display.
- Use previous/next and ArrowLeft/ArrowRight through all images and confirm wrap-around at both ends.
- Confirm the position counter matches the active image after every change.
- Close via the close button, backdrop click, and Escape; confirm focus returns appropriately.
- Open the gallery on a narrow mobile viewport with the sidebar open; confirm the gallery hides.
- Confirm narration play/pause, mute, transcript, and map controls still work alongside the gallery.
- Spot-check desktop, tablet, and 320px-wide phone layouts.

## Risks and Dependencies

| Risk | Impact | Mitigation |
|:---|:---|:---|
| Gallery state collides with narration state in one component | Unexpected re-renders or state resets | Keep gallery and narration state separate within `FloatingMenu`; use distinct state keys and effects |
| Losing gallery test coverage when removing RoomGallery.test.jsx | Regression in navigation/close/focus behavior | Fold all RoomGallery tests into FloatingMenu.test.jsx before deleting the component |
| Mobile hide rule duplicated inconsistently | Gallery or narration shows when it should hide on compact viewport | Apply the single shared `sidebarOpen && isCompactViewport()` rule in one place in FloatingMenu |
| Focus management breaks after consolidation | Focus not restored on close | Carry over the existing RoomGallery focus logic (previousFocusRef, tour-main fallback) unchanged |
| Props passed from Panorama mismatch FloatingMenu expectations | Gallery fails to render or update when location changes | Pass `images`, `open`, `onClose`, `sidebarOpen`, `floorLabel` explicitly and key the menu on `currentLocation.id` |

No backend dependency, API change, storage migration, or new runtime package is introduced.

## Implementation Phases

1. **Update FloatingMenu.jsx**: Add gallery props, state, sorted-images memo, previous/next handlers, keydown effect, focus management, mobile-hide rule, and gallery modal UI; keep narration controls intact.
2. **Update Panorama.jsx**: Remove RoomGallery import and closeGallery; render FloatingMenu with gallery props; keep the "View gallery" trigger.
3. **Remove RoomGallery.jsx**: Delete the component file and its test.
4. **Update FloatingMenu.test.jsx**: Add consolidated gallery behavior coverage; remove any RoomGallery references.
5. **Verification**: Run the frontend test suite, lint, and build. Manually validate gallery + narration behavior at representative viewports.

## Post-Design Constitution Re-Check

After generating `research.md`, `data-model.md`, `contracts/ui-contract.md`, and `quickstart.md`, the design still satisfies the constitution:

- **Stack and boundaries**: All changes stay in the React frontend, with static content and assets unchanged. No backend, model, service, or route change.
- **Test-first**: The consolidated `FloatingMenu.test.jsx` covers the spec's core success criteria (SC-001–SC-008) before implementation.
- **Accessibility and responsiveness**: Existing accessible names, visible focus, keyboard shortcuts ("p", "m"), alternative text, captions, and the mobile hide rule are retained.
- **Dependency discipline**: No dependency changes.
- **Complexity**: No new component, hook, or abstraction is needed. The change merges two existing components into one surface and deletes the redundant one.
