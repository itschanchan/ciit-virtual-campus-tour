# Tasks: Hide Header Logo When Sidebar Open

**Input**: Design documents from `/specs/001-hide-logo-on-reveal/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- **Web app**: `frontend/src/` 
- Paths shown below use the web app convention per plan.md structure

## Phase 1: Setup (Shared Infrastructure)

- [X] T001 Verify project structure exists in `apps/frontend/src/components/` per implementation plan

## Phase 2: Foundational (Blocking Prerequisites)

- [X] T002 [P] Confirm `sidebarOpen` prop flows from Sidebar to Header in `apps/frontend/src/components/Sidebar.jsx`
- [X] T003 [P] Confirm Header component accepts `sidebarOpen` prop in `apps/frontend/src/components/Header.jsx`

## Phase 3: User Story 1 - Hide Header Logo When Sidebar Open (Priority: P1) 🎯 MVP

**Goal**: The CIIT logo in Header is automatically hidden when Sidebar is revealed and visible when Sidebar is closed.

**Independent Test**: Open the sidebar (click toggle button), verify logo is hidden; close sidebar, verify logo reappears. Test at desktop and mobile widths. ARIA label unchanged.

### Implementation for User Story 1

- [X] T004 [P] [US1] Add conditional `hidden` class to logo element based on `sidebarOpen` prop in `apps/frontend/src/components/Header.jsx`
- [X] T005 [P] [US1] Preserve `aria-label="CIIT"` on logo element in both visible and hidden states in `apps/frontend/src/components/Header.jsx`
- [X] T006 [US1] Verify layout stability (no unexpected reflow) when logo is hidden at desktop width in `apps/frontend/src/components/Header.jsx`
- [X] T007 [US1] Verify layout stability (no unexpected reflow) when logo is hidden at 320 px viewport width in `apps/frontend/src/components/Header.jsx`

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Improvements affecting the feature and final validation.

- [X] T008 [P] Update `quickstart.md` with step-by-step validation instructions for logo hide/show behavior
- [X] T009 [P] Perform manual desktop and mobile testing at 320 px width to verify all acceptance criteria

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS user story work
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion - no dependencies on other stories
- **Polish (Final Phase)**: Depends on User Story 1 completion

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories

### Within User Story 1

- Foundational phase must complete before implementation tasks
- T004 must complete before T005, T006, T007 (logo visibility logic must exist before verification)
- T006 and T007 can run in parallel (both verify layout at different viewports)

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel
- T006 and T007 marked [P] can run in parallel (independent viewport checks)
- Polish phase tasks marked [P] can run in parallel

## Parallel Example: User Story 1

```bash
# Verify layout at desktop width together with mobile width:
Task: "Verify layout stability (no unexpected reflow) when logo is hidden at desktop width in apps/frontend/src/components/Header.jsx"
Task: "Verify layout stability (no unexpected reflow) when logo is hidden at 320 px viewport width in apps/frontend/src/components/Header.jsx"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Test → Deploy (MVP!)

### Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid vague tasks, same-file conflicts, cross-story dependencies that break independence