# Tasks: Remove Marzipano Header

**Input**: Design documents from `/specs/007-remove-marzipano-header/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - only include them if explicitly requested in the feature specification. No tests were explicitly requested in the spec, so no test tasks are generated (Vitest tooling is deferred per `AGENTS.md` and `CONTRIBUTING.md`).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `apps/frontend/` (per plan.md structure)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure verification

- [x] T001 [P] Confirm PanoramaViewer.jsx exists at apps/frontend/src/components/PanoramaViewer.jsx and locate the #titleBar header div, #sceneListToggle hamburger button, #fullscreenToggle fullscreen button, and #autorotateToggle autorotate button to be hidden/removed

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Baseline verification that MUST be complete before any user story work

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 [P] Verify current PanoramaViewer renders the #titleBar header, #sceneListToggle hamburger button, #fullscreenToggle fullscreen button, and #autorotateToggle autorotate button at the top of the viewer (baseline before removal)
- [x] T003 [P] Confirm Sidebar.jsx provides floor selection and scene list for current-scene identification (no dependency on the header bar or hamburger button)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - View an immersive, unobstructed panorama (Priority: P1) 🎯 MVP

**Goal**: Remove the Marzipano header bar, hamburger button (scene list toggle ☰), fullscreen button, and autorotate toggle from the top of the viewer so the 360-degree campus scene fills the full available vertical space.

**Independent Test**: Open the tour and confirm no header bar, hamburger button, fullscreen button, or autorotate toggle is visible at the top of the panorama viewer; confirm the scene fills the available vertical space.

### Implementation for User Story 1

- [x] T004 [US1] Remove the #titleBar header div from apps/frontend/src/components/PanoramaViewer.jsx
- [x] T005 [US1] Hide the #sceneListToggle hamburger button (display: none) in apps/frontend/src/components/PanoramaViewer.jsx
- [x] T006 [US1] Hide the #fullscreenToggle fullscreen button (display: none) in apps/frontend/src/components/PanoramaViewer.jsx
- [x] T007 [US1] Hide the #autorotateToggle autorotate button (display: none) in apps/frontend/src/components/PanoramaViewer.jsx
- [x] T008 [US1] Verify panoramic scene fills the full available vertical space after all removals (no empty top gap)
- [x] T009 [US1] Verify remaining viewer controls (directional view controls) remain positioned and operable after header and top button removal

**Checkpoint**: At this point, User Story 1 is fully functional and testable independently — header bar, hamburger button, fullscreen button, and autorotate toggle are all hidden; remaining controls work.

---

## Phase 4: User Story 2 - Still know which scene is displayed (Priority: P2)

**Goal**: Ensure the current scene remains identifiable via the Sidebar after the header bar and top buttons are hidden.

**Independent Test**: Open the tour, switch floors in the Sidebar, and confirm the current scene remains identifiable without a header bar or top buttons.

### Implementation for User Story 2

- [x] T010 [US2] Confirm Sidebar floor selection highlights the current floor and lists scenes after header and top button removal
- [x] T011 [US2] Confirm the current scene name is identifiable via the Sidebar/scene list without the header bar or top buttons

**Checkpoint**: At this point, User Story 2 is verified — scene identification works through the Sidebar after header and top button removal.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements and validation that affect the whole feature

- [x] T012 [P] Run ESLint on apps/frontend/src/components/PanoramaViewer.jsx to confirm no new lint violations introduced by the removals
- [x] T013 [P] Run quickstart validation scenarios from specs/007-remove-marzipano-header/quickstart.md to confirm end-to-end behavior (no header/hamburger/fullscreen/autorotate, scene fills height, controls operable, scene identifiable via Sidebar)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Story 1 (P1) and User Story 2 (P2) can proceed in parallel (if staffed) or sequentially in priority order (P1 → P2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2). No dependencies on other stories. This is the MVP scope.
- **User Story 2 (P2)**: Can start after Foundational (Phase 2). Independent of US1 but verifies the scene-identification concern raised by removing the header and top buttons.

### Within Each User Story

- Baseline verification before implementation
- Core implementation (remove header bar, hide hamburger button, fullscreen button, autorotate toggle)
- Verification that remaining controls/scene identification still work
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, both user stories can start in parallel
- All Polish tasks marked [P] can run in parallel

## Parallel Example: User Story 1

```bash
# Launch implementation and verification tasks for User Story 1 together:
Task: "Remove the #titleBar header div from apps/frontend/src/components/PanoramaViewer.jsx"
Task: "Hide the #sceneListToggle hamburger button (display: none) in apps/frontend/src/components/PanoramaViewer.jsx"
Task: "Hide the #fullscreenToggle fullscreen button (display: none) in apps/frontend/src/components/PanoramaViewer.jsx"
Task: "Hide the #autorotateToggle autorotate button (display: none) in apps/frontend/src/components/PanoramaViewer.jsx"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently (header, hamburger, fullscreen, autorotate all hidden; scene fills height; remaining controls work)
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Each story adds value without breaking previous stories

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same-file conflicts, cross-story dependencies that break independence
