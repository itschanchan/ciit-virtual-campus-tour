# Implementation Plan: Tour Guide Narration

**Branch**: `029-tour-guide-narration` | **Date**: 2026-11-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/029-tour-guide-narration/spec.md`

**Note**: This plan is filled in by the `/speckit.plan` command from `.specify/templates/plan-template.md`.

## Summary

Integrate the ten official voice-over recordings and their matching transcripts into the public tour. The frontend gains one authoritative narration catalog (`src/lib/narrationCatalog.json` plus a small resolver), a scene-aware narration state in `TourContext`, one always-mounted hidden audio element owned by `FloatingMenu`, runtime transcript loading from `public/transcripts/`, and localStorage persistence of the active floor and paused state.

The recording-to-floor mapping is sequential and uses all ten files: LG initial view = 1, LG-2 = 2, UG = 3, 4F = 4, 5F = 5, 5M = 6, 6F = 7, 7F = 8, 8F = 9, 9F = 10. Changing floors replaces the recording unless narration is paused; moving between other panoramas on the same floor keeps playing; refresh restores the floor and pause state; a restored active recording restarts from the beginning. Browser-blocked autoplay leaves playback paused with an enabled manual play control.

## Technical Context

**Language/Version**: JavaScript (ES Modules, ES2022); React 19.2, Vite 8, Node.js 24 LTS

**Primary Dependencies**: React 19.2, `@mui/icons-material` 9.5, Marzipano 0.10 (all existing); browser `HTMLMediaElement` audio API; no new packages

**Storage**: Browser `localStorage` key `ciit_narration_state`; static MP3 files in `apps/frontend/public/voice/` (10 files, approximately 16.5 MB total) and Markdown transcripts in `apps/frontend/public/transcripts/`

**Testing**: Vitest 5 with `@testing-library/react` 16 and jsdom 29; media element methods stubbed in `src/tests/setup.js`; fake timers for the one-second autoplay delay

**Target Platform**: Modern evergreen browsers on desktop, tablet, and mobile viewports

**Project Type**: Web application (existing `apps/frontend` + `apps/backend`); this feature is frontend-only

**Performance Goals**: The assigned recording starts within 2 seconds of the floor becoming active (SC-001); zero restarts when moving between non-assigned panoramas on the same floor (SC-002); at most one audio stream at a time; no new runtime bundle dependency

**Constraints**: Browser autoplay policies may block unmuted playback; transcripts are plain Markdown paragraphs; narration assets must remain under `public/voice/` with no first-name subfolder; KISA style with maximum nesting of 3 and blocks of 25-30 active lines

**Scale/Scope**: 10 recordings and 10 transcripts, 9 narrated floor labels plus the LG-2 scene, 54 panorama scenes, 12 catalog locations with 3 locked floors between UG and 4F

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Result | Evidence |
| :--- | :--- | :--- |
| I. MERN Stack Alignment (NON-NEGOTIABLE) | PASS | React + Vite + JavaScript ES Modules + Vitest; no new dependencies and no backend framework changes |
| II. MVC Separation and Application Boundaries | PASS | All narration, transcript, persistence, and UI work stays in `apps/frontend`; the backend is untouched |
| III. Test-First Quality Gate (NON-NEGOTIABLE) | PASS | New unit and component tests are written before implementation for catalog mapping, resolver continuity, storage, playback states, transcript fallback, autoplay timing, and accessibility |
| IV. Security, Secrets, and Configuration Discipline | PASS | No secrets, credentials, or configuration values are added; localStorage stores only a public floor label and a paused flag |
| V. Responsive, Accessible Immersive Experience | PASS | Transcripts provide the required text alternative; transcript and playback controls get accessible names, keyboard support, and focus states; layouts are verified at mobile, tablet, and desktop widths |

**Baseline note**: The frontend suite currently has 9 pre-existing failures. The 3 `FloatingMenu` transcript-accessibility failures are resolved by this feature. The 6 `Sidebar` failures predate this feature and remain a separate merge blocker; this plan must not introduce new failures.

**Post-design re-check**: PASS. Phase 1 introduces no new principles, projects, dependencies, or backend surface. See `research.md` for resolved decisions.

## Project Structure

### Documentation (this feature)

```text
specs/029-tour-guide-narration/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   ├── narration-catalog.md
│   ├── playback-persistence.md
│   └── floating-menu-narration.md
├── checklists/
│   └── requirements.md  # Created during /speckit.specify
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created here)
```

### Source Code (repository root)

```text
apps/frontend/
├── public/
│   ├── voice/                              # 10 official MP3 recordings (already present)
│   └── transcripts/                        # 10 Markdown transcripts (already present)
└── src/
    ├── components/
    │   ├── FloatingMenu.jsx                # Hidden audio element, playback UI, transcript panel
    │   ├── Layout.jsx                      # Resolves the active narration for FloatingMenu
    │   └── NarrationTranscript.jsx         # New transcript loader and paragraph renderer
    ├── context/
    │   └── TourContext.jsx                 # Scene-aware narration state and persistence
    ├── lib/
    │   ├── narrationCatalog.json           # New authoritative recording/transcript catalog
    │   ├── narrationCatalog.js             # New resolver helpers
    │   ├── narrationStorage.js             # New localStorage read/write/clear helpers
    │   ├── transcripts.js                  # New transcript fetch and cache helper
    │   ├── catalog.json                    # Remove obsolete placeholder narration entries
    │   ├── catalog.js                      # Remove obsolete narration validation
    │   └── floorSceneMap.js                # Reuse existing floor and scene helpers
    ├── pages/
    │   └── Panorama.jsx                    # Reports scene changes and starts initial autoplay
    └── tests/
        ├── narrationCatalog.test.js        # New catalog and resolver tests
        ├── narrationStorage.test.js        # New persistence tests
        ├── NarrationTranscript.test.jsx    # New transcript loading and fallback tests
        ├── FloatingMenu.test.jsx           # Updated playback, transcript, and accessibility tests
        ├── TourContext.test.jsx            # Updated scene, pause, and restore tests
        ├── PanoramaViewer.test.jsx         # Updated restored-floor initial scene test
        └── setup.js                        # Media element stubs for jsdom

