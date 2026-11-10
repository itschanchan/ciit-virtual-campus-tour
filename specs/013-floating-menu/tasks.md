# Tasks: Floating Menu Button

**Input**: Design documents from `/specs/013-floating-menu/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Vitest test tasks are included per Constitution Principle III (narration-control behavior must be tested before implementation). Tests are written to fail first (TDD), per Principle III.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/src/` (React + Vite, MERN stack per Constitution Principle I)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create `apps/frontend/src/components/FloatingMenu.jsx` component stub per implementation plan
- [x] T002 [P] Add inline Tailwind styles and oscillation keyframes (`<style>` block) plus `prefers-reduced-motion` handling in `apps/frontend/src/components/FloatingMenu.jsx` (no separate CSS file)

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before mute/unmute (User Story 2) can be implemented

**⚠️ CRITICAL**: User Story 2 cannot begin until this phase is complete

- [x] T003 Add `isMuted` state and `toggleMute` action (TOGGLE_MUTE) to `apps/frontend/src/context/TourContext.jsx`
- [x] T004 [P] Wire `isMuted` to the audio element `muted` property in `apps/frontend/src/components/NarrationPlayer.jsx`

**Checkpoint**: Foundation ready — mute state exists and affects audio; user story implementation can now begin

## Phase 3: User Story 1 - Control narration playback (Priority: P1) 🎯 MVP

**Goal**: A visitor can start and pause campus tour narration using the play/pause button on the floating menu, and see an audio visualization while narration plays.

**Independent Test**: Click the play button and confirm narration starts; click again and confirm narration pauses; oscillation appears while playing and disappears when paused.

### Tests for User Story 1 (TDD - write first, ensure they fail before implementation)

- [x] T005 [P] [US1] Write failing Vitest test for play/pause behavior in `apps/frontend/src/tests/FloatingMenu.test.jsx`
- [x] T006 [P] [US1] Write failing Vitest test for audio visualization visibility (shows when playing, hidden when paused) in `apps/frontend/src/tests/FloatingMenu.test.jsx`
- [x] T007 [P] [US1] Write failing Vitest test for play/pause toggle measurement (SC-001: 100% of play/pause actions toggle correctly) in `apps/frontend/src/tests/FloatingMenu.test.jsx`

### Implementation for User Story 1

- [x] T008 [P] [US1] Implement play/pause button and oscillation visualization container in `apps/frontend/src/components/FloatingMenu.jsx`
- [x] T009 [P] [US1] Add inline Tailwind oscillation keyframes plus `prefers-reduced-motion` handling in `apps/frontend/src/components/FloatingMenu.jsx`
- [x] T010 [US1] Integrate FloatingMenu play/pause with TourContext (`narrationStatus`, `playNarration`, `pauseNarration`) and merge NarrationPlayer audio logic (`<audio>` element, status labels, transcript, error states) into `apps/frontend/src/components/FloatingMenu.jsx`
- [x] T011 [US1] Mount FloatingMenu in `apps/frontend/src/components/Layout.jsx` at center bottom, above the PanoramaViewer and sidebar; remove NarrationPlayer from `apps/frontend/src/pages/Panorama.jsx`
- [x] T012 [US1] Handle missing/failed narration audio edge case (show error state or fall back to transcript) in `apps/frontend/src/components/FloatingMenu.jsx`
- [x] T013 [US1] Guard against rapid play/pause/mute toggles in `apps/frontend/src/components/FloatingMenu.jsx`

**Checkpoint**: At this point, User Story 1 is fully functional and testable independently (play/pause + visualization, with edge-case handling)

## Phase 4: User Story 2 - Mute and unmute narration (Priority: P2)

**Goal**: A visitor can mute the narration audio while keeping narration playing, then unmute it to restore sound.

**Independent Test**: While narration is playing, toggle mute and confirm audio stops; toggle again and confirm audio resumes.

### Tests for User Story 2 (TDD - write first, ensure they fail before implementation)

- [x] T014 [P] [US2] Write failing Vitest test for mute/unmute behavior in `apps/frontend/src/tests/FloatingMenu.test.jsx`

### Implementation for User Story 2

- [x] T015 [P] [US2] Add mute/unmute button with an accessible label in `apps/frontend/src/components/FloatingMenu.jsx`
- [x] T016 [US2] Wire mute/unmute to TourContext `toggleMute`/`isMuted` in `apps/frontend/src/components/FloatingMenu.jsx`

**Checkpoint**: At this point, User Stories 1 AND 2 both work independently

## Phase 5: User Story 3 - Accessible keyboard control of narration (Priority: P1)

