# Tasks: Marzipano Panorama Viewer Integration

**Input**: Design documents from `/specs/006-marzipano-viewer-integration/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - only include them if explicitly requested in the feature specification. No tests were explicitly requested in the spec, so no test tasks are generated (see T030 for the Vitest tooling gate). Existing test files are referenced only as verification evidence inside verification tasks (e.g. T035).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- **Web app**: `apps/frontend/` (per plan.md structure)

## Execution State

T001–T012, T014–T022, T024–T027 are complete (`[X]`) — implementation exists and was verified end-to-end. T013 and T023 were verified and completed on 2026-11-06, T029/T030 completed with maintainer approval on 2026-11-06 (lint clean, test suite green: 6 files / 49 tests / 0 errors). **T028 remains open by explicit maintainer decision** (tile commit deferred).

T031–T035 were appended on 2026-11-07 for the clarify/plan sessions of that date (Integration Rules #1/#2: floor-code scene sync, keep-previous fallback, active-button label). IDs are appended after the original T001–T030 sequence; their phase placement reflects execution order. All five are implemented and verified: root `npm run test` → 63/63 (backend 8, frontend 55), `npx eslint .` → 0 errors, `npm run build` → succeeds.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 [P] Confirm vendor scripts exist under `vendor/` (marzipano.js, bowser.min.js, screenfull.min.js), are loaded via `<script>` tags in `apps/frontend/index.html`, and that `index.html` contains NO `reset.min.css` link per FR-010
- [X] T002 [P] Confirm `src/lib/data.js` (APP_DATA) contains all 54 scenes with ids, names, levels, link hotspots, info hotspots, initial view parameters
- [X] T003 [P] Confirm `src/components/Marzipano.jsx` contains the complete vanilla Marzipano viewer logic and remains unchanged per migration rule
- [X] T004 [P] Confirm panoramic tiles are served from `apps/frontend/public/tiles/` (54 scene dirs) and viewer icons from `apps/frontend/public/img/` per research decision

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 [P] Wire Marzipano.jsx into PanoramaViewer.jsx so the Marzipano viewer logic initializes inside the React component (`src/components/PanoramaViewer.jsx`)
- [X] T006 [P] Drive viewer scenes from APP_DATA in `src/lib/data.js` (scene ids, names, levels, link hotspots, info hotspots, initial view parameters)
- [X] T007 [P] Migrate global styles from the original Marzipano CSS to Tailwind CSS within `PanoramaViewer.jsx` or `src/index.css` per FR-011 (Marzipano globals in `@layer base`, hotspot styles in `@layer components`)
- [X] T008 Set the initial tour scene to LG first scene `0-lg---1` in `src/components/PanoramaViewer.jsx` per FR-001
- [X] T031 [P] Extract the shared floor↔scene mapping into `src/lib/floorSceneMap.js` (`FLOOR_SEQUENCE`, `FLOOR_SCENE_MAP`, `getSceneIdForFloor`, `getFloorIndex`, `getFloorForSceneId`) and import it from `src/components/Sidebar.jsx` and `src/components/PanoramaViewer.jsx` so button→scene and scene→floor logic lives in one module

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View the campus panorama by floor (Priority: P1) 🎯 MVP

**Goal**: Visitor opens the tour and sees the LG first scene `0-lg---1`; Sidebar floor buttons switch the viewer to each floor's first scene; current scene name shows in title bar.

**Independent Test**: Open the tour, confirm LG first scene loads; open Sidebar, select each floor (LG, UG, 4F, 5F, 5M, 6F, 7F, 8F, 9F), confirm each floor's first scene loads without page reload; confirm scene name shows in title bar.

### Implementation for User Story 1

- [X] T009 [US1] Connect Sidebar floor buttons to PanoramaViewer so selecting a floor switches the scene (`src/components/Sidebar.jsx`, `src/components/PanoramaViewer.jsx`)
- [X] T010 [P] [US1] Map each floor button (LG, UG, 4F, 5F, 5M, 6F, 7F, 8F, 9F) to its designated first scene id per data-model.md (`src/components/Sidebar.jsx`)
- [X] T011 [P] [US1] Display the current scene name in the viewer title bar (`src/components/PanoramaViewer.jsx`)
- [X] T012 [US1] Verify each floor selection loads the correct first scene without a page reload (`src/components/PanoramaViewer.jsx`, `src/components/Sidebar.jsx`)
- [X] T013 [US1] Verify/Implement FR-013 rapid floor switching: when floors are switched while a previous scene is still loading, the most recently selected scene wins and the Sidebar highlight matches it (`src/components/PanoramaViewer.jsx`) — verified by code path: `Marzipano.jsx switchScene` is synchronous (`setParameters` → `switchTo` → DOM), floor clicks dispatch synchronously so the last dispatch wins, and Sidebar `onSelect` updates last-wins (quickstart.md Scenario 5 confirms manually)
- [X] T032 [P] [US1] Display the location name from `catalog.json` only on the active floor button — visible text and accessible name (`aria-label`); inactive buttons show only the floor label (Rule 2, contract C6) (`src/components/Sidebar.jsx`)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Navigate between interconnected scenes within a floor (Priority: P2)

**Goal**: Within a floor, link hotspots let the visitor move between interconnected scenes; the Sidebar highlights the current floor.

**Independent Test**: Within one floor, click link hotspots across scenes; confirm viewer transitions between scenes; confirm Sidebar highlights the current floor.

### Implementation for User Story 2

- [X] T014 [P] [US2] Render link hotspots in the panorama for each scene's linkHotspots from APP_DATA (`src/components/PanoramaViewer.jsx` - handled by Marzipano.jsx on DOM mount)
- [X] T015 [P] [US2] Handle link hotspot clicks to switch to the target scene within the same floor (`src/components/Marzipano.jsx` - handles via switchScene + findSceneById)
- [X] T016 [US2] Highlight the current floor in the Sidebar when the scene changes (`src/components/PanoramaViewer.jsx` - MutationObserver tracks scene list .current changes)
- [X] T017 [US2] Verify link hotspot clicks switch to the target scene of the same floor without page reload (`src/components/PanoramaViewer.jsx`)
- [X] T033 [US2] Emit the displayed scene id to the parent through an `onSceneChange(sceneId)` callback whenever the current scene changes — initial load, scene list click, and link hotspot (MutationObserver on `#sceneList .scene.current`) (`src/components/PanoramaViewer.jsx`, contract C5)
- [X] T034 [US2] Resolve the scene id to its floor by parsing the floor code (`16-4f---11` → `4f` → `4F`) and select the matching location; when the floor code resolves to no sidebar floor, keep the previous highlight (no clear, no fallback) (`src/components/Layout.jsx` — `handleSceneChange` using `getFloorForSceneId` from `src/lib/floorSceneMap.js`; FR-006, clarification 2026-11-07)
- [X] T035 [US2] Verify Rule 1 sync end to end: all 54 scene ids in `src/lib/data.js` resolve to their floor button, each floor's first scene round-trips, cross-floor hotspots move the highlight to the target floor (e.g. `2-lg---3` → `5-ug---1` activates UG), and unknown ids keep the previous highlight (`src/tests/floorSceneMap.test.js`) — verified: frontend suite 55/55 green

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Viewer controls and UI (Priority: P3)

