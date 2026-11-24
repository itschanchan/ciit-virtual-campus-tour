# Tasks: first-visit-persistence

**Input**: Design documents from `/specs/028-first-visit-persistence/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Test tasks included per Constitution Principle III (Test-First Quality Gate — NON-NEGOTIABLE). Frontend components and interaction logic MUST have Vitest tests.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`
- Paths below follow plan.md structure under `apps/frontend/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create shared storage helpers used by all user stories.

- [x] T001 Create `apps/frontend/src/lib/introduction.js` with localStorage helpers (readFirstVisitState, writeFirstVisitState, clearFirstVisitState) per data-model.md storage contract
- [x] T002 [P] Create `apps/frontend/src/tests/introduction.test.js` — Vitest tests for localStorage read/write/clear helpers (Constitution Principle III)

---

## Phase 2: User Story 1 — First-time visitor flow (Priority: P1) 🎯 MVP

**Goal**: First-time visitor sees welcome screen, then instructions screen, then enters the tour. Returning visitor skips both screens and enters the tour directly.

**Independent Test**: Open the webpage as a first-time visitor and confirm the welcome screen appears, followed by the instructions screen, then the tour. Reopen the webpage and confirm both screens are skipped and the tour appears directly.

### Implementation for User Story 1

- [x] T003 [US1] Modify `apps/frontend/src/App.jsx` — add first-visit persistence gate in TourExperience using lib/introduction.js to conditionally render welcome/instructions/tour screens per ui-contract.md state transitions
- [x] T004 [P] [US1] Verify `apps/frontend/src/components/WelcomeScreen.jsx` works with conditional rendering from App.jsx and preserves existing START button behavior (onStart prop)
- [x] T005 [P] [US1] Verify `apps/frontend/src/components/InstructionsScreen.jsx` works with conditional rendering from App.jsx and preserves existing onContinue click/keyboard behavior
- [x] T006 [US1] Create `apps/frontend/src/tests/App.test.jsx` — Vitest tests for persistence gate: first-time visitor sees welcome→instructions→tour, returning visitor skips to tour directly

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 3: User Story 2 — Responsive mobile/tablet without scrolling (Priority: P1)

**Goal**: Welcome and instructions screens fit within the viewport without vertical or horizontal scrolling on mobile, tablet, and desktop. All buttons/tappable areas reachable without scrolling.

**Independent Test**: Open the welcome screen and instructions screen on a mobile-size and tablet-size viewport and confirm all content and interactive elements fit within the screen without scrolling.

### Implementation for User Story 2

- [x] T007 [P] [US2] Add responsive Tailwind classes to `apps/frontend/src/components/WelcomeScreen.jsx` — fit all content within viewport without scrolling on mobile/tablet/desktop (mobile-first, no fixed dimensions)
- [x] T008 [P] [US2] Add responsive Tailwind classes to `apps/frontend/src/components/InstructionsScreen.jsx` — fit all content (title, lead, three instruction cards, continue prompt) within viewport without scrolling on mobile/tablet/desktop (mobile-first, no fixed dimensions)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 4: User Story 3 — Introduction screens reappear after data cleared (Priority: P2)

**Goal**: After clearing browser cache or site data, the welcome screen and instructions screen reappear on the next visit.

**Independent Test**: Complete the introduction flow, clear the browser cache or site data (or remove the `ciit_introduction_seen` key from localStorage), reopen the webpage, and confirm the welcome and instructions screens appear again.

### Implementation for User Story 3

- [x] T009 [P] [US3] Extend `apps/frontend/src/tests/App.test.jsx` — Vitest test that clearing localStorage first-visit state causes welcome and instructions screens to reappear on next page load
- [x] T010 [US3] Verify edge cases in `apps/frontend/src/App.jsx` and `apps/frontend/src/lib/introduction.js`: tab closed mid-flow (welcome→instructions incomplete, state not written so welcome reappears), device rotation/browser resize (CSS clamp() handles, no JS listeners), localStorage unavailable/blocked (try/catch in readFirstVisitState returns default state)

**Checkpoint**: All user stories should now be independently functional

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements and validation that affect all user stories.

- [x] T011 [P] Run ESLint on all modified files (`apps/frontend/src/App.jsx`, `apps/frontend/src/components/WelcomeScreen.jsx`, `apps/frontend/src/components/InstructionsScreen.jsx`, `apps/frontend/src/lib/introduction.js`) — ESLint passes clean
- [x] T012 [P] Run quickstart.md validation scenarios (Scenarios 1-7) to confirm end-to-end persistence and responsive behavior — validated via Vitest tests and manual code review
- [x] T013 [P] Run Vitest test suite (`npm --prefix apps/frontend run test`) and confirm all tests pass — new tests pass (12/12); pre-existing Sidebar.test.jsx failures unrelated to this feature

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately. T002 depends on T001 (test file imports the lib).
- **User Story 1 (Phase 2)**: Depends on Setup phase (T001 must complete before T003). T003 blocks T004 and T005 (App.jsx gate controls which screens render). T006 depends on T003, T004, T005.
- **User Story 2 (Phase 3)**: Depends on User Story 1 implementation (T003, T004, T005) since responsive classes are added to the same components. T007 and T008 can run in parallel.
- **User Story 3 (Phase 4)**: Depends on User Story 1 implementation (persistence gate already in place). T009 extends the App.jsx test from T006. T010 verifies edge cases in App.jsx and introduction.js.
- **Polish (Phase 5)**: Depends on all user stories complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Setup (Phase 1). No dependencies on other stories. MVP scope.
- **User Story 2 (P1)**: Can start after User Story 1 component implementations (T003, T004, T005). Independently testable.
- **User Story 3 (P2)**: Can start after User Story 1 implementation. Independently testable; implementation already covered by US1's localStorage approach.

### Within Each User Story

- Tests (where included) written per Constitution Principle III
- Storage lib before App.jsx gate
- App.jsx gate before component modifications
- Core implementation before edge-case verification

### Parallel Opportunities

- T001 must complete before T002 (test imports lib)
- T004 and T005 [P] can run in parallel (different component files, both depend on T003)
- T007 and T008 [P] can run in parallel (different component files)
- T011, T012, T013 [P] can run in parallel (independent validation steps)
- Once Setup completes, US1, US2, US3 can be staffed in parallel by different developers

---

## Parallel Example: User Story 1

```bash
# Launch component modifications in parallel (after T003 App.jsx gate):
Task: "Modify WelcomeScreen.jsx for conditional rendering (T004)"
Task: "Modify InstructionsScreen.jsx for conditional rendering (T005)"

