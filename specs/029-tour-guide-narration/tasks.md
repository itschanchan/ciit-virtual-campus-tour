---
description: "Task list for Tour Guide Narration"
---

# Tasks: Tour Guide Narration

**Input**: Design documents from `specs/029-tour-guide-narration/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: REQUIRED. The project constitution mandates test-first work for narration behavior, and `plan.md` Phase A lists the required suites. Write each test task first and confirm it fails before implementing the matching task.

**Organization**: Tasks are grouped by user story. Setup and Foundational phases unblock every story; each story phase then delivers an independently testable increment.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: `US1`, `US2`, `US3`, or `US4`
- Every task names the exact file path it changes

## Path Conventions

This is the existing web application. All feature work is in `apps/frontend/`; documentation is in `specs/029-tour-guide-narration/` and `docs/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the shared assets and test environment.

- [X] T001 [P] Stage the ten recordings under `apps/frontend/public/voice/` and the ten transcripts under `apps/frontend/public/transcripts/` so both directories are tracked by git; confirm the filenames match `Recording_1` through `Recording_10` and `Transcript_1` through `Transcript_10`
- [X] T002 [P] Add `HTMLMediaElement.prototype.play` and `HTMLMediaElement.prototype.pause` stubs plus a `localStorage.clear()` reset helper in `apps/frontend/src/tests/setup.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared catalog, storage, transcript, and scene-state infrastructure that every user story depends on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

### Tests first

- [X] T003 [P] Write `apps/frontend/src/tests/narrationCatalog.test.js` covering the ten entries, unique IDs and numbers, floor defaults, the LG-2 scene override, and the `voice-N`/`transcript-N` suffix pairing
- [X] T004 [P] Write `apps/frontend/src/tests/narrationStorage.test.js` covering valid read/write/clear, missing key, invalid JSON, and storage exceptions
- [X] T005 [P] Write `apps/frontend/src/tests/transcripts.test.js` covering successful fetch, empty text, failed response, network rejection, and cache reuse
- [X] T011 [P] Add scene-resolution tests to `apps/frontend/src/tests/TourContext.test.jsx` for LG-2, same-floor continuity, and floor-default changes

### Implementation

- [X] T006 Create `apps/frontend/src/lib/narrationCatalog.json` with `version`, the nine `floorDefaults`, and all ten entries defined in `data-model.md` (depends on T003)
- [X] T007 Create `apps/frontend/src/lib/narrationCatalog.js` with `getNarrationById`, `getNarrationForScene`, `getDefaultNarrationForFloor`, and `resolveNarration` (depends on T006)
- [X] T008 Create `apps/frontend/src/lib/narrationStorage.js` with `readNarrationState`, `writeNarrationState`, and `clearNarrationState` using key `ciit_narration_state` (depends on T004)
- [X] T009 Create `apps/frontend/src/lib/transcripts.js` with a cached `loadTranscript(src)` helper that returns `null` on missing or failed content (depends on T005)
- [X] T010 Remove the obsolete `narration` blocks from `apps/frontend/src/lib/catalog.json`, remove `validateNarration` from `apps/frontend/src/lib/catalog.js`, and update `apps/frontend/src/tests/catalog.test.js`
- [X] T012 Add `currentSceneId`, `activeNarrationId`, `SET_SCENE`, `setCurrentSceneId`, and the `activeNarration` memo to `apps/frontend/src/context/TourContext.jsx` (depends on T007, T011)
- [X] T013 Call `setCurrentSceneId(sceneId)` on every scene change in `apps/frontend/src/pages/Panorama.jsx` before the location guard (depends on T012)
- [X] T014 Read `activeNarration` from `useTour()` in `apps/frontend/src/components/Layout.jsx` and pass it to `FloatingMenu` instead of `currentLocation.narration` (depends on T012)

**Checkpoint**: Catalog resolution, storage, transcript loading, and scene tracking are ready. User stories can begin.

---

## Phase 3: User Story 1 - Floor narration starts automatically (Priority: P1) 🎯 MVP

**Goal**: The assigned official recording starts automatically on each narrated floor and does not restart while moving between non-assigned panoramas on the same floor.

**Independent Test**: Complete the instructions screen and confirm Recording_1 starts about one second after the Lower Ground panorama is ready; visit each narrated floor and confirm its assigned recording; move between LG-3 and LG-4 and confirm no restart.

### Tests for User Story 1

- [X] T015 [P] [US1] Add tests to `apps/frontend/src/tests/FloatingMenu.test.jsx` for the hidden `<audio>` source, play on `loading`/`playing`, `ended`, media error, and blocked promise rejection
- [X] T016 [P] [US1] Create `apps/frontend/src/tests/Panorama.test.jsx` with fake timers that asserts playback starts 1000 ms after `PanoramaViewer` reports ready and only once per mount

### Implementation for User Story 1

- [X] T017 [US1] Render the hidden `<audio>` element with `src`, `preload="metadata"`, `onEnded`, `onError`, and the muted binding in `apps/frontend/src/components/FloatingMenu.jsx` (depends on T014, T015)
- [X] T018 [US1] Add the source-change reset and status effects that play or pause the element in `apps/frontend/src/components/FloatingMenu.jsx` (depends on T017)
- [X] T019 [US1] Keep the `<audio>` element mounted when the compact sidebar hides the visible panel in `apps/frontend/src/components/FloatingMenu.jsx` (depends on T017)
- [X] T020 [US1] Wire `PanoramaViewer`'s `onReady` callback and schedule the one-second initial playback in `apps/frontend/src/pages/Panorama.jsx` (depends on T012, T016)

**Checkpoint**: User Story 1 is fully functional and testable without pause persistence or transcripts.

---

## Phase 4: User Story 2 - Control and retain playback state (Priority: P1)

**Goal**: Play and pause work; floor changes replace the recording unless paused; refresh restores the floor and pause state; blocked autoplay falls back to an enabled manual play control.

**Independent Test**: Pause on 6F, move to 7F, refresh, and confirm 7F stays paused; resume and confirm Recording_8 restarts; play on UG, refresh, and confirm UG restarts from the beginning or shows the blocked prompt.

### Tests for User Story 2

- [ ] T021 [P] [US2] Add tests to `apps/frontend/src/tests/FloatingMenu.test.jsx` for pause, resume, replay from `ended`, the blocked state keeping the play control enabled, and the `p` keyboard shortcut
- [ ] T022 [P] [US2] Add tests to `apps/frontend/src/tests/TourContext.test.jsx` for preserving `paused` across location changes, replacing the entry on floor change while playing, restoring a saved floor, and restoring the paused state
- [ ] T023 [P] [US2] Add a restored-floor test to `apps/frontend/src/tests/PanoramaViewer.test.jsx` asserting the first scene comes from the restored location's floor

### Implementation for User Story 2

- [ ] T024 [US2] Stop resetting `narrationStatus` in `SELECT_LOCATION` and clear it only when `SET_SCENE` resolves no entry in `apps/frontend/src/context/TourContext.jsx` (depends on T012, T022)
- [ ] T025 [US2] Add the persistence effect that writes `{ floor, isPaused }` on active-entry and status changes in `apps/frontend/src/context/TourContext.jsx` (depends on T008, T024)
- [ ] T026 [US2] Restore the saved floor, paused state, and active entry during initial content load in `apps/frontend/src/context/TourContext.jsx` (depends on T025)
- [ ] T027 [US2] Use `FLOOR_SCENE_MAP` for the restored location's first scene instead of the hardcoded LG scene in `apps/frontend/src/components/PanoramaViewer.jsx` (depends on T023, T026)
- [ ] T028 [US2] Keep the play control enabled in the `blocked` state and show the manual play prompt in `apps/frontend/src/components/FloatingMenu.jsx` (depends on T018, T021)

**Checkpoint**: User Stories 1 and 2 work together; refresh and pause behavior match the specification.

---

## Phase 5: User Story 3 - Transcript matches the active recording (Priority: P2)

**Goal**: The Floating Menu shows the transcript whose numeric suffix matches the active recording, updates on floor changes, and shows a clear fallback when content is unavailable.

**Independent Test**: Open the transcript on UG, 5F, and 9F and confirm the displayed text matches `transcript-3`, `transcript-5`, and `transcript-10`; rename one file and confirm the fallback appears.

### Tests for User Story 3

- [X] T029 [P] [US3] Create `apps/frontend/src/tests/NarrationTranscript.test.jsx` covering the loading state, paragraph rendering, empty file, and fetch failure fallback
- [X] T030 [P] [US3] Update the transcript tests in `apps/frontend/src/tests/FloatingMenu.test.jsx` for the mocked fetch, the `Show transcript`/`Hide transcript` accessible names, `aria-expanded`, and updating after a narration change

### Implementation for User Story 3

- [ ] T031 [US3] Create `apps/frontend/src/components/NarrationTranscript.jsx` using `loadTranscript` from `apps/frontend/src/lib/transcripts.js` with `Loading transcript...` and `Transcript not available yet.` states (depends on T009, T029)
- [ ] T032 [US3] Replace the inline transcript text in `apps/frontend/src/components/FloatingMenu.jsx` with `NarrationTranscript` and add the `Show transcript`/`Hide transcript` `aria-label` while keeping `aria-expanded` and `aria-controls` (depends on T030, T031)
- [ ] T033 [US3] Reset the transcript panel when the active narration changes in `apps/frontend/src/components/FloatingMenu.jsx` (depends on T032)

**Checkpoint**: Transcripts always match the active recording and degrade safely.

---

## Phase 6: User Story 4 - Content maintainer can pair recordings and transcripts (Priority: P2)

**Goal**: One catalog visibly pairs each recording and transcript by ID, assigns it to exactly one floor or view, and is validated by the content script.

**Independent Test**: Inspect `apps/frontend/src/lib/narrationCatalog.json` and confirm every `voice-N` has `transcript-N` and a floor assignment; run `npm run verify:content` and confirm all ten pairs are found.

### Tests for User Story 4

- [X] T034 [P] [US4] Extend `apps/frontend/src/tests/narrationCatalog.test.js` with file-existence checks for every `audioSrc` and `transcriptSrc`, uniqueness of all ten pairs, and rejection of locked-floor entries (depends on T003)

### Implementation for User Story 4

- [X] T035 [US4] Extend `scripts/verify-content.mjs` to read `apps/frontend/src/lib/narrationCatalog.json`, verify every `audioSrc` and `transcriptSrc` under `apps/frontend/public`, and warn instead of crashing when `specs/001-campus-tour-foundation/contracts/content-schema.json` is absent (depends on T006)
- [X] T036 [US4] Update the ID section of `docs/prompts/frontend-prompts/tour_guide.md` to name `apps/frontend/src/lib/narrationCatalog.json` and describe how to add a new recording/transcript pair (depends on T006)

**Checkpoint**: Content can be extended without changing playback logic.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validate the whole feature and the documented workflows.

- [X] T037 [P] Run `npm --prefix apps/frontend run test` and fix any narration regressions; confirm the three `FloatingMenu` transcript-accessibility failures are gone and no new failures were introduced
- [X] T038 [P] Run `npm run lint` and `npm run build` and fix any errors in `apps/frontend/src/`
- [X] T039 [P] Run `npm run verify:content` against `scripts/verify-content.mjs` and confirm it reports all ten recordings and ten transcripts without crashing
- [X] T040 [P] Execute every scenario in `specs/029-tour-guide-narration/quickstart.md` at desktop, tablet, and mobile widths, including keyboard-only operation and the compact-sidebar playback check
- [X] T041 [P] Confirm `apps/frontend/package.json` has no new dependencies and that `git status` shows the narration assets, transcripts, source changes, and documentation staged for the feature

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup. Blocks all user stories.
- **User Stories (Phases 3-6)**: All depend on Foundational.
  - US1 (P1) is the MVP and should be completed first.
  - US2 (P1) depends on US1's audio element.
  - US3 (P2) depends on US1/US2's active narration and the foundational transcript loader.
  - US4 (P2) depends only on the foundational catalog and can run alongside US1-US3.
- **Polish (Phase 7)**: Depends on all desired stories.

### User Story Dependencies

- **US1**: Needs T003-T014. No dependency on other stories.
- **US2**: Needs US1 (T017-T020) for the audio element and status effects; adds pause, persistence, and restore behavior.
- **US3**: Needs US1/US2 for the active narration prop; can start once T014 and T032 are unblocked.
- **US4**: Needs only T006 and T007; independent of playback work.

### Within Each Story

- Tests are written and observed failing before implementation.
- Catalog data precedes the resolver.
- Resolver precedes `TourContext` scene state.
- Scene state precedes playback UI.
- Persistence precedes restore behavior.
- Transcript component precedes the Floating Menu integration.

### Parallel Opportunities

- T001 and T002.
- T003, T004, T005, and T011.
- T006, T008, T009, and T010 after their test tasks.
- T015 and T016.
- T021, T022, and T023.
- T029 and T030.
- T034.
- T037, T038, T039, T040, and T041.

---

## Parallel Example: Foundational Tests

```bash
Task: "Write narrationCatalog tests in apps/frontend/src/tests/narrationCatalog.test.js"
Task: "Write narrationStorage tests in apps/frontend/src/tests/narrationStorage.test.js"
Task: "Write transcripts tests in apps/frontend/src/tests/transcripts.test.js"
Task: "Add scene-resolution tests to apps/frontend/src/tests/TourContext.test.jsx"
```

## Parallel Example: User Story 1

```bash
Task: "Add audio element and status tests to apps/frontend/src/tests/FloatingMenu.test.jsx"
Task: "Create autoplay timing test in apps/frontend/src/tests/Panorama.test.jsx"
```

## Parallel Example: User Story 2

```bash
Task: "Add pause/resume/replay tests to apps/frontend/src/tests/FloatingMenu.test.jsx"
Task: "Add pause and restore tests to apps/frontend/src/tests/TourContext.test.jsx"
Task: "Add restored-floor test to apps/frontend/src/tests/PanoramaViewer.test.jsx"
```

## Parallel Example: User Story 3

```bash
Task: "Create NarrationTranscript tests in apps/frontend/src/tests/NarrationTranscript.test.jsx"
Task: "Update transcript tests in apps/frontend/src/tests/FloatingMenu.test.jsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. **STOP and VALIDATE**: Complete the instructions screen, confirm Recording_1 starts after one second, visit each floor, and confirm same-floor continuity.
5. Demo the automatic narration before adding pause persistence or transcripts.

### Incremental Delivery

1. Setup + Foundational → catalog, storage, and scene tracking ready.
2. US1 → automatic per-floor narration (MVP).
3. US2 → pause, floor replacement, refresh restore, and blocked autoplay fallback.
4. US3 → matching transcripts and accessible transcript control.
5. US4 → verified catalog and maintainer documentation.
6. Polish → full suite, lint, build, content verification, and quickstart validation.

### Parallel Team Strategy

After Foundational:

- Developer A: US1 playback element and autoplay.
- Developer B: US2 persistence and restore behavior after US1's audio element lands.
- Developer C: US3 transcript component and Floating Menu integration.
- Developer D: US4 content verification and documentation.

---

## Notes

- `[P]` tasks touch different files and can run together.
- `[USx]` labels map tasks to `spec.md` user stories.
- The six pre-existing `Sidebar` test failures are outside this feature; do not fix them here unless they block the narration suites.
- `npm run verify:content` must stop crashing on the missing legacy schema before it can validate the narration assets.
- Commit after each task or logical group, and keep the assets out of the ignore list.
