# Feature Specification: Tour Guide Narration

**Feature Branch**: `[029-tour-guide-narration]`

**Created**: 2026-11-24

**Status**: Draft

**Input**: User description: "Read and analyze @docs/prompts/frontend-prompts/tour_guide.md. Ask for clarifications in case of possible conflicts in the spec before planning."

## Clarifications

### Session 2026-11-24

- Q: Which recording-to-floor mapping is authoritative? → A: Sequential floor order: LG-1 = Recording_1, LG-2 = Recording_2, UG = Recording_3, 4F = Recording_4, 5F = Recording_5, 5M = Recording_6, 6F = Recording_7, 7F = Recording_8, 8F = Recording_9, 9F = Recording_10.
- Q: Should the feature keep the current flat `public/voice/` layout, and how should it handle missing transcripts? → A: Keep the flat layout; treat transcripts as a content dependency, with a catalog pairing and a clear fallback until transcript text is supplied.
- Q: When the visitor changes floors, should the old recording keep playing or be replaced? What should refresh restore? → A: Per-floor replacement with global pause; changing floors replaces the recording unless paused; refresh restores the current floor and paused/playing state; active playback restarts the floor recording from the beginning; blocked autoplay falls back to a manual play prompt.

### Session 2026-11-25

- Q: Should the transcript accordion reveal — where the floating menu animates from its pill shape to a rounded rectangle — apply on every viewport, or only on viewports where the menu keeps its pill shape (tablet and desktop), leaving compact mobile unchanged? → A: Tablet and desktop only; compact mobile keeps the existing menu shape and behavior without the accordion reveal.
- Q: Should the accordion animation include vertical height expansion (the menu panel growing to fit the transcript content) in addition to the pill-to-rounded-rectangle shape transition, or should it be shape-transition only? → A: Shape + height expansion — the menu grows vertically to fit the transcript content, combined with the pill-to-rounded-rectangle shape transition.
- Q: Should the floating menu's vertical accordion animation replicate the sidebar's exact CSS transition pattern (`duration-300 ease-in-out`), or should it keep the current `max-height` approach but with adjusted timing and conflict guards? → A: Replicate sidebar timing pattern — `max-h-[4rem]` → `max-h-[40rem]` with `transition-all duration-300 ease-in-out`, `overflow-hidden`, `prefers-reduced-motion` support, and a 320ms toggle guard to prevent rapid-toggle conflicts.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Floor narration starts automatically (Priority: P1)

A visitor enters the tour and hears the official tour guide recording for the floor they are viewing. The Lower Ground recording starts after the instructions screen, and the destination floor's recording starts when the visitor navigates to another narrated floor. Moving between panoramas on the same floor does not restart the recording.

**Why this priority**: The tour guide is the primary narrated experience. If the correct recording does not start at the correct floor, the feature fails its core promise.

**Independent Test**: Complete the instructions screen, confirm the Lower Ground recording starts after one second, then visit each narrated floor and confirm the assigned recording starts. Move between panoramas on one floor and confirm the recording does not restart.

**Acceptance Scenarios**:

1. **Given** a first-time visitor is on the instructions screen, **When** they continue to the Lower Ground panorama, **Then** Recording_1 starts automatically one second after the panorama renders.
2. **Given** the visitor is viewing the Lower Ground initial panorama, **When** they navigate to the LG-2 panorama, **Then** Recording_2 starts automatically.
3. **Given** the visitor is viewing a Lower Ground panorama, **When** they navigate to an Upper Ground panorama, **Then** Recording_3 starts automatically.
4. **Given** the visitor is on the Upper Ground floor, **When** they move between Upper Ground panoramas, **Then** Recording_3 continues without restarting.
5. **Given** the visitor is on the Fifth Floor, **When** they navigate to the Fifth Floor Mezzanine, **Then** Recording_6 starts automatically.
6. **Given** the visitor navigates to 4F, 6F, 7F, 8F, or 9F, **Then** Recording_4, Recording_7, Recording_8, Recording_9, or Recording_10 starts automatically, respectively.

---

### User Story 2 - Control and retain playback state (Priority: P1)

A visitor can pause and resume the tour guide at any time. If they pause and then change floors or refresh the page, narration remains paused on the current floor. If they leave it playing and move around the tour, narration continues until they change floors. When they change floors while playing, the destination floor's recording replaces the current recording. If they refresh while playing, the current floor is restored and that floor's recording restarts from the beginning.

**Why this priority**: The play/pause and persistence rules are explicit requirements and directly affect whether the tour guide feels controllable and reliable.

**Independent Test**: Play narration, pause it, change floors, refresh, and confirm it remains paused on the same floor. Resume, navigate within the same floor, and confirm playback continues. Change floors while playing and confirm the destination recording replaces the old one. Refresh while playing and confirm the same floor is restored and the recording restarts.

**Acceptance Scenarios**:

1. **Given** narration is playing, **When** the visitor presses pause, **Then** audio stops and the control shows a paused state.
2. **Given** narration is paused on one floor, **When** the visitor navigates to another floor, **Then** narration remains paused and the new floor's recording is selected.
3. **Given** narration is paused, **When** the visitor refreshes the page, **Then** the same floor is restored and narration remains paused.
4. **Given** narration is playing on a floor, **When** the visitor refreshes the page, **Then** the same floor is restored and that floor's recording restarts from the beginning.
5. **Given** narration is playing, **When** the visitor navigates between panoramas on the same floor, **Then** playback continues without restarting.
6. **Given** narration is playing, **When** the visitor changes floors, **Then** the destination floor's recording replaces the current recording.
7. **Given** the browser blocks autoplay, **When** a narrated floor opens, **Then** the system shows that playback was blocked and offers a play control.
8. **Given** a recording has ended, **When** the visitor presses play, **Then** the recording starts again from the beginning.

---

### User Story 3 - Transcript matches the active recording (Priority: P2)

A visitor opens the transcript in the Floating Menu and reads the text that corresponds to the recording currently selected for the floor. When the floor changes, the transcript changes with it.

**Why this priority**: The transcript is the accessible text alternative required by the project constitution and by the tour guide rules. It must never show the wrong floor's text.

**Independent Test**: Open the transcript on each narrated floor and compare the displayed transcript with the active recording's ID. Change floors and confirm the transcript updates. Temporarily remove a transcript and confirm the fallback appears.

**Acceptance Scenarios**:

1. **Given** a recording is selected, **When** the visitor opens the transcript, **Then** the transcript with the matching numeric suffix is displayed.
2. **Given** the visitor changes floors, **When** the new recording becomes active, **Then** the transcript updates to the matching transcript.
3. **Given** a transcript is unavailable, **When** the visitor opens the transcript, **Then** a clear fallback message is shown and the tour remains usable.

---

### User Story 4 - Content maintainer can pair recordings and transcripts (Priority: P2)

A content maintainer can open a single tour guide catalog and see which recording and transcript belong together by their shared ID, and which floor each pair belongs to.

**Why this priority**: The tour guide rules require a JS or JSON catalog in the lib folder so recordings and transcripts stay paired by ID as content grows.

**Independent Test**: Inspect the catalog and verify every recording has a matching transcript ID and a floor assignment, and every narrated floor has exactly one pair.

**Acceptance Scenarios**:

1. **Given** the tour guide catalog, **When** a maintainer reads an entry, **Then** the recording ID (`voice-N`) and transcript ID (`transcript-N`) share the same `N`.
2. **Given** a narrated floor, **When** the maintainer looks up the floor, **Then** exactly one recording/transcript pair is assigned.
3. **Given** a new recording/transcript pair, **When** it is added to the catalog and assigned to a floor, **Then** the tour uses it without changing the playback logic.

---

### Edge Cases

- The browser blocks unmuted autoplay when the page loads or refreshes.
- A recording file is missing, fails to load, or is not in a supported format.
- A transcript is missing or has no matching recording.
- The visitor changes floors rapidly before the previous recording starts.
- The visitor navigates between the paired 5F and 5M floors.
- The visitor navigates to the LG-2 panorama through a hotspot rather than the sidebar.
- A returning visitor skips the instructions screen and therefore provides no initial user gesture.
- The visitor refreshes while narration is playing or paused.
- Browser storage is unavailable or blocked.
- The visitor opens a locked floor (1F, 2F, 3F, 10F, or 11F) that has no recording.
- A recording ends while the visitor remains on the same floor.
- The visitor pauses narration, changes floors, and then resumes.
- The visitor leaves the tour for an admin page while narration is playing.
- The Floating Menu is hidden on a compact viewport while the sidebar is open.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a tour guide catalog in the frontend `lib` folder that pairs each official recording and transcript by a shared numeric ID (`voice-N` / `transcript-N`).
- **FR-002**: The catalog MUST assign recordings in sequential floor order: Lower Ground initial view = Recording_1, LG-2 = Recording_2, Upper Ground = Recording_3, 4F = Recording_4, 5F = Recording_5, 5M = Recording_6, 6F = Recording_7, 7F = Recording_8, 8F = Recording_9, and 9F = Recording_10.
- **FR-003**: The system MUST use the official MP3 files directly under `public/voice/` for narrated floors and MUST NOT use the placeholder narration for those floors.
- **FR-004**: The system MUST automatically start the Lower Ground recording one second after the Lower Ground panorama renders following the instructions screen.
- **FR-005**: The system MUST automatically start the destination floor's recording when the visitor navigates to a different narrated floor.
- **FR-006**: The system MUST continue the current recording without restarting when the visitor moves between panoramas on the same floor.
- **FR-007**: The system MUST provide play and pause controls for the active recording.
- **FR-008**: The system MUST preserve the paused or playing state when the visitor changes floors.
- **FR-009**: The system MUST continue playback while the visitor navigates within the tour without changing floors.
- **FR-010**: The system MUST replace the active recording with the destination floor's recording when the visitor changes floors while narration is playing.
- **FR-011**: On page refresh, the system MUST restore the floor that was active before the refresh and the paused or playing narration state. If narration was playing, the restored floor's recording MUST restart from the beginning.
- **FR-012**: The Floating Menu MUST display the transcript paired with the active recording.
- **FR-013**: The transcript MUST update when the active recording changes.
- **FR-014**: The system MUST show a clear fallback when a recording or transcript is unavailable and MUST keep the tour usable.
- **FR-015**: The system MUST respect browser autoplay restrictions. When autoplay is blocked, the recording MUST remain paused and the system MUST provide a clear manual play path.
- **FR-016**: The system MUST ensure only one tour guide recording plays at a time.
- **FR-017**: The system MUST apply the existing mute/unmute control to the active floor recording.
- **FR-018**: The system MUST NOT start narration on floors without an assigned recording.
- **FR-019**: The system MUST expose an accessible name and expanded state on the transcript control.
- **FR-020**: The system MUST keep the transcript control keyboard operable with a visible focus state.
- **FR-021**: The system MUST keep the existing Floating Menu play/pause, mute, map, and gallery controls usable while narration and transcripts are active.
- **FR-022**: The system MUST select the transcript whose numeric suffix matches the active recording's numeric suffix.
- **FR-023**: The system MUST keep the one-second delay only for the initial Lower Ground recording; later floor changes start without an added delay.
- **FR-024**: The system MUST treat transcript text as a content dependency: the catalog MUST pair each `voice-N` with `transcript-N`, and the Floating Menu MUST show a fallback until the transcript text is supplied.
- **FR-025**: When the transcript is revealed on tablet and desktop viewports, the Floating Menu MUST animate smoothly from its pill shape to a rounded rectangle while expanding vertically to fit the transcript content; when the transcript is collapsed, it MUST return to its original pill shape and height. The animation MUST use `duration-300 ease-in-out` matching the sidebar's transition pattern. Compact mobile viewports keep the existing menu shape and behavior without the accordion reveal.