**Goal**: A visitor using a keyboard can operate all floating menu controls and perceive focus states, per Constitution Principle V.

**Note**: Sequenced after User Stories 1 and 2 because keyboard operability is verified against the complete set of controls (play/pause and mute/unmute) built in those stories.

**Independent Test**: Tab to each floating menu control and confirm visible focus; activate each with Enter/Space or the documented keyboard hint (play/pause: p, mute/unmute: m).

### Tests for User Story 3 (TDD - write first, ensure they fail before implementation)

- [x] T017 [P] [US3] Write failing Vitest test for keyboard operability and visible focus states in `apps/frontend/src/tests/FloatingMenu.test.jsx`

### Implementation for User Story 3

- [x] T018 [P] [US3] Add visible `focus-visible` styles to all FloatingMenu controls in `apps/frontend/src/components/FloatingMenu.jsx`
- [x] T019 [P] [US3] Add `aria-label`/button semantics to all FloatingMenu controls in `apps/frontend/src/components/FloatingMenu.jsx`
- [x] T020 [US3] Add keyboard hint text (play/pause: p, mute/unmute: m) and `onKeyDown` handlers to FloatingMenu controls in `apps/frontend/src/components/FloatingMenu.jsx`

**Checkpoint**: All user stories are independently functional and accessible

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T021 [P] Verify FloatingMenu placement does not block the PanoramaViewer or sidebar on narrow mobile viewports (375x667) per quickstart.md responsive contract
- [x] T022 [P] Run quickstart.md validation scenarios: play/pause, mute/unmute, keyboard operability, reduced motion
- [x] T023 Run `npm run verify:content` and `npx eslint apps/frontend/src` for the new component

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS User Story 2 (mute)
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User Story 1 (P1): Play/pause + visualization — MVP, no dependencies on other stories
  - User Story 2 (P2): Mute/unmute — depends on Foundational mute state (T003, T004)
  - User Story 3 (P1): Keyboard operability — depends on controls from User Stories 1 and 2
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — No dependencies on other stories (MVP)
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) — No dependencies on other stories beyond mute state
- **User Story 3 (P1)**: Depends on User Stories 1 and 2 controls existing — keyboard enhancement applied to all controls

### Within Each User Story

- Tests MUST be written and FAIL before implementation (Constitution Principle III)
- Foundational tasks before story tasks that need them
- Container/structure before behavior integration
- Styling (CSS) can proceed in parallel with component logic ([P])
- Story complete before moving to the next priority

### Parallel Opportunities

- T002 runs in parallel with T001 (different files)
- T004 runs in parallel with T003 (different files)
- T005, T006, T007 run in parallel (three separate test cases, same file but independent test functions)
- T008 and T009 run in parallel (component logic vs. CSS styles, different files)
- T018 and T019 run in parallel (focus styles vs. aria labels, different concerns)
- Once Foundational completes, User Stories can be worked on by different team members in parallel

## Parallel Example: User Story 1

```bash
# Launch structure and styling together (different files):
Task: "Implement play/pause button and oscillation visualization container in apps/frontend/src/components/FloatingMenu.jsx"
Task: "Add CSS oscillation animation keyframes plus prefers-reduced-motion handling in apps/frontend/src/components/FloatingMenu.css"

# Launch all test tasks together (independent test functions):
Task: "Write failing Vitest test for play/pause behavior in apps/frontend/src/tests/FloatingMenu.test.jsx"
Task: "Write failing Vitest test for audio visualization visibility in apps/frontend/src/tests/FloatingMenu.test.jsx"
Task: "Write failing Vitest test for play/pause toggle measurement (SC-001) in apps/frontend/src/tests/FloatingMenu.test.jsx"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (needed only if mute is in scope; for pure play/pause MVP, can proceed after Setup)
3. Complete Phase 3: User Story 1 (tests first, then implementation)
4. **STOP and VALIDATE**: Test User Story 1 independently (play/pause + visualization + edge cases)
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo (accessibility complete per Constitution Principle V)
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:
1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (play/pause + visualization + edge cases)
   - Developer B: User Story 2 (mute/unmute) — can proceed once T003/T004 done
   - Developer C: User Story 3 (keyboard) — waits for controls from A and B
3. Stories complete and integrate independently

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to a specific user story for traceability
- Setup and Foundational phases carry no story label; Polish phase carries no story label
- No new dependencies required (CSS animation per research.md); `docs/tech_stack.md` unchanged
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate the story independently
- Avoid vague tasks, same-file conflicts, and cross-story dependencies that break independence
