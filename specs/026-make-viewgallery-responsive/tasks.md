# Tasks: Make ViewGallery Modal Responsive on All Viewports

**Input**: Design documents from `/specs/026-make-viewgallery-responsive/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - only include them if explicitly requested in the feature specification. The plan.md explicitly lists updating `FloatingMenu.test.jsx` as part of implementation, so test-file updates are included as implementation tasks; no separate test-writing tasks are generated.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Verify project structure matches plan.md (FloatingMenu.jsx and FloatingMenu.test.jsx paths)
- [X] T002 [P] Confirm no new dependencies are needed per plan constraints

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Establish baseline: confirm existing gallery open/close, Escape/arrow-key navigation, focus management, and image-load-fallback behavior in apps/frontend/src/components/FloatingMenu.jsx is intact before layout changes

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - View gallery on mobile without scrolling (Priority: P1) 🎯 MVP

**Goal**: Make the ViewGallery modal fit within a mobile viewport (320px+) without vertical or horizontal scrolling, including image, caption, counter, navigation arrows, and close button.

**Independent Test**: Open the gallery modal on a mobile-size viewport and confirm every gallery element is visible and reachable without scrolling the page or the modal.

### Implementation for User Story 1

- [X] T004 [US1] Remove overflow-y-auto from the gallery panel so no scrollbar appears in apps/frontend/src/components/FloatingMenu.jsx
- [X] T005 [US1] Add viewport-relative height and width caps to the gallery panel (bounded to dvh/dvw) in apps/frontend/src/components/FloatingMenu.jsx (depends on T004)
- [X] T006 [US1] Scale the gallery image to viewport bounds using max-w-full with a viewport-relative max-h while preserving aspect ratio in apps/frontend/src/components/FloatingMenu.jsx (depends on T005)
- [X] T007 [US1] Tighten padding and heading sizes on compact viewports so header, image, caption, counter, and controls all fit in apps/frontend/src/components/FloatingMenu.jsx (depends on T006)
- [X] T008 [US1] Reposition previous/next navigation arrows so they remain within panel bounds on narrow screens in apps/frontend/src/components/FloatingMenu.jsx (depends on T007)
- [X] T009 [US1] Update FloatingMenu.test.jsx with responsive-viewport gallery tests (mobile fit without scrolling, image scaling, arrow reachability) in apps/frontend/src/tests/FloatingMenu.test.jsx (depends on T008)

**Checkpoint**: At this point, User Story 1 is fully functional and testable independently on mobile

---

## Phase 4: User Story 2 - View gallery on tablet without scrolling (Priority: P2)

**Goal**: Confirm the gallery modal fits within a tablet viewport without scrolling, with responsive layout transitions from mobile.

**Independent Test**: Open the gallery modal on a tablet-size viewport and confirm all gallery elements are visible without scrolling.

### Implementation for User Story 2

- [X] T010 [US2] Verify gallery fits tablet viewport without scrolling at tablet breakpoints; adjust responsive prefixes as needed in apps/frontend/src/components/FloatingMenu.jsx

**Checkpoint**: At this point, User Stories 1 AND 2 both work independently

---

## Phase 5: User Story 3 - View gallery on desktop without scrolling (Priority: P3)

**Goal**: Confirm the gallery modal fits within a desktop viewport without scrolling and that desktop keeps generous sizing without regression.

**Independent Test**: Open the gallery modal on a desktop-size viewport and confirm all gallery elements are visible without scrolling.

### Implementation for User Story 3

- [X] T011 [US3] Verify gallery fits desktop viewport without scrolling and confirm no regression to desktop sizing in apps/frontend/src/components/FloatingMenu.jsx

**Checkpoint**: All user stories are independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements and final verification that affect all user stories

- [X] T012 [P] Run frontend test suite: npm --prefix apps/frontend run test
- [X] T013 [P] Run frontend lint: npm --prefix apps/frontend run lint
- [X] T014 [P] Run frontend build: npm --prefix apps/frontend run build
- [X] T015 [P] Manual validation per quickstart.md at mobile/tablet/desktop viewports and portrait/landscape orientations

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User Story 1 (P1) is the MVP and must complete first
  - User Stories 2 and 3 can proceed after US1 completes (they verify the same responsive layout at larger breakpoints)
- **Polish (Final Phase)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories. This is the MVP.
- **User Story 2 (P2)**: Can start after User Story 1 completes - Verifies tablet fit of the same responsive layout
- **User Story 3 (P3)**: Can start after User Story 2 completes - Verifies desktop fit and no regression

### Within Each User Story

- Implementation tasks are sequential within a story (all modify FloatingMenu.jsx)
- Tests are updated as part of the story's implementation per plan.md
- Story complete before moving to next priority

### Parallel Opportunities

- T001 and T002 (Setup) can run in parallel
- T012, T013, T014 (test, lint, build) can run in parallel in the Polish phase
- T015 (manual validation) depends on T012-T014 passing

---

## Parallel Example: User Story 1

```bash
# All US1 implementation tasks modify FloatingMenu.jsx and run sequentially:
# T004 -> T005 -> T006 -> T007 -> T008 -> T009
# T009 (test file update) depends on T008 (implementation complete)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (mobile responsive layout)
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
   - Developer A: User Story 1 (mobile responsive layout)
   - Developer B: User Story 2 (tablet verification)
   - Developer C: User Story 3 (desktop verification)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Setup and Foundational phases have NO story label
- Polish phase has NO story label
- User Story phases MUST have a story label ([US1], [US2], [US3])
- Each task includes an exact file path
- All layout changes are confined to apps/frontend/src/components/FloatingMenu.jsx
- Test updates are confined to apps/frontend/src/tests/FloatingMenu.test.jsx
- No new dependencies, no backend changes, no catalog/schema changes
- Commit after each task or logical group
