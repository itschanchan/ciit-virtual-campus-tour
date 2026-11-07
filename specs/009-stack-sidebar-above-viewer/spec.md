# Feature Specification: Stack Sidebar Above Panorama Viewer

**Feature Branch**: `009-stack-sidebar-above-viewer`

**Created**: 2026-11-07

**Status**: Draft

**Input**: User description: "Make the Sidebar.jsx stacked above the PanoramaViewer.jsx"

## Clarifications

### 2026-11-07

- **Q**: Does "stacked above the PanoramaViewer" mean a vertical layout where the sidebar occupies the top portion of the screen and the viewer the bottom portion? → A: No. The sidebar keeps its original place **anchored on the left side** (its original fixed width when open, collapsed to zero width when hidden) and "stacked above" means **layered above in visual order**: the PanoramaViewer fills the entire screen and renders underneath the sidebar, header, and floating narration bar.
- **Q**: Does the open sidebar push the viewer aside or squeeze its width? → A: No. The sidebar is an overlay on top of the full-screen viewer; the viewer is never resized or hidden by the sidebar.
- **Q**: How does the chevron toggle behave? → A: Exactly as before the layout change: a vertically centered tab on the sidebar's right edge showing a left-pointing chevron when the sidebar is revealed and a right-pointing chevron when it is collapsed, and it stays visible in both states.
- **Q**: Do the floor-to-scene switching and existing navigation behaviors change? → A: No. Only the layout arrangement changes.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View campus floors in a sidebar layered above the 360-degree viewer (Priority: P1)

A visitor browsing the virtual campus tour sees the campus floor navigation sidebar anchored on the left side of the screen, layered above the panoramic viewer, which fills the whole screen underneath it. The visitor can scan the floor list and tap a floor button to switch the viewer to that floor's panorama scene.

**Why this priority**: This is the core layout of the tour. Layering the sidebar above a full-screen viewer gives the panoramic view the maximum possible space while keeping floor navigation immediately accessible on the left.

**Independent Test**: Open the tour, confirm the sidebar appears on the left side layered above the full-screen panorama viewer, tap an available floor button, and confirm the viewer switches to that floor's panorama.

**Acceptance Scenarios**:

1. **Given** the virtual campus tour loads, **When** the visitor views the page, **Then** the campus floor sidebar is anchored on the left side, layered above the panorama viewer that fills the screen.
2. **Given** the sidebar is layered above the viewer, **When** the visitor taps an available floor button, **Then** the panorama viewer switches to that floor's designated scene.

---

### User Story 2 - Use the layered layout on desktop and mobile (Priority: P2)

A visitor on a desktop or mobile device can use the sidebar-over-viewer layout without layout breakage, overlapping controls, or loss of navigation access.

**Why this priority**: The constitution requires every user-facing feature to work on both desktop and mobile, with layout verified at representative viewports.

**Independent Test**: Open the tour on desktop and mobile viewports, confirm the sidebar remains layered on the left above the viewer and floor buttons remain tappable or clickable.

**Acceptance Scenarios**:

1. **Given** the tour is viewed on a desktop viewport, **When** the visitor views the page, **Then** the sidebar is layered above the viewer while the viewer still renders full-screen beneath it.
2. **Given** the tour is viewed on a mobile viewport, **When** the visitor views the page, **Then** the sidebar remains accessible on the left and floor navigation remains usable.

---

### Edge Cases

- The viewport is very narrow; sidebar floor buttons and viewer controls must remain usable.
- The visitor rotates the device or resizes the browser; the layered layout must adapt without breaking.
- All floors are unavailable; the sidebar still renders above the viewer with unavailable buttons visually distinct.
- The visitor rapidly taps multiple floor buttons; the viewer switches scenes correctly each time.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The campus floor sidebar MUST be anchored on the left side of the screen and layered above the panorama viewer.
- **FR-002**: The panorama viewer MUST fill the entire screen underneath the sidebar, header, and floating narration bar; opening or closing the sidebar MUST NOT resize or hide the viewer.
- **FR-003**: Floor buttons in the sidebar MUST remain clickable and switch the viewer to the correct floor's scene.
- **FR-004**: The layered layout MUST work on both desktop and mobile viewports without breaking navigation access.
- **FR-005**: The sidebar toggle (chevron tab) and viewer controls MUST remain operable in the layered layout.

### Key Entities

- **Campus floor sidebar**: The navigation component listing campus floors with clickable floor buttons.
- **Panorama viewer**: The component displaying the 360-degree panoramic view of a campus location.
- **Layered layout**: A screen layout in which the left-anchored sidebar sits above a full-screen panorama viewer.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On initial page load the sidebar is anchored on the left side, layered above a panorama viewer that fills the screen.
- **SC-002**: 100% of clickable floor buttons in the sidebar switch the viewer to the correct floor scene.
- **SC-003**: Visitors can complete floor selection on both desktop and mobile viewports in the layered layout.
- **SC-004**: The sidebar, header, and floating narration bar sit above the viewer without preventing the viewer from rendering full-screen or from keeping its controls operable.

## Assumptions

- "Stacked above" means visual layering: the sidebar renders on a higher layer above the full-screen panorama viewer, not a vertical top/bottom split.
- The sidebar stays left-anchored with its original open and collapsed widths, including the original chevron toggle placement and icons.
- The layered layout applies to both desktop and mobile viewports, with responsive adaptations as needed.
- Existing floor-to-scene switching behavior remains unchanged; only the layout arrangement changes.
