# Feature Specification: Remove Marzipano Header

**Feature Branch**: `007-remove-marzipano-header`

**Created**: 2026-11-06

**Status**: Draft

**Input**: User description: "in @specs/006-marzipano-viewer-integration, remove Marzipano header."

## Clarifications

### Session 2026-11-06

- Q: Did the Marzipano hamburger button (scene list toggle) and the fullscreen button also get removed when the header was removed? → A: No. Only the `#titleBar` header div (which displayed the current scene name) and its now-unused `sceneName` constant were removed. The hamburger button, fullscreen button, autorotate toggle, and directional view controls all remain intact and operable, consistent with FR-004.

- Q: Should the hamburger button (scene list toggle) and fullscreen button also be removed from the top of the viewer? → A: Yes. The hamburger button (`sceneListToggle`) and fullscreen button (`fullscreenToggle`) at the top of the viewer are removed from view; they remain in the DOM but are hidden with CSS so frozen `Marzipano.jsx` can still query them without throwing `TypeError`s. Only the autorotate toggle and directional view controls remain visible.

- Q: Panoramas are not showing up after removing the header bar, hamburger button, and fullscreen button, because frozen `Marzipano.jsx` directly queries `#titleBar .sceneName`, `#sceneListToggle`, and `#fullscreenToggle` and throws `TypeError`s when they are absent. How should this be resolved? → A: Option A — Keep `#sceneListToggle` and `#fullscreenToggle` in the DOM but hide them with CSS (`display: none`); do not modify frozen `Marzipano.jsx` — panoramas display while the buttons are not visible.

- Q: The "Panorama unavailable" error overlay keeps showing even though the Marzipano panorama renders correctly, because `PanoramaViewer` gates rendering on `location.panorama` from the catalog instead of using `APP_DATA` which always contains scene data. How should this be resolved? → A: Option A — Remove `location.panorama` gating — always render Marzipano from `APP_DATA` so panoramas display whenever scene data exists.

- Q: The "Panorama unavailable" message still shows even though the panorama renders properly, because frozen `Marzipano.jsx` queries `#titleBar .sceneName` which was removed, throwing `TypeError`s during scene switches that prevent `setStatus("ready")` from executing. The error message should only appear if there are genuinely no tiles/scene data on that floor. How should this be resolved? → A: Restore a hidden `#titleBar` element containing `.sceneName` so frozen `Marzipano.jsx` can query it without throwing; only show the "Panorama unavailable" error when `APP_DATA` has no scenes (genuine missing tiles).

- Q: Should the autorotate toggle button also be removed from the top of the viewer? → A: Yes. The autorotate toggle (`autorotateToggle`) is hidden from view but kept in the DOM so frozen `Marzipano.jsx` can still query it without throwing `TypeError`s. Only the directional view controls remain visible.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View an immersive, unobstructed panorama (Priority: P1)

A visitor opens the virtual campus tour and the panorama viewer displays the 360-degree scene without any visible top-of-viewer buttons occupying the top of the view. Removing the Marzipano header bar and hiding the hamburger button (scene list toggle ☰), fullscreen button, and autorotate toggle gives the visitor more screen space to look around the campus scenery, which is especially valuable on narrow mobile viewports. The buttons remain in the DOM but are hidden so frozen `Marzipano.jsx` keeps working.

**Why this priority**: The header bar, hamburger button, fullscreen button, and autorotate toggle all occupy vertical space at the top of the viewer; hiding them makes the panoramic experience more immersive and lets the campus scenery fill the view.

**Independent Test**: Open the tour and confirm no header bar, hamburger button, fullscreen button, or autorotate toggle is visible at the top of the panorama viewer; confirm the scene fills the available vertical space and panoramas render correctly.

**Acceptance Scenarios**:

1. **Given** the tour loads, **When** the panorama viewer renders, **Then** no header bar, hamburger button, fullscreen button, or autorotate toggle is visible at the top of the viewer.
2. **Given** the visitor views the panorama on a narrow mobile viewport, **Then** the full panorama is visible without any visible top-of-viewer button overlay.
3. **Given** Marzipano successfully renders the scene from `APP_DATA`, **Then** the "Panorama unavailable" error overlay is not shown.

---

### User Story 2 - Still know which scene is displayed (Priority: P2)

After the header is removed, a visitor can still tell which campus scene is currently shown, because the current scene identification is provided through a location other than the removed header (for example, the Sidebar floor selection).

**Why this priority**: Removing the header must not leave the visitor disoriented about which scene they are viewing.

**Independent Test**: Open the tour, switch to a different floor in the Sidebar, and confirm the current scene is still identifiable without a header bar.

**Acceptance Scenarios**:

1. **Given** the header bar has been removed, **When** the visitor switches floors in the Sidebar, **Then** the current scene remains identifiable without a header bar.
2. **Given** the visitor is viewing a scene, **When** no header bar is present, **Then** the visitor can determine which scene is displayed.

---

### Edge Cases

- The visitor still needs to know which scene is currently shown after the header and top buttons are hidden.
- The directional view controls remain accessible without the header and top buttons.
- Switching floors or scenes still works after the header and top buttons are hidden.
- The scene list can still be opened via the Sidebar even though the hamburger button is hidden.
- The panorama loads correctly on both desktop and narrow mobile viewports without visible header and top buttons.
- Frozen `Marzipano.jsx` continues to work because `#sceneListToggle`, `#fullscreenToggle`, `#autorotateToggle`, and `#titleBar .sceneName` remain in the DOM (hidden).
- The "Panorama unavailable" error overlay does not show when Marzipano successfully renders the scene from `APP_DATA`; it only appears if `APP_DATA` has no scenes (genuine missing tiles).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The panorama viewer MUST NOT render a header bar at the top of the 360-degree view.
- **FR-002**: The panoramic scene MUST fill the full available vertical space of the viewer after the header is removed.
- **FR-003**: The current scene identification MUST still be available to the visitor after the header is removed (for example, through the Sidebar or another non-header location).
- **FR-004**: The hamburger button (scene list toggle), fullscreen button, and autorotate toggle at the top of the viewer MUST be hidden from view but kept in the DOM so frozen `Marzipano.jsx` continues to function. The remaining viewer controls (directional view controls) MUST remain visible and operable after the header and top buttons are hidden.
- **FR-005**: The viewer MUST continue to work on both desktop and narrow mobile viewports after the header is removed.

### Key Entities

- **Panorama viewer**: The component that renders the 360-degree campus view and its controls.
- **Header bar**: The top bar of the viewer that is being removed.
- **Current scene identification**: The means by which a visitor knows which scene is displayed, provided outside the removed header.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of panorama viewer loads display no header bar at the top of the view.
- **SC-002**: The panoramic scene occupies the full viewer height on both desktop and mobile viewports.
- **SC-003**: 100% of remaining viewer controls (directional view controls) remain operable after the header and top buttons are removed.
- **SC-004**: Visitors can still identify the current scene after the header is removed.

## Assumptions

- The Marzipano panorama viewer integration (spec 006) is already implemented and is the baseline for this change.
- Removing the header does not require changes to scene switching, floor navigation, or link hotspots.
- The current scene will be identifiable through the Sidebar or another location that remains after the header is removed.
- No new dependencies or npm packages are required.
