# Phase 0 Research: Tour Guide Narration

**Feature**: `029-tour-guide-narration` | **Date**: 2026-11-24 | **Plan**: [plan.md](./plan.md)

All clarifications from `spec.md` are resolved, and no open questions remain.

## Decision 1 - One authoritative narration catalog in JSON plus a JS resolver

**Decision**: Add `apps/frontend/src/lib/narrationCatalog.json` for data and `apps/frontend/src/lib/narrationCatalog.js` for lookup helpers. The JSON holds every recording/transcript pair and the floor defaults; the JS module exposes pure functions used by the UI and tests.

**Rationale**: The tour guide requires a JS or JSON catalog in `lib` that pairs each recording with a transcript by the same numeric ID. JSON keeps the data declarative and readable for content maintainers, and lets `scripts/verify-content.mjs` validate it without parsing JavaScript. The resolver stays small and testable. This also replaces the per-location placeholder `narration` objects so there is one source of truth.

**Alternatives considered**:
- Keep narration inside `catalog.json`: rejected because narration is assigned per floor or per specific scene (LG-2), while catalog locations are per floor; LG-2 would have no place to live.
- Put everything in one JavaScript module: acceptable, but makes the Node content verifier parse application code.
- Add a new persistence-backed API: rejected, the content is static and the frontend owns it.

## Decision 2 - Floor defaults plus explicit scene overrides

**Decision**: The catalog stores `floorDefaults` (`LG` -> `voice-1`, `UG` -> `voice-3`, `4F` -> `voice-4`, `5F` -> `voice-5`, `5M` -> `voice-6`, `6F` -> `voice-7`, `7F` -> `voice-8`, `8F` -> `voice-9`, `9F` -> `voice-10`) and entries. `voice-1` carries the scene `0-lg---1`; `voice-2` carries the scene `1-lg---2`.

**Rationale**: Nine recordings map cleanly to floor labels, but `voice-2` belongs to the LG-2 panorama while remaining on the LG floor. An explicit scene override is the smallest model that supports both rules and keeps all ten files assigned.

**Alternatives considered**:
- A flat floor map: rejected, it cannot express LG-2.
- Treat LG-2 as its own floor: rejected, `FLOOR_SEQUENCE` and the sidebar treat LG as one floor; adding a pseudo-floor would leak into navigation and gallery logic.

## Decision 3 - Scene resolution rules and same-floor continuity

**Decision**: Resolve the active entry in this order:

1. If the scene ID has an explicit entry, use it (LG initial view and LG-2).
2. If the current entry belongs to the same floor as the new scene, keep the current entry.
3. Otherwise, use the floor default.

Moving from LG-2 to LG-3 through LG-5 therefore keeps `voice-2` playing. Moving from LG-3 back to LG-1 starts `voice-1`, because LG-1 is an explicitly assigned view. Changing floor always selects that floor's default.

**Rationale**: This satisfies FR-006 (no restart on the same floor) while still honoring the two explicitly assigned LG views. It also makes the resolver a pure function that can be unit tested without React.

**Alternatives considered**:
- Always use the floor default on every scene change: rejected, LG-2 would never play.
- Treat any scene change on LG as a restart: rejected, it violates the same-floor continuity rule for LG-3 through LG-5.

## Decision 4 - Single audio element owned by an always-mounted component

**Decision**: Keep one hidden `<audio>` element inside `FloatingMenu`, and always render that element even when the mobile sidebar guard hides the visible controls.

**Rationale**: The current component returns `null` when the sidebar is open on a compact viewport. If the audio lived in the visible branch it would unmount and stop playback whenever the visitor opens the sidebar. Keeping one element guarantees FR-015 (only one recording at a time) and FR-009 (continue while navigating the same floor). The play button also calls `audio.play()` directly inside the click handler so browsers that require user activation succeed; state effects cover autoplay and source replacement.

**Alternatives considered**:
- Put audio in `Layout`: it survives the sidebar, but the play control loses direct access to the element, making strict mobile autoplay policies riskier.
- Put audio in `TourContext`: context is not a rendering owner; mixing long-lived DOM nodes with reducers is harder to test and violates the separation already used in the app.
- Use the Web Audio API: adds complexity and has the same autoplay policy, with no benefit for plain MP3 playback.

## Decision 5 - Preserve playback status on floor changes

**Decision**: `SELECT_LOCATION` stops resetting `narrationStatus`. A new `SET_SCENE` action updates `currentSceneId` and `activeNarrationId`. The status (`playing`, `paused`, `loading`, `blocked`, `ended`) is preserved; the new source loads at position 0 and plays only when the status is `playing` or `loading`.

**Rationale**: FR-008 requires preserving the paused/playing state across floors. The existing reset-to-`idle` behavior directly contradicts it. Preserving the status also makes the audio element's effect logic simple: source changes reset the position, status decides whether to play.

**Alternatives considered**:
- Add a separate `shouldPlay` flag: redundant with the existing status machine.
- Reset to `paused` on every floor change: rejected, an unpaused visitor would have to press play again, contrary to the replacement rule.

## Decision 6 - Persist floor and paused state only

**Decision**: Store `{ "floor": "<floor label>", "isPaused": <boolean> }` under `ciit_narration_state`. On startup, restore the location whose `order` matches the floor index (falling back to the default location), and show the panorama at that floor's first scene. If `isPaused` is true, start in `paused`; otherwise start in `idle` and let the autoplay path run.

