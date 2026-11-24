# UI Contract: Responsive Floor Directory Modal with Zoom

**Feature**: `027-maps-modal-zoom`
**Date**: 2026-11-15

## Purpose

Document the public user-interface surface of the floor directory modal added to the maps button in `FloatingMenu.jsx`: the modal structure, accessible names, keyboard shortcuts, zoom behavior, and responsive behavior across desktop, tablet, and mobile viewports. This contract describes the expected user-facing behavior; implementation layout and state details live in `FloatingMenu.jsx` and `data-model.md`.

## Modal Surface

| Element | Role / Aria | Behavior |
|:---|:---|:---|
| Map button | `aria-label="Open map"`, `aria-expanded` (true when modal open) | Opens the floor directory modal on click; keyboard operable (Enter/Space) |
| Floor directory modal backdrop | Fixed overlay; `role="dialog"`, `aria-modal="true"`, `aria-labelledby="floor-directory-title"` | Opens via Map button; closes via close button, backdrop click, or `Escape` |
| Floor directory title | `id="floor-directory-title"` | "Floor Directory" |
| Directory image | `role="img"`, `alt` meaningful description | Scaled by zoom level; panned by drag; centered; fit-to-viewport when modal opens; rendered in normal document flow (not absolutely positioned); "Image unavailable" fallback on load failure |
| Close button | `aria-label="Close floor directory"` | Closes the modal; autofocused when open; reachable at all zoom levels |

## Responsive Behavior

| Viewport | Requirement |
|:---|:---|
| Mobile (320px+) | Modal, directory image, and close button fit within the viewport without vertical or horizontal scrolling, in portrait and landscape; pinch-to-zoom supported |
| Tablet | Same no-scrolling fit as mobile; pinch-to-zoom supported |
| Desktop | Same no-scrolling fit; image and panel use generous sizing within width cap; scroll-to-zoom via wheel supported |
| Any orientation change | Content re-fits within the new viewport without introducing scrolling; zoom level remains clamped |
| Zoom at any level | Close button remains reachable without scrolling; image stays centered in the modal |

## Zoom Behavior

| Input | Gesture | Effect | Constraint |
|:---|:---|:---|:---|
| Desktop (mouse) | Scroll wheel over the image | Zoom in (scroll up) / zoom out (scroll down) | Page scroll suppressed while pointer is over the image; level clamped to `[min, max]` |
| Touch screen | Two-finger pinch | Zoom in (spread apart) / zoom out (pinch together) | Page scroll suppressed during gesture; level clamped to `[min, max]` |
| Desktop (mouse) | Click + drag on image | Pan the zoomed image horizontally/vertically | Image follows pointer; pan resets when modal opens |
| Touch screen | Single-finger drag on image | Pan the zoomed image horizontally/vertically | Image follows finger; pan resets when modal opens |
| Modal open | — | Zoom resets to fit-to-viewport (minimum); pan resets to zero | Applies on every open |

## Keyboard Operability

| Key | Action | Context |
|:---|:---|:---|
| `Enter` / `Space` | Open floor directory modal | While Map button focused |
| `Escape` | Close floor directory modal | While modal open |
| `Tab` | Move focus to close button | While modal open |
| `Shift + Tab` | Move focus backward | While modal open |
| `p` | Toggle narration play/pause | While narration button focused (unchanged) |
| `m` | Toggle narration mute | While mute button focused (unchanged) |

## Accessibility

- All interactive controls have visible focus states and accessible names.
- The directory image carries meaningful `alt` text; the modal title labels the dialog.
- Focus moves to the close button when the modal opens and returns to the Map button when it closes.
- Zoom via wheel/pinch is pointer-based; the close button remains keyboard-reachable at every zoom level.
- When the sidebar is open on a compact viewport, the entire `FloatingMenu` (including the Map button) does not render (existing rule preserved).
- No new runtime dependency is introduced; responsive behavior and zoom use existing Tailwind CSS utilities and React state.

## Notes

- The narration controls panel and the existing gallery modal are separate surfaces within `FloatingMenu.jsx` and are not modified by this feature.
- Pan (single-touch drag of the zoomed image) is intentionally out of scope; only scroll-to-zoom and pinch-to-zoom are required.
