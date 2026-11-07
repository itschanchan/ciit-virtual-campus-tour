# Data Model: Stack Sidebar Above Panorama Viewer

**Feature**: 009-stack-sidebar-above-viewer
**Created**: 2026-11-07

## Entities

### Campus Floor Sidebar

**What it represents**: The navigation component listing campus floors with clickable floor buttons, positioned above the panorama viewer in the stacked layout.

**Key attributes**:
- `open` (boolean): Whether the sidebar is expanded or collapsed
- `locations` (list): Campus floor location entries with floor label, name, and panorama availability
- `currentLocationId` (string): ID of the currently displayed floor/location
- `logoUrl` (string, optional): URL for the CIIT logo displayed in the sidebar header

**Relationships**:
- Contains multiple Floor Button entries, each mapped to a floor label
- Communicates floor selection to PanoramaViewer via the `onSelect` callback and `window.__panoramaViewer.switchToSceneId`
- Toggle state controlled by Layout.jsx via `open`, `onOpen`, `onClose` props

### Panorama Viewer

**What it represents**: The component displaying the 360-degree panoramic view of a campus location, positioned below the sidebar in the stacked layout.

**Key attributes**:
- `location` (object): The current campus location with name and narration
- `currentSceneId` (string, internal): The ID of the currently displayed panorama scene
- `status` (string): Loading, ready, or error state of the viewer

**Relationships**:
- Receives scene switch requests from Sidebar via `window.__panoramaViewer.switchToSceneId`
- Exposes `onReady` and `onError` callbacks to Layout.jsx

### Stacked Layout

**What it represents**: The vertical page arrangement in which the Sidebar sits directly above the PanoramaViewer.

**Key attributes**:
- `direction` (string): `vertical` (sidebar above viewer)
- `sidebarHeight` (string): CSS height/allocation for the sidebar portion
- `viewerHeight` (string): CSS height/allocation for the viewer portion (remaining space)

**Relationships**:
- Composes Campus Floor Sidebar (top) and Panorama Viewer (bottom)
- Manages shared height constraints so neither overlaps the other

## Validation Rules

- Sidebar floor buttons with available panorama tiles MUST be clickable (FR-003)
- Sidebar floor buttons without available panorama tiles MUST NOT be clickable (FR-003)
- Clicking a clickable floor button MUST switch the viewer to the correct floor's scene (FR-002)
- Sidebar and viewer MUST NOT overlap (FR-002)
- Stacked layout MUST work on desktop and mobile viewports (FR-004)

## State Transitions

- Sidebar collapsed ↔ Sidebar expanded: Triggered by the sidebar toggle button; affects vertical space allocation but not floor-to-scene switching
- Viewer loading → Viewer ready: Triggered when Marzipano initializes and the first scene is displayed
- Viewer ready → Viewer error: Triggered when Marzipano fails to load or no scenes are available