**Rationale**: The spec requires restoring the current floor and the paused/playing state, and restarting an active recording from the beginning. Playback position is intentionally not stored, so no seeking logic is needed. `isPaused` also covers `blocked` and `ended`, which prevents an unexpected autoplay after refresh.

**Alternatives considered**:
- Store the exact scene ID and playback time: rejected as unnecessary scope; the spec only requires the floor and state, and restarting from the beginning is explicitly allowed.
- Store in `sessionStorage`: rejected, the requirement is a page refresh, and localStorage matches the existing first-visit persistence pattern.
- Store in the URL: rejected, it would change public links and is not required.

## Decision 7 - Autoplay one second after the viewer is ready

**Decision**: `Panorama` starts the initial narration one second after `PanoramaViewer` reports ready, and only when the status is `idle` and an entry exists. A ref ensures the timer is scheduled once per mount, and cleanup clears it.

**Rationale**: The tour guide says the first recording starts one second after the Lower Ground panorama renders following the instructions click. `onReady` is the existing signal that the viewer initialized and switched the first scene, so the delay starts from the correct moment. The same path restarts a restored playing recording after refresh, within the 2-second success criterion.

**Alternatives considered**:
- Start in `Layout` on mount: the timer could fire before the panorama is ready.
- Start on the instructions click: the instructions screen is not the panorama and the one-second delay is explicit.
- Wait for `loadedmetadata`: adds a second event dependency and can hang when metadata is slow.

## Decision 8 - Runtime transcript fetching with a paragraph fallback

**Decision**: `NarrationTranscript` fetches `transcriptSrc` from `/transcripts/<file>.md` when the transcript panel opens, caches results in `transcripts.js`, splits the text on blank lines, and renders paragraphs. A missing, empty, or failed fetch shows "Transcript not available yet." The control exposes `Show transcript`/`Hide transcript`.

**Rationale**: The ten transcript files already exist and are plain paragraphs. Runtime fetching keeps content editable without rebuilding and lets the UI degrade safely if a file is removed. No markdown parser dependency is needed. This also fixes the three existing `FloatingMenu` accessibility test failures by giving the control an accessible name.

**Alternatives considered**:
- Import files with Vite `?raw`: rejected because the public content directory would need imports, content edits would require a rebuild, and tests would need special handling.
- Add a Markdown library: rejected, no new dependencies are approved and the files contain no Markdown syntax.
- Ship static transcript text inside the catalog: rejected, it duplicates content and bloats the JSON.

## Decision 9 - Remove obsolete placeholder narration from the content catalog

**Decision**: Remove the `narration` blocks from `catalog.json`, remove `validateNarration` from `catalog.js`, and update the catalog tests accordingly.

**Rationale**: The placeholder `narration.wav` does not exist in `public/panoramas/placeholder/`, and `Layout` will no longer read per-location narration. Keeping dead, invalid content invites accidental reuse and makes `verify:content` fail. Removing it leaves `narrationCatalog.json` as the single narration source.

**Alternatives considered**:
- Leave the blocks untouched: rejected, they reference a nonexistent asset and imply a second source of truth.
- Replace them with the official files: rejected, it duplicates the catalog and still cannot represent LG-2.

## Decision 10 - Verify narration assets in the existing content script

**Decision**: Extend `scripts/verify-content.mjs` to read `narrationCatalog.json` and assert every `audioSrc` and `transcriptSrc` exists under `apps/frontend/public`. If the legacy `specs/001-campus-tour-foundation/contracts/content-schema.json` is missing, print a warning and continue with asset checks instead of crashing.

**Rationale**: `npm run verify:content` currently crashes because that spec directory does not exist, so the documented validation command cannot be used. Making the schema optional restores a useful asset gate and lets this feature validate its ten recordings and ten transcripts.

**Alternatives considered**:
- Add a separate `verify:narration` script: workable, but fragments content validation across two commands.
- Leave the script broken: rejected, the feature adds content assets that need verification.

## Decision 11 - Test strategy for media in jsdom

**Decision**: Add `HTMLMediaElement.prototype.play` and `.pause` stubs in `src/tests/setup.js`. Use `vi.useFakeTimers()` for the one-second autoplay delay and a mocked `global.fetch` for transcripts. Clear localStorage between tests.

**Rationale**: jsdom does not implement media playback, so component tests would throw otherwise. Stubbing once keeps every suite stable. Fake timers make the autoplay test deterministic, and a mocked fetch keeps transcript tests offline and fast.

**Alternatives considered**:
- Stub media in each test file: repetitive and easy to forget.
- Skip playback tests: rejected by the constitution's test-first gate for narration.

## Decision 12 - One-second delay applies only to the initial entry

**Decision**: Only the `Panorama` ready path uses the 1000 ms delay. Floor changes triggered by sidebar clicks or scene hotspots resolve and play immediately, subject to the status rules.

**Rationale**: FR-023 limits the delay to the initial Lower Ground recording. Later floor changes are direct responses to a user gesture, so a delay would feel broken and is not required.

**Alternatives considered**:
- Apply the delay to every floor: rejected by FR-023 and worse perceived responsiveness.

## Open Questions

None. The spec clarifications, the tour guide document, and the current codebase agree on the behaviors above.
