# Tasks: Migrate Room Gallery to Floating Menu

**Input**: Design documents from `/specs/024-migrate-room-gallery/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test tasks ARE included because spec.md FR-012 explicitly requires the consolidated behavior to be covered by automated tests. Per Constitution Principle III (test-first), tests are written and observed failing before implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify the project baseline before making any changes.

- [X] T001 Confirm baseline: `npm --prefix apps/frontend run test` passes, `npm --prefix apps/frontend run lint` passes, and `npm --prefix apps/frontend run build` passes (frontend only, no backend change)
- [X] T002 [P] Confirm no new runtime dependencies are required (FR-011; plan Technical Context states no package is added or changed)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Confirm the existing safety-net tests pass before consolidation begins. No shared infrastructure (database, API, new dependency) is required because this is a frontend-only consolidation of existing components.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T003 [P] Confirm pre-existing safety-net tests pass: `RoomGallery.test.jsx` (22 tests) and `FloatingMenu.test.jsx` (17 tests) in `apps/frontend/src/tests/`

**Checkpoint**: Foundation ready — existing gallery and narration tests pass; user story implementation can now begin.

---

## Phase 3: User Story 1 - Browse the room gallery from the floating menu (Priority: P1) 🎯 MVP

**Goal**: Consolidate gallery state and rendering into `FloatingMenu.jsx` so a tour visitor can open and browse a room's gallery of images from the floating menu, viewing each image with its caption and navigating between multiple images using previous/next controls.

**Independent Test**: Open the gallery from the floating menu and confirm room images display; navigate between images and confirm the active image and position counter update.

### Tests for User Story 1 (required per FR-012; written first, must FAIL before implementation)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation** (Constitution Principle III)

- [X] T004 [US1] Add gallery dialog open/close test in `apps/frontend/src/tests/FloatingMenu.test.jsx` (gallery modal renders when open, is hidden/inert when closed)
- [X] T005 [US1] Add gallery image navigation test in `apps/frontend/src/tests/FloatingMenu.test.jsx` (previous/next buttons change the active image and advance the position counter)
- [X] T006 [US1] Add gallery wrap-around test in `apps/frontend/src/tests/FloatingMenu.test.jsx` (navigating past the last image wraps to the first; navigating before the first wraps to the last)
- [X] T007 [US1] Add gallery close behaviors test in `apps/frontend/src/tests/FloatingMenu.test.jsx` (Escape, backdrop click, and close button dismiss the gallery; focus returns appropriately)
- [X] T008 [US1] Add gallery empty-state test in `apps/frontend/src/tests/FloatingMenu.test.jsx` (a location with no images shows "No gallery images are available for this location yet.")
- [X] T009 [US1] Add gallery image-load-fallback test in `apps/frontend/src/tests/FloatingMenu.test.jsx` (a failed image shows "Image unavailable" while other images remain navigable)
- [X] T010 [US1] Add gallery mobile-hide test in `apps/frontend/src/tests/FloatingMenu.test.jsx` (gallery does not render when the sidebar is open on a compact mobile viewport)

### Implementation for User Story 1

- [X] T011 [US1] Add gallery props (`images`, `open`, `onClose`, `sidebarOpen`, `floorLabel`) to `apps/frontend/src/components/FloatingMenu.jsx`
- [X] T012 [US1] Add gallery state (`currentIndex`, `previousFocusRef`) and sorted-images memo to `FloatingMenu.jsx`
- [X] T013 [US1] Add gallery previous/next handlers and Escape/ArrowLeft/ArrowRight keydown effect to `FloatingMenu.jsx`
- [X] T014 [US1] Add gallery focus management (autofocus close button on open; restore focus to previous element or `#tour-main` on close) to `FloatingMenu.jsx`
- [X] T015 [US1] Add gallery mobile-hide rule (`sidebarOpen && isCompactViewport()`) to `FloatingMenu.jsx`
- [X] T016 [US1] Render gallery modal UI (backdrop, dialog section, active image, previous/next buttons, caption, position counter, close button, empty state) in `FloatingMenu.jsx` alongside the existing narration controls
- [X] T017 [US1] Update `apps/frontend/src/pages/Panorama.jsx`: remove the `RoomGallery` import and render, remove gallery data resolution (moved to Layout.jsx)
- [X] T018 [US1] Delete `apps/frontend/src/components/RoomGallery.jsx` (safe after T017 removes its only import)
- [X] T019 [US1] Remove `apps/frontend/src/tests/RoomGallery.test.jsx` (gallery-behavior coverage folded into `FloatingMenu.test.jsx` in T004–T010)

