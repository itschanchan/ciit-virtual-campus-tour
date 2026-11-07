# Tasks: Fix Sidebar Buttons

**Input**: Design documents from `/specs/008-fix-sidebar-buttons/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test tasks ARE included — required by Constitution Principle III (Test-First Quality Gate, NON-NEGOTIABLE) and by the bug-fix regression-test rule. Sidebar button click behavior affects navigation/panorama controls, so Vitest tests are mandatory. Tests are written FIRST and must FAIL before implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- Web app: `apps/frontend/src/` for source, `apps/frontend/src/tests/` for tests

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm existing project structure and test tooling; no new directories or dependencies needed for this UI fix.

- [x] T001 Verify project structure — Sidebar.jsx exists at apps/frontend/src/components/Sidebar.jsx; no new directories or source files required
- [x] T002 [P] Confirm Vitest configured for component tests (apps/frontend/package.json "test": "vitest run")

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core checks that MUST be complete before ANY user story can be implemented. No new shared infrastructure exists beyond what is already configured.

- [x] T003 Confirm no new npm packages required (constitution: no new dependencies without maintainer approval and docs/tech_stack.md update)

**Checkpoint**: Foundation ready — existing React/Vite/Vitest setup suffices; user story implementation can now begin.

## Phase 3: User Story 1 - Click an available floor button to view its panorama tile (Priority: P1) 🎯 MVP

**Goal**: A visitor clicks a sidebar floor button for a floor with an available panorama tile and the viewer switches to that floor's scene.

**Independent Test**: Open the tour, identify a floor button that has an available panorama tile (e.g., LG, UG, 4F–9F), click it, and confirm the viewer switches to that floor's panorama scene and the button is not disabled.

### Tests for User Story 1 (REQUIRED — Constitution Principle III + bug-fix regression test)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T004 [P] [US1] Write failing Vitest test: available floor button is clickable and switches viewer scene in apps/frontend/src/tests/Sidebar.test.jsx

### Implementation for User Story 1

- [x] T005 [P] [US1] Refactor buildFloorItems in apps/frontend/src/components/Sidebar.jsx to match each floor to its location by floor label (not array index)
- [x] T006 [US1] Verify click handler switches panorama viewer via FLOOR_SCENE_MAP[floor] (apps/frontend/src/components/Sidebar.jsx)
- [x] T007 [US1] Verify available buttons are not disabled: disabled = false when floor not locked and location.panorama present (apps/frontend/src/components/Sidebar.jsx)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

## Phase 4: User Story 2 - Identify unavailable floors without being able to click them (Priority: P2)

**Goal**: A visitor can see which floors do not have available panorama tiles; those buttons are visually distinct, disabled, and do not switch the viewer when clicked.

**Independent Test**: Open the tour, identify a floor button without an available panorama tile (e.g., 1F, 2F, 3F, 10F, 11F), confirm it is visually marked as unavailable and disabled, click it, and confirm the viewer does not switch scenes.

### Tests for User Story 2 (REQUIRED — Constitution Principle III)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T008 [P] [US2] Write failing Vitest test: unavailable floor button is disabled and does not switch viewer scene in apps/frontend/src/tests/Sidebar.test.jsx

### Implementation for User Story 2

- [x] T009 [P] [US2] Ensure buttons without a panorama are disabled and visually distinguished in apps/frontend/src/components/Sidebar.jsx
- [x] T010 [US2] Verify locked buttons show "off limits" and do not switch scene (existing behavior, apps/frontend/src/components/Sidebar.jsx)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements and validation that affect all user stories.

- [x] T011 [P] Run frontend lint to confirm no ESLint errors (npm run lint)
- [x] T012 [P] Run Vitest tests and confirm all pass, including new Sidebar tests (npm run test)
- [x] T013 Run quickstart.md validation scenarios to confirm end-to-end behavior (specs/008-fix-sidebar-buttons/quickstart.md)

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed) or sequentially in priority order (P1 → P2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — no dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) — independently testable, no blocking dependency on US1

### Within Each User Story

- Tests MUST be written and FAIL before implementation (Constitution Principle III)
- Refactor mapping logic before verifying click/disabled behavior
- Core implementation before lint/test/polish

### Parallel Opportunities

- Setup tasks T001 and T002 marked [P] can run in parallel
- Foundational task T003 is standalone
- US1 test task T004 [P] is a separate file — can run in parallel with other independent tasks but must FAIL before US1 implementation
- US1 implementation tasks T005 [P] (separate concern: mapping refactor) can run in parallel with T006/T007 ordering considerations; T005 is the core change, T006/T007 verify existing behavior
- US2 test task T008 [P] is a separate file
- US2 implementation tasks T009 [P] and T010 are independent checks
- Polish tasks T011 [P], T012 [P] can run in parallel once implementation is complete
- Different user stories can be worked on in parallel by different team members

## Parallel Example: User Story 1

```bash
# Launch US1 test task together (must fail before implementation):
Task: "Write failing Vitest test: available floor button is clickable and switches viewer scene in apps/frontend/src/tests/Sidebar.test.jsx"

# Launch US1 independent implementation checks together:
Task: "Verify click handler switches panorama viewer via FLOOR_SCENE_MAP[floor] (apps/frontend/src/components/Sidebar.jsx)"
Task: "Verify available buttons are not disabled (apps/frontend/src/components/Sidebar.jsx)"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (mapping fix + click behavior)
   - Developer B: User Story 2 (disabled/visual distinction + locked behavior)
3. Stories complete and integrate independently

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Setup/Foundational/Polish phases carry NO story label
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD per Constitution Principle III)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same-file conflicts, cross-story dependencies that break independence
