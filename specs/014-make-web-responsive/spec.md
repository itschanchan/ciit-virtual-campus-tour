# Feature Specification: Make Web Responsive

**Feature Branch**: `014-make-web-responsive`

**Created**: 2026-11-08

**Status**: Draft

**Input**: User description: "Read and analyze @AGENTS.md, make @apps/frontend/src/components/Sidebar.jsx, @apps/frontend/src/components/Header.jsx, @apps/frontend/src/components/PanoramaViewer.jsx, @apps/frontend/src/tests/FloatingMenu.test.jsx, and @apps/frontend/src/components/ErrorBoundary.jsx web responsive."

## Clarifications

### Session 2026-11-08

- Q: What content should occupy the transparent space at the top of the mobile sidebar? → A: The current floor/location name at top left (e.g., "Glitch Tower Lobby").
- Q: How should the sidebar relate to the transparent header on mobile? → A: The sidebar should stack above the header (higher z-index), starting at the very top of the screen to occupy the transparent header space, in both portrait and landscape modes.
- Q: Should the sidebar background be fully opaque on mobile to hide the transparent header behind it? → A: Yes — the sidebar background must be fully opaque on mobile viewports so no part of the transparent header shows through when the sidebar is revealed.

### Session 2026-11-09

- Q: How must the sidebar be positioned at the top on mobile so the transparent header is fully covered? → A: With no top offset — flush against the very top of the screen (top: 0), so no strip of the header remains visible above it.
- Q: When a phone is rotated to landscape (viewport widths of roughly 700–1023px, which tablets also share), should the sidebar still cover the transparent header there, or keep the current panel-below-the-header layout? → A: At tablet and landscape mobile widths the sidebar keeps the desktop panel width (~20rem) and starts flush at the top, covering only the header logo area while the location name stays visible to its right; the full-width opaque cover remains for narrow phone widths.
- Q: When the sidebar is open at tablet widths, should tapping the dimmed backdrop area still close the sidebar? → A: Keep an invisible full-size tap target — remove only the dark tint; tapping outside still closes the sidebar.
- Q: Should the no-tint rule cover the full existing tablet range or stop at exactly 1000px? → A: Cover the full tablet range (701–1023px) using the existing `narrow` and `compact` breakpoint boundaries, with no new breakpoint.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Use the campus tour sidebar on a mobile phone (Priority: P1)

A visitor opening the virtual campus tour on a mobile phone can open and close the floor sidebar using a toggle, see every floor button without horizontal scrolling, and select a floor to view its panorama.

**Why this priority**: Constitution Principle V requires every user-facing feature to work on both desktop and mobile. The sidebar is the primary navigation for the tour, so mobile usability is foundational.

**Independent Test**: Open the tour on a narrow mobile viewport, toggle the sidebar open, confirm all floor buttons are visible and tappable, select a floor, and confirm the sidebar closes automatically on mobile.

**Acceptance Scenarios**:

1. **Given** the tour is open on a mobile viewport, **When** the visitor taps the sidebar toggle, **Then** the sidebar opens as an overlay without covering the entire screen permanently.
2. **Given** the sidebar is open on mobile, **When** the visitor taps a floor button, **Then** the sidebar closes and the panorama viewer switches to that floor.
3. **Given** the sidebar is open on mobile, **When** the visitor taps outside the sidebar, **Then** the sidebar closes.
4. **Given** the sidebar is open on a narrow mobile viewport, **Then** the current floor/location name (e.g., "Glitch Tower Lobby") is displayed at the top left of the sidebar, stacked above the transparent header, occupying the full top space in both portrait and landscape orientations.
5. **Given** the sidebar is open on a tablet or wide landscape mobile viewport, **Then** the sidebar keeps the desktop panel width, starts flush at the top of the screen, and covers only the header logo area while the location name stays visible to its right.
6. **Given** the sidebar is open on a tablet or wide landscape mobile viewport (701–1023px), **Then** the area outside the sidebar is not darkened by the backdrop, and **When** the visitor taps that area, **Then** the sidebar closes.

---

### User Story 2 - Read the header on mobile, tablet, and desktop (Priority: P1)

A visitor can see the CIIT logo, the current location name, and any header actions clearly on a mobile phone, a tablet, and a desktop monitor, with text that never overflows or gets cut off.

**Why this priority**: The header is always visible and identifies the current location. If it breaks on any screen size, the visitor loses context about where they are in the tour.

**Independent Test**: Resize the browser from mobile to tablet to desktop and confirm the logo, location text, and any header controls remain readable and aligned at every width.

**Acceptance Scenarios**:

1. **Given** the tour is on a mobile viewport, **When** the header displays the current location name, **Then** the text truncates gracefully instead of overflowing.
2. **Given** the tour is on a desktop viewport, **When** the header has room, **Then** the logo and location text display side by side without crowding.

---

### User Story 3 - View the 360-degree panorama on any device (Priority: P1)

A visitor can view and interact with the 360-degree panorama viewer on a mobile phone, tablet, and desktop, with the viewer filling the available space and no controls cut off by the screen edge.

**Why this priority**: The panorama is the core immersive experience. It must remain usable on every device the tour supports.

**Independent Test**: Open the panorama on each device class and confirm the viewer fills the screen, the scene list is accessible, and no view controls are positioned off-screen.

**Acceptance Scenarios**:

1. **Given** the panorama viewer is on a mobile viewport, **When** the scene list opens, **Then** it slides in from the side without pushing other content off-screen.
2. **Given** the panorama viewer is on a mobile viewport, **When** the view controls display, **Then** they remain within the visible screen area.
3. **Given** the panorama viewer is on a desktop viewport, **When** the scene list opens, **Then** it renders beside the viewer at a readable width.

---

### User Story 4 - Recover from an error on a mobile phone (Priority: P2)

A visitor who encounters an unexpected error in the tour can read the error message and tap the reload button on a mobile phone without zooming or horizontal scrolling.

**Why this priority**: Errors are disruptive; the recovery screen must be immediately usable on the smallest supported screen so the visitor is not stranded.

**Independent Test**: Trigger the error boundary on a mobile viewport and confirm the message, heading, and reload button are all fully visible and tappable.

**Acceptance Scenarios**:

1. **Given** an unexpected rendering error occurs on mobile, **When** the error boundary displays, **Then** the heading and message fit within the screen width.
2. **Given** the error screen is on mobile, **When** the visitor taps "Reload the tour", **Then** the button is large enough to tap accurately.

---

### User Story 5 - Verify responsive behavior in floating menu tests (Priority: P2)

The automated tests for the floating menu confirm that narration controls remain usable and visible on mobile, tablet, and desktop viewports.

**Why this priority**: Tests lock in responsive behavior so future changes do not regress mobile usability of narration controls.

**Independent Test**: Run the floating menu test suite and confirm responsive viewport scenarios pass.

**Acceptance Scenarios**:

1. **Given** the floating menu renders on a mobile viewport, **Then** the play/pause and mute buttons remain visible and tappable.
2. **Given** the floating menu renders on a desktop viewport, **Then** the controls retain their desktop layout.

---

## Edge Cases

- Visitor rotates the device from portrait to landscape while the sidebar is open; the sidebar keeps its open state and adapts from the full-screen overlay to the desktop-style panel as the width crosses the narrow phone width.
- At tablet widths the backdrop stays in place as an invisible tap target, so tapping outside still closes the sidebar even though the page is not dimmed.
- Visitor has a very small screen (below 320px) where fixed-width elements could overflow.
- The sidebar toggle is tapped rapidly multiple times.
- The error boundary displays on a screen where long location names could wrap awkwardly.
- The panorama viewer loads with no location data (missing panorama empty state) on mobile.
- Controls remain keyboard operable and focus-visible on every viewport.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The sidebar MUST be openable and closable via a toggle on mobile, tablet, and desktop viewports without horizontal scrolling.
- **FR-001a**: On narrow (phone-width) mobile viewports, the sidebar MUST stack above the transparent header (higher z-index), starting flush at the top of the screen (no top offset) to occupy the transparent header space, with a fully opaque background that hides the header behind it, in both portrait and landscape orientations.
- **FR-001b**: On tablet and landscape mobile viewports (above the narrow phone width), the sidebar MUST keep the desktop panel width, start flush at the top of the screen, cover only the header's logo area, and leave the header's location name visible to the right of the panel.
- **FR-001c**: On tablet and landscape mobile viewports (701–1023px), the sidebar backdrop MUST NOT dim or tint the page; the tap-outside-to-close target MUST remain present as a fully transparent, full-size clickable area.
- **FR-002**: The sidebar floor buttons MUST remain visible and tappable on the smallest supported mobile screen.
- **FR-003**: The header logo, current location name, and any header actions MUST remain readable and aligned on mobile, tablet, and desktop without text overflow.
- **FR-004**: The panorama viewer MUST fit within the screen bounds on mobile, tablet, and desktop, with no view controls or scene list positioned off-screen.
- **FR-005**: The error boundary heading, message, and reload button MUST fit within the screen width and be tappable on mobile.
- **FR-006**: The floating menu tests MUST cover responsive behavior on mobile, tablet, and desktop viewports.

### Key Entities

- **Sidebar**: The campus floor navigation drawer that lists floors and lets visitors select a location.
- **Header**: The top bar showing the CIIT logo and the current location name.
- **Panorama viewer**: The full-screen 360-degree view with scene list and view controls.
- **Error boundary**: The full-screen recovery screen shown when an unexpected rendering error occurs.
- **Floating menu**: The center-bottom narration control surface (covered by its test file).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All four components render without horizontal overflow on a 320px-wide mobile screen.
- **SC-002**: Every interactive button in the sidebar, header, panorama viewer, and error boundary meets a minimum tappable size on mobile.
- **SC-003**: Text in the header, error boundary, and sidebar remains readable without horizontal scrolling on mobile, tablet, and desktop.
- **SC-004**: The sidebar opens and closes via a toggle on mobile without obscuring the panorama viewer permanently.
- **SC-005**: The floating menu test suite passes on mobile, tablet, and desktop viewport simulations.
- **SC-006**: At tablet widths (701–1023px) the open sidebar adds no visible dimming to the page, and a tap outside the sidebar still closes it.

## Assumptions

- The project follows a mobile-first responsive approach using the existing Tailwind custom variants (`compact`, `narrow`, `tiny`) defined in `apps/frontend/src/index.css`.
- No new frontend dependencies are introduced; responsive behavior uses existing Tailwind utilities and custom variants only.
- The existing `isCompactViewport()` utility in `apps/frontend/src/lib/viewport.js` remains available for viewport-aware behavior.
- Tour content (locations, panoramas, scenes) remains in `apps/frontend/src/lib/catalog.json` and media under `apps/frontend/public/panoramas/`.
- Existing component behavior (floor pairing, locked-floor popovers, scene switching, narration) is preserved across all viewports.
