# Quickstart: Tour Guide Narration

**Feature**: `029-tour-guide-narration` | **Date**: 2026-11-24

This guide validates the feature end to end. It does not replace `tasks.md`; it proves the behavior after implementation.

## Prerequisites

- Node.js 24 LTS and npm available.
- Frontend dependencies installed: `npm install` then `npm run setup`.
- The ten recordings are in `apps/frontend/public/voice/`.
- The ten transcripts are in `apps/frontend/public/transcripts/`.
- Reference: [data-model.md](./data-model.md), [narration catalog contract](./contracts/narration-catalog.md), [persistence contract](./contracts/playback-persistence.md), [floating menu contract](./contracts/floating-menu-narration.md).

## Automated checks

```powershell
npm --prefix apps/frontend run test
npm run lint
npm run build
npm run verify:content
```

Expected results:

- All new and updated narration tests pass.
- No new lint errors.
- The production build succeeds.
- Content verification reports the ten recordings and ten transcripts as present.

Known baseline: six `Sidebar` tests fail before this feature and are outside its scope. The three `FloatingMenu` transcript-accessibility failures are fixed by this feature.

## Run the tour

```powershell
npm run dev
```

Open the frontend URL printed by Vite. Clear site data once before starting so the first-visit flow runs.

## Scenario 1 - Lower Ground entry

1. Clear site data and reload.
2. Complete the welcome and instructions screens.
3. Wait for the Lower Ground panorama.

Expected:

- Recording_1 starts about one second after the panorama is ready.
- The play control shows `Pause narration`.
- The transcript control shows `Show transcript`.

## Scenario 2 - LG-2 and same-floor continuity

1. From the LG initial view, navigate to the LG-2 panorama.
2. Move to LG-3 and LG-4.
3. Return to LG-1.

Expected:

- LG-2 starts Recording_2.
- LG-3 and LG-4 keep Recording_2 playing without restarting.
- Returning to LG-1 starts Recording_1.

## Scenario 3 - Floor replacement

1. While playing, use the sidebar to open UG, then 4F, 5F, 5M, 6F, 7F, 8F, and 9F.

Expected:

- Each floor starts its assigned recording: 3, 4, 5, 6, 7, 8, 9, 10.
- The previous recording stops; only one plays at a time.
- Moving between panoramas on the same floor does not restart.

## Scenario 4 - Pause, floor change, refresh

1. Pause narration on 6F.
2. Navigate to 7F.
3. Refresh the page.
4. Press the play control.

Expected:

- The 6F recording pauses.
- 7F loads with narration paused; the control reads `Resume narration`.
- Refresh returns to 7F with narration still paused.
- Pressing play starts Recording_8 from the beginning.

## Scenario 5 - Refresh while playing

1. Play Recording_3 on UG.
2. Refresh the page.

Expected:

- The tour returns to UG.
- Playback restarts from the beginning within two seconds, or the browser blocks it and shows the manual play prompt.

## Scenario 6 - Transcript matching

1. Open the transcript on UG, then 5F, then 9F.

Expected:

- The panel shows the transcript with the same numeric suffix as the active recording.
- The panel updates immediately when the floor changes.
- `Show transcript` becomes `Hide transcript` while open.

## Scenario 7 - Blocked autoplay

1. Use a browser profile that blocks sound autoplay, or disable autoplay for the site.
2. Reload on a narrated floor.

Expected:

- The page does not throw or stall.
- The message explains that playback was blocked.
- The play control stays enabled and starts the recording when pressed.

## Scenario 8 - Missing transcript fallback

1. Temporarily rename one transcript file.
2. Open that floor's transcript.

Expected:

- The panel shows `Transcript not available yet.`
- Playback and navigation remain usable.
3. Restore the file.

## Scenario 9 - Responsive and keyboard

1. Check desktop, tablet, and mobile widths.
2. On mobile, open and close the sidebar while narration plays.
3. Tab through the floating menu and press `p` and `m` on their controls.

Expected:

- No horizontal scrolling or overlapping controls.
- Narration continues while the compact sidebar is open.
- All controls have visible focus and accessible names.
- `p` toggles play/pause and `m` toggles mute.

## Scenario 10 - No narration on locked floors

1. Inspect the sidebar.

Expected:

- 1F, 2F, 3F, 10F, and 11F remain locked.
- Selecting them shows the existing notice and never starts audio.
