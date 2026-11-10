# Feature Specification: Hide Gallery and Floating Nav When Sidebar Opens on Mobile

**Feature Branch**: `015-hide-gallery-nav-mobile`

**Created**: 2026-11-09

**Status**: Draft

**Input**: In the mobile viewport of @apps/frontend/src/components/Sidebar.jsx, when the sidebar is revealed, the gallery and floating nav button should be hidden since the user can see these components in the tinted background of the sidebar.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Hide gallery and floating nav when the sidebar opens on mobile (Priority: P1)

A visitor using the virtual campus tour on a mobile phone opens the campus floor sidebar. Because the sidebar has a tinted semi-transparent background, the room gallery, the gallery button, and the floating navigation bar remain visible through it, creating visual clutter and making it unclear which surface is active. When the sidebar is revealed, the gallery, the gallery button, and the floating nav should disappear so the sidebar content is the sole focus. When the sidebar closes, all three should reappear.

**Why this priority**: The sidebar is the primary navigation for the tour. Visual clutter through its tinted background on mobile degrades the navigation experience and can confuse visitors about what they are interacting with.

**Independent Test**: Open the tour on a mobile viewport with the room gallery, gallery button, and floating nav visible, open the sidebar, and confirm all three are no longer visible. Close the sidebar and confirm all three reappear.

**Acceptance Scenarios**:

1. **Given** the tour is open on a mobile viewport with the room gallery visible, **When** the visitor opens the sidebar, **Then** the room gallery is hidden.
2. **Given** the tour is open on a mobile viewport with the gallery button visible, **When** the visitor opens the sidebar, **Then** the gallery button is hidden.
3. **Given** the tour is open on a mobile viewport with the floating navigation bar visible, **When** the visitor opens the sidebar, **Then** the floating navigation bar is hidden.
4. **Given** the sidebar is open on a mobile viewport, **When** the visitor closes the sidebar, **Then** the room gallery, gallery button, and floating navigation bar reappear.
5. **Given** the sidebar is open on a mobile viewport, **Then** no part of the room gallery, gallery button, or floating navigation bar is visible through the sidebar's tinted background.

---

### User Story 2 - Keep gallery and floating nav visible on desktop when the sidebar opens (Priority: P2)

A visitor using the tour on a desktop monitor opens the campus floor sidebar. Because the desktop layout has ample space and the sidebar does not overlay the same screen area, the gallery, gallery button, and floating nav should remain visible and usable.

**Why this priority**: Desktop visitors have sufficient screen space for all surfaces to coexist, so hiding them there would remove usable functionality without benefit.

**Independent Test**: Open the tour on a desktop viewport, open the sidebar, and confirm the gallery, gallery button, and floating navigation bar remain visible.

**Acceptance Scenarios**:

1. **Given** the tour is open on a desktop viewport, **When** the visitor opens the sidebar, **Then** the room gallery remains visible.
2. **Given** the tour is open on a desktop viewport, **When** the visitor opens the sidebar, **Then** the gallery button remains visible.
3. **Given** the tour is open on a desktop viewport, **When** the visitor opens the sidebar, **Then** the floating navigation bar remains visible.

## Edge Cases

- The visitor rotates the device from portrait to landscape while the sidebar is open on mobile; the gallery, gallery button, and floating nav remain hidden while the sidebar stays open.
- The visitor opens and closes the sidebar rapidly multiple times on mobile; the gallery, gallery button, and floating nav toggle visibility consistently without flickering or getting stuck hidden.
- The sidebar opens on a mobile viewport when no gallery is currently open; no error occurs, the gallery button is still hidden, and the floating nav is still hidden.
- The sidebar opens on a mobile viewport when no narration is active; the gallery button and floating nav are still hidden.
- The visitor uses keyboard navigation (Escape key) to close the sidebar on mobile; the gallery, gallery button, and floating nav reappear.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: When the sidebar is revealed on a mobile viewport, the room gallery MUST be hidden.
- **FR-002**: When the sidebar is revealed on a mobile viewport, the gallery button MUST be hidden.
- **FR-003**: When the sidebar is revealed on a mobile viewport, the floating navigation bar MUST be hidden.
- **FR-004**: When the sidebar is closed on a mobile viewport, the room gallery, gallery button, and floating navigation bar MUST reappear.
- **FR-005**: When the sidebar is revealed on a non-mobile viewport (desktop), the room gallery, gallery button, and floating navigation bar MUST remain visible.
- **FR-006**: While the sidebar is open on a mobile viewport, no part of the room gallery, gallery button, or floating navigation bar MUST be visible through the sidebar's tinted background.

### Key Entities

- **Sidebar**: The campus floor navigation drawer that lists floors and lets visitors select a location. It has a tinted semi-transparent background when open.
- **Room gallery**: The overlay that displays room images for the current location.
- **Gallery button**: The "View gallery" button on the panorama page that opens the room gallery overlay.
- **Floating navigation bar**: The floating bar at the bottom of the screen containing narration controls (play/pause, mute, transcript, map).
- **Mobile viewport**: Narrow phone and tablet screen widths where the sidebar overlays the screen as a tinted panel.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of sidebar open actions on a mobile viewport result in the room gallery being hidden.
- **SC-002**: 100% of sidebar open actions on a mobile viewport result in the gallery button being hidden.
- **SC-003**: 100% of sidebar open actions on a mobile viewport result in the floating navigation bar being hidden.
- **SC-004**: 100% of sidebar close actions on a mobile viewport result in the room gallery, gallery button, and floating navigation bar reappearing.
- **SC-005**: On desktop viewports, 100% of sidebar open actions leave the room gallery, gallery button, and floating navigation bar visible.
- **SC-006**: No gallery, gallery button, or floating nav content is visible through the sidebar's tinted background while the sidebar is open on mobile.

## Assumptions

- "Mobile viewport" refers to the compact/narrow breakpoints used by the project (max-width 1023px per the existing `isCompactViewport()` utility), where the sidebar overlays the screen as a tinted panel.
- The room gallery is the `RoomGallery` component, the gallery button is the "View gallery" button in `Panorama.jsx`, and the floating navigation bar is the `FloatingMenu` component, all rendered in the tour layout.
- The sidebar open/close state is managed by the parent layout component and is available as a shared state that the gallery, gallery button, and floating nav can respond to.
- "Hidden" means not visible to the visitor (e.g., not rendered or visibility-hidden), not permanently removed from the application.
- Existing sidebar behavior (floor pairing, locked-floor popovers, scene switching) is preserved across all viewports.
