# Tasks: Make Web Responsive

**Input**: Design documents from `/specs/014-make-web-responsive/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Status**: All tasks complete and validated — 68/68 tests pass, ESLint is clean, and the production build confirms the tablet backdrop carries no tint (FR-001c).

**Tests**: Test tasks are included for User Story 5 because FR-006 explicitly requires the floating menu tests to cover responsive behavior on mobile, tablet, and desktop viewports.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `apps/frontend/src/components/`, `apps/frontend/src/tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and documentation structure

- [X] T001 Create feature directory `specs/014-make-web-responsive/` and documentation structure (spec.md, plan.md)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 [P] Confirm existing Tailwind custom variants (`compact`, `narrow`, `tiny`) in `apps/frontend/src/index.css` support mobile breakpoints
- [X] T003 [P] Confirm existing component structure (Sidebar.jsx, Header.jsx, PanoramaViewer.jsx, ErrorBoundary.jsx, Layout.jsx) in `apps/frontend/src/components/`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Sidebar mobile responsive (Priority: P1) 🎯 MVP

**Goal**: Sidebar openable/closable via toggle on mobile, floor buttons visible/tappable, and the current floor/location name at top left; the sidebar is flush with the top edge on every width — a full-width, fully opaque overlay covering the entire header strip on narrow phones (FR-001a), and a desktop-width panel covering only the header logo area on tablets and landscape phones (FR-001b). At tablet widths the backdrop adds no dimming but still closes the sidebar when tapped (FR-001c).

**Independent Test**: Open the tour on a narrow mobile viewport (e.g., 375×667), toggle the sidebar open, confirm it covers the full header strip with the floor name at top left and that floor buttons are visible/tappable without horizontal scrolling; repeat at a tablet or wide landscape-phone width (e.g., 800×1024) and confirm the desktop-width panel is flush with the top edge, covers only the logo area, leaves the location name visible to the right, adds no dark backdrop tint, closes on an outside tap, and closes on floor selection.

### Implementation for User Story 1

- [X] T004 [US1] Add `getCurrentLocationName()` helper function in `apps/frontend/src/components/Sidebar.jsx`
- [X] T005 [US1] Add current floor/location name `<p>` element at top of sidebar using the `compact` variant (covers portrait and landscape phones plus tablets) in `apps/frontend/src/components/Sidebar.jsx`
- [X] T006 [US1] Replace arbitrary spacing/size values with standard Tailwind utilities (logo, floor button padding/text, pair gap, toggle size/position, heading sizes) in `apps/frontend/src/components/Sidebar.jsx`
- [X] T007 [US1] Add narrow full-screen overlay classes (`narrow:w-full`, `narrow:z-50`, `narrow:bg-surface`) so the sidebar covers and hides the transparent header on phone widths in `apps/frontend/src/components/Sidebar.jsx` (FR-001a)
- [X] T008 [US1] Remove the tablet top offset (`compact:top-16` plus the redundant `narrow:top-0`) so the sidebar is flush with the top edge at every width while keeping the desktop panel width on tablets and landscape phones in `apps/frontend/src/components/Sidebar.jsx` (FR-001b); verify `grep -r "compact:top-16\|narrow:top-0" apps/frontend/src` returns no matches
- [X] T009 [US1] Make sidebar content and floor-name spacing flush at the top on narrow phones (`narrow:pt-0`, `narrow:px-4`, `narrow:pb-4`) while preserving desktop/tablet content padding (`p-5`, `compact:pt-2`) in `apps/frontend/src/components/Sidebar.jsx`
- [X] T010 [P] [US1] Replace the sidebar backdrop tint with `bg-transparent` while keeping the `compact:block` visibility, full-size click area, and `aria-label="Close location menu"` in `apps/frontend/src/components/Layout.jsx` (FR-001c, SC-006)
- [X] T011 [P] [US1] Verify the custom-variant cascade order in the production build (`npx vite build` in `apps/frontend`): the `@media (width<=63.9375rem)` block precedes `@media (width<=43.75rem)`, so `narrow:*` utilities win at phone widths (research.md Decision 5)
- [X] T012 [US1] Update the `Sidebar.test.jsx` floor-name assertion from `getByText` to `getByRole` in `apps/frontend/src/tests/Sidebar.test.jsx`

**Checkpoint**: User Story 1 fully functional and testable independently — sidebar flush with the top on every width: full-width opaque overlay on narrow phones, desktop-width panel on tablets and landscape phones, transparent tap-to-close backdrop at tablet widths

---

## Phase 4: User Story 2 - Header responsive (Priority: P1)

**Goal**: Header logo, current location name, and actions readable and aligned on mobile, tablet, desktop without text overflow

**Independent Test**: Resize browser from mobile to tablet to desktop; confirm logo and location text remain readable and aligned at every width without overflow

### Implementation for User Story 2

- [X] T013 [US2] Replace arbitrary `max-w-[38vw]`/`text-[0.95rem]` location text with standard responsive utilities in `apps/frontend/src/components/Header.jsx`
- [X] T014 [US2] Add mobile padding (`narrow:px-3 narrow:py-2`) and responsive logo height (`narrow:h-5`) in `apps/frontend/src/components/Header.jsx`

**Checkpoint**: User Story 2 fully functional - header readable on all viewport sizes

---

## Phase 5: User Story 3 - Panorama viewer responsive (Priority: P1)

**Goal**: Panorama viewer fits within screen bounds on mobile, tablet, desktop; no view controls or scene list positioned off-screen

**Independent Test**: Open panorama on mobile viewport; confirm scene list slides in without pushing content off-screen, view controls remain within visible screen area; on desktop confirm scene list renders beside viewer

### Implementation for User Story 3

