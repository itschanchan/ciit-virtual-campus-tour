# Feature Specification: Improve Gallery Button and Popup

**Feature Branch**: `004-gallery-ux-improvements`

**Created**: 2026-11-06

**Status**: Draft

**Input**: User description: "Improve the existing Gallery button and Gallery popup/modal in the CIIT Virtual Campus Tour frontend. This is an improvement to an existing feature, not a request to create an entirely new Gallery system. Improve the existing Gallery button's appearance and usability, the popup/modal layout and visual consistency, image presentation and responsive behavior, opening and closing interactions, and accessibility and keyboard interactions. Refactor the existing implementation only when necessary to improve maintainability. Preserve existing functionality, follow the current React architecture and coding conventions, reuse existing components and dependencies where appropriate, do not introduce unnecessary libraries, avoid unrelated frontend and backend changes, and do not duplicate existing Gallery functionality."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Open, Browse, and Close the Gallery Reliably (Priority: P1)

A campus tour visitor selects the Gallery action for the current location, reviews the still images presented for that location, and closes the Gallery when finished.

**Why this priority**: The Gallery already exists, so the fundamental value is preserving a reliable open-browse-close journey. If the Gallery cannot open or close predictably, every other improvement is irrelevant.

**Independent Test**: Open the tour, select Gallery, verify the current location's images appear, then close the Gallery using each supported closing method and confirm the tour remains usable.

**Acceptance Scenarios**:

1. **Given** the tour is ready and a location is selected, **When** the visitor activates the Gallery trigger, **Then** the Gallery opens with the current location's images in the defined display order.
2. **Given** the Gallery is open, **When** the visitor activates the close control, **Then** the Gallery closes and the tour remains on the same location.
3. **Given** the Gallery is open and a backdrop area is visible, **When** the visitor clicks the backdrop, **Then** the Gallery closes.
4. **Given** the Gallery is open, **When** the visitor presses Escape, **Then** the Gallery closes.
5. **Given** the Gallery is open, **When** the visitor changes to another location by any existing navigation method, **Then** the Gallery closes and the new location is shown.
6. **Given** the Gallery was closed, **When** the visitor continues using the tour, **Then** the panorama, sidebar, and narration remain functional.

---

### User Story 2 - Use the Gallery with a Keyboard or Assistive Technology (Priority: P1)

A visitor who relies on a keyboard or screen reader opens the Gallery, moves through its content safely, and closes it without losing their place in the tour.

**Why this priority**: The Gallery is a modal surface that blocks the rest of the tour. Keyboard and screen-reader users must not be able to interact with obscured content, and focus must return predictably after closing.

**Independent Test**: Using only the keyboard and a screen reader, open the Gallery, navigate its interactive elements, attempt to move focus outside it, close it, and confirm focus returns to the Gallery trigger.

**Acceptance Scenarios**:

1. **Given** the Gallery trigger has focus, **When** the visitor activates it, **Then** focus moves into the open Gallery.
2. **Given** the Gallery is open, **When** the visitor presses Tab or Shift+Tab repeatedly, **Then** focus remains within the Gallery.
3. **Given** the Gallery is open, **When** a screen reader reads the surface, **Then** the Gallery is announced as a dialog with an accessible name and the background tour is not exposed as interactive content.
4. **Given** the Gallery is open, **When** the visitor closes it, **Then** focus returns to the Gallery trigger.
5. **Given** both the location menu and the Gallery are open, **When** the visitor presses Escape, **Then** only the most recently opened overlay closes.
6. **Given** the visitor uses reduced motion, **When** the Gallery opens or closes, **Then** non-essential motion is suppressed.

---

### User Story 3 - Use the Gallery Comfortably on Mobile (Priority: P2)

A visitor on a phone opens the Gallery, scrolls through the images, and can always close the Gallery without hunting for a control.

**Why this priority**: The tour is explicitly required to work on desktop and mobile. Mobile users have the least screen space and depend most on reachable controls and predictable scrolling.

**Independent Test**: At supported phone widths and in landscape orientation, open a Gallery with enough images to scroll, verify images are readable, scroll to the end, and close the Gallery without scrolling back to the beginning.

