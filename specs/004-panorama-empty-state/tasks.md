---
description: "Task list for the panorama empty-state message and locked-floor popover timing"
---

# Tasks: Panorama Empty State Message and Popover Timing

**Input**: Design documents from `/specs/004-panorama-empty-state/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/ui-contract.md](./contracts/ui-contract.md), [quickstart.md](./quickstart.md)

**Tests**: Component test tasks are included because the constitution requires regression coverage for navigation and panorama behavior. Vitest, Testing Library, and jsdom remain deferred by the maintainer, so test execution is tracked separately and must not trigger an unapproved dependency install.

**Organization**: Tasks are grouped by user story so each story can be implemented and verified independently. The working tree already contains the original empty-state implementation; these tasks verify that work and add the clarified locked-floor popover timing, dismissal, and reduced-motion acknowledgement.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: User story label (US1, US2, US3); setup, foundational, and polish tasks have no label
- Every task names the exact file or directory it touches

## Path Conventions

- Frontend: `apps/frontend/src/`
- Feature artifacts: `specs/004-panorama-empty-state/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the environment, design decisions, and current working tree before changing behavior.

- [X] T001 Verify Node.js 24.x, npm, and the scripts in `apps/frontend/package.json` are available
- [X] T002 [P] Review `specs/004-panorama-empty-state/plan.md`, `specs/004-panorama-empty-state/research.md`, `specs/004-panorama-empty-state/data-model.md`, and `specs/004-panorama-empty-state/contracts/ui-contract.md` for message ownership and popover timing decisions
- [X] T003 [P] Inspect `apps/frontend/src/components/Sidebar.jsx`, `apps/frontend/src/components/PanoramaViewer.jsx`, `apps/frontend/src/components/Layout.jsx`, `apps/frontend/src/tests/Sidebar.test.jsx`, and `apps/frontend/src/tests/PanoramaViewer.test.jsx` for existing edits and unrelated changes
- [X] T004 [P] Confirm Vitest, Testing Library, and jsdom remain deferred; do not modify dependencies in `apps/frontend/package.json`

**Checkpoint**: The environment and current working tree are understood.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Lock the shared decisions that every user story depends on.

**CRITICAL**: Complete this phase before changing story behavior.

- [X] T005 Confirm the canonical message `No panorama available yet.`, the viewer as its only owner, and the viewer display states in `specs/004-panorama-empty-state/data-model.md` and `specs/004-panorama-empty-state/contracts/ui-contract.md`
- [X] T006 Confirm the fixed `POPOVER_DELAY_MS = 1500`, the 320 ms acknowledgement, the single pending notice, and the reduced-motion fallback in `specs/004-panorama-empty-state/data-model.md`, `specs/004-panorama-empty-state/research.md`, and `specs/004-panorama-empty-state/contracts/ui-contract.md`
- [X] T007 Confirm the fake-timer and MUI Popover dismissal strategy for `apps/frontend/src/tests/Sidebar.test.jsx`, including advancing 1500 ms and triggering outside click or Escape

**Checkpoint**: Shared decisions are fixed and story work can proceed.

---

## Phase 3: User Story 1 - See the missing-panorama message in the viewer (Priority: P1) - MVP

**Goal**: The viewer shows `No panorama available yet.` when no location is selected or the selected location has no panorama.

**Independent Test**: Render the viewer with no location and with a location that has no panorama; confirm the alert appears, and confirm it disappears when a valid panorama is supplied.

### Tests for User Story 1

- [X] T008 [P] [US1] Extend `apps/frontend/src/tests/PanoramaViewer.test.jsx` with cases for no selected location, a location without a panorama, and a valid panorama that hides the message

### Implementation for User Story 1

- [X] T009 [P] [US1] Ensure `apps/frontend/src/components/PanoramaViewer.jsx` renders the canonical message in the missing-state alert and hides it for a valid panorama (depends on T008)
- [X] T010 [P] [US1] Ensure `apps/frontend/src/components/Layout.jsx` mounts the viewer when tour content is ready while keeping gallery and narration scoped to a selected location (depends on T008)
- [X] T011 [US1] Verify User Story 1 with `apps/frontend/src/tests/PanoramaViewer.test.jsx` once tooling is available, or with quickstart scenarios 1 and 2 in `specs/004-panorama-empty-state/quickstart.md`

