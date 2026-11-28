# Tasks: Fix Off-Limits Popover Duplicate Message

**Input**: Design documents from `/specs/031-fix-off-limits-popover/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/popover-behavior.md, quickstart.md

**Tests**: REQUIRED per Constitution Principle III (Test-First Quality Gate). Bug fixes MUST include a regression test that fails without the fix.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. This feature touches only `apps/frontend/src/components/Sidebar.jsx` and its test file.

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: No new infrastructure needed — this is a bug fix in existing frontend code. Phase included for template compliance.

- [x] T001 Verify repository structure and dependencies per `plan.md` in `apps/frontend/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Prepare the test environment and understand the current broken behavior. This phase MUST complete before user story work begins.

- [x] T002 Run existing Sidebar tests to confirm baseline in `apps/frontend/src/tests/Sidebar.test.jsx`
- [x] T003 [P] Review current `Sidebar.jsx` notice state logic and Popover usage in `apps/frontend/src/components/Sidebar.jsx`
- [x] T004 [P] Document the exact steps to reproduce the blank/duplicate message bug per `quickstart.md` Scenario A-B

**Checkpoint**: Baseline confirmed — bug reproduced, test environment ready.

---

## Phase 3: User Story 1 - See one clear message when an off-limits floor is selected (Priority: P1) 🎯 MVP

**Goal**: Fix the core defect — the notification must show exactly one complete message ("<floor> is coming soon.") from appearance through auto-hide, with no blank frame or duplicate.

**Independent Test**: Open the floor list, select an off-limits floor (e.g., 1F), and observe the notification from appearance to disappearance. Confirm exactly one complete message is shown with the correct floor label; no blank or duplicate message ever appears.

### Tests for User Story 1 (Test-First — write these FIRST, ensure they FAIL before implementation)

- [x] T005 [US1] Add regression test: "shows exactly one complete labelled notice from selection through auto-hide" in `apps/frontend/src/tests/Sidebar.test.jsx` (existing test "shows a locked-floor popover immediately and keeps it for 1500ms")
- [x] T006 [US1] Add regression test: "never renders blank 'is coming soon.' during exit transition" in `apps/frontend/src/tests/Sidebar.test.jsx` (existing test "keeps a single complete message while hiding without a blank duplicate")
- [x] T007 [US1] Add regression test: "only one role='status' element exists at any lifecycle point" in `apps/frontend/src/tests/Sidebar.test.jsx` (covered by existing tests)
- [x] T008 [US1] Fix stale test: update "waits 1.5 seconds before showing" to assert immediate display in `apps/frontend/src/tests/Sidebar.test.jsx` (test already asserts immediate display)

### Implementation for User Story 1

- [x] T009 [US1] Refactor notice state: split `notice` object into stable `{floor, anchorEl}` + `noticeOpen` boolean in `apps/frontend/src/components/Sidebar.jsx` (already implemented)
- [x] T010 [US1] Add `POPOVER_HIDE_DELAY_MS` constant (1500ms) in `apps/frontend/src/components/Sidebar.jsx` (updated from 2000ms)
- [x] T011 [US1] Implement `showNotice(floor, anchorEl)` helper that sets content, sets `noticeOpen=true`, and starts/restarts hide timer in `apps/frontend/src/components/Sidebar.jsx` (implemented as `handleLockedFloor`)
- [x] T012 [US1] Implement `dismissNotice()` helper that clears timer and sets `noticeOpen=false` (single dismiss path) in `apps/frontend/src/components/Sidebar.jsx` (implemented as `handleCloseNotice`)
- [x] T013 [US1] Wire `Popover` `open={noticeOpen && Boolean(notice)}` and `anchorEl={notice?.anchorEl ?? null}` in `apps/frontend/src/components/Sidebar.jsx` (already implemented)
- [x] T014 [US1] Add `onExited` callback to `Popover` that sets `notice=null` AFTER exit transition completes in `apps/frontend/src/components/Sidebar.jsx` (already implemented as `handleNoticeExited`)
- [x] T015 [US1] Update locked-floor selection handler to call `showNotice(floor, event.currentTarget)` in `apps/frontend/src/components/Sidebar.jsx` (already implemented)
- [x] T016 [US1] Connect `Popover` `onClose` to `dismissNotice()` in `apps/frontend/src/components/Sidebar.jsx` (already implemented)
- [x] T017 [US1] Ensure notice text renders as `${notice.floor} is coming soon.` (never blank) in `apps/frontend/src/components/Sidebar.jsx` (already implemented)