scripts/
└── verify-content.mjs                      # Validate narration assets; tolerate the missing legacy schema
```

**Structure Decision**: Keep the existing single frontend application. Narration content is data-driven in `src/lib`, playback state is owned by the existing `TourContext`, and the existing `FloatingMenu` becomes the single audio owner so the audio element survives mobile sidebar toggles. No backend or route changes are needed.

## Implementation Phases

### Phase A - Tests first (Constitution III)

1. Add catalog tests that assert all ten IDs, floor defaults, LG-2 scene override, unique numbers, `transcript-N` pairing, and on-disk audio/transcript files.
2. Add resolver tests for same-floor continuity, explicit scene changes, floor changes, and floors without narration.
3. Add storage tests for valid reads, invalid JSON, blocked storage, and clearing.
4. Update `TourContext` tests: floor change preserves paused state, scene change selects the right entry, refresh restores floor and pause state.
5. Update `FloatingMenu` tests: hidden audio element, play/pause/ended/blocked handling, transcript loading and fallback, and `Show transcript`/`Hide transcript` accessible names.
6. Update `PanoramaViewer` tests for a restored non-LG initial scene.
7. Add `NarrationTranscript` tests for loading, success, empty file, and fetch failure.
8. Observe the new tests failing before implementing the changes.

### Phase B - Catalog and state

1. Create `narrationCatalog.json`, `narrationCatalog.js`, `narrationStorage.js`, and `transcripts.js`.
2. Remove the obsolete `narration` blocks from `catalog.json` and drop `validateNarration` from `catalog.js`.
3. Extend `TourContext` with `currentSceneId`, `activeNarrationId`, `setCurrentSceneId`, restored-state loading, and the persistence effect.
4. Preserve `narrationStatus` across floor changes and clear it only when the destination floor has no recording.

### Phase C - Playback and UI

1. Render the hidden `<audio>` element in `FloatingMenu`, always mounted even when the mobile sidebar hides the visible panel.
2. Add source-change, status, mute, ended, error, and blocked effects; keep direct `audio.play()` inside the play click for user activation.
3. Keep the blocked state's play control enabled and show the manual play prompt.
4. Replace the transcript text node with `NarrationTranscript`, which fetches `transcriptSrc`, caches it, renders paragraphs, and falls back to "Transcript not available yet."
5. Add `aria-label` values `Show transcript` and `Hide transcript` while keeping `aria-expanded` and `aria-controls`.
6. Wire `Layout` to `activeNarration` and `Panorama`/`PanoramaViewer` to report scenes and start the one-second initial autoplay after viewer ready.

### Phase D - Verification

1. Update `verify-content.mjs` to validate every catalog `audioSrc` and `transcriptSrc` against `apps/frontend/public`, and to skip schema validation with a warning when the legacy schema file is absent.
2. Run `npm --prefix apps/frontend run test`, `npm run lint`, `npm run build`, and `npm run verify:content`.
3. Manually verify mobile, tablet, and desktop layouts plus keyboard-only operation.
4. Track the recording assets and transcripts in version control as part of the feature change.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations. The feature reuses the existing React, Vitest, context, and component structure and adds no dependencies or projects.
