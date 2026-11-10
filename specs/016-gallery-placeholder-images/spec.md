# Feature Specification: Floor Gallery Placeholder Images

**Feature Branch**: `016-gallery-placeholder-images`

**Created**: 2026-11-10

**Status**: Draft

**Input**: User description: "I want every floor's 'view gallery button' to have 3 placeholder images so I can test out the left and right button for swapping gallery images. and I want to implement a left and right button if it hasn't been already."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse Three Placeholder Images on Every Floor (Priority: P1)

A tour visitor or developer opens the Gallery from any available floor and sees three clearly different placeholder images for that floor, making it obvious which image is currently displayed.

**Why this priority**: Without multiple images per floor, the previous/next browsing controls cannot be exercised. Providing three distinct placeholders on every available floor is the core purpose of this feature.

**Independent Test**: Open the Gallery from each available floor, confirm three placeholder images are present, confirm the active image is clearly identified, and confirm the image counter reflects a three-image sequence.

**Acceptance Scenarios**:

1. **Given** an available floor is selected, **When** the visitor activates the "View gallery" action, **Then** the Gallery contains exactly three placeholder images for that floor.
2. **Given** the Gallery is open for a floor with three placeholder images, **When** the Gallery first appears, **Then** the first placeholder image in the defined order is displayed and the counter shows position 1 of 3.
3. **Given** the Gallery is open, **When** the visitor compares the three placeholders, **Then** each placeholder is visually distinguishable from the others and its caption and alternative text identify the floor and the placeholder position.
4. **Given** the visitor moves to a different available floor, **When** the Gallery is opened again, **Then** that floor also presents its own three placeholder images.

---

### User Story 2 - Swap Images With Left and Right Controls (Priority: P1)

A visitor uses the left and right controls beside the active image to move backward and forward through the three placeholder images, including wrapping from the first image to the last and from the last image back to the first.

**Why this priority**: The user's stated goal is to test image swapping. The left and right controls are the primary mechanism for that swap and must exist and behave predictably.

**Independent Test**: With the Gallery open on a floor that has three placeholder images, activate the left control repeatedly and the right control repeatedly, confirming the displayed image and counter change correctly and wrap around at both ends.

**Acceptance Scenarios**:

1. **Given** the Gallery is open with three images, **When** the visitor activates the right control, **Then** the next image in order is displayed and the counter advances.
2. **Given** the Gallery is open with three images, **When** the visitor activates the left control, **Then** the previous image in order is displayed and the counter moves back.
3. **Given** the last image is displayed, **When** the visitor activates the right control, **Then** the first image is displayed.
4. **Given** the first image is displayed, **When** the visitor activates the left control, **Then** the last image is displayed.
5. **Given** the Gallery is open, **When** the visitor looks at the active image, **Then** the left and right controls are visible and positioned so they do not cover the image's identifying content.
6. **Given** an existing left or right control is already present, **When** this feature is implemented, **Then** the existing control is retained and verified rather than duplicated.
7. **Given** no left or right control exists, **When** a floor has more than one image, **Then** the missing control is added so both directions are available.

---

### User Story 3 - Swap Images With the Keyboard (Priority: P2)

A keyboard user opens the Gallery and presses the left and right arrow keys to move through the three placeholder images without leaving the Gallery.

**Why this priority**: Keyboard parity is required by the project's accessibility standards and gives testers a second, reliable way to confirm swapping works.

**Independent Test**: Open the Gallery with only the keyboard, press the left and right arrow keys, and confirm the displayed image and counter update while focus stays inside the Gallery.

**Acceptance Scenarios**:

1. **Given** the Gallery is open with three images, **When** the visitor presses the right arrow key, **Then** the next image is displayed.
2. **Given** the Gallery is open with three images, **When** the visitor presses the left arrow key, **Then** the previous image is displayed.
3. **Given** the visitor presses the arrow keys rapidly or repeatedly, **When** the Gallery updates, **Then** the displayed image and counter remain consistent with each other.

---

### Edge Cases

- An available floor has fewer than three placeholder images because an asset is missing or fails to load.
- A placeholder image fails to load while the other two remain available.
- A floor is locked or unavailable and therefore has no Gallery to open.
- The Gallery is opened while the location menu is open on a narrow viewport.
- The visitor rapidly alternates between the left and right controls.
- The visitor changes location while the Gallery is open.
- The visitor uses reduced motion, forced-colors mode, or 200 percent zoom.
- Real floor gallery content is introduced later and replaces the placeholders.
- The visitor reaches the first or last image and continues in the same direction.

## Requirements *(mandatory)*

### Functional Requirements

**Placeholder Content**

