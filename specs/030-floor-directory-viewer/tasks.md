# Tasks: Floor Directory Viewer

**Input**: Design documents from `/specs/030-floor-directory-viewer/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/floor-directory-dialog.md, quickstart.md

**Tests**: Included. The project constitution (Principle III) requires frontend tests for behavior that affects navigation, galleries, or controls, so every story below starts with failing tests.

**Organization**: Tasks are grouped by user story so each increment can be validated on its own.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story the task belongs to (US1, US2, US3, US4)
- All paths are relative to the repository root.

## Path Conventions

- Frontend source: `apps/frontend/src/`
- Frontend tests: `apps/frontend/src/tests/`
- Static asset: `apps/frontend/public/img/glitch_directory.png`
- Docs: `docs/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Record the already-installed viewer dependency and add the shared motion helper.

- [X] T001 [P] Add an approved `react-zoom-pan-pinch` row with justification to the Frontend dependency table in `docs/tech_stack.md`
- [X] T002 [P] Write `apps/frontend/src/tests/motion.test.js` covering the default `false` result, `true` when `matchMedia("(prefers-reduced-motion: reduce)")` matches, and updates from the change listener
- [X] T003 Implement `usePrefersReducedMotion` with a `matchMedia` listener in `apps/frontend/src/lib/motion.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Pure zoom math and the dialog shell that every story builds on.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T004 [P] Write `apps/frontend/src/tests/zoomViewer.test.js` covering `measureFitScale` (contain math, zero-size fallback to `1`), `getMaxScale` (four times fit), and `getZoomPercent` (rounding, `100`/`400` clamping)
- [X] T005 Implement `measureFitScale`, `getMaxScale`, and `getZoomPercent` in `apps/frontend/src/lib/zoomViewer.js` so T004 passes
- [X] T006 [P] Create `apps/frontend/src/components/FloorDirectoryDialog.jsx` with the backdrop, `role="dialog"`, `aria-modal`, title, close control, Escape handling, backdrop close, and `inert` when closed
- [X] T007 Replace the inline floor-directory markup in `apps/frontend/src/components/FloatingMenu.jsx` with `<FloorDirectoryDialog>` and keep the map button and `mapModalOpen` state
- [X] T008 Update the floor-directory block in `apps/frontend/src/tests/FloatingMenu.test.jsx` to keep the structural assertions (opens, labelled dialog, close button, backdrop, Escape, alt text) and remove the obsolete inline `transform` assertions
- [X] T009 Verify Phase 2: run `npm --prefix apps/frontend run test` and confirm the tests in `apps/frontend/src/tests/FloatingMenu.test.jsx` and `apps/frontend/src/tests/zoomViewer.test.js` pass

**Checkpoint**: The dialog shell opens and closes and the zoom math is unit-tested.

---

## Phase 3: User Story 1 - Read the directory at a comfortable size (Priority: P1) (MVP)

**Goal**: The whole directory is fitted and centered at 100%, zoom and pan are bounded, panning clamps at the image edges, and the view resets when the dialog reopens.

**Independent Test**: Open the dialog, confirm the full image is visible and centered, zoom in, pan to an edge and confirm the image stops with no blank gap, close and reopen and confirm the view is fitted again.

### Tests for User Story 1

> Write these first and confirm they fail before implementation.

- [X] T010 [P] [US1] Write `apps/frontend/src/tests/FloorDirectoryViewer.test.jsx` covering: the image renders with the `Floor Directory` alt text; a failed image shows a `role="alert"` message and the dialog stays closable; the viewer mounts fitted with stubbed wrapper/content sizes; reopening re-fits the view
- [X] T011 [P] [US1] Extend `apps/frontend/src/tests/FloatingMenu.test.jsx` with an overlay-handoff test: opening the gallery or setting `sidebarOpen` closes the floor directory and returns focus to the map button

### Implementation for User Story 1

- [X] T012 [US1] Create `apps/frontend/src/components/FloorDirectoryViewer.jsx` with `TransformWrapper` configured with `fitOnInit="contain"`, `limitToBounds`, `disablePadding`, `autoAlignment: { sizeX: 0, sizeY: 0 }`, and measured `minScale`/`maxScale`
- [X] T013 [US1] Add image loading and failure states plus a `ResizeObserver` that re-measures the fit scale and re-fits while the visitor is at 100% in `apps/frontend/src/components/FloorDirectoryViewer.jsx`
- [X] T014 [US1] Mount `FloorDirectoryViewer` inside `apps/frontend/src/components/FloorDirectoryDialog.jsx` and reset the transform when `open` becomes true
- [X] T015 [US1] Add the overlay handoff effect in `apps/frontend/src/components/FloatingMenu.jsx` so the directory closes when `open` (gallery) or `sidebarOpen` becomes true
- [X] T016 [US1] Verify User Story 1: run `npm --prefix apps/frontend run test` and confirm `apps/frontend/src/tests/FloorDirectoryViewer.test.jsx` and `apps/frontend/src/tests/FloatingMenu.test.jsx` pass

**Checkpoint**: The directory opens fitted, stays bounded, and resets on reopen.

---

## Phase 4: User Story 2 - Zoom with a mouse, trackpad, or touch screen (Priority: P1)

**Goal**: Wheel, trackpad scroll, pinch, drag, and double click/tap all drive the viewer, anchored on the pointer or pinch point, without scrolling or zooming the page.

**Independent Test**: On desktop, scroll over a room row and confirm it stays under the cursor; on touch, pinch a floor label and confirm it stays under the fingers; double click and double tap toggle between fitted and close-up.

### Tests for User Story 2

- [X] T017 [P] [US2] Write `apps/frontend/src/tests/FloorDirectoryViewer.test.jsx` input tests: wheel changes the content transform; two-finger pinch changes it; one-finger drag changes the position; double click toggles back to the starting transform; a wheel event over the viewer does not scroll the page

### Implementation for User Story 2

- [X] T018 [US2] Configure `wheel` (step and pointer anchoring), `pinch`, `panning`, and `doubleClick: { mode: "toggle" }` in `apps/frontend/src/components/FloorDirectoryViewer.jsx`
- [X] T019 [US2] Apply `touch-action: none` and `overscroll-contain` to the viewer wrapper and remove the old wheel, touch, and mouse handlers from `apps/frontend/src/components/FloatingMenu.jsx`
- [X] T020 [US2] Verify User Story 2: run `npm --prefix apps/frontend run test` and confirm the input tests in `apps/frontend/src/tests/FloorDirectoryViewer.test.jsx` pass

**Checkpoint**: Every input type zooms or pans without page scroll.

---

## Phase 5: User Story 3 - Control the viewer without gestures (Priority: P1)

**Goal**: Visible zoom-in, zoom-out, reset, and close controls plus arrow, `+`/`-`, and `0` keys; a live 100%–400% readout; focus trapped in the dialog and restored to the map button.

**Independent Test**: Using only the keyboard, tab into the dialog, zoom in, pan with arrows, reset with `0`, and close with Escape; confirm focus returns to the map button and every control shows focus.

### Tests for User Story 3

- [X] T021 [P] [US3] Write `apps/frontend/src/tests/FloorDirectoryViewer.test.jsx` control tests: zoom-in and zoom-out update the percentage; buttons disable at 100% and 400%; reset returns to 100%; the percentage matches `/^\d{3}%$/`
- [X] T022 [P] [US3] Write `apps/frontend/src/tests/FloorDirectoryDialog.test.jsx` focus and keyboard tests: focus starts on the close control; Tab and Shift+Tab wrap inside the dialog; Escape closes; focus returns to the map button; arrow, `+`, `-`, and `0` keys act on the viewer

### Implementation for User Story 3

- [X] T023 [US3] Add the zoom toolbar (zoom in, zoom out, reset) and the percentage readout to `apps/frontend/src/components/FloorDirectoryViewer.jsx`, updating state from `onTransform` only when the rounded percentage changes
- [X] T024 [US3] Enable `keyboard: { disabled: false }` and pass the measured bounds to the viewer in `apps/frontend/src/components/FloorDirectoryViewer.jsx`
- [X] T025 [US3] Implement the Tab trap, focus capture, and focus restore in `apps/frontend/src/components/FloorDirectoryDialog.jsx`, using a map-button ref from `apps/frontend/src/components/FloatingMenu.jsx`
- [X] T026 [US3] Verify User Story 3: run `npm --prefix apps/frontend run test` and confirm the tests in `apps/frontend/src/tests/FloorDirectoryViewer.test.jsx` and `apps/frontend/src/tests/FloorDirectoryDialog.test.jsx` pass

**Checkpoint**: Every action is reachable and visible without gestures.

---

## Phase 6: User Story 4 - Polished, comfortable movement (Priority: P3)

**Goal**: Inertia after a flick, eased transitions for programmatic actions, and instant changes when reduced motion is enabled.

**Independent Test**: Flick the image and confirm it glides and settles in bounds; enable reduced motion and confirm zoom, reset, and fit apply instantly with no glide.

### Tests for User Story 4

- [X] T027 [P] [US4] Write `apps/frontend/src/tests/FloorDirectoryViewer.test.jsx` motion tests: with reduced motion the viewer applies zero animation times and disables velocity, and the dialog still opens and closes normally

### Implementation for User Story 4

- [X] T028 [US4] Wire `usePrefersReducedMotion` into `apps/frontend/src/components/FloorDirectoryViewer.jsx` to zero `animationTime`, disable `velocityAnimation`, and set `panning.velocityDisabled`
- [X] T029 [US4] Replace the local `prefersReducedMotion` helper in `apps/frontend/src/components/FloatingMenu.jsx` with the shared hook from `apps/frontend/src/lib/motion.js`
- [X] T030 [US4] Verify User Story 4: run `npm --prefix apps/frontend run test` and confirm the motion tests in `apps/frontend/src/tests/FloorDirectoryViewer.test.jsx` pass

**Checkpoint**: Motion feels like a photo viewer and respects reduced-motion preferences.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Quality gates, documentation, and manual validation across viewports.

- [X] T031 [P] Remove dead custom zoom/pan state and handlers from `apps/frontend/src/components/FloatingMenu.jsx` and confirm no unused imports remain
- [X] T032 [P] Run `npm run lint` and fix any reported errors in the touched files under `apps/frontend/src/`
- [X] T033 [P] Run `npm run build` and confirm the production build for `apps/frontend/` succeeds
- [X] T034 Run the `quickstart.md` manual scenarios at mobile (about 390 px), tablet (about 768 px), and desktop (about 1440 px), including keyboard, reduced motion, overlay handoff, and the image-failure state
- [X] T035 Confirm `docs/tech_stack.md` lists `react-zoom-pan-pinch` and that `apps/frontend/package.json` was not changed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; T002 and T001 can run in parallel
- **Foundational (Phase 2)**: Depends on Setup; T004 and T005 can run in parallel with T006
- **User Stories (Phases 3–6)**: Depend on Foundational completion
- **Polish (Phase 7)**: Depends on all four stories

### User Story Dependencies

- **US1 (P1)**: No dependency on other stories
- **US2 (P1)**: Builds on the viewer from US1; its tests observe the content transform, so it does not depend on US3
- **US3 (P1)**: Builds on the viewer from US1; adds controls, keyboard, and focus
- **US4 (P3)**: Builds on US1 and touches the same viewer and menu files as US2/US3, so run it last

### Within Each User Story

1. Write the failing tests.
2. Implement the viewer or dialog change.
3. Wire the change into `FloatingMenu` where needed.
4. Run the frontend suite and confirm the story's tests pass.

### Parallel Opportunities

- T001 and T002 touch different files and can run together.
- T004 (helper tests) and T006 (dialog shell) are independent.
- T010 and T011 are separate test files and can run together.
- T017 and T021/T022 test different behaviors in separate files; T021 and T022 can run together.
- T031, T032, and T033 are independent verification tasks.

---

## Parallel Example: User Story 1

```text
Task: "Write FloorDirectoryViewer tests in apps/frontend/src/tests/FloorDirectoryViewer.test.jsx"
Task: "Add overlay-handoff test in apps/frontend/src/tests/FloatingMenu.test.jsx"
```

## Parallel Example: User Story 3

```text
Task: "Write control tests in apps/frontend/src/tests/FloorDirectoryViewer.test.jsx"
Task: "Write focus and keyboard tests in apps/frontend/src/tests/FloorDirectoryDialog.test.jsx"
```

---

## Implementation Strategy

### MVP First

1. Complete Phase 1 (Setup) and Phase 2 (Foundational).
2. Complete Phase 3 (US1) to deliver the fitted, bounded viewer.
3. Complete Phase 5 (US3) before calling the MVP releasable, because the constitution makes keyboard-operable controls non-negotiable.
4. Validate with `npm --prefix apps/frontend run test` and the desktop/mobile quickstart steps.

### Incremental Delivery

1. US1: fitted, bounded viewer with reset-on-reopen.
2. US2: full input matrix (wheel, trackpad, pinch, drag, double click/tap).
3. US3: controls, percentage, keyboard, and focus management.
4. US4: inertia and reduced-motion polish.
5. Polish: lint, build, and manual validation across viewports.

### Notes

- `FloorDirectoryViewer.jsx` is touched by US1–US4; do not parallelize tasks in that file across stories.
- Tests must fail before the matching implementation task starts.
- Commit after each story checkpoint so a failing story can be reverted independently.
