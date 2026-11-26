# Quickstart: Tour Guide Narration

**Branch**: `029-tour-guide-narration` | **Spec**: `specs/029-tour-guide-narration/spec.md`

## Purpose

Runnable validation scenarios that prove the tour guide narration feature works end-to-end. This is a validation/run guide; implementation details belong in `tasks.md` and the implementation phase.

## Prerequisites

- Repository cloned at branch `029-tour-guide-narration`.
- Node.js 24 LTS installed.
- Dependencies installed: `npm install` at repo root, then `npm run setup`.
- Backend `.env` configured with `MONGODB_URI`, `MONGODB_NAME`, and a non-empty `JWT_SECRET` (required only if starting the backend; this feature is frontend-only).
- 10 MP3 recordings present in `apps/frontend/public/voice/`.
- 10 Markdown transcripts present in `apps/frontend/public/transcripts/`.

## Setup commands

```bash
# From repo root
npm install
npm run setup
# Copy backend environment (backend not required for this frontend-only feature)
Copy-Item apps/backend/.env.example apps/backend/.env
```

## Test commands

```bash
# Frontend tests (Vitest + Supertest)
npm --prefix apps/frontend run test

# Lint
npm run lint

# Build
npm run build

# Validate catalog content and assets
npm run verify:content
```

## Validation scenarios

### Scenario 1: Assigned recording starts on each narrated floor (SC-001, FR-004, FR-005)

1. Start the dev server: `npm run dev`.
2. Complete the instructions screen and continue to the Lower Ground panorama.
3. Confirm Recording_1 starts automatically about one second after the panorama renders.
4. Navigate to each narrated floor (LG-2, UG, 4F, 5F, 5M, 6F, 7F, 8F, 9F).
5. Confirm the assigned recording starts on each floor without an added delay.
6. Move between panoramas on the same floor and confirm the recording does not restart.

Expected: The correct recording plays on each floor; no unintended restarts within a floor.

### Scenario 2: Play/pause and floor-change state preservation (SC-003, SC-004, SC-011, FR-007, FR-008, FR-010)

1. Play narration on a floor.
2. Pause it, then navigate to another floor.
3. Confirm narration remains paused and the new floor's recording is selected.
4. Resume playback on the new floor.
5. Change floors while playing; confirm the destination recording replaces the current one.

Expected: Paused state preserved across floors; playing state replaced by destination recording.

### Scenario 3: Transcript matches active recording (SC-005, FR-012, FR-013, FR-022)

1. Open the transcript in the Floating Menu on any narrated floor.
2. Confirm the transcript with the matching numeric suffix is displayed.
3. Change floors and confirm the transcript updates to match the new recording.
4. Temporarily remove a transcript file and confirm the fallback "Transcript not available yet." appears while the tour remains usable.

Expected: Transcript ID always matches recording ID; fallback shown when missing.

### Scenario 4: Accordion reveal on tablet and desktop (FR-025)

1. Open the transcript on a tablet or desktop viewport.
2. Confirm the Floating Menu animates smoothly from pill shape to rounded rectangle.
3. Collapse the transcript and confirm the menu returns to its original pill shape.
4. Repeat on a compact mobile viewport; confirm the menu keeps its existing shape without the accordion reveal.

Expected: Pill → rounded rectangle → pill animation on tablet/desktop; no shape change on compact mobile.

### Scenario 5: Blocked autoplay fallback (SC-012, FR-015)

1. Load a narrated floor with browser autoplay blocked.
2. Confirm playback remains paused and a manual play control is offered.
3. Press play and confirm narration starts.

Expected: Tour remains usable with manual play path.

### Scenario 6: Refresh restores floor and state (SC-006, FR-011)

1. Play narration on a floor.
2. Refresh the page.
3. Confirm the same floor is restored and the recording restarts from the beginning.
4. Pause narration, change floors, refresh, and confirm the restored floor remains paused.

Expected: Floor and paused/playing state restored; active playback restarts from beginning.

## Expected outcomes

- All 10 recordings and 10 transcripts accounted for by the catalog (SC-009).
- 0 unintended restarts between panoramas on the same floor (SC-002).
- All narration and transcript controls keyboard operable with accessible names (SC-008).
- 0 tour-blocking failures when a recording or transcript is missing (SC-007).
- Panorama viewer remains interactive while narration plays (SC-010).

## Related artifacts

- Data model: `data-model.md`
- Catalog contract: `contracts/narration-catalog.md`
- Persistence contract: `contracts/playback-persistence.md`
- Floating Menu UI contract: `contracts/floating-menu-narration.md`
- Research decisions: `research.md`
- Implementation tasks: `tasks.md` (Phase 2 output, not created here)