**Checkpoint**: At this point, User Story 1 is fully functional and testable independently — the room gallery opens and browses from the floating menu, `RoomGallery.jsx` no longer exists, and narration controls are intact.

---

## Phase 4: User Story 2 - Control narration playback from the floating menu (Priority: P1)

**Goal**: Ensure narration playback controls (play/pause, mute/unmute, transcript, map) continue to work correctly alongside the consolidated gallery after the migration.

**Independent Test**: Click play to start narration, click pause to stop it; toggle mute; open the transcript and confirm it displays.

### Tests for User Story 2

- [X] T020 [P] [US2] Verify existing narration tests still pass after consolidation in `apps/frontend/src/tests/FloatingMenu.test.jsx` (play/pause, mute/unmute, transcript display, map button)
- [X] T021 [US2] Add combined narration-plus-gallery coexistence test in `apps/frontend/src/tests/FloatingMenu.test.jsx` (narration play/pause/mute/transcript controls work while the gallery is open)

### Implementation for User Story 2

- [X] T022 [US2] No code change required: narration controls already exist in `FloatingMenu.jsx`; this phase verifies they are preserved by the consolidation (covered by T020–T021)

**Checkpoint**: At this point, User Stories 1 AND 2 both work independently — gallery browsing and narration playback coexist in the floating menu.

---

## Phase 5: User Story 3 - Operate all floating menu controls with a keyboard (Priority: P1)

**Goal**: Ensure every floating menu control (gallery, narration play/pause, mute, transcript, map) is keyboard operable with visible focus states and accessible names/labels (Constitution Principle V).

**Independent Test**: Tab to each floating menu control and confirm visible focus; activate each with Enter, Space, or the documented keyboard hint.

### Tests for User Story 3

- [X] T023 [P] [US3] Add visible focus state test for all floating menu controls in `apps/frontend/src/tests/FloatingMenu.test.jsx` (each control shows a visible focus state when tabbed to)
- [X] T024 [US3] Verify "p" and "m" keyboard shortcuts work alongside the gallery in `apps/frontend/src/tests/FloatingMenu.test.jsx` (existing narration keyboard tests continue to pass)

### Implementation for User Story 3

- [X] T025 [US3] No code change required: keyboard shortcuts ("p", "m"), Enter/Space activation, visible focus states, and accessible names already exist in `FloatingMenu.jsx`; gallery arrow-key navigation was added in T013; this phase verifies preservation (covered by T023–T024)

**Checkpoint**: At this point, all user stories work independently — gallery browsing, narration playback, and full keyboard operability coexist in the floating menu.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements and verification that affect multiple user stories.

- [X] T026 [P] Run the full frontend test suite (`npm --prefix apps/frontend run test`), lint (`npm --prefix apps/frontend run lint`), and build (`npm --prefix apps/frontend run build`); confirm no regressions (SC-008)
- [X] T027 [P] Verify zero references to `RoomGallery.jsx` remain anywhere in the codebase (`grep -r "RoomGallery" apps/frontend`) (SC-006)
- [X] T028 [P] Run the `quickstart.md` manual validation scenarios at desktop, tablet, and 320px-wide mobile viewports (SC-007)

**Checkpoint**: All success criteria (SC-001 through SC-008) are satisfied.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately. Verifies the baseline before changes.
- **Foundational (Phase 2)**: Depends on Setup completion — confirms the pre-existing safety-net tests pass before consolidation.
- **User Stories (Phase 3–5)**: All depend on Foundational phase completion.
  - User Story 1 (US1, P1) must complete first because it performs the actual consolidation (adds gallery to `FloatingMenu.jsx`, wires `Panorama.jsx`, deletes `RoomGallery.jsx`).
  - User Story 2 (US2, P1) verifies narration preservation; can start after US1 but shares `FloatingMenu.jsx`, so sequence US1 → US2 to avoid file conflicts.
  - User Story 3 (US3, P1) verifies keyboard operability; can start after US1 (arrow keys added in T013) but shares `FloatingMenu.jsx`, so sequence US1 → US3.
