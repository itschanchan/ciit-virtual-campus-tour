# Tasks: Fix Off-Limits Popover Duplicate Message

**Input**: Design documents from `/specs/031-fix-off-limits-popover/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/popover-behavior.md, quickstart.md

**Tests**: Included because constitution Principle III requires bug fixes to ship a regression test that fails without the fix, and `research.md` Decision 6 calls for fake-timer lifecycle tests.

**Organization**: Tasks are grouped by user story so each story can be verified independently. The shared notice-state refactor is isolated in the Foundational phase because all three stories depend on it.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a web application. All work is under `apps/frontend/`:

- Component: `apps/frontend/src/components/Sidebar.jsx`
- Tests: `apps/frontend/src/tests/Sidebar.test.jsx`
- Feature docs: `specs/031-fix-off-limits-popover/`

---

## Phase 1: Setup (Baseline)

**Purpose**: Establish the current failing baseline and confirm no dependency changes are needed.

- [X] T001 Run the baseline Sidebar tests and record the current failures (the stale 1.5 s delayed-show test plus any blank/duplicate lifecycle output) with `npm --prefix apps/frontend run test -- --run src/tests/Sidebar.test.jsx`
- [X] T002 [P] Confirm no new packages are required by reviewing `apps/frontend/package.json` and verifying installed dependencies with `npm install`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Refactor the notice lifecycle so visibility is separate from content. All user stories depend on this.

**⚠️ CRITICAL**: No user story verification can begin until this phase is complete.

- [X] T003 Refactor notice state in `apps/frontend/src/components/Sidebar.jsx`: add `noticeOpen` (visibility) while keeping `notice` (`{ floor, anchorEl }`) stable through the exit; add small helpers `scheduleNoticeHide`, `dismissNotice`, and `handleNoticeExited`
- [X] T004 Update lifecycle handlers in `apps/frontend/src/components/Sidebar.jsx`: `handleLockedFloor` sets content, opens the notice, and restarts the hide timer without clearing content; `useEffect` cleanup clears timers; sidebar-close cancels the notice
- [X] T005 Wire the Popover in `apps/frontend/src/components/Sidebar.jsx`: `open={open && noticeOpen}`, `onClose={dismissNotice}`, `slotProps.transition.onExited={handleNoticeExited}`, preserve `role="status"` and `aria-live="polite"`

**Checkpoint**: The shared state machine is in place; user story tests can now verify each behavior.

---

## Phase 3: User Story 1 - See one clear message when an off-limits floor is selected (Priority: P1) 🎯 MVP

**Goal**: Selecting an off-limits floor shows exactly one complete message that hides on its own with no blank or duplicate frame.

**Independent Test**: Render `Sidebar`, select `1F OFF LIMITS`, assert exactly one `role="status"` with `1F is coming soon.` immediately; advance the timer and exit transition and assert the blank form never appears and the notice is gone.

### Tests for User Story 1

> **NOTE: Write these tests FIRST and confirm they FAIL before final implementation.**

- [X] T006 [US1] Add a regression test in `apps/frontend/src/tests/Sidebar.test.jsx` asserting exactly one `role="status"`, the exact text `1F is coming soon.` from selection through the hide timer and exit, and that `is coming soon.` without a floor label never appears
- [X] T007 [US1] Replace the stale `waits 1.5 seconds before showing a locked-floor popover` test in `apps/frontend/src/tests/Sidebar.test.jsx` with an immediate-display + ~2 s auto-hide test

### Implementation for User Story 1

- [X] T008 [US1] Verify and finish the auto-hide path in `apps/frontend/src/components/Sidebar.jsx` so the timer only sets `noticeOpen = false` and the label/anchor persist until `onExited`; remove any residual `setNotice(null)` on that path
- [X] T009 [US1] Confirm the accessibility contract in `apps/frontend/src/components/Sidebar.jsx`: one live region, full floor label announced once, no duplicate portal

**Checkpoint**: User Story 1 is fully functional and independently testable.

---

## Phase 4: User Story 2 - Selecting another off-limits floor replaces the message cleanly (Priority: P2)

**Goal**: Switching or repeating off-limits floors updates the single existing notice; it never stacks, flickers, or shows a stale floor.

**Independent Test**: Select `1F`, then `2F` before the first hides; assert one `role="status"` reading `2F is coming soon.`; repeat the same floor and assert the timer restarts with no second notice.

### Tests for User Story 2

- [X] T010 [US2] Add tests in `apps/frontend/src/tests/Sidebar.test.jsx` for rapid switching (`1F` → `2F`) and repeated same-floor selection: exactly one status, latest label, and a restarted hide timer

### Implementation for User Story 2

- [X] T011 [US2] Update `handleLockedFloor` in `apps/frontend/src/components/Sidebar.jsx` to replace `floor` and `anchorEl` and restart the hide timer while keeping `noticeOpen` true (no close/reopen cycle)
- [X] T012 [US2] Add a guard in `apps/frontend/src/components/Sidebar.jsx` so a stale `onExited` from an interrupted exit cannot clear a newly selected notice

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Dismiss the message deliberately (Priority: P3)

**Goal**: Escape, backdrop click, or closing the floor list dismisses the notice immediately, cancels pending timers, and never lets it reappear.

**Independent Test**: Show a notice, press `Escape`, and assert it disappears with no reappearance; show `11F` and close the sidebar, then assert the notice is gone and no timer fires afterward.

### Tests for User Story 3

- [X] T013 [US3] Add tests in `apps/frontend/src/tests/Sidebar.test.jsx` for Escape/backdrop dismissal, sidebar-close cancellation, and no reappearance after dismissal
- [X] T014 [US3] Add a reduced-motion dismissal test in `apps/frontend/src/tests/Sidebar.test.jsx` (mock `matchMedia`) verifying one complete notice and no duplicate

### Implementation for User Story 3

- [X] T015 [US3] Route sidebar close (the `open` effect) and Popover `onClose` through `dismissNotice` in `apps/frontend/src/components/Sidebar.jsx`, clearing the hide timer in both paths
- [X] T016 [US3] Ensure a dismissal during the exit transition cannot re-show the notice and that closing the sidebar leaves no pending timer in `apps/frontend/src/components/Sidebar.jsx`

**Checkpoint**: All three user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, full validation, and cleanup across stories.

- [X] T017 [P] Update `specs/031-fix-off-limits-popover/quickstart.md` and `specs/031-fix-off-limits-popover/contracts/popover-behavior.md` if implementation details (timing, labels, forbidden states) changed during the work
- [X] T018 Run the full frontend suite, lint, and build; fix any failures with `npm --prefix apps/frontend run test`, `npm run lint`, and `npm run build`
- [ ] T019 [P] Validate manually per `specs/031-fix-off-limits-popover/quickstart.md` at desktop, tablet, and mobile widths and with reduced motion enabled; record results
- [X] T020 [P] Remove debug logging or temporary files and confirm KISA style (max three indent levels, small helpers) in `apps/frontend/src/components/Sidebar.jsx`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; start immediately. T001 and T002 can run in parallel.
- **Foundational (Phase 2)**: Depends on Setup; T003 → T004 → T005 (same file, sequential).
- **User Stories (Phases 3–5)**: Each depends on Foundational completion.
  - **US1 (P1)**: First; establishes the verified single-message lifecycle.
  - **US2 (P2)**: After US1; extends the same lifecycle for switching/repeat.
  - **US3 (P3)**: After US1; extends the same lifecycle for dismissal.
  - US2 and US3 both edit `Sidebar.jsx` and `Sidebar.test.jsx`, so run them sequentially rather than concurrently.
- **Polish (Phase 6)**: Depends on all desired user stories.

### User Story Dependencies

- **US1 (P1)**: No dependencies beyond Foundational. MVP.
- **US2 (P2)**: Depends on US1's verified single-notice lifecycle.
- **US3 (P3)**: Depends on US1's verified single-notice lifecycle; independent of US2.

### Within Each User Story

- Tests must be written and observed failing before the matching implementation is completed.
- Story-specific implementation tasks edit the same `Sidebar.jsx`, so keep them sequential.
- Complete and validate a story before moving to the next priority.

### Parallel Opportunities

- T001 and T002 (setup) can run in parallel.
- Tests within a story all edit the same `Sidebar.test.jsx`, so they are not safely parallel.
- After implementation, T017 (docs) and T020 (cleanup) can run in parallel; T019 (manual validation) can run alongside them.
- T018 (full suite/lint/build) runs after all code and test edits.

---

## Parallel Example: Setup

```text
# Launch together:
Task: "T001 Run baseline Sidebar tests"
Task: "T002 Confirm no new packages are required"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational refactor.
3. Complete Phase 3: User Story 1 (tests first, then implementation).
4. **STOP and VALIDATE**: Run `Sidebar.test.jsx` and confirm one complete message with no blank/duplicate.
5. Demo the fix.

### Incremental Delivery

1. Setup + Foundational → lifecycle refactor ready.
2. US1 → validate single complete message → demo (MVP).
3. US2 → validate switching/repeat → demo.
4. US3 → validate dismissal/sidebar close → demo.
5. Polish → full suite, lint, build, manual matrix.

### Notes

- The uncommitted partial edit to `apps/frontend/src/components/Sidebar.jsx` (removing `onExited`) is superseded by T003–T005; restore `onExited` for post-exit content cleanup while keeping a single dismiss path.
- Commit after each task or logical group.
- Stop at any checkpoint to validate a story independently.
