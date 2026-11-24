# Research: Transfer View Gallery Logic to Floating Menu

**Feature**: `025-transfer-view-gallery-logic`

## Outstanding Clarifications

None. All clarifications were resolved during the `/speckit.clarify` session (2026-11-15):

- **Q**: Should FloatingMenu receive the gallery open state and toggle handler as props from Layout, or manage them as internal component state?
- **A**: FloatingMenu receives gallery open state and toggle handler as props from Layout.

This confirms FR-002: Layout retains ownership of gallery open/close state via TourContext and passes it to FloatingMenu as props (`open`, `onClose`, plus an open handler). No internal state duplication in FloatingMenu.

## Decisions

| Decision | Rationale | Alternatives considered |
|:---|:---|:---|
| Layout owns gallery open/close state; FloatingMenu receives it as props | Matches existing architecture: Layout already owns `galleryOpen` via TourContext and passes `open`/`onClose` to FloatingMenu. Keeps a single source of truth and avoids duplicated/desynchronized state. | FloatingMenu managing gallery state internally (rejected: would split state ownership between Layout and FloatingMenu, risking desync and making the View Gallery button harder to wire consistently). |
| No new runtime dependency | The feature only wires existing props into an already-placed button and removes unused destructuring. | Adding a state-management library or new hook (rejected: unnecessary complexity, violates Constitution dependency constraints). |
| Panorama.jsx removes the unused `galleryOpen`/`toggleGallery` destructuring | Those values are never used in Panorama; removing them satisfies FR-004 and eliminates dead code. | Leaving them in place (rejected: leaves dead references and contradicts FR-004). |
| View Gallery button is icon-only (`PhotoCameraIcon`) and inline in single controls row | Matches the icon-button pattern used by the other narration controls (play/pause, mute, transcript, map). Keeps all buttons in one responsive horizontal row. Reduces visual clutter and fixes the off-position issue from absolute positioning. | Keeping visible text label "View gallery" (rejected: inconsistent with the icon-only style of adjacent controls). Keeping absolute positioning `top-20 right-4` (rejected: caused the off-position issue and broke the single-row layout). |

## Dependencies and Integrations

- `TourContext.jsx` already provides `toggleGallery` and `setGalleryOpen`; no context change needed.
- `Layout.jsx` already passes `open`/`onClose` to FloatingMenu; only an open handler needs to be added.
- `FloatingMenu.jsx` already contains the full gallery rendering and narration logic; only the View Gallery button wiring needs fixing.
- No backend, API, catalog, or schema involvement.

## Best Practices

- Keep gallery and narration state separate within FloatingMenu using distinct state keys and effects.
- Retain the existing `sidebarOpen && isCompactViewport()` mobile-hide rule in one place.
- Carry over existing focus management (`closeButtonRef`, `tour-main` fallback) unchanged.
- Preserve accessible names/labels (`aria-expanded`, `aria-controls`) on the View Gallery button.
