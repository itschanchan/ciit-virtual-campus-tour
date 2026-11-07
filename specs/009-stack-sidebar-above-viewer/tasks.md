# Tasks: Stack Sidebar Above Panorama Viewer

**Input**: Design documents from `/specs/009-stack-sidebar-above-viewer/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not included - the feature specification does not explicitly request test tasks. Per AGENTS.md, backend tests are deferred; frontend tests follow existing test patterns.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/src/` at `apps/frontend/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Verify existing project structure matches implementation plan (`apps/frontend/src/components/Layout.jsx`, `Sidebar.jsx`, `PanoramaViewer.jsx`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 [P] Review current side-by-side flex row composition in `apps/frontend/src/components/Layout.jsx` (lines 91-99)
- [x] T003 [P] Review Sidebar.jsx toggle button positioning classes for stacked layout adaptation (`apps/frontend/src/components/Sidebar.jsx`)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - View campus floors in sidebar stacked above viewer (Priority: P1) 🎯 MVP

**Goal**: Re-arrange the tour layout so the campus floor sidebar is positioned directly above the 360-degree panorama viewer in a vertical stack, replacing the side-by-side arrangement.

**Independent Test**: Open the tour, confirm the sidebar floor list appears directly above the panorama viewer in a vertical stack, tap an available floor button, and confirm the viewer switches to that floor's panorama scene.

### Implementation for User Story 1

- [x] T004 [US1] Modify `apps/frontend/src/components/Layout.jsx` to replace flex row with flex column stacking Sidebar above PanoramaViewer; container `w-full h-full` ensures full screen width; Sidebar `w-80` stays left-aligned at fixed width; main `w-full flex-1` fills remaining width and height below sidebar
- [x] T005 [P] [US1] Adapt Sidebar.jsx toggle button classes for stacked vertical layout positioning (`apps/frontend/src/components/Sidebar.jsx`); uses `ChevronLeftIcon`/`ChevronRightIcon` (valid exports in @mui/icons-material v9.5.0) matching original open/closed toggle behavior; toggle positioned at bottom-right inside sidebar; Sidebar `w-80`/`w-0` stays on left side with fixed width
- [x] T006 [US1] Verify sidebar floor buttons remain clickable and switch viewer scenes in stacked layout (`apps/frontend/src/components/Sidebar.jsx`, `apps/frontend/src/components/PanoramaViewer.jsx`)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Use stacked layout on desktop and mobile (Priority: P2)

**Goal**: Ensure the stacked sidebar-above-viewer layout works on both desktop and mobile viewports without layout breakage, overlapping controls, or loss of navigation access.

**Independent Test**: Open the tour on desktop and mobile viewports, confirm the sidebar remains above the viewer and floor buttons remain tappable or clickable.

### Implementation for User Story 2

- [x] T007 [US2] Add responsive Tailwind classes for stacked layout on mobile viewport (`apps/frontend/src/components/Layout.jsx`, `apps/frontend/src/components/Sidebar.jsx`)
- [x] T008 [US2] Verify sidebar and viewer don't overlap on narrow viewports (`apps/frontend/src/components/Layout.jsx`)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T009 [P] Run frontend lint to verify no ESLint errors (`npm run lint` at workspace root)
- [x] T010 Run quickstart.md validation scenarios to confirm stacked layout works (`specs/009-stack-sidebar-above-viewer/quickstart.md`)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable

### Within Each User Story

- Review existing code before modifying
- Core implementation before verification
- Story complete before moving to next priority

### Parallel Opportunities

- T002 and T003 (Foundational phase) can run in parallel - review different files
- T005 can run in parallel with T004 - modifies different file (`Sidebar.jsx` vs `Layout.jsx`), no code dependency
- T009 can run in parallel with implementation tasks - runs lint, does not modify source files

---

## Parallel Example: User Story 1

```bash
# Launch T004 and T005 together - different files, no dependencies:
Task: "Modify Layout.jsx to stack Sidebar above PanoramaViewer" (T004)
Task: "Adapt Sidebar.jsx toggle classes for stacked layout" (T005)

# Then run T006 after both complete:
Task: "Verify sidebar floor buttons remain clickable in stacked layout" (T006)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently using quickstart.md Scenario 1-3
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
   - Developer A: User Story 1 (T004, T005, T006)
   - Developer B: User Story 2 (T007, T008) - can start once US1 layout changes are understood
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- PanoramaViewer.jsx requires no changes - composition only in Layout.jsx
- Sidebar.jsx needs toggle behavior adaptation for vertical stack
- Floor-to-scene switching via `window.__panoramaViewer.switchToSceneId` remains unchanged
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
