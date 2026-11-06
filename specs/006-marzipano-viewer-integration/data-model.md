# Data Model: Marzipano Panorama Viewer Integration

**Feature**: Marzipano Panorama Viewer Integration
**Branch**: `006-marzipano-viewer-integration`
**Date**: 2026-11-06

## Entities

### Scene

One 360-degree viewpoint within a floor. Driven by APP_DATA.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique tile id, e.g. `0-lg---1` |
| name | string | Yes | Display name, e.g. `LG - 1` |
| levels | array | Yes | Tile pyramid levels; each has tileSize, size, fallbackOnly |
| faceSize | number | Yes | Cube face size in pixels |
| initialViewParameters | object | Yes | { yaw, pitch, fov } in radians |
| linkHotspots | array | Yes | Link hotspots to other scenes (may be empty) |
| infoHotspots | array | Yes | Info hotspots with title/text content (may be empty) |

**Validation rules**:
- `id` must be unique across all scenes in APP_DATA
- `initialViewParameters.fov` must be within minFov and maxFov bounds
- Each `linkHotspot.target` must reference a valid scene id
- Each `linkHotspot` must have yaw and pitch in radians

**State transitions**: A scene is either "loaded" (tiles fetched, viewer initialized) or "active" (currently displayed). Switching scenes deactivates the previous scene and activates the new one without page reload.

### Floor

A campus level represented by a Sidebar button and a set of interconnected scenes.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| label | string | Yes | Floor label, e.g. `LG`, `UG`, `4F` |
| firstSceneId | string | Yes | Id of the scene displayed when the floor is first selected |
| scenes | array<Scene> | Yes | All scenes belonging to this floor |
| locked | boolean | No | Whether the floor is locked/off-limits |

**Floors**: LG, UG, 4F, 5F, 5M, 6F, 7F, 8F, 9F

**First scenes** (from spec):
- LG: `0-lg---1`
- UG: `5-ug---1`
- 4F: `10-4f---1`
- 5F: `23-5f---1`
- 5M: `27-5m---1`
- 6F: `29-6f---2`
- 7F: `39-7f---2`
- 8F: `42-8f---2`
- 9F: `48-9f---1`

**Validation rules**:
- `firstSceneId` must reference a scene id in this floor's scenes
- Floor labels must be unique

### Link Hotspot

An interactive marker in the panorama that switches to another scene when clicked.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| target | string | Yes | Target scene id |
| yaw | number | Yes | Yaw angle in radians |
| pitch | number | Yes | Pitch angle in radians |
| rotation | number | Yes | Icon rotation in radians |

**Validation rules**:
- `target` must reference a valid scene id in APP_DATA

### Info Hotspot

An interactive marker in the panorama that shows title and text content when opened. **Out of scope for this feature** (clarified 2026-11-06): every scene in `APP_DATA` defines an empty `infoHotspots` list, so no behavior, validation, or acceptance criterion applies. Shape documented for future data only.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Hotspot title |
| text | string | Yes | Hotspot body text |
| yaw | number | Yes | Yaw angle in radians |
| pitch | number | Yes | Pitch angle in radians |

### APP_DATA

The data source holding all scene definitions and settings.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| scenes | array<Scene> | Yes | All 54 scenes |
| settings | object | Yes | mouseViewMode, autorotateEnabled, fullscreenButton |

**File location**: `src/lib/data.js` (existing)

### Panorama Viewer State

Runtime state in `PanoramaViewer.jsx` (not persisted).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| currentScene | Scene | No | Currently displayed scene |
| currentFloor | string | No | Currently selected floor label |
| viewer | object | No | Marzipano Viewer instance |
| status | string | Yes | `loading`, `ready`, or `error` |

**State transitions**:
- `loading` → `ready`: Viewer initialized and first scene switched
- `ready` → `ready`: Floor or scene switch (viewer reuses existing instance)
- `ready` → `error`: Scene or viewer initialization fails
- Any → `loading`: New floor/scene load begins
- Concurrent switches (rapid floor/scene changes while loading): **last selection wins** (FR-013) — only the most recent selection's `loading → ready` transition commits; earlier in-flight loads are superseded, and `currentFloor`/Sidebar highlight always match the displayed scene

## Relationships

- APP_DATA contains many Scenes
- A Floor references many Scenes and one first Scene
- A Scene has many Link Hotspots (each targeting another Scene)
- A Scene has many Info Hotspots
- Panorama Viewer displays one Scene at a time and references one Floor
- Sidebar Floor buttons select a Floor, which sets the Panorama Viewer's current scene

## Source of Truth

All scene data originates from `src/lib/data.js` (`window.APP_DATA` in the original HTML). No backend, database, or external API is involved. Tile slices are static assets served from `public/tiles/` (committed to git); viewer icons from `public/img/`; only a fallback placeholder lives under `public/panoramas/placeholder/`.
