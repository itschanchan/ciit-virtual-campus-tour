# Feature Specification: make-viewgallery-responsive

**Feature Branch**: `[026-make-viewgallery-responsive]`

**Created**: 2026-11-15

**Status**: Draft

**Input**: User description: "In the ViewGallery modal in @apps/frontend/src/components/FloatingMenu.jsx, make the modal web responsive that fits for all viewports (desktop, tablet, and mobile). No scrolling required."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View gallery on mobile without scrolling (Priority: P1)

A campus visitor opens the ViewGallery modal on a mobile phone and can see the gallery image, caption, image counter, and close button all within the screen, with no need to scroll vertically or horizontally.

**Why this priority**: Mobile is the most constrained viewport; if the gallery fits on mobile without scrolling, it will fit on larger viewports by default. This is the core promise of the feature.

**Independent Test**: Open the gallery modal on a mobile-size viewport and confirm every gallery element is visible and reachable without scrolling the page or the modal.

**Acceptance Scenarios**:

1. **Given** a mobile viewport, **When** the user opens the ViewGallery modal, **Then** the modal, image, caption, image counter, and close button all fit within the viewport without scrolling.
2. **Given** a mobile viewport with multiple gallery images, **When** the user navigates between images, **Then** the newly shown image and its caption continue to fit within the viewport without scrolling.

### User Story 2 - View gallery on tablet without scrolling (Priority: P2)

A campus visitor opens the ViewGallery modal on a tablet and the gallery content fits within the screen with no scrolling required.

**Why this priority**: Tablets sit between mobile and desktop; verifying this viewport ensures the responsive layout transitions cleanly.

**Independent Test**: Open the gallery modal on a tablet-size viewport and confirm all gallery elements are visible without scrolling.

**Acceptance Scenarios**:

1. **Given** a tablet viewport, **When** the user opens the ViewGallery modal, **Then** the modal and all its content fit within the viewport without scrolling.

### User Story 3 - View gallery on desktop without scrolling (Priority: P3)

A campus visitor opens the ViewGallery modal on a desktop and the gallery content fits within the screen with no scrolling required.

**Why this priority**: Desktop is the largest viewport and least constrained, but the modal must still not overflow or require scrolling to reach any control.

**Independent Test**: Open the gallery modal on a desktop-size viewport and confirm all gallery elements are visible without scrolling.

**Acceptance Scenarios**:

1. **Given** a desktop viewport, **When** the user opens the ViewGallery modal, **Then** the modal and all its content fit within the viewport without scrolling.

### Edge Cases

- What happens when the gallery has only one image (no previous/next arrows)?
- What happens when the gallery image caption is long?
- What happens when the device is rotated between portrait and landscape while the modal is open?
- What happens when no gallery images are available (empty state message)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display the ViewGallery modal on mobile, tablet, and desktop viewports.
- **FR-002**: System MUST fit the entire ViewGallery modal (image, caption, image counter, navigation arrows, close button) within the viewport without vertical or horizontal scrolling on all supported viewports.
- **FR-003**: System MUST scale the gallery image so it never exceeds the available viewport height or width.
- **FR-004**: System MUST keep the close button and navigation arrows reachable without scrolling on all viewports.
- **FR-005**: System MUST not overflow the ViewGallery modal beyond the viewport edges on any supported device orientation.

### Key Entities *(include if feature involves data)*

- **Gallery image**: The image shown in the modal, with source, alt text, caption, and display order.
- **Gallery modal**: The overlay panel that presents the gallery image and its controls.
- **Viewport**: The visible screen area on mobile, tablet, or desktop devices.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can open the ViewGallery modal and view all gallery content without scrolling on mobile, tablet, and desktop viewports.
- **SC-002**: 100% of gallery content (image, caption, image counter, navigation arrows, close button) remains within viewport bounds on every supported viewport and orientation.
- **SC-003**: Users can open the gallery, navigate between images, and close it without initiating any scroll on any device.

## Assumptions

- Existing gallery images and their captions remain unchanged; only their presentation in the modal is adjusted.
- The narration controls panel is a separate component and is out of scope for this feature.
- Responsive breakpoint utilities are available for viewport-specific adjustments.
- "No scrolling" means the modal and its content fit within the viewport without user-initiated vertical or horizontal scrolling.
- Portrait and landscape device orientations are both supported.
