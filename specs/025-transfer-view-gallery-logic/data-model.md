# Data Model: Gallery Session State Contract

**Feature**: `025-transfer-view-gallery-logic`

## Overview

This feature introduces no new data entities, schemas, or persistence. It transfers existing UI toggle wiring into `FloatingMenu.jsx`. The data model below documents the existing gallery session state shape that `FloatingMenu` receives and manipulates, so the contract is explicit for implementation and testing.

## Entities

### Gallery Session

The gallery session is the open/close state of the room gallery overlay, owned by `Layout` via `TourContext` and passed to `FloatingMenu` as props.

| Field | Type | Source | Description |
|:---|:---|:---|:---|
| `galleryOpen` | `boolean` | `TourContext` state (owned by `Layout`) | Whether the gallery overlay is currently open. |
| `toggleGallery` | `() => void` | `TourContext` callback | Toggles the gallery open/close state. |
| `setGalleryOpen` | `(open: boolean) => void` | `TourContext` callback | Sets the gallery open state explicitly. |

### Gallery Images

Passed from `Layout` to `FloatingMenu` as the `images` prop (already resolved by `Layout` from floor gallery data or per-location gallery data).

| Field | Type | Description |
|:---|:---|:---|
| `src` | `string` | Image source URL. |
| `alt` | `string` | Accessible alternative text. |
| `caption` | `string` | Image caption displayed under the active image. |
| `order` | `number` | Sort order for displaying images. |

### Floating Menu Props (gallery-related)

| Prop | Type | Default | Description |
|:---|:---|:---|:---|
| `open` | `boolean` | `false` | Gallery open state from `Layout`. |
| `onClose` | `() => void` | — | Gallery close handler from `Layout`. |
| `onOpen` | `() => void` | — | Gallery open handler from `Layout` (added by this feature). |
| `images` | `array` | `[]` | Gallery images resolved by `Layout`. |
| `sidebarOpen` | `boolean` | `false` | Sidebar open state, used for mobile hide rule. |
| `floorLabel` | `string` | `""` | Current floor label for the gallery heading. |

## State Transitions

- `closed → opened`: Visitor presses the View Gallery button; `Layout` calls `setGalleryOpen(true)` (or `toggleGallery`) → `FloatingMenu` receives `open={true}` and renders the gallery modal.
- `opened → closed`: Visitor presses the gallery close control, clicks the backdrop, or presses Escape; `Layout` calls `setGalleryOpen(false)` → `FloatingMenu` receives `open={false}` and hides the gallery modal, restoring focus.

## Validation Rules

- The View Gallery button must not reference undefined variables; `open` and `onOpen` must be defined props (FR-002).
- `Panorama.jsx` must not destructure `galleryOpen` or `toggleGallery` (FR-004).
- Gallery open/close behavior must be identical whether triggered by the View Gallery button or any other existing trigger.

## Relationships

- `Layout` owns `galleryOpen`/`toggleGallery`/`setGalleryOpen` from `TourContext`.
- `Layout` passes `open`, `onClose`, `onOpen`, `images`, `sidebarOpen`, `floorLabel` to `FloatingMenu`.
- `FloatingMenu` renders the gallery modal when `open` is true and the View Gallery button calls `onOpen`.
- `Panorama.jsx` no longer participates in gallery state after this feature.
