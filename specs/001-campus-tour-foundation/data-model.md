# Data Model: CIIT Virtual Campus Tour Foundation

**Feature**: `001-campus-tour-foundation`
**Date**: 2026-10-26

## Overview

The foundation uses a static, frontend-owned tour catalog plus transient UI state. No
user-generated data is persisted. The catalog is validated at load time so malformed content
fails with a clear error instead of producing a broken tour.

## Entity: TourCatalog

Represents the complete set of tour content shipped with the frontend.

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `version` | string | Yes | Semantic version of the catalog format, for example `1.0.0`. |
| `defaultLocationId` | string | Yes | MUST match a `locations[].id`. |
| `locations` | Location[] | Yes | MUST contain at least one location. |

**Relationships**: One catalog contains one or more locations.

## Entity: Location

Represents a featured place in the campus tour.

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | string | Yes | Unique within the catalog; lowercase kebab-case, for example `glitch-tower-lobby`. |
| `name` | string | Yes | Non-empty display name. |
| `description` | string | Yes | Non-empty short description used for navigation and context. |
| `order` | integer | Yes | Unique, zero-based display order in the sidebar. |
| `panorama` | PanoramaScene | Yes | The location's 360-degree scene. |
| `gallery` | GalleryImage[] | No | May be empty; when present, images render in `order`. |
| `narration` | Narration | No | When absent, the narration player is hidden. |

**Validation rules**:
- `id` values MUST be unique.
- `order` values MUST be unique.
- Every `panorama.tileUrlTemplate` MUST reference an asset that exists under the frontend public
  directory.
- Every gallery and narration asset path MUST resolve to an existing file.
- A location with no panorama MUST be omitted from the catalog rather than shown as broken.

**Relationships**: One location has one panorama, zero or more gallery images, and zero or one
narration.

## Entity: PanoramaScene

Represents the 360-degree view for a location.

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `tileUrlTemplate` | string | Yes | Root-relative URL containing `{z}`, `{y}`, and `{x}` placeholders. |
| `previewUrl` | string | No | Low-resolution preview shown while tiles load. |
| `initialView` | ViewParameters | Yes | Starting camera direction and zoom. |
| `minFov` | number | Yes | Minimum field of view in radians; MUST be less than `maxFov`. |
| `maxFov` | number | Yes | Maximum field of view in radians. |

**Relationships**: One panorama belongs to exactly one location.

## Entity: ViewParameters

Represents the visitor's initial camera orientation.

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `yaw` | number | Yes | Radians. |
| `pitch` | number | Yes | Radians; clamped to the scene's vertical limits. |
| `fov` | number | Yes | Radians; MUST be within `minFov` and `maxFov`. |

## Entity: GalleryImage

Represents a still image shown for a location.

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `src` | string | Yes | Root-relative or imported asset URL. |
| `alt` | string | Yes | Non-empty description of the image content. |
| `caption` | string | No | Optional visible caption. |
| `order` | integer | Yes | Unique within the location's gallery. |

## Entity: Narration

Represents the narrated description for a location.

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `audioSrc` | string | Yes | Root-relative or imported audio URL. |
| `transcript` | string | Yes | Full narration text; MUST be non-empty. |
| `durationSeconds` | number | No | Positive duration used for display only. |

**Validation rules**: A narration MUST NOT exist without a transcript, satisfying FR-007.

## Transient Entity: TourUiState

Represents visitor-facing state held in `TourContext`. It is not persisted.

| Field | Type | Initial Value | Rules |
| --- | --- | --- | --- |
| `currentLocationId` | string | Catalog `defaultLocationId` | MUST reference an existing location. |
| `sidebarOpen` | boolean | `false` on mobile, `true` on desktop | Toggles the location list. |
| `galleryOpen` | boolean | `false` | Toggles the room gallery. |
| `narrationStatus` | enum | `idle` | One of `idle`, `loading`, `playing`, `paused`, `ended`, `blocked`, `error`. |
| `contentStatus` | enum | `loading` | One of `loading`, `ready`, `error`. |
| `errorMessage` | string or null | `null` | Visitor-friendly message when content fails. |

## Transient Entity: HealthStatus

Represents the backend health response used by the frontend status check.

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `status` | string | Yes | `ok` when the service is healthy. |
| `timestamp` | string | Yes | ISO 8601 timestamp. |

## State Transitions

### Content loading

```text
loading -> ready      (catalog validates and at least one location is available)
loading -> error      (catalog missing, invalid, or no usable locations)
error   -> ready      (visitor retries and content loads)
```

### Narration

```text
idle    -> loading    (visitor selects play)
loading -> playing    (audio starts)
loading -> blocked    (browser blocks playback)
loading -> error      (audio cannot be loaded)
playing -> paused     (visitor selects pause)
paused  -> playing    (visitor selects resume)
playing -> ended      (audio finishes)
ended   -> playing    (visitor selects replay)
```

### Location selection

```text
ready -> loading      (visitor selects a different location)
loading -> ready      (panorama scene is ready)
loading -> error      (scene or assets unavailable)
```

## Persistence

No database persistence is introduced in this foundation. The backend MongoDB connection is
established for future user-data features. The tour catalog is version-controlled JSON and its
media assets are version-controlled static files.