**Acceptance Scenarios**:

1. **Given** a narrow viewport, **When** the Gallery opens, **Then** it uses the available screen space without horizontal scrolling or clipped controls.
2. **Given** a long image list on a narrow viewport, **When** the visitor scrolls through the images, **Then** the close control remains reachable.
3. **Given** the visitor uses touch input, **When** they activate the Gallery trigger or close control, **Then** each target is large enough to activate reliably.
4. **Given** the visitor rotates the device or uses a notched display, **When** the Gallery is open, **Then** the close control and content remain within the safe visible area.

---

### Edge Cases

- The Gallery contains no images for the current location.
- The Gallery contains many images and requires internal scrolling.
- A Gallery image fails to load or is unavailable.
- An image caption is missing, empty, or unusually long.
- The visitor changes location while the Gallery is open.
- The visitor opens the Gallery while the location menu is already open.
- The visitor presses Escape while multiple overlays are open.
- The visitor rapidly opens and closes the Gallery or triggers the same control repeatedly.
- The visitor uses a narrow phone in landscape orientation.
- The visitor uses a notched or rounded display.
- The visitor uses 200 percent zoom, forced-colors mode, or prefers reduced motion.
- The visitor navigates entirely by keyboard or with a screen reader.
- The current device cannot display the full number of gallery columns.
- The tour content fails to load, so no location or gallery data is available.

## Requirements *(mandatory)*

### Functional Requirements

**Gallery Trigger**

- **FR-001**: The existing Gallery trigger MUST remain available whenever a location with gallery content is displayed.
- **FR-002**: The Gallery trigger MUST clearly communicate that it opens the Gallery.
- **FR-003**: The Gallery trigger MUST expose its expanded or collapsed state to assistive technology.
- **FR-004**: The Gallery trigger MUST meet a minimum touch target of 44 by 44 CSS pixels at supported mobile widths.
- **FR-005**: The Gallery trigger MUST remain visible and operable at every supported viewport without overlapping other essential controls.

**Opening and Closing**

- **FR-006**: Activating the Gallery trigger MUST open the Gallery for the currently selected location.
- **FR-007**: The Gallery MUST close when the visitor activates the close control.
- **FR-008**: The Gallery MUST close when the visitor activates a visible backdrop area.
- **FR-009**: The Gallery MUST close when the visitor presses Escape.
- **FR-010**: The Gallery MUST close automatically when the selected location changes.
- **FR-011**: When more than one overlay is open, Escape MUST close only the most recently opened overlay.
- **FR-012**: Closing the Gallery MUST return keyboard focus to the element that opened it.
- **FR-013**: The Gallery MUST NOT leave the tour in a state where the visible page and the modal disagree about which location is selected.

**Accessibility and Keyboard Interaction**

- **FR-014**: The open Gallery MUST be exposed as a modal dialog with an accessible name.
- **FR-015**: Keyboard focus MUST remain within the open Gallery until the Gallery is closed.
- **FR-016**: Content outside the open Gallery MUST NOT be keyboard interactive or exposed as active content to assistive technology.
- **FR-017**: The close control MUST have a clear accessible name.
- **FR-018**: All Gallery controls MUST have visible focus indicators.
- **FR-019**: Gallery images MUST retain meaningful alternative text, and captions MUST remain associated with their images.
- **FR-020**: The Gallery MUST suppress non-essential animation when the visitor prefers reduced motion.
- **FR-021**: The Gallery MUST remain usable at 200 percent zoom and in forced-colors mode.

**Gallery Content and Presentation**

- **FR-022**: Gallery images MUST be presented in the order defined by the location's gallery content.
- **FR-023**: Gallery images MUST be displayed without distortion using a consistent visual treatment across items.
- **FR-024**: Gallery captions MUST wrap without clipping or overlapping adjacent content.
- **FR-025**: The Gallery MUST show a clear empty state when the current location has no images.
- **FR-026**: The Gallery MUST provide meaningful fallback treatment when an image fails to load.
- **FR-027**: The initial Gallery view MUST remain responsive while images outside the current view are still loading.

**Responsiveness and Layout**