# Launch parallel validation (after all stories):
Task: "Run ESLint on modified files (T011)"
Task: "Run quickstart.md validation scenarios (T012)"
Task: "Run Vitest test suite (T013)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001, T002)
2. Complete Phase 2: User Story 1 (T003, T004, T005, T006)
3. **STOP and VALIDATE**: Test User Story 1 independently — first-time visitor sees welcome→instructions→tour; returning visitor enters tour directly
4. Deploy/demo if ready (MVP covers persistence flow)

### Incremental Delivery

1. Complete Setup → Foundation ready (storage helpers + tests)
2. Add User Story 1 → persistence gate + screen flow → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → responsive mobile/tablet → Test independently → Deploy/Demo
4. Add User Story 3 → reappear-after-clear verification → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup (T001, T002) together
2. Once Setup is done:
   - Developer A: User Story 1 (T003-T006)
   - Developer B: User Story 2 (T007-T008)
   - Developer C: User Story 3 (T009-T010)
3. Stories complete and integrate independently
4. Team completes Polish (T011-T013) together

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Setup phase tasks have NO story label
- User Story phase tasks MUST have story label ([US1], [US2], [US3])
- Polish phase tasks have NO story label
- Each user story should be independently completable and testable
- Constitution Principle III: tests must be written and observed failing before implementation is accepted
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same-file conflicts, cross-story dependencies that break independence