- [X] T015 [US3] Make scene list width responsive (`compact:w-[14rem] narrow:w-[16rem]`) and scene item text responsive in `apps/frontend/src/components/PanoramaViewer.jsx`
- [X] T016 [US3] Make view control margins responsive for compact/narrow in the VIEW_CONTROLS array in `apps/frontend/src/components/PanoramaViewer.jsx`
- [X] T017 [US3] Make hidden toggle buttons (sceneList, fullscreen, autorotate) and title bar responsive in `apps/frontend/src/components/PanoramaViewer.jsx`
- [X] T018 [US3] Make view controls container padding and loading/error states responsive in `apps/frontend/src/components/PanoramaViewer.jsx`

**Checkpoint**: User Story 3 fully functional - panorama viewer fits screen bounds on all devices

---

## Phase 6: User Story 4 - Error boundary responsive (Priority: P2)

**Goal**: Error boundary heading, message, and reload button fit screen width and tappable on mobile without zooming/scrolling

**Independent Test**: Trigger error boundary on mobile viewport; confirm heading and message fit within screen width; confirm reload button large enough to tap accurately

### Implementation for User Story 4

- [X] T019 [P] [US4] Add mobile padding/centering, responsive typography, and full-width reload button in `apps/frontend/src/components/ErrorBoundary.jsx`

**Checkpoint**: User Story 4 fully functional - error recovery screen usable on mobile

---

## Phase 7: User Story 5 - Floating menu tests responsive coverage (Priority: P2)

**Goal**: Narration controls remain usable and visible on mobile, tablet, desktop viewports per FR-006

**Independent Test**: Run FloatingMenu.test.jsx and confirm responsive viewport scenarios pass

### Tests for User Story 5

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T020 [US5] Add `mockMatchMedia()` helper function for viewport simulation in `apps/frontend/src/tests/FloatingMenu.test.jsx`
- [X] T021 [US5] Add narrow mobile viewport test verifying all controls render (play/pause, mute, transcript, map) in `apps/frontend/src/tests/FloatingMenu.test.jsx`
- [X] T022 [US5] Add narrow mobile viewport test verifying audio visualization hidden (`narrow:hidden`) in `apps/frontend/src/tests/FloatingMenu.test.jsx`
- [X] T023 [US5] Add narrow mobile viewport test verifying mute button tappable in `apps/frontend/src/tests/FloatingMenu.test.jsx`

**Checkpoint**: User Story 5 fully functional - floating menu tests cover responsive behavior

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements and verification that affect multiple user stories

- [X] T024 [P] Run all frontend tests (`npx vitest run` in `apps/frontend`) to confirm 68 tests pass across 7 test files
- [X] T025 [P] Run ESLint on all modified files (`apps/frontend/src/components/Sidebar.jsx`, `apps/frontend/src/components/Header.jsx`, `apps/frontend/src/components/PanoramaViewer.jsx`, `apps/frontend/src/components/ErrorBoundary.jsx`, `apps/frontend/src/components/Layout.jsx`, `apps/frontend/src/tests/Sidebar.test.jsx`, `apps/frontend/src/tests/FloatingMenu.test.jsx`) to confirm no lint errors
- [X] T026 [P] Run `specs/014-make-web-responsive/quickstart.md` Scenario 1b steps 5–8 across tablet widths (701–1023px) to confirm no backdrop dimming at any width in the range while tapping outside still closes the sidebar (FR-001c, SC-006)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed) or sequentially in priority order (P1 → P2)
  - US1, US2, US3 are P1 (MVP scope); US4, US5 are P2
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Independent of other stories
- **User Story 3 (P1)**: Can start after Foundational (Phase 2) - Independent of other stories
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Independent of other stories
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - Independent of other stories

### Within Each User Story

- Tests (where included) MUST be written before implementation
- Implementation tasks for the same component file run sequentially in task order
- Story complete before moving to next priority

### Parallel Opportunities

- Foundational tasks marked [P] can run in parallel (T002, T003)
- Once Foundational completes, all user stories can start in parallel (they touch different files)
- Within a user story, tasks touching the same file run sequentially; only cross-file tasks are marked [P]
- US1 cross-file parallel work: T010 (`Layout.jsx`) and T011 (build verification) can run alongside the `Sidebar.jsx` tasks
- Polish tasks marked [P] (T024–T026) can run in parallel
- T026 (visual validation) MUST run after T010 is implemented

### Parallel Example: User Story 1

```bash
# These US1 tasks edit different files and can run in parallel:
Task: "Sidebar responsive work in apps/frontend/src/components/Sidebar.jsx"
Task: "Replace the sidebar backdrop tint with compact:bg-transparent in apps/frontend/src/components/Layout.jsx" (FR-001c)
Task: "Verify the custom-variant cascade order in the production build" (research.md Decision 5)

# Tasks editing apps/frontend/src/components/Sidebar.jsx run sequentially in task order
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently (sidebar covers the header strip on narrow phones per FR-001a; desktop-width panel flush at the top on tablets/landscape phones per FR-001b; no backdrop dimming at tablet widths per FR-001c)
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Sidebar + Layout backdrop)
   - Developer B: User Story 2 (Header)
   - Developer C: User Story 3 (Panorama viewer)
   - Developer D: User Story 4 (Error boundary) + User Story 5 (Floating menu tests)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Tests are OPTIONAL per task generation rules; included only for User Story 5 because FR-006 explicitly requires floating menu responsive test coverage
- No new data entities (UI-only feature per data-model.md)
- No contracts/ directory (frontend-only UI feature, no external interfaces)
- T001–T026 were implemented and validated in Session 2026-11-09 (68/68 tests, ESLint clean, production build verified)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
