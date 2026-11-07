# Tasks: Switch 5M and 5F Floor Order

**Input**: Design documents from `/specs/010-switch-5m-5f-buttons/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - only include them if explicitly requested in the feature specification. The feature specification does not explicitly request test code tasks; manual validation per quickstart.md and interim lint/build checks provide evidence until Vitest/Testing Library/jsdom tooling is restored.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume web app structure per plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Review Sidebar.jsx current structure (FLOOR_SEQUENCE, PAIRED_FLOORS, buildFloorRows, FloorPair) to confirm integration points (apps/frontend/src/components/Sidebar.jsx)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 [P] Confirm no new dependencies required (apps/frontend/package.json unchanged; existing React, Vite, Tailwind, MUI reused)
- [x] T003 [P] Verify Vitest config exists for future test file placement (apps/frontend/vitest.config.js)

**Checkpoint**: Foundation ready - no new dependencies or infrastructure needed; user story implementation can now begin

---

## Phase 3: User Story 1 - Paired row 5F then 5M (Priority: P1) 🎯 MVP

**Goal**: 5F and 5M appear together in one row, side by side, in the fixed order 5F then 5M; every other floor keeps its own separate row; each floor remains a separate control with per-floor state.

**Independent Test**: Open the sidebar and confirm 5F and 5M share one row in the order 5F then 5M; all other floors occupy separate rows; each button retains its own current/locked/unavailable/disabled state.

### Implementation for User Story 1

- [x] T004 [US1] Remove floor-order switch state and toggle function from Sidebar component (apps/frontend/src/components/Sidebar.jsx)
- [x] T005 [US1] Update buildFloorRows to always reverse the fifth-floor pair to render 5F then 5M (apps/frontend/src/components/Sidebar.jsx)
- [x] T006 [US1] Remove floorOrderSwitched prop from FloorList/FloorRow (apps/frontend/src/components/Sidebar.jsx)
- [x] T007 [US1] Remove order-switch control UI from sidebar (apps/frontend/src/components/Sidebar.jsx)
- [x] T008 [US1] Ensure per-floor state (current, locked, unavailable, disabled) travels with each button (apps/frontend/src/components/Sidebar.jsx)
- [x] T009 [US1] Verify 5F and 5M share one row in order 5F then 5M; all other floors keep separate rows (apps/frontend/src/components/Sidebar.jsx)

**Checkpoint**: At this point, User Story 1 is fully functional - the paired row exists as 5F then 5M with per-floor state preserved

---

## Phase 4: User Story 2 - Independent activation (Priority: P2)

**Goal**: Each floor in the pair remains an independent, separately activatable control; both labels remain readable at 320px; keyboard and screen-reader support works.

**Independent Test**: Activate 5F and 5M separately; confirm each responds only for itself; confirm both labels fully visible at 320px without horizontal scroll; confirm keyboard focus reaches each floor individually.

### Implementation for User Story 2

- [x] T010 [US2] Verify each floor button remains a separate control with its own label (apps/frontend/src/components/Sidebar.jsx)
- [x] T011 [US2] Verify activating one floor does not activate or select the other (apps/frontend/src/components/Sidebar.jsx)
- [x] T012 [US2] Verify both labels (5F, 5M) remain fully visible at a 320px-wide viewport without horizontal scrolling (apps/frontend/src/components/Sidebar.jsx)
- [x] T013 [US2] Verify each floor is individually keyboard-reachable and announced separately by assistive technology (apps/frontend/src/components/Sidebar.jsx)

**Checkpoint**: At this point, User Story 2 is fully functional - independent activation, responsiveness, and accessibility confirmed

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T014 [P] Run ESLint on apps/frontend/src/components/Sidebar.jsx and fix any errors
- [x] T015 [P] Run production build to confirm no regressions (npm run build)
- [x] T016 [P] Manual validation per quickstart.md: grouping, fixed order, centering, responsiveness
- [x] T017 Update spec.md status to reflect completion and update checklists/requirements.md as needed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-4)**: All depend on Foundational phase completion
  - User Story 1 (P1) must complete before User Story 2 (P2)
- **Polish (Final Phase)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories; provides the paired row foundation
- **User Story 2 (P2)**: Depends on User Story 1 completion - Independently testable once US1 is done

### Within Each User Story

- Core implementation before verification tasks
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- All Polish tasks marked [P] can run in parallel (within Phase 6)

---

## Parallel Example: Phase 5 Polish

```bash
# Run lint, build, and manual validation together (different files/independent):
Task: "Run ESLint on apps/frontend/src/components/Sidebar.jsx"
Task: "Run production build to confirm no regressions"
Task: "Manual validation per quickstart.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - confirms no new deps/infra needed)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently (paired row as 5F then 5M, per-floor state, centering)
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (independent activation + accessibility)
4. Each story adds value without breaking previous stories

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- All implementation tasks edited apps/frontend/src/components/Sidebar.jsx, sequenced within each story to avoid file conflicts
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Tests are not explicitly requested in the feature specification; per the constitution's Test-First gate, Sidebar.test.jsx should be extended with regression cases once Vitest/Testing Library/jsdom tooling is restored (currently deferred by maintainer)
