# Feature Specification: Migrate Room Gallery to Floating Menu

**Feature Branch**: `024-migrate-room-gallery`

**Created**: 2026-11-15

**Status**: Draft

**Input**: User description: "MIGRATE: Move the RoomGallery.jsx to FloatingMenu.jsx and its logic from Panorama.jsx"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse the room gallery from the floating menu (Priority: P1)

A tour visitor can open and browse a room's gallery of images from the floating menu, viewing each image with its caption and navigating between multiple images using previous and next controls.

**Why this priority**: The room gallery is a core part of the immersive tour experience (Constitution Principle V). Consolidating it into the floating menu gives visitors a single, consistent place to view both room images and narration controls.

**Independent Test**: Open the gallery from the floating menu and confirm room images display; navigate between images and confirm the active image and counter update.

**Acceptance Scenarios**:

1. **Given** a location with gallery images is selected, **When** the visitor opens the gallery from the floating menu, **Then** the room images for that location display with captions.
2. **Given** the gallery is open with multiple images, **When** the visitor activates the next control, **Then** the next image displays and the position indicator advances.
3. **Given** the gallery is open, **When** the visitor closes the gallery, **Then** the gallery overlay dismisses and focus returns appropriately.

---

### User Story 2 - Control narration playback from the floating menu (Priority: P1)

A visitor can start, pause, mute, and read the transcript of the campus tour narration from the floating menu.

**Why this priority**: Narration is a core part of the immersive tour experience, and the floating menu is the primary control surface for it. This behavior must be preserved during the consolidation.

**Independent Test**: Click play to start narration, click pause to stop it; toggle mute; open the transcript and confirm it displays.

**Acceptance Scenarios**:

1. **Given** narration is not playing, **When** the visitor activates play, **Then** narration begins and the control indicates a pause state.
2. **Given** narration is playing, **When** the visitor activates mute, **Then** narration continues without audio.

---

### User Story 3 - Operate all floating menu controls with a keyboard (Priority: P1)

A keyboard user can operate every floating menu control (gallery, narration play/pause, mute, transcript, map) and perceive visible focus states.

**Why this priority**: Constitution Principle V requires interactive controls to be keyboard operable with visible focus states and accessible names.

**Independent Test**: Tab to each floating menu control and confirm visible focus; activate each with Enter, Space, or the documented keyboard hint.

**Acceptance Scenarios**:

1. **Given** the floating menu is visible, **When** a visitor tabs to a control, **Then** the control shows a visible focus state and an accessible name.
2. **Given** the play control has focus, **When** the visitor presses "p", **Then** narration toggles between play and pause.

---

### Edge Cases

- A location has no gallery images, so the gallery should indicate none are available.
- A gallery image fails to load while other images remain available.
- The visitor changes location while the gallery is open.
- The visitor opens the gallery on a narrow mobile viewport where the sidebar is open.
- The visitor rapidly toggles the gallery open and closed.
- Narration audio is blocked by the browser.

## Requirements *(mandatory)*

### Functional Requirements

**Gallery Consolidation**

- **FR-001**: The room gallery component MUST be consolidated into FloatingMenu.jsx, and RoomGallery.jsx MUST no longer exist as a separate component.
- **FR-002**: The gallery open/close state, image selection, and floor image lookup logic MUST move from Panorama.jsx into FloatingMenu.jsx.
- **FR-003**: Panorama.jsx MUST no longer directly manage room gallery state or render RoomGallery.
- **FR-004**: The gallery MUST remain reachable from the tour through the existing gallery interaction (e.g., the "View gallery" action).
- **FR-005**: The gallery MUST display room images in a defined order with captions, previous/next navigation, a position indicator, and a close control.
- **FR-006**: The gallery MUST preserve its existing behaviors, including Escape to close, backdrop click to close, keyboard arrow navigation, and focus return on close.
- **FR-007**: The floating menu MUST retain its existing narration controls (play/pause, mute, transcript, map) alongside the gallery.
- **FR-008**: All floating menu and gallery controls MUST be keyboard operable with visible focus states and accessible names/labels (Constitution Principle V).
- **FR-009**: The gallery and floating menu MUST work on both desktop and mobile viewports (Constitution Principle V).
- **FR-010**: The gallery MUST hide when the sidebar is open on a compact mobile viewport so the sidebar remains the sole focus.
- **FR-011**: No new runtime dependencies MUST be introduced without the project's required approval.
- **FR-012**: Existing gallery and narration automated tests MUST continue to pass, and the consolidated behavior MUST be covered by automated tests.

### Key Entities *(include if feature involves data)*

- **Floating Menu**: The on-screen control surface that now hosts both narration playback controls and the room gallery.
- **Room Gallery**: The image browsing experience for a location's room, including active image, captions, previous/next controls, and position indicator.
- **Gallery Session**: The open state of the room gallery, including which image is active and which control holds focus.
- **Narration**: The campus tour guide voice-over audio associated with each location.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The room gallery opens and displays location images from the floating menu in 100% of tested cases.
- **SC-002**: Image navigation (previous/next, arrow keys, wrap-around) updates the active image and position indicator together with zero mismatches during testing.
- **SC-003**: All floating menu and gallery controls are reachable and operable via keyboard with visible focus states in 100% of tested cases.
- **SC-004**: The gallery closes via Escape, backdrop click, and the close control, returning focus appropriately in 100% of tested cases.
- **SC-005**: Narration playback controls continue to work correctly after consolidation in 100% of tested cases.
- **SC-006**: RoomGallery.jsx no longer exists and no code imports it, with zero references remaining.
- **SC-007**: The gallery and floating menu remain usable and unobstructed at every supported viewport from mobile through desktop widths.
- **SC-008**: Existing gallery and narration automated tests pass with no regressions, and the consolidated behavior is covered by automated tests.

## Assumptions

- FloatingMenu.jsx retains its existing narration controls while also hosting the room gallery (additive consolidation, not replacement).
- The gallery continues to be triggered through the existing "View gallery" interaction in the tour.
- The gallery preserves its current modal overlay behavior (backdrop, Escape close, focus management).
- Room gallery content continues to come from the existing floor gallery images and per-location gallery data.
- The migration introduces no backend or API changes and no new runtime dependencies.
- Mobile support is required (Constitution Principle V: every user-facing feature MUST work on both desktop and mobile).
- The project's existing test setup and frontend linting are used for verification.