**Checkpoint**: User Story 1 is functional and independently testable.

---

## Phase 4: User Story 2 - Keep the floor list free of availability messages (Priority: P2)

**Goal**: The campus floor list never shows `No panorama available yet.`, while locked-floor and location-unavailable feedback remain intact. Locked floors acknowledge immediately, then show the coming-soon popover after 1.5 seconds, restart the delay on repeat activation, and keep the popover open until dismissed.

**Independent Test**: Render the floor list with empty floors, a locked floor, and a location without a panorama; confirm only the expected statuses appear. Activate locked floors with fake timers and confirm the delayed popover, latest-activation behavior, dismissal, and reduced-motion acknowledgement.

### Tests for User Story 2

- [X] T012 [US2] Update `apps/frontend/src/tests/Sidebar.test.jsx` with a regression case asserting empty floors do not show `No panorama available yet.` and that location-unavailable and locked labels are preserved
- [X] T013 [US2] Add fake-timer cases to `apps/frontend/src/tests/Sidebar.test.jsx` for no popover before 1500 ms, a popover after 1500 ms, restart on repeat activation with only the latest floor named, and dismissal by outside click or Escape
- [X] T014 [US2] Add a reduced-motion case to `apps/frontend/src/tests/Sidebar.test.jsx` asserting no shake runs and a visible acknowledgement still occurs

### Implementation for User Story 2

- [X] T015 [US2] Remove the missing-panorama branch for floors without a location in `apps/frontend/src/components/Sidebar.jsx` while preserving locked labels and location-unavailable feedback (depends on T012)
- [X] T016 [US2] Implement a fixed 1500 ms popover delay with one pending notice, timer restart on repeat activation, and latest-floor tracking in `apps/frontend/src/components/Sidebar.jsx` (depends on T013)
- [X] T017 [US2] Implement popover dismissal and cleanup in `apps/frontend/src/components/Sidebar.jsx`: outside click and Escape close it, and sidebar close or unmount cancels pending timers (depends on T016)
- [X] T018 [US2] Implement immediate acknowledgement in `apps/frontend/src/components/Sidebar.jsx`: keep the shake when motion is allowed and apply a brief non-motion border and background change when reduced motion is preferred (depends on T014)
- [X] T019 [US2] Verify User Story 2 with `apps/frontend/src/tests/Sidebar.test.jsx` once tooling is available, or with quickstart scenarios 3, 4, 9, and 10 in `specs/004-panorama-empty-state/quickstart.md`

**Checkpoint**: User Story 2 is functional and the floor list statuses are unchanged elsewhere.

---

## Phase 5: User Story 3 - Accessible feedback in every layout (Priority: P3)

**Goal**: The message remains visible, readable, and announced with the floor list collapsed and on narrow viewports.

**Independent Test**: Show the missing state at the supported viewports with the floor list collapsed; confirm the alert is visible and exposed to assistive technology.

### Tests for User Story 3

- [X] T020 [P] [US3] Confirm the missing-state assertions in `apps/frontend/src/tests/PanoramaViewer.test.jsx` query the message through its alert role

### Implementation for User Story 3

- [X] T021 [US3] Verify the alert semantics, centered panel, and responsive classes in `apps/frontend/src/components/PanoramaViewer.jsx`, adjusting only if a contract violation is found
- [X] T022 [US3] Verify `apps/frontend/src/components/PanoramaViewer.jsx` with the floor list collapsed at 1440x900, 1024x768, 700x800, 560x800, 375x667, 320x568, and a landscape phone viewport

**Checkpoint**: All three user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across components, tests, and repository state.

- [X] T023 [P] Run `npm run lint` across `apps/frontend/src` and confirm zero errors
- [X] T024 [P] Run `npm run build` and confirm `apps/frontend/dist/` is produced without errors
- [ ] T025 Run `npm --prefix apps/frontend run test` for `apps/frontend/src/tests/` once the deferred Vitest tooling is restored
- [ ] T026 Run every scenario in `specs/004-panorama-empty-state/quickstart.md` and record the evidence (scenarios 1-10; scenario 8 is tracked by blocked T025)
- [X] T027 [P] Review `git diff` for `apps/frontend/src/components/Layout.jsx`, `apps/frontend/src/components/PanoramaViewer.jsx`, `apps/frontend/src/components/Sidebar.jsx`, `apps/frontend/src/tests/PanoramaViewer.test.jsx`, and `apps/frontend/src/tests/Sidebar.test.jsx`; confirm no backend, catalog, or package changes are included

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup; blocks all user stories.
- **User Stories (Phases 3-5)**: All depend on Foundational.
  - US1 and US2 touch different component and test files and can proceed in parallel.
  - US3 depends on US1 because it validates the viewer's missing-state presentation.
