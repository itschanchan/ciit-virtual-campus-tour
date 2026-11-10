# UI Interaction Contract: Remove Marzipano Header

**Feature**: `007-remove-marzipano-header`
**Created**: 2026-11-06
**Spec**: `specs/007-remove-marzipano-header/spec.md`

## Scope

This feature is entirely frontend (`apps/frontend/src/components/PanoramaViewer.jsx`). It exposes no external API, CLI, or library interface. The only contract is the user-visible behavior of the panorama viewer after the header bar, hamburger button, fullscreen button, and autorotate toggle are hidden.

## UI Contracts

| ID | Trigger | Expected Behavior | Source |
|----|---------|-------------------|--------|
| C1 | Tour loads | No header bar, hamburger button (☰), fullscreen button, or autorotate toggle is visible at the top of the panorama viewer; the panoramic scene fills the full available vertical space | FR-001, FR-002, FR-004, SC-001, SC-002, SC-003 |
| C2 | Visitor switches floors in the Sidebar | The viewer switches to that floor's first scene; the current scene remains identifiable via the Sidebar (no header bar or top buttons present) | FR-002, FR-003, SC-004, User Story 2 |
| C3 | Visitor interacts with remaining viewer controls (directional view controls) | The control produces its expected effect; keyboard operability and visible focus states are preserved | FR-004, SC-003, Constitution Principle V |
| C4 | Visitor views the panorama on a narrow mobile viewport | The full panorama is visible without any visible top-of-viewer button overlay; remaining controls remain accessible | FR-005, SC-002, User Story 1 |
| C5 | Visitor opens scene list | The scene list is opened via the Sidebar scene list (hamburger button hidden; Sidebar provides this function) | FR-003, data model note |
| C6 | Marzipano switches scenes | No `TypeError` is thrown when frozen `Marzipano.jsx` queries `#sceneListToggle`, `#fullscreenToggle`, `#autorotateToggle`, or `#titleBar .sceneName`; all four elements remain in the DOM (hidden) | FR-004, data model note |

## What Does NOT Change

- Sidebar floor navigation contract (floor click → scene switch) is unchanged.
- Link hotspot contract (click → scene switch within a floor) is unchanged.
- Directional view controls contract is unchanged; remains visible and operable.
- Scene identification remains via the Sidebar floor selection and scene list; no new scene-label UI is added.

## Notes

- No backend endpoints, request/response schemas, or authentication contracts are affected.
- No new public interfaces are introduced; existing interfaces are not removed except the visible top buttons.
- No container div wraps the removed/hidden buttons (they are direct children of `<section>`); no div removal is needed beyond hiding the individual button elements.
