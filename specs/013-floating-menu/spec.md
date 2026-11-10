# Feature Specification: Floating Menu Button

**Feature Branch**: `013-floating-menu`

**Created**: 2026-11-08

**Status**: Draft

**Input**: User description: "A Floating menu at the center bottom of the website. The file should be called FloatingMenu.jsx."

## Clarifications

### Session 2026-11-08

- Q: Should the Floating Menu be keyboard operable with visible focus states and an accessible name/label, including keyboard hints such as play/pause: p? → A: Yes — keyboard operable with visible focus states, an accessible name/label, and keyboard hints (e.g., play/pause: p). Constitution-required per Principle V.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Control narration playback from the floating menu (Priority: P1)

A visitor can start and pause the campus tour narration using the play/pause button on the floating menu, and see an audio visualization while narration plays.

**Why this priority**: Narration is a core part of the immersive tour experience (Constitution Principle V), and the floating menu is the primary control surface for it. Play/pause is the most fundamental interaction.

**Independent Test**: Click the play button and confirm narration starts; click again and confirm narration pauses.

**Acceptance Scenarios**:

1. **Given** narration is not playing, **When** the visitor clicks the play button, **Then** narration begins and the play button visually indicates a pause state.
2. **Given** narration is playing, **When** the visitor clicks the pause button, **Then** narration stops and the button returns to a play state.

---

### User Story 2 - Mute and unmute narration (Priority: P2)

A visitor can mute the narration audio while keeping narration playing, then unmute it to restore sound.

**Why this priority**: Visitors may need silent navigation; mute/unmute is a standard, expected control for any audio experience.

**Independent Test**: While narration is playing, toggle mute and confirm audio stops; toggle again and confirm audio resumes.

**Acceptance Scenarios**:

1. **Given** narration is playing with sound, **When** the visitor clicks mute, **Then** narration continues but no audio is heard.
2. **Given** narration is muted, **When** the visitor clicks unmute, **Then** narration audio resumes.

---

### User Story 3 - Accessible keyboard control of narration (Priority: P1)

A visitor using a keyboard can operate all floating menu controls and perceive focus states, per Constitution Principle V.

**Why this priority**: Constitution Principle V requires narration controls to be keyboard operable with visible focus states and text alternatives. Without this, the feature is inaccessible.

**Independent Test**: Tab to each floating menu control and confirm visible focus; activate each with Enter/Space or the documented keyboard hint.

**Acceptance Scenarios**:

1. **Given** the floating menu is visible, **When** a visitor tabs to the play/pause control, **Then** the control shows a visible focus state and an accessible name.
2. **Given** the play control has focus, **When** the visitor presses "p", **Then** narration toggles between play and pause.

---

## Edge Cases

- Narration audio file is missing or fails to load.
- Visitor has prefers-reduced-motion enabled, so the oscillation audio visualization is disabled or replaced with a static indicator.
- Narration toggles rapidly (play/pause/mute) multiple times in succession.
- The floating menu overlaps other UI on narrow mobile viewports; it must remain usable and not block the panorama viewer.
- All controls are keyboard operable with visible focus states and an accessible name/label; keyboard hints are shown (e.g., play/pause: p).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The floating menu file MUST be named `FloatingMenu.jsx`.
- **FR-002**: The floating menu MUST include a play/pause button that starts and pauses the campus tour narration.
- **FR-003**: An oscillation audio visualization MUST play while narration is playing and be displayed to the left of the Play button.
- **FR-004**: The floating menu MUST include mute and unmute controls that silence or restore narration audio.
- **FR-005**: All floating menu controls MUST be keyboard operable with visible focus states and an accessible name/label (Constitution Principle V).
- **FR-006**: Keyboard shortcuts MUST work for each control (press "p" for play/pause, "m" for mute/unmute). Visible hint text is not shown; accessible names/labels convey control purpose instead.

### Key Entities

- **Floating menu button**: The center-bottom on-screen control surface housing narration playback controls.
- **Narration**: The campus tour guide voice-over audio associated with each location (normalized term; formerly referred to as "voice over").
- **Audio visualization**: The oscillation animation indicating narration is actively playing.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of narration play/pause actions from the floating menu toggle narration state correctly.
- **SC-002**: The audio visualization is visible whenever narration is playing and hidden when narration is paused or stopped.
- **SC-003**: All floating menu controls are reachable and operable via keyboard with visible focus states.

## Assumptions

- Narration audio is provided as a static file under `apps/frontend/public/panoramas/<location-slug>/narration.wav` (e.g., `/panoramas/placeholder/narration.wav`), referenced per-location via `catalog.json`'s `narration.audioSrc`.
- The oscillation audio visualization uses a plain CSS animation; no new frontend dependency is required per research.md decision.
- The floating menu mounts within the frontend layout alongside the PanoramaViewer and sidebar (referenced as the "floating narration bar" in spec 009).
- Mobile support is required (Constitution Principle V: every user-facing feature MUST work on both desktop and mobile).
