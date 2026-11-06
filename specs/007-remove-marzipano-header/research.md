# Research: Remove Marzipano Header

**Feature**: `007-remove-marzipano-header`
**Created**: 2026-11-06
**Spec**: `specs/007-remove-marzipano-header/spec.md`

## Decisions

| Decision | Rationale | Alternatives Considered |
|----------|-----------|-------------------------|
| Remove `#titleBar` header div, hide `#sceneListToggle`, `#fullscreenToggle`, `#autorotateToggle` with CSS from `PanoramaViewer.jsx` | All three buttons and the header bar occupy top-of-viewer vertical space; removing/hiding them maximizes immersive screen real estate for the 360-degree scene (FR-001, FR-004, SC-001, SC-002) | Keep buttons visible — rejected; user explicitly requested their removal |
| Keep `#sceneListToggle`, `#fullscreenToggle`, `#autorotateToggle` in the DOM but hidden (CSS `hidden` class) | Frozen `Marzipano.jsx` directly queries all three elements and adds event listeners to them. Removing them throws `TypeError`s that break scene initialization and switching | Remove elements entirely — rejected; would break frozen `Marzipano.jsx` which cannot be modified per Constitution freeze rule |
| No wrapper div exists for top buttons | The `#sceneListToggle`, `#autorotateToggle`, and `#fullscreenToggle` are all direct children of `<section>`; there is no shared container div to remove | N/A — no div exists; removal/hiding is limited to the individual button elements |
| Scene list remains accessible via Sidebar | Sidebar scene list is unaffected by removing/hiding the hamburger button; visitors can still open the scene list from Sidebar | Add alternative scene-list UI — rejected; Sidebar already provides this |
| No new npm packages or dependencies | The change is DOM element hiding within an existing component; nothing new is required | Install a layout library — rejected; unnecessary for hiding elements |

## NEEDS CLARIFICATION Status

No `NEEDS CLARIFICATION` markers remain in the spec. All research questions from Phase 0 are resolved.

## Open Items

None. Research complete; proceeding to Phase 1 design.
