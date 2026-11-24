# Tasks: Add Responsive Floor Directory Modal with Zoom to the Maps Button

**Input**: Design documents from `/specs/027-maps-modal-zoom/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test tasks are included because the plan.md explicitly lists updating `FloatingMenu.test.jsx` as part of implementation, and the project constitution Principle III (Test-First Quality Gate) is NON-NEGOTIABLE for frontend component behavior. Vitest, Testing Library, and jsdom remain deferred by the maintainer, so test execution is tracked separately and must not trigger an unapproved dependency install.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Verify project structure matches plan.md (FloatingMenu.jsx, FloatingMenu.test.jsx, glitch_directory.png paths)
- [X] T002 [P] Confirm no new dependencies are needed per plan constraints

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Establish baseline: confirm existing Map button, gallery open/close, Escape/arrow-key navigation, focus management, and image-load-fallback behavior in apps/frontend/src/components/FloatingMenu.jsx is intact before adding the map modal

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Open floor directory modal on mobile and view without scrolling (Priority: P1) 🎯 MVP

**Goal**: Make the floor directory modal open from the Map button, display the floor directory image, fit within a mobile viewport (320px+) without vertical or horizontal scrolling, and close correctly with focus returned to the Map button.

**Independent Test**: Open the floor directory modal on a mobile-size viewport and confirm the modal opens, the directory image and close button fit without scrolling, and the modal closes via close button, backdrop click, and Escape.

### Implementation for User Story 1

- [X] T004 [US1] Add map modal state (mapModalOpen, mapZoomLevel) and Map button click handler in apps/frontend/src/components/FloatingMenu.jsx (depends on T003)
- [X] T005 [US1] Render fixed-backdrop floor directory modal with directory image (/img/glitch_directory.png), close button, role="dialog", aria-modal="true" in apps/frontend/src/components/FloatingMenu.jsx (depends on T004)
- [X] T006 [US1] Close modal via close button, backdrop click, and Escape; restore focus to the Map button in apps/frontend/src/components/FloatingMenu.jsx (depends on T005)
- [X] T007 [US1] Cap modal and image within viewport using viewport-relative constraints so no scrolling on mobile in apps/frontend/src/components/FloatingMenu.jsx (depends on T006)
- [X] T008 [US1] Update FloatingMenu.test.jsx with mobile modal open/close and viewport-fit tests in apps/frontend/src/tests/FloatingMenu.test.jsx (depends on T007)

**Checkpoint**: At this point, User Story 1 is fully functional and testable independently on mobile

---

## Phase 4: User Story 2 - Open floor directory modal on tablet and view without scrolling (Priority: P2)

**Goal**: Confirm the floor directory modal fits within a tablet viewport without scrolling, with responsive layout transitions from mobile.

**Independent Test**: Open the floor directory modal on a tablet-size viewport and confirm the image and close button fit without scrolling.

### Implementation for User Story 2

- [X] T009 [US2] Verify modal fits tablet viewport without scrolling at tablet breakpoints; adjust responsive prefixes in apps/frontend/src/components/FloatingMenu.jsx (depends on T008)
- [X] T010 [US2] Add tablet viewport-fit tests in apps/frontend/src/tests/FloatingMenu.test.jsx (depends on T009)

**Checkpoint**: At this point, User Stories 1 AND 2 both work independently

---

## Phase 5: User Story 3 - Open floor directory modal on desktop with scroll-to-zoom and pinch-to-zoom (Priority: P3)

**Goal**: Add scroll-to-zoom on desktop and pinch-to-zoom on touch screens; clamp zoom between fit-to-viewport and a readable maximum; reset zoom when the modal opens.

**Independent Test**: Open the floor directory modal on a desktop-size viewport and confirm scroll-to-zoom works; on a touch viewport confirm pinch-to-zoom works; zoom is clamped and resets on open.

### Implementation for User Story 3

- [X] T011 [US3] Implement scroll-to-zoom via wheel events on the modal image area with preventDefault to suppress page scroll in apps/frontend/src/components/FloatingMenu.jsx (depends on T010)
- [X] T012 [US3] Implement pinch-to-zoom via multi-touch distance tracking with touch-action:none in apps/frontend/src/components/FloatingMenu.jsx (depends on T011)
- [X] T013 [US3] Clamp zoom between fit-to-viewport minimum and readable maximum; reset zoom on modal open in apps/frontend/src/components/FloatingMenu.jsx (depends on T012)
- [X] T014 [US3] Add scroll-to-zoom, pinch-to-zoom, and zoom-clamping tests in apps/frontend/src/tests/FloatingMenu.test.jsx (depends on T013)

**Checkpoint**: All user stories are independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements and final verification that affect all user stories

- [X] T015 [P] Run frontend test suite: npm --prefix apps/frontend run test
- [X] T016 [P] Run frontend lint: npm --prefix apps/frontend run lint
- [X] T017 [P] Run frontend build: npm --prefix apps/frontend run build
- [X] T018 [P] Manual validation per quickstart.md at mobile/tablet/desktop viewports and portrait/landscape orientations

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User Story 1 (P1) is the MVP and must complete first
  - User Story 2 (P2) can start after User Story 1 completes - verifies tablet fit of the same responsive layout
  - User Story 3 (P3) can start after User Story 2 completes - verifies desktop fit and zoom behavior
- **Polish (Final Phase)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories. This is the MVP.
- **User Story 2 (P2)**: Can start after User Story 1 completes - Verifies tablet fit of the same responsive layout
- **User Story 3 (P3)**: Can start after User Story 2 completes - Verifies desktop fit and zoom behavior, no regression

### Within Each User Story

- Implementation tasks are sequential within a story (all modify FloatingMenu.jsx)
- Tests are updated as part of the story's implementation per plan.md
- Story complete before moving to next priority

### Parallel Opportunities

- T001 and T002 (Setup) can run in parallel
- T015, T016, T017 (test, lint, build) can run in parallel in the Polish phase
- T018 (manual validation) depends on T015-T017 passing

### Parallel Example: User Story 1

```bash
# All US1 implementation tasks modify FloatingMenu.jsx and run sequentially:
# T004 -> T005 -> T006 -> T007 -> T008
# T008 (test file update) depends on T007 (implementation complete)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (mobile modal fit + open/close)
4. **STOP and VALIDATE**: Test User Story 1 independently on a mobile viewport per quickstart.md Scenario 1
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently on mobile → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently on tablet → Deploy/Demo
4. Add User Story 3 → Test independently on desktop → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (mobile modal fit + open/close)
   - Developer B: User Story 2 (tablet verification)
   - Developer C: User Story 3 (desktop zoom behavior)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Setup and Foundational phases have NO story label
- User Story phases MUST have a story label ([US1], [US2], [US3])
- Polish phase has NO story label
- Each task includes an exact file path
- All implementation changes are confined to apps/frontend/src/components/FloatingMenu.jsx
- Test updates are confined to apps/frontend/src/tests/FloatingMenu.test.jsx
- No new dependencies, no backend changes, no catalog/schema changes
- Commit after each task or logical group
