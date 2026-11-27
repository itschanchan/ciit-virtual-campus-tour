---
description: "Task list for Tour Guide Narration feature implementation"
---

# Tasks: Tour Guide Narration

**Input**: Design documents from `specs/029-tour-guide-narration/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test tasks ARE included — Constitution III in spec.md declares Test-First Quality Gate (NON-NEGOTIABLE); plan.md Phase A requires tests written before implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4) — required for user story phase tasks only
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Verify project structure per implementation plan at `apps/frontend/src/`
- [x] T002 Confirm no new dependencies are needed (React 19.2, Vite 8, `@mui/icons-material` 9.5, Marzipano 0.10 all existing)
- [x] T003 [P] Verify linting and formatting configuration is in place

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create or verify narration catalog with 10 entries (voice-1 to voice-10) paired with transcripts at `apps/frontend/src/lib/narrationCatalog.json`
- [x] T005 [P] Create or verify narration catalog resolver functions at `apps/frontend/src/lib/narrationCatalog.js`
- [x] T006 [P] Create or verify localStorage persistence helpers at `apps/frontend/src/lib/narrationStorage.js`
- [x] T007 [P] Create or verify transcript fetch and cache helper at `apps/frontend/src/lib/transcripts.js`
- [x] T008 Extend TourContext with scene-aware narration state (currentSceneId, activeNarrationId, setCurrentSceneId, persistence effect) at `apps/frontend/src/context/TourContext.jsx`
- [x] T009 Wire Layout to pass `activeNarration` to FloatingMenu at `apps/frontend/src/components/Layout.jsx`
- [x] T010 Wire Panorama to report scene changes via `setCurrentSceneId` and start one-second initial autoplay at `apps/frontend/src/pages/Panorama.jsx`

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 - Floor narration starts automatically (Priority: P1) 🎯 MVP

**Goal**: A visitor enters the tour and hears the official tour guide recording for the floor they are viewing. The Lower Ground recording starts after the instructions screen; the destination floor's recording starts when navigating to another narrated floor; moving between panoramas on the same floor does not restart the recording.

**Independent Test**: Complete the instructions screen, confirm the Lower Ground recording starts after one second, then visit each narrated floor and confirm the assigned recording starts. Move between panoramas on one floor and confirm the recording does not restart.

### Tests for User Story 1 (required — Constitution III test-first gate)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T011 [P] [US1] Add catalog test asserting all 10 IDs, floor defaults, unique numbers, and transcript-N pairing at `apps/frontend/src/tests/narrationCatalog.test.js`
- [x] T012 [P] [US1] Add resolver test for same-floor continuity, explicit scene changes, floor changes, and floors without narration at `apps/frontend/src/tests/narrationCatalog.test.js`

### Implementation for User Story 1

- [x] T013 [US1] Implement one-second initial autoplay delay for Lower Ground recording after viewer ready at `apps/frontend/src/pages/Panorama.jsx`
- [x] T014 [US1] Implement destination floor recording start on floor change without added delay at `apps/frontend/src/context/TourContext.jsx`
- [x] T015 [US1] Implement same-floor continuity so moving between panoramas does not restart the recording at `apps/frontend/src/context/TourContext.jsx`

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Control and retain playback state (Priority: P1)

**Goal**: A visitor can pause and resume the tour guide at any time. Paused state persists across floor changes and refresh. Playing narration continues within a floor but is replaced by the destination floor's recording on floor change. Refresh restores the floor and state; active playback restarts from the beginning.

**Independent Test**: Play narration, pause it, change floors, refresh, and confirm it remains paused on the same floor. Resume, navigate within the same floor, and confirm playback continues. Change floors while playing and confirm the destination recording replaces the old one. Refresh while playing and confirm the same floor is restored and the recording restarts.

### Tests for User Story 2 (required — Constitution III test-first gate)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T016 [P] [US2] Add storage test for valid reads, invalid JSON, blocked storage, and clearing at `apps/frontend/src/tests/narrationStorage.test.js`
- [x] T017 [P] [US2] Add TourContext test for floor change preserving paused state, scene change selecting the right entry, and refresh restoring floor and pause state at `apps/frontend/src/tests/TourContext.test.jsx`

### Implementation for User Story 2

- [x] T018 [US2] Implement play/pause controls with status transitions (idle→loading→playing→paused→ended→blocked→error) at `apps/frontend/src/context/TourContext.jsx`
- [x] T019 [US2] Implement persistence effect saving floor and isPaused to localStorage on narration state changes at `apps/frontend/src/context/TourContext.jsx`
- [x] T020 [US2] Implement refresh restore: restore floor from localStorage; if playing, restart recording from beginning at `apps/frontend/src/context/TourContext.jsx`
- [x] T021 [US2] Implement blocked autoplay fallback: keep play control enabled and show manual play prompt at `apps/frontend/src/components/FloatingMenu.jsx`
- [x] T022 [US2] Implement recording replacement on floor change while playing; preserve paused state when changing floors while paused at `apps/frontend/src/context/TourContext.jsx`

**Checkpoint**: User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Transcript matches the active recording (Priority: P2)

**Goal**: A visitor opens the transcript in the Floating Menu and reads the text that corresponds to the recording currently selected for the floor. When the floor changes, the transcript changes with it. On tablet and desktop, the Floating Menu animates smoothly from pill shape to rounded rectangle when the transcript is revealed, and back to pill shape when collapsed. Compact mobile keeps the existing menu shape without the accordion reveal.

**Independent Test**: Open the transcript on each narrated floor and compare the displayed transcript with the active recording's ID. Change floors and confirm the transcript updates. Temporarily remove a transcript and confirm the fallback appears. Verify the accordion reveal animation on tablet/desktop and no shape change on compact mobile.

### Tests for User Story 3 (required — Constitution III test-first gate)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T023 [P] [US3] Add transcript loading, success, empty file, and fetch failure tests at `apps/frontend/src/tests/NarrationTranscript.test.jsx`
- [x] T024 [P] [US3] Add FloatingMenu transcript accessibility tests: Show/Hide transcript aria-label, aria-expanded, aria-controls, keyboard operation at `apps/frontend/src/tests/FloatingMenu.test.jsx`

### Implementation for User Story 3

- [x] T025 [US3] Implement NarrationTranscript component: fetch transcriptSrc, cache result, render paragraphs, show fallback "Transcript not available yet." at `apps/frontend/src/components/NarrationTranscript.jsx`
- [x] T026 [US3] Add transcript control button with aria-label "Show transcript"/"Hide transcript", aria-expanded, aria-controls="floating-menu-transcript" at `apps/frontend/src/components/FloatingMenu.jsx`
- [x] T027 [US3] Implement transcript panel rendering with id="floating-menu-transcript", heading "Transcript", and NarrationTranscript child; show fallback when transcript unavailable at `apps/frontend/src/components/FloatingMenu.jsx`
- [x] T028 [P] [US3] Implement accordion reveal animation: on tablet and desktop, animate Floating Menu from pill shape (rounded-full) to rounded rectangle when transcript is revealed, and back to pill shape when collapsed, using transition-all duration-300 ease-out at `apps/frontend/src/components/FloatingMenu.jsx`
- [x] T029 [US3] Ensure compact mobile viewport keeps existing menu shape (narrow:rounded-t-panel / narrow:rounded-b-none) without accordion reveal when transcript is shown or hidden at `apps/frontend/src/components/FloatingMenu.jsx`

**Checkpoint**: User Story 3 should be fully functional and testable independently

---

## Phase 6: User Story 4 - Content maintainer can pair recordings and transcripts (Priority: P2)

**Goal**: A content maintainer can open a single tour guide catalog and see which recording and transcript belong together by their shared ID, and which floor each pair belongs to. Every narrated floor has exactly one recording/transcript pair.

**Independent Test**: Inspect the catalog and verify every recording has a matching transcript ID and a floor assignment, and every narrated floor has exactly one pair. Add a new recording/transcript pair and confirm the tour uses it without changing playback logic.

### Tests for User Story 4 (required — Constitution III test-first gate)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T030 [P] [US4] Add catalog pairing verification test: every recording ID (voice-N) matches transcript ID (transcript-N) with same N; every narrated floor has exactly one pair at `apps/frontend/src/tests/narrationCatalog.test.js`

### Implementation for User Story 4

- [x] T031 [US4] Verify catalog has exactly one recording/transcript pair per narrated floor (LG, LG-2, UG, 4F, 5F, 5M, 6F, 7F, 8F, 9F) at `apps/frontend/src/lib/narrationCatalog.json`
- [x] T032 [US4] Update verify-content.mjs to validate every catalog audioSrc and transcriptSrc against `apps/frontend/public`; skip schema validation with warning when legacy schema is absent at `scripts/verify-content.mjs`

**Checkpoint**: User Story 4 should be fully functional and testable independently

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements and verification that affect multiple user stories

- [x] T033 [P] Run frontend test suite and confirm no new failures introduced at `npm --prefix apps/frontend run test`
- [x] T034 [P] Run lint and fix any linting errors at `npm run lint`
- [x] T035 [P] Run production build at `npm run build`
- [x] T036 [P] Run content verification to confirm all 10 MP3 and 10 transcript files are accounted for at `npm run verify:content`
- [x] T037 Manually verify mobile, tablet, and desktop layouts plus keyboard-only operation for all narration and transcript controls
- [x] T038 Track recording assets (`public/voice/`) and transcripts (`public/transcripts/`) in version control as part of the feature change

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3–6)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed) or sequentially in priority order (P1 → P2)
  - Each story is independently testable
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) — May integrate with US1 but independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) — Depends on US1/US2 for active narration; independently testable
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) — Depends on catalog existing; independently testable

### Within Each User Story

- Tests MUST be written and FAIL before implementation (Constitution III)
- Foundational infrastructure before story-specific implementation
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- T028 and T029 (accordion reveal + compact mobile guard) are related but touch different class conditions; T028 can proceed while T029 is planned
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Add catalog test asserting all 10 IDs, floor defaults, unique numbers, and transcript-N pairing at apps/frontend/src/tests/narrationCatalog.test.js"
Task: "Add resolver test for same-floor continuity, explicit scene changes, floor changes, and floors without narration at apps/frontend/src/tests/narrationCatalog.test.js"

# Launch implementation for User Story 1 together (independent files):
Task: "Implement one-second initial autoplay delay for Lower Ground recording after viewer ready at apps/frontend/src/pages/Panorama.jsx"
Task: "Implement destination floor recording start on floor change without added delay at apps/frontend/src/context/TourContext.jsx"
Task: "Implement same-floor continuity so moving between panoramas does not restart the recording at apps/frontend/src/context/TourContext.jsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo (includes FR-025 accordion reveal)
5. Add User Story 4 → Test independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
   - Developer D: User Story 4
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Setup and Foundational phases carry NO story label
- User Story phases (US1–US4) MUST carry the corresponding [USx] label
- Polish phase carries NO story label
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- FR-025 (accordion reveal) is implemented in T028 (tablet/desktop) and T029 (compact mobile guard)