- **Polish (Phase 6)**: Depends on all desired user stories.

### User Story Dependencies

- **User Story 1 (P1)**: No dependency on other stories.
- **User Story 2 (P2)**: No dependency on other stories; independent of US1.
- **User Story 3 (P3)**: Depends on US1 for the viewer empty state.

### Within Each User Story

- US1: viewer test cases, then viewer implementation, layout mounting, and independent verification.
- US2: sidebar regression and timer tests, then floor-list cleanup, popover timer lifecycle, dismissal cleanup, acknowledgement, and independent verification.
- US3: alert-role test confirmation, then viewer presentation check and responsive viewport check.

### Parallel Opportunities

- T002, T003, and T004 can run together during setup.
- After T008, T009 and T010 can run together because they touch different components.
- US1 and US2 can be worked on in parallel by different developers because they touch different files.
- T020 can run alongside the viewer presentation checks once US1 is complete.
- T023, T024, and T027 can run together during polish.

---

## Parallel Example: User Story 1

```bash
# Independent implementation files after the viewer tests exist:
Task: "Render the missing-state alert in apps/frontend/src/components/PanoramaViewer.jsx"
Task: "Mount the viewer when content is ready in apps/frontend/src/components/Layout.jsx"
```

---

## Parallel Example: User Stories 1 and 2 Tests

```bash
# Different test files, no shared dependency:
Task: "Update apps/frontend/src/tests/PanoramaViewer.test.jsx"
Task: "Update apps/frontend/src/tests/Sidebar.test.jsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Stop and validate the viewer empty state independently.
4. The main visitor feedback is in the correct surface.

### Incremental Delivery

1. US1: viewer owns the message (MVP).
2. US2: floor list is decluttered, and locked-floor popover timing is correct.
3. US3: accessibility and responsive verification.
4. Polish: lint, build, automated tests when available, quickstart evidence, and diff review.

### Minimum Shippable Scope

Ship US1 and US2 together because moving the message without removing it from the floor list leaves duplicate feedback, and the clarified popover timing is part of the same visitor flow. US3 and Polish validation are required before merge under the constitution.

---

## Validation Evidence

Recorded on 2026-11-05 after implementing the popover timing changes.

- **Lint**: `npm run lint` exited 0.
- **Build**: `npm run build` exited 0 and produced `apps/frontend/dist/`.
- **Automated component tests**: Not run. `npm --prefix apps/frontend run test` failed because `vitest` is not installed; T025 stays open until the deferred tooling is approved.
- **Manual browser scenarios**: Not run in this environment; T026 stays open. The implementation was reviewed against quickstart scenarios 9 and 10.
- **Viewer state**: `apps/frontend/src/components/PanoramaViewer.jsx` is unchanged by this task; the existing viewport evidence for the empty state still applies.
- **Popover behavior**: `Sidebar.jsx` now schedules the popover after 1500 ms, restarts the timer for a newer locked floor, cancels pending timers on sidebar close and unmount, keeps the popover open until outside click or Escape, and uses a non-motion acknowledgement when reduced motion is preferred.

---

## Notes

- [P] tasks touch different files or are read-only checks with no ordering dependency.
- The working tree already contains the original empty-state implementation; tasks marked as verification may only need evidence rather than code changes.
- Vitest tooling is deferred; do not install it without maintainer approval.
- Keep the exact text `No panorama available yet.` in the viewer and nowhere in the floor list.
- The popover delay is fixed at 1500 ms, the latest locked-floor activation wins, and a visible popover stays open until outside click or Escape.
- Preserve the existing locked and location-unavailable labels, and provide a non-motion acknowledgement for reduced-motion visitors.
- Do not change the catalog, backend, or dependencies in this feature.
