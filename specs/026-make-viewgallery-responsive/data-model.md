# Data Model: Make ViewGallery Modal Responsive on All Viewports

**Feature**: `026-make-viewgallery-responsive`
**Date**: 2026-11-15

## Overview

This feature introduces no new persistent entity type, database model, API payload, or schema migration. It adjusts the transient presentation of the existing ViewGallery modal inside `FloatingMenu.jsx` so the gallery image, caption, image counter, navigation arrows, and close button fit within the viewport on mobile, tablet, and desktop without scrolling. The underlying gallery image content (`catalog.json` and per-floor assets under `assets/gallery/`) is unchanged.

## Entities

### Gallery Image (catalog entry)

A single image entry in a location's `gallery` array, defined in `apps/frontend/src/lib/catalog.json` or resolved per-floor via `apps/frontend/src/lib/floorGallery.js`.

| Field | Type | Rules |
|:---|:---|:---|
| `src` | string | Non-empty; resolves to an existing public asset |
| `alt` | string | Non-empty; meaningful alternative text for the image |
| `caption` | string | Non-empty; displayed below the active image |
| `order` | integer | Unique non-negative integer within the gallery; defines sort order |

Invariants:
- Images are sorted by `order` before display.
- `order` values are contiguous starting at 0.
- A gallery with zero images shows the empty-state message.
- A gallery with one image shows no previous/next controls.

### Responsive Gallery Modal State (transient, in FloatingMenu)

Component-level presentation state for the responsive ViewGallery modal.

| Field | Type | Meaning |
|:---|:---|:---|
| `open` | boolean | Whether the gallery modal is visible |
| `currentIndex` | integer, starting at 0 | Position of the active image |
| `imageCount` | integer | Number of sorted images for the current floor/location |
| `activeIndex` | integer | `currentIndex` clamped to the valid range |
| `hasMultipleImages` | boolean | True when `imageCount > 1`; arrow controls shown only then |
| `activeImage` | Gallery Image or null | The image at `activeIndex`, or null when empty |

State transitions:

| Event | Result |
|:---|:---|
| Gallery opens | `currentIndex` resets to 0; close button receives focus |
| Next control or right arrow | `currentIndex = (index + 1) % imageCount` |
| Previous control or left arrow | `currentIndex = (index - 1 + imageCount) % imageCount` |
| Escape pressed | Gallery closes and `onClose` is called |
| Backdrop clicked | Gallery closes and `onClose` is called |
| Close button clicked | Gallery closes and `onClose` is called |
| Location changes | Gallery closes; remounts with the next location's images at index 0 |
| Image fails to load | The failed image shows an "Image unavailable" fallback; navigation to other images still works |
| Viewport changes (rotate/resize) | Modal re-measures against the new viewport; no scrolling introduced |

## FloatingMenu Responsive Surface

The consolidated on-screen component that hosts the responsive ViewGallery modal and narration controls.

| Prop | Type | Default | Meaning |
|:---|:---|:---|:---|
| `images` | Gallery Image[] | `[]` | Gallery images for the current location |
| `open` | boolean | — | Whether the gallery modal is open |
| `onClose` | function | — | Called to close the gallery |
| `sidebarOpen` | boolean | `false` | Whether the sidebar is open |
| `floorLabel` | string | `""` | Floor name shown in the gallery header |
| `narration` | object | `undefined` | Narration metadata (`audioSrc`, `transcript`) |
| `status` | string | `idle` | Current narration status |
| `onPlay` | function | — | Narration play callback |
| `onPause` | function | — | Narration pause callback |
| `onStatusChange` | function | — | Narration status-change callback |
| `muted` | boolean | `false` | Whether narration is muted |
| `onMuteToggle` | function | — | Narration mute-toggle callback |

## Relationships

```text
FloatingMenu 1 ─── 1 Responsive Gallery Modal State (while gallery open)
FloatingMenu 1 ─── 1 Narration Control State (always)
Location 1 ─── * Gallery Image
Gallery Image 1 ─── 1 Active Image (at any point in time)
Viewport 1 ─── * Responsive Gallery Modal Layout
```

## Validation Rules

- **VR-001**: Gallery images must each have non-empty `src`, `alt`, and `caption`.
- **VR-002**: Gallery image `order` values must be unique non-negative integers within a gallery.
- **VR-003**: When the gallery is open and has images, exactly one active image must be displayed at a time.
- **VR-004**: The position counter must show `currentIndex + 1` of `imageCount` and match the active image.
- **VR-005**: Previous/next controls and arrow-key navigation must be hidden when `imageCount <= 1`.
- **VR-006**: When the sidebar is open on a compact viewport, the entire `FloatingMenu` (gallery and narration) must not render.
- **VR-007**: All controls must have accessible names and visible focus states.
- **VR-008**: The gallery modal and all its content (image, caption, counter, arrows, close button) must fit within the viewport without vertical or horizontal scrolling on mobile, tablet, and desktop viewports, in both portrait and landscape orientations.
- **VR-009**: The gallery image must scale down so it never exceeds the available viewport height or width while preserving its aspect ratio.

## Notes

- No database model, API payload, or schema migration is introduced.
- Gallery image content is unchanged: `catalog.json` and `apps/frontend/src/assets/gallery/` remain the sources.
- The responsive change is a presentation/layout adjustment only; no gallery data model changes.
