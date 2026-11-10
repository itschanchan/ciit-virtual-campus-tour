# UI Interaction Contract: Marzipano Panorama Viewer Integration

**Feature**: Marzipano Panorama Viewer Integration
**Branch**: `006-marzipano-viewer-integration`
**Date**: 2026-11-06 | **Updated**: 2026-11-07 (Integration Rules #1/#2)

## Contract Overview

This feature is entirely frontend with no external API, CLI, or library interfaces. The contract defines the UI interaction between the Sidebar floor navigation and the PanoramaViewer, and between link/info hotspots and scene switching.

## Actors

- **Visitor**: Campus visitor exploring the 360-degree tour
- **Sidebar**: Floor navigation buttons (LG, UG, 4F, 5F, 5M, 6F, 7F, 8F, 9F)
- **PanoramaViewer**: The 360-degree viewer rendering Marzipano scenes

## Interaction Contracts

### C1: Sidebar floor selection → Viewer scene switch

**Trigger**: Visitor clicks a floor button in the Sidebar.

**Request**:
- Actor: Visitor
- Input: Floor label (e.g. `LG`, `4F`, `9F`)

**Response**:
- PanoramaViewer loads the floor's designated first scene
- Current scene name displays in the viewer title bar
- Sidebar highlights the selected floor button
- No page reload occurs
- Rapid successive floor/scene selections resolve with **last selection wins**: the most recently chosen scene is the one displayed and the Sidebar highlight matches it (FR-013)

**Acceptance**:
- 100% of floor selections load the correct floor's first scene
- Initial tour load displays scene `0-lg---1` (LG first tile)
- Under rapid switching, the final displayed scene equals the final selection (100%)

### C2: Link hotspot click → Scene switch (intra- or cross-floor)

**Trigger**: Visitor clicks a link hotspot inside the panorama.

**Request**:
- Actor: Visitor
- Input: Target scene id (from hotspot's `target` field)

**Response**:
- Viewer switches to the target scene
- Current scene name updates in the title bar
- Sidebar highlight follows the floor of the *displayed* scene (same floor for intra-floor links; a different floor button for cross-floor links — e.g. `2-lg---3` → `5-ug---1` activates UG)

**Acceptance**:
- 100% of link hotspot clicks switch to the target scene
- 100% of link hotspot clicks leave the Sidebar highlighting the target scene's floor
- No page reload occurs

### C3: Viewer control interaction

**Trigger**: Visitor interacts with a viewer control.

**Controls**:
- Autorotate toggle: starts/stops automatic panorama rotation
- Fullscreen toggle: expands/restores viewer to fullscreen
- Scene list toggle: shows/hides the scene list
- Directional controls (up/down/left/right/in/out): pans or zooms the view

**Response**:
- Control produces its expected effect on the view
- Works on desktop and narrow mobile viewports
- Controls are keyboard operable with visible focus states

**Acceptance**:
- All viewer controls respond to interaction on both desktop and mobile
- Every control is operable by keyboard with a visible focus state; control/panorama images expose meaningful alt text (SC-005)

### C4: Error handling

**Trigger**: A floor or scene has no panorama data, or viewer initialization fails.

**Response**:
- Viewer displays an error/empty-state message
- Visitor can still use the location menu to select another floor
- No JavaScript errors in the browser console

**Acceptance**:
- Viewer initializes without JavaScript errors
- Friendly fallback message shown when panorama is unavailable

### C5: Displayed scene → Sidebar button sync (Rule 1, FR-006/SC-007)

**Trigger**: The displayed scene changes for any reason — floor button click, link hotspot, scene list click, or initial load.

**Request**:
- Actor: PanoramaViewer (via `onSceneChange(sceneId)`)
- Input: Current scene id, e.g. `16-4f---11`

**Response**:
- The floor is resolved by parsing the floor code from the scene id (`4f` → `4F`)
- The matching Sidebar floor button becomes active; the previously active button is released
- If the floor code resolves to no sidebar floor (unknown/future floor), the previously active button **stays** active — the highlight is not cleared and no fallback floor is forced

**Acceptance**:
- 100% of the 54 scenes in APP_DATA resolve to a floor button (automated: `src/tests/floorSceneMap.test.js`)
- Every scene of a floor syncs that floor's button, not only the designated first scene (e.g. all `*-lg-*` scenes → LG)
- SC-007: the current floor is highlighted for 100% of scene switches
- Rapid switching keeps last-selection-wins: the highlight always matches the final displayed scene (FR-013)

### C6: Active button label (Rule 2)

**Trigger**: The active floor button changes (selection or C5 sync).

**Request**:
- Actor: Sidebar
- Input: `currentLocationId` + location name from `catalog.json`

**Response**:
- Only the active button displays its location name (visible text and accessible name); inactive buttons show only the floor label
- Exactly one button is active at a time (`aria-current="true"`)

**Acceptance**:
- 100% of sidebar views show the location name on the active button and on no other button
- The active state is exposed to assistive technology via `aria-current` and the button's accessible name

## Non-Functional Requirements

- **Responsiveness**: Works on desktop and narrow mobile viewports
- **Accessibility**: Keyboard operable controls with visible focus states; scene name announced
- **Performance**: Initial view interactive on mobile; tiles lazy-loaded on demand
- **Reliability**: No page reload on floor/scene switching

## Excluded from Contract

- No backend API endpoints
- No authentication or authorization
- No persistence of viewed scene
- No external system integration
- No info-hotspot popup interaction (out of scope — all scenes have empty `infoHotspots`)