- **FR-001**: Every available floor that exposes a "View gallery" action MUST present exactly three placeholder images in its Gallery.
- **FR-002**: The three placeholder images on a given floor MUST be visually distinguishable from one another so image swapping is obvious.
- **FR-003**: Each placeholder image MUST have alternative text and a caption that identify it as a placeholder and reference its floor and position in the sequence.
- **FR-004**: Placeholder images for a floor MUST be presented in a stable, defined order that does not change between Gallery openings.
- **FR-005**: Placeholder images MUST be treated as temporary development content that can be replaced by real floor gallery images without changing the browsing behavior.
- **FR-006**: Placeholder images MUST use the project's existing gallery content and asset conventions rather than introducing a separate content mechanism.

**Image Swapping Controls**

- **FR-007**: When a floor's Gallery contains more than one image, both a left (previous) control and a right (next) control MUST be available beside the active image.
- **FR-008**: If a left or right control already exists, it MUST be retained and verified rather than reimplemented or duplicated.
- **FR-009**: Activating the right control MUST display the next image in the defined order.
- **FR-010**: Activating the left control MUST display the previous image in the defined order.
- **FR-011**: Navigating past the last image MUST wrap to the first image, and navigating before the first image MUST wrap to the last image.
- **FR-012**: The left and right controls MUST update the visible image, its caption, and the position indicator together so they never disagree.
- **FR-013**: The position indicator MUST show the current position and the total number of images for the floor.
- **FR-014**: The left and right controls MUST be hidden when a floor's Gallery contains only one image.
- **FR-015**: The left and right controls MUST remain reachable and must not obscure the image's identifying content at supported mobile, tablet, and desktop sizes.

**Accessibility and Keyboard Interaction**

- **FR-016**: The left and right controls MUST have clear accessible names that describe their direction.
- **FR-017**: All Gallery controls MUST have visible focus indicators.
- **FR-018**: The left and right arrow keys MUST navigate to the previous and next image while the Gallery is open.
- **FR-019**: Arrow-key navigation MUST only occur when the Gallery contains more than one image.
- **FR-020**: Keyboard focus MUST remain inside the open Gallery while arrow-key navigation is used.
- **FR-021**: Image swapping MUST not rely on color alone to communicate the active image position.

**Preserved Behavior and Scope**

- **FR-022**: Existing Gallery opening and closing behavior MUST be preserved, including the close control, backdrop activation, Escape, and focus return.
- **FR-023**: Existing ceiling, panorama, location navigation, and narration behavior MUST remain unchanged.
- **FR-024**: The feature MUST NOT introduce backend or API changes.
- **FR-025**: The feature MUST NOT introduce new runtime dependencies without the project's required approval.
- **FR-026**: Existing Gallery automated tests MUST continue to pass, and the three-placeholder and swapping behavior MUST be covered by automated tests.

### Key Entities *(include if feature involves data)*

- **Floor Gallery Placeholder**: A temporary still image associated with one available floor, identified by its source, floor, position in the three-image sequence, alternative text, and caption.
- **Gallery Viewing Session**: The open state of the Gallery for the currently selected floor, including which placeholder image is active and which control currently holds focus.
- **Floor**: A campus level that is available from the location menu and provides the "View gallery" action.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of available floors show exactly three placeholder images when their Gallery is opened.
- **SC-002**: The right control advances through all three images and wraps from the third image to the first in 100% of tested cases.
- **SC-003**: The left control moves backward through all three images and wraps from the first image to the third in 100% of tested cases.
- **SC-004**: The image position indicator matches the displayed image after every activation during testing, with zero observed mismatches.
- **SC-005**: All three placeholder images on a floor are distinguishable by a casual viewer without reading the caption.
- **SC-006**: The left and right arrow keys produce the same image changes as the corresponding on-screen controls in 100% of tested cases.
- **SC-007**: Gallery controls remain reachable and unobstructed at every supported viewport from 320 CSS pixels through desktop widths.
- **SC-008**: Existing Gallery, navigation, and narration automated tests pass with no regressions.
- **SC-009**: The feature introduces zero new runtime dependencies and zero backend changes.

## Assumptions

- "Every floor" means every floor that can currently open a Gallery from the location menu. Locked or unavailable floors do not need placeholders because they do not expose the "View gallery" action.
- There are nine such available floors in the current tour content, matching the existing per-floor gallery folders.
- Three placeholder images per floor are sufficient for testing; more images are out of scope.
- Placeholders are deliberately temporary and clearly labeled so they are not mistaken for real campus photography.
- The current Gallery already displays one image at a time with previous and next controls; where those controls exist they are retained, and where they are missing they are added.
- The existing Gallery remains the single Gallery experience; no second gallery or alternate viewer is introduced.
- Placeholder assets follow the existing static gallery asset organization and do not require a content-management workflow.
- The tour's supported viewports range from 320 CSS pixels through desktop sizes, including landscape phone orientation.
- The project's existing test setup and frontend linting are used for verification.
- No backend, API, or catalog schema changes are required by this feature.
