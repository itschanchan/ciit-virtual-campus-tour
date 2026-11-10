# UI Contract: Sidebar Floor Buttons ↔ Panorama Viewer

## Purpose

Defines the interaction contract between the sidebar floor buttons and the panorama viewer: what the sidebar promises to the viewer when a floor button is clicked, and what the viewer relies on.

## Contract Parties

- **Sidebar** (`apps/frontend/src/components/Sidebar.jsx`): renders floor buttons and handles click/locked interactions.
- **Panorama Viewer**: renders the 360-degree campus scene and exposes scene switching (existing `window.__panoramaViewer?.switchToSceneId(sceneId)` integration).

## Sidebar Responsibilities

1. Render one button per floor in `FLOOR_SEQUENCE`, in descending order.
2. Match each floor button to its location data by **floor label**, not array index.
3. Mark a button clickable when the floor is not locked and its location has a panorama tile.
4. Mark a button disabled and visually unavailable when the floor is not locked but has no panorama tile.
5. Mark a button "off limits" when the floor is locked.
6. On click of a clickable button: invoke `onSelect(location.id)` and switch the panorama viewer to `FLOOR_SCENE_MAP[floor]`.
7. On click of a locked button: show a "coming soon" notice; do not switch scenes.
8. On click of an unavailable (disabled) button: ignore; do not switch scenes.

## Viewer Responsibilities

1. Expose `switchToSceneId(sceneId)` to change the displayed panorama scene.
2. Display the scene corresponding to the floor's scene ID without error.
3. Report "Panorama unavailable" only when there are genuinely no scene tiles (per spec 006/007), not due to mapping errors.

## Click Event Contract

| Actor | Action | Sidebar Response | Viewer Response |
|-------|--------|------------------|-----------------|
| Visitor | Click available floor button | `onSelect(location.id)` + `switchToSceneId(sceneId)` | Loads and displays the floor's panorama scene |
| Visitor | Click locked floor button | Show "coming soon" popover | None |
| Visitor | Click unavailable floor button | Ignore (button disabled) | None |

## Failure Modes

- If `FLOOR_SCENE_MAP[floor]` is undefined for a clicked floor: viewer is not switched; no error thrown (guarded by `typeof window !== "undefined"` and sceneId existence check).
- If location is null for a floor: button is unavailable/disabled; click ignored.

## Version

v1.0 — aligned with spec `specs/008-fix-sidebar-buttons/spec.md` (FR-001 to FR-005).
