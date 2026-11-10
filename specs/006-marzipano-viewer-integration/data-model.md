# Data Model: Marzipano Panorama Viewer Integration

**Feature**: Marzipano Panorama Viewer Integration
**Branch**: `006-marzipano-viewer-integration`
**Date**: 2026-11-06 | **Updated**: 2026-11-07 (sidebar sync clarifications)

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

**First scenes** (authoritative ID guide: `docs/prompts/frontend-prompts/sidebar_buttons.md`; corrected 2026-11-07 — earlier drafts listed `5-ug---1`, `29-6f---2`, `39-7f---2`, `42-8f---2`, `48-9f---1`, which are valid scenes but not the designated first scenes):
- LG: `0-lg---1`
- UG: `6-ug---2`
- 4F: `10-4f---1`
- 5F: `23-5f---1`
- 5M: `27-5m---1`
- 6F: `34-6f---11`
- 7F: `38-7f---5`
- 8F: `46-8f---6`
- 9F: `51-9f---5`

**Validation rules**:
- `firstSceneId` must reference a scene id in this floor's scenes
- Floor labels must be unique
- Every scene id in APP_DATA must resolve to one of these floors via its floor code (54/54 — see the sync mapping below)

### Floor↔Scene Sync Mapping

Runtime mapping used to keep the Sidebar synchronized with the displayed panorama (Integration Rule #1, FR-006). Lives in `src/lib/floorSceneMap.js`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| FLOOR_SEQUENCE | array<string> | Yes | Sidebar display order: LG, UG, 1F, 2F, 3F, 4F, 5F, 5M, 6F, 7F, 8F, 9F, 10F, 11F |
| FLOOR_SCENE_MAP | object | Yes | Floor label → designated first scene id (the table above) |
| FLOOR_CODE_MAP | object | Yes | Derived: lowercased floor label → floor label (`lg` → `LG`, `5m` → `5M`) |
| floorCode | string | Yes | The middle segment of a scene id: `16-4f---11` → `4f` |

**Resolution rule**: `getFloorForSceneId(sceneId)` splits the id on `-` and maps `parts[1]` through `FLOOR_CODE_MAP`.

**Validation rules**:
- All 54 scene ids in APP_DATA resolve to a floor (covered by `src/tests/floorSceneMap.test.js`)
- An unknown/absent floor code resolves to `null`, and the caller keeps the previously highlighted floor active (clarified 2026-11-07 — no highlight clear, no fallback floor)
- `getSceneIdForFloor(floor)` round-trips with `getFloorForSceneId` for every designated first scene

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
- A Scene belongs to the Floor named by its id's floor code; a scene change updates the Sidebar's active floor button (Rule #1)
- A Scene has many Link Hotspots (each targeting another Scene — cross-floor targets move the active floor to the target scene's floor)
- A Scene has many Info Hotspots
- Panorama Viewer displays one Scene at a time and references one Floor
- Sidebar Floor buttons select a Floor, which sets the Panorama Viewer's current scene; the viewer's scene change flows back to the Sidebar as the active floor

## Source of Truth

All scene data originates from `src/lib/data.js` (`window.APP_DATA` in the original HTML). No backend, database, or external API is involved. Tile slices are static assets served from `public/tiles/` (committed to git); viewer icons from `public/img/`; only a fallback placeholder lives under `public/panoramas/placeholder/`.
