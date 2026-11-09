# Tasks: Hide Gallery and Floating Nav When Sidebar Opens on Mobile

**Input**: Design documents from `/specs/015-hide-gallery-nav-mobile/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/ (N/A)

**Tests**: Test tasks are OPTIONAL - not explicitly requested in the feature specification. Validation is covered by quickstart.md scenarios and manual independent tests per user story.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `apps/frontend/src/` for components, pages, lib, context

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure verification

- [x] T001 Verify project builds and frontend dev server starts (no new dependencies needed; existing React + Vite + MUI stack)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Confirm sidebarOpen state exists in tour context (apps/frontend/src/context/tourContextValue.js)
- [x] T003 [P] Confirm isCompactViewport() utility exists and returns correct breakpoint (apps/frontend/src/lib/viewport.js)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Hide gallery and floating nav on mobile when sidebar opens (Priority: P1) 🎯 MVP

**Goal**: When the campus floor sidebar is revealed on a mobile viewport, the room gallery and floating navigation bar are hidden so the sidebar's tinted background is the sole focus. When the sidebar closes, both reappear.

**Independent Test**: Open the tour on a mobile viewport with the room gallery and floating navigation bar visible, open the sidebar, and confirm both are no longer visible. Close the sidebar and confirm both reappear.

### Implementation for User Story 1

- [x] T004 [US1] Update Layout.jsx to pass sidebarOpen prop to FloatingMenu and Panorama components (apps/frontend/src/components/Layout.jsx)
- [x] T005 [P] [US1] Update FloatingMenu.jsx to accept sidebarOpen prop and return null (not rendered) when sidebarOpen is true and isCompactViewport() is true (apps/frontend/src/components/FloatingMenu.jsx)
- [x] T006 [P] [US1] Update Panorama.jsx to accept sidebarOpen prop from Layout and pass it through to RoomGallery (apps/frontend/src/pages/Panorama.jsx)
- [x] T007 [US1] Update RoomGallery.jsx to accept sidebarOpen prop and return null (not rendered) when sidebarOpen is true and isCompactViewport() is true (apps/frontend/src/components/RoomGallery.jsx)
- [x] T008 [US1] Verify sidebar behavior preserved: floor pairing, locked-floor popovers, scene switching, and existing navigation all continue to work after visibility changes (apps/frontend/src/components/Sidebar.jsx, apps/frontend/src/components/Layout.jsx)
- [x] T009 [US1] Hide the "View gallery" button when sidebar is open on mobile viewport (apps/frontend/src/pages/Panorama.jsx)

**Checkpoint**: At this point, User Story 1 is fully functional and testable independently — gallery, gallery button, and floating nav hide on mobile sidebar open and reappear on close.

---

## Phase 4: User Story 2 - Keep gallery and floating nav visible on desktop when sidebar opens (Priority: P2)

**Goal**: On a desktop viewport, opening the campus floor sidebar does not hide the room gallery or floating navigation bar; both remain visible and usable.

**Independent Test**: Open the tour on a desktop viewport, open the sidebar, and confirm the room gallery and floating navigation bar remain visible.

### Implementation for User Story 2

- [x] T010 [P] [US2] Verify desktop behavior: confirm isCompactViewport() returns false on desktop viewports so RoomGallery, gallery button, and FloatingMenu remain rendered when sidebar opens (apps/frontend/src/lib/viewport.js)
- [x] T011 [US2] Manual validation: open sidebar on desktop viewport, confirm RoomGallery, gallery button, and FloatingMenu remain visible and usable (apps/frontend/src/components/Layout.jsx, apps/frontend/src/components/FloatingMenu.jsx, apps/frontend/src/pages/Panorama.jsx, apps/frontend/src/components/RoomGallery.jsx)

**Checkpoint**: At this point, User Stories 1 AND 2 both work independently — mobile hides surfaces on sidebar open, desktop keeps them visible.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements and validation that affect multiple user stories

- [x] T012 [P] Run ESLint on all modified files (apps/frontend/src/components/Layout.jsx, apps/frontend/src/components/FloatingMenu.jsx, apps/frontend/src/pages/Panorama.jsx, apps/frontend/src/components/RoomGallery.jsx)
- [x] T013 [P] Run frontend test suite to check for regressions (npx vitest run)
- [x] T014 Run quickstart.md validation scenarios 1-6 and 2b on mobile and desktop viewports (specs/015-hide-gallery-nav-mobile/quickstart.md)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2)
- **Polish (Final Phase)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independently testable, no dependency on US1 implementation

### Within Each User Story

- Foundational phase MUST complete before any user story task
- Layout.jsx (T004) must complete before FloatingMenu.jsx (T005) and Panorama.jsx (T006)
- Panorama.jsx (T006) must complete before RoomGallery.jsx (T007) and before the gallery button hiding (T009)
- All US1 tasks (T004-T009) must complete before US1 verification completeness
- Polish tasks run after all user stories complete

### Parallel Opportunities

- T002 and T003 can run in parallel (Phase 2, different files)
- T005 and T006 can run in parallel after T004 completes (different files: FloatingMenu.jsx and Panorama.jsx)
- T009 depends on T006 (both modify Panorama.jsx; gallery button hiding needs sidebarOpen prop from T006)
- T012 and T013 can run in parallel (Phase 5, lint and tests)
- User Story 1 and User Story 2 can be worked on in parallel by different developers after Foundational phase

---

## Parallel Example: User Story 1

```bash
# After T004 (Layout.jsx) completes, launch T005 and T006 together:
Task: "Update FloatingMenu.jsx to accept sidebarOpen prop and hide when sidebarOpen && isCompactViewport()"
Task: "Update Panorama.jsx to accept sidebarOpen prop and pass to RoomGallery"

# T007 (RoomGallery.jsx) runs after T006 completes.
# T009 (hide gallery button in Panorama.jsx) runs after T006 completes.
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (P1)
4. **STOP and VALIDATE**: Test User Story 1 independently using the independent test above
5. Deploy/demo if ready (MVP achieved with US1 alone)

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Each story adds value without breaking previous stories
5. Run Phase 5 Polish after all desired stories complete

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (T004-T009)
   - Developer B: User Story 2 (T010-T011)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- "Hidden" means component returns null (not rendered), not CSS visibility hidden
- No new data entities, no new dependencies, no contracts needed
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
