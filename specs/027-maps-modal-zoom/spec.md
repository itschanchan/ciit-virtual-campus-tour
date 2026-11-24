# Feature Specification: maps-modal-zoom

**Feature Branch**: `[027-maps-modal-zoom]`

**Created**: 2026-11-15

**Status**: Draft

**Input**: User description: "in @apps/frontend/src/components/FloatingMenu.jsx , the maps button should have a modal that displays the @apps/frontend/public/img/glitch_directory.png. Make sure that this modal should be web responsive to all of the viewports (desktop, tablet, mobile) with scroll to zoom for desktop and pinch to zoom in touch screens."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Open floor directory modal on mobile and view without scrolling (Priority: P1)

A campus visitor taps the maps button in the floating menu and a modal opens showing the floor directory image. On a mobile phone, the entire modal and image fit within the screen without scrolling, and the user can close the modal when done.

**Why this priority**: Mobile is the most constrained viewport; if the modal fits on mobile with touch-zoom support, the core promise of responsive floor-directory access is delivered.

**Independent Test**: Open the floor directory modal on a mobile-size viewport and confirm the modal opens, the directory image is visible and zoomable via pinch, and all modal controls fit within the screen without scrolling.

**Acceptance Scenarios**:

1. **Given** a mobile viewport, **When** the user taps the maps button, **Then** a modal opens displaying the floor directory image and fits within the screen without scrolling.
2. **Given** an open floor directory modal on a mobile viewport, **When** the user pinches to zoom, **Then** the image zooms in and out responsively.
3. **Given** an open floor directory modal, **When** the user taps the close button, **Then** the modal closes and returns to the floating menu.

### User Story 2 - Open floor directory modal on tablet and view without scrolling (Priority: P2)

A campus visitor taps the maps button in the floating menu on a tablet and a modal opens showing the floor directory image. The modal and image fit within the tablet screen without scrolling.

**Why this priority**: Tablets sit between mobile and desktop; verifying this viewport ensures the responsive layout transitions cleanly between breakpoints.

**Independent Test**: Open the floor directory modal on a tablet-size viewport and confirm the modal opens, the directory image is visible and zoomable, and all modal controls fit within the screen without scrolling.

**Acceptance Scenarios**:

1. **Given** a tablet viewport, **When** the user taps the maps button, **Then** a modal opens displaying the floor directory image and fits within the screen without scrolling.
2. **Given** an open floor directory modal on a tablet viewport, **When** the user pinches to zoom, **Then** the image zooms in and out responsively.

### User Story 3 - Open floor directory modal on desktop and view with scroll-to-zoom (Priority: P3)

A campus visitor clicks the maps button in the floating menu on a desktop and a modal opens showing the floor directory image. The modal fits within the desktop screen without scrolling, and the user can zoom using the scroll wheel.

**Why this priority**: Desktop is the largest viewport and least constrained, but the modal must still fit without overflow and support scroll-to-zoom for detailed directory reading.

**Independent Test**: Open the floor directory modal on a desktop-size viewport and confirm the modal opens, the directory image is visible and zoomable via scroll wheel, and all modal controls fit within the screen without scrolling.

**Acceptance Scenarios**:

1. **Given** a desktop viewport, **When** the user clicks the maps button, **Then** a modal opens displaying the floor directory image and fits within the screen without scrolling.
2. **Given** an open floor directory modal on a desktop viewport, **When** the user scrolls over the image, **Then** the image zooms in and out responsively.

### Edge Cases

- What happens when the floor directory image fails to load?
- What happens when the device is rotated between portrait and landscape while the modal is open?
- What happens when the user zooms to the maximum or minimum level?
- What happens when the user interacts with other floating menu controls while the modal is open?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a modal with the floor directory image when the maps button is activated.
- **FR-002**: System MUST fit the entire floor directory modal within the viewport without vertical or horizontal scrolling on mobile, tablet, and desktop viewports.
- **FR-003**: System MUST support pinch-to-zoom on touch screen devices for zooming the floor directory image.
- **FR-004**: System MUST support scroll-to-zoom on desktop devices for zooming the floor directory image.
- **FR-005**: System MUST keep the close button reachable without scrolling on all supported viewports.
- **FR-006**: System MUST close the modal when the close button is activated or when the user interacts with the backdrop.

### Key Entities *(include if feature involves data)*

- **Floor directory image**: The image displayed in the modal showing campus floor locations and room listings.
- **Floor directory modal**: The overlay panel that presents the floor directory image with zoom controls and a close button.
- **Viewport**: The visible screen area on mobile, tablet, or desktop devices.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can open the floor directory modal and view the directory image without scrolling on mobile, tablet, and desktop viewports.
- **SC-002**: 100% of the modal content (image, zoom controls, close button) remains within viewport bounds on every supported viewport and orientation.
- **SC-003**: Users can zoom the floor directory image using pinch gestures on touch screens and scroll wheel on desktop.
- **SC-004**: Users can open the modal, zoom the image, and close it without initiating any page scroll on any device.

## Assumptions

- The floor directory image at `apps/frontend/public/img/glitch_directory.png` remains the source image for the modal.
- The narration controls panel is a separate component and is out of scope for this feature.
- Responsive breakpoint utilities are available for viewport-specific adjustments.
- Touch devices support multi-touch pinch gestures; desktop devices support scroll-wheel input.
- "No scrolling" means the modal and its content fit within the viewport without user-initiated vertical or horizontal scrolling.
- Portrait and landscape device orientations are both supported.

## Clarifications

### Session 2026-11-15

- Q: Should the floor directory image be absolutely positioned stacked above the modal? → A: No, keep it in normal document flow inside the modal panel.
- Q: Should the zoomed image be draggable/touchable to pan around? → A: Yes, support drag-to-pan when the image is zoomed in.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a modal with the floor directory image when the maps button is activated.
- **FR-002**: System MUST fit the entire floor directory modal within the viewport without vertical or horizontal scrolling on mobile, tablet, and desktop viewports.
- **FR-003**: System MUST support pinch-to-zoom on touch screen devices for zooming the floor directory image.
- **FR-004**: System MUST support scroll-to-zoom on desktop devices for zooming the floor directory image.
- **FR-005**: System MUST keep the close button reachable without scrolling on all supported viewports.
- **FR-006**: System MUST close the modal when the close button is activated or when the user interacts with the backdrop.
- **FR-007**: System MUST keep the floor directory image in normal document flow inside the modal (not absolutely positioned stacked above the modal).
- **FR-008**: System MUST allow the user to drag/touch and pan the floor directory image when it is zoomed in, on both desktop (mouse drag) and touch screens (single-finger drag).