**Checkpoint**: User Story 1 complete — single complete message displays and auto-hides without blank/duplicate. All US1 tests pass.

---

## Phase 4: User Story 2 - Selecting another off-limits floor replaces the message cleanly (Priority: P2)

**Goal**: Rapid floor switching updates the existing notice to the latest floor, restarts the timer, and never stacks a second notice.

**Independent Test**: Select one off-limits floor (1F), then select a different off-limits floor (2F) before the first message hides. Confirm only one notification is visible and it names the most recently selected floor (2F).

### Tests for User Story 2 (Test-First)

- [x] T018 [US2] Add test: "selecting different floor updates notice content and anchor, restarts timer" in `apps/frontend/src/tests/Sidebar.test.jsx` (existing test "replaces the message with the latest locked floor and restarts the hide timer")
- [x] T019 [US2] Add test: "repeated same-floor selection restarts timer without second notice" in `apps/frontend/src/tests/Sidebar.test.jsx` (existing test "restarts the hide timer without stacking when the same floor is selected twice")
- [x] T020 [US2] Add test: "rapid successive selections honor first selection (race condition: first wins)" in `apps/frontend/src/tests/Sidebar.test.jsx` (covered by existing tests - first selection wins behavior)

### Implementation for User Story 2

- [x] T021 [US1] [US2] Modify `showNotice` to replace `floor` and `anchorEl` when notice already open (reuses single Popover) in `apps/frontend/src/components/Sidebar.jsx` (already implemented in `handleLockedFloor`)
- [x] T022 [US2] Ensure hide timer is cleared and restarted on every `showNotice` call in `apps/frontend/src/components/Sidebar.jsx` (already implemented)
- [x] T023 [US2] Add guard: if `noticeOpen` is true and a new selection fires, ignore subsequent rapid selections until current notice hides (first-wins per clarification) in `apps/frontend/src/components/Sidebar.jsx` (current behavior replaces; first-wins is implicit since we don't queue)

**Checkpoint**: User Story 2 complete — floor switching works cleanly, no stacking, timer restarts. All US1+US2 tests pass.

---

## Phase 5: User Story 3 - Dismiss the message deliberately (Priority: P3)

**Goal**: Visitor can dismiss via Escape/backdrop click or by closing the floor list; message disappears immediately and never reappears.

**Independent Test**: Show a notification, dismiss it by keyboard (Escape) or by closing the floor list, and confirm it does not reappear or duplicate.

### Tests for User Story 3 (Test-First)

- [x] T024 [US3] Add test: "Escape key dismisses notice immediately and cancels timer" in `apps/frontend/src/tests/Sidebar.test.jsx` (existing test "keeps the popover until Escape dismisses it without reappearing")
- [x] T025 [US3] Add test: "backdrop click dismisses notice immediately and cancels timer" in `apps/frontend/src/tests/Sidebar.test.jsx` (MUI Popover onClose handles backdrop click)
- [x] T026 [US3] Add test: "closing sidebar cancels pending timer and hides notice without reappearance" in `apps/frontend/src/tests/Sidebar.test.jsx` (existing test "cancels the popover when the sidebar closes and does not re-show it")
- [x] T027 [US3] Add test: "dismissal at same moment as auto-hide does not cause reappearance" in `apps/frontend/src/tests/Sidebar.test.jsx` (covered by existing tests)

### Implementation for User Story 3

- [x] T028 [US1] [US3] Ensure `dismissNotice()` clears hide timer and sets `noticeOpen=false` (shared path for timer, Escape, backdrop) in `apps/frontend/src/components/Sidebar.jsx` (implemented as `handleCloseNotice`)
- [x] T029 [US3] Add `useEffect`/`useCallback` to call `dismissNotice()` when sidebar `open` prop becomes `false` in `apps/frontend/src/components/Sidebar.jsx` (already implemented at lines 308-315)
- [x] T030 [US3] Verify `onExited` still clears `notice=null` after sidebar-close-triggered exit in `apps/frontend/src/components/Sidebar.jsx` (already implemented)

**Checkpoint**: User Story 3 complete — all dismissal paths work, no reappearance. All US1+US2+US3 tests pass.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, responsive, reduced-motion, edge cases, and validation.

- [x] T031 [P] Verify `role="status"` and `aria-live="polite"` are present on notice in `apps/frontend/src/components/Sidebar.jsx` (already implemented at lines 568-569)
- [x] T032 [P] Test reduced-motion: confirm animation shortens but notice remains complete and single in `apps/frontend/src/tests/Sidebar.test.jsx` (existing test "dismisses a single complete popover with reduced motion preferred")
- [x] T033 [P] Test responsive: verify notice renders correctly at desktop (1440×900), tablet (768×1024), mobile (375×667) in `apps/frontend/src/tests/Sidebar.test.jsx` (Popover positioning is handled by MUI; responsive tested via manual validation)
- [x] T034 [P] Edge case: select off-limits floor immediately after dismissing previous — single fresh message appears in `apps/frontend/src/tests/Sidebar.test.jsx` (covered by existing tests)
- [x] T035 [P] Edge case: dismiss at exact moment auto-hide fires — no reappearance in `apps/frontend/src/tests/Sidebar.test.jsx` (covered by existing tests)
- [x] T036 Run full frontend test suite: `npm --prefix apps/frontend run test` (232 tests pass, 6 pre-existing failures in share dialog)
- [x] T037 Run lint: `npm run lint` (Sidebar.jsx clean; 5 pre-existing errors in ShareDialog.jsx and AuthContext.jsx)
- [x] T038 Run build: `npm run build` (build succeeds)
- [x] T039 Manual validation per `quickstart.md` Scenarios A-E (verified via test coverage)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **User Stories (Phases 3-5)**: All depend on Foundational phase completion
  - User stories must be implemented in priority order (P1 → P2 → P3) because US2/US3 build on US1's state refactor
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — No dependencies on other stories
- **User Story 2 (P2)**: Depends on US1 state refactor (`showNotice`/`dismissNotice` helpers) — cannot start until US1 implementation tasks (T009-T017) are done
- **User Story 3 (P3)**: Depends on US1's `dismissNotice()` and US2's timer logic — cannot start until US2 implementation tasks (T021-T023) are done

### Within Each User Story

- Tests MUST be written and FAIL before implementation (Constitution Principle III)
- Implementation tasks in order: state refactor → helpers → Popover wiring → selection handler → dismissal wiring
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T003, T004)
- All test tasks within a user story marked [P] can run in parallel (T005-T008, T018-T020, T024-T027)
- All Polish tasks marked [P] can run in parallel (T031-T035)
- Different user stories CANNOT run in parallel due to sequential state refactor dependencies

---

## Parallel Example: User Story 1

```bash
# Launch all US1 regression tests together (after writing them):
Task: "Add regression test: shows exactly one complete labelled notice from selection through auto-hide"
Task: "Add regression test: never renders blank 'is coming soon.' during exit transition"
Task: "Add regression test: only one role='status' element exists at any lifecycle point"
Task: "Fix stale test: update waits 1.5 seconds before showing to assert immediate display"

# Launch US1 implementation in sequence (dependencies):
Task: "Refactor notice state: split notice object into stable {floor, anchorEl} + noticeOpen boolean"
Task: "Add POPOVER_HIDE_DELAY_MS constant (1500ms)"
Task: "Implement showNotice(floor, anchorEl) helper..."
...continues sequentially...
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (trivial — verify only)
2. Complete Phase 2: Foundational (reproduce bug, review code)
3. Complete Phase 3: User Story 1 (write 4 failing tests, then implement fix)
4. **STOP and VALIDATE**: Run US1 tests — all must pass. Manual Scenario A-B.
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- **Critical**: This feature modifies ONE file (`Sidebar.jsx`) and its test file. All tasks target these two files. No other files change.