- **Polish (Phase 6)**: Depends on all user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2). No dependency on other stories. This is the MVP.
- **User Story 2 (P2-equivalent but P1 here)**: Depends on US1 completion (shares `FloatingMenu.jsx`). Independently testable: narration controls work alongside the gallery.
- **User Story 3 (P3-equivalent but P1 here)**: Depends on US1 completion (arrow-key navigation added in US1). Independently testable: all controls keyboard-operable with visible focus.

### Within Each User Story

- Tests (where included) MUST be written and observed FAILING before implementation (Constitution Principle III).
- For US1: gallery state/props/handlers before UI rendering; UI rendering before wiring `Panorama.jsx`; wiring before deleting `RoomGallery.jsx`; deletion before removing `RoomGallery.test.jsx`.
- Core implementation before integration; story complete before moving to the next priority.

### Parallel Opportunities

- T002 [P] can run in parallel with T001 (independent confirmation tasks).
- T003 [P] can run in parallel with Phase 1 tasks (reads existing test files, no modifications).
- T020 [P], T023 [P] are verification tasks that read (do not modify) `FloatingMenu.test.jsx`; they can run in parallel with other read-only checks but not with tasks that write to the same file.
- T026 [P], T027 [P], T028 [P] in the Polish phase are independent verification tasks and can run in parallel with each other.
- Because US1, US2, and US3 all modify `FloatingMenu.jsx` / `FloatingMenu.test.jsx`, story phases should run sequentially (US1 → US2 → US3) to avoid file conflicts, even though they are logically independent.

### Parallel Example: User Story 1 (tests must be written before implementation)

```bash
# These test tasks all write to the same file (FloatingMenu.test.jsx), so they
# execute sequentially within US1, then implementation tasks follow:
Task: "Add gallery dialog open/close test in apps/frontend/src/tests/FloatingMenu.test.jsx"   (T004)
Task: "Add gallery image navigation test in apps/frontend/src/tests/FloatingMenu.test.jsx"   (T005)
Task: "Add gallery wrap-around test in apps/frontend/src/tests/FloatingMenu.test.jsx"        (T006)
# ... then implementation:
Task: "Add gallery props to apps/frontend/src/components/FloatingMenu.jsx"                   (T011)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (verify baseline).
2. Complete Phase 2: Foundational (confirm safety-net tests pass).
3. Complete Phase 3: User Story 1 (consolidate gallery into `FloatingMenu.jsx`, wire `Panorama.jsx`, delete `RoomGallery.jsx`).
4. **STOP and VALIDATE**: Test User Story 1 independently — gallery opens, browses, closes; `RoomGallery.jsx` gone; narration intact.
5. Deploy/demo if ready (MVP achieved).

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready.
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!).
3. Add User Story 2 → Test independently → Deploy/Demo (narration preserved alongside gallery).
4. Add User Story 3 → Test independently → Deploy/Demo (full keyboard operability).
5. Run Phase 6 Polish → All success criteria satisfied.
6. Each story adds value without breaking previous stories.

### Parallel Team Strategy

With multiple developers:
1. Team completes Setup + Foundational together.
2. Once Foundational is done:
   - Developer A: User Story 1 (the consolidation — primary implementation).
   - Developer B/C: Prepare US2 and US3 test additions in branches (read-only verification tasks) to merge after US1 stabilizes `FloatingMenu.jsx`.
3. Stories complete and integrate independently; Phase 6 polish runs last.

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks.
- [Story] label maps task to a specific user story for traceability. Setup, Foundational, and Polish phases carry no story label.
- Each user story is independently completable and testable.
- Tests fail before implementing (Constitution Principle III test-first gate).
- Commit after each task or logical group.
- Stop at any checkpoint to validate the story independently.
- Avoid: vague tasks, same-file conflicts across parallel tasks, cross-story dependencies that break independence.
- No backend, API, catalog, schema, or dependency changes are introduced by this feature.