**Goal**: The viewer includes autorotate, fullscreen, scene list toggle, and directional view controls; works on desktop and mobile.

**Independent Test**: Confirm each control button is present and produces its expected effect; confirm the viewer works on a narrow viewport.

### Implementation for User Story 3

- [X] T018 [US3] Add autorotate toggle button to PanoramaViewer.jsx (`src/components/PanoramaViewer.jsx`)
- [X] T019 [US3] Add fullscreen toggle button to PanoramaViewer.jsx (`src/components/PanoramaViewer.jsx`)
- [X] T020 [US3] Add scene list toggle button to PanoramaViewer.jsx (`src/components/PanoramaViewer.jsx`)
- [X] T021 [US3] Add directional view controls (up/down/left/right/in/out) to PanoramaViewer.jsx (`src/components/PanoramaViewer.jsx`)
- [X] T022 [US3] Verify the viewer renders correctly on desktop and narrow mobile viewports (`src/components/PanoramaViewer.jsx`, `src/index.css`)
- [X] T023 [US3] Verify SC-005 accessibility: every viewer control is keyboard operable with a visible focus state and panorama/control images expose meaningful alt text (`src/components/PanoramaViewer.jsx`, `src/components/Sidebar.jsx`) — gaps fixed: view controls now press/release on Enter/Space and the panorama section pans/zooms on arrows/+/- by dispatching mousedown/mouseup to Marzipano's press controls; `alt` texts made meaningful ("Pan up", "Zoom in", ...); global `:focus-visible` ring (index.css) confirmed; lint + build pass

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T024 [P] Test the viewer on mobile and desktop for layout and control responsiveness (`src/components/PanoramaViewer.jsx`)
- [X] T025 Verify no JavaScript errors appear in the browser console during scene and floor switching (`src/components/PanoramaViewer.jsx`)
- [X] T026 [P] Run quickstart.md validation scenarios to confirm end-to-end behavior (`specs/006-marzipano-viewer-integration/quickstart.md`)
- [X] T027 [P] Perform manual smoke test of the full floor navigation flow (`specs/006-marzipano-viewer-integration/quickstart.md` Scenarios 1–8)
- [ ] T028 [P] Commit the tile set `apps/frontend/public/tiles/` (~709 MB, 54 scene dirs, currently untracked) to version control per clarification 2026-11-06 so fresh clones satisfy FR-001 (verify it is not covered by any `.gitignore` rule first)
- [X] T029 [P] Obtain maintainer approval and resolve the pre-existing ESLint error `apps/frontend/src/components/Marzipano.jsx:436` (`no-redeclare`) — one-line rename or scoped `eslint-disable-next-line no-redeclare` (Constitution gate gap 1 in plan.md; requires approval because the file is frozen) — APPROVED (variable rename): dropped the unused `eventList` parameter of `stopTouchAndScrollEventPropagation`; `npm run lint` now passes clean (Constitution Gate III gap 1 resolved)
- [X] T030 [P] Obtain maintainer approval to install deferred test tooling (`vitest`, `jsdom`, Testing Library) in `apps/frontend`, run the existing suite in `apps/frontend/src/tests/`, and add an FR-013 regression test in `apps/frontend/src/tests/PanoramaViewer.test.jsx` (Constitution gate gap 2 in plan.md) — APPROVED (install): 73 packages added as `apps/frontend` devDependencies; suite rewritten for the clarified architecture (vendor-global mock + `vi.resetModules()` per test) and green (6 files / 49 tests / 0 errors), including the FR-013 rapid-switch regression test and SC-005 keyboard/alt-text tests (Gate III gap 2 resolved)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Infrastructure wiring before story-specific implementation
- Core implementation before verification
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (all touch different files/areas)
- T005/T006/T007 in Foundational touch different files (`PanoramaViewer.jsx`, `data.js`, `index.css`) and can run in parallel
- T010 and T011 (different files: `Sidebar.jsx` vs `PanoramaViewer.jsx`) can run in parallel
- T014 and T015 (different files: `PanoramaViewer.jsx` vs `Marzipano.jsx`) can run in parallel
- T024, T026, T027, T028, T029, T030 in Polish touch different areas and can run in parallel
- **2026-11-07 sync batch**: T031 (new `src/lib/floorSceneMap.js` + imports) runs first; T032 (`Sidebar.jsx`) and T033 (`PanoramaViewer.jsx`) then run in parallel; T034 (`Layout.jsx`) depends on T031 + T033; T035 (verification) runs last
- Once Foundational phase completes, user stories can start in parallel (if team capacity allows)
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Tasks that can run in parallel for User Story 1:
Task: "Map each floor button (LG, UG, 4F, 5F, 5M, 6F, 7F, 8F, 9F) to its designated first scene id per data-model.md (src/components/Sidebar.jsx)"
Task: "Display the current scene name in the viewer title bar (src/components/PanoramaViewer.jsx)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- T013, T023, T028–T030 originate from the 2026-11-06 clarify/plan sessions (FR-013, SC-005 extension, tile-commit decision, Constitution gate gaps); T028 is intentionally left open (maintainer deferred the ~709 MB tiles commit)
- T031–T035 originate from the 2026-11-07 clarify/plan sessions (Integration Rule #1 floor-code sync for all 54 scenes, keep-previous fallback for unresolvable floor codes, Integration Rule #2 active-button location label); IDs appended after T030 while phase placement reflects execution order
