---

description: "Task list for Sidebar 5F and 5M Paired Row"
---

# Tasks: Sidebar 5F and 5M Paired Row

**Input**: Design documents from `/specs/005-sidebar-floor-pair-row/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Included. Constitution Principle III (Test-First Quality Gate) is non-negotiable and plan.md extends `Sidebar.test.jsx`. Vitest, Testing Library, and jsdom remain deferred by the maintainer, so test tasks are written now and execute only once that tooling is restored.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app (this feature)**: frontend only under `apps/frontend/src/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the baseline and gather the content facts the change relies on.

- [X] T001 Verify the current frontend baseline passes by running `npm run lint` and `npm run build`, and confirm no new dependency is declared in apps/frontend/package.json
- [X] T002 [P] Identify the 5F and 5M tour locations and their ids in apps/frontend/src/lib/catalog.json for use in tests and manual checks

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Derive the display rows that every user story renders from.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 [P] Write failing unit tests for display-row grouping and ordering in apps/frontend/src/tests/Sidebar.test.jsx (5M and 5F share one row; every other floor is a single row; the descending order is preserved)
- [X] T004 Add a `buildFloorRows(items)` helper in apps/frontend/src/components/Sidebar.jsx that maps the ordered floor entries into display rows with exactly one declared pair, 5M then 5F (depends on T003)

**Checkpoint**: Display rows are derived from the ordered floor list; user story work can begin

---

## Phase 3: User Story 1 - See 5F and 5M on one row (Priority: P1) 🎯 MVP

**Goal**: Show 5F and 5M next to each other in one centered row while every other floor keeps its own centered row.

**Independent Test**: Open the sidebar at a desktop width and confirm 5F and 5M are the only two floors sharing one row, that every other floor is on its own row, and that all buttons sit horizontally centered in the column.

### Implementation for User Story 1

- [X] T005 [US1] Render the paired row from the grouped rows as a centered group of two content-sized `FloorButton` controls in apps/frontend/src/components/Sidebar.jsx (depends on T004)
- [X] T006 [US1] Center every floor button horizontally within the sidebar column instead of left-aligning it in apps/frontend/src/components/Sidebar.jsx (depends on T005)
- [X] T007 [US1] Add tests asserting 5F and 5M share one row, that 4F and 6F stay on their own rows, that the descending order is preserved, and that the centered layout class is applied in apps/frontend/src/tests/Sidebar.test.jsx (depends on T005, T006)

**Checkpoint**: User Story 1 is fully functional and testable independently

---

## Phase 4: User Story 2 - Use each paired floor independently (Priority: P2)

**Goal**: Keep 5F and 5M as two separate controls whose selection, current, locked, unavailable, and disabled states never affect each other.

**Independent Test**: Activate 5F and 5M separately and confirm each produces only its own response, with state styling shown per floor.

### Implementation for User Story 2

- [X] T008 [US2] Pass per-floor props (current, locked, availability, status, `onSelect`, `onLocked`) to each button in the grouped pair so state stays independent in apps/frontend/src/components/Sidebar.jsx (depends on T005)
- [X] T009 [US2] Add tests asserting that activating 5F or 5M affects only that floor and that current, locked, unavailable, and disabled styling is applied per button in apps/frontend/src/tests/Sidebar.test.jsx (depends on T008)

**Checkpoint**: User Stories 1 and 2 both work independently

---

## Phase 5: User Story 3 - Paired row on small screens and assistive technology (Priority: P3)

**Goal**: Keep both labels readable in one row on narrow viewports and keep each floor individually reachable and announced.

**Independent Test**: At a narrow viewport and with keyboard navigation, confirm both labels stay legible in one row, both buttons are focusable, and each is announced as a separate floor.

### Implementation for User Story 3

