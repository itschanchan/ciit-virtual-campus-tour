# CIIT Virtual Campus Tour: Official Tour Guide

**Description:** This document contains all of the rules and instructions in integrating the voice over to the virtual campus tour environment, from recognizing its target file path in the codebase, to implementing the MP3 voice over files in the system.

---

## Rules:

1. The MP3 files of the voice over are contained directly inside the `/public/voice/` folder. A first-name subfolder is not required for the current implementation.

2. The voice over should only play to its assigned designated locations only. Continue playing the voice over as the user navigates to other panorama views with the same floor ID.

3. **Play/Pause:** The user can play and pause the recordings.

4. **Playback Persistence:** The voice over is persistent to the current floor viewed on the screen if the user refreshes the page. The voice over remains paused if the user paused it and changes floors. If it is unpaused, playback continues as the user navigates through the tour. When the user changes floors, the current recording is replaced by the destination floor's recording unless playback is paused. On refresh, the current floor and paused/playing state are restored; if playback was active, the floor recording restarts from the beginning. If the browser blocks autoplay, the recording remains paused and the user is prompted to press play.

5. **Tour Guide IDs:** Create `apps/frontend/src/lib/narrationCatalog.json` (a JSON file) plus a small JS resolver in `apps/frontend/src/lib/narrationCatalog.js`. Both live inside the `lib` folder. The JSON pairs each recording and transcript by ID and assigns each to a floor or specific view.

**Example ID:**

- `CIIT_Glitch_Virtual_Campus_Recording_1.mp3` = `voice-1`; equivalent to `CIIT_Glitch_Virtual_Campus_Transcript_1.md` = `transcript-1`.

6. **Transcript Integration:** The transcript should display in the `Floating Menu` and it should display with its corresponding ID equivalence so that it is the right transcript while the voice over sound file is playing. Transcript text is a content dependency; until it is supplied, the Floating Menu shows a clear "transcript not available" fallback.

**Example ID:**

- `CIIT_Glitch_Virtual_Campus_Recording_1.mp3` = `voice-1`; equivalent to `CIIT_Glitch_Virtual_Campus_Transcript_1.md` = `transcript-1`. Therefore, the `-1` suffix makes these voice over and transcript compatible.

7. **User's POV:** In the user's perspective, this is the step-by-step process on how the voice over will play. Each MP3 file shall play automatically as the user opens the website. Here are the full process flow in auto play.

### LOWER GROUND

- Auto play `CIIT_Glitch_Virtual_Campus_Recording_1.mp3` when the user clicks the `Instructions Screen` and 1 second after rendering the `Panorama Viewer` in the Lower Ground level.

- Auto play `CIIT_Glitch_Virtual_Campus_Recording_2.mp3` after the user clicks the `LG-2` navigation button (the LG-2 panorama view).

### UPPER GROUND

- Auto play `CIIT_Glitch_Virtual_Campus_Recording_3.mp3` when the user clicks the panoramas on `UG` floor.

### 4F

- Auto play `CIIT_Glitch_Virtual_Campus_Recording_4.mp3` when the user clicks the panoramas on `4F` floor.

### 5F & 5M

- Auto play `CIIT_Glitch_Virtual_Campus_Recording_5.mp3` when the user clicks the panoramas on `5F` floor and `CIIT_Glitch_Virtual_Campus_Recording_6.mp3` for the `5M` floor.

### 6F

- Auto play `CIIT_Glitch_Virtual_Campus_Recording_7.mp3` when the user clicks the panoramas on `6F` floor.

### 7F

- Auto play `CIIT_Glitch_Virtual_Campus_Recording_8.mp3` when the user clicks the panoramas on `7F` floor.

### 8F

- Auto play `CIIT_Glitch_Virtual_Campus_Recording_9.mp3` when the user clicks the panoramas on `8F` floor.

### 9F

- Auto play `CIIT_Glitch_Virtual_Campus_Recording_10.mp3` when the user clicks the panoramas on `9F` floor.

---

## Recording Assignment Summary

| Floor / View | Recording | Transcript |
| :--- | :--- | :--- |
| Lower Ground initial view | `CIIT_Glitch_Virtual_Campus_Recording_1.mp3` | `transcript-1` |
| Lower Ground LG-2 | `CIIT_Glitch_Virtual_Campus_Recording_2.mp3` | `transcript-2` |
| Upper Ground | `CIIT_Glitch_Virtual_Campus_Recording_3.mp3` | `transcript-3` |
| 4F | `CIIT_Glitch_Virtual_Campus_Recording_4.mp3` | `transcript-4` |
| 5F | `CIIT_Glitch_Virtual_Campus_Recording_5.mp3` | `transcript-5` |
| 5M | `CIIT_Glitch_Virtual_Campus_Recording_6.mp3` | `transcript-6` |
| 6F | `CIIT_Glitch_Virtual_Campus_Recording_7.mp3` | `transcript-7` |
| 7F | `CIIT_Glitch_Virtual_Campus_Recording_8.mp3` | `transcript-8` |
| 8F | `CIIT_Glitch_Virtual_Campus_Recording_9.mp3` | `transcript-9` |
| 9F | `CIIT_Glitch_Virtual_Campus_Recording_10.mp3` | `transcript-10` |

## Clarifications

- **Recording mapping:** The mapping follows sequential floor order so all 10 recordings are used. This corrects the earlier conflicts where Recording_1 was listed for LG-2, Recording_2 was listed for 4F, and Recording_9 was listed for 9F.
- **Asset layout:** The current MP3 files are flat inside `public/voice/`; no first-name subfolder is required for this implementation.
- **Transcripts:** Transcript files and text are a content dependency. The `lib` catalog pairs each recording with a transcript ID, and the Floating Menu shows a fallback until transcript text is supplied.
- **Persistence:** Floor changes replace the active recording with the destination floor's recording unless narration is paused. Refresh restores the current floor and paused/playing state, and an active recording restarts from the beginning. Browser-blocked autoplay falls back to a manual play prompt.
- **Adding a new recording:** Add an entry to `apps/frontend/src/lib/narrationCatalog.json` with a unique `id` (`voice-N`), `number` (N), `floor`, optional `sceneId`, `audioSrc` (`/voice/CIIT_Glitch_Virtual_Campus_Recording_N.mp3`), `transcriptId` (`transcript-N`), and `transcriptSrc` (`/transcripts/CIIT_Glitch_Virtual_Campus_Transcript_N.md`). Place the MP3 in `public/voice/` and the Markdown transcript in `public/transcripts/`. Run `npm run verify:content` to confirm both assets exist.
