# Data Model: Remove Marzipano Header

**Feature**: `007-remove-marzipano-header`
**Created**: 2026-11-06
**Spec**: `specs/007-remove-marzipano-header/spec.md`

## Entities

### Panorama Viewer
- Represents the React component (`PanoramaViewer.jsx`) that renders the 360-degree campus view and its controls.
- Fields (conceptual, no new data introduced):
  - Current scene ID (driven by APP_DATA and Sidebar selection)
  - Scene list open/closed state
- Relationships:
  - Displays scenes defined in APP_DATA (`src/lib/data.js`)
  - Controlled by Sidebar floor selection

### Header Bar (being removed)
- Represents the top bar element (`#titleBar`) of the panorama viewer that displayed the current scene name.
- Removed by this feature; no data persisted, no new state introduced.
- Validation rule: MUST NOT be rendered after this feature (FR-001).

### Hamburger Button / Scene List Toggle (being hidden)
- Represents the top-left toggle button (`#sceneListToggle`, ☰) that opened/closes the scene list.
- Hidden from view but kept in the DOM so frozen `Marzipano.jsx` can query it without throwing `TypeError`s.
- Validation rule: MUST NOT be visible after this feature (FR-004).
- Scene list remains accessible via Sidebar even though this button is hidden.

### Fullscreen Button (being hidden)
- Represents the top-right toggle button (`#fullscreenToggle`) that expands viewer to fullscreen.
- Hidden from view but kept in the DOM so frozen `Marzipano.jsx` can query it without throwing `TypeError`s.
- Validation rule: MUST NOT be visible after this feature (FR-004).

### Autorotate Toggle (being hidden)
- Represents the toggle button (`#autorotateToggle`) that starts/stops automatic panorama rotation.
- Hidden from view but kept in the DOM so frozen `Marzipano.jsx` can query it without throwing `TypeError`s.
- Validation rule: MUST NOT be visible after this feature (FR-004).
- Autorotate behavior itself is unchanged; only the visible button is removed.

### Current Scene Identification
- Represents the means by which a visitor knows which scene is displayed.
- Provided outside the removed header and top buttons, via the Sidebar floor selection and scene list (FR-003, SC-004).
- No new data model; reuses existing APP_DATA scene names and Sidebar floor labels.

## Validation Rules

- The panorama viewer MUST NOT render a header bar at the top of the 360-degree view (FR-001).
- The hamburger button (scene list toggle) MUST NOT be visible at the top of the viewer (FR-004).
- The fullscreen button MUST NOT be visible at the top of the viewer (FR-004).
- The autorotate toggle MUST NOT be visible at the top of the viewer (FR-004).
- The panoramic scene MUST fill the full available vertical space of the viewer after removals (FR-002).
- Current scene identification MUST still be available to the visitor after removals (FR-003).
- Remaining viewer controls (directional view controls) MUST remain operable after removals (FR-004).
- The viewer MUST continue to work on both desktop and narrow mobile viewports after removals (FR-005).
- The "Panorama unavailable" error overlay MUST only appear when `APP_DATA` has no scenes (genuine missing tiles), not when Marzipano is working correctly.

## State Transitions

None introduced by this feature. Scene switching, floor selection, and control toggling behavior is unchanged from spec 006.

## Notes

- This is a removal/hiding-only UI change; no new entities, fields, or persistence are added.
- APP_DATA (`src/lib/data.js`) and the Sidebar are unchanged and continue to drive scene identification after removals.
- No container div wraps the removed/hidden buttons (they are direct children of `<section>`); no div removal is needed beyond the individual button elements.