- [X] T010 [US3] Let each paired button size to its content and allow label and status text to wrap so the pair stays in one row and readable at 320 CSS pixels in apps/frontend/src/components/Sidebar.jsx (depends on T005)
- [X] T011 [US3] Wrap the pair in a labelled group and keep the DOM order 5M then 5F so keyboard focus and screen readers reach each floor separately in apps/frontend/src/components/Sidebar.jsx (depends on T005)
- [X] T012 [US3] Add tests for keyboard focus order, the group label, and independent per-floor announcement in apps/frontend/src/tests/Sidebar.test.jsx (depends on T010, T011)

**Checkpoint**: All user stories are independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T013 [P] Run the quickstart scenarios and record pass/fail evidence in specs/005-sidebar-floor-pair-row/quickstart.md
- [X] T014 Run `npm run lint` and `npm run build` for apps/frontend and fix any reported issues in apps/frontend/src/components/Sidebar.jsx
- [X] T015 [P] Confirm no dependency, tour-content, or backend changes were introduced in apps/frontend/package.json and apps/frontend/src/lib/catalog.json

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on the paired row from US1 but stays independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Builds on the paired row from US1 but stays independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Grouping helper before rendering
- Rendering before per-floor state wiring
- Rendering before responsive and accessibility behaviour
- Story complete before moving to the next priority

### Parallel Opportunities

- Setup: T002 can run alongside T001
- Foundational: T003 can start while T001-T002 wrap up
- Test tasks (T007, T009, T012) all edit `apps/frontend/src/tests/Sidebar.test.jsx`, so they cannot run in parallel with each other
- Implementation tasks T005-T006, T008, T010-T011 all edit `apps/frontend/src/components/Sidebar.jsx`, so they cannot run in parallel with each other
- Polish: T013 and T015 can run in parallel once stories are complete

---

## Parallel Example: Setup and Foundational

```bash
# Launch the independent, different-file startup work together:
Task: "Identify the 5F and 5M tour locations and their ids in apps/frontend/src/lib/catalog.json"
Task: "Write failing unit tests for display-row grouping and ordering in apps/frontend/src/tests/Sidebar.test.jsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Confirm 5F and 5M share one centered row and every other floor keeps its own row
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → display rows ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Do not install Vitest, Testing Library, or jsdom without maintainer approval
- Run lint, build, and the manual quickstart scenarios as interim evidence while test tooling stays deferred
- Commit after each task or logical group
- Stop at any checkpoint to validate a story independently
- Avoid: vague tasks, same-file conflicts, cross-story dependencies that break independence

---

## Implementation Notes (2026-11-06)

- All tasks T001-T015 are complete.
- T002 result: `apps/frontend/src/lib/catalog.json` defines only one location, so 5F and 5M have no mapped location. The pair renders as two label-only (unavailable/disabled) buttons; grouping still applies.
- Change summary: `apps/frontend/src/components/Sidebar.jsx` adds `PAIRED_FLOORS`, `buildFloorRows`, `FloorPair`, and `FloorRow`, and now renders one display row per list item with each row's content centered (`li` uses `flex justify-center`). The pair is a `role="group"` labelled "Fifth-floor levels" containing 5M then 5F.
- `apps/frontend/src/tests/Sidebar.test.jsx` gains cases for pairing, ordering, centering, independent activation, per-floor current state, and the labelled group.
- Evidence captured: `npm run lint` exits 0; `npm run build` exits 0 and emits `apps/frontend/dist/`.
- Test-tooling note: Vitest, Testing Library, and jsdom remain absent from `apps/frontend/package.json`, so `npm run test` cannot execute. This is the constitution Principle III deferral recorded in plan.md; the new tests are written and will run once tooling is restored.
- Naming detail: `specs/005-...` reuses the existing `buildAvailableLocations` test-helper pattern so 5F and 5M map to floor indices 6 and 7.
- Environment note: `npm run verify:content` fails on a pre-existing missing `specs/001-campus-tour-foundation/contracts/content-schema.json`; unrelated to this change.
