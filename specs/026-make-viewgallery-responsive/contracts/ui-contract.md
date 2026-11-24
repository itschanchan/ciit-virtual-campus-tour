# UI Contract: Responsive ViewGallery Modal

**Feature**: `026-make-viewgallery-responsive`
**Date**: 2026-11-15

## Purpose

Document the public user-interface surface of the responsive ViewGallery modal inside `FloatingMenu.jsx`: the modal structure, accessible names, keyboard shortcuts, and responsive behavior across desktop, tablet, and mobile viewports. This contract describes the expected user-facing behavior; implementation layout details live in `FloatingMenu.jsx`.

## Modal Surface

| Element | Role / Aria | Behavior |
|:---|:---|:---|
| Gallery modal backdrop | `role="dialog"`, `aria-modal="true"`, `aria-labelledby="room-gallery-title"` | Fixed overlay; opens/closes via `onOpen`/`onClose`; click outside closes |
| Gallery title | `id="room-gallery-title"` | "Room details" or "{floorLabel} floor gallery" |
| Close button | `aria-label="Close gallery"` | Closes the modal; autofocused when opened |
| Gallery image | `role="img"`, `alt={image.alt}` | Active image scaled to fit within the viewport; "Image unavailable" fallback on load failure |
| Previous image button | `aria-label="Previous image"` | Navigates to prior image with wrap-around; hidden when one image |
| Next image button | `aria-label="Next image"` | Navigates to next image with wrap-around; hidden when one image |
| Caption | plain text below image | `activeImage.caption` |
| Position counter | `aria-live="polite"` | "{activeIndex + 1} / {imageCount}" |
| Empty state | plain text | "No gallery images are available for this location yet." when no images |

## Responsive Behavior

| Viewport | Requirement |
|:---|:---|
| Mobile (320px+) | Modal, image, caption, counter, arrows, and close button fit within the viewport without vertical or horizontal scrolling, in portrait and landscape |
| Tablet | Same no-scrolling fit as mobile |
| Desktop | Same no-scrolling fit; image and panel use generous sizing within width cap |
| Any orientation change | Content re-fits within the new viewport without introducing scrolling |

## Keyboard Operability

| Key | Action | Context |
|:---|:---|:---|
| `Escape` | Close gallery | While modal open |
| `ArrowLeft` | Previous image | While modal open, multiple images |
| `ArrowRight` | Next image | While modal open, multiple images |
| `p` | Toggle narration play/pause | While narration button focused |
| `m` | Toggle narration mute | While mute button focused |

## Accessibility

- All interactive controls have visible focus states and accessible names.
- Images carry meaningful `alt` text; captions are displayed below the active image.
- Position counter is announced politely via `aria-live`.
- Focus returns to the triggering element (or `tour-main` fallback) when the gallery closes.
- When the sidebar is open on a compact viewport, the entire `FloatingMenu` (gallery and narration) does not render.

## Notes

- The narration controls panel is a separate surface within `FloatingMenu.jsx` and is not modified by this feature.
- No new runtime dependency is introduced; responsive behavior uses existing Tailwind CSS utilities.
