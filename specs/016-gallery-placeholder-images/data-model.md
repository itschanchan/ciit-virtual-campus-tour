# Data Model: Floor Gallery Placeholder Images

**Feature**: `016-gallery-placeholder-images`
**Date**: 2026-11-10

## Overview

This feature uses existing tour content structures and adds no new entity type to the application. The models below describe the data the feature adds and the transient viewing state the existing Gallery already manages.

## Entities

### Floor

An accessible campus level exposed by the location menu.

| Field | Type | Rules |
|:---|:---|:---|
| `id` | string | Existing location identifier; unique, lowercase kebab-case |
| `name` | string | Non-empty display name used in alternative text |
| `order` | integer | Existing floor index; unique |
| `gallery` | Gallery Image[] | Must contain exactly three images for every accessible floor |

Locked floors have no location and therefore no gallery content. They remain out of scope.

### Gallery Image (catalog entry)

A single placeholder image entry in a location's `gallery` array.

| Field | Type | Rules |
|:---|:---|:---|
| `src` | string | Non-empty; one of `/panoramas/placeholder/gallery-1.svg`, `gallery-2.svg`, or `gallery-3.svg` |
| `alt` | string | Non-empty; identifies the floor and the placeholder position |
| `caption` | string | Non-empty; displayed below the active image |
| `order` | integer | Unique within the gallery; values `0`, `1`, `2` |

Invariants:

- Every accessible location has exactly three gallery images.
- Orders are contiguous from 0 to 2.
- The three source files are distinct within a floor.
- Alternative text and captions identify the content as a placeholder.
- The catalog remains valid under `validateCatalog` in `apps/frontend/src/lib/catalog.js`.

### Placeholder Asset

A static SVG file under `apps/frontend/public/panoramas/placeholder/`.

| File | Distinguishing feature | Aspect ratio |
|:---|:---|:---|
| `gallery-1.svg` | Blue/teal palette, large "1" | 16:10 |
| `gallery-2.svg` | Amber/orange palette, large "2" | 16:10 |
| `gallery-3.svg` | Violet/pink palette, large "3" | 16:10 |

Each asset includes a `<title>` and `<desc>` for assistive technology and uses only standard SVG shapes and system font families.

### Gallery Viewing State (existing, transient)

The component-level state already held by `RoomGallery` while the Gallery is open.

| Field | Type | Meaning |
|:---|:---|:---|
| `currentIndex` | integer, starting at 0 | Position of the active image |
| `imageCount` | integer | Number of sorted images for the current floor |
| `activeIndex` | integer | `currentIndex` clamped to the valid range |
| `hasMultipleImages` | boolean | True when `imageCount > 1`; controls are shown only then |

State transitions:

| Event | Result |
|:---|:---|
| Gallery opens for a floor | State starts at index 0 because the component is remounted per location |
| Next control or right arrow | `(index + 1) % imageCount` |
| Previous control or left arrow | `(index - 1 + imageCount) % imageCount` |
| Location changes | Gallery closes and the component remounts with the next location's images |
| Image list is empty | Empty-state message is shown and no controls appear |
| Image list has one image | First image is shown and no controls appear |

## Relationships

```text
Floor (location) 1 ─── * Gallery Image
Gallery Image    1 ─── 1 Placeholder Asset (by src)
Gallery Viewing State 1 ─── 1 Floor (current)
```

## Validation Rules

- **VR-001**: `src`, `alt`, and `caption` must be non-empty strings.
- **VR-002**: `order` must be a unique non-negative integer within its gallery.
- **VR-003**: Every accessible location must have exactly three gallery entries.
- **VR-004**: Every `src` must resolve to an existing public asset.
- **VR-005**: Alternative text and captions must state that the image is a placeholder.
- **VR-006**: The catalog must continue to satisfy the existing `validateCatalog` checks.

## Notes

- No database model, API payload, or schema migration is introduced.
- The `src/assets/gallery/<floor>/` override path remains available for real images. If a floor gains real files, those images intentionally replace the catalog placeholders for that floor.