- **FR-028**: The Gallery MUST adapt its image layout from single-column through multi-column presentation as space allows.
- **FR-029**: The Gallery MUST avoid horizontal page scrolling at supported viewport widths from 320 CSS pixels through desktop widths.
- **FR-030**: On narrow viewports, the Gallery MUST use the available screen area without clipping the close control or content.
- **FR-031**: The close control MUST remain reachable while the image area scrolls, including when the image list is longer than the viewport.
- **FR-032**: The Gallery MUST handle safe-area insets on devices with notches or rounded display edges.

**Compatibility, Scope, and Maintainability**

- **FR-033**: Existing panorama viewing, location navigation, and narration behavior MUST remain unchanged.
- **FR-034**: The Gallery MUST continue to use the existing location gallery content and static image assets.
- **FR-035**: No backend or API changes are permitted as part of this feature.
- **FR-036**: No new runtime dependency may be introduced unless separately approved under the project's dependency rules.
- **FR-037**: Existing Gallery behavior MUST be preserved; the feature MUST improve the existing Gallery rather than introduce a second Gallery experience.
- **FR-038**: Gallery behavior MUST remain consistent; separate copies of the Gallery experience MUST NOT be introduced.
- **FR-039**: Existing Gallery automated tests MUST continue to pass, and new or changed Gallery behavior MUST be covered by automated tests.
- **FR-040**: The feature MUST respect the project's existing visual language, responsive behavior, and accessibility conventions.

### Key Entities *(include if feature involves data)*

- **Gallery Image**: A still image associated with a location, identified by its source, alternative text, optional caption, and display order.
- **Gallery Viewing Session**: The open or closed state of the Gallery for the currently selected location, including which element had focus before opening and which control currently holds focus.
- **Gallery Trigger**: The visible control that opens the Gallery and communicates whether the Gallery is currently open.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of supported closing methods (close control, visible backdrop, Escape) close the Gallery in testing.
- **SC-002**: Keyboard focus remains inside the open Gallery during repeated Tab and Shift+Tab navigation, with zero escapes to background content.
- **SC-003**: After closing the Gallery, focus returns to the Gallery trigger in 100% of tested cases.
- **SC-004**: When the location menu and Gallery are both open, one Escape press closes exactly one overlay.
- **SC-005**: For a location with at least 20 images, the close control remains reachable without scrolling back to the top on both a 320-pixel-wide viewport and a desktop viewport.
- **SC-006**: The Gallery shows no horizontal scrolling and no clipped essential controls at every supported viewport from 320 CSS pixels through 1440 pixels.
- **SC-007**: 100% of displayed Gallery images have non-empty alternative text and appear in the defined display order.
- **SC-008**: A location with no images displays a clear empty state rather than a blank or broken Gallery.
- **SC-009**: An image that fails to load still leaves the Gallery navigable and displays meaningful fallback content.
- **SC-010**: Existing panorama, location navigation, and narration smoke tests pass with no regressions.
- **SC-011**: The feature introduces zero new runtime dependencies and zero backend changes.
- **SC-012**: The existing Gallery automated test suite passes, and the new Gallery interaction requirements are covered by automated tests.

## Assumptions

- This feature improves the Gallery that already exists; it does not replace the Gallery data model or introduce a second Gallery experience.
- The existing per-location gallery content in the tour catalog remains the source of truth. No new content management, upload, or API workflow is in scope.
- Static gallery images remain in the existing public assets location. No asset migration or CDN work is in scope.
- The current thumbnail-grid browsing model is retained. A new full-screen image viewer, zoom, slideshow, or previous/next browsing mode is out of scope unless requested separately.
- The existing frontend architecture and styling approach are retained. No new UI library is required for this feature.
- No new runtime libraries are needed. Any dependency change would require separate approval under the project constitution.
- The tour's supported viewports are those documented for the project, ranging from 320 CSS pixels through desktop sizes, including landscape phone orientation.
- The existing location menu, narration player, and panorama viewer remain functionally unchanged.
- Automated verification uses the project's existing test setup.
- The Gallery remains visually consistent with the existing dark tour theme and design tokens.
- The close control, backdrop, and Escape behavior already exist and should be preserved and made more reliable rather than reinvented.