### Key Entities *(include if feature involves data)*

- **Tour guide recording**: An official MP3 voice-over file associated with a narrated floor.
- **Transcript**: The text alternative paired with a recording by the same numeric suffix.
- **Floor narration assignment**: The rule that connects a narrated floor or view to exactly one recording/transcript pair.
- **Tour guide catalog**: The data file in the frontend `lib` folder that lists recordings, transcripts, and floor assignments by ID.
- **Playback state**: The active floor, whether narration is playing or paused, the mute state, and the restart-from-beginning behavior used on refresh.
- **Narrated floor**: A floor or view with an assigned recording: Lower Ground initial view, LG-2, Upper Ground, 4F, 5F, 5M, 6F, 7F, 8F, and 9F.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of narrated floors start the assigned recording within 2 seconds of the floor becoming active.
- **SC-002**: 0 unintended restarts occur when the visitor moves between panoramas on the same floor.
- **SC-003**: 100% of play and pause actions change the active recording's state correctly.
- **SC-004**: 100% of floor changes preserve the visitor's paused state when narration was paused.
- **SC-005**: 100% of transcript views show the transcript with the same numeric ID as the active recording.
- **SC-006**: 100% of page refreshes restore the same floor and narration state; active playback restarts the floor recording from the beginning.
- **SC-007**: 0 tour-blocking failures occur when a recording or transcript is missing; a clear fallback is shown instead.
- **SC-008**: All narration and transcript controls are keyboard operable with accessible names on mobile, tablet, and desktop viewports.
- **SC-009**: 100% of the 10 official MP3 files are accounted for by the catalog and assigned to exactly one floor or view.
- **SC-010**: The panorama viewer remains interactive and the tour remains responsive while narration plays.
- **SC-011**: 100% of floor changes while narration is playing replace the active recording with the destination floor's recording.
- **SC-012**: Blocked autoplay always leaves the tour usable and offers a manual play control.

## Assumptions

- The 10 MP3 files currently in `apps/frontend/public/voice/` are the official final recordings.
- The voice-over assets remain flat inside `public/voice/`; no first-name subfolder will be introduced for this feature.
- Transcript text is supplied by the content owner. Until it is supplied, the transcript UI shows a clear fallback instead of inventing content.
- LG-2 is a panorama within the Lower Ground floor, not a separate floor.
- The one-second delay applies only to the initial Lower Ground recording after the instructions screen.
- Locked floors 1F, 2F, 3F, 10F, and 11F have no narration.
- The tour guide catalog is data-driven and lives in the frontend `lib` folder as required by the source document.
- The current floor and narration state are remembered in the browser across refresh; if storage is blocked, persistence degrades to the current session.
- Unmuted autoplay may be blocked by the browser; the manual play control is the required fallback.
- Recording content and transcript wording are supplied by the content owner and are not generated by this feature.
- The feature applies to the public tour experience, not the admin area.
- Existing unrelated Sidebar test failures are outside this feature's scope. The Floating Menu transcript accessibility failure is in scope because this feature depends on that control.
