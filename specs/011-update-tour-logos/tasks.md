# Tasks: Update Sidebar and Header Tour Logos

**Input**: Design documents from `/specs/011-update-tour-logos/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - only include them if explicitly requested in the feature specification. The feature specification does not explicitly request test code tasks; manual validation per quickstart.md and interim lint/build checks provide evidence until Vitest/Testing Library/jsdom tooling is restored.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume web app structure per plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 [P] Review current Sidebar.jsx structure (SidebarLogo component, logoUrl prop, unused VirtualTourLogo import) in apps/frontend/src/components/Sidebar.jsx
- [x] T002 [P] Review current Header.jsx structure (text-only "CIIT" mark) in apps/frontend/src/components/Header.jsx
- [x] T003 [P] Review current Layout.jsx structure (how <Sidebar> is rendered and what props are passed) in apps/frontend/src/components/Layout.jsx

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 [P] Confirm no new dependencies are required (apps/frontend/package.json unchanged; existing React, Vite, Tailwind, MUI reused)
- [x] T005 [P] Verify both logo assets exist under apps/frontend/public/img/ (ciit_glitch_virtual_tour_logo.png and CIIT_Logo_Inverse_cropped.svg)

**Checkpoint**: Foundation ready - no new dependencies or infrastructure needed; user story implementation can now begin

---

## Phase 3: User Story 1 - See the campus tour brand logo in the sidebar (Priority: P1) 🎯 MVP

**Goal**: The CIIT glitch virtual tour logo image appears at the top of the campus floor sidebar, replacing the text-only mark, with the "360° Virtual Campus Tour" subtitle below it. The logo follows existing sidebar collapse behaviour (hidden when collapsed, shown when expanded).

**Independent Test**: Open the sidebar and confirm the glitch virtual tour logo image appears at the top instead of a text-only mark; confirm the subtitle remains below it; collapse and reopen the sidebar to confirm visibility follows collapse state.

### Implementation for User Story 1

- [x] T006 [US1] Wire the logoUrl prop from Layout.jsx to Sidebar.jsx, passing the ciit_glitch_virtual_tour_logo.png asset path so SidebarLogo renders the image (apps/frontend/src/components/Layout.jsx, apps/frontend/src/components/Sidebar.jsx)
- [x] T007 [P] [US1] Verify SidebarLogo renders the logo image with descriptive alt text when logoUrl is provided (apps/frontend/src/components/Sidebar.jsx)
- [x] T008 [P] [US1] Verify the sidebar logo is hidden when the sidebar is collapsed and shown when expanded (apps/frontend/src/components/Sidebar.jsx)
- [x] T009 [P] [US1] Verify the "360° Virtual Campus Tour" subtitle remains below the logo image (apps/frontend/src/components/Sidebar.jsx)
- [x] T010 [P] [US1] Verify the sidebar logo renders correctly at desktop and narrow mobile viewports (320px minimum) without layout breakage (apps/frontend/src/components/Sidebar.jsx)

**Checkpoint**: At this point, User Story 1 is fully functional - the sidebar displays the glitch virtual tour logo image at the top with subtitle, following collapse visibility rules

---

## Phase 4: User Story 2 - See the CIIT brand logo in the header (Priority: P1)

**Goal**: The CIIT Logo Inverse cropped SVG image appears in the tour header, replacing the text-only "CIIT" mark, while retaining the "Virtual Campus Tour" title text and current location name alongside it. The header logo follows existing visibility behaviour (hidden when the sidebar is open, shown when closed).

**Independent Test**: Open the tour with the sidebar closed and confirm the CIIT SVG logo appears in the header instead of a text-only mark; confirm the title and current location remain visible; open the sidebar to confirm the header logo hides.

### Implementation for User Story 2

- [x] T011 [US2] Replace the text-only "CIIT" mark in Header.jsx with the CIIT_Logo_Inverse_cropped.svg image, retaining the title and current location name alongside it (apps/frontend/src/components/Header.jsx)
- [x] T012 [P] [US2] Verify the header logo retains the "Virtual Campus Tour" title text alongside the image (apps/frontend/src/components/Header.jsx)
- [x] T013 [P] [US2] Verify the header logo retains the current location name alongside the image (apps/frontend/src/components/Header.jsx)
- [x] T014 [P] [US2] Verify the header logo is hidden when the sidebar is open and shown when closed (apps/frontend/src/components/Header.jsx)
- [x] T015 [P] [US2] Verify the header logo renders correctly at desktop and narrow mobile viewports (320px minimum) without layout breakage (apps/frontend/src/components/Header.jsx)

**Checkpoint**: At this point, User Story 2 is fully functional - the header displays the CIIT Logo Inverse cropped SVG image with title and location, following sidebar-open visibility rules

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T016 [P] Run ESLint on modified files (apps/frontend/src/components/Sidebar.jsx, apps/frontend/src/components/Header.jsx, apps/frontend/src/components/Layout.jsx) and fix any errors
- [x] T017 [P] Run production build to confirm no regressions (npm run build)
- [x] T018 Manual validation per quickstart.md: sidebar logo presence/subtitle/visibility, header logo presence/title/location/visibility, responsiveness at 320px, alt text

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-4)**: All depend on Foundational phase completion
  - User Story 1 (P1) and User Story 2 (P1) are independent of each other and can be implemented in parallel (different component files)
- **Polish (Final Phase)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories; modifies Sidebar.jsx and Layout.jsx
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on User Story 1; modifies Header.jsx independently

### Within Each User Story

- Core implementation task before verification tasks
- Story complete before moving to next priority
- Verification tasks within a story marked [P] can run in parallel (all depend on that story's implementation task)

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (different files, no dependencies)
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- User Story 1 and User Story 2 can be implemented in parallel (Sidebar.jsx/Layout.jsx vs Header.jsx - different files)
- All verification tasks within each user story marked [P] can run in parallel (all depend on that story's implementation task)
- All Polish tasks marked [P] can run in parallel (within Phase 5)

### Parallel Example: User Story 1

```bash
# Launch all verification tasks for User Story 1 together (all depend on T006):
Task: "Verify SidebarLogo renders the logo image with descriptive alt text (apps/frontend/src/components/Sidebar.jsx)"
Task: "Verify the sidebar logo is hidden when collapsed and shown when expanded (apps/frontend/src/components/Sidebar.jsx)"
Task: "Verify the subtitle remains below the logo image (apps/frontend/src/components/Sidebar.jsx)"
Task: "Verify the sidebar logo renders correctly at desktop and narrow mobile viewports (apps/frontend/src/components/Sidebar.jsx)"
```

### Parallel Example: Polish Phase

```bash
# Run lint, build, and manual validation together:
Task: "Run ESLint on modified files"
Task: "Run production build to confirm no regressions"
Task: "Manual validation per quickstart.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently (sidebar logo image, subtitle, collapse visibility, responsiveness)
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Each story adds value without breaking previous stories

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- User Story 1 (sidebar logo) and User Story 2 (header logo) modify different component files and can be developed in parallel
- Tests are not explicitly requested in the feature specification; per the constitution's Test-First gate, Sidebar.test.jsx and Header.test.jsx could be extended with logo regression cases once Vitest/Testing Library/jsdom tooling is restored (currently deferred by maintainer)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
