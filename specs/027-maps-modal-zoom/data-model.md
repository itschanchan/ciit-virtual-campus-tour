# Data Model: Responsive Floor Directory Modal with Zoom

**Feature**: `027-maps-modal-zoom`
**Date**: 2026-11-15

## Overview

This feature introduces no new persistent entity type, database model, API payload, or schema migration. It adds transient presentation state for a new floor directory modal inside `FloatingMenu.jsx` that displays the static floor directory image (`apps/frontend/public/img/glitch_directory.png`) and supports scroll-to-zoom on desktop and pinch-to-zoom on touch screens. The image asset itself is unchanged.

## Entities

### Floor Directory Image (static asset)

A single static image served from the frontend's public directory.

| Field | Type | Rules |
|:---|:---|:---|
| `src` | string | Fixed to `/img/glitch_directory.png`; resolves to an existing public asset |
| `alt` | string | Non-empty; meaningful alternative text describing the floor directory content |
| `displayName` | string | Human-readable label, e.g., "Floor Directory" |

Invariants:
- The image is loaded only when the modal opens (lazy, on demand).
- `alt` text describes the floor directory so screen-reader users understand the content without seeing the image.

### Floor Directory Modal State (transient, in FloatingMenu)

Component-level presentation state for the floor directory modal.

| Field | Type | Default | Meaning |
|:---|:---|:---|:---|
| `mapModalOpen` | boolean | `false` | Whether the floor directory modal is visible |
| `mapZoomLevel` | number | `1` | Current zoom scale factor; `1` means fit-to-viewport |
| `mapPanX` | number | `0` | Horizontal pan offset in pixels; applied when image is zoomed |
| `mapPanY` | number | `0` | Vertical pan offset in pixels; applied when image is zoomed |
| `mapZoomMin` | number | `1` | Minimum zoom (fit to viewport; image never smaller than fit) |
| `mapZoomMax` | number | `3` | Maximum zoom (readable detail; clamped so the image stays usable) |
| `mapZoomStep` | number | `0.1` | Increment/decrement per wheel tick or pinch step |

State transitions:

| Event | Result |
|:---|:---|
| Map button clicked | `mapModalOpen` becomes `true`; `mapZoomLevel` resets to `mapZoomMin`; close button receives focus |
| Close button clicked | `mapModalOpen` becomes `false`; focus returns to the Map button |
| Backdrop clicked | `mapModalOpen` becomes `false`; focus returns to the Map button |
| `Escape` pressed (modal open) | `mapModalOpen` becomes `false`; focus returns to the Map button |
| Wheel scroll (desktop, pointer over image) | `mapZoomLevel` increases/decreases by `mapZoomStep`, clamped to `[mapZoomMin, mapZoomMax]`; page scroll is suppressed |
| Pinch gesture (touch, two fingers) | `mapZoomLevel` scales by the touch-distance ratio, clamped to `[mapZoomMin, mapZoomMax]` |
| Mouse drag / single-finger drag (image zoomed) | `mapPanX`/`mapPanY` updated by drag distance; image follows pointer |
| Modal opens | `mapZoomLevel` resets to `mapZoomMin` (fit-to-viewport); `mapPanX`/`mapPanY` reset to `0` |
| Viewport changes (rotate/resize) | Modal re-measures against the new viewport; zoom remains clamped; no scrolling introduced |

## FloatingMenu Surface Additions

The maps button and new modal are added to the existing `FloatingMenu.jsx` component.

| Element | Role / Aria | Behavior |
|:---|:---|:---|
| Map button | `aria-label="Open map"`, `aria-expanded` reflects open state | Opens the floor directory modal on click |
| Floor directory modal | `role="dialog"`, `aria-modal="true"`, `aria-labelledby="floor-directory-title"` | Fixed overlay; opens/closes via Map button/close button; click outside closes; Escape closes |
| Floor directory title | `id="floor-directory-title"` | "Floor Directory" |
| Directory image | `role="img"`, `alt` meaningful description | Scaled by `mapZoomLevel`; centered in the modal; fit-to-viewport on open |
| Close button | `aria-label="Close floor directory"` | Closes the modal; autofocused when opened; reachable at all zoom levels |

## Relationships

```text
FloatingMenu 1 ─── 1 Floor Directory Modal State (while modal open)
FloatingMenu 1 ─── 1 Responsive Gallery Modal State (while gallery open)
FloatingMenu 1 ─── 1 Narration Control State (always)
Viewport 1 ─── * Floor Directory Modal Layout
```

## Validation Rules

- **VR-001**: The floor directory image must have non-empty `alt` text describing the directory content.
- **VR-002**: When the modal is open, exactly one floor directory image must be displayed at a time.
- **VR-003**: `mapZoomLevel` must always be within `[mapZoomMin, mapZoomMax]`; `mapZoomMin` is fit-to-viewport.
- **VR-004**: `mapZoomLevel` resets to `mapZoomMin` whenever the modal opens.
- **VR-005**: The close button must be reachable without scrolling at every zoom level and on all viewports.
- **VR-006**: The modal and its content (image, close button) must fit within the viewport without vertical or horizontal scrolling on mobile, tablet, and desktop viewports, in both portrait and landscape orientations.
- **VR-007**: Scroll wheel on the image area zooms in/out and must not scroll the page behind the modal.
- **VR-008**: Pinch gesture on touch screens zooms in/out and must not scroll the page.
- **VR-009**: All interactive controls must have accessible names and visible focus states.
- **VR-010**: When the sidebar is open on a compact viewport, the entire `FloatingMenu` (including the new map modal trigger) must not render (existing `sidebarOpen && isCompactViewport()` rule preserved).

## Notes

- No database model, API payload, or schema migration is introduced.
- The floor directory image asset is unchanged: `apps/frontend/public/img/glitch_directory.png`.
- The zoom change is a presentation/interaction adjustment only; no image data model changes.
- Pan (single-touch drag) is intentionally out of scope; only zoom is required.
