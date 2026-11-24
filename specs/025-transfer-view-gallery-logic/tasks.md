# Tasks: Transfer View Gallery Logic to Floating Menu

**Input**: Design documents from `/specs/025-transfer-view-gallery-logic/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/
**Tests**: Optional - only included where explicitly referenced by the plan/spec
**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

The project is already initialized (React + Vite + Vitest + Tailwind). Dependencies are installed. No setup tasks are required.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

No foundational tasks are required. The frontend codebase, TourContext, Layout, FloatingMenu, and Panorama already exist and are wired except for the View Gallery button toggle. User Story 1 can begin immediately.

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Open the room gallery from the floating menu's View Gallery button (Priority: P1) 🎯 MVP

**Goal**: Wire the View Gallery button already inside FloatingMenu.jsx so it opens and closes the room gallery through defined props (`open`, `onOpen`, `onClose`) from Layout, replacing the previously undefined `galleryOpen`/`toggleGallery` references. Place all buttons (play/pause, mute, transcript, map, View Gallery) in a single horizontal row. Simplify Panorama.jsx by removing unused gallery state destructuring.

**Independent Test**: Press the View Gallery button in the floating menu and confirm the gallery overlay opens; press the gallery close control and confirm it closes; confirm `aria-expanded` tracks the open state; confirm no console errors about undefined `galleryOpen`/`toggleGallery`.

### Implementation for User Story 1

- [X] T001 [US1] Add `onOpen` prop to FloatingMenu.jsx props and wire View Gallery button `aria-expanded={open}` and `onClick={onOpen}` in apps/frontend/src/components/FloatingMenu.jsx
- [X] T002 [P] [US1] Import `PhotoCameraIcon` from `@mui/icons-material` in apps/frontend/src/components/FloatingMenu.jsx
- [X] T003 [P] [US1] Render View Gallery button icon-only (`PhotoCameraIcon fontSize="small"`) inline in the existing `flex items-center justify-center` controls row alongside play/pause, mute, transcript, map; remove absolute positioning in apps/frontend/src/components/FloatingMenu.jsx
- [X] T004 [US1] Pass gallery open handler `onOpen={() => setGalleryOpen(true)}` (or `toggleGallery`) to FloatingMenu alongside `open`/`onClose` in apps/frontend/src/components/Layout.jsx
- [X] T005 [P] [US1] Remove unused `galleryOpen` and `toggleGallery` from the `useTour()` destructuring in apps/frontend/src/pages/Panorama.jsx
- [X] T006 [US1] Extend FloatingMenu.test.jsx to cover View Gallery button wiring (open handler invoked, `aria-expanded` reflects `open` prop) in apps/frontend/src/tests/FloatingMenu.test.jsx

**Checkpoint**: User Story 1 is fully functional and testable independently.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect the feature as a whole; final verification.

- [X] T007 [P] Run frontend tests: `npm --prefix apps/frontend run test` — confirm all existing gallery/narration tests pass plus new View Gallery wiring coverage
- [X] T008 [P] Run frontend lint: `npm run lint` — confirm no lint errors introduced
- [X] T009 Run frontend build: `npm run build` — confirm production build succeeds
- [X] T010 [P] Run quickstart.md validation scenarios 1–7 at desktop, tablet, and mobile viewports to confirm end-to-end behavior

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - project already initialized; can start immediately.
- **Foundational (Phase 2)**: No blocking prerequisites; can start immediately.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion. User Story 1 (P1) is the only story and has no dependencies on other stories.
- **Polish (Final Phase)**: Depends on User Story 1 completion.

### User Story Dependencies

- **User Story 1 (P1)**: Can start immediately. No dependencies on other stories. Independently testable.

### Within User Story 1

- T001 (add onOpen prop + wire button) is the core task; T002–T005 are independent supporting file edits.
- T006 (tests) depends on T001–T005 being complete enough to test.
- Polish phase (T007–T010) depends on all User Story 1 tasks.

### Parallel Opportunities

- T002 (import PhotoCameraIcon), T003 (inline button layout), T004 (Layout.jsx onOpen handler), T005 (Panorama.jsx cleanup) are all **[P]** — different files, no cross-dependencies; can run in parallel once T001 defines the prop contract.
- T007 (tests), T008 (lint), T009 (build), T010 (quickstart validation) are **[P]** verification tasks; can run in parallel after implementation.
- Single user story, so no cross-story parallelism applies.

## Parallel Example: User Story 1

```bash
# Launch independent file edits together (all [P], different files):
Task: "Import PhotoCameraIcon in FloatingMenu.jsx"
Task: "Render View Gallery button inline in controls row in FloatingMenu.jsx"
Task: "Pass onOpen handler to FloatingMenu in Layout.jsx"
Task: "Remove unused galleryOpen/toggleGallery in Panorama.jsx"

# Launch verification together after implementation:
Task: "Run frontend tests"
Task: "Run frontend lint"
Task: "Run frontend build"
Task: "Run quickstart.md validation scenarios"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (none required - project already initialized).
2. Complete Phase 2: Foundational (none required - no blockers).
3. Complete Phase 3: User Story 1 (P1).
4. **STOP and VALIDATE**: Test User Story 1 independently via quickstart.md scenarios.
5. Deploy/demo if ready.

### Incremental Delivery

User Story 1 is the MVP — wiring the View Gallery button to defined props completes the feature. No additional stories (P2/P3) exist in the spec.

### Notes

- [P] tasks = different files, no dependencies.
- [Story] label maps task to User Story 1 for traceability.
- This feature is frontend-only; no backend, model, service, or route change.
- No new runtime dependencies are introduced (FR-008/FR-010 in spec).
- Decorative borders removed → shadows per spec FR-009 (already applied to FloatingMenu.jsx); functional borders (error-state accent borders, play/pause focus-ring spacer) preserved.
