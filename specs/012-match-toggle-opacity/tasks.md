# Tasks: Match Sidebar Toggle Opacity to Sidebar

**Input**: Design documents from `/specs/012-match-toggle-opacity/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - not explicitly requested in feature specification. Constitution Principle III requires Vitest tests for navigation controls; a visual regression check is recommended but not mandated as a task task here.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

No setup tasks required — the project is already initialized with all dependencies installed. No new npm packages or directories are needed for this visual-only change.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

No foundational tasks required — no new infrastructure, database, or shared services are affected by this frontend-only visual fix.

---

## Phase 3: User Story 1 - Toggle button visually blends with the sidebar edge (Priority: P1) 🎯 MVP

**Goal**: Make the sidebar toggle button background opacity match the sidebar background opacity (bg-surface/86) so the toggle reads as one continuous piece attached to the sidebar edge rather than a separate element with different solidity.

**Independent Test**: Open and close the sidebar and confirm the toggle button's background opacity equals the sidebar background opacity throughout the animation, with no visible seam or detachment at the junction.

### Tests for User Story 1 (OPTIONAL - only if tests requested)

No test tasks requested in feature specification. Constitution Principle III mandates Vitest tests for navigation controls; if tests are desired, add `apps/frontend/src/tests/Sidebar.test.jsx` verifying toggle background opacity matches sidebar.

### Implementation for User Story 1

- [X] T001 [US1] Change sidebar toggle background class from `bg-surface` to `bg-surface/86` in `apps/frontend/src/components/Sidebar.jsx` to match sidebar opacity
- [X] T002 [US1] Verify toggle button height remains `h-45` (unchanged) in `apps/frontend/src/components/Sidebar.jsx`
- [X] T003 [US1] Verify toggle borders remain `border border-l-0 border-line` (no left border at sidebar junction) in `apps/frontend/src/components/Sidebar.jsx`

**Checkpoint**: User Story 1 is complete when the toggle button background opacity matches the sidebar opacity (86%), height is unchanged, and no double-border seam appears at the sidebar edge.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect the completed user story

- [X] T004 [P] Run frontend lint: `npm run lint` — confirm no ESLint errors in `apps/frontend/src/components/Sidebar.jsx`
- [X] T005 [P] Run frontend tests: `npm run test` — confirm all Vitest tests pass in `apps/frontend/src/tests/`
- [X] T006 [P] Validate quickstart scenarios in `specs/012-match-toggle-opacity/quickstart.md` — confirm opacity match on desktop and compact mobile viewports

**Checkpoint**: All validation passes; the toggle button reads as attached to the sidebar edge with matching opacity.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — project already initialized
- **Foundational (Phase 2)**: No dependencies — no blocking infrastructure
- **User Stories (Phase 3)**: Depends on Setup and Foundational completion — no additional blockers
- **Polish (Phase 4)**: Depends on User Story 1 implementation (T001–T003)

### User Story Dependencies

- **User Story 1 (P1)**: Can start immediately — no dependencies on other stories (only story in this feature)

### Within User Story 1

- T001 (implementation) must complete before T002 and T003 (verification of constraints)
- T002 and T003 are independent of each other and can run in parallel after T001

### Parallel Opportunities

- T004 (lint), T005 (tests), and T006 (quickstart validation) in Phase 4 are all parallelizable ([P] marked) — they operate on different files/commands with no interdependencies

---

## Parallel Example: Phase 4

```bash
# Launch all Phase 4 validation tasks together:
npm run lint
npm run test
# Manual: open sidebar and confirm toggle opacity matches sidebar on desktop and compact mobile
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (no-op — project already initialized)
2. Complete Phase 2: Foundational (no-op — no blocking infrastructure)
3. Complete Phase 3: User Story 1 (T001 → T002, T003)
4. **STOP and VALIDATE**: Confirm toggle opacity matches sidebar edge visually
5. Complete Phase 4: Polish (T004, T005, T006 in parallel)

### Incremental Delivery

This is a single-story feature (P1 only). MVP = complete User Story 1. No incremental delivery across multiple stories is needed.

### Parallel Team Strategy

Only one developer needed — single file change in `Sidebar.jsx`. Phase 4 validation tasks can run in parallel after implementation.

---

## Notes

- [P] tasks = different files/commands, no dependencies on incomplete tasks
- [US1] label maps task to User Story 1 for traceability
- Each task includes exact file paths for executable clarity
- Single user story means no cross-story dependency concerns
- Toggle height (`h-45`) and border configuration (`border border-l-0 border-line`) must remain unchanged per earlier constraints
