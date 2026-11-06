# Tasks: Sidebar 5F and 5M Paired Row

**Input**: Design documents from `/specs/005-sidebar-floor-pair-row/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: [ID] [P?] [Story] Description

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `frontend/src/` (adjust as needed)
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project – adjust based on plan.md structure

<!--
   ============================================================================
   IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.
   The /speckit.tasks command MUST replace these with actual tasks based on:
   - User stories from spec.md (with their priorities P1, P2, P3...)
   - Feature requirements from plan.md
   - Entities from data-model.md
   - Endpoints from contracts/
   - Endpoints from research.md
   Tasks MUST be organized by user story so each story can be:
   - Implemented independently
   - Tested independently
   - Delivered as an MVP increment
   DO NOT keep these sample tasks in the generated tasks.md file.
   ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 Create project structure in `src/` per implementation plan
- [ ] T002 Install required npm packages in `package.json`

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T003 [P] Implement row grouping logic in `src/components/Sidebar.jsx` to create display rows based on pairing map
- [ ] T004 [P] Ensure all floor buttons are horizontally centered within the sidebar column in `src/components/Sidebar.jsx`
- [ ] T005 [P] Adjust label text wrapping in `src/components/Sidebar.jsx` so floor names remain readable at 320 px viewport

## Phase 3: User Story 1 - See 5F and 5M on one row (Priority: P1) 🎯 MVP

**Goal**: Visitor sees 5F and 5M side‑by‑side in a single row while all other floors remain separate rows; each button is centered and labels are readable.

**Independent Test**: Open the sidebar at desktop width, verify 5F and 5M appear together in one row, all other floors in separate rows, each button centered, labels readable at 320 px without horizontal scroll.

**Implementation for User Story 1**

- [ ] T006 [P] [US1] Modify `src/components/Sidebar.jsx` to render the 5F/5M pair as a single row with two side‑by‑side buttons
- [ ] T007 [P] [US1] Add centering styles for the paired row buttons in `src/components/Sidebar.jsx`
- [ ] T008 [P] [US1] Ensure floor labels wrap to stay readable at 320 px in `src/components/Sidebar.jsx`

## Phase 4: User Story 2 - Use each paired floor independently (Priority: P2)

**Goal**: Each floor in the paired row remains a separate, independently selectable control.

**Independent Test**: Activate 5F and verify only 5F responds; activate 5M and verify only 5M responds; confirm states (current, locked, unavailable, disabled) are shown per floor.

**Implementation for User Story 2**

- [ ] T009 [P] [US2] Implement independent activation handling for each floor button in `src/components/Sidebar.jsx`
- [ ] T010 [P] [US2] Verify per‑floor state styling is displayed correctly for each button in the pair in `src/components/Sidebar.jsx`
- [ ] T011 [P] [US2] Apply responsive label wrapping to the paired row in `src/components/Sidebar.jsx`

## Phase 5: User Story 3 - Paired row on small screens and assistive technology (Priority: P3)

**Goal**: The paired row remains usable on narrow viewports and with keyboard or screen reader assistance.

**Independent Test**: At narrow viewport, verify both labels are fully readable without horizontal scrolling; using keyboard, focus reaches each floor button individually in order; screen reader announces each floor separately.

**Implementation for User Story 3**

- [ ] T012 [P] [US3] Add responsive layout adjustments for the paired row on narrow viewports in `src/components/Sidebar.jsx`
- [ ] T013 [P] [US3] Verify and adjust keyboard focus order for floor buttons in `src/components/Sidebar.jsx`
- [ ] T014 [P] [US3] Add ARIA labels to floor buttons for screen reader accessibility in `src/components/Sidebar.jsx`

## Phase 6: Polish & Cross‑Cutting Concerns

**Purpose**: Improvements affecting multiple stories and final validation.

- [ ] T015 [P] [All] Update documentation in `README.md` to describe the new 5F/5M paired row behavior
- [ ] T016 [P] [All] Enhance `quickstart.md` with step‑by‑step validation instructions for the paired row
- [ ] T017 [P] [All] Perform manual desktop and mobile testing at 320 px width to verify all acceptance criteria

**Dependencies & Execution Order**

- **Setup (Phase 1)**: No dependencies – can start immediately
- **Foundational (Phase 2)**: Must complete before any user story work
- **User Stories (Phase 3+)**: All depend on Foundational completion; stories can run in parallel or sequentially by priority

**Parallel Opportunities**

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel
- Once Foundational is complete, user stories can start in parallel if team capacity allows
- Tests for each story marked [P] can run in parallel

**Implementation Strategy**

- MVP First (User Story 1 Only)
  1. Complete Phase 1: Setup
  2. Complete Phase 2: Foundational (CRITICAL)
  3. Complete Phase 3: User Story 1
  4. Validate User Story 1 independently
  5. Deploy/Demo if ready

- Incremental Delivery
  1. Setup + Foundational → Foundation ready
  2. Add User Story 1 → Test → Deploy (MVP!)
  3. Add User Story 2 → Test → Deploy
  4. Add User Story 3 → Test → Deploy
  5. Each story adds value without breaking previous stories

**Notes**
- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid vague tasks, same‑file conflicts, cross‑story dependencies that break independence