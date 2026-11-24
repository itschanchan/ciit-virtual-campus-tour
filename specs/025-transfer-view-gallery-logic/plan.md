# Implementation Plan: Transfer View Gallery Logic to Floating Menu

**Branch**: `025-transfer-view-gallery-logic` | **Date**: 2026-11-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/025-transfer-view-gallery-logic/spec.md`

## Summary

Wire up the View Gallery button already placed inside `FloatingMenu.jsx` so it is connected to defined controls instead of undefined `galleryOpen`/`toggleGallery` variables, and place all floating menu buttons in a single horizontal row. Layout continues to own the gallery open/close state via TourContext and passes it to `FloatingMenu` as props (`open`, `onClose`, plus an open handler). The View Gallery button is icon-only (`PhotoCameraIcon`) and sits inline with the narration controls (play/pause, mute, transcript, map) in one `flex` row. `Panorama.jsx` stops destructuring the unused `galleryOpen` and `toggleGallery` from the tour context. All existing gallery behaviors (Escape/backdrop close, arrow-key wrap-around navigation, position indicator, focus return) and all narration controls (play/pause, mute, transcript, map) are preserved. The change is frontend-only, introduces no runtime dependency, and works on desktop and mobile viewports.

## Technical Context

**Language/Version**: JavaScript with ES Modules and JSX. React `^19.2.8` and Vite `^8.3.0`. No TypeScript in the frontend.

**Primary Dependencies**: React, React DOM, Tailwind CSS 4, existing MUI packages (`@mui/icons-material`). This feature introduces no new package and changes none of the existing dependency set.

**Storage**: Static tour content in `apps/frontend/src/lib/catalog.json`. Per-floor image assets under `apps/frontend/src/assets/gallery/` via `apps/frontend/src/lib/floorGallery.js`. No database or API involvement.

**Testing**: Vitest 5 with Testing Library and jsdom. Configuration is `apps/frontend/vitest.config.js`; setup is `apps/frontend/src/tests/setup.js`. Baseline verified during planning: frontend test files pass, including `FloatingMenu.test.jsx`.

**Target Platform**: Modern desktop, tablet, and mobile browsers supported by the Vite application, from 320 CSS pixels through desktop widths.

**Project Type**: Web application with separate `apps/frontend` and `apps/backend`. This feature is frontend-only.

**Performance Goals**: No new loading budget. Transferring existing toggle logic into `FloatingMenu` does not add assets or change how gallery images or narration audio are loaded.

**Constraints**: No backend changes, no new runtime dependencies, no catalog or schema changes, no change to panorama, sidebar, location-selection, or narration behavior beyond wiring the View Gallery button toggle. Mobile support is required per Constitution Principle V.

**Scale/Scope**: Three frontend source files change (`Layout.jsx`, `FloatingMenu.jsx`, `Panorama.jsx`), plus the `FloatingMenu.test.jsx` test file updated. The gallery serves all accessible tour locations with their existing floor-image data.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Evidence |
|:---|:---|:---|:---|
| I. MERN Stack Alignment | React + Vite + JavaScript ES Modules; Vitest testing; no alternative stack | PASS | Changes stay within the React frontend; Vitest remains the test framework; no backend, model, service, or route change |
| II. MVC Separation and Application Boundaries | Frontend owns UI, galleries, narration controls, and static assets; no backend involvement | PASS | All changes are under `apps/frontend/src/components/` and `apps/frontend/src/pages/` and `apps/frontend/src/context/` wiring; no backend change |
| III. Test-First Quality Gate | Tests written and observed failing before implementation; gallery/narration behavior covered | PASS | `FloatingMenu.test.jsx` already covers narration and gallery behaviors; the plan updates this test before implementation and keeps it passing |
| IV. Security, Secrets, and Configuration Discipline | No secrets or environment changes | PASS | No credentials, `.env` files, or configuration changes |
| V. Responsive, Accessible Immersive Experience | Works on desktop and mobile; accessible controls; meaningful alternative text; keyboard operable; lazy/deferred media | PASS | Existing accessible names, visible focus, keyboard shortcuts ("p", "m"), and mobile hide behavior are retained; the View Gallery button keeps its accessible name and `aria-expanded`/`aria-controls`, is icon-only (`PhotoCameraIcon`), and all buttons display in a single responsive row |
| Technology & Dependency Constraints | Approved stack only; new dependencies need approval | PASS | No dependency is added or changed |
| Development Workflow & Quality Gates | Specification, plan, tasks, implementation; tests and lint pass | PASS | This plan continues the Spec Kit sequence; automated tests, lint, and build remain required |

No constitution violation requires a complexity exception. No complexity tracking entries are needed.

## Project Structure

### Documentation (this feature)

```text
specs/025-transfer-view-gallery-logic/
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
│   │   ├── FloatingMenu.jsx   # Updated: View Gallery button icon-only and inline in single row with narration controls; wired to defined props
│   │   └── Layout.jsx         # Updated: passes open/close gallery props to FloatingMenu
│   ├── pages/
│   │   └── Panorama.jsx       # Updated: no longer destructures galleryOpen/toggleGallery
│   ├── context/
│   │   └── TourContext.jsx    # Unchanged: already owns galleryOpen and toggleGallery
│   └── tests/
│       └── FloatingMenu.test.jsx   # Updated: adds View Gallery button wiring coverage
├── public/
│   └── panoramas/             # Unchanged: narration audio assets
```

**Structure Decision**: Retain the existing web-application layout. No new component, hook, service, or state container is introduced. The gallery open/close state stays owned by Layout via TourContext; `FloatingMenu` receives it as props. `Panorama.jsx` is simplified by removing the unused `galleryOpen`/`toggleGallery` destructuring.

## Current Implementation Findings

- `FloatingMenu.jsx` already contains the View Gallery button UI, but it previously referenced `galleryOpen` and `toggleGallery` which were undefined in its component scope (lines 435 `aria-expanded={galleryOpen}`, 438 `onClick={toggleGallery}`). These have been replaced with `aria-expanded={open}` and `onClick={onOpen}`.
- `FloatingMenu.jsx` already receives `open` (gallery open state) and `onClose` props from `Layout.jsx`, plus gallery images, `sidebarOpen`, and `floorLabel`. Layout now also passes an `onOpen` handler.
- `FloatingMenu.jsx` now imports `PhotoCameraIcon` from `@mui/icons-material`; the View Gallery button is icon-only and rendered inline inside the existing `flex items-center justify-center` controls row so all buttons (play/pause, mute, transcript, map, View Gallery) display in a single horizontal row.
- `Layout.jsx` owns `galleryOpen` and `setGalleryOpen` from TourContext (lines 14, 26) and passes `open={galleryOpen}` / `onClose={() => setGalleryOpen(false)}` to `FloatingMenu`. It does not yet pass an open handler.
- `Panorama.jsx` destructures `galleryOpen` and `toggleGallery` from `useTour()` (lines 15, 18) but never uses them — dead code per FR-004.
- `TourContext.jsx` already provides `toggleGallery` and `setGalleryOpen` (lines 66, 143, 147) and exposes them in context value (lines 190-191, 206-207).
- `FloatingMenu.jsx` already holds all gallery rendering logic: modal overlay, image sorting by `order`, active-index state, Escape/ArrowLeft/ArrowRight keydown handling, previous/next buttons, position counter, caption, empty state, image load-failure fallback, focus management, and mobile-hide when `sidebarOpen && isCompactViewport()`.
- `FloatingMenu.jsx` already holds all narration logic: play/pause with a 600ms click guard, mute/unmute with the same guard, audio visualization CSS, transcript display, error/blocked states, keyboard shortcuts ("p", "m"), accessible names/labels, and mobile-hide when `sidebarOpen && isCompactViewport()`.
- Both gallery and narration already share the identical `sidebarOpen && isCompactViewport()` hide rule, so wiring the toggle does not conflict on mobile behavior.
- Existing test coverage: `FloatingMenu.test.jsx` covers narration controls, visualization, transcript, accessible names, keyboard shortcuts, mobile viewport behavior, and gallery behaviors.

## Proposed Changes

### 1. Wire the View Gallery button toggle in `FloatingMenu.jsx`

Add an `onOpen` prop (gallery open handler) to `FloatingMenu.jsx`'s props. Replace the undefined `galleryOpen`/`toggleGallery` references on the View Gallery button:
- `aria-expanded={galleryOpen}` → `aria-expanded={open}`
- `onClick={toggleGallery}` → `onClick={onOpen}`

This makes the View Gallery button functional and self-contained, wired to defined controls passed by Layout.

### 2. Place all buttons in a single row (icon-only View Gallery button)

- Import `PhotoCameraIcon` from `@mui/icons-material` in `FloatingMenu.jsx`.
- Render the View Gallery button inline inside the existing `flex items-center justify-center gap-[0.6rem]` controls row, alongside the narration controls (play/pause, mute, transcript, map).
- The View Gallery button is icon-only (`<PhotoCameraIcon fontSize="small" />`) with no visible text label, matching the other icon buttons. It retains `aria-expanded={open}`, `aria-controls="room-gallery"`, `aria-haspopup="dialog"`, and `onClick={onOpen}`.
- Remove the previous absolute positioning (`absolute top-20 right-4 z-8 compact:top-20 compact:right-3`) so the button flows in the single row.

All buttons now display in a single horizontal row on desktop and mobile.

### 3. Pass gallery open/close props from `Layout.jsx`

In `Layout.jsx`, pass an open handler to `FloatingMenu` alongside the existing `open`/`onClose`:
- `onOpen={() => setGalleryOpen(true)}` (or equivalently `toggleGallery` from TourContext).

Layout retains ownership of gallery open/close state via TourContext, consistent with the clarification (FR-002).

### 4. Simplify `Panorama.jsx`

Remove the unused `galleryOpen` and `toggleGallery` from the `useTour()` destructuring in `Panorama.jsx` (FR-004). No other changes needed — Panorama does not render gallery UI.

### 5. Tests

- `FloatingMenu.test.jsx`: extend existing tests to cover the View Gallery button wiring (button calls the open handler prop, `aria-expanded` reflects the `open` prop). Keep all existing narration and gallery tests passing.
- No new test file; existing `FloatingMenu.test.jsx` covers the consolidated behavior.

### 6. Files to modify

| File | Change | Reason |
|:---|:---|:---|
| `apps/frontend/src/components/FloatingMenu.jsx` | Update | Add `onOpen` prop; wire View Gallery button to `open`/`onOpen` instead of undefined variables; import `PhotoCameraIcon`; render button icon-only inline in single controls row; FR-001/FR-002 |
| `apps/frontend/src/components/Layout.jsx` | Update | Pass gallery open handler prop to `FloatingMenu`; FR-002 |
| `apps/frontend/src/pages/Panorama.jsx` | Update | Remove unused `galleryOpen`/`toggleGallery` destructuring; FR-004 |
| `apps/frontend/src/tests/FloatingMenu.test.jsx` | Update | Add View Gallery button wiring coverage; FR-009 |
| `apps/backend/**` | No change | Frontend-only feature |

## Testing Strategy

### Automated

```bash
npm --prefix apps/frontend run test
npm run lint
npm run build
```

Expected results:
- All existing test files keep passing, including narration and gallery tests in `FloatingMenu.test.jsx`.
- New/updated `FloatingMenu.test.jsx` covers View Gallery button wiring (open handler invoked, `aria-expanded` reflects `open`).
- No test references undefined `galleryOpen`/`toggleGallery` in `FloatingMenu`.
- Lint and build succeed.

### Manual

Use `quickstart.md` for the full matrix. At minimum:
- Press the View Gallery button in the floating menu on a location with images and confirm the gallery overlay opens.
- Close via the close button, backdrop click, and Escape; confirm focus returns appropriately.
- Confirm the View Gallery button's `aria-expanded` state tracks gallery open/close.
- Confirm narration play/pause, mute, transcript, and map controls still work alongside the gallery.
- Confirm all buttons (play/pause, mute, transcript, map, View Gallery) display in a single horizontal row on desktop, tablet, and 320px-wide phone viewports.
- Confirm the View Gallery button is icon-only (`PhotoCameraIcon`) and its `aria-expanded` state tracks gallery open/close.
- Open the gallery on a narrow mobile viewport with the sidebar open; confirm the gallery hides.
- Spot-check desktop, tablet, and 320px-wide phone layouts.

## Risks and Dependencies

| Risk | Impact | Mitigation |
|:---|:---|:---|
| View Gallery button wired to undefined `galleryOpen`/`toggleGallery` | Button does nothing / console error on click | Replace with defined `open`/`onOpen` props passed from Layout; FR-002 |
| Gallery state desynchronized between Layout and FloatingMenu | Gallery open/close behavior inconsistent | Layout remains single source of truth via TourContext; FloatingMenu is purely presentational for open state |
| Panorama.jsx still references removed context values | Destructuring error / unused variable lint | Remove `galleryOpen`/`toggleGallery` from Panorama's `useTour()` destructuring; FR-004 |
| Mobile hide rule applied inconsistently | Gallery shows when sidebar is open on compact viewport | Reuse the existing shared `sidebarOpen && isCompactViewport()` rule already in FloatingMenu |
| Focus management breaks when opening gallery | Focus not managed on open | Existing FloatingMenu focus logic already handles open via `closeButtonRef.current?.focus()` on the gallery open effect |

No backend dependency, API change, storage migration, or new runtime package is introduced.

## Implementation Phases

1. **Update FloatingMenu.jsx**: Add `onOpen` prop; wire View Gallery button to `open`/`onOpen` instead of undefined `galleryOpen`/`toggleGallery`; import `PhotoCameraIcon`; render button icon-only inline in single controls row; remove absolute positioning; keep narration controls and gallery rendering intact.
2. **Update Layout.jsx**: Pass gallery open handler (`onOpen={() => setGalleryOpen(true)}` or `toggleGallery`) to FloatingMenu alongside `open`/`onClose`.
3. **Update Panorama.jsx**: Remove unused `galleryOpen`/`toggleGallery` from the `useTour()` destructuring.
4. **Update FloatingMenu.test.jsx**: Add View Gallery button wiring and single-row button layout coverage.
5. **Verification**: Run the frontend test suite, lint, and build. Manually validate gallery open/close via the View Gallery button and confirm all buttons display in a single row at representative viewports.

## Post-Design Constitution Re-Check

After generating `research.md`, `data-model.md`, `contracts/ui-contract.md`, and `quickstart.md`, the design still satisfies the constitution:

- **Stack and boundaries**: All changes stay in the React frontend, with static content and assets unchanged. No backend, model, service, or route change.
- **Test-first**: The updated `FloatingMenu.test.jsx` covers the spec's core success criteria (SC-001–SC-007) before implementation.
- **Accessibility and responsiveness**: Existing accessible names, visible focus, keyboard shortcuts ("p", "m"), alternative text, captions, and the mobile hide rule are retained. The View Gallery button keeps its `aria-expanded`/`aria-controls` accessible wiring, is icon-only (`PhotoCameraIcon`), and all buttons display in a single responsive row.
- **Dependency discipline**: No dependency changes.
- **Complexity**: No new component, hook, or abstraction is needed. The change wires existing props into an already-placed button and cleans up unused context destructuring.
